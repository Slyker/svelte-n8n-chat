import { get, post, postWithFiles } from './generic.js';
import type { ChatOptions, SendMessageResponse, LoadPreviousSessionResponse, StructuredChunk } from '../types/index.js';

export async function loadPreviousSession(sessionId: string, options: ChatOptions) {
	const method = options.webhookConfig?.method === 'POST' ? post : get;
	return await method<LoadPreviousSessionResponse>(
		`${options.webhookUrl}`,
		{
			action: 'loadPreviousSession',
			[options.chatSessionKey as string]: sessionId,
			...(options.metadata ? { metadata: options.metadata } : {}),
		},
		{
			headers: options.webhookConfig?.headers,
		},
	);
}

export async function sendMessage(
	message: string,
	files: File[],
	sessionId: string,
	options: ChatOptions,
): Promise<SendMessageResponse> {
	const response = await (files.length > 0
		? sendWithFiles(message, files, sessionId, options)
		: sendTextOnly(message, sessionId, options));

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Error while sending message. Error: ${errorText}`);
	}

	const responseText = await response.text();
	
	const lines = responseText.split('\n').filter(line => line.trim());
	let combinedText = '';
	
	for (const line of lines) {
		try {
			const chunk = JSON.parse(line) as StructuredChunk;
			if (chunk.type === 'item' && chunk.content) {
				combinedText += chunk.content;
			}
		} catch (error) {
			console.warn('Failed to parse NDJSON line:', line);
		}
	}

	return {
		output: combinedText,
		text: combinedText,
		message: combinedText,
	} as SendMessageResponse;
}

function createLineParser(): TransformStream<Uint8Array, StructuredChunk> {
	let buffer = '';
	const decoder = new TextDecoder();

	return new TransformStream({
		transform(chunk, controller) {
			buffer += decoder.decode(chunk, { stream: true });

			const lines = buffer.split('\n');
			buffer = lines.pop() ?? '';

			for (const line of lines) {
				if (line.trim()) {
					try {
						const parsed = JSON.parse(line) as StructuredChunk;
						controller.enqueue(parsed);
					} catch (error) {
						controller.enqueue({
							type: 'item',
							content: line,
						} as StructuredChunk);
					}
				}
			}
		},

		flush(controller) {
			if (buffer.trim()) {
				try {
					const parsed = JSON.parse(buffer) as StructuredChunk;
					controller.enqueue(parsed);
				} catch (error) {
					controller.enqueue({
						type: 'item',
						content: buffer,
					} as StructuredChunk);
				}
			}
		},
	});
}

export interface StreamingEventHandlers {
	onBeginMessage: (nodeId: string, runIndex?: number) => void;
	onChunk: (chunk: string, nodeId?: string, runIndex?: number) => void;
	onEndMessage: (nodeId: string, runIndex?: number) => void;
}

export async function sendMessageStreaming(
	message: string,
	files: File[],
	sessionId: string,
	options: ChatOptions,
	handlers: StreamingEventHandlers,
): Promise<{ hasReceivedChunks: boolean }> {
	const response = await (files.length > 0
		? sendWithFiles(message, files, sessionId, options)
		: sendTextOnly(message, sessionId, options));

	if (!response.ok) {
		const errorText = await response.text();
		console.error('HTTP error response:', response.status, errorText);
		throw new Error(`Error while sending message. Error: ${errorText}`);
	}

	if (!response.body) {
		throw new Error('Response body is not readable');
	}

	const reader = response.body.pipeThrough(createLineParser()).getReader();
	let hasReceivedChunks = false;

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const nodeId = value.metadata?.nodeId || 'unknown';
			const runIndex = value.metadata?.runIndex;

			switch (value.type) {
				case 'begin':
					handlers.onBeginMessage(nodeId, runIndex);
					break;
				case 'item':
					hasReceivedChunks = true;
					handlers.onChunk(value.content ?? '', nodeId, runIndex);
					break;
				case 'end':
					handlers.onEndMessage(nodeId, runIndex);
					break;
				case 'error':
					hasReceivedChunks = true;
					handlers.onChunk(`Error: ${value.content ?? 'Unknown error'}`, nodeId, runIndex);
					handlers.onEndMessage(nodeId, runIndex);
					break;
			}
		}
	} finally {
		reader.releaseLock();
	}

	return { hasReceivedChunks };
}

async function sendWithFiles(
	message: string,
	files: File[],
	sessionId: string,
	options: ChatOptions,
): Promise<Response> {
	const formData = new FormData();
	formData.append('action', 'sendMessage');
	formData.append(options.chatSessionKey as string, sessionId);
	formData.append(options.chatInputKey as string, message);

	if (options.metadata) {
		formData.append('metadata', JSON.stringify(options.metadata));
	}

	for (const file of files) {
		formData.append('files', file);
	}

	return await fetch(options.webhookUrl, {
		method: 'POST',
		headers: {
			Accept: 'text/plain',
			...options.webhookConfig?.headers,
		},
		body: formData,
	});
}

async function sendTextOnly(
	message: string,
	sessionId: string,
	options: ChatOptions,
): Promise<Response> {
	const body = {
		action: 'sendMessage',
		[options.chatSessionKey as string]: sessionId,
		[options.chatInputKey as string]: message,
		...(options.metadata ? { metadata: options.metadata } : {}),
	};

	return await fetch(options.webhookUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'text/plain',
			...options.webhookConfig?.headers,
		},
		body: JSON.stringify(body),
	});
}

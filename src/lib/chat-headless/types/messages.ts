export interface ChatMessage {
	id: string;
	text?: string;
	sender: 'user' | 'bot';
	files?: File[];
	transparent?: boolean;
	type?: 'text' | 'component';
	key?: string;
	arguments?: Record<string, unknown>;
}

export interface ChatMessageText extends ChatMessage {
	type?: 'text';
	text: string;
}

export interface ChatMessageComponent extends ChatMessage {
	type: 'component';
	key: string;
	arguments: Record<string, unknown>;
}

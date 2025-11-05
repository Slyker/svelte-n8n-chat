export type ChunkType = 'begin' | 'item' | 'end' | 'error';

export interface StructuredChunk {
	type: ChunkType;
	content?: string;
	metadata?: {
		nodeId?: string;
		nodeName?: string;
		timestamp?: number;
		runIndex?: number;
		itemIndex?: number;
	};
}

export interface LoadPreviousSessionResponse {
	data?: Array<{
		id: string[];
		kwargs: {
			content: string;
		};
	}>;
}

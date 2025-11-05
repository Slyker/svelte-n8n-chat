export interface SendMessageResponse {
	output?: string;
	text?: string;
	message?: string;
	executionId?: string;
	executionStarted?: boolean;
	sessionId?: string;
	data?: Array<{
		id: string[];
		kwargs: {
			content: string;
		};
	}>;
}

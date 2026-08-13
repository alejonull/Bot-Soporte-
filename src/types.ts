export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface N8nWebhookPayload {
  sessionId: string;
  mensaje: string;
}

export interface N8nWebhookResponse {
  respuesta: string;
  [key: string]: unknown;
}

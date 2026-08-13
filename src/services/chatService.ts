import { N8nWebhookPayload, N8nWebhookResponse } from '../types';

/**
 * Custom error class for Chat service issues
 */
export class ChatServiceError extends Error {
  constructor(message: string, public rawError?: unknown) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

/**
 * Gets the configured webhook URL from environment variables or local override storage
 */
export function getWebhookUrl(): string {
  // Check runtime/build env variable
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }

  // Fallback check in localStorage for client-side demo testing
  try {
    const localUrl = localStorage.getItem('ccg_custom_webhook_url');
    if (localUrl && localUrl.trim() !== '') {
      return localUrl.trim();
    }
  } catch (err) {
    console.error('Error accediendo a localStorage para webhook url:', err);
  }

  return '';
}

/**
 * Sends a message to the n8n technical support webhook.
 * 
 * @param message Written text message from user
 * @param sessionId Unique session identifier
 * @param overrideUrl Optional custom URL if set via UI
 * @returns Response string from the chatbot
 */
export async function sendChatMessage(
  message: string,
  sessionId: string,
  overrideUrl?: string
): Promise<string> {
  const webhookUrl = overrideUrl?.trim() || getWebhookUrl();

  if (!webhookUrl) {
    console.error('CRÍTICO: No se ha configurado VITE_N8N_WEBHOOK_URL en las variables de entorno.');
    throw new ChatServiceError('No fue posible contactar el servicio de soporte. Inténtalo nuevamente.');
  }

  const payload: N8nWebhookPayload = {
    sessionId: sessionId,
    mensaje: message.trim(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Error HTTP desde el webhook n8n: ${response.status} ${response.statusText}`);
      throw new ChatServiceError('No fue posible contactar el servicio de soporte. Inténtalo nuevamente.');
    }

    const data: unknown = await response.json();

    // Parse n8n response: can be an object { respuesta: "..." } or array [{ respuesta: "..." }]
    let botResponseText = '';

    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0] as N8nWebhookResponse;
      if (typeof firstItem?.respuesta === 'string') {
        botResponseText = firstItem.respuesta;
      }
    } else if (data && typeof data === 'object') {
      const obj = data as N8nWebhookResponse;
      if (typeof obj.respuesta === 'string') {
        botResponseText = obj.respuesta;
      }
    }

    if (!botResponseText || botResponseText.trim() === '') {
      console.error('El webhook de n8n respondió sin el campo esperado "respuesta":', data);
      throw new ChatServiceError('No fue posible contactar el servicio de soporte. Inténtalo nuevamente.');
    }

    return botResponseText.trim();
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }
    console.error('Excepción capturada al comunicarse con n8n:', error);
    throw new ChatServiceError('No fue posible contactar el servicio de soporte. Inténtalo nuevamente.', error);
  }
}

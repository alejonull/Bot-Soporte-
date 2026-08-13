const SESSION_STORAGE_KEY = 'ccg_support_session_id';

/**
 * Generates a unique UUID v4 string.
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves the session ID from localStorage or creates a new unique one.
 */
export function getOrCreateSessionId(): string {
  try {
    const existingSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (existingSessionId && existingSessionId.trim() !== '') {
      return existingSessionId;
    }
  } catch (error) {
    console.error('Error al acceder a localStorage para sessionId:', error);
  }

  const newSessionId = generateUUID();
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  } catch (error) {
    console.error('Error al guardar sessionId en localStorage:', error);
  }
  return newSessionId;
}

/**
 * Resets and generates a new session ID in localStorage.
 */
export function resetSessionId(): string {
  const newSessionId = generateUUID();
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  } catch (error) {
    console.error('Error al reiniciar sessionId en localStorage:', error);
  }
  return newSessionId;
}

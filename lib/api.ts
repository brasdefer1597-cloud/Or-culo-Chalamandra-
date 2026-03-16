import { apiClient } from './apiClient';
import type { ThinkingMethod } from './types';

/**
 * Llama al endpoint de la API para obtener preguntas generadas por IA utilizando el cliente centralizado.
 * @returns Una promesa que se resuelve con un array de preguntas.
 */
export async function fetchGeneratedQuestions(method: ThinkingMethod, context: string, situation: string): Promise<string[]> {
  // El apiClient ya maneja la serialización, headers y la gestión de errores.
  const response = await apiClient.post<{ questions: string[] }>('/api/generate', {
    method,
    context,
    situation,
  });

  return response.questions;
}

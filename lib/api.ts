import type { ThinkingMethod } from './types';

/**
 * Llama al endpoint de la API interna para obtener preguntas generadas por IA.
 * @returns Una promesa que se resuelve con un array de preguntas.
 */
export async function fetchGeneratedQuestions(method: ThinkingMethod, context: string, situation: string): Promise<string[]> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ method, context, situation }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch questions from API');
  }

  const data = await response.json();
  return data.questions;
}

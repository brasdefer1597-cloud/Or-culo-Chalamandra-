import { QUESTION_BANK } from './questionBank';
import type { ThinkingMethod } from './types';

/**
 * Parsea un string con preguntas separadas por saltos de línea a un array de strings.
 */
export function parseQuestionLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length >= 8)
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .slice(0, 7);
}

/**
 * Genera preguntas de respaldo locales como fallback si la API falla.
 */
export function makeFallbackQuestions(method: ThinkingMethod, context: string): string[] {
  const selectedMethod = QUESTION_BANK.find((m) => m.name === method);

  if (!selectedMethod) {
    // Fallback de último recurso si el método no se encuentra.
    return [
      `¿Cuál es el criterio de éxito para "${context}"?`,
      '¿Qué riesgo crítico no estás midiendo?',
      '¿Qué micro-acción en 72h validará tu decisión?'
    ];
  }

  const localQuestions = selectedMethod.questions
    .map((q) => q.text.replace('[contexto]', context));

  if (localQuestions.length) {
    return localQuestions.slice(0, 6);
  }

  // Fallback por si el método no tiene preguntas.
  return [
    `¿Cuál es el criterio de éxito para "${context}"?`,
    '¿Qué riesgo crítico no estás midiendo?',
    '¿Qué micro-acción en 72h validará tu decisión?'
  ];
}

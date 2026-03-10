import { QUESTION_BANK } from '../lib/questionBank';
import { ThinkingMethod, ContextOption } from '../types';

export function parseQuestionLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter((line) => line.length >= 8)
    .filter((line, index, arr) => arr.indexOf(line) === index)
    .slice(0, 7);
}

export function getFallbackQuestions(method: ThinkingMethod, context: ContextOption): string[] {
  const bank = QUESTION_BANK[method];
  const localQuestions = Object.values(bank)
    .flatMap((questions) => questions)
    .map((question) => question.replace('[contexto]', context));

  if (localQuestions.length) {
    return localQuestions.slice(0, 6);
  }

  return [
    `¿Cuál es el criterio de éxito para "${context}"?`,
    '¿Qué riesgo crítico no estás midiendo?',
    '¿Qué micro-acción en 72h validará tu decisión?'
  ];
}

export async function fetchQuestions(params: {
  method: ThinkingMethod;
  context: ContextOption;
  situation: string;
}): Promise<string[]> {
  const response = await fetch('/api/decode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('SERVER_ERROR');
  }

  const data = await response.json();
  const parsed = parseQuestionLines(data.raw || '');

  if (!parsed.length) {
    throw new Error('EMPTY_RESPONSE');
  }

  return parsed;
}

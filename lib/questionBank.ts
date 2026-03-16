import type { ThinkingMethod } from './types';
import questionBank from './questionBank.json';

export const QUESTION_BANK: Record<ThinkingMethod, Record<string, string[]>> = questionBank;

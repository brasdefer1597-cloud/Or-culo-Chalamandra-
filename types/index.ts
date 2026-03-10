export type ThinkingMethod =
  | '6 Sombreros'
  | '5 Porqués'
  | 'Disney'
  | 'Paul-Elder'
  | 'Covey'
  | 'OODA'
  | 'Árbol de decisiones'
  | 'Cynefin';

export type ContextOption =
  | 'Decisión laboral'
  | 'Relación de pareja'
  | 'Parentalidad'
  | 'Ciberseguridad'
  | 'Cliente freelancer'
  | 'Autocuidado/bienestar';

export interface OracleState {
  method: ThinkingMethod | '';
  context: ContextOption | '';
  situation: string;
  questions: string[];
  source: 'gemini' | 'fallback';
  isLoading: boolean;
  queryCount: number;
  methodsUsed: Set<string>;
  clarity: number;
  level: string;
}

export type QuestionBank = Record<string, string[]>;

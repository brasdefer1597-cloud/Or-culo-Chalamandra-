/**
 * Arquitectura modular: Definimos los tipos como los cimientos de una catedral digital.
 */

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

export interface DecodedResult {
  questions: string[];
  method: ThinkingMethod;
  context: ContextOption;
  timestamp: number;
}

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

export interface FavoriteQuestion {
  question_text: string;
  method: string;
  context: string;
  saves: number;
  last_saved_at: string; 
}

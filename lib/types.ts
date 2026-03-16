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

// --- Definiciones Canónicas ---

// Define la estructura de una sola pregunta de ejemplo.
export interface Question {
  id: number;
  text: string;
}

// Define la estructura de un método estratégico completo.
export interface StrategicMethod {
  name: ThinkingMethod;
  description: string;
  questions: Question[];
}

import type { ContextOption, ThinkingMethod } from '@/lib/types';

interface OracleFormProps {
  method: ThinkingMethod | '';
  context: ContextOption | '';
  situation: string;
  isLoading: boolean;
  onMethodChange: (value: ThinkingMethod | '') => void;
  onContextChange: (value: ContextOption | '') => void;
  onSituationChange: (value: string) => void;
  onSubmit: () => void;
}

const methods: ThinkingMethod[] = [
  '6 Sombreros',
  '5 Porqués',
  'Disney',
  'Paul-Elder',
  'Covey',
  'OODA',
  'Árbol de decisiones',
  'Cynefin'
];

const contexts: ContextOption[] = [
  'Decisión laboral',
  'Relación de pareja',
  'Parentalidad',
  'Ciberseguridad',
  'Cliente freelancer',
  'Autocuidado/bienestar'
];

export function OracleForm(props: OracleFormProps) {
  const {
    method,
    context,
    situation,
    isLoading,
    onMethodChange,
    onContextChange,
    onSituationChange,
    onSubmit
  } = props;

  return (
    <section className="card">
      <h2>Elige método y contexto</h2>
      <div className="formGroup">
        <label htmlFor="method">Método de pensamiento</label>
        <select id="method" value={method} onChange={(e) => onMethodChange(e.target.value as ThinkingMethod | '')}>
          <option value="">Selecciona un método</option>
          {methods.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label htmlFor="context">Contexto</label>
        <select id="context" value={context} onChange={(e) => onContextChange(e.target.value as ContextOption | '')}>
          <option value="">Selecciona un contexto</option>
          {contexts.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label htmlFor="situation">Situación</label>
        <textarea
          id="situation"
          value={situation}
          onChange={(e) => onSituationChange(e.target.value)}
          placeholder="Describe tu situación en 1-2 líneas"
        />
      </div>

      <button className="btn btnPrimary" disabled={isLoading} onClick={onSubmit}>
        {isLoading ? 'DECODIFICANDO...' : 'Generar preguntas personalizadas'}
      </button>
    </section>
  );
}

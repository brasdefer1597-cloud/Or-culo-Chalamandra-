import type { ContextOption, ThinkingMethod } from '@/types';

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
      <h2 style={{marginTop: 0}}>Invocación del Sifón</h2>
      <div className="formGroup">
        <label htmlFor="method">⚙️ Filtro de Realidad (Método)</label>
        <select id="method" value={method} onChange={(e) => onMethodChange(e.target.value as ThinkingMethod | '')}>
          <option value="">Selecciona tu lente...</option>
          {methods.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label htmlFor="context">📍 Nodo de Acción (Contexto)</label>
        <select id="context" value={context} onChange={(e) => onContextChange(e.target.value as ContextOption | '')}>
          <option value="">Define el territorio...</option>
          {contexts.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label htmlFor="situation">🧠 Frecuencia de la Situación</label>
        <textarea
          id="situation"
          rows={3}
          value={situation}
          onChange={(e) => onSituationChange(e.target.value)}
          placeholder="Describe el ruido mental que deseas filtrar..."
        />
      </div>

      <button className="btn btnPrimary" style={{width: '100%'}} disabled={isLoading} onClick={onSubmit}>
        {isLoading ? '⌇ DECODIFICANDO FRECUENCIAS ⌇' : 'ACTIVA EL ORÁCULO'}
      </button>
    </section>
  );
}

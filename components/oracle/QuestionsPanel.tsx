interface QuestionsPanelProps {
  questions: string[];
  source: 'gemini' | 'fallback';
}

export function QuestionsPanel({ questions, source }: QuestionsPanelProps) {
  if (!questions.length) return null;

  return (
    <section className="card" style={{borderColor: source === 'fallback' ? 'rgba(255,255,255,0.2)' : 'var(--chalamandra-gold)'}}>
      <h2 style={{marginTop: 0}}>Fragmentos de Verdad</h2>
      <div className="questionsBlock">
        <p className="hatTitle" style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '20px'}}>
          {source === 'fallback'
            ? '✺ PROTOCOLO DE EMERGENCIA ACTIVADO (MODO LOCAL)'
            : '✺ TRANSMISIÓN DE ALTA FIDELIDAD (GEMINI 1.5 FLASH)'}
        </p>
        <ul className="questionsList">
          {questions.map((question, i) => (
            <li key={i} style={{animation: `fadeIn 0.5s ease forwards ${i * 0.1}s`, opacity: 0}}>
              {question}
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

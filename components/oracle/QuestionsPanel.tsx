interface QuestionsPanelProps {
  questions: string[];
  source: 'gemini' | 'fallback';
}

/**
 * Las respuestas son el tesoro al final del laberinto.
 */
export function QuestionsPanel({ questions, source }: QuestionsPanelProps) {
  if (!questions.length) return null;

  return (
    <section className="card" style={{ animation: 'glitch 0.5s ease' }}>
      <h2 style={{ fontSize: '1.2rem', color: 'var(--chalamandra-gold)' }}>DECODIFICACIÓN FINALIZADA</h2>
      <div className="questionsBlock">
        <p className="hatTitle">
          {source === 'fallback' ? 'Transmisión Táctica (Modo Respaldo)' : 'Sintonía de Chalamandra Magistral'}
        </p>
        <ul className="questionsList">
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </div>
      {source === 'fallback' && (
        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '16px' }}>
          * Nota: La Red Global estaba saturada; se han usado tótems locales para tu guía.
        </p>
      )}
    </section>
  );
}

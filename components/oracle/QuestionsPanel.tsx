interface QuestionsPanelProps {
  questions: string[];
  source: 'gemini' | 'fallback';
}

export function QuestionsPanel({ questions, source }: QuestionsPanelProps) {
  if (!questions.length) return null;

  return (
    <section className="card">
      <h2>Tus preguntas personalizadas</h2>
      <div className="questionsBlock">
        <p className="hatTitle">
          {source === 'fallback' ? 'Decodificación estratégica (modo respaldo)' : 'Decodificación estratégica'}
        </p>
        <ul className="questionsList">
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

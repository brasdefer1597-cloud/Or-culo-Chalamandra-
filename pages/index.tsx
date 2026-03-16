import Head from 'next/head';
import { useMemo, useState } from 'react';
import { CtaSection } from '@/components/cta/CtaSection';
import { OracleForm } from '@/components/forms/OracleForm';
import { Header } from '@/components/layout/Header';
import { QuestionsPanel } from '@/components/oracle/QuestionsPanel';
import { makeFallbackQuestions } from '@/lib/oracleService';
import { fetchGeneratedQuestions } from '@/lib/api';
import type { ContextOption, ThinkingMethod } from '@/lib/types';

const CLARITY_MILESTONE = 3;

export default function HomePage() {
  const [method, setMethod] = useState<ThinkingMethod | ''>('');
  const [context, setContext] = useState<ContextOption | ''>('');
  const [situation, setSituation] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [source, setSource] = useState<'gemini' | 'fallback'>('fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryCount, setQueryCount] = useState(0);
  const [methodsUsed, setMethodsUsed] = useState<Set<string>>(new Set());

  const level = methodsUsed.size >= 3 ? 'Estratega' : 'Iniciado';
  const clarity = useMemo(() => Math.min(100, Math.round((queryCount / CLARITY_MILESTONE) * 100)), [queryCount]);

  const handleSubmit = async () => {
    if (!method || !context || situation.trim().length < 15) {
      setError('Por favor, completa todos los campos. La situación debe tener al menos 15 caracteres.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generated = await fetchGeneratedQuestions(method, context, situation.trim());
      setQuestions(generated);
      setSource('gemini');
    } catch (apiError) {
      console.error('API Error:', apiError);
      setQuestions(makeFallbackQuestions(method, context));
      setSource('fallback');
      setError('No se pudieron generar las preguntas. Usando preguntas de respaldo.');
    } finally {
      setQueryCount((value) => value + 1);
      setMethodsUsed((prev) => new Set(prev).add(method));
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>El Oráculo de Chalamandra</title>
        <meta
          name="description"
          content="Herramienta interactiva para decodificar decisiones complejas con marcos de pensamiento estratégico."
        />
      </Head>
      <main className="container">
        <Header clarity={clarity} level={level} />
        <OracleForm
          method={method}
          context={context}
          situation={situation}
          isLoading={isLoading}
          error={error} // Pasar el error al formulario
          onMethodChange={setMethod}
          onContextChange={setContext}
          onSituationChange={setSituation}
          onSubmit={handleSubmit}
        />
        <QuestionsPanel 
          questions={questions} 
          source={source} 
          method={method}
          context={context}
        />
        {questions.length > 0 && <CtaSection />}
      </main>
    </>
  );
}

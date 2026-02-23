import Head from 'next/head';
import { useMemo, useRef, useState } from 'react';
import { CtaSection } from '@/components/cta/CtaSection';
import { OracleForm } from '@/components/forms/OracleForm';
import { Header } from '@/components/layout/Header';
import { QuestionsPanel } from '@/components/oracle/QuestionsPanel';
import { fetchGeminiQuestions, makeFallbackQuestions } from '@/lib/oracleService';
import type { ContextOption, ThinkingMethod } from '@/lib/types';

const clarityMilestone = 3;

export default function HomePage() {
  const [method, setMethod] = useState<ThinkingMethod | ''>('');
  const [context, setContext] = useState<ContextOption | ''>('');
  const [situation, setSituation] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [source, setSource] = useState<'gemini' | 'fallback'>('fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [methodsUsed, setMethodsUsed] = useState<Set<string>>(new Set());
  const controllerRef = useRef<AbortController | null>(null);

  const level = methodsUsed.size >= 3 ? 'Estratega' : 'Iniciado';
  const clarity = useMemo(() => Math.min(100, Math.round((queryCount / clarityMilestone) * 100)), [queryCount]);

  const handleSubmit = async () => {
    if (!method || !context || situation.trim().length < 15) {
      window.alert('Completa método, contexto y una situación de al menos 15 caracteres.');
      return;
    }

    setIsLoading(true);

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const generated = await fetchGeminiQuestions({
        method,
        context,
        situation: situation.trim(),
        signal: controllerRef.current.signal
      });
      setQuestions(generated);
      setSource('gemini');
    } catch {
      setQuestions(makeFallbackQuestions(method, context));
      setSource('fallback');
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
          onMethodChange={setMethod}
          onContextChange={setContext}
          onSituationChange={setSituation}
          onSubmit={handleSubmit}
        />
        <QuestionsPanel questions={questions} source={source} />
        {questions.length > 0 && <CtaSection />}
      </main>
    </>
  );
}

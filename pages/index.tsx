import Head from 'next/head';
import { useMemo, useRef, useState, useEffect } from 'react';
import { CtaSection } from '@/components/cta/CtaSection';
import { OracleForm } from '@/components/forms/OracleForm';
import { Header } from '@/components/layout/Header';
import { QuestionsPanel } from '@/components/oracle/QuestionsPanel';
import { fetchGeminiQuestions, makeFallbackQuestions } from '@/lib/oracleService';
import type { ContextOption, ThinkingMethod } from '@/lib/types';

const clarityMilestone = 5;

const LOADING_MESSAGES = [
  "Invocando algoritmos ancestrales...",
  "Sintonizando frecuencias de Chalamandra...",
  "Decodificando el caos en patrones...",
  "Abriendo portales de claridad estratégica...",
  "Filtrando ruidos, destilando esencia..."
];

export default function HomePage() {
  const [method, setMethod] = useState<ThinkingMethod | ''>('');
  const [context, setContext] = useState<ContextOption | ''>('');
  const [situation, setSituation] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [source, setSource] = useState<'gemini' | 'fallback'>('fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [queryCount, setQueryCount] = useState(0);
  const [methodsUsed, setMethodsUsed] = useState<Set<string>>(new Set());
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const level = useMemo(() => {
    const size = methodsUsed.size;
    if (size >= 5) return 'Maestro de Sifones';
    if (size >= 3) return 'Estratega';
    if (size >= 1) return 'Iniciado';
    return 'Neófito';
  }, [methodsUsed]);

  const clarity = useMemo(() => Math.min(100, Math.round((queryCount / clarityMilestone) * 100)), [queryCount]);

  const handleSubmit = async () => {
    if (!method || !context || situation.trim().length < 15) {
      window.alert('El Oráculo requiere: método, contexto y una descripción de al menos 15 caracteres para sintonizar.');
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
    } catch (err) {
      console.error("Gemini failed, using tactical backup:", err);
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
        <title>Chalamandra Magistral | Decodificadora SRAP</title>
        <meta
          name="description"
          content="Herramienta táctica de Chalamandra Magistral para decodificar decisiones complejas mediante el flujo SRAP."
        />
      </Head>
      <main className="container">
        <Header clarity={clarity} level={level} />
        <OracleForm
          method={method}
          context={context}
          situation={situation}
          isLoading={isLoading}
          loadingMessage={loadingMsg}
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

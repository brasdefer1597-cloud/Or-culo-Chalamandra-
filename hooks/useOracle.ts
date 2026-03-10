import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchOracleDecoding, makeFallbackQuestions } from '@/services/oracleService';
import type { ContextOption, ThinkingMethod } from '@/types';

const clarityMilestone = 5;

const LOADING_MESSAGES = [
  "Invocando algoritmos ancestrales...",
  "Sintonizando frecuencias de Chalamandra...",
  "Decodificando el caos en patrones...",
  "Abriendo portales de claridad estratégica...",
  "Filtrando ruidos, destilando esencia..."
];

export function useOracle() {
  const [method, setMethod] = useState<ThinkingMethod | ''>('');
  const [context, setContext] = useState<ContextOption | ''>('');
  const [situation, setSituation] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [source, setSource] = useState<'deepseek' | 'fallback'>('fallback');
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
      const generated = await fetchOracleDecoding({
        method,
        context,
        situation: situation.trim(),
        signal: controllerRef.current.signal
      });
      setQuestions(generated);
      setSource('deepseek');
    } catch (err) {
      console.error("DeepSeek failed, using tactical backup:", err);
      setQuestions(makeFallbackQuestions(method, context));
      setSource('fallback');
    } finally {
      setQueryCount((value) => value + 1);
      setMethodsUsed((prev) => new Set(prev).add(method));
      setIsLoading(false);
    }
  };

  return {
    method,
    setMethod,
    context,
    setContext,
    situation,
    setSituation,
    questions,
    source,
    isLoading,
    loadingMsg,
    level,
    clarity,
    handleSubmit
  };
}

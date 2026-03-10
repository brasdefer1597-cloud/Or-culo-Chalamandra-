import { useState, useMemo, useCallback } from 'react';
import { ThinkingMethod, ContextOption } from '../types';
import { fetchQuestions, getFallbackQuestions } from '../services/oracleService';

const CLARITY_MILESTONE = 3;

export function useOracle() {
  const [method, setMethod] = useState<ThinkingMethod | ''>('');
  const [context, setContext] = useState<ContextOption | ''>('');
  const [situation, setSituation] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [source, setSource] = useState<'gemini' | 'fallback'>('fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [methodsUsed, setMethodsUsed] = useState<Set<string>>(new Set());

  const level = useMemo(() => {
    if (methodsUsed.size >= 5) return 'Maestro de Sifones';
    if (methodsUsed.size >= 3) return 'Estratega';
    return 'Neófito';
  }, [methodsUsed.size]);

  const clarity = useMemo(() =>
    Math.min(100, Math.round((queryCount / CLARITY_MILESTONE) * 100)),
  [queryCount]);

  const submitQuery = useCallback(async () => {
    if (!method || !context || situation.trim().length < 15) {
      throw new Error('VALIDATION_ERROR');
    }

    setIsLoading(true);

    try {
      const generated = await fetchQuestions({
        method,
        context,
        situation: situation.trim()
      });
      setQuestions(generated);
      setSource('gemini');
    } catch (error) {
      console.error('Oracle fetch error, using fallback:', error);
      setQuestions(getFallbackQuestions(method as ThinkingMethod, context as ContextOption));
      setSource('fallback');
    } finally {
      setQueryCount((prev) => prev + 1);
      setMethodsUsed((prev) => new Set(prev).add(method));
      setIsLoading(false);
    }
  }, [method, context, situation]);

  return {
    method, setMethod,
    context, setContext,
    situation, setSituation,
    questions,
    source,
    isLoading,
    queryCount,
    level,
    clarity,
    submitQuery
  };
}

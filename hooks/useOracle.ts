import { useState, useCallback } from 'react';
import { StrategicMethod } from '../lib/types'; // Importación centralizada
import { apiClient } from '../lib/apiClient';

// La definición local de StrategicMethod ha sido eliminada.

export const useOracle = (initialMethods: StrategicMethod[]) => {
  const [selectedMethod, setSelectedMethod] = useState<StrategicMethod | null>(
    initialMethods.length > 0 ? initialMethods[0] : null
  );
  // El estado de las preguntas generadas sigue siendo string[], ya que es lo que devuelve la API.
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!selectedMethod) {
      setError('Por favor, selecciona un método estratégico.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedQuestions([]);

    try {
      // La API devuelve un array de strings, lo cual es correcto.
      const data = await apiClient.post<{ questions: string[] }>('/api/generate', {
        method: selectedMethod.name,
      });
      setGeneratedQuestions(data.questions);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al generar las preguntas.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMethod]);

  return {
    selectedMethod,
    setSelectedMethod,
    generatedQuestions,
    isLoading,
    error,
    handleGenerate,
  };
};

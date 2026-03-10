import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { OracleForm } from '@/components/forms/OracleForm';
import { QuestionsPanel } from '@/components/oracle/QuestionsPanel';
import { CtaSection } from '@/components/cta/CtaSection';
import { useOracle } from '@/hooks/useOracle';

export default function HomePage() {
  const {
    method, setMethod,
    context, setContext,
    situation, setSituation,
    questions,
    source,
    isLoading,
    level,
    clarity,
    submitQuery
  } = useOracle();

  const handleSubmit = async () => {
    try {
      await submitQuery();
    } catch (err) {
      if (err instanceof Error && err.message === 'VALIDATION_ERROR') {
        window.alert('Completa método, contexto y una situación de al menos 15 caracteres.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>El Oráculo de Chalamandra | Decodificadora Magistral</title>
        <meta
          name="description"
          content="Sifón de sabiduría estratégica para decisiones complejas. Identidad Chalamandra Magistral."
        />
      </Head>
      <main className="container">
        <Header clarity={clarity} level={level} />
        <div className="oracle-container">
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
        </div>
      </main>
    </>
  );
}

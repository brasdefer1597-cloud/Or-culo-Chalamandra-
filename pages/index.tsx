import Head from 'next/head';
import { CtaSection } from '@/components/cta/CtaSection';
import { OracleForm } from '@/components/forms/OracleForm';
import { Header } from '@/components/layout/Header';
import { QuestionsPanel } from '@/components/oracle/QuestionsPanel';
import { useOracle } from '@/hooks/useOracle';

export default function HomePage() {
  const {
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
  } = useOracle();

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

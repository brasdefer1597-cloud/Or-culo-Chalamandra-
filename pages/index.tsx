import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { QUESTION_BANK } from '../lib/questionBank';
import { useOracle } from '../hooks/useOracle';
import { Header } from '../components/layout/Header';
import { MethodSelector } from '../components/forms/MethodSelector'; // Importación corregida
import { QuestionsPanel } from '../components/oracle/QuestionsPanel';
import { Footer } from '../components/layout/Footer';
import { StrategicMethod } from '../lib/types';

interface HomeProps {
  methods: StrategicMethod[];
}

const Home: NextPage<HomeProps> = ({ methods }) => {
  const {
    selectedMethod,
    setSelectedMethod,
    generatedQuestions,
    isLoading,
    error,
    handleGenerate,
  } = useOracle(methods);

  const initialClarity = 0;
  const initialLevel = "Explorador";

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      <Head>
        <title>Oráculo Chalamandra</title>
        <meta name="description" content="Generador de preguntas estratégicas con IA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header clarity={initialClarity} level={initialLevel} />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <p className="text-center text-lg md:text-xl text-gray-400 mb-8 max-w-3xl">
          Selecciona un modelo estratégico y presiona &quot;Generar&quot; para que la IA cree 5 nuevas preguntas poderosas para tu situación específica.
        </p>

        {methods.length > 0 && selectedMethod && (
          <MethodSelector
            methods={methods}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        )}

        <button
          onClick={handleGenerate}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-700 disabled:cursor-not-allowed shadow-lg my-8"
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : 'Generar Preguntas'}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}

        <QuestionsPanel questions={generatedQuestions} />
      </main>

      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      methods: QUESTION_BANK,
    },
  };
};

export default Home;

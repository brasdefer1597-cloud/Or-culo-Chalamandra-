import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { QUESTION_BANK } from '../lib/questionBank';
import { useOracle } from '../hooks/useOracle';
import { Header } from '../components/layout/Header';
import { MethodSelector } from '../components/forms/MethodSelector';
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

  const initialClarity = generatedQuestions.length > 0 ? 50 : 10;
  const initialLevel = generatedQuestions.length > 0 ? "Iniciado de Sifones" : "Explorador";

  // Estructura de datos JSON-LD para SEO y rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Oráculo Chalamandra',
    'url': 'https://oraculo-chalamandra.vercel.app/',
    'description': 'Plataforma estratégica para decodificación de decisiones complejas utilizando modelos mentales e inteligencia artificial.',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'All',
    'author': {
      '@type': 'Organization',
      'name': 'Chalamandra Magistral'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans selection:bg-purple-500 selection:text-white">
      <Head>
        <title>Oráculo Chalamandra | Decodificación Estratégica con IA</title>
        <meta name="description" content="Decodifica tus decisiones complejas con un arsenal de modelos mentales estratégicos e Inteligencia Artificial." />
        <meta name="keywords" content="modelos mentales, decisiones complejas, estrategia, inteligencia artificial, 6 sombreros, 5 porqués, scamper, disney, eisenhower" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Oráculo Chalamandra | Decodificación Estratégica" />
        <meta property="og:description" content="Decodifica decisiones complejas guiado por modelos mentales de élite e inteligencia artificial." />
        <meta property="og:url" content="https://oraculo-chalamandra.vercel.app/" />
        <meta property="og:image" content="https://oraculo-chalamandra.vercel.app/og-image.png" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Oráculo Chalamandra | Decodificación Estratégica" />
        <meta name="twitter:description" content="Transforma incertidumbre en claridad con marcos de pensamiento estructurados e IA." />

        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Header clarity={initialClarity} level={initialLevel} />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center max-w-4xl">
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-amber-300 mb-4">
            Oráculo Chalamandra
          </h1>
          <p className="text-center text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            Selecciona un modelo estratégico y presiona <span className="text-purple-400 font-semibold">&quot;Generar&quot;</span> para que la IA cree 5 preguntas poderosas adapadas a tu situación.
          </p>
        </section>

        {methods.length > 0 && selectedMethod && (
          <div className="w-full flex flex-col items-center gap-4 bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl mb-6">
            <MethodSelector
              methods={methods}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
            {selectedMethod.description && (
              <p className="text-sm text-gray-400 italic text-center max-w-lg mt-1">
                &ldquo;{selectedMethod.description}&rdquo;
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-10 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30 my-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sintonizando Oráculo...
            </span>
          ) : (
            '🔮 Generar Preguntas Estratégicas'
          )}
        </button>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 px-4 py-3 rounded-xl mt-4 text-center max-w-md">
            ⚠️ Error: {error}
          </div>
        )}

        <div className="w-full mt-6">
          <QuestionsPanel
            questions={generatedQuestions}
            source="gemini"
            method={selectedMethod?.name || '6 Sombreros'}
            context="Decisión laboral"
          />
        </div>
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

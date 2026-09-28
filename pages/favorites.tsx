import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import type { FavoriteQuestion } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<FavoriteQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setFavorites(data.favorites || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error desconocido.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      <Head>
        <title>Preguntas Guardadas | Oráculo Chalamandra</title>
        <meta name="description" content="Accede a tu repositorio personal de preguntas estratégicas y reflexiones guardadas en el Oráculo Chalamandra." />
        <meta name="keywords" content="preguntas guardadas, biblioteca de decisiones, modelos mentales, favoritos, oraculo chalamandra" />
        <meta property="og:title" content="Colección de Preguntas Estratégicas Guardadas" />
        <meta property="og:description" content="Revisa tu colección personal de decisiones y preguntas clave para la resolución de problemas." />
        <link rel="canonical" href="https://oraculo-chalamandra.vercel.app/favorites" />
      </Head>

      <Header clarity={100} level="Maestro de Archivos" />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center max-w-4xl">
        <div className="w-full bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/60 p-6 md:p-8 shadow-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mb-6 border-b border-gray-700 pb-4">
            📚 Tus Preguntas Guardadas
          </h1>

          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-purple-400">
              <svg className="animate-spin h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Cargando tus joyas estratégicas...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 px-4 py-3 rounded-xl mb-6">
              ⚠️ Error al cargar: {error}
            </div>
          )}

          {!loading && !error && favorites.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-4">No tienes preguntas guardadas aún.</p>
              <p className="text-sm text-gray-500">Vuelve al Oráculo y marca como favoritas las preguntas que te resulten más valiosas.</p>
            </div>
          )}

          {!loading && favorites.length > 0 && (
            <ul className="space-y-4 mb-8">
              {favorites.map((fav, index) => (
                <li key={index} className="bg-gray-900/80 rounded-xl p-4 border border-gray-700/80 hover:border-purple-500/50 transition duration-200">
                  <p className="text-lg font-medium text-gray-100 mb-3">{fav.question_text}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="bg-purple-900/50 text-purple-300 px-2.5 py-1 rounded-full border border-purple-700/40">
                      <strong>Método:</strong> {fav.method}
                    </span>
                    <span className="bg-indigo-900/50 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-700/40">
                      <strong>Contexto:</strong> {fav.context}
                    </span>
                    <span className="bg-amber-900/30 text-amber-300 px-2.5 py-1 rounded-full border border-amber-700/30" title={`Guardada por última vez el ${new Date(fav.last_saved_at).toLocaleString()}`}>
                      ⭐ {fav.saves} guardado(s)
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 pt-4 border-t border-gray-700/60 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-6 rounded-full transition duration-200">
              ← Volver al Oráculo
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;

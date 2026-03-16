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
        setFavorites(data.favorites);
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
    <>
      <Head>
        <title>Preguntas Guardadas - Oráculo de Chalamandra</title>
        <meta name="description" content="Accede a tu colección personal de preguntas estratégicas guardadas. Revisa y reutiliza la sabiduría que has acumulado con el Oráculo de Chalamandra." />
      </Head>
      <div className="container">
        <Header clarity={100} level="Maestro de Archivos" />

        <main className="main-content">
          <div className="card favorites-card">
            <h2>Tus Preguntas Guardadas</h2>
            
            {loading && <p>Cargando tus joyas guardadas...</p>}
            {error && <p className="error-message">Error al cargar: {error}</p>}

            {!loading && !error && favorites.length === 0 && (
              <p>No tienes preguntas guardadas. Vuelve al Oráculo y guarda las preguntas que consideres más valiosas.</p>
            )}

            {!loading && favorites.length > 0 && (
              <ul className="favorites-list">
                {favorites.map((fav, index) => (
                  <li key={index} className="favorite-item">
                    <p className="question-text">{fav.question_text}</p>
                    <div className="meta-info">
                      <span><strong>Método:</strong> {fav.method}</span>
                      <span><strong>Contexto:</strong> {fav.context}</span>
                      <span title={`Guardada por última vez el ${new Date(fav.last_saved_at).toLocaleString()}`}><strong>Guardados:</strong> {fav.saves}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="back-link-container">
              <Link href="/" className="back-link">Volver al Oráculo</Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FavoritesPage;

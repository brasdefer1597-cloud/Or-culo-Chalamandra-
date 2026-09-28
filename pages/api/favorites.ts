import type { NextApiRequest, NextApiResponse } from 'next';
import { FavoriteQuestion } from '../../lib/types';

// Almacenamiento temporal en memoria para favoritos en entorno serverless/demo
const favoritesStore: FavoriteQuestion[] = [
  {
    question_text: 'Sombrero Negro (Riesgos): ¿Cuál es el peor escenario posible y cómo podemos mitigarlo?',
    method: '6 Sombreros',
    context: 'Decisión laboral',
    saves: 3,
    last_saved_at: new Date().toISOString(),
  },
  {
    question_text: 'El Soñador: Si no hubiera límites, ¿cuál sería la visión más ambiciosa para este proyecto?',
    method: 'Disney',
    context: 'Cliente freelancer',
    saves: 5,
    last_saved_at: new Date().toISOString(),
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ favorites: favoritesStore });
  }

  if (req.method === 'POST') {
    const { question, method, context } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'La pregunta es requerida.' });
    }

    const existingIndex = favoritesStore.findIndex((f) => f.question_text === question);
    if (existingIndex > -1) {
      favoritesStore[existingIndex].saves += 1;
      favoritesStore[existingIndex].last_saved_at = new Date().toISOString();
    } else {
      favoritesStore.push({
        question_text: question,
        method: method || 'Desconocido',
        context: context || 'General',
        saves: 1,
        last_saved_at: new Date().toISOString(),
      });
    }

    return res.status(200).json({ message: 'Pregunta guardada en favoritos.', favorites: favoritesStore });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

import { sql } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function createQuestionHash(question: string, method: string, context: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(question + method + context);
  return hash.digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question, method, context, saved } = req.body;

  if (!question || !method || !context || saved === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const questionHash = createQuestionHash(question, method, context);
  const savesIncrement = saved ? 1 : -1;

  try {
    const upsertQuery = `
      INSERT INTO chalamandra_feedback 
        (question_hash, question_text, method, context, saves, last_saved_at)
      VALUES 
        ($1, $2, $3, $4, 1, NOW())
      ON CONFLICT (question_hash) 
      DO UPDATE SET 
        saves = chalamandra_feedback.saves + $5,
        last_saved_at = CASE WHEN $5 > 0 THEN NOW() ELSE chalamandra_feedback.last_saved_at END;
    `;

    await sql(upsertQuery, [questionHash, question, method, context, savesIncrement]);

    res.status(200).json({ success: true, message: 'Feedback registrado.' });

  } catch (error) {
    console.error('Error al registrar feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor.';
    res.status(500).json({ error: 'Error al conectar con la base de datos.', details: errorMessage });
  }
}

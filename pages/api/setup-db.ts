import { sql } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';

// IMPORTANTE:
// Para que esto funcione, la variable de entorno DATABASE_URL debe estar configurada
// en tu proyecto de Vercel con la cadena de conexión de Neon.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Usamos 'crypto' para crear un hash simple para el texto de la pregunta
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS chalamandra_feedback (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        question_hash TEXT UNIQUE NOT NULL,
        question_text TEXT NOT NULL,
        method TEXT NOT NULL,
        context TEXT NOT NULL,
        saves INTEGER DEFAULT 0 NOT NULL,
        impressions INTEGER DEFAULT 1 NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_saved_at TIMESTAMPTZ
      );
    `;
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await sql.query(createTableQuery);

    res.status(200).json({ success: true, message: 'Tabla 'chalamandra_feedback' creada o ya existente.' });

  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor al configurar la base de datos.' });
  }
}

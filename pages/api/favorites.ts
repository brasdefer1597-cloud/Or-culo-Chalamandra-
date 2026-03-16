
import { neon } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const rows = await sql`
      SELECT question_text, method, context, saves, last_saved_at
      FROM chalamandra_feedback
      WHERE saves > 0
      ORDER BY last_saved_at DESC;
    `;
    
    res.status(200).json({ favorites: rows });

  } catch (error) {
    console.error("Error fetching favorites:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error.';
    res.status(500).json({ error: 'Failed to connect to the database.', details: errorMessage });
  }
}

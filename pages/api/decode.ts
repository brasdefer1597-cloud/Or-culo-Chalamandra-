import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_MODEL = 'gemini-1.5-flash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { method, context, situation } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: 'Eres la Sabiduría de Chalamandra: guía estratégica, clara y accionable. Entrega solo preguntas de alto impacto en formato de lista.'
              }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Método: ${method}\nContexto: ${context}\nSituación: ${situation}`
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    res.status(200).json({ raw });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { parseQuestionLines } from '@/services/oracleService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { method, context, situation } = req.body;
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'DeepSeek API key not configured on server' });
  }

  const systemPrompt = `Eres Chalamandra Magistral (Decodificadora Chola Malandra Fresa Salamandra).
Tu misión es aplicar la metodología SRAP (Sense, Track, Arrange, Project) para transformar dudas en claridad estratégica.
Usa un tono senior, directo, táctico y extremadamente útil.
Entrega exactamente 6 preguntas de alto impacto basadas en el método ${method} y el contexto ${context}.
Evita introducciones, ve directo a las preguntas.`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Situación actual: ${situation}. Necesito decodificación mediante ${method} en el marco de ${context}.` }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return res.status(response.status).json({ error: 'DeepSeek API failure' });
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    const parsed = parseQuestionLines(raw);

    if (!parsed.length) {
      return res.status(500).json({ error: 'Empty decoding from AI' });
    }

    return res.status(200).json({ questions: parsed });
  } catch (err) {
    console.error('Server-side decoding error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

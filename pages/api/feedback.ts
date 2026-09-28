import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { question, method, context, saved } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'Se requiere la pregunta para registrar el feedback.' });
  }

  // Se registra el evento en logs para monitoreo/analytics interno
  console.log(`[Feedback Registered] Question: "${question}" | Method: ${method} | Context: ${context} | Saved: ${saved}`);

  return res.status(200).json({
    success: true,
    message: saved ? 'Feedback registrado: pregunta marcada como valiosa.' : 'Feedback registrado: marca removida.',
    data: { question, method, context, saved, timestamp: new Date().toISOString() }
  });
}

import { sql } from '@neondatabase/serverless';
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import crypto from 'crypto';

const CHALAMANDRA_SYSTEM_INSTRUCTION = 'Eres la Sabiduría de Chalamandra: guía estratégica, clara y accionable. Entrega solo preguntas de alto impacto.';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// --- Helper Functions ---

async function getTopRatedQuestions(method: string, context: string): Promise<string[]> {
  try {
    const query = `
      SELECT question_text 
      FROM chalamandra_feedback
      WHERE method = $1 AND context = $2 AND saves > 0
      ORDER BY saves DESC, last_saved_at DESC
      LIMIT 3;
    `;
    const { rows } = await sql.query(query, [method, context]);
    return rows.map((r: { question_text: string }) => r.question_text);
  } catch (error) {
    console.error("Error fetching top rated questions:", error);
    return []; // Si falla, continuamos sin ejemplos
  }
}

function createQuestionHash(question: string, method: string, context: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(question + method + context);
  return hash.digest('hex');
}

// "Fire-and-forget" para no retrasar la respuesta al usuario.
async function updateImpressions(questions: string[], method: string, context: string) {
  if (questions.length === 0) return;

  const hashes = questions.map(q => createQuestionHash(q, method, context));
  
  try {
    const query = `
      UPDATE chalamandra_feedback
      SET impressions = impressions + 1
      WHERE question_hash = ANY($1::text[]);
    `;
    await sql(query, [hashes]);
    console.log(`Updated impressions for ${hashes.length} questions.`);
  } catch (error) {
    console.error("Error updating impressions:", error);
  }
}

// --- API Handler ---

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { method, context, situation } = req.body;

  if (!method || !context || !situation) {
    return res.status(400).json({ error: 'Missing required fields: method, context, or situation' });
  }

  // 1. OBTENER PREGUNTAS DE ALTO RENDIMIENTO (FEEDBACK LOOP)
  const topQuestions = await getTopRatedQuestions(method, context);
  let examplesSection = '';
  if (topQuestions.length > 0) {
    const exampleList = topQuestions.map(q => `- ${q}`).join('\n');
    examplesSection = `--- \
Ejemplos de preguntas excelentes previamente guardadas por usuarios: \
${exampleList} \
--- \
`;
  }

  try {
    // 2. CONSTRUIR Y EJECUTAR EL PROMPT ENRIQUECIDO
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      ${examplesSection}
      Método: ${method}\
      Contexto: ${context}\
      Situación: ${situation}\
      \
      Genera 5 preguntas poderosas basadas en esto.
    `;

    const result = await model.generateContent([CHALAMANDRA_SYSTEM_INSTRUCTION, prompt]);
    const response = await result.response;
    const text = response.text();

    const generatedQuestions = text.split('\n').map(q => q.replace(/^\d+\.\s*/, '').trim()).filter(q => q.length > 0);

    // 3. REGISTRAR IMPRESIONES (ASÍNCRONO)
    // No esperamos a que termine para no penalizar la latencia.
    updateImpressions(generatedQuestions, method, context);

    res.status(200).json({ questions: generatedQuestions, source: 'gemini' });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate questions';
    res.status(500).json({ error: errorMessage });
  }
}

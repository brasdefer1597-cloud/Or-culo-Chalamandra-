import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { questionBank } from '../../lib/questionBank';
import { Question } from '../../lib/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Cache para el modelo generativo
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { method } = req.body;

  if (typeof method !== 'string') {
    return res.status(400).json({ message: 'El parámetro "method" debe ser un string.' });
  }

  const selectedMethod = questionBank.find((m) => m.name === method);

  if (!selectedMethod) {
    return res.status(404).json({ message: `Método "${method}" no encontrado.` });
  }

  try {
    const prompt = `Actúa como un estratega de élite y genera una lista de 5 preguntas únicas y poderosas basadas en el método "${selectedMethod.name}".
    Descripción del método: ${selectedMethod.description}.
    Las preguntas deben ser concisas, provocadoras y directamente aplicables para resolver un problema complejo.
    NO repitas las preguntas de ejemplo. Sé creativo y genera variaciones completamente nuevas.
    Ejemplos (para que no los repitas): ${JSON.stringify(selectedMethod.questions)}
    Formato de salida: solo un array JSON de 5 strings. Ejemplo: ["pregunta 1", "pregunta 2", ...].`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpieza y parseo de la respuesta para asegurar que es un JSON válido.
    let questionsArray: string[];
    try {
        // Intenta encontrar un array JSON dentro del texto, que a veces viene con markdown
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("No se encontró un array JSON en la respuesta de la IA.");
        }
        questionsArray = JSON.parse(jsonMatch[0]);

        if (!Array.isArray(questionsArray) || !questionsArray.every(q => typeof q === 'string')) {
            throw new Error('El formato del array de preguntas no es válido.');
        }

    } catch (e) {
        console.error("Error al parsear la respuesta de la IA:", text, e);
        return res.status(500).json({ message: 'La IA generó una respuesta con formato inesperado.' });
    }

    const formattedQuestions: Question[] = questionsArray.map((q, i) => ({ id: i + 1, text: q }));

    res.status(200).json({ questions: formattedQuestions });
  
  } catch (error) {
    console.error('Error al conectar con la API de Google Generative AI:', error);
    res.status(500).json({ message: 'Error interno del servidor al generar preguntas.' });
  }
};

export default handler;

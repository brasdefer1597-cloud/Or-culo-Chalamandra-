import type { ThinkingMethod } from '@/types';

/**
 * El Banco de Preguntas: Reservorio táctico para momentos de desconexión.
 */
export const QUESTION_BANK: Record<ThinkingMethod, Record<string, string[]>> = {
  '6 Sombreros': {
    Blanco: [
      '¿Qué datos verificables tienes hoy sobre [contexto]?',
      '¿Qué información crítica aún te falta para decidir?'
    ],
    Rojo: [
      '¿Qué emoción domina tu decisión en este momento?',
      '¿Qué intuición aparece aunque no puedas justificarla todavía?'
    ],
    Negro: [
      '¿Cuál es el peor escenario plausible si actúas hoy?',
      '¿Qué señal temprana te avisaría de que vas en mala dirección?'
    ],
    Amarillo: [
      '¿Qué ventaja concreta puedes desbloquear en 30 días?',
      '¿Qué oportunidad te perderías si no decides ahora?'
    ],
    Verde: [
      '¿Qué opción no obvia podrías testear con bajo riesgo?',
      '¿Qué combinación de enfoques daría una solución híbrida?'
    ],
    Azul: [
      '¿Cuál es tu criterio de éxito en una sola frase?',
      '¿Qué paso con fecha concreta ejecutarás esta semana?'
    ]
  },
  '5 Porqués': {
    Causa: [
      '¿Por qué ocurre [contexto] hoy realmente?',
      '¿Por qué esa causa persiste a pesar de tus intentos?'
    ],
    Sistema: [
      '¿Qué parte del sistema sostiene el problema actualmente?',
      '¿Qué hábito o decisión previa lo refuerza?'
    ],
    Acción: [
      '¿Qué acción ataca la raíz y no solo el síntoma?',
      '¿Qué medirás en 7 días para validar tu avance?'
    ]
  },
  Disney: {
    Soñador: ['Si todo saliera perfecto, ¿cómo se vería tu resultado ideal en [contexto]?'],
    Realista: ['¿Qué recursos reales tienes hoy para acercarte un 1% a la meta?'],
    Crítico: ['¿Qué podría fallar primero y cómo puedes mitigarlo de forma barata?']
  },
  'Paul-Elder': {
    Propósito: ['¿Qué objetivo principal y qué objetivo secundario persigues?'],
    Evidencia: ['¿Qué datos sostienen tu lectura y cuáles la contradicen?', '¿Qué sesgo podría estar filtrando tu realidad?'],
    Implicaciones: ['¿Qué efecto de segundo orden traería tu decisión en 6 meses?']
  },
  Covey: {
    Priorización: ['¿Qué tarea importante no urgente debes bloquear hoy en tu calendario?'],
    Eliminación: ['¿Qué actividad urgente/no importante puedes delegar o eliminar hoy?']
  },
  OODA: {
    Observe: ['¿Qué señal reciente cambió el tablero de juego en [contexto]?'],
    Orient: ['¿Qué sesgo cultural o personal está afectando tu lectura?'],
    Decide: ['¿Qué decisión reversible puedes ejecutar de inmediato?'],
    Act: ['¿Qué disparador (trigger) te hará ajustar el rumbo rápido?']
  },
  'Árbol de decisiones': {
    Opciones: ['¿Qué opción maximiza el valor esperado y cuál minimiza el riesgo máximo?'],
    Horizonte: ['¿Qué opción respeta mejor tus valores fundamentales en 12 meses?']
  },
  Cynefin: {
    Diagnóstico: ['¿Tu escenario es simple, complicado, complejo o caótico?'],
    SiguientePaso: ['¿Cuál es la acción coherente con la naturaleza de ese dominio?']
  }
};

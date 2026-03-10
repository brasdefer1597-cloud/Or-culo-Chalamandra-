import type { ThinkingMethod } from './types';

export const QUESTION_BANK: Record<ThinkingMethod, Record<string, string[]>> = {
  '6 Sombreros': {
    Blanco: [
      '¿Qué datos verificables tienes hoy sobre [contexto]?',
      '¿Qué información crítica aún te falta?' 
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
      '¿Qué oportunidad te perderías si no decides?'
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
      '¿Por qué ocurre [contexto] hoy?',
      '¿Por qué esa causa persiste?' 
    ],
    Sistema: [
      '¿Qué parte del sistema sostiene el problema?',
      '¿Qué hábito o decisión lo refuerza?' 
    ],
    Acción: [
      '¿Qué acción ataca raíz y no síntoma?',
      '¿Qué medirás en 7 días para validar avance?'
    ]
  },
  Disney: {
    Soñador: ['Si todo saliera bien, ¿cómo se vería tu resultado ideal en [contexto]?'],
    Realista: ['¿Qué recursos reales tienes hoy para acercarte 1%?'],
    Crítico: ['¿Qué podría fallar primero y cómo lo mitigas barato?']
  },
  'Paul-Elder': {
    Propósito: ['¿Qué objetivo principal y secundario persigues?'],
    Evidencia: ['¿Qué datos sostienen tu lectura y cuáles la contradicen?'],
    Implicaciones: ['¿Qué efecto de segundo orden traería tu decisión?']
  },
  Covey: {
    Priorización: ['¿Qué tarea importante no urgente debes bloquear hoy en calendario?'],
    Eliminación: ['¿Qué actividad urgente/no importante puedes delegar o eliminar?']
  },
  OODA: {
    Observe: ['¿Qué señal reciente cambió el tablero de [contexto]?'],
    Orient: ['¿Qué sesgo está afectando tu lectura?'],
    Decide: ['¿Qué decisión reversible puedes ejecutar ya?'],
    Act: ['¿Qué disparador te hará ajustar rápido?']
  },
  'Árbol de decisiones': {
    Opciones: ['¿Qué opción maximiza valor esperado y cuál minimiza riesgo máximo?'],
    Horizonte: ['¿Qué opción respeta mejor tus valores en 12 meses?']
  },
  Cynefin: {
    Diagnóstico: ['¿Tu escenario es simple, complicado, complejo o caótico?'],
    SiguientePaso: ['¿Cuál es la acción coherente con ese dominio?']
  }
};

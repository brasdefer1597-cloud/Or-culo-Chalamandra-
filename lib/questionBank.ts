
import type { ThinkingMethod } from './types';

interface Question {
  id: number;
  text: string;
}

interface Method {
  name: ThinkingMethod;
  description: string;
  questions: Question[];
}

export const QUESTION_BANK: Method[] = [
  {
    name: '6 Sombreros',
    description: 'Analiza un problema desde múltiples perspectivas para tomar decisiones más robustas.',
    questions: [
      { id: 1, text: 'Sombrero Blanco (Datos): ¿Qué información tenemos y cuál nos falta?' },
      { id: 2, text: 'Sombrero Rojo (Emociones): ¿Qué me dice mi intuición sobre esto?' },
      { id: 3, text: 'Sombrero Negro (Riesgos): ¿Cuál es el peor escenario posible y cómo podemos mitigarlo?' },
      { id: 4, text: 'Sombrero Amarillo (Beneficios): ¿Cuáles son las ventajas y el mejor escenario posible?' },
      { id: 5, text: 'Sombrero Verde (Creatividad): ¿Qué alternativas no hemos considerado todavía?' },
      { id: 6, text: 'Sombrero Azul (Proceso): ¿Cuál es el siguiente paso y quién es el responsable?' }
    ]
  },
  {
    name: '5 Porqués',
    description: 'Profundiza en la causa raíz de un problema preguntando "por qué" sucesivamente.',
    questions: [
      { id: 1, text: '¿Por qué ha ocurrido este problema? (Causa 1)' },
      { id: 2, text: '¿Por qué se produjo [Causa 1]? (Causa 2)' },
      { id: 3, text: '¿Por qué se produjo [Causa 2]? (Causa 3)' },
      { id: 4, text: '¿Por qué se produjo [Causa 3]? (Causa 4)' },
      { id: 5, text: '¿Por qué se produjo [Causa 4]? (Causa Raíz)' }
    ]
  },
  {
    name: 'Disney',
    description: 'Aborda un proyecto desde tres roles: el Soñador, el Realista y el Crítico.',
    questions: [
      { id: 1, text: 'El Soñador: Si no hubiera límites, ¿cuál sería la visión más ambiciosa para este proyecto?' },
      { id: 2, text: 'El Realista: ¿Cuál es un plan de acción concreto para empezar a implementar la visión?' },
      { id: 3, text: 'El Crítico: ¿Qué debilidades o fallos potenciales tiene este plan?' }
    ]
  },
    {
    name: 'Paul-Elder',
    description: 'Usa un marco de pensamiento crítico para analizar y evaluar el razonamiento.',
    questions: [
      { id: 1, text: 'Propósito: ¿Cuál es nuestro objetivo fundamental al abordar este problema?' },
      { id: 2, text: 'Pregunta: ¿Cuál es la pregunta clave que estamos tratando de responder?' },
      { id: 3, text: 'Información: ¿Qué datos y evidencia son más relevantes para nuestra pregunta?' },
      { id: 4, text: 'Interpretación: ¿Cómo estamos interpretando esta información y qué conclusiones sacamos?' },
      { id: 5, text: 'Conceptos: ¿Cuáles son las ideas o teorías centrales que estamos utilizando?' },
      { id: 6, text: 'Supuestos: ¿Qué estamos dando por sentado que podría no ser cierto?' },
      { id: 7, text: 'Implicaciones: Si nuestras conclusiones son correctas, ¿cuáles son las consecuencias?' },
      { id: 8, text: 'Punto de Vista: ¿Hay otras perspectivas que deberíamos considerar?' }
    ]
  },
  {
    name: 'Covey',
    description: 'Matriz de administración del tiempo para priorizar tareas basada en urgencia e importancia.',
    questions: [
      { id: 1, text: 'Urgente e Importante (Crisis): ¿Qué crisis debemos resolver de inmediato?' },
      { id: 2, text: 'No Urgente e Importante (Prevención/Calidad): ¿En qué debemos trabajar ahora para mejorar el futuro?' },
      { id: 3, text: 'Urgente y No Importante (Interrupciones): ¿Qué interrupciones podemos delegar o minimizar?' },
      { id: 4, text: 'No Urgente y No Importante (Pérdida de Tiempo): ¿Qué actividades debemos dejar de hacer por completo?' }
    ]
  },
  {
    name: 'OODA',
    description: 'Un ciclo de decisión rápido para entornos competitivos: Observar, Orientar, Decidir, Actuar.',
    questions: [
      { id: 1, text: 'Observar: ¿Qué nueva información del entorno ha surgido?' },
      { id: 2, text: 'Orientar: ¿Cómo nuestro modelo mental actual interpreta esta nueva información?' },
      { id: 3, text: 'Decidir: ¿Cuál es la mejor acción posible dada nuestra orientación actual?' },
      { id: 4, text: 'Actuar: ¿Cómo ejecutamos nuestra decisión de la forma más rápida y efectiva?' }
    ]
  },
  {
    name: 'Árbol de decisiones',
    description: 'Visualiza las diferentes opciones y sus posibles resultados para tomar una decisión informada.',
    questions: [
        { id: 1, text: '¿Cuáles son las decisiones clave que debemos tomar y qué opciones tenemos para cada una?' },
        { id: 2, text: '¿Cuáles son los posibles resultados de cada opción y qué probabilidad tienen de ocurrir?' },
        { id: 3, text: '¿Cuál es el valor o la utilidad de cada resultado posible?' }
    ]
  },
  {
    name: 'Cynefin',
    description: 'Un marco de sentido que ayuda a los líderes a identificar el contexto en el que se encuentran y tomar decisiones apropiadas.',
    questions: [
        { id: 1, text: 'Simple: ¿Cuáles son las mejores prácticas que podemos aplicar aquí?' },
        { id: 2, text: 'Complicado: ¿Qué expertos necesitamos para analizar la situación y encontrar una buena solución?' },
        { id: 3, text: 'Complejo: ¿Qué experimentos podemos realizar para entender mejor el sistema y ver qué emerge?' },
        { id: 4, text: 'Caótico: ¿Qué acción inmediata podemos tomar para estabilizar la situación?' }
    ]
  }
];

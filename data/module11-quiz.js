// data/module11-quiz.js
/**
 * Quiz final del Módulo 11 — Business Analytics SQL.
 * Learning Mode, 5 preguntas, aprobación ≥ 3/5 (Roadmap Oficial).
 */

export const module11QuizMetadata = {
  id: 11,
  title: 'Quiz: Business Analytics SQL',
  totalQuestions: 5,
  approvalThreshold: 3
};

export const module11QuizQuestions = [
  {
    id: 1,
    question: 'En la pregunta "ventas por país", ¿cuál es la métrica y cuál la dimensión?',
    options: [
      { id: 'a', text: 'Métrica: país — Dimensión: ventas' },
      { id: 'b', text: 'Métrica: ventas — Dimensión: país' },
      { id: 'c', text: 'Ambas son métricas' },
      { id: 'd', text: 'Ambas son dimensiones' }
    ],
    correctOptionId: 'b',
    explanation: 'Ventas (revenue) es lo que se mide y se suma: es la métrica. País es por lo que se agrupa esa suma: es la dimensión.'
  },
  {
    id: 2,
    question: 'Si la retención de un mes fue 35%, ¿cuál fue el churn de ese mismo mes?',
    options: [
      { id: 'a', text: '35%' },
      { id: 'b', text: '0%' },
      { id: 'c', text: '65%' },
      { id: 'd', text: 'No se puede saber sin más datos' }
    ],
    correctOptionId: 'c',
    explanation: 'Churn es el complemento de retention: churn % = 100% − retention %. Si retención fue 35%, el churn fue 65%.'
  },
  {
    id: 3,
    question: '¿Por qué el análisis de cohortes revela cosas que una tasa de retención global no muestra?',
    options: [
      { id: 'a', text: 'Porque usa una tabla distinta' },
      { id: 'b', text: 'Porque compara grupos de usuarios según cuándo empezaron, a lo largo del tiempo' },
      { id: 'c', text: 'Porque no incluye a usuarios que dejaron de usar el producto' },
      { id: 'd', text: 'Porque siempre da un número más alto' }
    ],
    correctOptionId: 'b',
    explanation: 'Una tasa global mezcla a todos los usuarios en un solo número. Los cohortes separan a los usuarios por su fecha de inicio, permitiendo ver si el comportamiento cambió entre un grupo y otro con el tiempo.'
  },
  {
    id: 4,
    question: 'En un funnel de "visitó → agregó al carrito → compró", ¿qué mide principalmente este análisis?',
    options: [
      { id: 'a', text: 'El revenue total del período' },
      { id: 'b', text: 'La tasa de conversión entre cada etapa consecutiva' },
      { id: 'c', text: 'Cuántos usuarios nuevos llegaron' },
      { id: 'd', text: 'El churn mensual' }
    ],
    correctOptionId: 'b',
    explanation: 'Un funnel mide cuántos usuarios avanzan de una etapa a la siguiente, revelando en qué paso específico se pierde más gente.'
  },
  {
    id: 5,
    question: 'Para calcular el crecimiento (growth %) mes a mes con SQL, ¿qué técnica es la más natural?',
    options: [
      { id: 'a', text: 'GROUP BY sin ninguna función adicional' },
      { id: 'b', text: 'Una window function como LAG(), para comparar cada mes con el anterior en la misma fila' },
      { id: 'c', text: 'DISTINCT sobre la tabla de ventas' },
      { id: 'd', text: 'Una subquery en el SELECT sin relación con el tiempo' }
    ],
    correctOptionId: 'b',
    explanation: 'LAG() trae el valor del período anterior en la misma fila que el período actual, que es exactamente lo que se necesita para calcular una variación porcentual entre ambos.'
  }
];
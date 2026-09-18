// data/module12-quiz.js
/**
 * Quiz final del Módulo 12 — Data Modeling.
 * Learning Mode, 5 preguntas, aprobación ≥ 3/5 (Roadmap Oficial).
 */

export const module12QuizMetadata = {
  id: 12,
  title: 'Quiz: Data Modeling',
  totalQuestions: 5,
  approvalThreshold: 3
};

export const module12QuizQuestions = [
  {
    id: 1,
    question: 'Un pedido puede tener muchos productos, y un producto puede aparecer en muchos pedidos. ¿Cómo se modela esta relación?',
    options: [
      { id: 'a', text: 'Con una FK directa de products hacia orders' },
      { id: 'b', text: 'Con una tabla puente (ej. order_items)' },
      { id: 'c', text: 'Fusionando ambas tablas en una sola' },
      { id: 'd', text: 'No es necesario modelarla, se puede resolver con un WHERE' }
    ],
    correctOptionId: 'b',
    explanation: 'Una relación muchos-a-muchos (N:M) siempre requiere una tabla puente, porque ninguna de las dos entidades "pertenece" a la otra.'
  },
  {
    id: 2,
    question: 'Una tabla tiene una columna "phones" con el valor "555-1234, 555-5678" en una sola celda. ¿Qué forma normal viola?',
    options: [
      { id: 'a', text: '1NF, porque el valor no es atómico' },
      { id: 'b', text: '2NF, por una dependencia parcial' },
      { id: 'c', text: '3NF, por una dependencia transitiva' },
      { id: 'd', text: 'No viola ninguna forma normal' }
    ],
    correctOptionId: 'a',
    explanation: '1NF exige valores atómicos: una sola celda no puede contener una lista de valores separados por comas.'
  },
  {
    id: 3,
    question: 'En una tabla order_items(order_id, product_id, product_name, quantity), ¿por qué product_name viola 2NF?',
    options: [
      { id: 'a', text: 'Porque product_name no es un valor atómico' },
      { id: 'b', text: 'Porque depende solo de product_id, no de toda la clave compuesta (order_id + product_id)' },
      { id: 'c', text: 'Porque quantity debería ser una clave primaria' },
      { id: 'd', text: 'Porque la tabla no tiene suficientes columnas' }
    ],
    correctOptionId: 'b',
    explanation: 'Es una dependencia parcial: product_name depende únicamente de product_id, no de la clave compuesta completa. Por eso pertenece a la tabla products, no a order_items.'
  },
  {
    id: 4,
    question: '¿Cuál es la diferencia principal entre una tabla de hechos (fact table) y una tabla de dimensión en un Star Schema?',
    options: [
      { id: 'a', text: 'La tabla de hechos contiene texto; las dimensiones, solo números' },
      { id: 'b', text: 'La tabla de hechos contiene eventos/transacciones con métricas; las dimensiones dan contexto para filtrar y agrupar' },
      { id: 'c', text: 'No hay diferencia real, son sinónimos' },
      { id: 'd', text: 'Las dimensiones siempre tienen más filas que la tabla de hechos' }
    ],
    correctOptionId: 'b',
    explanation: 'La tabla de hechos es el centro del Star Schema (transacciones, métricas numéricas). Las dimensiones son las tablas alrededor que permiten segmentar esas métricas (por fecha, cliente, producto, etc).'
  },
  {
    id: 5,
    question: '¿Por qué la mayoría de los equipos de analítica prefieren Star Schema sobre Snowflake Schema?',
    options: [
      { id: 'a', text: 'Star Schema siempre ocupa menos espacio en disco' },
      { id: 'b', text: 'Snowflake Schema no permite hacer JOINs' },
      { id: 'c', text: 'Star Schema requiere menos JOINs, haciendo las consultas más simples y rápidas de escribir' },
      { id: 'd', text: 'Snowflake Schema no es compatible con SQL' }
    ],
    correctOptionId: 'c',
    explanation: 'Snowflake normaliza aún más las dimensiones, reduciendo redundancia pero exigiendo más JOINs. En analítica, la simplicidad de las consultas suele valer más que ahorrar espacio en disco.'
  }
];
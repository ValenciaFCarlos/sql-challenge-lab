// data/module16-quiz.js
/**
 * Quiz final del Módulo 16 — SQL Interview Mastery.
 * Learning Mode, 10 preguntas, aprobación ≥ 6/10 (Roadmap Oficial).
 */

export const module16QuizMetadata = {
  id: 16,
  title: 'Quiz: SQL Interview Mastery',
  totalQuestions: 10,
  approvalThreshold: 6
};

export const module16QuizQuestions = [
  {
    id: 1,
    question: '¿Qué suele evaluar principalmente una entrevista para Data Analyst?',
    options: [
      { id: 'a', text: 'Solo la velocidad para escribir sintaxis SQL de memoria' },
      { id: 'b', text: 'La capacidad de ir de datos crudos a un insight accionable, con agregaciones y buen criterio' },
      { id: 'c', text: 'Únicamente el diseño de arquitecturas de datos complejas' },
      { id: 'd', text: 'Solo preguntas sobre PostgreSQL específicamente' }
    ],
    correctOptionId: 'b',
    explanation: 'Un Data Analyst se evalúa por su capacidad de explorar datos y llegar a conclusiones accionables, no solo por escribir SQL sintácticamente correcto.'
  },
  {
    id: 2,
    question: 'Una entrevista de BI Analyst pregunta "¿cómo asegurarías que \'usuario activo\' signifique lo mismo en dos dashboards distintos?". ¿Qué está evaluando?',
    options: [
      { id: 'a', text: 'Solo tu velocidad escribiendo JOINs' },
      { id: 'b', text: 'Tu entendimiento de consistencia de métricas y modelado de datos entre reportes' },
      { id: 'c', text: 'Si conoces el nombre de todas las funciones de PostgreSQL' },
      { id: 'd', text: 'Tu capacidad de diseñar una interfaz visual' }
    ],
    correctOptionId: 'b',
    explanation: 'El énfasis de un BI Analyst está en que las métricas signifiquen lo mismo en toda la organización — una preocupación de modelado y definición, no solo de sintaxis.'
  },
  {
    id: 3,
    question: '¿Qué distingue a una entrevista de Analytics Engineer de las otras dos?',
    options: [
      { id: 'a', text: 'No incluye SQL en absoluto' },
      { id: 'b', text: 'Suele exigir SQL más avanzado (CTEs, window functions) y conocimiento de modelado por capas (raw/staging/mart)' },
      { id: 'c', text: 'Solo se trata de diseño visual de dashboards' },
      { id: 'd', text: 'Es idéntica a la de Data Analyst en todos los aspectos' }
    ],
    correctOptionId: 'b',
    explanation: 'Analytics Engineer suele tener la barra técnica más alta: SQL avanzado y entendimiento de arquitecturas de transformación por capas, como se vio en el Módulo 15.'
  },
  {
    id: 4,
    question: 'Para resolver "el producto más vendido de cada categoría", ¿qué patrón es el más directo?',
    options: [
      { id: 'a', text: 'Un CROSS JOIN entre productos y categorías' },
      { id: 'b', text: 'ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC), filtrando por rn = 1' },
      { id: 'c', text: 'Un simple ORDER BY sales DESC sin agrupar' },
      { id: 'd', text: 'COUNT(*) GROUP BY category' }
    ],
    correctOptionId: 'b',
    explanation: 'PARTITION BY reinicia el conteo por categoría, y filtrar por rn = 1 deja exactamente el mejor de cada grupo — el patrón clásico de "Top-N per group".'
  },
  {
    id: 5,
    question: 'Para ENCONTRAR filas con emails duplicados (sin borrarlas todavía), ¿qué combinación usarías?',
    options: [
      { id: 'a', text: 'ORDER BY email DESC' },
      { id: 'b', text: 'GROUP BY email HAVING COUNT(*) > 1' },
      { id: 'c', text: 'WHERE email IS NOT NULL' },
      { id: 'd', text: 'DISTINCT email' }
    ],
    correctOptionId: 'b',
    explanation: 'GROUP BY agrupa por email, y HAVING COUNT(*) > 1 filtra solo los grupos que tienen más de una fila — es decir, los valores duplicados.'
  },
  {
    id: 6,
    question: 'Si hay un empate en el primer lugar de un ranking de salarios, ¿qué diferencia a RANK() de DENSE_RANK() para calcular el "segundo lugar"?',
    options: [
      { id: 'a', text: 'Son exactamente iguales en todos los casos' },
      { id: 'b', text: 'RANK() deja un hueco después del empate; DENSE_RANK() no deja huecos' },
      { id: 'c', text: 'RANK() no funciona con empates' },
      { id: 'd', text: 'DENSE_RANK() siempre da un resultado más alto' }
    ],
    correctOptionId: 'b',
    explanation: 'Si dos filas empatan en el 1er lugar, RANK() salta directo al 3er lugar (dejando un hueco en el 2°), mientras que DENSE_RANK() continúa en el 2° sin huecos — la diferencia vista en el Módulo 10.'
  },
  {
    id: 7,
    question: 'En una pregunta abierta como "¿cómo medirías el éxito de una nueva feature?", ¿qué evalúa principalmente el entrevistador?',
    options: [
      { id: 'a', text: 'Que menciones la mayor cantidad posible de métricas' },
      { id: 'b', text: 'Tu proceso de pensamiento: aclarar qué significa "éxito", proponer métricas concretas y reconocer limitaciones' },
      { id: 'c', text: 'Que escribas la query SQL exacta sin errores de sintaxis' },
      { id: 'd', text: 'Únicamente tu conocimiento de window functions' }
    ],
    correctOptionId: 'b',
    explanation: 'Las preguntas de caso de negocio no tienen una única respuesta correcta — evalúan cómo estructuras el problema, no la sintaxis de una query específica.'
  },
  {
    id: 8,
    question: '¿Por qué conviene declarar tus suposiciones en voz alta antes de escribir SQL en una entrevista?',
    options: [
      { id: 'a', text: 'Porque es una formalidad sin ningún valor real' },
      { id: 'b', text: 'Porque aclara con el entrevistador qué problema exacto estás resolviendo, evitando malentendidos' },
      { id: 'c', text: 'Porque hace que la query se ejecute más rápido' },
      { id: 'd', text: 'No es recomendable, hay que empezar a escribir código de inmediato' }
    ],
    correctOptionId: 'b',
    explanation: 'Declarar suposiciones (ej. "asumo que puede haber empates") confirma que tú y el entrevistador están alineados sobre qué problema se está resolviendo, antes de invertir tiempo en la solución.'
  },
  {
    id: 9,
    question: '¿Por qué "pensar en voz alta" es mejor que quedarse en silencio mientras se resuelve un problema, aunque al final se llegue a la respuesta correcta?',
    options: [
      { id: 'a', text: 'Porque hablar más rápido siempre impresiona más' },
      { id: 'b', text: 'Porque el silencio no permite que te ayuden a tiempo ni demuestra cómo razonas, generando más duda que un proceso narrado' },
      { id: 'c', text: 'No hay ninguna diferencia real entre ambos enfoques' },
      { id: 'd', text: 'Porque el silencio siempre se interpreta como una respuesta incorrecta' }
    ],
    correctOptionId: 'b',
    explanation: 'El silencio prolongado no muestra tu proceso de razonamiento, que es justamente lo que el entrevistador quiere observar — y no da oportunidad de recibir una pista a tiempo si vas por mal camino.'
  },
  {
    id: 10,
    question: 'Después de escribir tu query en una entrevista, ¿qué es una buena práctica de comunicación?',
    options: [
      { id: 'a', text: 'No decir nada más, dejar que el entrevistador la lea solo' },
      { id: 'b', text: 'Explicar brevemente el porqué de tu enfoque y mencionar alternativas que consideraste' },
      { id: 'c', text: 'Pedir inmediatamente pasar a la siguiente pregunta' },
      { id: 'd', text: 'Reescribir la query desde cero sin explicar nada' }
    ],
    correctOptionId: 'b',
    explanation: 'Explicar el razonamiento detrás de tu solución, y mencionar alternativas consideradas (como CTE vs. subquery), demuestra criterio técnico — no solo que la query "funciona".'
  }
];
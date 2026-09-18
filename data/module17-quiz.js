// data/module17-quiz.js
/**
 * Examen Final del Módulo 17 — Community Challenge (Capstone).
 * A diferencia de los quizzes anteriores, este NO evalúa contenido
 * nuevo — mezcla preguntas de distintos módulos del curso completo
 * (1 al 16), a propósito y sin agrupar por tema, para simular una
 * evaluación integradora real.
 * Learning Mode, 10 preguntas, aprobación ≥ 6/10 (Roadmap Oficial).
 */

export const module17QuizMetadata = {
  id: 17,
  title: 'Examen Final: SQL GOD Challenge',
  totalQuestions: 10,
  approvalThreshold: 6
};

export const module17QuizQuestions = [
  {
    id: 1,
    question: 'Quieres encontrar estudiantes que NO tienen ninguna inscripción. ¿Qué patrón de JOIN usarías?',
    options: [
      { id: 'a', text: 'INNER JOIN, filtrando después con WHERE' },
      { id: 'b', text: 'LEFT JOIN desde students hacia enrollments, filtrando WHERE enrollment_id IS NULL' },
      { id: 'c', text: 'CROSS JOIN entre ambas tablas' },
      { id: 'd', text: 'No es posible responder esto con JOIN' }
    ],
    correctOptionId: 'b',
    explanation: 'LEFT JOIN conserva todas las filas de students, y filtrar por la FK de la tabla derecha siendo NULL revela justo los que no tienen ninguna coincidencia — patrón visto en el Módulo 7.'
  },
  {
    id: 2,
    question: 'Si tres estudiantes empatan en el primer lugar de un ranking de calificaciones, ¿qué función de ventana evita que el cuarto lugar "salte" directo al 4°?',
    options: [
      { id: 'a', text: 'RANK()' },
      { id: 'b', text: 'DENSE_RANK()' },
      { id: 'c', text: 'ROW_NUMBER()' },
      { id: 'd', text: 'LAG()' }
    ],
    correctOptionId: 'b',
    explanation: 'RANK() deja huecos después de un empate (el siguiente sería 4°). DENSE_RANK() no deja huecos: el siguiente valor distinto sería 2°, no 4° — visto en el Módulo 10.'
  },
  {
    id: 3,
    question: 'El churn de un mes fue 25%. ¿Cuál fue la retención de ese mismo mes?',
    options: [
      { id: 'a', text: '25%' },
      { id: 'b', text: '50%' },
      { id: 'c', text: '75%' },
      { id: 'd', text: 'No se puede calcular sin más datos' }
    ],
    correctOptionId: 'c',
    explanation: 'Retention y churn son complementarios: retention % = 100% − churn %. Si el churn fue 25%, la retención fue 75% — visto en el Módulo 11.'
  },
  {
    id: 4,
    question: 'Una tabla orders(order_id, customer_id, customer_city) tiene customer_city repetido en cada pedido del mismo cliente. ¿Qué principio de diseño se está violando?',
    options: [
      { id: 'a', text: '1NF, porque los valores no son atómicos' },
      { id: 'b', text: '3NF, porque customer_city depende de customer_id, no directamente de order_id (dependencia transitiva)' },
      { id: 'c', text: 'Ningún principio, este diseño es correcto' },
      { id: 'd', text: 'Cardinalidad, porque debería ser una relación 1:1' }
    ],
    correctOptionId: 'b',
    explanation: 'customer_city depende de customer_id, no de order_id directamente — es una dependencia transitiva, y esos datos pertenecen a la tabla customers. Visto en el Módulo 12.'
  },
  {
    id: 5,
    question: 'EXPLAIN muestra "Seq Scan" sobre una tabla de 5 millones de filas, en una consulta que se ejecuta cientos de veces al día filtrando por customer_id. ¿Qué acción es la más directa?',
    options: [
      { id: 'a', text: 'Reescribir la consulta usando una sintaxis distinta pero equivalente' },
      { id: 'b', text: 'Crear un índice sobre customer_id' },
      { id: 'c', text: 'Eliminar el WHERE de la consulta' },
      { id: 'd', text: 'Cambiar el tipo de dato de customer_id a TEXT' }
    ],
    correctOptionId: 'b',
    explanation: 'Un Seq Scan frecuente sobre una tabla grande, filtrando por una columna sin índice, es la señal clásica de que falta indexar esa columna — visto en el Módulo 14.'
  },
  {
    id: 6,
    question: '¿Qué ventaja tiene reescribir una subquery anidada como un CTE (WITH), más allá del resultado (que es el mismo)?',
    options: [
      { id: 'a', text: 'Los CTEs siempre son más rápidos que las subqueries' },
      { id: 'b', text: 'Mejoran la legibilidad, y permiten nombrar y reutilizar un resultado intermedio' },
      { id: 'c', text: 'Los CTEs no pueden usar funciones de agregación' },
      { id: 'd', text: 'No hay ninguna diferencia real entre ambos' }
    ],
    correctOptionId: 'b',
    explanation: 'CTEs y subqueries anidadas suelen dar el mismo resultado, pero el CTE le da un nombre legible al paso intermedio, haciendo la consulta más fácil de leer y de depurar. Visto en el Módulo 9.'
  },
  {
    id: 7,
    question: '¿Cuándo es más apropiado usar EXISTS en vez de IN con una subquery?',
    options: [
      { id: 'a', text: 'Nunca, IN siempre es preferible' },
      { id: 'b', text: 'Cuando solo te importa si existe al menos una fila que cumpla la condición, especialmente con subqueries correlacionadas' },
      { id: 'c', text: 'EXISTS solo funciona con JOIN, nunca con subqueries' },
      { id: 'd', text: 'Quando quieres el valor exacto de una columna, no solo su existencia' }
    ],
    correctOptionId: 'b',
    explanation: 'EXISTS evalúa solo si la subquery devuelve alguna fila, lo cual suele ser más eficiente que traer una lista completa con IN, sobre todo en subqueries correlacionadas. Visto en el Módulo 8.'
  },
  {
    id: 8,
    question: 'Quieres insertar un registro por email, y si ya existe, actualizar el nombre en vez de fallar con un error de duplicado. ¿Qué técnica de PostgreSQL usarías?',
    options: [
      { id: 'a', text: 'RETURNING' },
      { id: 'b', text: 'INSERT ... ON CONFLICT (email) DO UPDATE' },
      { id: 'c', text: 'CREATE SCHEMA' },
      { id: 'd', text: 'Un tipo de dato ARRAY' }
    ],
    correctOptionId: 'b',
    explanation: 'ON CONFLICT ... DO UPDATE es el patrón UPSERT: inserta si no existe, actualiza si ya existe, en una sola sentencia atómica. Visto en el Módulo 13.'
  },
  {
    id: 9,
    question: 'En una arquitectura de capas de datos, ¿en qué capa esperarías encontrar la lógica de negocio ya calculada y lista para un dashboard?',
    options: [
      { id: 'a', text: 'Raw Layer' },
      { id: 'b', text: 'Staging Layer' },
      { id: 'c', text: 'Mart Layer' },
      { id: 'd', text: 'Ninguna capa contiene lógica de negocio' }
    ],
    correctOptionId: 'c',
    explanation: 'La Mart Layer es el destino final: tablas ya transformadas y listas para consumo directo de negocio, típicamente con forma de Star Schema. Visto en el Módulo 15.'
  },
  {
    id: 10,
    question: 'En una entrevista, te preguntan "el segundo salario más alto" y hay un empate en el primer lugar. ¿Cuál es la mejor primera respuesta?',
    options: [
      { id: 'a', text: 'Escribir la query inmediatamente sin decir nada' },
      { id: 'b', text: 'Preguntar qué debería pasar con el empate antes de escribir la consulta, y luego elegir RANK, DENSE_RANK o ROW_NUMBER según la respuesta' },
      { id: 'c', text: 'Asumir que nunca hay empates y usar LIMIT 1 OFFSET 1' },
      { id: 'd', text: 'Decir que la pregunta no tiene solución posible' }
    ],
    correctOptionId: 'b',
    explanation: 'Aclarar la ambigüedad del empate antes de codificar demuestra criterio, no inseguridad — y determina si la función correcta es RANK, DENSE_RANK o algo distinto. Combina los Módulos 10 y 16.'
  }
];
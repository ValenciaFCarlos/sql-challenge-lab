// data/module13-quiz.js
/**
 * Quiz final del Módulo 13 — PostgreSQL Core.
 * Learning Mode, 5 preguntas, aprobación ≥ 3/5 (Roadmap Oficial).
 */

export const module13QuizMetadata = {
  id: 13,
  title: 'Quiz: PostgreSQL Core',
  totalQuestions: 5,
  approvalThreshold: 3
};

export const module13QuizQuestions = [
  {
    id: 1,
    question: '¿Cuál es la diferencia fundamental entre SQLite y PostgreSQL?',
    options: [
      { id: 'a', text: 'SQLite es más moderno que PostgreSQL' },
      { id: 'b', text: 'SQLite es embebido (un archivo); PostgreSQL es cliente-servidor, pensado para muchos usuarios concurrentes' },
      { id: 'c', text: 'No hay ninguna diferencia real' },
      { id: 'd', text: 'PostgreSQL no soporta JOINs' }
    ],
    correctOptionId: 'b',
    explanation: 'SQLite funciona como un archivo local, ideal para aprender o para apps con un solo usuario. PostgreSQL es cliente-servidor, diseñado para producción con muchos usuarios simultáneos.'
  },
  {
    id: 2,
    question: '¿Para qué tipo de datos tiene más sentido usar una columna JSONB?',
    options: [
      { id: 'a', text: 'Para el nombre y el email de un cliente' },
      { id: 'b', text: 'Para atributos que varían mucho entre filas, como especificaciones técnicas heterogéneas' },
      { id: 'c', text: 'Para la clave primaria de una tabla' },
      { id: 'd', text: 'JSONB nunca debería usarse en una base relacional' }
    ],
    correctOptionId: 'b',
    explanation: 'JSONB es útil cuando los atributos son variables y no justifican una columna dedicada para cada uno. Datos centrales y estructurados del negocio deben ir en columnas normales.'
  },
  {
    id: 3,
    question: '¿Por qué usar UUID en vez de un id INTEGER autoincremental?',
    options: [
      { id: 'a', text: 'Porque los UUID ocupan menos espacio' },
      { id: 'b', text: 'Porque permiten generar IDs válidos de forma independiente, sin coordinarse con un contador central — clave en sistemas distribuidos' },
      { id: 'c', text: 'Porque son más fáciles de leer para un humano' },
      { id: 'd', text: 'Porque PostgreSQL no soporta IDs autoincrementales' }
    ],
    correctOptionId: 'b',
    explanation: 'La ventaja de UUID no es de legibilidad ni espacio — es que distintos servidores pueden generar IDs sin coordinarse entre sí y sin riesgo de colisión, algo esencial en sistemas distribuidos.'
  },
  {
    id: 4,
    question: '¿Qué problema resuelve la cláusula RETURNING?',
    options: [
      { id: 'a', text: 'Permite hacer JOIN entre dos tablas' },
      { id: 'b', text: 'Evita tener que hacer una segunda consulta para obtener datos generados por un INSERT/UPDATE/DELETE' },
      { id: 'c', text: 'Ordena los resultados de una consulta' },
      { id: 'd', text: 'Solo funciona con tablas que tienen JSONB' }
    ],
    correctOptionId: 'b',
    explanation: 'RETURNING permite obtener datos (como un id generado) directamente desde la misma sentencia INSERT/UPDATE/DELETE, sin necesidad de una consulta SELECT adicional.'
  },
  {
    id: 5,
    question: 'Quieres insertar un cliente por su email, pero si ya existe, actualizar su nombre en vez de fallar. ¿Qué técnica usarías?',
    options: [
      { id: 'a', text: 'RETURNING' },
      { id: 'b', text: 'Un ARRAY' },
      { id: 'c', text: 'INSERT ... ON CONFLICT DO UPDATE (UPSERT)' },
      { id: 'd', text: 'Crear un nuevo schema' }
    ],
    correctOptionId: 'c',
    explanation: 'ON CONFLICT ... DO UPDATE es exactamente el patrón UPSERT: inserta si no existe, actualiza si ya existe, todo en una sola sentencia atómica.'
  }
];
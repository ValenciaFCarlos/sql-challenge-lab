// data/module0-quiz.js
/**
 * Quiz final del Módulo 0 — Introducción a SQL.
 * Learning Mode, 5 preguntas, aprobación ≥ 3/5 (Roadmap Oficial).
 *
 * Cada pregunta está derivada directamente del contenido real de
 * module0Cards (no se inventa nada fuera de lo ya enseñado).
 */

export const module0QuizMetadata = {
  id: 0,
  title: 'Quiz: Introducción a SQL',
  totalQuestions: 5,
  approvalThreshold: 3 // ≥ 3/5 según Roadmap Oficial
};

export const module0QuizQuestions = [
  {
    id: 1,
    question: '¿Qué significa la sigla SQL?',
    options: [
      { id: 'a', text: 'Structured Query Language' },
      { id: 'b', text: 'Simple Question Logic' },
      { id: 'c', text: 'System Quality Layer' },
      { id: 'd', text: 'Sequential Query Loop' }
    ],
    correctOptionId: 'a',
    explanation: 'SQL significa "Structured Query Language" — el lenguaje estándar para comunicarse con bases de datos relacionales.'
  },
  {
    id: 2,
    question: 'Según la analogía de la biblioteca, ¿qué representa SQL?',
    options: [
      { id: 'a', text: 'La biblioteca misma (donde vive la información)' },
      { id: 'b', text: 'El idioma que usamos para pedir información al bibliotecario' },
      { id: 'c', text: 'El bibliotecario que gestiona los libros' },
      { id: 'd', text: 'El edificio donde se guardan los datos' }
    ],
    correctOptionId: 'b',
    explanation: 'SQL no es la base de datos ni el motor que la gestiona — es el idioma que usamos para comunicarnos con los datos. La biblioteca es la base de datos, el bibliotecario es el motor, y SQL es el idioma.'
  },
  {
    id: 3,
    question: '¿En qué década surgió el modelo relacional que dio origen a SQL?',
    options: [
      { id: 'a', text: '1950s' },
      { id: 'b', text: '1970s' },
      { id: 'c', text: '1990s' },
      { id: 'd', text: '2010s' }
    ],
    correctOptionId: 'b',
    explanation: 'Edgar Codd propuso el modelo relacional en 1970, e IBM desarrolló SEQUEL (predecesor de SQL) en 1974. SQL se convirtió en estándar ANSI en 1986.'
  },
  {
    id: 4,
    question: 'En una tabla, ¿qué representa cada fila?',
    options: [
      { id: 'a', text: 'Un atributo de la entidad' },
      { id: 'b', text: 'El nombre de una columna' },
      { id: 'c', text: 'Un registro (una instancia de la entidad)' },
      { id: 'd', text: 'El tipo de dato de la tabla' }
    ],
    correctOptionId: 'c',
    explanation: 'Cada fila de una tabla es un registro: una instancia concreta de la entidad. Cada columna, en cambio, es un atributo de esa entidad.'
  },
  {
    id: 5,
    question: '¿Cuál es la función principal de una Primary Key (PK)?',
    options: [
      { id: 'a', text: 'Conectar una tabla con otra' },
      { id: 'b', text: 'Identificar de forma única cada fila de una tabla' },
      { id: 'c', text: 'Definir el tipo de dato de una columna' },
      { id: 'd', text: 'Ordenar los resultados de una consulta' }
    ],
    correctOptionId: 'b',
    explanation: 'La Primary Key identifica de forma única cada fila. La que conecta una tabla con otra es la Foreign Key (FK), que apunta a la Primary Key de otra tabla.'
  }
];
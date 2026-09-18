// data/module1-dataset.js
/**
 * Módulo 1 - Mentalidad Relacional
 * Practice Mode — 4 ejercicios (según Roadmap Oficial SQL Challenge Lab™).
 *
 * Objetivo pedagógico: antes de profundizar en la sintaxis de SELECT
 * (eso es Módulo 2), este módulo conecta la teoría de Módulo 0
 * (entidad, atributo, Primary Key) con la primera experiencia práctica
 * de escribir SQL real. Cada reto está redactado en términos de
 * "entidad" / "atributo" para reforzar ese puente conceptual.
 *
 * Nota de migración: este dataset reemplaza al "First Query™" original
 * (6 retos de SELECT básico). Los retos 5 (COUNT) y 6 (ORDER BY) de esa
 * versión se retiraron por estar duplicados con Módulo 5 (Aggregations)
 * y Módulo 4 (Ordering & Result Control), que ya los cubren a fondo.
 */

export const module1Metadata = {
  id: 1,
  title: 'Mentalidad Relacional',
  displayTitle: 'SQL Warrior',
  emoji: '⚔️',
  range: '⚔️ SQL Warrior',
  totalChallenges: 4
};

export const module1Dataset = {
  tables: {
    students: {
      columns: [
        { name: 'id', type: 'INTEGER', isPK: true },
        { name: 'name', type: 'TEXT' },
        { name: 'age', type: 'INTEGER' },
        { name: 'city', type: 'TEXT' },
        { name: 'enrollment_date', type: 'TEXT' }
      ],
      rowCount: 5
    }
  },
  populateSql: `
    INSERT INTO students (id, name, age, city, enrollment_date) VALUES
    (1, 'Ana López', 22, 'CDMX', '2024-01-15'),
    (2, 'Luis Martínez', 24, 'Guadalajara', '2024-01-16'),
    (3, 'María González', 21, 'Monterrey', '2024-01-17'),
    (4, 'José Ramírez', 23, 'Puebla', '2024-01-18'),
    (5, 'Sofía Hernández', 20, 'Tijuana', '2024-01-19');
  `
};

export const module1Challenges = [
  {
    id: 1,
    title: 'La entidad completa',
    description: 'La tabla students representa la entidad "Estudiante". Escribe una consulta SQL para ver esa entidad completa: todos los registros, con todos sus atributos.',
    difficulty: 1,
    tables: ['students'],
    thinking: {
      question1: 'Todos los registros de la entidad',
      question2: 'students',
      question3: 'Todos los atributos (*)'
    },
    hints: [
      '¿Qué entidad necesitas consultar? La entidad Estudiante vive en la tabla students.',
      '¿Cuántos atributos quieres ver? Todos los que tenga la entidad.',
      'SELECT * FROM students;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const rows = table.values;
      const columns = table.columns;
      const isCorrect =
        rows.length === 5 &&
        columns.length === 5 &&
        columns.includes('id') &&
        columns.includes('name') &&
        columns.includes('age') &&
        columns.includes('city') &&
        columns.includes('enrollment_date');

      return {
        passed: isCorrect,
        message: '¡Excelente trabajo!',
        feedback: 'Obtuviste la entidad completa: cada fila es un estudiante, cada columna un atributo suyo.'
      };
    }
  },
  {
    id: 2,
    title: 'Un solo atributo',
    description: 'No siempre necesitas la entidad completa. Selecciona solo el atributo "nombre" de todos los estudiantes.',
    difficulty: 1,
    tables: ['students'],
    thinking: {
      question1: 'Un atributo de todos los registros',
      question2: 'students',
      question3: 'El atributo name'
    },
    hints: [
      '¿Qué atributo específico te piden? El nombre.',
      'En la tabla, ese atributo se llama name.',
      'SELECT name FROM students;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect =
        table.columns.length === 1 &&
        table.columns[0] === 'name' &&
        table.values.length === 5;

      return {
        passed: isCorrect,
        message: '¡Perfecto!',
        feedback: 'Proyectaste un solo atributo de la entidad, en vez de traerla completa.'
      };
    }
  },
  {
    id: 3,
    title: 'Dos atributos a la vez',
    description: 'Selecciona dos atributos de la entidad al mismo tiempo: el nombre y la ciudad de cada estudiante.',
    difficulty: 2,
    tables: ['students'],
    thinking: {
      question1: 'Dos atributos de todos los registros',
      question2: 'students',
      question3: 'Los atributos name y city'
    },
    hints: [
      '¿Qué atributos necesitas? Nombre y ciudad.',
      'Puedes pedir más de un atributo separándolos por coma.',
      'SELECT name, city FROM students;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect =
        table.columns.length === 2 &&
        table.columns.includes('name') &&
        table.columns.includes('city') &&
        table.values.length === 5;

      return {
        passed: isCorrect,
        message: '¡Muy bien!',
        feedback: 'Combinaste dos atributos de la misma entidad en una sola consulta.'
      };
    }
  },
  {
    id: 4,
    title: 'Filtrar por un atributo',
    description: 'No toda pregunta necesita a todos los estudiantes. Encuentra a los estudiantes cuya ciudad (un atributo) sea CDMX.',
    difficulty: 2,
    tables: ['students'],
    thinking: {
      question1: 'Solo los registros que cumplen una condición',
      question2: 'students',
      question3: 'Todos los atributos, filtrados por city = CDMX'
    },
    hints: [
      'Aquí no filtras columnas, filtras filas — según el valor de un atributo.',
      'WHERE decide qué filas sobreviven, según una condición sobre un atributo.',
      "SELECT * FROM students WHERE city = 'CDMX';"
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect =
        table.values.length === 1 &&
        table.values[0][1] === 'Ana López'; // columna name

      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'Filtraste la entidad por el valor de uno de sus atributos — la base de toda consulta relacional.'
      };
    }
  }
];
// data/module3-dataset.js
/**
 * Módulo 3 - Filtering
 * Mismo roster de 8 estudiantes que Módulo 2 (continuidad narrativa).
 */

export const module3Metadata = {
  id: 3,
  title: 'Filtering',
  displayTitle: 'SQL Avenger',
  emoji: '🦸‍♂️',
  range: '🦸‍♂️ SQL Avenger',
  totalChallenges: 8
};

export const module3Dataset = {
  tables: {
    students: {
      columns: [
        { name: 'id', type: 'INTEGER', isPK: true },
        { name: 'name', type: 'TEXT' },
        { name: 'age', type: 'INTEGER' },
        { name: 'city', type: 'TEXT' },
        { name: 'enrollment_date', type: 'TEXT' }
      ],
      rowCount: 8
    }
  },
  populateSql: `
    INSERT INTO students (id, name, age, city, enrollment_date) VALUES
    (1, 'Ana López', 22, 'CDMX', '2024-01-15'),
    (2, 'Luis Martínez', 24, 'Guadalajara', '2024-01-16'),
    (3, 'María González', 21, 'Monterrey', '2024-01-17'),
    (4, 'José Ramírez', 23, 'Puebla', '2024-01-18'),
    (5, 'Sofía Hernández', 20, 'Tijuana', '2024-01-19'),
    (6, 'Carlos Torres', NULL, 'CDMX', '2024-01-20'),
    (7, 'Elena Vidal', 22, 'Guadalajara', '2024-01-21'),
    (8, 'Pedro Sánchez', 25, 'Monterrey', NULL);
  `
};

function getColIndex(table, name) {
  return table.columns.findIndex(c => c.toLowerCase() === name.toLowerCase());
}

// IDs esperados por reto, precalculados sobre el roster de arriba.
const EXPECTED = {
  cdmx: [1, 6],
  between20_23: [1, 3, 4, 5, 7],
  cdmxOrPuebla: [1, 4, 6],
  likeA: [1],
  over21NotCdmx: [2, 4, 7, 8],
  enrollmentNotNull: [1, 2, 3, 4, 5, 6, 7], // excluye a Pedro (id 8)
  notInCdmxOrGdl: [3, 4, 5, 8],
  under21OrPuebla: [4, 5]
};

function idsMatch(table, expectedIds) {
  const idIdx = getColIndex(table, 'id');
  if (idIdx === -1) return false;
  const gotIds = table.values.map(row => row[idIdx]).sort((a, b) => a - b);
  const expected = [...expectedIds].sort((a, b) => a - b);
  return JSON.stringify(gotIds) === JSON.stringify(expected);
}

export const module3Challenges = [
  {
    id: 1,
    title: 'Estudiantes de CDMX',
    description: 'Selecciona todos los estudiantes cuya ciudad es CDMX.',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Necesitas filtrar filas, no columnas.',
      'WHERE filtra por una condición.',
      "SELECT * FROM students WHERE city = 'CDMX';"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.cdmx),
        message: '¡Correcto!',
        feedback: 'Filtraste correctamente por ciudad.'
      };
    }
  },
  {
    id: 2,
    title: 'Rango de edad',
    description: 'Selecciona los estudiantes con edad entre 20 y 23 años (inclusive).',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Podrías usar age >= 20 AND age <= 23...',
      '...pero hay un operador que hace justo eso en una sola condición.',
      'SELECT * FROM students WHERE age BETWEEN 20 AND 23;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.between20_23),
        message: '¡Bien hecho!',
        feedback: 'BETWEEN es inclusivo en ambos extremos, y lo usaste bien.'
      };
    }
  },
  {
    id: 3,
    title: 'Ciudades específicas',
    description: 'Selecciona los estudiantes que viven en CDMX o en Puebla.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Podrías encadenar OR, pero hay algo más legible para listas.',
      'IN te permite comparar contra varios valores a la vez.',
      "SELECT * FROM students WHERE city IN ('CDMX', 'Puebla');"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.cdmxOrPuebla),
        message: '¡Excelente!',
        feedback: 'IN es la forma idiomática de filtrar contra una lista de valores.'
      };
    }
  },
  {
    id: 4,
    title: 'Nombres que empiezan con A',
    description: 'Selecciona los estudiantes cuyo nombre empieza con la letra "A".',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Necesitas comparar un patrón de texto, no un valor exacto.',
      'LIKE compara patrones; % significa "cualquier cosa".',
      "SELECT * FROM students WHERE name LIKE 'A%';"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.likeA),
        message: '¡Correcto!',
        feedback: 'LIKE con % al final busca cualquier texto que empiece con "A".'
      };
    }
  },
  {
    id: 5,
    title: 'Mayores de 21 fuera de CDMX',
    description: 'Selecciona los estudiantes con más de 21 años que NO vivan en CDMX.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'Necesitas combinar dos condiciones.',
      'AND exige que ambas condiciones sean verdaderas.',
      "SELECT * FROM students WHERE age > 21 AND city != 'CDMX';"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.over21NotCdmx),
        message: '¡Muy bien!',
        feedback: 'Combinaste dos condiciones con AND correctamente.'
      };
    }
  },
  {
    id: 6,
    title: 'Fecha de inscripción registrada',
    description: 'Selecciona los estudiantes que sí tienen una fecha de inscripción registrada.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Uno de los estudiantes no tiene fecha de inscripción.',
      'IS NOT NULL es el opuesto de IS NULL.',
      'SELECT * FROM students WHERE enrollment_date IS NOT NULL;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.enrollmentNotNull),
        message: '¡Correcto!',
        feedback: 'Filtraste correctamente los registros con fecha de inscripción.'
      };
    }
  },
  {
    id: 7,
    title: 'Ciudades excluidas',
    description: 'Selecciona los estudiantes que NO vivan en CDMX ni en Guadalajara.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Podrías encadenar dos condiciones con AND y !=, pero para listas hay algo más directo.',
      'NOT IN es el opuesto de IN: excluye los valores de la lista.',
      "SELECT * FROM students WHERE city NOT IN ('CDMX', 'Guadalajara');"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.notInCdmxOrGdl),
        message: '¡Correcto!',
        feedback: 'NOT IN excluyó de una sola vez a los estudiantes de ambas ciudades.'
      };
    }
  },
  {
    id: 8,
    title: 'Jóvenes o de Puebla',
    description: 'Selecciona los estudiantes que tengan menos de 21 años, O que vivan en Puebla.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'A diferencia del reto de AND, aquí basta con que se cumpla una condición u otra.',
      'OR exige que AL MENOS UNA de las condiciones sea verdadera, no ambas.',
      "SELECT * FROM students WHERE age < 21 OR city = 'Puebla';"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: idsMatch(table, EXPECTED.under21OrPuebla),
        message: '¡Excelente!',
        feedback: 'Con OR, cada estudiante entra si cumple cualquiera de las dos condiciones — no hace falta que cumpla ambas, como pasaba con AND.'
      };
    }
  }
];
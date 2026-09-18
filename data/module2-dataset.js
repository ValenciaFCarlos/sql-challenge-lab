// data/module2-dataset.js
/**
 * Módulo 2 - SELECT Fundamentals
 * Continúa con la misma entidad central (students) que Módulo 1,
 * pero con un roster extendido a 8 filas para poder enseñar
 * DISTINCT, NULL, expresiones y alias con sentido pedagógico.
 * Este roster extendido (8 filas, 1 NULL en age, 1 NULL en
 * enrollment_date) se reutiliza sin cambios en Módulos 2 a 6.
 */

export const module2Metadata = {
  id: 2,
  title: 'SELECT Fundamentals',
  displayTitle: 'SQL Hero',
  emoji: '🦸',
  range: '🦸 SQL Hero',
  totalChallenges: 6
};

export const module2Dataset = {
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

// Referencia fija del roster (para que los validators no dependan de
// re-parsear el populateSql). Debe mantenerse en sync con el SQL de arriba.
const ROSTER = [
  { id: 1, name: 'Ana López', age: 22, city: 'CDMX', enrollment_date: '2024-01-15' },
  { id: 2, name: 'Luis Martínez', age: 24, city: 'Guadalajara', enrollment_date: '2024-01-16' },
  { id: 3, name: 'María González', age: 21, city: 'Monterrey', enrollment_date: '2024-01-17' },
  { id: 4, name: 'José Ramírez', age: 23, city: 'Puebla', enrollment_date: '2024-01-18' },
  { id: 5, name: 'Sofía Hernández', age: 20, city: 'Tijuana', enrollment_date: '2024-01-19' },
  { id: 6, name: 'Carlos Torres', age: null, city: 'CDMX', enrollment_date: '2024-01-20' },
  { id: 7, name: 'Elena Vidal', age: 22, city: 'Guadalajara', enrollment_date: '2024-01-21' },
  { id: 8, name: 'Pedro Sánchez', age: 25, city: 'Monterrey', enrollment_date: null }
];

// ------------------------------------------------------------------
// Helpers de validación (reutilizables por cualquier reto de este
// módulo). Buscan columnas POR NOMBRE, nunca por posición, para no
// penalizar respuestas válidas con distinto orden de columnas.
// ------------------------------------------------------------------
function getColIndex(table, name) {
  return table.columns.findIndex(c => c.toLowerCase() === name.toLowerCase());
}

function colValues(table, name) {
  const idx = getColIndex(table, name);
  if (idx === -1) return null;
  return table.values.map(row => row[idx]);
}

export const module2Challenges = [
  {
    id: 1,
    title: 'Nombres con alias',
    description: 'Selecciona el nombre y la ciudad de cada estudiante, mostrando las columnas como "nombre" y "ciudad".',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Necesitas renombrar columnas en el resultado, no en la tabla.',
      'AS te permite ponerle un alias a una columna.',
      'SELECT name AS nombre, city AS ciudad FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const hasNombre = getColIndex(table, 'nombre') !== -1;
      const hasCiudad = getColIndex(table, 'ciudad') !== -1;
      const isCorrect = hasNombre && hasCiudad && table.columns.length === 2 && table.values.length === 8;
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'Usaste AS correctamente para renombrar las columnas del resultado.'
      };
    }
  },
  {
    id: 2,
    title: 'Ciudades sin repetir',
    description: 'Muestra la lista de ciudades distintas donde viven los estudiantes (sin duplicados).',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Varias filas comparten la misma ciudad.',
      'DISTINCT elimina los valores duplicados del resultado.',
      'SELECT DISTINCT city FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const values = table.values.map(row => row[0]);
      const unique = new Set(values);
      const isCorrect = table.columns.length === 1 && values.length === 5 && unique.size === 5;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'Obtuviste las 5 ciudades únicas sin duplicados.'
      };
    }
  },
  {
    id: 3,
    title: 'El próximo cumpleaños',
    description: 'Muestra el nombre de cada estudiante junto con su edad más uno, en una columna llamada "proximo_cumple".',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Puedes hacer operaciones matemáticas directo en el SELECT.',
      'age + 1 calcula la edad del próximo cumpleaños.',
      'SELECT name, age + 1 AS proximo_cumple FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name');
      const calcIdx = getColIndex(table, 'proximo_cumple');
      if (nameIdx === -1 || calcIdx === -1) return null;

      const allCorrect = table.values.every(row => {
        const student = ROSTER.find(s => s.name === row[nameIdx]);
        if (!student) return false;
        if (student.age === null) return row[calcIdx] === null;
        return row[calcIdx] === student.age + 1;
      });

      return {
        passed: allCorrect && table.values.length === 8,
        message: '¡Perfecto!',
        feedback: 'Calculaste correctamente la edad +1 para cada estudiante.'
      };
    }
  },
  {
    id: 4,
    title: 'Estudiante sin edad registrada',
    description: 'Encuentra el nombre del estudiante cuya edad no está registrada (NULL).',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Un valor NULL no se compara con =, se usa IS NULL.',
      'WHERE age IS NULL filtra las filas sin edad.',
      'SELECT name FROM students WHERE age IS NULL;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name');
      if (nameIdx === -1) return null;
      const isCorrect = table.values.length === 1 && table.values[0][nameIdx] === 'Carlos Torres';
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'Encontraste al único estudiante sin edad registrada.'
      };
    }
  },
  {
    id: 5,
    title: 'Marcar como activos',
    description: 'Muestra el nombre de cada estudiante junto con una columna "estado" que siempre diga \'activo\'.',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'No necesitas leer ese valor de ninguna tabla.',
      'Un texto entre comillas es un valor literal, no una columna.',
      "SELECT name, 'activo' AS estado FROM students;"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const estadoIdx = getColIndex(table, 'estado');
      if (estadoIdx === -1) return null;
      const allActive = table.values.every(row => row[estadoIdx] === 'activo');
      return {
        passed: allActive && table.values.length === 8,
        message: '¡Bien hecho!',
        feedback: 'Agregaste correctamente una columna con un valor literal fijo.'
      };
    }
  },
  {
    id: 6,
    title: 'Ciudades ordenadas',
    description: 'Muestra las ciudades distintas ordenadas alfabéticamente, en una columna llamada "ciudad_unica".',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Combina lo que ya sabes: DISTINCT + alias.',
      'ORDER BY ordena el resultado final.',
      'SELECT DISTINCT city AS ciudad_unica FROM students ORDER BY ciudad_unica;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'ciudad_unica');
      if (idx === -1) return null;
      const values = table.values.map(row => row[idx]);
      const sorted = [...values].sort((a, b) => a.localeCompare(b));
      const isSorted = JSON.stringify(values) === JSON.stringify(sorted);
      const isCorrect = values.length === 5 && new Set(values).size === 5 && isSorted;
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'Combinaste DISTINCT, alias y ORDER BY correctamente.'
      };
    }
  }
];

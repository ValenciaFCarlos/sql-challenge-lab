// data/module5-dataset.js
/**
 * Módulo 5 - Aggregations
 * Mismo roster de 8 estudiantes.
 */

export const module5Metadata = {
  id: 5,
  title: 'Aggregations',
  displayTitle: 'SQL Super Saiyan',
  emoji: '🔥',
  range: '🔥 SQL Super Saiyan',
  totalChallenges: 8
};

export const module5Dataset = {
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

function firstValue(table) {
  if (!table.values.length) return null;
  return table.values[0][0];
}

function approxEqual(a, b, tolerance = 0.01) {
  return Math.abs(a - b) <= tolerance;
}

export const module5Challenges = [
  {
    id: 1,
    title: 'Total de estudiantes',
    description: 'Cuenta cuántos estudiantes hay en total.',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Necesitas contar filas, no valores de una columna específica.',
      'COUNT(*) cuenta todas las filas, sin importar NULLs.',
      'SELECT COUNT(*) FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 1 && firstValue(table) === 8;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'COUNT(*) cuenta las 8 filas de la tabla.'
      };
    }
  },
  {
    id: 2,
    title: 'Edad promedio',
    description: 'Calcula la edad promedio de los estudiantes.',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Necesitas una función que calcule el promedio.',
      'AVG ignora automáticamente los valores NULL.',
      'SELECT AVG(age) FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const value = firstValue(table);
      const isCorrect = table.values.length === 1 && approxEqual(value, 22.4286, 0.05);
      return {
        passed: isCorrect,
        message: '¡Perfecto!',
        feedback: 'AVG calculó el promedio ignorando el estudiante sin edad registrada.'
      };
    }
  },
  {
    id: 3,
    title: 'Edad mínima y máxima',
    description: 'Muestra en una sola consulta la edad mínima y la edad máxima registradas.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Puedes usar dos funciones de agregación en el mismo SELECT.',
      'MIN() y MAX().',
      'SELECT MIN(age), MAX(age) FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 1) return null;
      const row = table.values[0];
      const isCorrect = row.includes(20) && row.includes(25) && row.length === 2;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'MIN y MAX en la misma consulta.'
      };
    }
  },
  {
    id: 4,
    title: 'Total con nombre de columna',
    description: 'Cuenta los estudiantes y nombra el resultado como "total_estudiantes".',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'El resultado de una agregación también se puede renombrar.',
      'Usa AS igual que con cualquier otra columna.',
      'SELECT COUNT(*) AS total_estudiantes FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'total_estudiantes');
      const isCorrect = idx !== -1 && table.values[0][idx] === 8;
      return {
        passed: isCorrect,
        message: '¡Bien hecho!',
        feedback: 'Los alias también funcionan sobre columnas agregadas.'
      };
    }
  },
  {
    id: 5,
    title: 'Ciudades distintas',
    description: 'Cuenta cuántas ciudades distintas hay entre los estudiantes.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'No quieres contar filas repetidas de la misma ciudad.',
      'COUNT se puede combinar con DISTINCT.',
      'SELECT COUNT(DISTINCT city) FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 1 && firstValue(table) === 5;
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'COUNT(DISTINCT ...) evita contar ciudades repetidas.'
      };
    }
  },
  {
    id: 6,
    title: 'Edades realmente registradas',
    description: 'Cuenta cuántos estudiantes tienen una edad registrada (que no sea NULL).',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'COUNT(*) cuenta filas; COUNT(columna) cuenta valores no NULL de esa columna.',
      'Un estudiante no tiene edad registrada.',
      'SELECT COUNT(age) FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 1 && firstValue(table) === 7;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'COUNT(age) devuelve 7, no 8: ignora el registro con edad NULL. Esa es la diferencia clave con COUNT(*).'
      };
    }
  },
  {
    id: 7,
    title: 'Suma total de edades',
    description: 'Calcula la suma total de las edades registradas de todos los estudiantes.',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Necesitas una función que sume valores, no que los cuente ni los promedie.',
      'SUM ignora automáticamente los valores NULL, igual que AVG.',
      'SELECT SUM(age) FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 1 && firstValue(table) === 157;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'SUM sumó las 7 edades registradas (157), sin contar al estudiante con edad NULL.'
      };
    }
  },
  {
    id: 8,
    title: 'Estudiantes de una ciudad',
    description: 'Cuenta cuántos estudiantes hay registrados en Guadalajara.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Antes de agregar, primero necesitas quedarte solo con las filas que te interesan.',
      'WHERE filtra las filas ANTES de que COUNT las cuente.',
      "SELECT COUNT(*) FROM students WHERE city = 'Guadalajara';"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 1 && firstValue(table) === 2;
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'WHERE + COUNT: primero filtras, después agregas. Esta combinación es la antesala de GROUP BY, que verás en el próximo módulo.'
      };
    }
  }
];
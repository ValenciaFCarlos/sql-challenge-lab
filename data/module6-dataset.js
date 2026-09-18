// data/module6-dataset.js
/**
 * Módulo 6 - GROUP BY & HAVING
 * Mismo roster de 8 estudiantes.
 */

export const module6Metadata = {
  id: 6,
  title: 'GROUP BY & HAVING',
  displayTitle: 'SQL Dragon',
  emoji: '🐉',
  range: '🐉 SQL Dragon',
  totalChallenges: 8
};

export const module6Dataset = {
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

function rowsAsMap(table, keyCol, valCol) {
  const keyIdx = getColIndex(table, keyCol);
  const valIdx = getColIndex(table, valCol);
  if (keyIdx === -1 || valIdx === -1) return null;
  const map = {};
  table.values.forEach(row => { map[row[keyIdx]] = row[valIdx]; });
  return map;
}

export const module6Challenges = [
  {
    id: 1,
    title: 'Estudiantes por ciudad',
    description: 'Cuenta cuántos estudiantes hay en cada ciudad.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Necesitas una fila de resultado por cada ciudad distinta.',
      'GROUP BY agrupa filas antes de calcular la agregación.',
      'SELECT city, COUNT(*) FROM students GROUP BY city;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const countIdx = table.columns.findIndex((c, i) => i !== getColIndex(table, 'city'));
      const map = rowsAsMap(table, 'city', table.columns[countIdx] || table.columns[1]);
      if (!map) return null;
      const expected = { CDMX: 2, Guadalajara: 2, Monterrey: 2, Puebla: 1, Tijuana: 1 };
      const isCorrect = Object.keys(expected).every(city => map[city] === expected[city])
        && Object.keys(map).length === 5;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'GROUP BY city te da un conteo por cada ciudad distinta.'
      };
    }
  },
  {
    id: 2,
    title: 'Edad promedio por ciudad',
    description: 'Calcula la edad promedio de los estudiantes en cada ciudad.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Combina GROUP BY con una función de agregación distinta a COUNT.',
      'AVG dentro de cada grupo.',
      'SELECT city, AVG(age) FROM students GROUP BY city;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const cityIdx = getColIndex(table, 'city');
      const avgColIdx = table.columns.findIndex((c, i) => i !== cityIdx);
      if (cityIdx === -1 || avgColIdx === -1) return null;
      const expected = { CDMX: 22, Guadalajara: 23, Monterrey: 23, Puebla: 23, Tijuana: 20 };
      const isCorrect = table.values.length === 5 && table.values.every(row => {
        const city = row[cityIdx];
        const avg = row[avgColIdx];
        return expected[city] !== undefined && Math.abs(avg - expected[city]) <= 0.05;
      });
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'AVG(age) por ciudad ignora automáticamente al estudiante sin edad registrada.'
      };
    }
  },
  {
    id: 3,
    title: 'Solo ciudades con más de un estudiante',
    description: 'Muestra las ciudades que tienen más de un estudiante, junto con el conteo.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'No puedes usar WHERE para filtrar sobre un resultado agregado.',
      'HAVING filtra grupos, después de calcular la agregación.',
      "SELECT city, COUNT(*) AS n FROM students GROUP BY city HAVING n > 1;"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const cityIdx = getColIndex(table, 'city');
      if (cityIdx === -1) return null;
      const cities = table.values.map(r => r[cityIdx]).sort();
      const expected = ['CDMX', 'Guadalajara', 'Monterrey'].sort();
      return {
        passed: JSON.stringify(cities) === JSON.stringify(expected),
        message: '¡Perfecto!',
        feedback: 'HAVING filtró correctamente los grupos con más de un estudiante.'
      };
    }
  },
  {
    id: 4,
    title: 'WHERE antes, HAVING después',
    description: 'Cuenta estudiantes por ciudad, pero considerando solo a los mayores de 20 años.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'Este filtro es sobre filas individuales, no sobre el grupo.',
      'WHERE se aplica antes de agrupar.',
      'SELECT city, COUNT(*) FROM students WHERE age > 20 GROUP BY city;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const cityIdx = getColIndex(table, 'city');
      const countColIdx = table.columns.findIndex((c, i) => i !== cityIdx);
      if (cityIdx === -1 || countColIdx === -1) return null;
      const expected = { CDMX: 1, Guadalajara: 2, Monterrey: 2, Puebla: 1 };
      const map = {};
      table.values.forEach(row => { map[row[cityIdx]] = row[countColIdx]; });
      const isCorrect = Object.keys(expected).every(c => map[c] === expected[c])
        && Object.keys(map).length === 4
        && !('Tijuana' in map);
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'WHERE filtra filas antes de que GROUP BY las agrupe — por eso Tijuana desaparece del todo (Sofía tiene 20 años, no es mayor a 20).'
      };
    }
  },
  {
    id: 5,
    title: 'Ciudades con promedio de edad alto',
    description: 'Muestra las ciudades cuyo promedio de edad sea mayor o igual a 23 años.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'Necesitas GROUP BY + AVG + HAVING juntos.',
      'HAVING puede usar el resultado de AVG directamente.',
      'SELECT city, AVG(age) AS prom FROM students GROUP BY city HAVING prom >= 23;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const cityIdx = getColIndex(table, 'city');
      if (cityIdx === -1) return null;
      const cities = table.values.map(r => r[cityIdx]).sort();
      const expected = ['Guadalajara', 'Monterrey', 'Puebla'].sort();
      return {
        passed: JSON.stringify(cities) === JSON.stringify(expected),
        message: '¡Excelente!',
        feedback: 'Filtraste grupos usando el resultado de una agregación en HAVING.'
      };
    }
  },
  {
    id: 6,
    title: 'Agrupación por ciudad y edad',
    description: 'Agrupa a los estudiantes por ciudad y edad, y cuenta cuántos hay en cada combinación exacta.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'GROUP BY puede recibir más de una columna.',
      'Cada combinación distinta de (ciudad, edad) es un grupo.',
      'SELECT city, age, COUNT(*) FROM students GROUP BY city, age;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      // En este roster no hay dos estudiantes con la misma combinación
      // exacta de (ciudad, edad), así que cada grupo debe tener count = 1.
      const countIdx = table.columns.length - 1;
      const isCorrect = table.values.length === 8 && table.values.every(row => row[countIdx] === 1);
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'GROUP BY con dos columnas agrupa por la combinación exacta de ambas.'
      };
    }
  },
  {
    id: 7,
    title: 'Ciudades con más estudiantes primero',
    description: 'Cuenta los estudiantes por ciudad y muestra el resultado ordenado de mayor a menor cantidad.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'Ya sabes agrupar y contar. Ahora falta ordenar ese resultado.',
      'ORDER BY funciona igual sobre un resultado agrupado que sobre uno normal.',
      'SELECT city, COUNT(*) AS n FROM students GROUP BY city ORDER BY n DESC;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 5) return null;
      const cityIdx = getColIndex(table, 'city');
      const countIdx = table.columns.findIndex((c, i) => i !== cityIdx);
      if (cityIdx === -1 || countIdx === -1) return null;

      const counts = table.values.map(r => r[countIdx]);
      const isNonIncreasing = counts.every((c, i) => i === 0 || c <= counts[i - 1]);

      return {
        passed: isNonIncreasing,
        message: '¡Excelente!',
        feedback: 'GROUP BY y ORDER BY se combinan sin problema: primero se agrupa y agrega, después se ordena el resultado ya agregado.'
      };
    }
  },
  {
    id: 8,
    title: 'Ciudades con un solo estudiante',
    description: 'Muestra las ciudades que tienen exactamente un estudiante.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'No es "más de uno" ni "al menos", es un número exacto.',
      'HAVING también acepta el operador de igualdad.',
      'SELECT city, COUNT(*) AS n FROM students GROUP BY city HAVING n = 1;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const cityIdx = getColIndex(table, 'city');
      if (cityIdx === -1) return null;
      const cities = table.values.map(r => r[cityIdx]).sort();
      const expected = ['Puebla', 'Tijuana'].sort();
      return {
        passed: JSON.stringify(cities) === JSON.stringify(expected),
        message: '¡Correcto!',
        feedback: 'HAVING n = 1 filtra los grupos con exactamente un estudiante — a diferencia de HAVING n > 1, que usaste antes.'
      };
    }
  }
];
// data/module4-dataset.js
/**
 * Módulo 4 - Ordering & Result Control
 * Mismo roster de 8 estudiantes (Módulos 2-6 comparten esta base).
 */

export const module4Metadata = {
  id: 4,
  title: 'Ordering & Result Control',
  displayTitle: 'SQL Superhero',
  emoji: '⚡',
  range: '⚡ SQL Superhero',
  totalChallenges: 5
};

export const module4Dataset = {
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

export const module4Challenges = [
  {
    id: 1,
    title: 'De menor a mayor edad',
    description: 'Selecciona todos los estudiantes ordenados por edad, de menor a mayor.',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Necesitas ordenar el resultado completo.',
      'ORDER BY ordena filas; ASC es ascendente (por defecto).',
      'SELECT * FROM students ORDER BY age ASC;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const ageIdx = getColIndex(table, 'age');
      if (ageIdx === -1 || table.values.length !== 8) return null;
      // Se ignora la posición del NULL (SQLite lo puede poner primero o
      // último); lo que importa es que las edades conocidas queden en
      // orden no decreciente entre sí.
      const knownAges = table.values.map(r => r[ageIdx]).filter(a => a !== null);
      const isOrdered = knownAges.every((a, i) => i === 0 || a >= knownAges[i - 1]);
      return {
        passed: isOrdered,
        message: '¡Correcto!',
        feedback: 'Ordenaste correctamente por edad ascendente.'
      };
    }
  },
  {
    id: 2,
    title: 'Nombres en reversa',
    description: 'Selecciona todos los estudiantes ordenados por nombre, de la Z a la A.',
    difficulty: 1,
    tables: ['students'],
    hints: [
      'Necesitas el orden contrario al alfabético.',
      'DESC invierte el orden.',
      'SELECT * FROM students ORDER BY name DESC;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name');
      if (nameIdx === -1 || table.values.length !== 8) return null;
      const names = table.values.map(r => r[nameIdx]);
      const isOrdered = names.every((n, i) => i === 0 || n.localeCompare(names[i - 1]) <= 0);
      return {
        passed: isOrdered,
        message: '¡Bien hecho!',
        feedback: 'DESC invierte el orden correctamente.'
      };
    }
  },
  {
    id: 3,
    title: 'Los 3 más grandes',
    description: 'Selecciona a los 3 estudiantes de mayor edad.',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Necesitas ordenar y luego quedarte solo con algunos.',
      'LIMIT restringe cuántas filas se devuelven.',
      'SELECT * FROM students ORDER BY age DESC LIMIT 3;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idIdx = getColIndex(table, 'id');
      if (idIdx === -1) return null;
      const ids = table.values.map(r => r[idIdx]);
      const isCorrect = JSON.stringify(ids) === JSON.stringify([8, 2, 4]);
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'Encontraste correctamente a los 3 estudiantes de mayor edad, en orden.'
      };
    }
  },
  {
    id: 4,
    title: 'Segunda página',
    description: 'Ordena los estudiantes por id y muestra únicamente la 3ª y 4ª fila (salta las primeras 2, muestra 2).',
    difficulty: 2,
    tables: ['students'],
    hints: [
      'Necesitas "saltar" algunas filas antes de empezar a mostrar.',
      'OFFSET indica cuántas filas saltar antes del LIMIT.',
      'SELECT * FROM students ORDER BY id LIMIT 2 OFFSET 2;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idIdx = getColIndex(table, 'id');
      if (idIdx === -1) return null;
      const ids = table.values.map(r => r[idIdx]);
      const isCorrect = JSON.stringify(ids) === JSON.stringify([3, 4]);
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'LIMIT + OFFSET es la base de la paginación en SQL.'
      };
    }
  },
  {
    id: 5,
    title: 'Orden por ciudad y luego por edad',
    description: 'Ordena los estudiantes por ciudad (A-Z) y, dentro de cada ciudad, por edad de mayor a menor.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'Puedes ordenar por más de una columna a la vez.',
      'Cada columna en ORDER BY puede tener su propia dirección.',
      'SELECT * FROM students ORDER BY city ASC, age DESC;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const cityIdx = getColIndex(table, 'city');
      const ageIdx = getColIndex(table, 'age');
      if (cityIdx === -1 || ageIdx === -1 || table.values.length !== 8) return null;

      const rows = table.values.map(r => ({ city: r[cityIdx], age: r[ageIdx] }));

      // 1) Las ciudades deben aparecer agrupadas y en orden alfabético
      //    (una vez que "sales" de una ciudad no puedes volver a ella).
      const seenCities = [];
      for (const row of rows) {
        if (seenCities[seenCities.length - 1] !== row.city) {
          if (seenCities.includes(row.city)) {
            return { passed: false, message: 'Casi...', feedback: 'Las filas de una misma ciudad deben quedar juntas.' };
          }
          seenCities.push(row.city);
        }
      }
      const citiesSorted = [...seenCities].sort((a, b) => a.localeCompare(b));
      const citiesInOrder = JSON.stringify(seenCities) === JSON.stringify(citiesSorted);

      // 2) Dentro de cada ciudad, las edades conocidas deben ir de mayor a menor.
      let withinGroupOk = true;
      let lastCity = null;
      let lastAge = null;
      for (const row of rows) {
        if (row.city !== lastCity) {
          lastCity = row.city;
          lastAge = row.age;
          continue;
        }
        if (row.age !== null && lastAge !== null && row.age > lastAge) {
          withinGroupOk = false;
        }
        if (row.age !== null) lastAge = row.age;
      }

      return {
        passed: citiesInOrder && withinGroupOk,
        message: '¡Impresionante!',
        feedback: 'Ordenamiento por múltiples columnas, con distinta dirección cada una.'
      };
    }
  }
];

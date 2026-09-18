// data/module8-dataset.js
/**
 * Módulo 8 - Subqueries
 * Reutiliza exactamente el mismo esquema y datos que Módulo 7.
 */

export const module8Metadata = {
  id: 8,
  title: 'Subqueries',
  displayTitle: 'Grand Duke',
  emoji: '🎩',
  range: '🎩 Grand Duke',
  totalChallenges: 8
};

export const module8Dataset = {
  tables: {
    students: {
      columns: [
        { name: 'id', type: 'INTEGER', isPK: true },
        { name: 'name', type: 'TEXT' },
        { name: 'age', type: 'INTEGER' },
        { name: 'city', type: 'TEXT' }
      ],
      rowCount: 6
    },
    courses: {
      columns: [
        { name: 'course_id', type: 'INTEGER', isPK: true },
        { name: 'course_name', type: 'TEXT' },
        { name: 'credits', type: 'INTEGER' }
      ],
      rowCount: 4
    },
    enrollments: {
      columns: [
        { name: 'enrollment_id', type: 'INTEGER', isPK: true },
        { name: 'student_id', type: 'INTEGER' },
        { name: 'course_id', type: 'INTEGER' },
        { name: 'grade', type: 'REAL' }
      ],
      rowCount: 8
    }
  },
  populateSql: `
    INSERT INTO students (id, name, age, city) VALUES
    (1, 'Ana López', 22, 'CDMX'),
    (2, 'Luis Martínez', 24, 'Guadalajara'),
    (3, 'María González', 21, 'Monterrey'),
    (4, 'José Ramírez', 23, 'Puebla'),
    (5, 'Sofía Hernández', 20, 'Tijuana'),
    (6, 'Elena Vidal', 22, 'Guadalajara');

    INSERT INTO courses (course_id, course_name, credits) VALUES
    (101, 'SQL Básico', 3),
    (102, 'Bases de Datos', 4),
    (103, 'Estadística', 3),
    (104, 'Programación I', 5);

    INSERT INTO enrollments (enrollment_id, student_id, course_id, grade) VALUES
    (1, 1, 101, 9.0),
    (2, 1, 102, 8.5),
    (3, 2, 101, 9.0),
    (4, 3, 102, 9.5),
    (5, 3, 103, 6.0),
    (6, 5, 103, 8.0),
    (7, 5, 101, 10.0),
    (8, 3, 101, 7.0);
  `
};

function getColIndex(table, name) {
  return table.columns.findIndex(c => c.toLowerCase() === name.toLowerCase());
}

export const module8Challenges = [
  {
    id: 1,
    title: 'Estudiantes con una calificación sobresaliente',
    description: 'Encuentra los nombres de los estudiantes que tienen al menos una calificación mayor a 9.',
    difficulty: 3,
    tables: ['students', 'enrollments'],
    hints: [
      'Primero necesitas saber qué student_id tienen grade > 9.',
      'Esa lista de IDs se obtiene con una subconsulta.',
      'SELECT name FROM students WHERE id IN (SELECT student_id FROM enrollments WHERE grade > 9);'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['María González', 'Sofía Hernández'].sort();
      return {
        passed: JSON.stringify(names) === JSON.stringify(expected),
        message: '¡Correcto!',
        feedback: 'Usaste una subquery dentro de IN para filtrar por un criterio calculado.'
      };
    }
  },
  {
    id: 2,
    title: 'Estudiantes por encima del promedio',
    description: 'Encuentra los estudiantes con una edad mayor al promedio de edad de todos los estudiantes.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'Necesitas comparar cada fila contra un valor calculado sobre toda la tabla.',
      'Una subquery escalar devuelve un único valor que puedes usar en WHERE.',
      'SELECT name, age FROM students WHERE age > (SELECT AVG(age) FROM students);'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['Luis Martínez', 'José Ramírez'].sort();
      return {
        passed: JSON.stringify(names) === JSON.stringify(expected),
        message: '¡Excelente!',
        feedback: 'El promedio de edad es exactamente 22 — por eso Ana y Elena (22) quedan fuera: no son mayores, son iguales.'
      };
    }
  },
  {
    id: 3,
    title: 'Estudiantes con al menos una inscripción',
    description: 'Encuentra los estudiantes que están inscritos en al menos un curso.',
    difficulty: 3,
    tables: ['students', 'enrollments'],
    hints: [
      'No necesitas contar cuántas inscripciones tiene, solo si tiene alguna.',
      'EXISTS revisa si una subquery devuelve al menos una fila.',
      'SELECT name FROM students s WHERE EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.id);'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['Ana López', 'Luis Martínez', 'María González', 'Sofía Hernández'].sort();
      return {
        passed: JSON.stringify(names) === JSON.stringify(expected),
        message: '¡Correcto!',
        feedback: 'EXISTS es más eficiente que IN cuando solo te importa "¿hay al menos una fila?".'
      };
    }
  },
  {
    id: 4,
    title: 'Ciudades con edad promedio alta',
    description: 'Usando una subconsulta en el FROM, muestra las ciudades cuya edad promedio sea mayor a 21.',
    difficulty: 4,
    tables: ['students'],
    hints: [
      'Primero calcula el promedio por ciudad como si fuera una tabla temporal.',
      'Luego filtra sobre ese resultado intermedio.',
      'SELECT city, prom FROM (SELECT city, AVG(age) AS prom FROM students GROUP BY city) t WHERE prom > 21;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const cityIdx = getColIndex(table, 'city') !== -1 ? getColIndex(table, 'city') : 0;
      const cities = table.values.map(r => r[cityIdx]).sort();
      const expected = ['CDMX', 'Guadalajara', 'Puebla'].sort();
      return {
        passed: JSON.stringify(cities) === JSON.stringify(expected),
        message: '¡Impresionante!',
        feedback: 'Una subquery en el FROM se comporta como una tabla temporal que puedes filtrar.'
      };
    }
  },
  {
    id: 5,
    title: 'Estudiantes con 2 o más inscripciones',
    description: 'Encuentra los estudiantes que están inscritos en 2 o más cursos.',
    difficulty: 4,
    tables: ['students', 'enrollments'],
    hints: [
      'Necesitas contar inscripciones por estudiante, pero fila por fila de la tabla externa.',
      'Una subquery correlacionada hace referencia a la fila actual de la consulta externa.',
      'SELECT name FROM students s WHERE (SELECT COUNT(*) FROM enrollments e WHERE e.student_id = s.id) >= 2;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['Ana López', 'María González', 'Sofía Hernández'].sort();
      return {
        passed: JSON.stringify(names) === JSON.stringify(expected),
        message: '¡Excelente!',
        feedback: 'La subquery se re-ejecuta para cada fila de students — por eso es "correlacionada".'
      };
    }
  },
  {
    id: 6,
    title: 'Estudiantes sin ninguna inscripción',
    description: 'Encuentra los estudiantes que no están inscritos en ningún curso, usando una subconsulta (sin usar JOIN).',
    difficulty: 3,
    tables: ['students', 'enrollments'],
    hints: [
      'Es el mismo resultado que obtuviste con LEFT JOIN en el módulo anterior, pero con otro enfoque.',
      'NOT IN excluye a quienes SÍ aparecen en la subquery.',
      'SELECT name FROM students WHERE id NOT IN (SELECT student_id FROM enrollments);'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['José Ramírez', 'Elena Vidal'].sort();
      return {
        passed: JSON.stringify(names) === JSON.stringify(expected),
        message: '¡Correcto!',
        feedback: 'Mismo resultado que el LEFT JOIN de Módulo 7 — dos caminos distintos, misma respuesta.'
      };
    }
  },
  {
    id: 7,
    title: 'Edad junto al promedio general',
    description: 'Muestra el nombre y la edad de cada estudiante, junto con el promedio general de edad de todos los estudiantes en una tercera columna.',
    difficulty: 4,
    tables: ['students'],
    hints: [
      'Hasta ahora usaste subqueries en WHERE y en FROM. También pueden ir en el SELECT.',
      'Una subquery escalar en el SELECT se recalcula igual para cada fila.',
      'SELECT name, age, (SELECT AVG(age) FROM students) AS promedio_general FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 6) return null;
      const nameIdx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const ageIdx = getColIndex(table, 'age');
      const promIdx = table.columns.findIndex((c, i) => i !== nameIdx && i !== ageIdx);
      if (ageIdx === -1 || promIdx === -1) return null;

      const allMatch = table.values.every(row => Math.abs(row[promIdx] - 22.0) <= 0.05);

      return {
        passed: allMatch,
        message: '¡Correcto!',
        feedback: 'La subquery del SELECT no depende de la fila actual, así que el mismo promedio general (22.0) se repite en las 6 filas.'
      };
    }
  },
  {
    id: 8,
    title: 'Sin inscripciones, con NOT EXISTS',
    description: 'Encuentra los estudiantes que no están inscritos en ningún curso, esta vez usando NOT EXISTS.',
    difficulty: 3,
    tables: ['students', 'enrollments'],
    hints: [
      'Ya resolviste esto con NOT IN. NOT EXISTS es el opuesto de EXISTS, igual que NOT IN es el opuesto de IN.',
      'NOT EXISTS revisa que la subquery correlacionada NO devuelva ninguna fila.',
      'SELECT name FROM students s WHERE NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.id);'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['José Ramírez', 'Elena Vidal'].sort();
      const correctResult = JSON.stringify(names) === JSON.stringify(expected);
      const usesNotExists = /not\s+exists/i.test(query);

      return {
        passed: correctResult && usesNotExists,
        message: correctResult && !usesNotExists ? 'Resultado correcto, pero...' : '¡Correcto!',
        feedback: correctResult && !usesNotExists
          ? 'El resultado es correcto, pero este reto pide usar NOT EXISTS explícitamente.'
          : 'Mismo resultado que con NOT IN — NOT EXISTS suele preferirse cuando la subquery es correlacionada, como aquí.'
      };
    }
  }
];
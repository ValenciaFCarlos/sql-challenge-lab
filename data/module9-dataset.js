// data/module9-dataset.js
/**
 * Módulo 9 - CTEs
 * Reutiliza el esquema de Módulo 7/8. Los retos de este módulo exigen
 * usar la palabra clave WITH explícitamente (no basta con el resultado
 * correcto vía subquery equivalente) para que la práctica sea real.
 */

export const module9Metadata = {
  id: 9,
  title: 'CTEs',
  displayTitle: 'SQL King',
  emoji: '👑',
  range: '👑 SQL King',
  totalChallenges: 6
};

export const module9Dataset = {
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

function usesCTE(query) {
  return /\bwith\b/i.test(query);
}

export const module9Challenges = [
  {
    id: 1,
    title: 'Por encima del promedio, con CTE',
    description: 'Usando un CTE (WITH), encuentra los estudiantes con edad mayor al promedio de edad.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'Ya resolviste esto con subquery — ahora hazlo con WITH.',
      'WITH nombre AS (SELECT ...) SELECT ... FROM tabla, nombre WHERE ...',
      'WITH prom AS (SELECT AVG(age) AS a FROM students) SELECT s.name FROM students s, prom WHERE s.age > prom.a;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['Luis Martínez', 'José Ramírez'].sort();
      const correctResult = JSON.stringify(names) === JSON.stringify(expected);
      return {
        passed: correctResult && usesCTE(query),
        message: correctResult && !usesCTE(query) ? 'Resultado correcto, pero...' : '¡Correcto!',
        feedback: correctResult && !usesCTE(query)
          ? 'El resultado es correcto, pero este reto pide usar WITH explícitamente.'
          : 'Reescribiste la misma lógica usando un CTE.'
      };
    }
  },
  {
    id: 2,
    title: 'Cursos con buen promedio',
    description: 'Usando un CTE, encuentra los cursos cuyo promedio de calificación sea mayor a 8.',
    difficulty: 3,
    tables: ['courses', 'enrollments'],
    hints: [
      'Primero calcula el promedio por curso dentro del CTE.',
      'Luego filtra sobre ese resultado en el SELECT final.',
      'WITH promedios AS (SELECT course_id, AVG(grade) AS prom FROM enrollments GROUP BY course_id) SELECT * FROM promedios WHERE prom > 8;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'course_id') !== -1 ? getColIndex(table, 'course_id') : 0;
      const ids = table.values.map(r => r[idx]).sort();
      const expected = [101, 102].sort();
      const correctResult = JSON.stringify(ids) === JSON.stringify(expected);
      return {
        passed: correctResult && usesCTE(query),
        message: '¡Correcto!',
        feedback: correctResult && !usesCTE(query)
          ? 'El resultado es correcto, pero necesitas usar WITH en este reto.'
          : 'El curso 103 (Estadística) queda fuera porque su promedio es 7.0.'
      };
    }
  },
  {
    id: 3,
    title: 'Dos métricas en una fila',
    description: 'Usando dos CTEs, muestra en una sola fila el promedio de edad de los estudiantes y el promedio general de calificaciones.',
    difficulty: 4,
    tables: ['students', 'enrollments'],
    hints: [
      'Puedes definir varios CTEs separados por coma después de WITH.',
      'WITH a AS (...), b AS (...) SELECT * FROM a, b;',
      'WITH edad AS (SELECT AVG(age) AS prom_edad FROM students), notas AS (SELECT AVG(grade) AS prom_nota FROM enrollments) SELECT * FROM edad, notas;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 1) return null;
      const row = table.values[0];
      const hasAge = row.some(v => typeof v === 'number' && Math.abs(v - 22.0) <= 0.05);
      const hasGrade = row.some(v => typeof v === 'number' && Math.abs(v - 8.375) <= 0.05);
      const multipleCtes = (query.match(/\bas\s*\(/gi) || []).length >= 2;
      return {
        passed: hasAge && hasGrade && usesCTE(query) && multipleCtes,
        message: '¡Impresionante!',
        feedback: 'Combinaste dos CTEs independientes en una sola consulta final.'
      };
    }
  },
  {
    id: 4,
    title: 'CTE que usa a otro CTE',
    description: 'Usando dos CTEs encadenados (el segundo usa al primero), encuentra los cursos con 2 o más inscripciones.',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'El primer CTE cuenta inscripciones por curso.',
      'El segundo CTE selecciona del primero, filtrando por el conteo.',
      'WITH conteos AS (SELECT course_id, COUNT(*) AS n FROM enrollments GROUP BY course_id), filtrado AS (SELECT * FROM conteos WHERE n >= 2) SELECT * FROM filtrado;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'course_id') !== -1 ? getColIndex(table, 'course_id') : 0;
      const ids = table.values.map(r => r[idx]).sort();
      const expected = [101, 102, 103].sort();
      const correctResult = JSON.stringify(ids) === JSON.stringify(expected);
      const multipleCtes = (query.match(/\bas\s*\(/gi) || []).length >= 2;
      return {
        passed: correctResult && usesCTE(query) && multipleCtes,
        message: '¡Excelente!',
        feedback: 'Encadenaste un CTE que consume a otro CTE anterior.'
      };
    }
  },
  {
    id: 5,
    title: 'La misma pregunta, otra herramienta',
    description: 'Reescribe usando un CTE (WITH) la consulta que encuentra estudiantes con al menos una calificación mayor a 9.',
    difficulty: 3,
    tables: ['students', 'enrollments'],
    hints: [
      'Es exactamente el mismo resultado que ya obtuviste con subquery.',
      'La diferencia es solo de forma: WITH en vez de una subquery anidada.',
      'WITH altas AS (SELECT student_id FROM enrollments WHERE grade > 9) SELECT name FROM students WHERE id IN (SELECT student_id FROM altas);'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const idx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(r => r[idx]).sort();
      const expected = ['María González', 'Sofía Hernández'].sort();
      const correctResult = JSON.stringify(names) === JSON.stringify(expected);
      return {
        passed: correctResult && usesCTE(query),
        message: '¡Correcto!',
        feedback: 'Mismo resultado, ahora expresado como CTE en vez de subquery anidada.'
      };
    }
  },
  {
    id: 6,
    title: 'Créditos totales, con CTE',
    description: 'Usando un CTE, muestra el nombre de cada estudiante junto con el total de créditos de los cursos en los que está inscrito.',
    difficulty: 4,
    tables: ['students', 'enrollments', 'courses'],
    hints: [
      'Primero calcula, dentro del CTE, el total de créditos por student_id (necesitas JOIN con courses para conocer los créditos).',
      'Después une ese CTE con students para mostrar el nombre en vez del id.',
      'WITH creditos AS (SELECT e.student_id, SUM(c.credits) AS total FROM enrollments e JOIN courses c ON e.course_id = c.course_id GROUP BY e.student_id) SELECT s.name, cr.total FROM students s JOIN creditos cr ON s.id = cr.student_id;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const totalIdx = table.columns.findIndex((c, i) => i !== nameIdx);
      if (totalIdx === -1) return null;

      const expected = { 'Ana López': 7, 'Luis Martínez': 3, 'María González': 10, 'Sofía Hernández': 6 };
      const map = {};
      table.values.forEach(row => { map[row[nameIdx]] = row[totalIdx]; });
      const correctResult = Object.keys(expected).every(n => map[n] === expected[n]) && Object.keys(map).length === 4;

      return {
        passed: correctResult && usesCTE(query),
        message: correctResult && !usesCTE(query) ? 'Resultado correcto, pero...' : '¡Impresionante!',
        feedback: correctResult && !usesCTE(query)
          ? 'El resultado es correcto, pero este reto pide usar WITH explícitamente.'
          : 'El CTE calculó los créditos por estudiante primero, y el SELECT final solo se encargó de mostrar el nombre en vez del id.'
      };
    }
  }
];
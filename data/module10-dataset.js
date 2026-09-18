// data/module10-dataset.js
/**
 * Módulo 10 - Window Functions
 * Reutiliza el esquema de Módulos 7-9. El curso 101 (SQL Básico) tiene
 * un empate deliberado en la calificación (Ana y Luis, ambos 9.0) para
 * que RANK() y DENSE_RANK() produzcan resultados distintos y de verdad
 * se pueda enseñar la diferencia entre ambos.
 */

export const module10Metadata = {
  id: 10,
  title: 'Window Functions',
  displayTitle: 'Data Warlord',
  emoji: '🔥',
  range: '🔥 Data Warlord',
  totalChallenges: 10
};

export const module10Dataset = {
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

// student_id -> nombre, para leer resultados por nombre cuando la query
// selecciona student_id en vez de un JOIN a students.
const STUDENT_NAME = {
  1: 'Ana López', 2: 'Luis Martínez', 3: 'María González',
  4: 'José Ramírez', 5: 'Sofía Hernández', 6: 'Elena Vidal'
};

export const module10Challenges = [
  {
    id: 1,
    title: 'Numerar por edad',
    description: 'Numera a los estudiantes del 1 en adelante, ordenados por edad de mayor a menor.',
    difficulty: 3,
    tables: ['students'],
    hints: [
      'No es una agregación que colapsa filas — quieres conservar cada fila con un número extra.',
      'ROW_NUMBER() OVER (ORDER BY ...) asigna un número secuencial.',
      'SELECT name, ROW_NUMBER() OVER (ORDER BY age DESC) AS rn FROM students;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 6) return null;
      const nameIdx = getColIndex(table, 'name');
      const rnIdx = table.columns.findIndex((c, i) => i !== nameIdx);
      if (nameIdx === -1 || rnIdx === -1) return null;

      const rns = table.values.map(r => r[rnIdx]).sort((a, b) => a - b);
      const validSet = JSON.stringify(rns) === JSON.stringify([1, 2, 3, 4, 5, 6]);

      const rn1Row = table.values.find(r => r[rnIdx] === 1);
      const rn6Row = table.values.find(r => r[rnIdx] === 6);
      const extremesOk = rn1Row && rn1Row[nameIdx] === 'Luis Martínez' &&
        rn6Row && rn6Row[nameIdx] === 'Sofía Hernández';

      return {
        passed: validSet && extremesOk,
        message: '¡Correcto!',
        feedback: 'Luis (24, el mayor) queda en rn=1 y Sofía (20, la menor) en rn=6. El orden entre los empatados de 22 puede variar.'
      };
    }
  },
  {
    id: 2,
    title: 'Ranking de calificaciones por curso',
    description: 'Para cada inscripción, muestra su RANK() de calificación dentro de su curso (de mayor a menor).',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'PARTITION BY reinicia el conteo/ranking para cada grupo.',
      'RANK() dentro de cada curso, ordenado por grade descendente.',
      'SELECT student_id, course_id, grade, RANK() OVER (PARTITION BY course_id ORDER BY grade DESC) AS rnk FROM enrollments;'
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      if (!/\brank\s*\(/i.test(query)) {
        return { passed: false, message: null, feedback: null };
      }
      const studentIdx = getColIndex(table, 'student_id');
      const courseIdx = getColIndex(table, 'course_id');
      const rnkIdx = table.columns.findIndex((c, i) => i !== studentIdx && i !== courseIdx && i !== getColIndex(table, 'grade'));
      if (studentIdx === -1 || courseIdx === -1 || rnkIdx === -1) return null;

      // course 101: Sofía=1, Ana=2, Luis=2, María=4 (RANK salta el 3)
      const expected101 = { 5: 1, 1: 2, 2: 2, 3: 4 };
      const rowsFor101 = table.values.filter(r => r[courseIdx] === 101);
      const correct101 = rowsFor101.length === 4 && rowsFor101.every(r => expected101[r[studentIdx]] === r[rnkIdx]);

      return {
        passed: correct101,
        message: '¡Excelente!',
        feedback: 'En el curso 101, Ana y Luis empatan en el 2° lugar, y por eso María salta directo al 4° (RANK deja huecos).'
      };
    }
  },
  {
    id: 3,
    title: 'Ranking sin huecos',
    description: 'Para las inscripciones del curso 101 (SQL Básico), muestra su DENSE_RANK() de calificación (de mayor a menor).',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'Es casi el mismo reto anterior, pero con otra función.',
      'DENSE_RANK() no deja huecos después de un empate.',
      "SELECT student_id, grade, DENSE_RANK() OVER (ORDER BY grade DESC) AS rnk FROM enrollments WHERE course_id = 101;"
    ],
    validator: (data, query) => {
      const table = data[0];
      if (!table || !table.values) return null;
      if (!/dense_rank\s*\(/i.test(query)) {
        return { passed: false, message: null, feedback: null };
      }
      const studentIdx = getColIndex(table, 'student_id');
      const rnkIdx = table.columns.findIndex((c, i) => i !== studentIdx && i !== getColIndex(table, 'grade') && i !== getColIndex(table, 'course_id'));
      if (studentIdx === -1 || rnkIdx === -1) return null;

      // DENSE_RANK: Sofía=1, Ana=2, Luis=2, María=3 (sin huecos)
      const expected = { 5: 1, 1: 2, 2: 2, 3: 3 };
      const isCorrect = table.values.length === 4 && table.values.every(r => expected[r[studentIdx]] === r[rnkIdx]);

      return {
        passed: isCorrect,
        message: '¡Perfecto!',
        feedback: 'María queda en 3°, no en 4° — esa es la diferencia con RANK() del reto anterior.'
      };
    }
  },
  {
    id: 4,
    title: 'Calificación acumulada',
    description: 'Para las inscripciones de Ana López (student_id = 1), muestra su calificación acumulada ordenada por curso.',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'Necesitas una suma que se acumule fila por fila, sin colapsar el resultado.',
      'SUM() OVER (ORDER BY ...) calcula un total corriendo.',
      'SELECT course_id, grade, SUM(grade) OVER (ORDER BY course_id) AS acumulado FROM enrollments WHERE student_id = 1;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 2) return null;
      const courseIdx = getColIndex(table, 'course_id');
      const acumIdx = table.columns.findIndex((c, i) => i !== courseIdx && i !== getColIndex(table, 'grade'));
      if (courseIdx === -1 || acumIdx === -1) return null;

      const sorted = [...table.values].sort((a, b) => a[courseIdx] - b[courseIdx]);
      const okFirst = Math.abs(sorted[0][acumIdx] - 9.0) <= 0.01;
      const okSecond = Math.abs(sorted[1][acumIdx] - 17.5) <= 0.01;

      return {
        passed: okFirst && okSecond,
        message: '¡Correcto!',
        feedback: 'La suma acumulada va creciendo fila por fila, siguiendo el ORDER BY de la ventana.'
      };
    }
  },
  {
    id: 5,
    title: 'La calificación anterior',
    description: 'Para las inscripciones de Sofía Hernández (student_id = 5), muestra su calificación actual junto con la calificación del curso anterior (según course_id).',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'Necesitas "mirar hacia atrás" a la fila previa según el orden.',
      'LAG() trae el valor de la fila anterior en la ventana.',
      'SELECT course_id, grade, LAG(grade) OVER (ORDER BY course_id) AS anterior FROM enrollments WHERE student_id = 5;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 2) return null;
      const courseIdx = getColIndex(table, 'course_id');
      const lagIdx = table.columns.findIndex((c, i) => i !== courseIdx && i !== getColIndex(table, 'grade'));
      if (courseIdx === -1 || lagIdx === -1) return null;

      const sorted = [...table.values].sort((a, b) => a[courseIdx] - b[courseIdx]);
      const firstLagIsNull = sorted[0][lagIdx] === null;
      const secondLagCorrect = Math.abs(sorted[1][lagIdx] - 10.0) <= 0.01;

      return {
        passed: firstLagIsNull && secondLagCorrect,
        message: '¡Excelente!',
        feedback: 'La primera fila de la ventana no tiene "anterior", por eso LAG devuelve NULL ahí.'
      };
    }
  },
  {
    id: 6,
    title: 'Promedio sin colapsar filas',
    description: 'Muestra cada inscripción del curso 101 junto con el promedio general de calificación de ese curso, sin agrupar filas (deben verse las 4 inscripciones).',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'GROUP BY colapsaría el resultado a una sola fila por curso — no es lo que quieres.',
      'AVG() OVER (PARTITION BY ...) calcula el promedio sin perder el detalle de cada fila.',
      'SELECT student_id, grade, AVG(grade) OVER (PARTITION BY course_id) AS prom_curso FROM enrollments WHERE course_id = 101;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const gradeIdx = getColIndex(table, 'grade');
      const avgIdx = table.columns.findIndex((c, i) => i !== gradeIdx && i !== getColIndex(table, 'student_id') && i !== getColIndex(table, 'course_id'));
      if (avgIdx === -1) return null;

      const isCorrect = table.values.length === 4 &&
        table.values.every(r => Math.abs(r[avgIdx] - 8.75) <= 0.01);

      return {
        passed: isCorrect,
        message: '¡Impresionante!',
        feedback: 'Conservaste las 4 filas del curso y cada una muestra el mismo promedio general — eso es lo que distingue a una window function de un GROUP BY.'
      };
    }
  },
  {
    id: 7,
    title: 'La calificación siguiente',
    description: 'Para las inscripciones de Ana López (student_id = 1), muestra su calificación actual junto con la calificación del SIGUIENTE curso (según course_id).',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'Es el reto de LAG, pero mirando hacia adelante en vez de hacia atrás.',
      'LEAD() trae el valor de la fila siguiente en la ventana.',
      'SELECT course_id, grade, LEAD(grade) OVER (ORDER BY course_id) AS siguiente FROM enrollments WHERE student_id = 1;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 2) return null;
      const courseIdx = getColIndex(table, 'course_id');
      const leadIdx = table.columns.findIndex((c, i) => i !== courseIdx && i !== getColIndex(table, 'grade'));
      if (courseIdx === -1 || leadIdx === -1) return null;

      const sorted = [...table.values].sort((a, b) => a[courseIdx] - b[courseIdx]);
      const firstLeadCorrect = Math.abs(sorted[0][leadIdx] - 8.5) <= 0.01;
      const secondLeadIsNull = sorted[1][leadIdx] === null;

      return {
        passed: firstLeadCorrect && secondLeadIsNull,
        message: '¡Correcto!',
        feedback: 'La última fila de la ventana no tiene "siguiente", por eso LEAD devuelve NULL ahí — el espejo exacto de lo que viste con LAG.'
      };
    }
  },
  {
    id: 8,
    title: 'La calificación más alta del curso',
    description: 'Para las inscripciones del curso 101, muestra cada una junto con la calificación más alta de ese curso, repetida en cada fila.',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'No quieres el promedio (ya lo hiciste), quieres el valor máximo, pero obtenido como "el primero al ordenar".',
      'FIRST_VALUE() devuelve el primer valor de la ventana según el ORDER BY. Para que compare TODAS las filas y no solo hasta la actual, define el frame completo con ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.',
      'SELECT student_id, grade, FIRST_VALUE(grade) OVER (ORDER BY grade DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS la_mas_alta FROM enrollments WHERE course_id = 101;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const studentIdx = getColIndex(table, 'student_id');
      const gradeIdx = getColIndex(table, 'grade');
      const firstValIdx = table.columns.findIndex((c, i) => i !== studentIdx && i !== gradeIdx);
      if (firstValIdx === -1) return null;

      const isCorrect = table.values.length === 4 &&
        table.values.every(r => Math.abs(r[firstValIdx] - 10.0) <= 0.01);

      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'Las 4 filas muestran 10.0 (la calificación de Sofía, la más alta) — sin necesidad de un GROUP BY ni de perder el detalle de cada inscripción.'
      };
    }
  },
  {
    id: 9,
    title: 'Orden de inscripción por estudiante',
    description: 'Numera las inscripciones de cada estudiante, por separado, en el orden en que se inscribieron (según enrollment_id).',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'El número debe reiniciarse para cada estudiante — no es un ROW_NUMBER global.',
      'PARTITION BY student_id reinicia el conteo por cada estudiante.',
      'SELECT student_id, enrollment_id, ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY enrollment_id) AS num_inscripcion FROM enrollments;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 8) return null;
      const studentIdx = getColIndex(table, 'student_id');
      const enrollIdx = getColIndex(table, 'enrollment_id');
      const numIdx = table.columns.findIndex((c, i) => i !== studentIdx && i !== enrollIdx);
      if (studentIdx === -1 || enrollIdx === -1 || numIdx === -1) return null;

      // María (student_id 3) tiene 3 inscripciones: enrollment_id 4, 5, 8 → num 1, 2, 3
      const mariaRows = table.values.filter(r => r[studentIdx] === 3).sort((a, b) => a[enrollIdx] - b[enrollIdx]);
      const mariaOk = mariaRows.length === 3 &&
        mariaRows[0][numIdx] === 1 && mariaRows[1][numIdx] === 2 && mariaRows[2][numIdx] === 3;

      // Ana (student_id 1) tiene 2 inscripciones: enrollment_id 1, 2 → num 1, 2
      const anaRows = table.values.filter(r => r[studentIdx] === 1).sort((a, b) => a[enrollIdx] - b[enrollIdx]);
      const anaOk = anaRows.length === 2 && anaRows[0][numIdx] === 1 && anaRows[1][numIdx] === 2;

      return {
        passed: mariaOk && anaOk,
        message: '¡Perfecto!',
        feedback: 'PARTITION BY student_id hace que la numeración reinicie en 1 para cada estudiante — María llega hasta 3, Ana solo hasta 2, según cuántas inscripciones tenga cada quien.'
      };
    }
  },
  {
    id: 10,
    title: 'Acumulado de notas por estudiante',
    description: 'Para cada estudiante, muestra la suma acumulada de sus calificaciones en el orden en que se fue inscribiendo (según enrollment_id), sin mezclar el acumulado entre estudiantes distintos.',
    difficulty: 4,
    tables: ['enrollments'],
    hints: [
      'Es el mismo reto de "calificación acumulada" que ya hiciste para Ana, pero ahora para TODOS los estudiantes a la vez, sin que se mezclen entre sí.',
      'Combina PARTITION BY (para no mezclar estudiantes) con ORDER BY (para acumular en el orden correcto).',
      'SELECT student_id, enrollment_id, grade, SUM(grade) OVER (PARTITION BY student_id ORDER BY enrollment_id) AS acumulado FROM enrollments;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 8) return null;
      const studentIdx = getColIndex(table, 'student_id');
      const enrollIdx = getColIndex(table, 'enrollment_id');
      const gradeIdx = getColIndex(table, 'grade');
      const acumIdx = table.columns.findIndex((c, i) => i !== studentIdx && i !== enrollIdx && i !== gradeIdx);
      if (acumIdx === -1) return null;

      // María (student_id 3): enrollments 4(9.5), 5(6.0), 8(7.0) → acumulado 9.5, 15.5, 22.5
      const mariaRows = table.values.filter(r => r[studentIdx] === 3).sort((a, b) => a[enrollIdx] - b[enrollIdx]);
      const mariaOk = mariaRows.length === 3 &&
        Math.abs(mariaRows[0][acumIdx] - 9.5) <= 0.01 &&
        Math.abs(mariaRows[1][acumIdx] - 15.5) <= 0.01 &&
        Math.abs(mariaRows[2][acumIdx] - 22.5) <= 0.01;

      // Sofía (student_id 5): enrollments 6(8.0), 7(10.0) → acumulado 8.0, 18.0
      const sofiaRows = table.values.filter(r => r[studentIdx] === 5).sort((a, b) => a[enrollIdx] - b[enrollIdx]);
      const sofiaOk = sofiaRows.length === 2 &&
        Math.abs(sofiaRows[0][acumIdx] - 8.0) <= 0.01 &&
        Math.abs(sofiaRows[1][acumIdx] - 18.0) <= 0.01;

      return {
        passed: mariaOk && sofiaOk,
        message: '¡Impresionante!',
        feedback: 'PARTITION BY + ORDER BY juntos: el acumulado de María nunca se mezcla con el de Sofía, y dentro de cada una se acumula en el orden correcto de inscripción.'
      };
    }
  }
];
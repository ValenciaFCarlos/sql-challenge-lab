// data/module7-dataset.js
/**
 * Módulo 7 - JOINs
 * Primer módulo con esquema relacional: students + courses + enrollments.
 * Este mismo esquema se reutiliza sin cambios en Módulos 8, 9 y 10.
 *
 * Diseño deliberado del dataset:
 * - Luis (id 2) y Elena (id 6) comparten ciudad (Guadalajara) → habilita SELF JOIN.
 * - José (id 4) no tiene ninguna inscripción → habilita LEFT JOIN / NOT IN.
 * - Elena (id 6) tampoco tiene inscripciones.
 * - El curso "Programación I" (104) no tiene inscritos → habilita LEFT JOIN del lado de courses.
 * - Course 101 tiene un empate de calificación (Ana y Luis, ambos 9.0) → habilita
 *   distinguir RANK() de DENSE_RANK() en Módulo 10.
 */

export const module7Metadata = {
  id: 7,
  title: 'JOINs',
  displayTitle: 'SQL Princeps',
  emoji: '👑',
  range: '👑 SQL Princeps',
  totalChallenges: 10
};

export const module7Dataset = {
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

export const module7Challenges = [
  {
    id: 1,
    title: 'Estudiantes y sus cursos',
    description: 'Muestra el nombre de cada estudiante junto con el nombre del curso en el que está inscrito.',
    difficulty: 2,
    tables: ['students', 'courses', 'enrollments'],
    hints: [
      'Necesitas combinar 3 tablas: students, enrollments y courses.',
      'enrollments es la tabla puente que conecta a los otros dos.',
      'SELECT s.name, c.course_name FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.course_id;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      return {
        passed: table.values.length === 8 && table.columns.length === 2,
        message: '¡Correcto!',
        feedback: 'Combinaste 3 tablas para obtener estudiante + curso en cada fila.'
      };
    }
  },
  {
    id: 2,
    title: 'Estudiantes sin ningún curso',
    description: 'Encuentra los estudiantes que no están inscritos en ningún curso.',
    difficulty: 3,
    tables: ['students', 'enrollments'],
    hints: [
      'Un INNER JOIN normal los excluiría por completo del resultado.',
      'LEFT JOIN conserva todas las filas de students, aunque no tengan pareja en enrollments.',
      'SELECT s.name FROM students s LEFT JOIN enrollments e ON s.id = e.student_id WHERE e.student_id IS NULL;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name');
      if (nameIdx === -1) return null;
      const names = table.values.map(r => r[nameIdx]).sort();
      const expected = ['José Ramírez', 'Elena Vidal'].sort();
      return {
        passed: JSON.stringify(names) === JSON.stringify(expected),
        message: '¡Excelente!',
        feedback: 'LEFT JOIN + WHERE ... IS NULL es el patrón clásico para encontrar "los que no tienen".'
      };
    }
  },
  {
    id: 3,
    title: 'Estudiantes en cursos de alto crédito',
    description: 'Muestra el nombre (sin repetir) de los estudiantes inscritos en cursos de 4 créditos o más.',
    difficulty: 3,
    tables: ['students', 'courses', 'enrollments'],
    hints: [
      'Primero identifica qué cursos tienen 4+ créditos.',
      'Luego únelo con las inscripciones y con los estudiantes.',
      "SELECT DISTINCT s.name FROM students s JOIN enrollments e ON s.id=e.student_id JOIN courses c ON e.course_id=c.course_id WHERE c.credits >= 4;"
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name');
      if (nameIdx === -1) return null;
      const names = table.values.map(r => r[nameIdx]).sort();
      const expected = ['Ana López', 'María González'].sort();
      return {
        passed: JSON.stringify(names) === JSON.stringify(expected),
        message: '¡Bien hecho!',
        feedback: 'Filtraste correctamente a través de 3 tablas combinadas.'
      };
    }
  },
  {
    id: 4,
    title: 'Inscritos por curso',
    description: 'Cuenta cuántos estudiantes hay inscritos en cada curso (solo cursos con al menos 1 inscrito).',
    difficulty: 3,
    tables: ['courses', 'enrollments'],
    hints: [
      'JOIN + GROUP BY es una combinación muy común.',
      'Agrupa por el nombre del curso.',
      'SELECT c.course_name, COUNT(*) FROM courses c JOIN enrollments e ON c.course_id = e.course_id GROUP BY c.course_name;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'course_name') !== -1 ? getColIndex(table, 'course_name') : 0;
      const countIdx = table.columns.findIndex((c, i) => i !== nameIdx);
      const expected = { 'SQL Básico': 4, 'Bases de Datos': 2, 'Estadística': 2 };
      const map = {};
      table.values.forEach(row => { map[row[nameIdx]] = row[countIdx]; });
      const isCorrect = Object.keys(expected).every(c => map[c] === expected[c]) && Object.keys(map).length === 3;
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'El curso "Programación I" no aparece porque no tiene inscritos (INNER JOIN lo excluye).'
      };
    }
  },
  {
    id: 5,
    title: 'Estudiantes de la misma ciudad',
    description: 'Encuentra pares de estudiantes que viven en la misma ciudad (sin mostrar el mismo par dos veces ni comparar a un estudiante consigo mismo).',
    difficulty: 4,
    tables: ['students'],
    hints: [
      'Necesitas unir la tabla students consigo misma.',
      'Usa dos alias distintos para la misma tabla.',
      'SELECT a.name, b.name FROM students a JOIN students b ON a.city = b.city AND a.id < b.id;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const isCorrect = table.values.length === 1 &&
        table.values[0].includes('Luis Martínez') &&
        table.values[0].includes('Elena Vidal');
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'a.id < b.id evita duplicar el par y evita comparar a alguien consigo mismo.'
      };
    }
  },
  {
    id: 6,
    title: 'Todas las combinaciones (limitadas)',
    description: 'Genera todas las combinaciones posibles entre estudiantes y cursos, pero muestra solo las primeras 5.',
    difficulty: 2,
    tables: ['students', 'courses'],
    hints: [
      'No hay ninguna condición de unión aquí — quieres el producto cartesiano completo.',
      'CROSS JOIN combina cada fila de una tabla con cada fila de la otra.',
      'SELECT s.name, c.course_name FROM students s CROSS JOIN courses c LIMIT 5;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const validNames = ['Ana López', 'Luis Martínez', 'María González', 'José Ramírez', 'Sofía Hernández', 'Elena Vidal'];
      const validCourses = ['SQL Básico', 'Bases de Datos', 'Estadística', 'Programación I'];
      const isCorrect = table.values.length === 5 && table.values.every(row =>
        validNames.includes(row[0]) && validCourses.includes(row[1])
      );
      return {
        passed: isCorrect,
        message: '¡Correcto!',
        feedback: 'CROSS JOIN + LIMIT: generaste el producto cartesiano y lo recortaste.'
      };
    }
  },
  {
    id: 7,
    title: 'Cursos sin ningún inscrito',
    description: 'Encuentra los cursos que no tienen ningún estudiante inscrito.',
    difficulty: 3,
    tables: ['courses', 'enrollments'],
    hints: [
      'Es el mismo patrón del reto de "estudiantes sin curso", pero mirando desde el otro lado.',
      'LEFT JOIN desde courses hacia enrollments conserva todos los cursos, tengan o no inscritos.',
      'SELECT c.course_name FROM courses c LEFT JOIN enrollments e ON c.course_id = e.course_id WHERE e.enrollment_id IS NULL;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'course_name') !== -1 ? getColIndex(table, 'course_name') : 0;
      const names = table.values.map(r => r[nameIdx]);
      const isCorrect = table.values.length === 1 && names[0] === 'Programación I';
      return {
        passed: isCorrect,
        message: '¡Excelente!',
        feedback: 'El mismo patrón LEFT JOIN + IS NULL sirve para encontrar "los que no tienen" desde cualquiera de las dos tablas.'
      };
    }
  },
  {
    id: 8,
    title: 'Créditos totales por estudiante',
    description: 'Para cada estudiante inscrito en al menos un curso, muestra la suma de créditos de todos los cursos en los que está inscrito.',
    difficulty: 4,
    tables: ['students', 'enrollments', 'courses'],
    hints: [
      'Necesitas 3 tablas otra vez, pero ahora agregando en vez de solo listar.',
      'JOIN para traer los créditos de cada curso, GROUP BY para sumar por estudiante.',
      'SELECT s.name, SUM(c.credits) AS total_creditos FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.course_id GROUP BY s.name;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const totalIdx = table.columns.findIndex((c, i) => i !== nameIdx);
      if (totalIdx === -1) return null;

      const expected = { 'Ana López': 7, 'Luis Martínez': 3, 'María González': 10, 'Sofía Hernández': 6 };
      const map = {};
      table.values.forEach(row => { map[row[nameIdx]] = row[totalIdx]; });
      const isCorrect = Object.keys(expected).every(n => map[n] === expected[n]) && Object.keys(map).length === 4;

      return {
        passed: isCorrect,
        message: '¡Impresionante!',
        feedback: 'José y Elena no aparecen porque no tienen ninguna inscripción — el JOIN (no LEFT JOIN) los excluye, igual que en retos anteriores.'
      };
    }
  },
  {
    id: 9,
    title: 'Inscripciones con nota sobresaliente',
    description: 'Muestra el nombre del estudiante, el nombre del curso y la calificación, solo para las inscripciones con calificación mayor a 8.',
    difficulty: 3,
    tables: ['students', 'enrollments', 'courses'],
    hints: [
      'Combina el JOIN de 3 tablas con un WHERE sobre la calificación.',
      'El WHERE va sobre la tabla de enrollments, no sobre el resultado ya unido.',
      'SELECT s.name, c.course_name, e.grade FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.course_id WHERE e.grade > 8;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values) return null;
      const nameIdx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const gradeIdx = getColIndex(table, 'grade');
      if (gradeIdx === -1) return null;

      const allAboveEight = table.values.every(row => row[gradeIdx] > 8);
      const names = table.values.map(row => row[nameIdx]).sort();
      const expectedNames = ['Ana López', 'Ana López', 'Luis Martínez', 'María González', 'Sofía Hernández'].sort();

      return {
        passed: allAboveEight && table.values.length === 5 && JSON.stringify(names) === JSON.stringify(expectedNames),
        message: '¡Correcto!',
        feedback: 'Ana aparece dos veces porque tiene dos inscripciones con nota mayor a 8 — el JOIN no elimina duplicados por estudiante, cada fila es una inscripción.'
      };
    }
  },
  {
    id: 10,
    title: 'Estudiantes y cursos en orden alfabético',
    description: 'Muestra el nombre de cada estudiante junto con el curso en el que está inscrito, ordenado alfabéticamente por nombre de estudiante.',
    difficulty: 3,
    tables: ['students', 'enrollments', 'courses'],
    hints: [
      'Es la misma consulta del primer reto de este módulo, con un agregado.',
      'ORDER BY funciona igual sobre un resultado de JOIN que sobre cualquier otro.',
      'SELECT s.name, c.course_name FROM students s JOIN enrollments e ON s.id = e.student_id JOIN courses c ON e.course_id = c.course_id ORDER BY s.name;'
    ],
    validator: (data) => {
      const table = data[0];
      if (!table || !table.values || table.values.length !== 8) return null;
      const nameIdx = getColIndex(table, 'name') !== -1 ? getColIndex(table, 'name') : 0;
      const names = table.values.map(row => row[nameIdx]);
      const isOrdered = names.every((n, i) => i === 0 || n.localeCompare(names[i - 1]) >= 0);

      return {
        passed: isOrdered,
        message: '¡Excelente!',
        feedback: 'JOIN, GROUP BY, WHERE y ORDER BY se combinan libremente — ya usaste los cuatro juntos en este módulo.'
      };
    }
  }
];
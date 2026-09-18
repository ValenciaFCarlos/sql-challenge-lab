// data/module14-quiz.js
/**
 * Quiz final del Módulo 14 — SQL Performance.
 * Learning Mode, 10 preguntas, aprobación ≥ 6/10 (Roadmap Oficial).
 */

export const module14QuizMetadata = {
  id: 14,
  title: 'Quiz: SQL Performance',
  totalQuestions: 10,
  approvalThreshold: 6
};

export const module14QuizQuestions = [
  {
    id: 1,
    question: '¿Por qué una consulta lenta puede costarle dinero directo a una empresa?',
    options: [
      { id: 'a', text: 'Porque el SQL lento nunca da resultados correctos' },
      { id: 'b', text: 'Porque en la nube se paga por cómputo, y una consulta más lenta consume más recursos cada vez que se ejecuta' },
      { id: 'c', text: 'Porque las consultas lentas están prohibidas por el estándar SQL' },
      { id: 'd', text: 'No tiene relación con el costo, solo con la experiencia de usuario' }
    ],
    correctOptionId: 'b',
    explanation: 'En infraestructura cloud, el costo escala con el tiempo de cómputo usado. Una consulta que tarda más consume más recursos — y por lo tanto cuesta más — cada vez que se ejecuta.'
  },
  {
    id: 2,
    question: '¿Qué decide el optimizador de consultas de un motor de base de datos?',
    options: [
      { id: 'a', text: 'Qué resultado final debe devolver la consulta' },
      { id: 'b', text: 'Cómo ejecutar la consulta (qué índices usar, en qué orden hacer los JOINs), no qué resultado devolver' },
      { id: 'c', text: 'El nombre de las columnas de la tabla' },
      { id: 'd', text: 'El optimizador solo existe en PostgreSQL' }
    ],
    correctOptionId: 'b',
    explanation: 'SQL es declarativo: tú describes QUÉ quieres. El optimizador decide CÓMO obtenerlo — qué estrategia de ejecución usar — basándose en estadísticas de las tablas.'
  },
  {
    id: 3,
    question: '¿Cuál es el principal costo de agregar un índice a una tabla?',
    options: [
      { id: 'a', text: 'Los índices no tienen ningún costo' },
      { id: 'b', text: 'Ocupan espacio en disco y ralentizan las escrituras (INSERT/UPDATE/DELETE deben mantenerlos actualizados)' },
      { id: 'c', text: 'Hacen que las consultas SELECT sean más lentas' },
      { id: 'd', text: 'Solo funcionan en PostgreSQL, no en otros motores' }
    ],
    correctOptionId: 'b',
    explanation: 'Un índice acelera las lecturas, pero cada escritura (INSERT, UPDATE, DELETE) debe actualizar también el índice, y este ocupa espacio adicional en disco.'
  },
  {
    id: 4,
    question: 'En el resultado de EXPLAIN, ¿qué indica un "Seq Scan" sobre una tabla de millones de filas en una consulta frecuente?',
    options: [
      { id: 'a', text: 'Que la consulta tiene un error de sintaxis' },
      { id: 'b', text: 'Que probablemente falta un índice, ya que el motor está leyendo la tabla completa' },
      { id: 'c', text: 'Que la consulta ya está óptimamente indexada' },
      { id: 'd', text: 'Que el resultado será incorrecto' }
    ],
    correctOptionId: 'b',
    explanation: 'Seq Scan significa que el motor recorre la tabla fila por fila, sin usar ningún índice. En tablas grandes, esto suele ser una señal de que falta un índice útil.'
  },
  {
    id: 5,
    question: '¿Qué diferencia a EXPLAIN ANALYZE de un EXPLAIN simple?',
    options: [
      { id: 'a', text: 'EXPLAIN ANALYZE no muestra ningún plan de ejecución' },
      { id: 'b', text: 'EXPLAIN ANALYZE ejecuta la consulta de verdad y muestra tiempos reales, no solo estimados' },
      { id: 'c', text: 'Son exactamente lo mismo' },
      { id: 'd', text: 'EXPLAIN ANALYZE solo funciona con SELECT, nunca con JOIN' }
    ],
    correctOptionId: 'b',
    explanation: 'EXPLAIN solo estima el plan sin ejecutar nada. EXPLAIN ANALYZE sí ejecuta la consulta y compara los tiempos reales contra los estimados por el optimizador.'
  },
  {
    id: 6,
    question: '¿Qué columnas son las primeras candidatas a indexar quirúrgicamente para acelerar un JOIN?',
    options: [
      { id: 'a', text: 'Todas las columnas de tipo TEXT' },
      { id: 'b', text: 'Las columnas usadas en la condición ON del JOIN, típicamente Foreign Keys' },
      { id: 'c', text: 'Solo las columnas que aparecen en el SELECT' },
      { id: 'd', text: 'Ninguna, los JOINs no se benefician de índices' }
    ],
    correctOptionId: 'b',
    explanation: 'Sin un índice en la columna de unión, el motor debe comparar cada fila de una tabla contra todas las de la otra. Indexar las Foreign Keys usadas en el ON acelera esto drásticamente.'
  },
  {
    id: 7,
    question: '¿Por qué conviene filtrar con WHERE antes de agregar con GROUP BY, cuando el negocio lo permite?',
    options: [
      { id: 'a', text: 'Porque WHERE y GROUP BY no pueden usarse en la misma consulta' },
      { id: 'b', text: 'Porque menos filas para agrupar significa menos trabajo de ordenamiento/agrupación para el motor' },
      { id: 'c', text: 'Porque GROUP BY no funciona si hay un WHERE' },
      { id: 'd', text: 'No hay ninguna ventaja de performance en hacerlo' }
    ],
    correctOptionId: 'b',
    explanation: 'GROUP BY y DISTINCT requieren ordenar o agrupar datos internamente. Reducir el número de filas antes de esa operación (filtrando primero) reduce directamente ese costo.'
  },
  {
    id: 8,
    question: '¿Cuál de estos es un problema real de usar SELECT * en vez de nombrar las columnas?',
    options: [
      { id: 'a', text: 'SELECT * siempre genera un error de sintaxis' },
      { id: 'b', text: 'Puede impedir un "index-only scan" y transferir datos innecesarios' },
      { id: 'c', text: 'SELECT * no está permitido en PostgreSQL' },
      { id: 'd', text: 'No tiene ninguna desventaja real' }
    ],
    correctOptionId: 'b',
    explanation: 'SELECT * trae columnas que quizás no necesitas, aumentando el tráfico de datos, y puede impedir que el motor responda usando solo el índice sin tocar la tabla completa.'
  },
  {
    id: 9,
    question: '¿Por qué usar una función sobre una columna indexada dentro del WHERE (ej. WHERE UPPER(city) = \'CDMX\') puede ser un problema?',
    options: [
      { id: 'a', text: 'Porque las funciones no están permitidas en SQL' },
      { id: 'b', text: 'Porque puede impedir que el motor use el índice de esa columna, forzando un Seq Scan' },
      { id: 'c', text: 'Porque siempre da un resultado incorrecto' },
      { id: 'd', text: 'No tiene ningún efecto sobre el rendimiento' }
    ],
    correctOptionId: 'b',
    explanation: 'Un índice normal está construido sobre los valores originales de la columna. Si aplicas una función antes de comparar, el motor generalmente ya no puede aprovechar ese índice.'
  },
  {
    id: 10,
    question: 'En el caso real del módulo (dashboard lento de 8 segundos), ¿qué fue lo que realmente arregló el problema?',
    options: [
      { id: 'a', text: 'Reescribir la consulta con una sintaxis distinta' },
      { id: 'b', text: 'Agregar un índice en la columna usada para el JOIN, sin cambiar el SQL' },
      { id: 'c', text: 'Eliminar el JOIN por completo' },
      { id: 'd', text: 'Cambiar SELECT * por columnas específicas' }
    ],
    correctOptionId: 'b',
    explanation: 'El SQL nunca cambió. El problema era la falta de un índice en customer_id — al crearlo, el plan pasó de Seq Scan a Index Scan, bajando el tiempo de 8 segundos a 120 milisegundos.'
  }
];
// data/module15-quiz.js
/**
 * Quiz final del Módulo 15 — Analytics Engineering.
 * Learning Mode, 10 preguntas, aprobación ≥ 6/10 (Roadmap Oficial).
 */

export const module15QuizMetadata = {
  id: 15,
  title: 'Quiz: Analytics Engineering',
  totalQuestions: 10,
  approvalThreshold: 6
};

export const module15QuizQuestions = [
  {
    id: 1,
    question: '¿Qué vacío entre roles resuelve Analytics Engineering?',
    options: [
      { id: 'a', text: 'Reemplaza por completo a los Data Engineers' },
      { id: 'b', text: 'El espacio entre mover datos (Data Engineering) y responder preguntas de negocio (Analytics) — transformando datos crudos en tablas confiables' },
      { id: 'c', text: 'Es exactamente lo mismo que un Data Analyst' },
      { id: 'd', text: 'Solo se encarga de crear dashboards visuales' }
    ],
    correctOptionId: 'b',
    explanation: 'Analytics Engineering es el puente: usa SQL con prácticas de ingeniería de software para transformar datos crudos en tablas limpias, listas para que un analista las use.'
  },
  {
    id: 2,
    question: '¿Cuál es la diferencia principal entre ETL y ELT?',
    options: [
      { id: 'a', text: 'ETL no usa SQL; ELT sí' },
      { id: 'b', text: 'En ELT, los datos se cargan primero (crudos) y se transforman después dentro del warehouse con SQL' },
      { id: 'c', text: 'Son exactamente lo mismo, solo cambia el nombre' },
      { id: 'd', text: 'ETL es más moderno que ELT' }
    ],
    correctOptionId: 'b',
    explanation: 'ELT invierte el orden tradicional: se extraen y cargan los datos crudos primero, y la transformación ocurre después, dentro del warehouse, aprovechando su capacidad de cómputo.'
  },
  {
    id: 3,
    question: '¿Por qué la Raw Layer nunca se modifica ni se "corrige" directamente?',
    options: [
      { id: 'a', text: 'Porque los datos crudos siempre están perfectos' },
      { id: 'b', text: 'Porque es la fuente de verdad: si algo se rompe después, siempre se puede reconstruir todo desde ahí' },
      { id: 'c', text: 'Porque modificarla está prohibido por el estándar SQL' },
      { id: 'd', text: 'Porque no se puede consultar con SELECT' }
    ],
    correctOptionId: 'b',
    explanation: 'La Raw Layer se mantiene intacta precisamente para servir de fuente de verdad recuperable — cualquier corrección ocurre en capas posteriores, de forma repetible.'
  },
  {
    id: 4,
    question: '¿Qué tipo de transformación ocurre en la Staging Layer?',
    options: [
      { id: 'a', text: 'JOINs complejos entre múltiples tablas de negocio' },
      { id: 'b', text: 'Limpieza mínima: renombrar columnas, convertir tipos — sin lógica de negocio todavía' },
      { id: 'c', text: 'Cálculo de métricas finales para dashboards' },
      { id: 'd', text: 'Ninguna, la Staging Layer es idéntica a la Raw Layer' }
    ],
    correctOptionId: 'b',
    explanation: 'Staging hace limpieza básica y estandarización (nombres, tipos de datos), típicamente con una relación 1 a 1 con cada tabla cruda, sin introducir todavía lógica de negocio.'
  },
  {
    id: 5,
    question: '¿Por qué la lógica de negocio reutilizable (como "revenue por pedido") se calcula en la Intermediate Layer, en vez de repetirla en cada reporte final?',
    options: [
      { id: 'a', text: 'Porque la Mart Layer no permite cálculos' },
      { id: 'b', text: 'Para evitar recalcular la misma lógica en múltiples lugares, igual que evitar redundancia en normalización' },
      { id: 'c', text: 'Porque es obligatorio por la sintaxis de SQL' },
      { id: 'd', text: 'La Intermediate Layer no debería tener lógica de negocio' }
    ],
    correctOptionId: 'b',
    explanation: 'Si varios reportes finales necesitan la misma lógica, calcularla una sola vez en la capa intermedia evita duplicación y inconsistencias — el mismo principio de evitar redundancia visto en Data Modeling.'
  },
  {
    id: 6,
    question: '¿Qué caracteriza a las tablas de la Mart Layer?',
    options: [
      { id: 'a', text: 'Son datos crudos sin ninguna transformación' },
      { id: 'b', text: 'Son tablas listas para consumo de negocio, organizadas por dominio, a menudo con forma de Star Schema' },
      { id: 'c', text: 'Nunca se consultan directamente, solo sirven de respaldo' },
      { id: 'd', text: 'Solo existen en bases de datos NoSQL' }
    ],
    correctOptionId: 'b',
    explanation: 'La Mart Layer es el destino final: tablas listas para dashboards y analistas, normalmente organizadas por dominio de negocio (marketing, finanzas, producto) con la estructura de Star Schema.'
  },
  {
    id: 7,
    question: '¿Por qué "la consulta corrió sin error" no garantiza que los datos estén bien?',
    options: [
      { id: 'a', text: 'Porque SQL siempre tiene errores de sintaxis ocultos' },
      { id: 'b', text: 'Porque puede haber duplicados, FKs huérfanas o valores imposibles que no generan un error, solo un resultado incorrecto' },
      { id: 'c', text: 'Porque las consultas nunca devuelven resultados correctos' },
      { id: 'd', text: 'No es cierto, si corre sin error los datos siempre están bien' }
    ],
    correctOptionId: 'b',
    explanation: 'Errores como filas duplicadas, referencias huérfanas o valores fuera de rango no rompen la consulta — simplemente producen un resultado que parece válido pero no lo es.'
  },
  {
    id: 8,
    question: '¿Qué verifica un test de tipo "relationships" en un pipeline de datos?',
    options: [
      { id: 'a', text: 'Que una columna nunca tenga valores repetidos' },
      { id: 'b', text: 'Que todo valor de una Foreign Key exista realmente en la tabla que referencia' },
      { id: 'c', text: 'Que una columna nunca esté vacía' },
      { id: 'd', text: 'Que la tabla tenga al menos una fila' }
    ],
    correctOptionId: 'b',
    explanation: 'Un test de relationships confirma integridad referencial: que cada Foreign Key apunte a un valor que realmente existe en la tabla relacionada, evitando referencias huérfanas.'
  },
  {
    id: 9,
    question: '¿Cuál es la diferencia entre una vista (view) y una vista materializada?',
    options: [
      { id: 'a', text: 'No hay ninguna diferencia real' },
      { id: 'b', text: 'La vista se recalcula en cada consulta; la vista materializada guarda el resultado como una tabla y se refresca periódicamente' },
      { id: 'c', text: 'Las vistas materializadas siempre están desactualizadas' },
      { id: 'd', text: 'Las vistas no se pueden consultar con SELECT' }
    ],
    correctOptionId: 'b',
    explanation: 'Una vista recalcula su resultado cada vez que se consulta. Una vista materializada guarda el resultado físicamente como una tabla, sacrificando "estar siempre al día" a cambio de velocidad de lectura.'
  },
  {
    id: 10,
    question: '¿Qué aportó dbt a la práctica de transformar datos con SQL?',
    options: [
      { id: 'a', text: 'Reemplazó a SQL con un nuevo lenguaje de consultas' },
      { id: 'b', text: 'Aplicó prácticas de ingeniería de software (versionado, tests, documentación, manejo de dependencias) sobre modelos escritos en SQL normal' },
      { id: 'c', text: 'Eliminó la necesidad de escribir SELECT statements' },
      { id: 'd', text: 'Solo sirve para bases de datos NoSQL' }
    ],
    correctOptionId: 'b',
    explanation: 'dbt no cambia el SQL que escribes — cada modelo sigue siendo un SELECT. Lo que aporta es manejo de dependencias, tests automáticos y documentación, con prácticas tomadas de la ingeniería de software.'
  }
];
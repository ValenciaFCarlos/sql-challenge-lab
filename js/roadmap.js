// js/roadmap.js
import { syncBadges, resetBadges } from './badge-engine.js';
import { loadQuizResult } from './quiz-engine.js';

const modulesData = [
  { 
    id: 0, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Introducción a SQL",
    displayTitle: "SQL Baby",
    description: "¿Qué es SQL? ¿De dónde viene? ¿Vale la pena aprenderlo en el siglo XXI?",
    topic: "Fundamentos de SQL",
    introExplore: [
      "Qué es SQL, qué NO es SQL y de dónde surge.",
      "Qué es un dato, de dónde surge y cómo adquiere valor."
    ],
    introOutcomes: [
      "Entender qué es un modelo de datos.",
      "Interpretar datos dentro de un contexto relacional.",
      "Reconocer entidades, relaciones y estructuras de datos."
    ],
    competencies: ["SQL", "Bases de datos", "Ecosistema de datos", "Casos de uso"],
    difficulty: 1,
    exercises: 0,
    range: "👶 SQL Baby",
    isIntro: true
  },
  { 
    id: 1, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Mentalidad Relacional",
    displayTitle: "SQL Warrior",
    description: "Tu primera consulta SQL real, conectando entidades y atributos con SELECT y FROM.",
    topic: "Mentalidad Relacional",
    introExplore: [
      "Cómo pedirle información a una base de datos.",
      "Cómo una entidad (tabla) y sus atributos (columnas) se traducen a SQL real."
    ],
    introOutcomes: [
      "Formular consultas básicas con SELECT y FROM.",
      "Reconocer entidades y atributos dentro de una tabla real.",
      "Filtrar registros según el valor de un atributo."
    ],
    competencies: ["SELECT", "FROM", "WHERE", "Entidades", "Atributos"],
    difficulty: 1,
    exercises: 4,
    range: "⚔️ SQL Warrior",
    mentalModels: ["SELECT = qué atributos quiero ver", "FROM = de qué entidad vienen los datos"],
    isIntro: false
  },
  { 
    id: 2, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "SELECT Fundamentals",
    displayTitle: "SQL Hero",
    description: "SELECT, FROM, columnas, alias, DISTINCT, literales, expresiones y NULL.",
    topic: "Consulta de Datos",
    introExplore: [
      "Cómo pedirle información a una base de datos.",
      "Qué significa seleccionar, proyectar y renombrar."
    ],
    introOutcomes: [
      "Formular consultas básicas con SELECT y FROM.",
      "Trabajar con alias, literales y expresiones.",
      "Manejar valores nulos y registros duplicados."
    ],
    competencies: ["SELECT", "FROM", "Columnas", "Alias", "DISTINCT", "Literales", "Expresiones", "NULL"],
    difficulty: 1,
    exercises: 6,
    range: "🦸 SQL Hero",
    mentalModels: ["SELECT = qué quiero ver"]
  },
  { 
    id: 3, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Filtering",
    displayTitle: "SQL Avenger",
    description: "WHERE, operadores de comparación, lógicos, IN, BETWEEN, LIKE, IS NULL.",
    topic: "Filtrado de Datos",
    introExplore: [
      "Cómo quedarte solo con los registros que te interesan.",
      "Qué herramientas existen para filtrar información."
    ],
    introOutcomes: [
      "Aplicar condiciones con WHERE y operadores lógicos.",
      "Usar IN, BETWEEN, LIKE y NULL en filtros.",
      "Construir consultas precisas con múltiples condiciones."
    ],
    competencies: ["WHERE", "Operadores de comparación", "Operadores lógicos", "IN", "BETWEEN", "LIKE", "IS NULL"],
    difficulty: 2,
    exercises: 8,
    range: "🦸‍♂️ SQL Avenger",
    mentalModels: ["WHERE = qué filas sobreviven"]
  },
  { 
    id: 4, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Ordering & Result Control",
    displayTitle: "SQL Superhero",
    description: "ORDER BY, ASC/DESC, múltiples columnas, NULL ordering, LIMIT y OFFSET.",
    topic: "Ordenamiento y Control",
    introExplore: [
      "Cómo ordenar y limitar los resultados de una consulta.",
      "Qué sucede con los valores nulos al ordenar."
    ],
    introOutcomes: [
      "Controlar el orden y la cantidad de registros devueltos.",
      "Ordenar por múltiples columnas y criterios.",
      "Combinar filtros, ordenamiento y paginación."
    ],
    competencies: ["ORDER BY", "ASC/DESC", "Múltiples columnas", "NULL ordering", "LIMIT", "OFFSET"],
    difficulty: 2,
    exercises: 5,
    range: "⚡ SQL Superhero"
  },
  { 
    id: 5, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Aggregations",
    displayTitle: "SQL Super Saiyan",
    description: "COUNT, SUM, AVG, MIN, MAX, COUNT DISTINCT y NULL en agregaciones.",
    topic: "Funciones de Agregación",
    introExplore: [
      "Cómo convertir miles de filas en una sola métrica.",
      "Qué significa contar, sumar, promediar y comparar."
    ],
    introOutcomes: [
      "Calcular métricas agregadas con COUNT, SUM, AVG, MIN y MAX.",
      "Manejar valores nulos en agregaciones.",
      "Distinguir entre COUNT(*) y COUNT(DISTINCT columna)."
    ],
    competencies: ["COUNT", "SUM", "AVG", "MIN", "MAX", "COUNT DISTINCT", "NULL en agregaciones"],
    difficulty: 2,
    exercises: 8,
    range: "🔥 SQL Super Saiyan",
    mentalModels: ["Muchas filas → una métrica"]
  },
  { 
    id: 6, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "GROUP BY & HAVING",
    displayTitle: "SQL Dragon",
    description: "GROUP BY, múltiples columnas, HAVING, WHERE vs HAVING, agregaciones por categoría.",
    topic: "Agrupación y Filtrado",
    introExplore: [
      "Cómo calcular métricas para cada grupo por separado.",
      "Qué diferencia hay entre filtrar filas y filtrar grupos."
    ],
    introOutcomes: [
      "Construir métricas segmentadas con GROUP BY.",
      "Distinguir entre WHERE y HAVING.",
      "Razonar sobre datos agrupados y filtros de grupo."
    ],
    competencies: ["GROUP BY", "Múltiples columnas", "HAVING", "WHERE vs HAVING", "Agregaciones por categoría"],
    difficulty: 3,
    exercises: 8,
    range: "🐉 SQL Dragon",
    mentalModels: ["GROUP BY divide los datos en grupos antes de calcular"]
  },
  { 
    id: 7, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "JOINs",
    displayTitle: "SQL Princeps",
    description: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, CROSS JOIN, SELF JOIN y claves de unión.",
    topic: "Combinación de Tablas",
    introExplore: [
      "Cómo conectar datos que viven en diferentes tablas.",
      "Qué significa combinar información relacionada."
    ],
    introOutcomes: [
      "Razonar sobre poblaciones, cardinalidad y relaciones.",
      "Elegir entre INNER, LEFT, RIGHT y FULL JOIN.",
      "Interpretar la duplicación de filas en combinaciones."
    ],
    competencies: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "SELF JOIN", "ON", "Claves de unión"],
    difficulty: 3,
    exercises: 10,
    range: "👑 SQL Princeps",
    mentalModels: ["JOIN = combinar información relacionada"]
  },
  { 
    id: 8, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Subqueries",
    displayTitle: "Grand Duke",
    description: "Subconsultas en WHERE, FROM, SELECT, IN, EXISTS y correlated subqueries.",
    topic: "Subconsultas",
    introExplore: [
      "Cómo una consulta puede alimentar a otra consulta.",
      "Qué significa construir preguntas dentro de preguntas."
    ],
    introOutcomes: [
      "Estructurar consultas jerárquicas.",
      "Razonar sobre resultados intermedios.",
      "Diferenciar entre subconsultas simples y correlacionadas."
    ],
    competencies: ["Subconsultas en WHERE", "Subconsultas en FROM", "Subconsultas en SELECT", "IN", "EXISTS", "Correlated subqueries"],
    difficulty: 3,
    exercises: 8,
    range: "🎩 Grand Duke",
    mentalModels: ["Una consulta puede convertirse en el dato de otra consulta"]
  },
  { 
    id: 9, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "CTEs",
    displayTitle: "SQL King",
    description: "WITH, CTE, múltiples CTEs, encadenamiento, reutilización, CTE vs subquery.",
    topic: "Expresiones de Tabla Comunes",
    introExplore: [
      "Cómo hacer que las consultas complejas sean legibles.",
      "Qué significa dividir un problema en pasos claros."
    ],
    introOutcomes: [
      "Construir consultas paso a paso con CTEs.",
      "Reutilizar lógica compleja en una misma consulta.",
      "Comparar CTEs frente a subconsultas tradicionales."
    ],
    competencies: ["WITH", "CTE", "Múltiples CTEs", "Encadenamiento", "Reutilización", "CTE vs subquery"],
    difficulty: 4,
    exercises: 6,
    range: "👑 SQL King",
    mentalModels: ["Divide un problema grande en problemas pequeños"]
  },
  { 
    id: 10, 
    moduleType: 'practice', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Window Functions",
    displayTitle: "Data Warlord",
    description: "OVER, PARTITION BY, ORDER BY, ROW_NUMBER, RANK, LAG, LEAD, running totals.",
    topic: "Funciones de Ventana",
    introExplore: [
      "Cómo analizar filas comparándolas con otras.",
      "Qué significa rankear, acumular y comparar sin perder detalle."
    ],
    introOutcomes: [
      "Aplicar razonamiento analítico sobre particiones y orden.",
      "Calcular rankings, acumulados y comparaciones con LAG/LEAD.",
      "Distinguir entre agregación tradicional y funciones de ventana."
    ],
    competencies: ["OVER", "PARTITION BY", "ORDER BY en ventana", "ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "SUM OVER", "AVG OVER", "FIRST_VALUE"],
    difficulty: 4,
    exercises: 10,
    range: "🔥 Data Warlord",
    mentalModels: ["GROUP BY colapsa filas. Window Functions mantienen las filas"]
  },
  { 
    id: 11, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Business Analytics SQL",
    displayTitle: "SQL Overlord",
    description: "KPIs, métricas, revenue, conversion rate, retention, churn, cohortes y tendencias.",
    topic: "Analítica de Negocio",
    introExplore: [
      "Cómo transformar SQL en respuestas de negocio.",
      "Qué significa medir, comparar y analizar tendencias."
    ],
    introOutcomes: [
      "Construir KPIs, métricas y análisis de cohortes.",
      "Calcular revenue, conversion rate, retention y churn.",
      "Razonar sobre el comportamiento de usuarios y negocios."
    ],
    competencies: ["KPIs", "Métricas", "Revenue", "Conversion rate", "Retention", "Churn", "Cohortes", "Tendencias"],
    difficulty: 4,
    exercises: 0,
    quiz: 5, // preguntas del quiz final (Roadmap Oficial)
    range: "👑 SQL Overlord"
  },
  { 
    id: 12, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Data Modeling",
    displayTitle: "SQL Senator",
    description: "Entidades, relaciones, normalización, 1NF, 2NF, 3NF, Primary Keys, Foreign Keys y ER diagrams.",
    topic: "Modelado de Datos",
    introExplore: [
      "Cómo organizar los datos antes de consultarlos.",
      "Qué significa diseñar un esquema robusto."
    ],
    introOutcomes: [
      "Diseñar un modelo relacional desde requisitos reales.",
      "Aplicar normalización hasta 3NF.",
      "Identificar entidades, relaciones y restricciones."
    ],
    competencies: ["Entidades", "Relaciones", "Normalización", "1NF", "2NF", "3NF", "Primary Keys", "Foreign Keys", "ER diagrams"],
    difficulty: 4,
    exercises: 0,
    quiz: 5, // preguntas del quiz final (Roadmap Oficial)
    range: "🏛️ SQL Senator"
  },
  { 
    id: 13, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "PostgreSQL Core",
    displayTitle: "SQL Dictator",
    description: "Tipos de datos, SERIAL, TEXT, JSON/JSONB, arrays, fechas, funciones y características específicas.",
    topic: "PostgreSQL Avanzado",
    introExplore: [
      "Qué sucede cuando usamos un motor de base de datos real.",
      "Qué herramientas específicas ofrece PostgreSQL."
    ],
    introOutcomes: [
      "Trabajar con tipos avanzados: JSON, arrays y fechas.",
      "Usar funciones y operadores específicos de PostgreSQL.",
      "Construir consultas profesionales con características del motor."
    ],
    competencies: ["Tipos de datos", "SERIAL", "IDENTITY", "TEXT", "JSON/JSONB", "Arrays", "Fechas", "Funciones", "Casts"],
    difficulty: 4,
    exercises: 0,
    quiz: 5, // preguntas del quiz final (Roadmap Oficial)
    range: "⚔️ SQL Dictator"
  },
  { 
    id: 14, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "SQL Performance",
    displayTitle: "SQL Emperor",
    description: "Índices, query planner, EXPLAIN, EXPLAIN ANALYZE, optimización de consultas.",
    topic: "Optimización y Rendimiento",
    introExplore: [
      "Por qué una consulta correcta puede ser terriblemente lenta.",
      "Qué significa optimizar y planificar una ejecución."
    ],
    introOutcomes: [
      "Analizar planes de ejecución con EXPLAIN.",
      "Identificar cuellos de botella y estrategias de optimización.",
      "Construir consultas eficientes y escalables."
    ],
    competencies: ["Índices", "Query planner", "EXPLAIN", "EXPLAIN ANALYZE", "Sequential scan", "Index scan", "Optimización"],
    difficulty: 5,
    exercises: 0,
    quiz: 10, // preguntas del quiz final (Roadmap Oficial)
    range: "👑 SQL Emperor",
    mentalModels: ["SQL correcto ≠ SQL eficiente"]
  },
  { 
    id: 15, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Analytics Engineering",
    displayTitle: "SQL Grandmaster",
    description: "ETL vs ELT, staging, intermediate, marts, dimensional modeling, fact tables, dimension tables.",
    topic: "Ingeniería Analítica",
    introExplore: [
      "Cómo construir un sistema profesional de transformación de datos.",
      "Qué significa modelar datos para análisis y reporting."
    ],
    introOutcomes: [
      "Diseñar pipelines analíticos con SQL.",
      "Construir modelos dimensionales: facts y dimensions.",
      "Aplicar testing, documentación y trazabilidad de datos."
    ],
    competencies: ["ETL vs ELT", "Staging", "Intermediate", "Marts", "Dimensional modeling", "Fact tables", "Dimension tables", "Testing", "Documentación"],
    difficulty: 5,
    exercises: 0,
    quiz: 10, // preguntas del quiz final (Roadmap Oficial)
    range: "💎 SQL Grandmaster"
  },
  { 
    id: 16, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "SQL Interview Mastery",
    displayTitle: "SQL Illuminati",
    description: "Preguntas de entrevista, problemas ambiguos, debugging, optimización y razonamiento SQL.",
    topic: "Dominio de Entrevistas",
    introExplore: [
      "Cómo demostrar todo lo que sabes bajo presión.",
      "Qué significa resolver problemas ambiguos con SQL."
    ],
    introOutcomes: [
      "Resolver preguntas técnicas de entrevista con SQL.",
      "Debuggear y optimizar consultas en tiempo real.",
      "Explicar y justificar decisiones de diseño y razonamiento."
    ],
    competencies: ["Preguntas de entrevista", "Problemas ambiguos", "Debugging", "Optimización", "Razonamiento SQL", "Casos de negocio"],
    difficulty: 5,
    exercises: 0,
    quiz: 10, // preguntas del quiz final (Roadmap Oficial)
    range: "👁️ SQL Illuminati"
  },
  { 
    id: 17, 
    moduleType: 'learning', // Learning Mode o Practice Mode (Roadmap Oficial)
    title: "Community Challenge",
    displayTitle: "SQL GOD",
    description: "Crea un desafío SQL original para la comunidad.",
    topic: "Contribución Comunitaria",
    introExplore: [
      "Cómo crear un problema que otros SQL Challengers puedan resolver.",
      "Qué significa diseñar un desafío educativo."
    ],
    introOutcomes: [
      "Diseñar un problema con contexto, dataset y solución esperada.",
      "Definir casos límite y pruebas para validar soluciones.",
      "Contribuir a la comunidad con conocimiento original."
    ],
    competencies: ["Creación de desafíos", "Diseño de problemas", "Originalidad", "Comunidad"],
    difficulty: 5,
    exercises: 0,
    quiz: 10, // preguntas del quiz final (Roadmap Oficial)
    range: "☠️ SQL GOD",
    isGodMode: true
  }
];

let moduleStatus = {};
let moduleProgress = {};
let currentModuleId = 0;
let currentStage = 'theory';

// ================================================================
// PERSISTENCIA (localStorage)
// ================================================================
// Mismo patrón que ya usa challenge-engine.js para el progreso de
// retos individuales (module_{id}_progress), pero aquí guardamos el
// estado GENERAL del roadmap: qué módulos están desbloqueados/
// completados y en qué etapa va cada uno. Sin esto, recargar la
// página resetea todo el avance del mapa de módulos.
const ROADMAP_STORAGE_KEY = 'sqlChallengeLab_roadmapState';
const ROADMAP_STORAGE_VERSION = 1;

function saveRoadmapState() {
  // Cualquier módulo que haya quedado "completed" en esta mutación
  // recibe su badge aquí — un solo punto de verdad, sin importar por
  // cuál de los caminos (completeStage, updateModuleStatus externo,
  // etc.) llegó a ese estado.
  syncBadges(modulesData, getModuleStatus);

  try {
    const payload = {
      version: ROADMAP_STORAGE_VERSION,
      moduleStatus,
      moduleProgress,
      currentModuleId
    };
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('⚠️ No se pudo guardar el progreso del roadmap:', err);
  }
}

/**
 * Carga el estado persistido, si existe y es válido.
 * Devuelve true si se cargó algo utilizable, false si hay que
 * arrancar desde cero (primera visita, dato corrupto, o versión
 * incompatible).
 */
function loadRoadmapState() {
  let raw;
  try {
    raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
  } catch (err) {
    console.warn('⚠️ localStorage no disponible:', err);
    return false;
  }
  if (!raw) return false;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.warn('⚠️ Progreso del roadmap corrupto, se ignora:', err);
    return false;
  }

  if (!parsed || parsed.version !== ROADMAP_STORAGE_VERSION) {
    console.warn('⚠️ Progreso del roadmap de una versión incompatible, se ignora.');
    return false;
  }

  moduleStatus = parsed.moduleStatus || {};
  moduleProgress = parsed.moduleProgress || {};
  currentModuleId = typeof parsed.currentModuleId === 'number' ? parsed.currentModuleId : 0;

  // Saneamiento: si el contenido de un módulo cambió (ej. Módulo 1 pasó
  // de 6 a 4 ejercicios en una migración), un progreso guardado con
  // exercisesDone: [4, 5] ya no tiene sentido y rompería getExerciseStatus.
  // Se descartan índices fuera de rango en vez de fallar silenciosamente.
  modulesData.forEach(mod => {
    const progress = moduleProgress[mod.id];
    if (progress && Array.isArray(progress.exercisesDone)) {
      const totalExercises = mod.exercises || 0;
      progress.exercisesDone = progress.exercisesDone.filter(
        idx => Number.isInteger(idx) && idx >= 0 && idx < totalExercises
      );
    }
  });

  return true;
}

function getInitialStatus(moduleId) {
  if (moduleId === 0) return "available";
  return "locked";
}

function getInitialProgress() {
  return {
    theoryCompleted: false,
    conceptsCompleted: false,
    practiceCompleted: false,
    exercisesDone: []
  };
}

function getModuleStatus(moduleId) {
  if (!moduleStatus[moduleId]) {
    moduleStatus[moduleId] = getInitialStatus(moduleId);
  }
  return moduleStatus[moduleId];
}

function getModuleProgress(moduleId) {
  if (!moduleProgress[moduleId]) {
    moduleProgress[moduleId] = getInitialProgress();
  }
  return moduleProgress[moduleId];
}

function calculateProgress(moduleId) {
  const progress = getModuleProgress(moduleId);
  const mod = modulesData[moduleId];
  let completed = 0;
  let total = 0;
  
  if (mod.isIntro) {
    return progress.theoryCompleted ? 100 : 0;
  }
  
  if (mod.isGodMode) {
    return 0;
  }
  
  if (progress.theoryCompleted) completed++;
  total++;
  if (progress.conceptsCompleted) completed++;
  total++;
  if (progress.practiceCompleted) completed++;
  total++;
  
  return Math.round((completed / total) * 100);
}

function getExerciseStatus(moduleId, exerciseIdx) {
  const progress = getModuleProgress(moduleId);
  const status = getModuleStatus(moduleId);
  
  if (status === "locked") return "locked";
  if (status === "completed") return "done";
  if (progress.practiceCompleted) return "done";
  
  if (!progress.theoryCompleted) return "locked";
  if (!progress.conceptsCompleted) return "locked";
  
  if (progress.exercisesDone && progress.exercisesDone.includes(exerciseIdx)) {
    return "done";
  }
  
  return "pending";
}

function renderStars(difficulty) {
  const maxStars = 5;
  let stars = '';
  for (let i = 0; i < maxStars; i++) {
    stars += i < difficulty ? '★' : '☆';
    if (i < maxStars - 1) stars += ' ';
  }
  return stars;
}

function openModuleTerminal(moduleId) {
  const mod = modulesData[moduleId];
  if (!mod) return;
  
  const modal = document.createElement('div');
  modal.className = 'terminal-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  
  modal.innerHTML = `
    <div class="terminal-overlay"></div>
    <div class="terminal-content">
      <div class="terminal-header">
        <div class="terminal-dots">
          <span class="terminal-dot red"></span>
          <span class="terminal-dot yellow"></span>
          <span class="terminal-dot green"></span>
        </div>
        <span class="terminal-title">SQL Challenge Lab™ — Terminal</span>
        <button class="terminal-close" aria-label="Cerrar modal">✕</button>
      </div>
      <div class="terminal-body">
        <div class="terminal-output" id="terminal-output">
          <span class="cursor-blink">█</span>
        </div>
        <div class="terminal-input-area" style="display:none;">
          <span class="prompt">▶</span>
          <input type="text" class="terminal-input" id="terminal-input" autofocus placeholder="Y/N">
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  const output = document.getElementById('terminal-output');
  const closeBtn = modal.querySelector('.terminal-close');
  const overlay = modal.querySelector('.terminal-overlay');
  
  let lines = [];
  let currentLine = 0;
  let charIndex = 0;
  let typingInterval = null;
  let skipAnimation = false;
  
  const rank = mod.range || 'SQL Challenger';
  const moduleTitle = mod.title || `Módulo ${mod.id}`;
  const displayTitle = mod.displayTitle || moduleTitle;
  const topic = mod.topic || 'SQL';
  const difficulty = mod.difficulty || 1;
  const mentalModels = mod.mentalModels || [];
  const explore = mod.introExplore || ["Explora los conceptos fundamentales de este módulo."];
  const outcomes = mod.introOutcomes || ["Desarrolla competencias clave en SQL."];
  
  // Content lines
  if (mod.isIntro) {
    lines = [
      `> MÓDULO: ${moduleTitle}`,
      `> RANGO: ${rank}`,
      `> TEMA: ${topic}`,
      ``,
      `> EN ESTE MÓDULO EXPLORARÁS:`,
      ...explore.map(e => `  ${e}`),
      ``,
      `> AL FINALIZAR ESTE MÓDULO PODRÁS:`,
      ...outcomes.map(o => `  ${o}`),
      ``,
      `> DIFICULTAD:`,
      `  ${renderStars(difficulty)}`
    ];
  } else if (mod.isGodMode) {
    lines = [
      `> MÓDULO: ${moduleTitle}`,
      `> RANGO: ☠️ SQL GOD`,
      ``,
      `> EN ESTE MÓDULO EXPLORARÁS:`,
      ...explore.map(e => `  ${e}`),
      ``,
      `> AL FINALIZAR ESTE MÓDULO PODRÁS:`,
      ...outcomes.map(o => `  ${o}`),
      ``,
      `> DIFICULTAD:`,
      `  ${renderStars(difficulty)}`
    ];
  } else {
    lines = [
      `> MÓDULO: ${moduleTitle}`,
      `> RANGO: ${rank}`,
      `> TEMA: ${topic}`,
      ``,
      `> EN ESTE MÓDULO EXPLORARÁS:`,
      ...explore.map(e => `  ${e}`),
      ``,
      `> AL FINALIZAR ESTE MÓDULO PODRÁS:`,
      ...outcomes.map(o => `  ${o}`),
      ``,
      `> DIFICULTAD:`,
      `  ${renderStars(difficulty)}`
    ];
    
    if (mentalModels.length > 0) {
      lines.push(``);
      lines.push(`> MODELOS MENTALES:`);
      mentalModels.forEach(mm => lines.push(`  ✓ ${mm}`));
    }
  }
  
  // Animation sequence
  const animSequence = [
    { text: '> NEW CHALLENGER DETECTED', delay: 0 },
    { text: '> INITIATING CONNECTION...', delay: 0 },
    { text: '> PING...', delay: 0.125, blink: true },
    { text: '> PING... 192.168.1.101', delay: 0 },
    { text: '> AUTHENTICATING...', delay: 0.125, blink: true },
    { text: '> AUTHENTICATING... SUCCESSFUL', delay: 0 },
    { text: '> LOADING SQL SERVER COMPONENTS...', delay: 0 },
    { text: '> NODE PORT...', delay: 0.125, blink: true },
    { text: '> NODE PORT... 5432', delay: 0 },
    { text: '> LAUNCHING MODULE...', delay: 0.125, final: true }
  ];
  
  let animIndex = 0;
  let currentLineElement = null;
  
  function animateSequence() {
    if (skipAnimation) {
      return;
    }
    
    if (animIndex >= animSequence.length) {
      setTimeout(typeContentLine, 200);
      return;
    }
    
    const item = animSequence[animIndex];
    
    if (currentLineElement) {
      currentLineElement.remove();
    }
    
    currentLineElement = document.createElement('div');
    currentLineElement.className = 'terminal-line';
    output.appendChild(currentLineElement);
    output.scrollTop = output.scrollHeight;
    
    if (item.blink) {
      let blinkCount = 0;
      const maxBlinks = 4;
      let baseText = item.text;
      
      function blinkDots() {
        if (blinkCount >= maxBlinks || skipAnimation) {
          currentLineElement.textContent = baseText;
          output.scrollTop = output.scrollHeight;
          animIndex++;
          setTimeout(animateSequence, item.delay || 50);
          return;
        }
        
        const dotCount = (blinkCount % 3) + 1;
        const dots = '.'.repeat(dotCount);
        const textWithoutDots = baseText.replace(/\.{3}$/, '');
        currentLineElement.textContent = textWithoutDots + dots;
        output.scrollTop = output.scrollHeight;
        blinkCount++;
        setTimeout(blinkDots, 150);
      }
      blinkDots();
    } else {
      charIndex = 0;
      
      function typeChar() {
        if (skipAnimation) {
          return;
        }
        
        if (charIndex < item.text.length) {
          currentLineElement.textContent += item.text[charIndex];
          charIndex++;
          output.scrollTop = output.scrollHeight;
          const delay = item.text[charIndex - 1] === ' ' ? 20 : 10;
          typingInterval = setTimeout(typeChar, delay);
        } else {
          if (item.final) {
            currentLineElement.style.color = '#27c93f';
          }
          animIndex++;
          output.scrollTop = output.scrollHeight;
          setTimeout(animateSequence, item.delay || 50);
        }
      }
      typingInterval = setTimeout(typeChar, 50);
    }
  }
  
  function typeContentLine() {
    if (skipAnimation) {
      return;
    }
    
    if (currentLine >= lines.length) {
      showReadyButton();
      return;
    }
    
    const line = lines[currentLine];
    const lineElement = document.createElement('div');
    lineElement.className = 'terminal-line';
    output.appendChild(lineElement);
    
    if (line === '') {
      lineElement.textContent = '';
      currentLine++;
      setTimeout(typeContentLine, 150);
      return;
    }
    
    charIndex = 0;
    
    function typeChar() {
      if (skipAnimation) {
        return;
      }
      
      if (charIndex < line.length) {
        lineElement.textContent += line[charIndex];
        charIndex++;
        output.scrollTop = output.scrollHeight;
        const delay = line[charIndex - 1] === '✓' ? 50 : 12;
        typingInterval = setTimeout(typeChar, delay);
      } else {
        currentLine++;
        const delay = currentLine < lines.length ? 200 : 300;
        typingInterval = setTimeout(typeContentLine, delay);
      }
    }
    typingInterval = setTimeout(typeChar, 100);
  }
  
  function showReadyButton() {
    const inputArea = modal.querySelector('.terminal-input-area');
    inputArea.style.display = 'flex';
    const input = document.getElementById('terminal-input');
    if (input) input.focus();
    
    const cursor = document.querySelector('.cursor-blink');
    if (cursor) {
      cursor.remove();
    }
    
    const output = document.getElementById('terminal-output');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'terminal-button-container';
    buttonContainer.innerHTML = `
      <button class="terminal-begin-btn" id="terminal-begin-btn">[ INICIAR ]</button>
    `;
    output.appendChild(buttonContainer);
    output.scrollTop = output.scrollHeight;
    
    const beginBtn = document.getElementById('terminal-begin-btn');
    if (beginBtn) {
      beginBtn.addEventListener('click', function() {
        closeModal();
        if (typeof window.openModule === 'function') {
          window.openModule(moduleId);
        } else {
          console.log(`Abriendo módulo ${moduleId}: ${mod.title}`);
        }
      });
    }
    
    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === 'y' || e.key === 'Y') {
          closeModal();
          if (typeof window.openModule === 'function') {
            window.openModule(moduleId);
          } else {
            console.log(`Abriendo módulo ${moduleId}: ${mod.title}`);
          }
        } else if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
          closeModal();
        }
      });
      setTimeout(() => input.focus(), 100);
    }
  }
  
  function closeModal() {
    if (typingInterval) {
      clearTimeout(typingInterval);
    }
    modal.remove();
    document.body.style.overflow = '';
  }
  
  // 🔥 COMANDO SECRETO: Flecha Derecha para saltar animación
  function handleSecretKey(e) {
    if (e.key === 'ArrowRight' && document.body.contains(modal)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Detener todo
      skipAnimation = true;
      if (typingInterval) {
        clearTimeout(typingInterval);
        typingInterval = null;
      }
      
      // Limpiar output
      const output = document.getElementById('terminal-output');
      output.innerHTML = '';
      
      // Mostrar el contenido del módulo directamente
      lines.forEach(line => {
        const lineEl = document.createElement('div');
        lineEl.className = 'terminal-line';
        if (line === '') {
          lineEl.innerHTML = '&nbsp;';
        } else {
          lineEl.textContent = line;
        }
        output.appendChild(lineEl);
      });
      output.scrollTop = output.scrollHeight;
      
      // Mostrar el botón INICIAR
      showReadyButton();
      
      // Remover el listener
      document.removeEventListener('keydown', handleSecretKey);
    }
  }
  
  document.addEventListener('keydown', handleSecretKey);
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  setTimeout(animateSequence, 200);
}

function renderRoadmap() {
  const container = document.getElementById('roadmap-container');
  if (!container) {
    console.error('roadmap-container not found');
    return;
  }
  
  let html = '';
  
  modulesData.forEach((mod, index) => {
    const status = getModuleStatus(mod.id);
    const progress = calculateProgress(mod.id);
    const isCurrent = mod.id === currentModuleId;
    const isLocked = status === "locked";
    const isClickable = !isLocked || status === "available" || status === "in-progress";
    
    let badgeText = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === "in-progress") badgeText = "En progreso";
    
    const displayTitle = mod.displayTitle || mod.title;
    
    html += `<div class="module-card ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''} ${isClickable ? 'clickable' : ''}" data-module-id="${mod.id}">`;
    html += `<div class="module-header">`;
    html += `<div class="module-title-group">`;
    html += `<span class="module-number">Módulo ${mod.id}</span>`;
    html += `<span class="module-range">${mod.range}</span>`;
    html += `<span class="module-title">${displayTitle}</span>`;
    if (isLocked) html += `<span class="module-lock-icon">🔒</span>`;
    html += `</div>`;
    html += `<span class="module-badge-state ${status}">${badgeText}</span>`;
    html += `</div>`;
    html += `<div class="module-description">${mod.description}</div>`;
    
    if (mod.moduleType !== 'learning' && !mod.isGodMode) {
      html += `<div class="module-stages">`;
      const stages = [
        { key: 'theory', label: '01 TEORÍA' },
        { key: 'concepts', label: '02 CONCEPTOS' },
        { key: 'practice', label: '03 PRÁCTICA' }
      ];
      
      const progress = getModuleProgress(mod.id);
      
      stages.forEach((stage, idx) => {
        let stageStatus = 'locked';
        if (status === 'completed') {
          stageStatus = 'completed';
        } else if (stage.key === 'theory') {
          stageStatus = progress.theoryCompleted ? 'completed' : 'available';
        } else if (stage.key === 'concepts') {
          stageStatus = progress.theoryCompleted ? (progress.conceptsCompleted ? 'completed' : 'available') : 'locked';
        } else if (stage.key === 'practice') {
          stageStatus = (progress.theoryCompleted && progress.conceptsCompleted) ? 
            (progress.practiceCompleted ? 'completed' : 'available') : 'locked';
        }
        
        const stageIcon = stageStatus === 'completed' ? '✓' : 
                          stageStatus === 'available' ? '○' : '●';
        
        html += `<div class="stage-item ${stageStatus}">`;
        html += `<span class="stage-icon">${stageIcon}</span>`;
        html += `<span class="stage-label">${stage.label}</span>`;
        if (stageStatus === 'completed') {
          html += `<span class="stage-check">✅</span>`;
        }
        html += `</div>`;
        
        if (idx < stages.length - 1) {
          html += `<div class="stage-connector ${stageStatus === 'completed' ? 'completed' : ''}"></div>`;
        }
      });
      html += `</div>`;
    }
    
    if (mod.moduleType === 'learning' && !mod.isGodMode) {
      const progress = getModuleProgress(mod.id);
      const quizResult = loadQuizResult(mod.id);
      let introIcon = '📖';
      let introText = 'Contenido disponible';

      if (quizResult.passed) {
        introIcon = '✅';
        introText = `Quiz aprobado (mejor puntaje: ${quizResult.bestScore})`;
      } else if (progress.theoryCompleted) {
        introIcon = '📝';
        introText = quizResult.attempts > 0
          ? `Quiz pendiente de aprobar (intentos: ${quizResult.attempts})`
          : 'Contenido leído — falta el quiz final';
      }

      html += `<div class="module-intro-status">`;
      html += `<span class="intro-icon">${introIcon}</span>`;
      html += `<span class="intro-text">${introText}</span>`;
      html += `</div>`;
    }
    
    if (mod.isGodMode) {
      html += `<div class="module-god-status">`;
      html += `<span class="god-icon">☠️</span>`;
      html += `<span class="god-text">Crea un desafío original para la comunidad</span>`;
      html += `</div>`;
    }
    
    html += `<div class="module-progress">`;
    html += `<div class="module-progress-bar"><div class="module-progress-fill" style="width:${progress}%"></div></div>`;
    html += `<span class="module-progress-text">${progress}%</span>`;
    html += `</div>`;
    
    if (mod.moduleType === 'practice' && mod.exercises > 0 && !isLocked) {
      html += `<div class="exercise-list">`;
      for (let i = 0; i < mod.exercises; i++) {
        const exStatus = getExerciseStatus(mod.id, i);
        const isDone = exStatus === "done";
        const isLockedEx = exStatus === "locked";
        const isPending = exStatus === "pending";
        
        html += `<div class="exercise-item ${isLockedEx ? 'locked-exercise' : ''}">`;
        html += `<div class="exercise-left">`;
        html += `<span class="exercise-dot ${isDone ? 'done' : isPending ? 'active-dot' : ''}"></span>`;
        html += `<span class="exercise-name">Ejercicio ${i + 1}</span>`;
        html += `</div>`;
        let statusLabel = "Pendiente";
        if (isDone) statusLabel = "Completado";
        else if (isLockedEx) statusLabel = "Bloqueado";
        html += `<span class="exercise-status ${isDone ? 'done' : isLockedEx ? 'locked-status' : 'pending'}">${statusLabel}</span>`;
        html += `</div>`;
      }
      html += `</div>`;
    }
    
    html += `</div>`;
  });
  
  container.innerHTML = html;
  
  document.querySelectorAll('.module-card.clickable').forEach(card => {
    card.addEventListener('click', function() {
      const id = parseInt(this.dataset.moduleId);
      const status = getModuleStatus(id);
      if (status !== "locked") {
        openModuleTerminal(id);
      }
    });
  });
}

function completeStage(moduleId, stage) {
  const progress = getModuleProgress(moduleId);
  const status = getModuleStatus(moduleId);
  
  if (stage === 'theory') {
    progress.theoryCompleted = true;
  } else if (stage === 'concepts') {
    progress.conceptsCompleted = true;
  } else if (stage === 'practice') {
    progress.practiceCompleted = true;
    if (moduleStatus[moduleId] !== "completed") {
      moduleStatus[moduleId] = "completed";
    }
    if (moduleId < 17) {
      const nextId = moduleId + 1;
      if (moduleStatus[nextId] === "locked" || !moduleStatus[nextId]) {
        moduleStatus[nextId] = "available";
      }
    }
  }
  
  if (moduleStatus[moduleId] !== "completed") {
    if (progress.theoryCompleted && progress.conceptsCompleted && progress.practiceCompleted) {
      moduleStatus[moduleId] = "completed";
      if (moduleId < 17) {
        const nextId = moduleId + 1;
        if (moduleStatus[nextId] === "locked" || !moduleStatus[nextId]) {
          moduleStatus[nextId] = "available";
        }
      }
    } else if (progress.theoryCompleted || progress.conceptsCompleted || progress.practiceCompleted) {
      moduleStatus[moduleId] = "in-progress";
    }
  }
  
  saveRoadmapState();
  renderRoadmap();
}

function completeExercise(moduleId, exerciseIdx) {
  const progress = getModuleProgress(moduleId);
  if (!progress.exercisesDone) {
    progress.exercisesDone = [];
  }
  if (!progress.exercisesDone.includes(exerciseIdx)) {
    progress.exercisesDone.push(exerciseIdx);
  }
  
  const totalExercises = modulesData[moduleId].exercises || 0;
  if (progress.exercisesDone.length >= totalExercises) {
    completeStage(moduleId, 'practice'); // completeStage ya guarda el estado
  } else {
    saveRoadmapState();
    renderRoadmap();
  }
}

function updateModuleStatus(moduleId, status) {
  moduleStatus[moduleId] = status;
  saveRoadmapState();
  renderRoadmap();
}

function setCurrentModule(moduleId) {
  currentModuleId = moduleId;
  saveRoadmapState();
  renderRoadmap();
}

function initializeRoadmap() {
  const loaded = loadRoadmapState();

  modulesData.forEach(mod => {
    if (!moduleStatus[mod.id]) {
      moduleStatus[mod.id] = getInitialStatus(mod.id);
    }
    if (!moduleProgress[mod.id]) {
      moduleProgress[mod.id] = getInitialProgress();
    }
  });

  // El Módulo 0 siempre debe estar disponible desde el inicio, pero
  // SOLO si no había un progreso guardado — si ya estaba "completed"
  // o "in-progress", no lo pisamos con "available" en cada recarga.
  if (!loaded) {
    moduleStatus[0] = "available";
  }

  saveRoadmapState();
  renderRoadmap();
}

function getModuleData(moduleId) {
  return modulesData[moduleId];
}

function getCurrentModule() {
  return modulesData[currentModuleId];
}

function getModuleStatusById(moduleId) {
  return getModuleStatus(moduleId);
}

function getModuleProgressById(moduleId) {
  return getModuleProgress(moduleId);
}

function getModuleRange(moduleId) {
  return modulesData[moduleId]?.range || '';
}

/**
 * Borra todo el progreso persistido y reinicia el roadmap como si
 * fuera la primera visita. Útil durante pruebas/QA; no está conectada
 * a ningún botón de la UI todavía.
 */
function resetRoadmapProgress() {
  try {
    localStorage.removeItem(ROADMAP_STORAGE_KEY);
  } catch (err) {
    console.warn('⚠️ No se pudo limpiar el progreso del roadmap:', err);
  }
  resetBadges(); // mismo reseteo total: sin progreso no debería quedar ningún badge
  moduleStatus = {};
  moduleProgress = {};
  currentModuleId = 0;
  initializeRoadmap();
}

// ================================================================
// EXPORTACIONES (para usar en otros archivos)
// ================================================================

export { 
  modulesData,
  renderRoadmap, 
  getModuleStatus, 
  getModuleProgress, 
  calculateProgress,
  openModuleTerminal,
  completeStage,
  completeExercise,
  updateModuleStatus,
  setCurrentModule,
  getModuleData,
  getCurrentModule,
  getModuleStatusById,
  getModuleProgressById,
  getModuleRange,
  resetRoadmapProgress
};

// ================================================================
// INICIALIZAR AUTOMÁTICAMENTE
// ================================================================

initializeRoadmap();
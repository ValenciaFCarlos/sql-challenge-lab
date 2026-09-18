// js/practice-mode.js
/**
 * Practice Mode - Capa delgada que usa ChallengeEngine
 * Soporta cualquier módulo con retos SQL
 */

import { ChallengeEngine } from './challenge-engine.js';
import { SQLEngine } from './sql-engine.js';

let currentEngine = null;
let sqlEngine = null;

/**
 * Fábrica de loaders: cada módulo sigue exactamente el mismo patrón
 * de nombres exportados (module{N}Metadata / module{N}Dataset /
 * module{N}Challenges), así que un solo helper cubre a todos.
 * Agregar un módulo nuevo = agregar una línea en MODULE_LOADERS.
 */
function makeModuleLoader(moduleId, importPath) {
  return async () => {
    const mod = await import(importPath);
    const metadata = mod[`module${moduleId}Metadata`];
    const dataset = mod[`module${moduleId}Dataset`];
    const challenges = mod[`module${moduleId}Challenges`];

    if (!metadata || !dataset || !challenges) {
      throw new Error(
        `El archivo de datos del Módulo ${moduleId} no exporta module${moduleId}Metadata/Dataset/Challenges correctamente.`
      );
    }

    return {
      id: metadata.id,
      title: metadata.title,
      displayTitle: metadata.displayTitle,
      emoji: metadata.emoji,
      range: metadata.range,
      totalChallenges: metadata.totalChallenges,
      dataset,
      challenges
    };
  };
}

const MODULE_LOADERS = {
  1: makeModuleLoader(1, '../data/module1-dataset.js'),
  2: makeModuleLoader(2, '../data/module2-dataset.js'),
  3: makeModuleLoader(3, '../data/module3-dataset.js'),
  4: makeModuleLoader(4, '../data/module4-dataset.js'),
  5: makeModuleLoader(5, '../data/module5-dataset.js'),
  6: makeModuleLoader(6, '../data/module6-dataset.js'),
  7: makeModuleLoader(7, '../data/module7-dataset.js'),
  8: makeModuleLoader(8, '../data/module8-dataset.js'),
  9: makeModuleLoader(9, '../data/module9-dataset.js'),
  10: makeModuleLoader(10, '../data/module10-dataset.js')
};

/**
 * Fuente de verdad única sobre qué módulos ya tienen Practice Mode
 * real conectado (dataset + retos). app.js consulta esto en vez de
 * mantener su propia lista duplicada de "módulos soportados" — así
 * agregar un módulo nuevo a MODULE_LOADERS lo habilita automáticamente
 * en el routing de openModule() sin tocar app.js.
 */
export function isPracticeModeAvailable(moduleId) {
  return moduleId in MODULE_LOADERS;
}

export async function initPracticeMode(moduleId) {
  try {
    console.log(`📖 Inicializando Practice Mode para Módulo ${moduleId}`);

    // Inicializar SQL Engine
    sqlEngine = new SQLEngine();
    await sqlEngine.init();

    // Cargar datos del módulo (crea tablas + puebla datos en SQLite)
    await sqlEngine.loadModuleDataset(moduleId);

    // Cargar metadata/retos del módulo para el ChallengeEngine
    const moduleData = await loadModuleData(moduleId);
    if (!moduleData) {
      console.error(`❌ No se pudo cargar Módulo ${moduleId}`);
      return;
    }

    // Crear instancia de ChallengeEngine
    currentEngine = new ChallengeEngine(moduleData, sqlEngine);

    // Renderizar primer reto
    currentEngine.renderChallenge();

    console.log(`✅ Practice Mode iniciado - ${moduleData.totalChallenges} retos disponibles`);
  } catch (err) {
    console.error('❌ Error al inicializar Practice Mode:', err);
  }
}

/**
 * Cargar dinámicamente metadata + retos del módulo
 */
async function loadModuleData(moduleId) {
  const loadModule = MODULE_LOADERS[moduleId];
  if (!loadModule) {
    console.warn(`⚠️ Módulo ${moduleId} no existe aún`);
    return null;
  }

  try {
    return await loadModule();
  } catch (err) {
    console.error(`❌ Error al cargar Módulo ${moduleId}:`, err);
    return null;
  }
}
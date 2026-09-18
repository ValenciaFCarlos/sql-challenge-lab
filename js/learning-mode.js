// js/learning-mode.js
import { modulesData } from './roadmap.js';
import { initQuiz, loadQuizResult } from './quiz-engine.js';

let currentCardIndex = 0;
let currentModuleId = null;
let currentCards = [];
let quizTriggerIndex = -1; // se recalcula por módulo al cargar sus cards

// Cada módulo de Learning Mode registra aquí de dónde cargar sus cards.
// Mismo patrón que MODULE_LOADERS en practice-mode.js y
// MODULE_QUIZ_LOADERS en quiz-engine.js: agregar un módulo nuevo es
// agregar una línea, no reescribir el motor.
const MODULE_CARD_LOADERS = {
  0: () => import('../data/module0.js').then(m => m.module0Cards),
  11: () => import('../data/module11.js').then(m => m.module11Cards),
  12: () => import('../data/module12.js').then(m => m.module12Cards),
  13: () => import('../data/module13.js').then(m => m.module13Cards),
  14: () => import('../data/module14.js').then(m => m.module14Cards),
  15: () => import('../data/module15.js').then(m => m.module15Cards),
  16: () => import('../data/module16.js').then(m => m.module16Cards),
  17: () => import('../data/module17.js').then(m => m.module17Cards)
  // Los 18 módulos del roadmap oficial ya están registrados.
};

// Tips del robot — específicos del Módulo 0 (16 cards, tono "SQL Baby").
// Para el resto de los módulos se usa un tip genérico (ver getTipText).
const MODULE_0_TIPS = [
  "SQL es el idioma que usamos para hablar con los datos.",
  "SQL es un lenguaje, no una base de datos.",
  "SQL nació para ayudar a hacer preguntas sobre grandes volúmenes de datos.",
  "Muchas tecnologías han cambiado. SQL sigue aquí.",
  "SQL transforma grandes cantidades de datos en información útil.",
  "Los datos describen el mundo real.",
  "Los datos permiten tomar mejores decisiones.",
  "Una tabla es una colección organizada de datos relacionados.",
  "Las relaciones permiten conectar información en distintas tablas.",
  "SQL existe porque primero existió el modelo relacional.",
  "SQL se usa principalmente con bases de datos relacionales.",
  "SQL Challenge Lab™ se enfoca en bases de datos relacionales.",
  "Aprendes SQL una vez. Después puedes trabajar con distintos motores.",
  "Si una organización usa datos, probablemente usa SQL.",
  "La IA te ayuda a escribir consultas, pero tú debes saber qué preguntar.",
  "Cuando completes el viaje, sabrás qué preguntas hacer a los datos."
];

const GENERIC_TIP = "Tómate tu tiempo — cada concepto de este módulo se apoya en el anterior.";

function getTipText(index) {
  if (currentModuleId === 0) {
    return MODULE_0_TIPS[index] || GENERIC_TIP;
  }
  return GENERIC_TIP;
}

function getCurrentModuleInfo() {
  return modulesData.find(mod => mod.id === currentModuleId) || null;
}

function getNextModuleInfo() {
  const nextId = currentModuleId + 1;
  const nextMod = modulesData.find(mod => mod.id === nextId) || null;
  return { nextId, nextMod };
}

function getNextModuleName() {
  const { nextMod } = getNextModuleInfo();
  if (nextMod) {
    return nextMod.displayTitle || nextMod.title || 'Siguiente Módulo';
  }
  return 'Siguiente Módulo';
}

export async function initLearningMode(moduleId) {
  currentModuleId = moduleId;
  currentCardIndex = 0;

  const loader = MODULE_CARD_LOADERS[moduleId];
  if (!loader) {
    renderComingSoon(moduleId);
    return;
  }

  try {
    currentCards = await loader();
  } catch (err) {
    console.error(`❌ Error al cargar las cards del módulo ${moduleId}:`, err);
    renderComingSoon(moduleId);
    return;
  }

  if (!currentCards || !currentCards.length) {
    console.error(`❌ El módulo ${moduleId} no tiene cards válidas.`);
    renderComingSoon(moduleId);
    return;
  }

  // El quiz se dispara justo ANTES de la última card (celebración).
  quizTriggerIndex = currentCards.length - 2;

  renderLearningMode();
}

/**
 * Mensaje amistoso para módulos cuyo contenido todavía no existe
 * (en vez de romperse silenciosamente o mostrar una pantalla en blanco).
 */
function renderComingSoon(moduleId) {
  const workspaceLeft = document.querySelector('.workspace-left');
  const workspaceRight = document.querySelector('.workspace-right');
  const mod = modulesData.find(m => m.id === moduleId);

  if (workspaceLeft) {
    workspaceLeft.innerHTML = `
      <div class="workspace-main">
        <div class="workspace-main-inner" style="display:flex; align-items:center; justify-content:center; height:100%;">
          <div style="text-align:center; max-width:420px; padding:32px;">
            <div style="font-size:40px; margin-bottom:16px;">🚧</div>
            <h2 style="font-size:20px; margin-bottom:8px; color:var(--color-text);">${mod ? mod.title : 'Este módulo'} está en construcción</h2>
            <p style="font-size:14px; color:var(--color-text-secondary);">
              El contenido de este módulo todavía no está disponible. Vuelve pronto.
            </p>
          </div>
        </div>
      </div>
    `;
  }
  if (workspaceRight) {
    workspaceRight.innerHTML = '';
  }
}

function renderLearningMode() {
  const workspaceLeft = document.querySelector('.workspace-left');
  const workspaceRight = document.querySelector('.workspace-right');
  if (!workspaceLeft || !workspaceRight) return;

  const mod = getCurrentModuleInfo();
  const tipLabel = mod ? (mod.range || mod.displayTitle || 'Tip') : 'Tip';

  workspaceLeft.innerHTML = `
    <div class="workspace-main" id="learning-main">
      <div class="workspace-main-inner">
        <div id="learning-card-container"></div>
        <div class="learning-navigation">
          <button class="learning-nav-btn" id="prev-card-btn" disabled>← Anterior</button>
          <span class="learning-nav-indicator" id="learning-nav-indicator">1 / ${currentCards.length}</span>
          <button class="learning-nav-btn primary" id="next-card-btn">Siguiente →</button>
        </div>
      </div>
    </div>
    <div class="workspace-tips">
      <div class="tips-robot">
        <span class="robot-icon">🤖</span>
        <div class="tips-content">
          <span class="tips-label">💡 Tip ${tipLabel}</span>
          <span class="tips-text" id="tip-text">No te preocupes por memorizar todo. Lo importante es construir comprensión paso a paso.</span>
        </div>
      </div>
    </div>
  `;

  workspaceRight.innerHTML = `
    <div class="knowledge-panel">
      <h4>🧠 Knowledge Panel™</h4>
      <div id="knowledge-summary">
        <p style="font-size:13px; color:var(--color-text-secondary);">
          Lee cada card y comprende los conceptos fundamentales de SQL.
        </p>
        <div style="margin-top:12px; padding:12px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--color-border-soft);">
          <p style="font-size:12px; color:var(--color-text-muted);">
            <strong style="color:var(--color-text);">📊 Tu progreso general</strong><br>
            <span id="learning-total-progress">2%</span>
          </p>
        </div>
      </div>
    </div>
    <div class="panel-resizer"></div>
    <div class="thinking-assistant">
      <h4>⚡ SQL Thinking Assistant™</h4>
      <div id="assistant-steps">
        <div class="assistant-step">1. Observa el concepto</div>
        <div class="assistant-step">2. Relaciona con ejemplos</div>
        <div class="assistant-step">3. Formula preguntas</div>
        <div class="assistant-step">4. Continúa tu viaje</div>
      </div>
    </div>
  `;

  setTimeout(() => {
    setupPanelSplitter(workspaceRight);
  }, 100);

  renderCard(0);
  setupLearningEvents();
}

// ================================================================
// PANEL SPLITTER
// ================================================================

function setupPanelSplitter(container) {
  if (!container) {
    console.warn('⚠️ setupPanelSplitter: container no proporcionado');
    return;
  }

  const resizer = container.querySelector('.panel-resizer');
  const topPanel = container.querySelector('.knowledge-panel');
  const bottomPanel = container.querySelector('.thinking-assistant');

  if (!resizer || !topPanel || !bottomPanel) {
    console.warn('⚠️ Panel splitter: elementos no encontrados');
    return;
  }

  if (window._splitterListener) {
    resizer.removeEventListener('pointerdown', window._splitterListener);
    window._splitterListener = null;
  }

  const containerHeight = container.offsetHeight || 500;
  topPanel.style.height = (containerHeight * 0.6) + 'px';
  bottomPanel.style.height = (containerHeight * 0.4) + 'px';

  topPanel.style.flex = 'none';
  bottomPanel.style.flex = 'none';
  topPanel.style.minHeight = '100px';
  bottomPanel.style.minHeight = '100px';

  let isDragging = false;
  let startY = 0;
  let startTopHeight = 0;
  let totalHeight = 0;

  const onPointerDown = (e) => {
    e.preventDefault();
    isDragging = true;
    startY = e.clientY;
    startTopHeight = topPanel.offsetHeight;
    totalHeight = startTopHeight + bottomPanel.offsetHeight;
    resizer.classList.add('dragging');
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const delta = e.clientY - startY;
    let newTop = startTopHeight + delta;
    let newBottom = totalHeight - newTop;
    const minHeight = 100;

    if (newTop < minHeight) {
      newTop = minHeight;
      newBottom = totalHeight - minHeight;
    } else if (newBottom < minHeight) {
      newBottom = minHeight;
      newTop = totalHeight - minHeight;
    }

    if (newTop > totalHeight - minHeight) {
      newTop = totalHeight - minHeight;
      newBottom = minHeight;
    }

    topPanel.style.height = newTop + 'px';
    bottomPanel.style.height = newBottom + 'px';
  };

  const onPointerUp = () => {
    if (isDragging) {
      isDragging = false;
      resizer.classList.remove('dragging');
    }
  };

  window._splitterListener = onPointerDown;
  resizer.addEventListener('pointerdown', onPointerDown);

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);

  console.log('✅ Splitter configurado desde learning-mode.js');
}

// ================================================================
// RENDER CARD
// ================================================================

function renderCard(index) {
  const container = document.getElementById('learning-card-container');
  if (!container) return;

  const card = currentCards[index];
  if (!card) return;

  // Actualizar tip del robot
  const tipText = document.getElementById('tip-text');
  if (tipText) {
    tipText.textContent = getTipText(index);
  }

  // Actualizar indicador
  const indicator = document.getElementById('learning-nav-indicator');
  if (indicator) {
    indicator.textContent = `${index + 1} / ${currentCards.length}`;
  }

  const prevBtn = document.getElementById('prev-card-btn');
  const nextBtn = document.getElementById('next-card-btn');

  if (prevBtn) {
    prevBtn.disabled = index === 0;
    prevBtn.style.display = 'inline-flex';
  }

  if (nextBtn) {
    if (index === currentCards.length - 1) {
      nextBtn.style.display = 'inline-flex';
      const { nextMod } = getNextModuleInfo();
      nextBtn.textContent = nextMod ? `🚀 Comenzar ${getNextModuleName()}` : '🏆 ¡Curso completado!';
      nextBtn.className = 'learning-nav-btn primary final';
      nextBtn.onclick = function (e) {
        e.preventDefault();
        advanceToNextModule();
      };
    } else if (index === quizTriggerIndex) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = '📝 Ir al Quiz Final →';
      nextBtn.className = 'learning-nav-btn primary';
      nextBtn.onclick = null;
    } else {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Siguiente →';
      nextBtn.className = 'learning-nav-btn primary';
      nextBtn.onclick = null;
    }
  }

  // Limpiar y renderizar card
  container.innerHTML = '';
  container.style.opacity = '0';
  container.style.transform = 'translateY(8px)';

  setTimeout(() => {
    // ✅ En vez de inline styles con !important, usamos clases modificadoras.
    //    .is-last y .no-scroll están definidas en app.html con especificidad
    //    suficiente para ganar sin necesitar !important, y solo se aplican
    //    a la última card de cada módulo (celebración).
    const cardClass = `learning-card${card.isLast ? ' is-last' : ''}`;
    const contentClass = `learning-card-content${card.isLast ? ' no-scroll' : ''}`;

    container.innerHTML = `
      <div class="${cardClass}">
        <div class="learning-card-title">
          <span class="learning-card-number">Card ${card.id} de ${currentCards.length}</span>
          <h2>${card.title}</h2>
        </div>
        <div class="${contentClass}">
          ${card.content}
        </div>
      </div>
    `;
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 200);
}

/**
 * Marca el módulo actual como completado, desbloquea el siguiente (si
 * existe) y navega hacia él. Si no hay siguiente módulo (ej. tras
 * completar el Módulo 17, el capstone final), vuelve al roadmap en
 * vez de intentar abrir un módulo inexistente.
 */
function advanceToNextModule() {
  const moduleId = currentModuleId;
  console.log(`🚀 Completando Módulo ${moduleId}`);

  if (typeof window.updateModuleStatus === 'function') {
    const progress = window.getModuleProgress
      ? window.getModuleProgress(moduleId)
      : { theoryCompleted: false, conceptsCompleted: false, practiceCompleted: false };
    progress.theoryCompleted = true;
    progress.conceptsCompleted = true;
    progress.practiceCompleted = true;
    window.updateModuleStatus(moduleId, 'completed');

    const { nextId, nextMod } = getNextModuleInfo();
    if (nextMod) {
      const status = window.getModuleStatus ? window.getModuleStatus(nextId) : 'locked';
      if (status === 'locked' || !status) {
        window.updateModuleStatus(nextId, 'available');
      }
    }
  }

  if (typeof window.renderRoadmap === 'function') window.renderRoadmap();
  if (typeof window.updateDashboard === 'function') window.updateDashboard();
  if (typeof window.updateSidebarProgress === 'function') window.updateSidebarProgress();

  const { nextId, nextMod } = getNextModuleInfo();
  if (nextMod && typeof window.openModule === 'function') {
    window.openModule(nextId);
  } else if (!nextMod && typeof window.navigateTo === 'function') {
    // Fin del curso — no hay módulo siguiente que abrir.
    window.navigateTo('roadmap');
  } else {
    console.error('❌ window.openModule no está disponible');
  }
}

// ✅ Alias retro-compatible: la card de celebración del Módulo 0 llama
// directamente a window.startModule1() desde su HTML embebido.
window.startModule1 = advanceToNextModule;
window.advanceToNextModule = advanceToNextModule;

function setupLearningEvents() {
  const prevBtn = document.getElementById('prev-card-btn');
  const nextBtn = document.getElementById('next-card-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        renderCard(currentCardIndex);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      // ✅ Si el botón tiene un onclick definido (última card), NO hacer
      // nada — dejar que el onclick maneje la acción.
      if (this.onclick) {
        return;
      }

      goToNextCard();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        renderCard(currentCardIndex);
      }
    } else if (e.key === 'ArrowRight') {
      // ✅ Si estamos en la última card, no hacer nada (el botón tiene su propio handler)
      if (currentCardIndex === currentCards.length - 1) {
        return;
      }
      goToNextCard();
    }
  });
}

/**
 * Navegación "hacia adelante" centralizada. Se usa tanto desde el
 * botón "Siguiente →" como desde la flecha derecha del teclado, para
 * que ningún camino pueda saltarse el quiz que se dispara justo antes
 * de la card de celebración.
 */
function goToNextCard() {
  if (currentCardIndex === quizTriggerIndex) {
    launchQuiz();
    return;
  }
  if (currentCardIndex < currentCards.length - 1) {
    currentCardIndex++;
    renderCard(currentCardIndex);
  }
}

/**
 * Lanza el Quiz Final del módulo dentro del mismo contenedor que las
 * cards, y oculta la barra de navegación de cards mientras está
 * activo (el quiz trae su propia UI de navegación interna).
 * Si el usuario ya había aprobado antes (ej. volvió con "← Anterior"
 * y avanzó de nuevo), no lo hace repetir el quiz.
 */
function launchQuiz() {
  const previousResult = loadQuizResult(currentModuleId);
  if (previousResult.passed) {
    currentCardIndex = currentCards.length - 1;
    renderCard(currentCardIndex);
    return;
  }

  const navBar = document.querySelector('.learning-navigation');
  if (navBar) navBar.style.display = 'none';

  const container = document.getElementById('learning-card-container');
  if (container) {
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }

  initQuiz(currentModuleId, 'learning-card-container', {
    onPass: () => {
      if (navBar) navBar.style.display = '';
      currentCardIndex = currentCards.length - 1;
      renderCard(currentCardIndex);
    }
  });
}
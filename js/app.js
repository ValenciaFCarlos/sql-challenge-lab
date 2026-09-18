// js/app.js
import { renderRoadmap, modulesData, getModuleStatus, getModuleProgress, calculateProgress, updateModuleStatus, resetRoadmapProgress, completeExercise } from './roadmap.js';
import { initLearningMode } from './learning-mode.js';
import { initSidebar, updateSidebarProgress, renderSidebarModules } from './sidebar.js';
import { renderBadgeGallery, resetBadges } from './badge-engine.js';

console.log('🚀 SQL Challenge Lab™ iniciando...');

// ================================================================
// PANEL SPLITTER - REDIMENSIONAMIENTO TIPO "SUBES Y BAJAS"
// ================================================================

let activeSplitter = null;

/**
 * Configura el divisor arrastrable entre knowledge-panel y thinking-assistant
 */
function setupPanelSplitter(container) {
  if (!container) {
    console.warn('⚠️ setupPanelSplitter: container no proporcionado');
    return;
  }

  const resizer = container.querySelector('.panel-resizer');
  const topPanel = container.querySelector('.knowledge-panel');
  const bottomPanel = container.querySelector('.thinking-assistant');

  if (!resizer || !topPanel || !bottomPanel) {
    console.warn('⚠️ Panel splitter: elementos no encontrados', { resizer: !!resizer, top: !!topPanel, bottom: !!bottomPanel });
    return;
  }

  // Remover listener previo
  if (activeSplitter) {
    resizer.removeEventListener('pointerdown', activeSplitter);
    activeSplitter = null;
  }

  topPanel.style.height = 'auto';
  bottomPanel.style.height = 'auto';
  
  requestAnimationFrame(() => {
    let topHeight = topPanel.offsetHeight;
    let bottomHeight = bottomPanel.offsetHeight;
    const containerHeight = container.offsetHeight;
    
    if (topHeight < 100 || bottomHeight < 100) {
      const totalHeight = containerHeight;
      topHeight = Math.max(100, totalHeight * 0.6);
      bottomHeight = Math.max(100, totalHeight - topHeight);
    }
    
    topPanel.style.height = topHeight + 'px';
    bottomPanel.style.height = bottomHeight + 'px';
  });

  const onPointerDown = (e) => {
    e.preventDefault();

    const topHeight = topPanel.offsetHeight;
    const bottomHeight = bottomPanel.offsetHeight;
    const totalHeight = topHeight + bottomHeight;
    const minHeight = 100;

    const startY = e.clientY;
    const startTopHeight = topHeight;

    resizer.classList.add('dragging');

    const onPointerMove = (ev) => {
      ev.preventDefault();
      const delta = ev.clientY - startY;
      let newTop = startTopHeight + delta;
      let newBottom = totalHeight - newTop;

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
      resizer.classList.remove('dragging');
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  activeSplitter = onPointerDown;
  resizer.addEventListener('pointerdown', onPointerDown);

  console.log('✅ Panel splitter configurado correctamente');
}

// ================================================================
// BADGE ENGINE — NOTIFICACIÓN VISUAL
// ================================================================
function showBadgeToast(mod) {
  if (!mod) return;

  const toast = document.createElement('div');
  toast.className = 'badge-toast';
  toast.innerHTML = `
    <span class="badge-toast-emoji">🏅</span>
    <div class="badge-toast-text">
      <strong>¡Badge obtenido!</strong>
      <span>${mod.range || mod.displayTitle || mod.title}</span>
    </div>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: var(--color-surface-elevated, #12152a);
    border: 1px solid var(--color-primary, #7c5cff);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(124,92,255,0.25);
    color: var(--color-text, #f4f5fb);
    z-index: 2000;
    font-family: var(--font-family, sans-serif);
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

document.addEventListener('sqlchallenge:badge-awarded', function(e) {
  const moduleId = e.detail?.moduleId;
  const mod = modulesData[moduleId];
  console.log(`🏅 Badge otorgado: ${mod ? (mod.range || mod.title) : moduleId}`);
  showBadgeToast(mod);
});

// ================================================================
// NAVEGACIÓN
// ================================================================
function navigateTo(view) {
  console.log(`📂 Navegando a: ${view}`);
  
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    roadmap: document.getElementById('view-roadmap'),
    workspace: document.getElementById('view-workspace')
  };

  Object.keys(views).forEach(key => {
    if (views[key]) {
      views[key].classList.remove('active');
      views[key].classList.add('hidden');
    }
  });
  
  if (views[view]) {
    views[view].classList.remove('hidden');
    views[view].classList.add('active');
    console.log(`✅ Vista ${view} activada`);
  } else {
    console.error(`❌ Vista ${view} no encontrada`);
  }
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.view === view) {
      item.classList.add('active');
    }
  });
}

// ================================================================
// UPDATE DASHBOARD
// ================================================================
function updateDashboard() {
  if (!modulesData) {
    console.warn('⚠️ modulesData no está definido');
    return;
  }
  
  let currentMod = null;
  let currentModId = 0;
  for (let i = 0; i < modulesData.length; i++) {
    const status = getModuleStatus(i);
    if (status === 'available' || status === 'in-progress') {
      currentMod = modulesData[i];
      currentModId = i;
      break;
    }
    if (status === 'completed') {
      currentMod = modulesData[i];
      currentModId = i;
    }
  }
  
  if (currentMod) {
    const rangeEl = document.getElementById('dominance-level');
    const modEl = document.getElementById('dominance-module');
    const currentModEl = document.getElementById('current-module');
    const currentModNumEl = document.getElementById('current-module-number');
    const rankBadge = document.getElementById('current-rank-badge');
    
    if (rangeEl) rangeEl.textContent = currentMod.range || '👶 SQL Baby';
    if (modEl) modEl.textContent = `Módulo ${currentModId}`;
    if (currentModEl) currentModEl.textContent = currentMod.title || 'Introducción a SQL';
    if (currentModNumEl) currentModNumEl.textContent = `Módulo ${currentModId}`;
    if (rankBadge) rankBadge.textContent = currentMod.range || '👶 SQL Baby';
  }
  
  let totalCompleted = 0;
  let totalExercises = 0;
  modulesData.forEach((mod, id) => {
    const progress = getModuleProgress(id);
    if (mod.exercises > 0) {
      totalExercises += mod.exercises;
      if (progress.exercisesDone) {
        totalCompleted += progress.exercisesDone.length;
      }
    }
  });
  
  const completedEl = document.getElementById('completed-count');
  if (completedEl) completedEl.textContent = totalCompleted;

  // La galería de badges vive en el Dashboard; se re-renderiza cada
  // vez que el dashboard se actualiza (incluye al ganar un badge nuevo).
  renderBadgeGallery('badge-gallery-container', modulesData);
}

// ================================================================
// FUNCIONES PARA SIDEBAR
// ================================================================

function getCompletedChallengesCount() {
  if (!modulesData) return 0;
  let total = 0;
  modulesData.forEach((mod) => {
    const progress = getModuleProgress(mod.id);
    if (progress.exercisesDone) {
      total += progress.exercisesDone.length;
    }
  });
  return total;
}

function getStreak() {
  // Por ahora devolvemos un número fijo, después se puede conectar a localStorage
  return 2;
}

function getTotalModulesCount() {
  if (!modulesData) return 18;
  return modulesData.filter(mod => !mod.isGodMode).length;
}

function getTotalChallengesCount() {
  if (!modulesData) return 108;
  let total = 0;
  modulesData.forEach((mod) => {
    if (mod.exercises) total += mod.exercises;
  });
  return total;
}

// ================================================================
// SETUP WORKSPACE - CON LAYOUT PARA LEARNING MODE
// ================================================================
function setupWorkspace(moduleId) {
  const mod = modulesData[moduleId];
  if (!mod) return;
  
  const isTheoryModule = mod.isIntro || mod.isGodMode || mod.exercises === 0;
  
  const titleEl = document.querySelector('.page-title');
  const rankBadge = document.getElementById('current-rank-badge');
  if (titleEl) titleEl.textContent = `Módulo ${mod.id} — ${mod.title}`;
  if (rankBadge) rankBadge.textContent = mod.range;
  
  const workspaceLeft = document.querySelector('.workspace-left');
  const workspaceRight = document.querySelector('.workspace-right');
  
  if (!workspaceLeft || !workspaceRight) return;
  
  if (isTheoryModule && moduleId === 0) {
    workspaceLeft.innerHTML = `
      <div class="workspace-main" id="learning-main">
        <div class="workspace-main-inner">
          <div id="learning-card-container"></div>
        </div>
      </div>
      
      <div class="workspace-key-ideas">
        <div class="key-ideas-header">
          <span class="key-ideas-icon">💡</span>
          <span class="key-ideas-title">Ideas Clave</span>
        </div>
        <div class="key-ideas-content" id="key-ideas-content">
          <div class="key-idea-item">
            <span class="key-idea-bullet">•</span>
            <span>SQL es el lenguaje estándar para bases de datos relacionales.</span>
          </div>
          <div class="key-idea-item">
            <span class="key-idea-bullet">•</span>
            <span>Las tablas organizan los datos en filas y columnas.</span>
          </div>
          <div class="key-idea-item">
            <span class="key-idea-bullet">•</span>
            <span>SELECT permite consultar información de una tabla.</span>
          </div>
        </div>
      </div>
    `;
    
    workspaceRight.innerHTML = `
      <div class="knowledge-panel" style="height: 60%; min-height: 100px;">
        <h4>🧠 Knowledge Panel™</h4>
        <div id="knowledge-summary">
          <p style="font-size:13px; color:var(--color-text-secondary);">
            Lee cada card y comprende los conceptos fundamentales de SQL.
          </p>
          <div style="margin-top:12px; padding:12px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px solid var(--color-border-soft);">
            <p style="font-size:12px; color:var(--color-text-muted);">
              💡 <strong style="color:var(--color-text);">Tip SQL Baby</strong><br>
              No te preocupes por memorizar todo. Lo importante es construir comprensión paso a paso.
            </p>
          </div>
          <div style="margin-top:12px;">
            <p style="font-size:12px; color:var(--color-text-muted);">
              <strong style="color:var(--color-text);">📊 Tu progreso general</strong><br>
              <span id="learning-total-progress">2%</span>
            </p>
          </div>
        </div>
      </div>
      <div class="panel-resizer"></div>
      <div class="thinking-assistant" style="height: 40%; min-height: 100px;">
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
    }, 50);
    
    initLearningMode(moduleId);
    return;
  }

  workspaceLeft.innerHTML = `
    <div class="dataset-explorer">
      <h4>📊 Dataset Explorer</h4>
      <div id="table-list">
        <div style="font-size:12px; color:var(--color-text-secondary); padding:4px 0; border-bottom:1px solid var(--color-border-soft);">
          <span style="color:var(--color-primary);">📋</span> students <span style="color:var(--color-text-muted);">(10 filas)</span>
        </div>
        <div style="font-size:12px; color:var(--color-text-secondary); padding:4px 0; border-bottom:1px solid var(--color-border-soft);">
          <span style="color:var(--color-primary);">📋</span> courses <span style="color:var(--color-text-muted);">(5 filas)</span>
        </div>
        <div style="font-size:12px; color:var(--color-text-secondary); padding:4px 0;">
          <span style="color:var(--color-primary);">📋</span> enrollments <span style="color:var(--color-text-muted);">(15 filas)</span>
        </div>
      </div>
    </div>
    <div class="sql-editor">
      <div class="editor-toolbar">
        <button id="run-query" class="btn-primary">▶ Ejecutar</button>
        <button id="clear-editor" class="btn-secondary">Limpiar</button>
      </div>
      <textarea id="sql-input" placeholder="Escribe tu consulta SQL aquí..."></textarea>
    </div>
    <div class="results-panel">
      <div class="results-header">
        <span>Resultados</span>
        <span id="row-count">0 filas</span>
      </div>
      <div id="results-output"></div>
    </div>
  `;
  
  workspaceRight.innerHTML = `
    <div class="knowledge-panel" style="height: 60%; min-height: 100px;">
      <h4>🧠 Knowledge Panel™</h4>
      <div id="knowledge-content">
        <p class="knowledge-placeholder">Selecciona un ejercicio para ver el razonamiento guiado.</p>
      </div>
    </div>
    <div class="panel-resizer"></div>
    <div class="thinking-assistant" style="height: 40%; min-height: 100px;">
      <h4>⚡ SQL Thinking Assistant™</h4>
      <div id="assistant-content">
        <div class="assistant-step">FROM → ¿De dónde salen los datos?</div>
        <div class="assistant-step">WHERE → ¿Qué filas sobreviven?</div>
        <div class="assistant-step">SELECT → ¿Qué quiero mostrar?</div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    setupPanelSplitter(workspaceRight);
  }, 50);
  
  setTimeout(() => {
    document.getElementById('run-query')?.addEventListener('click', function() {
      const input = document.getElementById('sql-input');
      const output = document.getElementById('results-output');
      const rowCount = document.getElementById('row-count');
      if (input && output) {
        const query = input.value.trim();
        if (query) {
          output.textContent = `✅ Consulta ejecutada:\n${query}\n\n📊 Resultados simulados (demo)`;
          if (rowCount) rowCount.textContent = '~10 filas';
        } else {
          output.textContent = '⚠️ Escribe una consulta SQL primero.';
        }
      }
    });
    document.getElementById('clear-editor')?.addEventListener('click', function() {
      const input = document.getElementById('sql-input');
      const output = document.getElementById('results-output');
      const rowCount = document.getElementById('row-count');
      if (input) input.value = '';
      if (output) output.textContent = '';
      if (rowCount) rowCount.textContent = '0 filas';
    });
  }, 100);
}

// ================================================================
// ABRIR MÓDULO - ✅ MODIFICADO PARA SOPORTAR PRACTICE MODE
// ================================================================
function openModule(moduleId) {
  const mod = modulesData[moduleId];
  if (!mod) return;
  
  console.log(`📖 Abriendo módulo ${moduleId}: ${mod.title}`);
  
  const progress = getModuleProgress(moduleId);
  if (mod.isIntro) {
    progress.theoryCompleted = true;
    updateModuleStatus(moduleId, 'in-progress');
  }
  
  navigateTo('workspace');

  const titleEl = document.querySelector('.page-title');
  const rankBadge = document.getElementById('current-rank-badge');
  if (titleEl) titleEl.textContent = `Módulo ${mod.id} — ${mod.title}`;
  if (rankBadge) rankBadge.textContent = mod.range;

  // ✅ Learning Mode (Módulo 0 hoy; 11-17 cuando tengan contenido real)
  if (mod.moduleType === 'learning') {
    console.log(`📖 Learning Mode activado para Módulo ${moduleId}`);
    initLearningMode(moduleId);
  }
  // ✅ Practice Mode (SQL real con SQL.js) — cualquier módulo marcado
  // como 'practice' en el roadmap, SIEMPRE que ya tenga su dataset
  // registrado en practice-mode.js (MODULE_LOADERS). Si un módulo
  // 'practice' todavía no tiene dataset, cae al workspace de demo
  // en vez de romperse.
  else if (mod.moduleType === 'practice') {
    import('./practice-mode.js').then(({ initPracticeMode, isPracticeModeAvailable }) => {
      if (isPracticeModeAvailable(moduleId)) {
        console.log(`⚔️ Practice Mode activado para Módulo ${moduleId}`);
        initPracticeMode(moduleId);
      } else {
        console.warn(`⚠️ Módulo ${moduleId} es 'practice' pero aún no tiene dataset registrado — usando workspace de demo.`);
        setupWorkspace(moduleId);
      }
    }).catch(err => {
      console.error('❌ Error al cargar Practice Mode:', err);
      // Fallback: usar setupWorkspace
      setupWorkspace(moduleId);
    });
  }
  // ✅ Cualquier caso no contemplado (no debería pasar con los 18
  // módulos ya clasificados) → workspace de demostración.
  else {
    console.warn(`⚠️ Módulo ${moduleId} sin moduleType definido — usando workspace de demo.`);
    setupWorkspace(moduleId);
  }
  
  updateDashboard();
  updateSidebarProgress();
  renderSidebarModules();
}

// ================================================================
// EXPONER FUNCIONES GLOBALES
// ================================================================
window.modulesData = modulesData;
window.getModulesData = () => modulesData;
window.getModuleStatus = getModuleStatus;
window.getModuleProgress = getModuleProgress;
window.updateModuleStatus = updateModuleStatus;
window.renderRoadmap = renderRoadmap;
window.updateDashboard = updateDashboard;
window.updateSidebarProgress = updateSidebarProgress;
window.openModule = openModule;
window.navigateTo = navigateTo;
window.setupWorkspace = setupWorkspace;
window.renderSidebarModules = renderSidebarModules;
window.completeExercise = completeExercise;

// ✅ FUNCIONES PARA SIDEBAR
window.getCompletedChallengesCount = getCompletedChallengesCount;
window.getStreak = getStreak;
window.getTotalModulesCount = getTotalModulesCount;
window.getTotalChallengesCount = getTotalChallengesCount;

// ✅ QA / DEBUG: borrar progreso persistido del roadmap desde la consola
// con window.resetRoadmapProgress(). No está conectada a ningún botón.
window.resetRoadmapProgress = resetRoadmapProgress;
window.resetBadges = resetBadges;

// ================================================================
// INICIALIZACIÓN
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM cargado, inicializando...');
  
  const container = document.getElementById('roadmap-container');
  if (container) {
    console.log('✅ roadmap-container encontrado');
  } else {
    console.error('❌ roadmap-container NO encontrado');
  }
  
  const navItems = document.querySelectorAll('.nav-item');
  console.log(`📋 ${navItems.length} items de navegación encontrados`);
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const view = this.dataset.view;
      if (view) {
        window.location.hash = view;
        navigateTo(view);
      }
    });
  });

  const hash = window.location.hash.replace('#', '') || 'roadmap';
  console.log(`🔗 Hash inicial: ${hash}`);
  navigateTo(hash);

  window.addEventListener('hashchange', function() {
    const hash = window.location.hash.replace('#', '') || 'roadmap';
    navigateTo(hash);
  });

  console.log('📊 Llamando a renderRoadmap...');
  if (typeof renderRoadmap === 'function') {
    renderRoadmap();
    console.log('✅ Roadmap renderizado correctamente');
  } else {
    console.error('❌ renderRoadmap NO es una función');
  }
  
  initSidebar();
  updateDashboard();
  
  console.log('✅ App inicializada correctamente');
});

// ================================================================
// OFFLINE TAG
// ================================================================
(function setupOfflineTagAutoHide() {
  const offlineTag = document.querySelector('.offline-tag');
  if (!offlineTag) return;

  const HIDE_DELAY = 2500;
  let hideTimeout = null;

  function showTag() {
    offlineTag.classList.add('visible');
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      offlineTag.classList.remove('visible');
    }, HIDE_DELAY);
  }

  document.addEventListener('mousemove', showTag);
})();
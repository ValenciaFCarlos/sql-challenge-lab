// js/sidebar.js
// Renderiza y mantiene actualizado el sidebar: lista de módulos,
// anillo de progreso y racha. Se apoya en las mismas funciones globales
// que ya usa learning-mode.js (window.getModulesData, window.getModuleStatus, etc).
// Si esas funciones aún no existen en tu app.js, se usan valores de
// respaldo para que el sidebar no se rompa mientras las conectas.

const DEFAULT_TOTAL_MODULES = 18;
const DEFAULT_TOTAL_CHALLENGES = 108;
const COLLAPSED_COUNT = 4;

let modulesExpanded = false;

// ================================================================
// LECTURA DE DATOS (con fallback si aún no existen los helpers)
// ================================================================

function getModulesData() {
  if (typeof window.getModulesData === 'function') {
    return window.getModulesData();
  }
  if (Array.isArray(window.modulesData)) {
    return window.modulesData;
  }
  // Fallback mínimo mientras conectas la fuente real de módulos.
  return [
    { id: 0, displayTitle: 'Introducción a SQL' },
    { id: 1, displayTitle: 'First Query™' },
    { id: 2, displayTitle: 'Filtros y condiciones' },
    { id: 3, displayTitle: 'Ordenamiento y límites' }
  ];
}

function getModuleStatus(id) {
  if (typeof window.getModuleStatus === 'function') {
    return window.getModuleStatus(id) || 'locked';
  }
  // Fallback: módulo 0 completado, módulo 1 en progreso, resto bloqueado.
  if (id === 0) return 'completed';
  if (id === 1) return 'in-progress';
  return 'locked';
}

function getCompletedChallengesCount() {
  if (typeof window.getCompletedChallengesCount === 'function') {
    return window.getCompletedChallengesCount();
  }
  return 0;
}

function getStreak() {
  if (typeof window.getStreak === 'function') {
    return window.getStreak();
  }
  return 0;
}

function getTotalModulesCount() {
  if (typeof window.getTotalModulesCount === 'function') {
    return window.getTotalModulesCount();
  }
  return DEFAULT_TOTAL_MODULES;
}

function getTotalChallengesCount() {
  if (typeof window.getTotalChallengesCount === 'function') {
    return window.getTotalChallengesCount();
  }
  return DEFAULT_TOTAL_CHALLENGES;
}

// ================================================================
// HELPERS DE PRESENTACIÓN
// ================================================================

function statusMeta(status) {
  switch (status) {
    case 'completed':
      return { icon: '✓', label: 'Completado', className: 'completed' };
    case 'in-progress':
    case 'available':
      return { icon: '●', label: status === 'in-progress' ? 'En progreso' : 'Disponible', className: 'current' };
    default:
      return { icon: '🔒', label: 'Bloqueado', className: 'locked' };
  }
}

function moduleTitle(mod) {
  return mod.displayTitle || mod.title || `Módulo ${mod.id}`;
}

// ================================================================
// RENDER: LISTA DE MÓDULOS
// ================================================================

export function renderSidebarModules() {
  const list = document.getElementById('module-nav-list');
  const viewAllBtn = document.getElementById('nav-view-all-btn');
  if (!list) return;

  const modules = getModulesData();
  const visibleCount = modulesExpanded ? modules.length : Math.min(COLLAPSED_COUNT, modules.length);
  const visible = modules.slice(0, visibleCount);

  list.innerHTML = visible.map(mod => {
    const status = getModuleStatus(mod.id);
    const meta = statusMeta(status);
    return `
      <div class="module-nav-item ${meta.className}" data-module-id="${mod.id}" title="${moduleTitle(mod)}">
        <span class="module-nav-icon">${meta.icon}</span>
        <div class="module-nav-text">
          <span class="module-nav-title">Módulo ${mod.id}</span>
          <span class="module-nav-status">${meta.label}</span>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.module-nav-item:not(.locked)').forEach(item => {
    item.addEventListener('click', () => {
      const id = Number(item.dataset.moduleId);
      if (typeof window.openModule === 'function') {
        window.openModule(id);
      }
    });
  });

  if (viewAllBtn) {
    viewAllBtn.style.display = modules.length > COLLAPSED_COUNT ? 'block' : 'none';
    viewAllBtn.textContent = modulesExpanded ? 'Ver menos módulos ▲' : 'Ver todos los módulos ▾';
  }
}

// ================================================================
// RENDER: ANILLO Y ESTADÍSTICAS
// ================================================================

export function updateSidebarProgress() {
  const modules = getModulesData();
  const completedModules = modules.filter(mod => getModuleStatus(mod.id) === 'completed').length;

  const totalModules = getTotalModulesCount();
  const totalChallenges = getTotalChallengesCount();
  const completedChallenges = getCompletedChallengesCount();
  const streak = getStreak();

  const percent = totalModules > 0
    ? Math.round((completedModules / totalModules) * 100)
    : 0;

  const ring = document.getElementById('sidebar-progress-ring');
  const ringValue = document.getElementById('sidebar-progress-ring-value');
  if (ring) ring.style.setProperty('--progress', percent);
  if (ringValue) ringValue.textContent = `${percent}%`;

  const modulesStat = document.getElementById('stat-modules-completed');
  if (modulesStat) modulesStat.textContent = `${completedModules} / ${totalModules}`;

  const challengesStat = document.getElementById('stat-challenges-completed');
  if (challengesStat) challengesStat.textContent = `${completedChallenges} / ${totalChallenges}`;

  const streakStat = document.getElementById('stat-streak');
  if (streakStat) streakStat.textContent = `🔥 ${streak} ${streak === 1 ? 'día' : 'días'}`;

  // La lista de módulos también depende del progreso (checkmarks, "en progreso", etc).
  renderSidebarModules();
}

// ================================================================
// INIT
// ================================================================

export function initSidebar() {
  const viewAllBtn = document.getElementById('nav-view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      modulesExpanded = !modulesExpanded;
      renderSidebarModules();
    });
  }
  updateSidebarProgress();
}

// Se expone globalmente porque learning-mode.js ya llama a
// window.updateSidebarProgress() al completar un módulo.
window.updateSidebarProgress = updateSidebarProgress;
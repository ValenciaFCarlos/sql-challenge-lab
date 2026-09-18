// js/badge-engine.js
/**
 * Badge Engine — otorga y persiste badges cuando un módulo pasa a
 * estado "completed" en el roadmap. No depende de roadmap.js (evita
 * import circular): recibe modulesData / getModuleStatus como
 * parámetros desde quien lo llame.
 *
 * Fuente de verdad de cada badge: mod.range en modulesData
 * (ej. "⚔️ SQL Warrior"), que ya existe para los 18 módulos.
 */

const BADGE_STORAGE_KEY = 'sqlChallengeLab_earnedBadges';
const BADGE_STORAGE_VERSION = 1;

function loadEarnedBadgeIds() {
  try {
    const raw = localStorage.getItem(BADGE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== BADGE_STORAGE_VERSION || !Array.isArray(parsed.earnedModuleIds)) {
      return [];
    }
    // Saneamiento básico: solo ids numéricos.
    return parsed.earnedModuleIds.filter(id => Number.isInteger(id));
  } catch (err) {
    console.warn('⚠️ No se pudieron leer los badges guardados:', err);
    return [];
  }
}

function saveEarnedBadgeIds(ids) {
  try {
    localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify({
      version: BADGE_STORAGE_VERSION,
      earnedModuleIds: ids
    }));
  } catch (err) {
    console.warn('⚠️ No se pudieron guardar los badges:', err);
  }
}

// Estado en memoria, hidratado desde localStorage al cargar el módulo.
let earnedModuleIds = loadEarnedBadgeIds();

function hasBadge(moduleId) {
  return earnedModuleIds.includes(moduleId);
}

function getEarnedBadgeIds() {
  return [...earnedModuleIds];
}

/**
 * Otorga el badge de un módulo si todavía no lo tenía.
 * Devuelve true si fue un otorgamiento NUEVO (para disparar un toast
 * en la UI), false si ya lo tenía (no hace nada más).
 */
function awardBadge(moduleId) {
  if (earnedModuleIds.includes(moduleId)) return false;

  earnedModuleIds.push(moduleId);
  saveEarnedBadgeIds(earnedModuleIds);

  if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
    document.dispatchEvent(new CustomEvent('sqlchallenge:badge-awarded', {
      detail: { moduleId }
    }));
  }

  return true;
}

/**
 * Revisa TODOS los módulos y otorga cualquier badge pendiente de un
 * módulo que ya esté "completed". Es idempotente — llamarla muchas
 * veces no vuelve a otorgar (ni a notificar) un badge ya obtenido.
 *
 * Se llama automáticamente desde roadmap.js cada vez que se persiste
 * el estado del roadmap, así que no hay que acordarse de invocarla
 * manualmente en cada lugar donde un módulo puede completarse.
 */
function syncBadges(modulesData, getModuleStatus) {
  modulesData.forEach(mod => {
    if (getModuleStatus(mod.id) === 'completed') {
      awardBadge(mod.id);
    }
  });
}

/**
 * Reinicia todos los badges otorgados (QA/testing). No toca el
 * progreso del roadmap — son sistemas de persistencia independientes.
 */
function resetBadges() {
  earnedModuleIds = [];
  try {
    localStorage.removeItem(BADGE_STORAGE_KEY);
  } catch (err) {
    console.warn('⚠️ No se pudieron limpiar los badges:', err);
  }
}

/**
 * Separa "⚔️ SQL Warrior" en { emoji: "⚔️", name: "SQL Warrior" }.
 * Si el formato no trae emoji, degrada con gracia.
 */
function parseRange(range) {
  if (!range) return { emoji: '🏅', name: '' };
  const parts = range.trim().split(' ');
  const emoji = parts[0];
  const name = parts.slice(1).join(' ');
  return { emoji: emoji || '🏅', name: name || range };
}

/**
 * Renderiza la galería de badges dentro de un contenedor del DOM.
 * modulesData viene de roadmap.js (import externo, no acoplado aquí).
 */
function renderBadgeGallery(containerId, modulesData) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = modulesData.map(mod => {
    const earned = hasBadge(mod.id);
    const { emoji, name } = parseRange(mod.range);

    return `
      <div class="badge-item ${earned ? 'earned' : 'locked'}" title="Módulo ${mod.id}: ${mod.title}">
        <span class="badge-item-emoji">${earned ? emoji : '🔒'}</span>
        <span class="badge-item-name">${name || mod.displayTitle || mod.title}</span>
        <span class="badge-item-module">Módulo ${mod.id}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

export {
  hasBadge,
  getEarnedBadgeIds,
  awardBadge,
  syncBadges,
  resetBadges,
  renderBadgeGallery
};
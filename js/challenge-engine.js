// js/challenge-engine.js
/**
 * ChallengeEngine - Motor genérico para retos SQL
 * Reutilizable por cualquier módulo sin duplicación de código
 */

export class ChallengeEngine {
  constructor(moduleData, sqlEngine) {
    this.moduleData = moduleData;
    this.sqlEngine = sqlEngine;
    this.currentChallengeIndex = 0;
    this.currentModuleId = moduleData.id;
    this.hintsRevealed = 1; // Control de pistas progresivas
    this.wrongAttempts = 0; // Intentos fallidos consecutivos (SQL válido, respuesta incorrecta)

    try {
      const saved = JSON.parse(localStorage.getItem(`module_${this.currentModuleId}_progress`));
      if (saved?.completedChallenges) {
        this.currentChallengeIndex = Math.min(
          moduleData.challenges.length - 1,
          saved.completedChallenges
        );
      }
    } catch {
      // Sin progreso persistido: iniciar en el primer reto.
    }

    // El footer vive fuera del área que este motor re-renderiza (es
    // markup estático compartido entre módulos), así que se referencia
    // la instancia activa globalmente en vez de capturarla en un
    // listener que quedaría "congelado" en la primera instancia.
    window.currentChallengeEngine = this;
    this.initFooter();
  }

  getCurrentChallenge() {
    return this.moduleData.challenges[this.currentChallengeIndex];
  }

  getCompletedChallenges() {
    try {
      const saved = JSON.parse(localStorage.getItem(`module_${this.currentModuleId}_progress`));
      return Math.min(this.moduleData.challenges.length, saved?.completedChallenges || 0);
    } catch {
      return 0;
    }
  }

  setChallengeStage(stage) {
    const card = document.getElementById('card-challenge');
    if (!card) return;

    const stages = ['understand', 'write', 'execute'];
    const activeIndex = stages.indexOf(stage);
    card.dataset.challengeStage = stage;

    card.querySelectorAll('[data-step]').forEach((step) => {
      const stepIndex = stages.indexOf(step.dataset.step);
      step.classList.toggle('is-active', stepIndex === activeIndex);
      step.classList.toggle('is-complete', stepIndex < activeIndex);
      step.setAttribute('aria-current', stepIndex === activeIndex ? 'step' : 'false');
    });
  }

  updateChallengeProgress(completedChallenges) {
    const progress = Math.round((completedChallenges / this.moduleData.challenges.length) * 100);
    const label = document.getElementById('challenge-module-progress');
    const fill = document.getElementById('challenge-module-progress-fill');
    if (label) label.textContent = `${progress}%`;
    if (fill) fill.style.width = `${progress}%`;
  }

  renderChallenge() {
    const challenge = this.getCurrentChallenge();
    if (!challenge) {
      console.warn('❌ No se encontró ningún reto. Verifica moduleData.challenges');
      return;
    }

    const workspaceLeft = document.querySelector('.workspace-left');
    const workspaceRight = document.querySelector('.workspace-right');

    if (!workspaceLeft || !workspaceRight) {
      console.warn('❌ Workspace elements not found');
      return;
    }

    // 🔥 RESET DE ESTADO DE PISTAS E INTENTOS
    this.hintsRevealed = 1;
    this.wrongAttempts = 0;
    // El Dataset Explorer arranca con las tablas del reto actual abiertas
    this.expandedTables = new Set(challenge.tables);
    this.datasetSearchTerm = '';
    this.currentChallengeSolved = false;
    this.updateFooterState();
    const difficultyLabels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    const difficulty = difficultyLabels[Math.min(4, Math.max(0, (challenge.difficulty || 1) - 1))];
    const completedChallenges = this.getCompletedChallenges();
    const moduleProgress = Math.round((completedChallenges / this.moduleData.challenges.length) * 100);

    // ================================================================
    // COLUMNA IZQUIERDA - 3 CARDS INDEPENDIENTES
    // ================================================================
    workspaceLeft.innerHTML = `
      <!-- 1. CHALLENGE HEADER CARD (LED VERDE VIAJERO) -->
      <div id="card-challenge" class="card-challenge" data-challenge-stage="understand" style="padding: 16px 18px; margin-bottom: 12px;">
        <div class="challenge-copy">
          <div class="challenge-meta">
            <span class="learning-card-number">Reto ${this.currentChallengeIndex + 1} de ${this.moduleData.challenges.length}</span>
            <span class="challenge-difficulty">● ${difficulty}</span>
          </div>
          <h2>${challenge.title}</h2>
          <p>${challenge.description}</p>
          <div class="challenge-tables">
            ${challenge.tables.map(table => `<code>Tabla principal: <strong>${table}</strong></code>`).join('')}
          </div>
        </div>
        <aside class="challenge-progress" aria-label="Progreso del módulo">
          <div class="challenge-progress-label"><span>Progreso del módulo</span><b id="challenge-module-progress">${moduleProgress}%</b></div>
          <div class="challenge-progress-track"><span id="challenge-module-progress-fill" style="width:${moduleProgress}%"></span></div>
          <div class="challenge-step-tracker">
            <span class="is-active" data-step="understand"><b>1</b><i>Entender</i></span>
            <em></em>
            <span data-step="write"><b>2</b><i>Escribir</i></span>
            <em></em>
            <span data-step="execute"><b>3</b><i>Ejecutar</i></span>
          </div>
        </aside>
      </div>

      <!-- 2. SQL EDITOR CARD -->
      <div id="card-editor" class="card-editor" style="padding: 16px 18px; margin-bottom: 12px;">
        <div class="editor-toolbar" style="display: flex; gap: 8px; margin-bottom: 10px;">
          <button id="run-query-practice" class="btn-primary">▶ Ejecutar</button>
          <button id="clear-editor-practice" class="btn-secondary">Limpiar</button>
          <span id="query-status" style="margin-left: auto; font-size: 12px; color: var(--color-text-muted);"></span>
        </div>
        <textarea id="sql-input-practice" placeholder="-- Escribe tu consulta SQL aquí..." style="
          width: 100%; min-height: 120px; resize: vertical;
          background: rgba(255,255,255,0.03); border: 1px solid var(--color-border-soft);
          border-radius: 8px; color: var(--color-text); font-family: var(--font-mono);
          font-size: 13px; padding: 12px; outline: none;
        "></textarea>
      </div>

      <!-- 3. RESULTS CARD -->
      <div id="card-results" class="card-results" style="padding: 16px 18px;">
        <div class="results-header" style="display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-muted); margin-bottom: 8px;">
          <span>Resultados</span>
          <span id="row-count-practice">0 filas</span>
        </div>
        <div id="results-output-practice" style="font-family: var(--font-mono); font-size: 12px; color: var(--color-text-secondary); min-height: 40px; overflow-x: auto;">
          <span style="color: var(--color-text-muted);">Ejecuta una consulta para ver los resultados.</span>
        </div>
      </div>
    `;

    // ================================================================
    // COLUMNA DERECHA - PANELES INDEPENDIENTES
    // ================================================================
    workspaceRight.innerHTML = `
      <!-- DATASET EXPLORER -->
      <section class="ide-panel ide-dataset" data-panel="dataset" style="background: var(--color-surface); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 12px;">
        <h4 style="font-size: 14px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 10px;">📊 Dataset Explorer</h4>
        <div id="dataset-explorer-content">
          ${this.renderDatasetExplorer()}
        </div>
      </section>
      <div class="ide-panel-divider" data-divider="dataset-hints" role="separator" aria-orientation="horizontal" tabindex="0"></div>

      <!-- PISTAS PROGRESIVAS -->
      <section class="ide-panel ide-hints" data-panel="hints" style="background: var(--color-surface); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 12px;">
        <h4 style="font-size: 14px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 10px;">💡 Pistas</h4>
        <div id="progressive-hints">
          ${this.renderProgressiveHints()}
        </div>
      </section>
      <div class="ide-panel-divider" data-divider="hints-thinking" role="separator" aria-orientation="horizontal" tabindex="0"></div>

      <!-- SQL THINKING ASSISTANT -->
      <section class="ide-panel ide-thinking" data-panel="thinking" style="background: var(--color-surface); border-radius: var(--radius); padding: 16px 18px;">
        <h4 style="font-size: 14px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 12px;">⚡ SQL Thinking Assistant™</h4>
        <div style="font-size: 13px; color: var(--color-text-secondary); display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 800;">SELECT</span>
            <span>¿Qué quiero mostrar?</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 800;">FROM</span>
            <span>¿De dónde vienen los datos?</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 800;">WHERE</span>
            <span>¿Qué filas sobreviven?</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 800;">ORDER BY</span>
            <span>¿Cómo quiero ordenar?</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 800;">GROUP BY</span>
            <span>¿Cómo agrupo?</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="color: var(--color-primary); font-weight: 800;">HAVING</span>
            <span>¿Qué grupos sobreviven?</span>
          </div>
        </div>
      </section>
    `;

    // ✅ Configurar el resize de paneles (NUEVO)
    this.setupPanelDividers(workspaceRight);

    // Configurar el splitter (para learning-mode)
    setTimeout(() => {
      if (typeof window.setupPanelSplitter === 'function') {
        window.setupPanelSplitter(workspaceRight);
      }
    }, 100);

    this.setupEventHandlers();
  }

  /**
   * ✅ NUEVO: Configura los divisores para redimensionar los paneles de la columna derecha.
   * (Dataset Explorer, Pistas, Thinking Assistant)
   */
  setupPanelDividers(container) {
    if (!container) return;

    const dividers = container.querySelectorAll('.ide-panel-divider');

    dividers.forEach((divider) => {
      const children = Array.from(container.children);
      const dividerIndex = children.indexOf(divider);

      // El panel de arriba es el anterior, el de abajo es el siguiente
      const prevPanel = children[dividerIndex - 1];
      const nextPanel = children[dividerIndex + 1];

      if (!prevPanel || !nextPanel) return;

      let isDragging = false;
      let startY = 0;
      let startHeight = 0;
      let totalHeight = 0;

      divider.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        isDragging = true;
        startY = e.clientY;
        startHeight = prevPanel.offsetHeight;
        totalHeight = startHeight + nextPanel.offsetHeight;
        divider.classList.add('is-dragging');
        container.classList.add('is-resizing-panels');
      });

      document.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const delta = e.clientY - startY;
        const minHeight = 120; // Altura mínima para cada panel

        let newTopHeight = startHeight + delta;
        let newBottomHeight = totalHeight - newTopHeight;

        // Evitar que los paneles sean demasiado pequeños
        if (newTopHeight < minHeight) {
          newTopHeight = minHeight;
          newBottomHeight = totalHeight - minHeight;
        } else if (newBottomHeight < minHeight) {
          newBottomHeight = minHeight;
          newTopHeight = totalHeight - minHeight;
        }

        prevPanel.style.height = newTopHeight + 'px';
        prevPanel.style.flex = 'none';
        nextPanel.style.height = newBottomHeight + 'px';
        nextPanel.style.flex = 'none';
      });

      document.addEventListener('pointerup', () => {
        if (!isDragging) return;
        isDragging = false;
        divider.classList.remove('is-dragging');
        container.classList.remove('is-resizing-panels');
      });
    });
  }

  /**
   * Dataset Explorer — árbol de esquema real.
   * Muestra TODAS las tablas del dataset (no solo las del reto actual),
   * permite tener varias expandidas a la vez, y filtra por búsqueda.
   * El estado de expansión y el término de búsqueda viven en la
   * instancia (this.expandedTables / this.datasetSearchTerm) para que
   * abrir/cerrar una tabla o escribir en el buscador solo vuelva a
   * pintar la lista, sin perder el resto del panel.
   */
  renderDatasetExplorer() {
    return `
      <div class="schema-search-wrap">
        <span class="schema-search-icon">🔍</span>
        <input
          type="text"
          id="dataset-search-input"
          class="schema-search-input"
          placeholder="Buscar tabla..."
          value="${this.datasetSearchTerm || ''}"
          autocomplete="off"
        >
      </div>
      <div id="dataset-tables-list" class="schema-tables-list">
        ${this.renderDatasetTablesList()}
      </div>
    `;
  }

  renderDatasetTablesList() {
    const dataset = this.moduleData.dataset;
    const term = (this.datasetSearchTerm || '').trim().toLowerCase();
    const allTableNames = Object.keys(dataset.tables || {});
    const visibleNames = term
      ? allTableNames.filter(name => name.toLowerCase().includes(term))
      : allTableNames;

    if (visibleNames.length === 0) {
      return `<span class="schema-empty">Ninguna tabla coincide con "${this.datasetSearchTerm}"</span>`;
    }

    return visibleNames.map(tableName => {
      const tableSchema = dataset.tables[tableName];
      if (!tableSchema) return '';

      const isOpen = this.expandedTables.has(tableName);
      const isPrimary = this.getCurrentChallenge().tables.includes(tableName);

      return `
        <div class="schema-table ${isOpen ? 'is-open' : ''}" data-table="${tableName}">
          <button type="button" class="schema-table-header" data-toggle-table="${tableName}">
            <span class="schema-caret">${isOpen ? '▼' : '▶'}</span>
            <span class="schema-table-icon">${isPrimary ? '🗂️' : '📁'}</span>
            <span class="schema-table-name">${tableName}</span>
            <span class="schema-table-rows">${tableSchema.rowCount} filas</span>
          </button>
          ${isOpen ? `
            <div class="schema-table-body">
              ${tableSchema.columns.map(col => `
                <div class="schema-column-row">
                  <span class="schema-column-name">${col.name}</span>
                  <span class="schema-column-meta">
                    <span class="schema-column-type">${col.type}</span>
                    ${col.isPK ? '<span class="schema-column-pk" title="Primary Key">🔑</span>' : ''}
                  </span>
                </div>
              `).join('')}
              <a href="#" class="schema-preview-link" data-preview-table="${tableName}">
                Ver datos de la tabla →
              </a>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  /**
   * Renderizar pistas progresivas
   */
  renderProgressiveHints() {
    const challenge = this.getCurrentChallenge();
    if (!challenge.hints || challenge.hints.length === 0) {
      return '<span style="font-size:12px; color:var(--color-text-muted);">Sin pistas disponibles</span>';
    }

    let html = '';
    for (let i = 0; i < this.hintsRevealed; i++) {
      html += `
        <div style="padding: 10px; background: rgba(124,92,255,0.05); border-radius: 8px; border: 1px solid rgba(124,92,255,0.1); margin-bottom: 8px; font-size: 13px; color: var(--color-text-secondary);">
          <strong style="color: var(--color-primary); font-size: 11px; display: block; margin-bottom: 4px;">Pista ${i + 1}</strong>
          ${challenge.hints[i]}
        </div>
      `;
    }

    if (this.hintsRevealed < challenge.hints.length) {
      html += `
        <button id="reveal-next-hint" class="btn-secondary" style="width: 100%; margin-top: 8px; font-size: 12px; padding: 8px;">
          Mostrar siguiente pista
        </button>
      `;
    }

    return html;
  }

  /**
   * Configurar event handlers
   */
  setupEventHandlers() {
    const runBtn = document.getElementById('run-query-practice');
    const clearBtn = document.getElementById('clear-editor-practice');
    const input = document.getElementById('sql-input-practice');
    const output = document.getElementById('results-output-practice');
    const rowCount = document.getElementById('row-count-practice');
    const status = document.getElementById('query-status');
    const editorCard = document.getElementById('card-editor');
    const resultsCard = document.getElementById('card-results');

    if (runBtn) {
      runBtn.addEventListener('click', () => this.executeQuery(input, output, rowCount, status, editorCard, resultsCard));
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearEditor(input, output, rowCount, status, editorCard, resultsCard));
    }

    if (input) {
      input.addEventListener('input', () => {
        this.setChallengeStage(input.value.trim() ? 'write' : 'understand');
      });
      input.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          this.executeQuery(input, output, rowCount, status, editorCard, resultsCard);
        }
      });
    }

    // Event listener para pistas progresivas
    const revealHintBtn = document.getElementById('reveal-next-hint');
    if (revealHintBtn) {
      revealHintBtn.addEventListener('click', () => {
        this.hintsRevealed++;
        const hintsContainer = document.getElementById('progressive-hints');
        if (hintsContainer) {
          hintsContainer.innerHTML = this.renderProgressiveHints();
          this.setupEventHandlers(); // Re-bind de eventos para el nuevo botón
        }
      });
    }

    // Dataset Explorer: búsqueda + expand/collapse + preview.
    // Se delega en .workspace-right (persiste durante el reto) y se
    // marca con un flag para no duplicar listeners si setupEventHandlers()
    // se vuelve a invocar (p. ej. al revelar una pista).
    const workspaceRight = document.querySelector('.workspace-right');
    if (workspaceRight && !workspaceRight.dataset.explorerBound) {
      workspaceRight.dataset.explorerBound = 'true';

      workspaceRight.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'dataset-search-input') {
          this.datasetSearchTerm = e.target.value;
          const list = document.getElementById('dataset-tables-list');
          if (list) list.innerHTML = this.renderDatasetTablesList();
        }
      });

      workspaceRight.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('[data-toggle-table]');
        if (toggleBtn) {
          const tableName = toggleBtn.dataset.toggleTable;
          if (this.expandedTables.has(tableName)) {
            this.expandedTables.delete(tableName);
          } else {
            this.expandedTables.add(tableName);
          }
          const list = document.getElementById('dataset-tables-list');
          if (list) list.innerHTML = this.renderDatasetTablesList();
          return;
        }

        const previewLink = e.target.closest('[data-preview-table]');
        if (previewLink) {
          e.preventDefault();
          const tableName = previewLink.dataset.previewTable;
          const editorInput = document.getElementById('sql-input-practice');
          if (editorInput) {
            editorInput.value = `SELECT * FROM ${tableName} LIMIT 20;`;
            editorInput.focus();
            this.setChallengeStage('write');
          }
        }
      });
    }
  }

  /**
   * Ejecutar query
   */
  executeQuery(input, output, rowCount, status, editorCard, resultsCard) {
    const query = input.value.trim();
    if (!query || query === '-- Escribe tu consulta aquí') {
      output.innerHTML = '<span style="color: var(--color-text-muted);">⚠️ Escribe una consulta SQL primero.</span>';
      return;
    }

    status.textContent = '⏳ Ejecutando...';

    const result = this.sqlEngine.exec(query);

    if (result.success) {
      status.textContent = '✅ Listo';
      // Pulso ligero en los 3 cards: confirma que la consulta corrió,
      // independientemente de si es o no la respuesta correcta del reto.
      this.triggerExecutionSequence();

      if (result.data.length > 0) {
        this.renderResults(result.data, output, rowCount);
        this.validateChallenge(result.data, query, resultsCard);
      } else {
        output.innerHTML = '<span style="color: var(--color-text-muted);">✅ Consulta ejecutada correctamente (0 filas)</span>';
        if (rowCount) rowCount.textContent = '0 filas';
      }
    } else {
      status.textContent = '❌ Error';
      output.innerHTML = `<span style="color: #ff6b6b;">❌ Error SQL: ${result.error}</span>`;
    }
  }

  /**
   * Limpiar editor
   */
  clearEditor(input, output, rowCount, status, editorCard, resultsCard) {
    input.value = '-- Escribe tu consulta aquí';
    output.innerHTML = '<span style="color: var(--color-text-muted);">Ejecuta una consulta para ver los resultados.</span>';
    if (rowCount) rowCount.textContent = '0 filas';
    if (status) status.textContent = '';

    const challengeCard = document.getElementById('card-challenge');
    [challengeCard, editorCard, resultsCard].forEach(card => {
      if (card) card.classList.remove('success-active', 'pipeline-pulse');
    });
  }

  /**
   * Renderizar resultados en tabla HTML
   */
  renderResults(data, output, rowCount) {
    const table = data[0];
    if (!table || !table.values || table.values.length === 0) {
      output.innerHTML = '<span style="color: var(--color-text-muted);">✅ Consulta ejecutada (0 filas)</span>';
      if (rowCount) rowCount.textContent = '0 filas';
      return;
    }

    const columns = table.columns;
    const rows = table.values;

    if (rowCount) rowCount.textContent = `${rows.length} filas`;

    let html = '<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:13px;">';

    html += '<thead><tr style="border-bottom:2px solid var(--color-border);">';
    columns.forEach(col => {
      html += `<th style="text-align:left; padding:6px 8px; color:var(--color-text); font-weight:600;">${col}</th>`;
    });
    html += '</tr></thead>';

    html += '<tbody>';
    rows.forEach(row => {
      html += '<tr style="border-bottom:1px solid var(--color-border-soft);">';
      row.forEach(cell => {
        html += `<td style="padding:6px 8px; color:var(--color-text-secondary);">${cell !== null ? cell : 'NULL'}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';

    output.innerHTML = html;
  }

  /**
   * Validar reto usando validator function
   */
  validateChallenge(data, query, resultsCard) {
    const challenge = this.getCurrentChallenge();
    if (!challenge.validator) return;

    const result = challenge.validator(data, query);
    const output = document.getElementById('results-output-practice');

    // SQL válido, pero no es la respuesta esperada del reto.
    if (!result || !result.passed) {
      this.handleIncorrectAttempt(output);
      return;
    }

    // ✅ Respuesta correcta: se reinicia el contador de intentos.
    this.wrongAttempts = 0;
    this.currentChallengeSolved = true;
    this.updateFooterState();

    // Avisar al Roadmap que este reto quedó resuelto. Sin esto, Practice
    // Mode nunca le informaba a roadmap.js que un módulo se completó —
    // el progreso interno del ChallengeEngine (localStorage por módulo)
    // y el estado del roadmap (moduleStatus/moduleProgress, badges,
    // desbloqueo del siguiente módulo) vivían como dos sistemas
    // desconectados. completeExercise() es idempotente: si ya se había
    // marcado este reto, no hace nada distinto.
    if (typeof window.completeExercise === 'function') {
      window.completeExercise(this.currentModuleId, this.currentChallengeIndex);
    } else {
      console.warn('⚠️ window.completeExercise no está disponible — el roadmap no se enterará de este progreso.');
    }

    this.setChallengeStage('execute');
    this.updateChallengeProgress(this.currentChallengeIndex + 1);

    if (!output) return;

    const existingAttempt = output.querySelector('.attempt-message');
    if (existingAttempt) existingAttempt.remove();

    const successHTML = `
      <div class="success-message" style="margin-top:12px; padding:14px 18px; background:rgba(95,227,161,0.08); border:1px solid var(--color-green); border-radius:8px; color:var(--color-green);">
        <strong style="font-size:15px;">🎉 ${result.message || '¡Excelente trabajo!'}</strong><br>
        <span style="font-size:13px;">${result.feedback || ''}</span>
        ${this.currentChallengeIndex < this.moduleData.challenges.length - 1
          ? `<div style="margin-top:10px;">
               <button id="next-challenge-btn" style="
                 padding:6px 12px;
                 background:var(--color-green);
                 color:white;
                 border:none;
                 border-radius:4px;
                 cursor:pointer;
                 font-size:12px;
                 font-weight:600;
               ">Siguiente reto →</button>
             </div>`
          : '<div style="margin-top:10px; color:var(--color-green);"><strong>🏆 ¡Completaste el módulo!</strong></div>'
        }
      </div>
    `;

    const existing = output.querySelector('.success-message');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = successHTML;
    output.appendChild(wrapper.firstElementChild);

    const nextBtn = document.getElementById('next-challenge-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextChallenge());
    }

    // 🟢 Secuencia de éxito: Challenge → Editor → Resultados → parpadeo final
    this.triggerSuccessSequence();
    this.saveProgress();
  }

  /**
   * Consulta válida, pero no es la respuesta esperada del reto.
   * Feedback constructivo (ámbar — ni error SQL en rojo, ni éxito en
   * verde) y, tras varios intentos seguidos, sugiere automáticamente
   * la siguiente pista.
   */
  handleIncorrectAttempt(output) {
    if (!output) return;

    this.wrongAttempts = (this.wrongAttempts || 0) + 1;

    const existing = output.querySelector('.attempt-message');
    if (existing) existing.remove();

    const attemptHTML = `
      <div class="attempt-message" style="margin-top:12px; padding:12px 16px; background:rgba(255,213,74,0.08); border:1px solid rgba(255,213,74,0.4); border-radius:8px;">
        <strong style="font-size:13px; color:var(--color-warning);">🤔 La consulta corrió bien, pero no es la respuesta que pide el reto.</strong><br>
        <span style="font-size:12px; color:var(--color-text-secondary);">Revisa qué columnas o filas pide el enunciado y vuelve a intentarlo.</span>
      </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = attemptHTML;
    output.appendChild(wrapper.firstElementChild);

    const HINT_THRESHOLD = 3;
    if (this.wrongAttempts >= HINT_THRESHOLD) {
      this.autoRevealHint();
      this.wrongAttempts = 0; // vuelve a contar para la siguiente pista
    }
  }

  /**
   * Revela automáticamente la siguiente pista disponible y llama la
   * atención hacia el panel de pistas con un breve destello ámbar.
   */
  autoRevealHint() {
    const challenge = this.getCurrentChallenge();
    if (!challenge.hints || this.hintsRevealed >= challenge.hints.length) return;

    this.hintsRevealed++;
    const hintsContainer = document.getElementById('progressive-hints');
    if (hintsContainer) {
      hintsContainer.innerHTML = this.renderProgressiveHints();
      this.setupEventHandlers();
    }

    const hintPanel = document.querySelector('[data-panel="hints"]');
    if (hintPanel) {
      hintPanel.classList.remove('hint-panel-nudge');
      void hintPanel.offsetWidth; // fuerza reflow para reiniciar la animación
      hintPanel.classList.add('hint-panel-nudge');
      setTimeout(() => hintPanel.classList.remove('hint-panel-nudge'), 900);
    }
  }

  /**
   * Siguiente reto
   */
  nextChallenge() {
    if (this.currentChallengeIndex < this.moduleData.challenges.length - 1) {
      this.currentChallengeIndex++;
      this.hintsRevealed = 1;
      this.renderChallenge();
    }
  }

  /**
   * Guardar progreso en localStorage
   */
  saveProgress() {
    const key = `module_${this.currentModuleId}_progress`;
    const progress = {
      completedChallenges: this.currentChallengeIndex + 1,
      totalChallenges: this.moduleData.challenges.length,
      lastAccessed: new Date().toISOString(),
      moduleId: this.currentModuleId
    };
    localStorage.setItem(key, JSON.stringify(progress));

    if (typeof window.updateSidebarProgress === 'function') {
      window.updateSidebarProgress();
    }
  }

  /**
   * Secuencia de éxito: el verde de Card 1 se traspasa en cascada a
   * Card 2 y Card 3 (el morado y el cyan desaparecen por completo
   * mientras dura la secuencia), seguida de un parpadeo final
   * sincronizado en los 3.
   *
   *   t=0ms   → Card 1 (Challenge): flash de brillo (ya es verde).
   *   t=180ms → Card 2 (Editor): corte instantáneo morado → verde
   *             + flash de llegada.
   *   t=360ms → Card 3 (Resultados): corte instantáneo cyan → verde
   *             + flash de llegada.
   *   t=650ms → Parpadeo real (2 ciclos) sincronizado en los 3,
   *             confirmando "consulta exitosa". Tras el parpadeo,
   *             los 3 quedan verdes fijos. Duración total: ~1s.
   */
  triggerSuccessSequence() {
    const challengeCard = document.getElementById('card-challenge');
    const editorCard = document.getElementById('card-editor');
    const resultsCard = document.getElementById('card-results');

    if (!challengeCard || !editorCard || !resultsCard) return;

    // Limpieza defensiva por si quedó algo de una ejecución previa
    [challengeCard, editorCard, resultsCard].forEach(card => {
      card.classList.remove('success-active', 'pipeline-pulse');
    });

    // t=0ms — Card 1
    challengeCard.classList.add('success-active');

    // t=180ms — Card 2
    setTimeout(() => {
      editorCard.classList.add('success-active');
    }, 180);

    // t=360ms — Card 3
    setTimeout(() => {
      resultsCard.classList.add('success-active');
    }, 360);

    // t=650ms — Parpadeo sincronizado en los 3 (una sola vez).
    // Se espera a que termine el flash de llegada de Card 3
    // (entra a los 360ms + 240ms de flash) para que no se corten.
    setTimeout(() => {
      challengeCard.classList.add('pipeline-pulse');
      editorCard.classList.add('pipeline-pulse');
      resultsCard.classList.add('pipeline-pulse');

      // Se retira la clase de pulso al terminar la animación (380ms);
      // .success-active permanece, así los 3 quedan verdes fijos.
      setTimeout(() => {
        challengeCard.classList.remove('pipeline-pulse');
        editorCard.classList.remove('pipeline-pulse');
        resultsCard.classList.remove('pipeline-pulse');
      }, 380);
    }, 650);
  }

  /**
   * Feedback visual breve: la consulta recorre el pipeline sin alterar
   * el estado de validación del reto (independiente de la secuencia
   * de éxito).
   */
  triggerExecutionSequence() {
    const cards = [
      document.getElementById('card-challenge'),
      document.getElementById('card-editor'),
      document.getElementById('card-results')
    ];

    cards.forEach((card, index) => {
      if (!card) return;
      setTimeout(() => {
        card.classList.remove('query-executed');
        void card.offsetWidth;
        card.classList.add('query-executed');
        setTimeout(() => card.classList.remove('query-executed'), 760);
      }, index * 150);
    });
  }

  /**
   * Conecta los botones del footer (una sola vez por carga de página,
   * sin importar cuántas instancias de ChallengeEngine se creen al
   * cambiar de módulo). Los handlers siempre delegan en
   * window.currentChallengeEngine para actuar sobre el motor activo.
   */
  initFooter() {
    const footer = document.getElementById('lab-footer');
    if (!footer || footer.dataset.bound === 'true') return;
    footer.dataset.bound = 'true';

    const dashboardBtn = document.getElementById('footer-dashboard-btn');
    const nextBtn = document.getElementById('footer-next-btn');
    const saveBtn = document.getElementById('footer-save-btn');
    const pauseBtn = document.getElementById('footer-pause-btn');

    if (dashboardBtn) {
      dashboardBtn.addEventListener('click', () => {
        const dashNav = document.querySelector('.nav-item[data-view="dashboard"]');
        if (dashNav) dashNav.click();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (nextBtn.disabled) return;
        window.currentChallengeEngine?.nextChallenge();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        window.currentChallengeEngine?.saveProgress();
        this.showFooterToast('Progreso guardado correctamente', '💾');
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.toggleSessionPause(pauseBtn));
    }

    this.startSessionTimer();
  }

  /**
   * Timer de "Tiempo de sesión". Vive a nivel de página (no por
   * instancia/módulo) para que no se reinicie al cambiar de módulo,
   * y respeta pausas acumuladas.
   */
  startSessionTimer() {
    window.__labSession = window.__labSession || {
      startedAt: Date.now(),
      pausedMs: 0,
      isPaused: false,
      pauseStartedAt: null
    };

    const timerEl = document.getElementById('footer-session-timer');
    if (!timerEl) return;

    const format = (ms) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(totalSeconds % 60).padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    setInterval(() => {
      const session = window.__labSession;
      if (session.isPaused) return;
      const elapsed = Date.now() - session.startedAt - session.pausedMs;
      timerEl.textContent = format(elapsed);
    }, 1000);
  }

  /**
   * Pausa/reanuda el timer de sesión y refleja el estado en el botón.
   */
  toggleSessionPause(pauseBtn) {
    const session = window.__labSession;
    if (!session) return;

    if (session.isPaused) {
      session.pausedMs += Date.now() - session.pauseStartedAt;
      session.isPaused = false;
      session.pauseStartedAt = null;
      pauseBtn.textContent = '⏸ Pausar sesión';
      pauseBtn.classList.remove('is-active');
    } else {
      session.isPaused = true;
      session.pauseStartedAt = Date.now();
      pauseBtn.textContent = '▶ Reanudar sesión';
      pauseBtn.classList.add('is-active');
    }
  }

  /**
   * Toast breve reutilizando el componente .sql-toast ya existente.
   */
  showFooterToast(message, icon = '✅') {
    const toast = document.createElement('div');
    toast.className = 'sql-toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 350);
    }, 2200);
  }

  /**
   * Habilita/deshabilita el botón "Siguiente reto →" del footer y
   * refresca los datos dinámicos (reto actual, progreso, base de datos).
   */
  updateFooterState() {
    const nextBtn = document.getElementById('footer-next-btn');
    if (nextBtn) nextBtn.disabled = !this.currentChallengeSolved;

    const indexEl = document.getElementById('footer-challenge-index');
    if (indexEl) {
      indexEl.textContent = `${this.currentChallengeIndex + 1} de ${this.moduleData.challenges.length}`;
    }

    const completedChallenges = this.getCompletedChallenges();
    const moduleProgress = Math.round((completedChallenges / this.moduleData.challenges.length) * 100);

    const progressValueEl = document.getElementById('footer-challenge-progress-value');
    if (progressValueEl) progressValueEl.textContent = `${moduleProgress}%`;

    const progressFillEl = document.getElementById('footer-challenge-progress-fill');
    if (progressFillEl) progressFillEl.style.width = `${moduleProgress}%`;

    const dbNameEl = document.getElementById('footer-db-name');
    if (dbNameEl) {
      dbNameEl.textContent = this.moduleData.dataset?.name || this.currentModuleId || 'sql_lab_db';
    }
  }
}
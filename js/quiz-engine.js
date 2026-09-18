// js/quiz-engine.js
/**
 * Quiz Engine — motor genérico de preguntas de opción múltiple para
 * los módulos de Learning Mode (0, 11-17 según Roadmap Oficial).
 *
 * Sigue el mismo patrón de "loader por módulo" que ya usan
 * practice-mode.js (MODULE_LOADERS) y sql-engine.js
 * (MODULE_DATASET_LOADERS): agregar un módulo nuevo es agregar una
 * línea a MODULE_QUIZ_LOADERS, no reescribir el motor.
 *
 * Contrato que debe cumplir cada data/module{N}-quiz.js:
 *   export const module{N}QuizMetadata = {
 *     id, title, totalQuestions, approvalThreshold
 *   };
 *   export const module{N}QuizQuestions = [
 *     { id, question, options: [{id, text}, ...], correctOptionId, explanation }
 *   ];
 */

const MODULE_QUIZ_LOADERS = {
  0: () => import('../data/module0-quiz.js').then(m => ({
    metadata: m.module0QuizMetadata,
    questions: m.module0QuizQuestions
  })),
  11: () => import('../data/module11-quiz.js').then(m => ({
    metadata: m.module11QuizMetadata,
    questions: m.module11QuizQuestions
  })),
  12: () => import('../data/module12-quiz.js').then(m => ({
    metadata: m.module12QuizMetadata,
    questions: m.module12QuizQuestions
  })),
  13: () => import('../data/module13-quiz.js').then(m => ({
    metadata: m.module13QuizMetadata,
    questions: m.module13QuizQuestions
  })),
  14: () => import('../data/module14-quiz.js').then(m => ({
    metadata: m.module14QuizMetadata,
    questions: m.module14QuizQuestions
  })),
  15: () => import('../data/module15-quiz.js').then(m => ({
    metadata: m.module15QuizMetadata,
    questions: m.module15QuizQuestions
  })),
  16: () => import('../data/module16-quiz.js').then(m => ({
    metadata: m.module16QuizMetadata,
    questions: m.module16QuizQuestions
  })),
  17: () => import('../data/module17-quiz.js').then(m => ({
    metadata: m.module17QuizMetadata,
    questions: m.module17QuizQuestions
  }))
  // Los 8 quizzes de Learning Mode del roadmap oficial ya están registrados.
};

function quizStorageKey(moduleId) {
  return `quiz_${moduleId}_result`;
}

/**
 * Resultado persistido de un quiz. Independiente del progreso del
 * roadmap y de los badges — cada sistema tiene su propia clave de
 * localStorage, mismo patrón ya usado en el resto del proyecto.
 */
function loadQuizResult(moduleId) {
  try {
    const raw = localStorage.getItem(quizStorageKey(moduleId));
    if (!raw) return { attempts: 0, bestScore: 0, passed: false };
    const parsed = JSON.parse(raw);
    return {
      attempts: Number.isInteger(parsed.attempts) ? parsed.attempts : 0,
      bestScore: Number.isInteger(parsed.bestScore) ? parsed.bestScore : 0,
      passed: !!parsed.passed
    };
  } catch (err) {
    console.warn('⚠️ No se pudo leer el resultado del quiz:', err);
    return { attempts: 0, bestScore: 0, passed: false };
  }
}

function saveQuizResult(moduleId, result) {
  try {
    localStorage.setItem(quizStorageKey(moduleId), JSON.stringify(result));
  } catch (err) {
    console.warn('⚠️ No se pudo guardar el resultado del quiz:', err);
  }
}

/**
 * Calcula el resultado de un intento ya resuelto (lista de respuestas
 * del usuario) contra el umbral de aprobación. Separado de la UI para
 * poder probarlo sin DOM.
 */
function gradeAttempt(userAnswers, approvalThreshold) {
  const score = userAnswers.filter(a => a.correct).length;
  return {
    score,
    passed: score >= approvalThreshold
  };
}

/**
 * Inicializa y renderiza el quiz de un módulo dentro de un contenedor
 * del DOM.
 *
 * @param {number} moduleId
 * @param {string} containerId - id del elemento donde se renderiza
 * @param {object} callbacks - { onPass({score, total}) }
 */
async function initQuiz(moduleId, containerId, callbacks = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Quiz Engine: no se encontró el contenedor #${containerId}`);
    return;
  }

  const loader = MODULE_QUIZ_LOADERS[moduleId];
  if (!loader) {
    console.warn(`⚠️ No hay quiz registrado todavía para el módulo ${moduleId}.`);
    container.innerHTML = `
      <div class="quiz-container">
        <p style="color:var(--color-text-secondary);">
          El quiz de este módulo todavía no está disponible.
        </p>
      </div>
    `;
    return;
  }

  let quizData;
  try {
    quizData = await loader();
  } catch (err) {
    console.error(`❌ Error al cargar el quiz del módulo ${moduleId}:`, err);
    return;
  }

  const { metadata, questions } = quizData;
  if (!metadata || !questions || !questions.length) {
    console.error(`❌ Quiz del módulo ${moduleId} mal formado (falta metadata o questions).`);
    return;
  }

  runQuizSession(container, moduleId, metadata, questions, callbacks);
}

function runQuizSession(container, moduleId, metadata, questions, callbacks) {
  let currentIndex = 0;
  let answered = false;
  let userAnswers = [];

  renderQuestion();

  function renderQuestion() {
    const q = questions[currentIndex];
    answered = false;

    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-progress">
          <span class="quiz-progress-text">Pregunta ${currentIndex + 1} de ${questions.length}</span>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width:${(currentIndex / questions.length) * 100}%"></div>
          </div>
        </div>
        <h3 class="quiz-question">${q.question}</h3>
        <div class="quiz-options" id="quiz-options"></div>
        <div class="quiz-explanation" id="quiz-explanation" style="display:none;"></div>
        <div class="quiz-actions">
          <button class="learning-nav-btn primary" id="quiz-next-btn" disabled>
            ${currentIndex === questions.length - 1 ? 'Ver resultado' : 'Siguiente pregunta →'}
          </button>
        </div>
      </div>
    `;

    const optionsContainer = container.querySelector('#quiz-options');
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = opt.text;
      btn.dataset.optionId = opt.id;
      btn.addEventListener('click', () => selectOption(opt.id, q));
      optionsContainer.appendChild(btn);
    });

    const nextBtn = container.querySelector('#quiz-next-btn');
    nextBtn.addEventListener('click', () => {
      if (!answered) return;
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    });
  }

  function selectOption(optionId, question) {
    if (answered) return; // una sola respuesta por pregunta
    answered = true;

    const isCorrect = optionId === question.correctOptionId;
    userAnswers.push({ questionId: question.id, optionId, correct: isCorrect });

    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.optionId === question.correctOptionId) {
        btn.classList.add('correct');
      } else if (btn.dataset.optionId === optionId && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    const explanationEl = container.querySelector('#quiz-explanation');
    explanationEl.style.display = 'block';
    explanationEl.innerHTML = `
      <strong>${isCorrect ? '✅ ¡Correcto!' : '❌ No exactamente.'}</strong>
      <p>${question.explanation}</p>
    `;

    container.querySelector('#quiz-next-btn').disabled = false;
  }

  function finishQuiz() {
    const { score, passed } = gradeAttempt(userAnswers, metadata.approvalThreshold);

    const prev = loadQuizResult(moduleId);
    saveQuizResult(moduleId, {
      attempts: prev.attempts + 1,
      bestScore: Math.max(prev.bestScore, score),
      passed: prev.passed || passed
    });

    renderResult(score, passed);
  }

  function renderResult(score, passed) {
    container.innerHTML = `
      <div class="quiz-container quiz-result-screen">
        <div class="quiz-result-icon">${passed ? '🎉' : '📚'}</div>
        <h3>${passed ? '¡Aprobaste el quiz!' : 'Aún no alcanzas el puntaje mínimo'}</h3>
        <p class="quiz-result-score">${score} / ${questions.length} correctas</p>
        <p class="quiz-result-threshold">Necesitas al menos ${metadata.approvalThreshold} de ${questions.length} para aprobar.</p>
        <div class="quiz-actions">
          ${passed
            ? `<button class="learning-nav-btn primary final" id="quiz-continue-btn">Continuar →</button>`
            : `<button class="learning-nav-btn primary" id="quiz-retry-btn">Reintentar quiz</button>`
          }
        </div>
      </div>
    `;

    if (passed) {
      container.querySelector('#quiz-continue-btn').addEventListener('click', () => {
        if (typeof callbacks.onPass === 'function') {
          callbacks.onPass({ score, total: questions.length });
        }
      });
    } else {
      container.querySelector('#quiz-retry-btn').addEventListener('click', () => {
        currentIndex = 0;
        userAnswers = [];
        renderQuestion();
      });
    }
  }
}

export { initQuiz, loadQuizResult, gradeAttempt };
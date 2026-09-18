// data/module17.js
export const module17Cards = [
  {
    id: 1,
    title: "Bienvenido al SQL GOD Challenge",
    content: `
      <p>Este módulo es distinto a todos los anteriores: <strong>no hay teoría nueva</strong>.</p>
      <p>Todo lo que necesitas ya lo aprendiste — desde el Módulo 0 (¿qué es SQL?) hasta el Módulo 16 (cómo comunicar tu solución). Este es el cierre: un examen integrador que combina conceptos de varios módulos a la vez, no uno a la vez como hasta ahora.</p>
      <div class="analogy-box">
        <p>🎓 Los módulos anteriores fueron clases. Este es el examen final: mide si de verdad puedes combinar todo lo que aprendiste, no si recuerdas un tema aislado.</p>
      </div>
      <p>Es, deliberadamente, <strong>el módulo más difícil del curso</strong>. Si llegaste hasta aquí, ya tienes todo lo necesario para resolverlo.</p>
    `
  },
  {
    id: 2,
    title: "Reglas",
    content: `
      <p>A diferencia de los módulos 1-10 (Practice Mode, con retos SQL individuales), este capstone es una <strong>evaluación integradora final</strong>:</p>
      <ul>
        <li>No se introduce sintaxis nueva — todo pertenece a algo que ya viste</li>
        <li>Las preguntas mezclan temas de distintos módulos, a propósito, para simular una situación real donde nadie te dice "esto es un ejercicio de JOINs"</li>
        <li>La aprobación exige <strong>≥ 6 de 10</strong>, el mismo umbral exigente de los últimos módulos</li>
      </ul>
      <p>No hay atajos ni trucos ocultos: es simplemente el mismo curso, puesto a prueba de una sola vez.</p>
    `
  },
  {
    id: 3,
    title: "El dataset",
    content: `
      <p>A lo largo del curso trabajaste con varios esquemas: <code>students</code> solo, luego <code>students + courses + enrollments</code> relacionados.</p>
      <p>Para este capstone, imagina el escenario más completo que has visto: una plataforma educativa real, con:</p>
      <ul>
        <li>👥 Estudiantes, con atributos e historial de inscripción</li>
        <li>📚 Cursos, con créditos y categorías</li>
        <li>🧾 Inscripciones y calificaciones, conectando ambos</li>
        <li>💰 Una capa de negocio encima: pagos, planes de suscripción, uso de la plataforma</li>
      </ul>
      <p>Es, esencialmente, todo lo que viste en los Módulos 7-10 (JOINs, subqueries, CTEs, window functions), más la capa de negocio del Módulo 11 y el modelado del Módulo 12.</p>
    `
  },
  {
    id: 4,
    title: "Escenario empresarial",
    content: `
      <p><strong>Contexto:</strong> Eres el Analytics Engineer de esta plataforma educativa. El equipo de liderazgo reporta que la tasa de finalización de cursos bajó este trimestre, y quiere entender por qué antes de decidir qué hacer.</p>
      <p>Este es exactamente el tipo de pregunta ambigua del Módulo 11 ("¿por qué cayeron las ventas?") — solo que ahora tienes que resolverla apoyándote en TODO lo demás: saber qué tablas modelar (Módulo 12), qué consultas serán costosas (Módulo 14), y cómo comunicar lo que encuentres (Módulo 16).</p>
      <p>No hay una sola consulta que "resuelva" esto — hay una secuencia de preguntas más pequeñas, cada una apoyada en una técnica que ya dominas.</p>
    `
  },
  {
    id: 5,
    title: "Restricciones",
    content: `
      <p>Para que este cierre realmente ponga a prueba tu criterio, y no solo tu memoria, ten en cuenta estas restricciones deliberadas:</p>
      <ul>
        <li>⏱️ No hay pistas progresivas como en Practice Mode — aquí decides tú qué técnica aplicar, sin que el reto te lo sugiera</li>
        <li>🔀 Las preguntas no están agrupadas por tema — pueden alternar entre JOINs, CTEs, performance y modelado sin previo aviso</li>
        <li>🧠 Se espera que reconozcas qué módulo aplica a cada pregunta, no que te lo digan</li>
      </ul>
      <p>Esta es la diferencia entre "saber SQL" y "saber usar SQL" — la segunda es la que de verdad se evalúa en un trabajo real.</p>
    `
  },
  {
    id: 6,
    title: "Criterios de evaluación",
    content: `
      <p>¿Qué distingue una respuesta que "funciona" de una que es realmente buena? Repasando el Módulo 16:</p>
      <ul>
        <li><strong>Correctitud:</strong> ¿el resultado responde exactamente lo que se preguntó?</li>
        <li><strong>Eficiencia:</strong> ¿evitaste patrones costosos innecesarios (Módulo 14)?</li>
        <li><strong>Claridad:</strong> ¿alguien más podría leer tu razonamiento y entenderlo?</li>
        <li><strong>Criterio:</strong> ¿reconociste qué técnica aplicaba, sin que te lo dijeran?</li>
      </ul>
      <p>Un examen de opción múltiple (como el que sigue) solo puede medir una parte de esto — pero cada pregunta está diseñada para premiar el mismo tipo de razonamiento que un trabajo real exigiría.</p>
    `
  },
  {
    id: 7,
    title: "Estrategia",
    content: `
      <p>Frente a un problema grande e integrador, la estrategia es la misma que la de un buen candidato en entrevista (Módulo 16): <strong>descomponerlo</strong>.</p>
      <ul>
        <li>1. Identifica qué pregunta específica se está haciendo (métrica, dimensión, filtro — Módulo 11)</li>
        <li>2. Pregúntate qué tablas y relaciones necesitas (Módulos 7, 12)</li>
        <li>3. Decide si necesitas agregación simple, GROUP BY, o una window function (Módulos 5, 6, 10)</li>
        <li>4. Considera si el volumen de datos importa para la estrategia (Módulo 14)</li>
      </ul>
      <p>No necesitas ver la solución completa de inmediato — necesitas identificar correctamente el primer paso.</p>
    `
  },
  {
    id: 8,
    title: "Buenas prácticas",
    content: `
      <p>Un repaso rápido de todo el curso, condensado:</p>
      <ul>
        <li>✅ Piensa en entidades y atributos antes de escribir SQL (Módulo 0, 12)</li>
        <li>✅ WHERE filtra antes de agregar; HAVING filtra después (Módulo 6)</li>
        <li>✅ PARTITION BY reinicia por grupo; ORDER BY dentro de OVER() define el orden de la ventana (Módulo 10)</li>
        <li>✅ CTEs mejoran la legibilidad de subqueries anidadas (Módulo 9)</li>
        <li>✅ Indexa las columnas de tus JOINs y WHERE frecuentes (Módulo 14)</li>
        <li>✅ Toda pregunta de negocio se descompone en métrica + dimensión + filtro (Módulo 11)</li>
      </ul>
    `
  },
  {
    id: 9,
    title: "Errores comunes",
    content: `
      <p>Lo que más falla en un examen integrador como este:</p>
      <ul>
        <li><strong>Ver la primera técnica que reconoces y no la mejor:</strong> no toda pregunta con "cada grupo" es un GROUP BY — a veces es una window function (Módulo 10)</li>
        <li><strong>Olvidar los NULLs:</strong> COUNT(*) vs COUNT(columna), o JOIN vs LEFT JOIN, siguen importando aquí igual que en el Módulo 3 y 7</li>
        <li><strong>Mezclar RANK con DENSE_RANK sin pensarlo:</strong> la pregunta casi siempre insinúa cuál necesitas, según si "los huecos" importan (Módulo 10)</li>
        <li><strong>Optimizar antes de tener una respuesta correcta:</strong> primero correcto, después rápido (Módulo 14)</li>
      </ul>
      <p>Ningún error de esta lista es por falta de conocimiento — todos son por apurarse antes de identificar bien el problema.</p>
    `
  },
  {
    id: 10,
    title: "Examen Final",
    content: `
      <p>Llegó el momento. El "quiz" de este módulo no es un repaso del Módulo 17 — es un <strong>examen integrador de los 17 módulos completos</strong>.</p>
      <p>Las preguntas van a saltar entre temas sin avisar: una puede ser sobre JOINs, la siguiente sobre window functions, la siguiente sobre modelado de datos o performance.</p>
      <p>Necesitas <strong>6 de 10</strong> para aprobar y obtener el badge final: <strong>☠️ SQL GOD</strong>.</p>
      <p style="margin-top:12px; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15); text-align:center;">
        <code style="font-family:var(--font-mono); font-size:14px; color:var(--color-cyan);">18 módulos. 73 ejercicios. 1 examen final.</code>
      </p>
    `
  },
  {
    id: 11,
    title: "🏆 ¡Curso Completado!",
    isLast: true,
    content: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        text-align:center;
        gap:22px;
        padding:12px 0;
      ">
        <div style="font-size:72px; line-height:1;">🏆</div>

        <div>
          <p style="font-size:32px; font-weight:800; color:var(--color-text); margin:0 0 8px 0; letter-spacing:-0.02em;">
            ¡Completaste SQL Challenge Lab™!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            De "¿qué es SQL?" a diseñar, optimizar y comunicar soluciones de datos reales.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:15px; color:var(--color-text);">☠️ SQL GOD</code>
        </div>

        <p style="font-size:15px; color:var(--color-text-muted); max-width:420px;">
          18 módulos. 73 ejercicios reales. 8 quizzes. Este badge es tuyo.
        </p>
      </div>
    `
  }
];
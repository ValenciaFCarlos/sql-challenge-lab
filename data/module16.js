// data/module16.js
export const module16Cards = [
  {
    id: 1,
    title: "Cómo entrevistan a un Data Analyst",
    content: `
      <p>Cada rol de datos evalúa SQL con un énfasis distinto. Empecemos por <strong>Data Analyst</strong>.</p>
      <p><strong>Qué suelen evaluar:</strong></p>
      <ul>
        <li>Exploración de datos: llegar de una pregunta ambigua a una consulta concreta (como en el Módulo 11)</li>
        <li>Agregaciones y filtros — el core de SQL, bien ejecutado</li>
        <li>Interpretación de resultados: no solo "¿corre la query?", sino "¿qué significa este número para el negocio?"</li>
      </ul>
      <p><strong>Lo que buscan realmente:</strong> que puedas ir de datos crudos a un insight accionable, rápido y con criterio — no solo escribir SQL sintácticamente correcto.</p>
    `
  },
  {
    id: 2,
    title: "Cómo entrevistan a un BI Analyst",
    content: `
      <p>El rol de <strong>BI Analyst</strong> se superpone con Data Analyst, pero con un énfasis distinto: **consistencia** de métricas a través de múltiples dashboards.</p>
      <p><strong>Qué suelen evaluar:</strong></p>
      <ul>
        <li>Entendimiento de modelado de datos (Star Schema, tablas de hechos y dimensiones — Módulo 12)</li>
        <li>Cómo defines una métrica de forma que signifique lo mismo en todos los reportes</li>
        <li>Comunicación con gente no técnica: explicar un número sin jerga de SQL</li>
      </ul>
      <p>Una pregunta típica no es solo "escribe la query" — es <strong>"¿cómo asegurarías que 'usuario activo' signifique lo mismo en el dashboard de marketing y en el de producto?"</strong></p>
    `
  },
  {
    id: 3,
    title: "Cómo entrevistan a un Analytics Engineer",
    content: `
      <p>El rol de <strong>Analytics Engineer</strong> (Módulo 15) suele tener la entrevista técnica más exigente de las tres.</p>
      <p><strong>Qué suelen evaluar:</strong></p>
      <ul>
        <li>SQL avanzado: CTEs, window functions, subqueries — todo lo de los Módulos 8, 9 y 10</li>
        <li>Modelado de capas: cómo estructurarías raw → staging → mart para un caso dado</li>
        <li>A veces, un ejercicio práctico: "transforma estos datos crudos en una tabla lista para negocio"</li>
      </ul>
      <p>Si ya completaste los módulos anteriores de este curso, técnicamente estás preparado para esta parte — lo que sigue en este módulo es la parte que la mayoría no practica: <strong>cómo comunicar</strong> lo que sabes.</p>
    `
  },
  {
    id: 4,
    title: "Preguntas SQL frecuentes",
    content: `
      <p>Sin importar el rol, la mayoría de las entrevistas técnicas reciclan un puñado de patrones. Si dominas estos, cubres la gran mayoría de lo que te van a preguntar:</p>
      <ul>
        <li><strong>Top-N per group:</strong> "el producto más vendido de cada categoría"</li>
        <li><strong>Duplicados:</strong> encontrarlos y eliminarlos</li>
        <li><strong>Ranking:</strong> "el segundo salario más alto", con sus variantes de empates</li>
      </ul>
      <p>Ninguno de estos requiere sintaxis nueva — son exactamente las herramientas que ya usaste en los Módulos 6 y 10, aplicadas a las preguntas que se repiten una y otra vez en entrevistas reales.</p>
    `
  },
  {
    id: 5,
    title: "Top-N per Group",
    content: `
      <p>El patrón más clásico de todos: <strong>"el producto más vendido de cada categoría"</strong>, o cualquier variante de "el mejor/peor de cada grupo".</p>
      <p><strong>La solución estándar</strong> usa exactamente lo que aprendiste en el Módulo 10:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>WITH ranked AS (<br>&nbsp;&nbsp;SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) AS rn<br>&nbsp;&nbsp;FROM products<br>)<br>SELECT * FROM ranked WHERE rn = 1;</code>
      </p>
      <p><strong>Por qué funciona:</strong> <code>PARTITION BY</code> reinicia el conteo para cada categoría, y filtrar por <code>rn = 1</code> te deja solo con el primero de cada grupo, según el orden que definiste.</p>
      <p>Si te preguntan esto en una entrevista y reconoces el patrón, es una señal de que dominas window functions — que es exactamente lo que quieren ver.</p>
    `
  },
  {
    id: 6,
    title: "Duplicados",
    content: `
      <p>Otro clásico: encontrar y eliminar filas duplicadas.</p>
      <p><strong>Encontrar duplicados</strong> — ya lo hiciste en el Módulo 6:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;</code>
      </p>
      <p><strong>Eliminar duplicados</strong> (quedándote con uno) combina GROUP BY con window functions:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>WITH duplicados AS (<br>&nbsp;&nbsp;SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn<br>&nbsp;&nbsp;FROM users<br>)<br>DELETE FROM users WHERE id IN (SELECT id FROM duplicados WHERE rn > 1);</code>
      </p>
      <p>Es literalmente el mismo patrón de "Top-N per group" — solo que en vez de quedarte con el <code>rn = 1</code>, borras todo lo que <strong>no</strong> sea el primero.</p>
    `
  },
  {
    id: 7,
    title: "Ranking",
    content: `
      <p>La pregunta "¿cuál es el segundo salario más alto?" parece simple, pero esconde una decisión importante: <strong>¿qué pasa si hay un empate en el primer lugar?</strong></p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Función</span>
          <span>Con empate en 1°, ¿qué es el 2°?</span>
        </div>
        <div class="table-row">
          <span>ROW_NUMBER()</span>
          <span>Uno de los empatados en 1° (arbitrario)</span>
        </div>
        <div class="table-row">
          <span>RANK()</span>
          <span>El siguiente valor distinto, dejando huecos</span>
        </div>
        <div class="table-row">
          <span>DENSE_RANK()</span>
          <span>El siguiente valor distinto, sin huecos</span>
        </div>
      </div>
      <p>Esto es exactamente la diferencia que viste en el Módulo 10. En una entrevista, <strong>preguntar "¿qué pasa si hay empate?"</strong> antes de escribir código es señal de buen criterio, no de inseguridad.</p>
    `
  },
  {
    id: 8,
    title: "Casos de negocio",
    content: `
      <p>No toda pregunta de entrevista pide una query. Algunas son abiertas, tipo: <strong>"¿cómo medirías si una nueva feature es exitosa?"</strong></p>
      <p>Estas preguntas no tienen una única respuesta correcta — evalúan tu <strong>proceso de pensamiento</strong>, no sintaxis.</p>
      <p><strong>Una buena respuesta suele:</strong></p>
      <ul>
        <li>Aclarar qué significa "exitosa" antes de proponer una métrica (ver Módulo 11: métricas vs. dimensiones)</li>
        <li>Proponer 1-2 métricas concretas, no una lista interminable</li>
        <li>Mencionar cómo compararías (¿contra qué? ¿un grupo de control? ¿el período anterior?)</li>
        <li>Reconocer limitaciones ("esto no me dice si la mejora es causal, solo correlacional")</li>
      </ul>
      <p>Aquí es donde el Módulo 11 (Business Analytics) y este módulo se conectan directamente.</p>
    `
  },
  {
    id: 9,
    title: "Cómo comunicar tu solución",
    content: `
      <p>Dos personas pueden llegar al mismo SQL correcto, y una entrevistada mucho mejor que la otra — la diferencia está en <strong>cómo</strong> llegaron ahí.</p>
      <p><strong>Antes de escribir código:</strong></p>
      <ul>
        <li>Repite la pregunta con tus palabras, para confirmar que la entendiste</li>
        <li>Declara tus suposiciones en voz alta: <em>"voy a asumir que 'grade' puede repetirse entre estudiantes"</em></li>
      </ul>
      <p><strong>Después de escribir código:</strong></p>
      <ul>
        <li>Explica brevemente el porqué de tu enfoque, no solo qué hiciste</li>
        <li>Si hay una alternativa (ej. subquery vs. CTE, como viste en Módulo 9), menciónala y di por qué elegiste la tuya</li>
      </ul>
      <p>Un entrevistador rara vez puede leerte la mente — la calidad de tu comunicación es, literalmente, parte de lo que están evaluando.</p>
    `
  },
  {
    id: 10,
    title: "Pensar en voz alta",
    content: `
      <p>La habilidad más subestimada en una entrevista técnica: <strong>narrar tu proceso, incluso cuando estás atorado.</strong></p>
      <div class="analogy-box">
        <p>Un candidato en silencio durante 3 minutos, que luego da la respuesta correcta, genera más duda que uno que piensa en voz alta y tarda un poco más en llegar ahí.</p>
        <p>El silencio no permite que te ayuden a tiempo, ni demuestra cómo razonas.</p>
      </div>
      <p><strong>Cómo practicarlo:</strong></p>
      <ul>
        <li>Cuando te atores, di explícitamente en qué parte estás atorado: <em>"no estoy seguro si necesito un LEFT JOIN aquí o si un WHERE NOT IN sería más claro"</em></li>
        <li>Verbaliza pequeñas decisiones: <em>"voy a usar un CTE aquí para que sea más legible"</em></li>
        <li>Está bien decir "dame un segundo para pensar" — lo que no ayuda es el silencio sin avisar</li>
      </ul>
      <p>Practica esto en los retos de Practice Mode que ya resolviste: la próxima vez, intenta narrar tu razonamiento en voz alta mientras lo resuelves.</p>
    `
  },
  {
    id: 11,
    title: "🎉 ¡Felicidades!",
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
        <div style="font-size:72px; line-height:1;">🎉</div>

        <div>
          <p style="font-size:32px; font-weight:800; color:var(--color-text); margin:0 0 8px 0; letter-spacing:-0.02em;">
            ¡Módulo 16 Completado!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            Ya no solo sabes resolver el problema — sabes comunicar cómo lo resolviste.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:15px; color:var(--color-text);">Top-N · Duplicados · Ranking · Comunicación</code>
        </div>
      </div>
    `
  }
];
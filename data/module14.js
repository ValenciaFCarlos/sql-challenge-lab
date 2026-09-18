// data/module14.js
export const module14Cards = [
  {
    id: 1,
    title: "¿Por qué una consulta lenta cuesta dinero?",
    content: `
      <p>Antes de hablar de índices o planes de ejecución, hay que entender por qué esto le importa al negocio, no solo a quien escribe SQL.</p>
      <ul>
        <li>💰 <strong>Costo directo:</strong> en la nube, pagas por cómputo. Una consulta que tarda 10x más, cuesta 10x más cada vez que se ejecuta.</li>
        <li>⏱️ <strong>Costo de producto:</strong> un dashboard que tarda 30 segundos en cargar, o una app que se congela, se traduce en usuarios frustrados.</li>
        <li>🧠 <strong>Costo de decisión:</strong> si un reporte tarda tanto que nadie lo espera, las decisiones se toman sin esos datos.</li>
      </ul>
      <div class="analogy-box">
        <p>Una consulta lenta no es solo "código feo" — es una fuga de dinero, silenciosa, que se repite cada vez que alguien la ejecuta.</p>
      </div>
      <p>Este módulo te da las herramientas para encontrar y arreglar esas fugas.</p>
    `
  },
  {
    id: 2,
    title: "Cómo piensa el optimizador",
    content: `
      <p>Cuando escribes SQL, describes <strong>QUÉ</strong> quieres — no <strong>CÓMO</strong> obtenerlo. Ese "cómo" lo decide el <strong>optimizador de consultas</strong> del motor.</p>
      <p>Para la misma consulta, el optimizador puede elegir entre varias estrategias:</p>
      <ul>
        <li>Leer la tabla completa, fila por fila</li>
        <li>Usar un índice para saltar directo a las filas relevantes</li>
        <li>Distintos órdenes para ejecutar los JOINs de una consulta con varias tablas</li>
      </ul>
      <p>El optimizador elige basándose en estadísticas: cuántas filas tiene cada tabla, qué tan selectivo es un filtro, si existe un índice útil.</p>
      <p><strong>Esto es clave:</strong> dos consultas que devuelven el mismo resultado pueden tener tiempos de ejecución completamente distintos, según qué tan bien el optimizador pueda aprovechar la estructura de tus datos.</p>
    `
  },
  {
    id: 3,
    title: "Índices",
    content: `
      <p>Un <strong>índice</strong> es una estructura auxiliar que le permite al motor encontrar filas sin leer la tabla completa.</p>
      <div class="analogy-box">
        <p>📖 Es exactamente como el índice de un libro: en vez de leer todas las páginas buscando un tema, vas directo a la página correcta.</p>
      </div>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>CREATE INDEX idx_orders_customer ON orders(customer_id);</code>
      </p>
      <p><strong>Pero los índices no son gratis:</strong></p>
      <ul>
        <li>Ocupan espacio en disco</li>
        <li>Cada <code>INSERT</code>, <code>UPDATE</code> o <code>DELETE</code> también debe actualizar el índice — escrituras más lentas</li>
      </ul>
      <p><strong>Candidatos típicos para indexar:</strong> columnas usadas frecuentemente en <code>WHERE</code>, en la condición de un <code>JOIN</code>, o en <code>ORDER BY</code>.</p>
    `
  },
  {
    id: 4,
    title: "EXPLAIN",
    content: `
      <p><strong>EXPLAIN</strong> te muestra el plan de ejecución que el optimizador eligió, <strong>sin ejecutar la consulta</strong>.</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>EXPLAIN SELECT * FROM orders WHERE customer_id = 42;</code>
      </p>
      <p>El resultado incluye operaciones como:</p>
      <ul>
        <li><strong>Seq Scan (Sequential Scan):</strong> lee la tabla completa, fila por fila — costoso en tablas grandes</li>
        <li><strong>Index Scan:</strong> usa un índice para ir directo a las filas relevantes</li>
      </ul>
      <p>Si ves <code>Seq Scan</code> sobre una tabla de millones de filas en una consulta que se ejecuta constantemente, es una señal clara de que falta un índice.</p>
    `
  },
  {
    id: 5,
    title: "EXPLAIN ANALYZE",
    content: `
      <p><strong>EXPLAIN ANALYZE</strong> hace lo mismo que <code>EXPLAIN</code>, pero además <strong>ejecuta la consulta de verdad</strong> y muestra los tiempos reales, no solo estimados.</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;</code>
      </p>
      <p>Esto te permite comparar lo que el optimizador <strong>esperaba</strong> contra lo que realmente pasó — si son muy distintos, suele significar que las estadísticas de la tabla están desactualizadas.</p>
      <div class="analogy-box">
        <p><strong>Cuidado:</strong> como EXPLAIN ANALYZE ejecuta la consulta de verdad, si es un UPDATE o DELETE, esos cambios sí se aplican. En producción, suele probarse dentro de una transacción que luego se revierte.</p>
      </div>
    `
  },
  {
    id: 6,
    title: "Costos de JOIN",
    content: `
      <p>Ya sabes escribir JOINs (Módulo 7). Ahora piensa en su costo: unir dos tablas grandes <strong>sin un índice en la columna de unión</strong> obliga al motor a comparar filas de una tabla contra todas las de la otra.</p>
      <p><strong>Regla práctica:</strong> las columnas usadas en <code>ON</code> — típicamente Foreign Keys — son de las primeras candidatas a indexar.</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>CREATE INDEX idx_enrollments_student ON enrollments(student_id);</code>
      </p>
      <p>Con el índice correcto, un JOIN entre una tabla de un millón de filas y otra de mil puede tardar milisegundos en vez de segundos — la diferencia no está en el SQL que escribiste, está en si el motor puede "saltar" directo a las filas relevantes.</p>
    `
  },
  {
    id: 7,
    title: "Costos de agregación",
    content: `
      <p><code>GROUP BY</code> y <code>DISTINCT</code> (Módulos 2 y 6) no son gratis solo porque son declarativos — internamente, el motor tiene que ordenar o agrupar los datos en memoria (o en disco, si no caben).</p>
      <p><strong>Ejemplo del problema:</strong></p>
      <p style="margin:8px 0; padding:10px; background:rgba(255,95,87,0.06); border-radius:8px; border:1px solid rgba(255,95,87,0.15);">
        <code>SELECT city, COUNT(*) FROM students GROUP BY city;</code> — sobre una tabla de 50 millones de filas, sin filtrar nada primero.
      </p>
      <p><strong>Mejor:</strong> filtra ANTES de agregar, siempre que el negocio lo permita:</p>
      <p style="margin:8px 0; padding:10px; background:rgba(95,227,161,0.06); border-radius:8px; border:1px solid rgba(95,227,161,0.15);">
        <code>SELECT city, COUNT(*) FROM students WHERE enrollment_date >= '2024-01-01' GROUP BY city;</code>
      </p>
      <p>Menos filas para agrupar significa menos trabajo — el mismo principio de WHERE-antes-de-GROUP-BY que viste en Módulo 6, ahora visto desde el costo, no solo desde la sintaxis.</p>
    `
  },
  {
    id: 8,
    title: "El problema de SELECT *",
    content: `
      <p>Desde el Módulo 2 sabes que puedes pedir columnas específicas en vez de <code>SELECT *</code>. Ahora entiendes por qué importa:</p>
      <ul>
        <li><strong>Más datos viajan</strong> de la base de datos a tu aplicación, aunque no los uses</li>
        <li><strong>Impide "index-only scans":</strong> si un índice ya contiene todo lo que pediste, el motor puede responder sin tocar la tabla — pero solo si no pediste columnas de más con <code>*</code></li>
        <li><strong>Rompe silenciosamente</strong> si alguien agrega una columna nueva a la tabla y tu aplicación no la esperaba</li>
      </ul>
      <p><strong>Regla simple:</strong> pide exactamente las columnas que vas a usar. Es más rápido, más barato, y más seguro ante cambios futuros del esquema.</p>
    `
  },
  {
    id: 9,
    title: "Buenas prácticas",
    content: `
      <p>Un checklist rápido antes de dar por buena una consulta que se va a ejecutar seguido:</p>
      <ul>
        <li>✅ ¿Las columnas del <code>WHERE</code> y del <code>ON</code> tienen índice?</li>
        <li>✅ ¿Evitaste <code>SELECT *</code>, pidiendo solo lo que necesitas?</li>
        <li>✅ ¿Filtraste antes de agregar, cuando fue posible?</li>
        <li>✅ ¿Corriste <code>EXPLAIN ANALYZE</code> para confirmar que el plan usa índices, no <code>Seq Scan</code>?</li>
        <li>⚠️ ¿Usaste una función sobre una columna indexada en el WHERE (ej. <code>WHERE UPPER(city) = 'CDMX'</code>)? Eso puede impedir que el índice se use.</li>
      </ul>
      <p>Ninguna de estas reglas reemplaza medir con <code>EXPLAIN ANALYZE</code> — son un punto de partida, no una garantía.</p>
    `
  },
  {
    id: 10,
    title: "Caso real",
    content: `
      <p><strong>Escenario:</strong> un dashboard que muestra "pedidos por cliente" tarda 8 segundos en cargar. El equipo quiere saber por qué.</p>
      <p><strong>Diagnóstico paso a paso:</strong></p>
      <ul>
        <li><strong>1.</strong> Se corre <code>EXPLAIN ANALYZE</code> sobre la consulta del dashboard.</li>
        <li><strong>2.</strong> El plan muestra <code>Seq Scan</code> sobre la tabla <code>orders</code> (2 millones de filas) para el JOIN con <code>customers</code>.</li>
        <li><strong>3.</strong> Se confirma que <code>orders.customer_id</code> no tiene índice.</li>
        <li><strong>4.</strong> Se crea el índice: <code>CREATE INDEX idx_orders_customer ON orders(customer_id);</code></li>
        <li><strong>5.</strong> Se repite <code>EXPLAIN ANALYZE</code>: ahora aparece <code>Index Scan</code>, y el tiempo baja de 8 segundos a 120 milisegundos.</li>
      </ul>
      <p>Ninguna línea del SQL original cambió — el problema nunca fue "cómo estaba escrita la consulta", sino qué tan bien podía el motor aprovechar la estructura de los datos.</p>
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
            ¡Módulo 14 Completado!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            Ya no solo escribes consultas correctas — sabes diagnosticar por qué una es lenta.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:15px; color:var(--color-text);">EXPLAIN ANALYZE → índices → menos costo</code>
        </div>
      </div>
    `
  }
];
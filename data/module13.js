// data/module13.js
export const module13Cards = [
  {
    id: 1,
    title: "¿Por qué PostgreSQL?",
    content: `
      <p>Todo este curso usaste SQLite por debajo (a través de SQL.js) — perfecto para aprender, pero no lo que vas a encontrar en la mayoría de los empleos reales.</p>
      <p><strong>PostgreSQL</strong> es hoy el motor de base de datos open-source más usado en la industria, y por buenas razones:</p>
      <ul>
        <li>Cumple el estándar SQL de forma muy rigurosa</li>
        <li>Es extensible: soporta tipos de datos avanzados, extensiones, funciones personalizadas</li>
        <li>Escala desde una startup hasta sistemas con miles de millones de filas</li>
        <li>Es la base de datos "por defecto" en la mayoría de las plataformas cloud modernas</li>
      </ul>
      <p>El SQL que ya aprendiste (SELECT, JOIN, GROUP BY, window functions, CTEs) funciona prácticamente igual en PostgreSQL. Lo que cambia es todo lo que PostgreSQL agrega <strong>encima</strong> de ese estándar — eso es lo que ves en este módulo.</p>
    `
  },
  {
    id: 2,
    title: "PostgreSQL vs. SQLite",
    content: `
      <p>SQLite (lo que usaste en todo el curso) y PostgreSQL resuelven problemas distintos:</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Aspecto</span>
          <span>SQLite</span>
          <span>PostgreSQL</span>
        </div>
        <div class="table-row">
          <span>Arquitectura</span>
          <span>Embebida (un archivo)</span>
          <span>Cliente-servidor</span>
        </div>
        <div class="table-row">
          <span>Usuarios simultáneos</span>
          <span>Uno a la vez para escribir</span>
          <span>Miles, concurrentes</span>
        </div>
        <div class="table-row">
          <span>Caso de uso típico</span>
          <span>Apps móviles, prototipos, este curso</span>
          <span>Aplicaciones en producción</span>
        </div>
      </div>
      <p>SQLite fue la elección correcta para aprender: cero configuración, corre en el navegador. Pero ninguna aplicación real con muchos usuarios simultáneos se construye sobre SQLite como base principal.</p>
    `
  },
  {
    id: 3,
    title: "PostgreSQL vs. MySQL",
    content: `
      <p>La otra comparación obligada: PostgreSQL contra MySQL, los dos motores open-source más usados en producción.</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Aspecto</span>
          <span>PostgreSQL</span>
          <span>MySQL</span>
        </div>
        <div class="table-row">
          <span>Cumplimiento del estándar SQL</span>
          <span>Muy estricto</span>
          <span>Más flexible (a veces demasiado)</span>
        </div>
        <div class="table-row">
          <span>Tipos de datos avanzados</span>
          <span>JSONB, ARRAY, tipos personalizados</span>
          <span>Más limitado</span>
        </div>
        <div class="table-row">
          <span>Fortaleza histórica</span>
          <span>Integridad y extensibilidad</span>
          <span>Simplicidad y velocidad de lectura simple</span>
        </div>
      </div>
      <p>Ninguno es "mejor" en general — son trade-offs distintos. Pero si tu trabajo involucra datos complejos, analítica, o necesitas tipos de datos flexibles, PostgreSQL suele ganar. Por eso es el foco de este módulo.</p>
    `
  },
  {
    id: 4,
    title: "Tipos de datos avanzados",
    content: `
      <p>SQLite (y el SQL "de libro de texto") te acostumbró a un puñado de tipos: <code>INTEGER</code>, <code>TEXT</code>, <code>REAL</code>.</p>
      <p>PostgreSQL tiene un sistema de tipos mucho más rico. Los tres que vas a conocer en este módulo:</p>
      <ul>
        <li><strong>JSONB:</strong> datos semi-estructurados dentro de una columna relacional</li>
        <li><strong>ARRAY:</strong> una lista de valores en una sola columna</li>
        <li><strong>UUID:</strong> identificadores únicos sin depender de un contador central</li>
      </ul>
      <p>No son "trucos" aislados — cada uno resuelve un problema real de diseño que vas a encontrar en sistemas de producción. Vamos uno por uno.</p>
    `
  },
  {
    id: 5,
    title: "JSONB",
    content: `
      <p><strong>JSONB</strong> guarda un documento JSON dentro de una columna, y PostgreSQL lo indexa y lo puede consultar directamente.</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>CREATE TABLE products (id SERIAL, name TEXT, metadata JSONB);</code>
      </p>
      <p>Consultarlo usa operadores especiales: <code>-&gt;</code> devuelve JSON, <code>-&gt;&gt;</code> devuelve texto:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT name, metadata->>'color' AS color FROM products WHERE metadata->>'brand' = 'Nike';</code>
      </p>
      <p><strong>¿Cuándo usarlo?</strong> Cuando los atributos varían mucho entre filas y no vale la pena una columna para cada uno (ej. especificaciones técnicas de productos muy distintos entre sí).</p>
      <p><strong>¿Cuándo NO?</strong> Para datos centrales del negocio que sí tienen estructura fija — esos van en columnas normales, no en JSONB.</p>
    `
  },
  {
    id: 6,
    title: "ARRAY",
    content: `
      <p>PostgreSQL permite guardar una <strong>lista de valores</strong> directamente en una columna:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>CREATE TABLE articles (id SERIAL, title TEXT, tags TEXT[]);</code><br>
        <code>INSERT INTO articles (title, tags) VALUES ('SQL Avanzado', ARRAY['sql', 'postgres', 'tutorial']);</code>
      </p>
      <p>Se consulta con operadores como <code>ANY</code>:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT title FROM articles WHERE 'postgres' = ANY(tags);</code>
      </p>
      <div class="analogy-box">
        <p><strong>Señal de alerta:</strong> si encuentras que necesitas hacer JOIN, contar o filtrar seriamente sobre los elementos del array, probablemente esos datos deberían ser una tabla aparte (como en Módulo 12, con normalización). ARRAY es para casos simples, no para reemplazar una relación N:M.</p>
      </div>
    `
  },
  {
    id: 7,
    title: "UUID",
    content: `
      <p>Hasta ahora usaste <code>id INTEGER PRIMARY KEY</code> — un contador que sube de 1 en 1. Funciona bien... mientras haya un solo lugar generando IDs.</p>
      <p><strong>UUID</strong> (Universally Unique Identifier) es un identificador generado de forma independiente, sin coordinarse con nadie más, y aun así prácticamente imposible de repetir:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>CREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ...);</code>
      </p>
      <p>Se ve así: <code>a1b2c3d4-e5f6-7890-abcd-ef1234567890</code></p>
      <p><strong>¿Por qué importa?</strong> En sistemas distribuidos (varios servidores insertando datos al mismo tiempo, o sincronizando datos entre distintas bases), un contador central se vuelve un cuello de botella. Con UUID, cada servidor genera IDs válidos sin hablar con nadie más.</p>
    `
  },
  {
    id: 8,
    title: "RETURNING",
    content: `
      <p>En SQLite, si insertas una fila y necesitas su ID generado, normalmente haces una segunda consulta para obtenerlo.</p>
      <p>PostgreSQL te deja devolver datos directamente desde el mismo <code>INSERT</code>, <code>UPDATE</code> o <code>DELETE</code>, con <strong>RETURNING</strong>:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>INSERT INTO customers (name, email) VALUES ('Ana López', 'ana@mail.com') RETURNING id, created_at;</code>
      </p>
      <p>Esto ahorra una consulta completa — útil sobre todo en aplicaciones que insertan datos y necesitan el resultado inmediatamente (por ejemplo, para mostrarlo en una respuesta de API).</p>
    `
  },
  {
    id: 9,
    title: "UPSERT (ON CONFLICT)",
    content: `
      <p>Un problema muy común: quieres insertar una fila, pero si ya existe (mismo ID, mismo email, etc.), quieres actualizarla en vez de fallar con un error.</p>
      <p>PostgreSQL resuelve esto en una sola sentencia con <strong>ON CONFLICT</strong> (comúnmente llamado "UPSERT" = update + insert):</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>INSERT INTO customers (email, name) VALUES ('ana@mail.com', 'Ana López')<br>
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;</code>
      </p>
      <p>Sin esto, tendrías que hacer un <code>SELECT</code> para verificar si existe, y luego decidir entre <code>INSERT</code> o <code>UPDATE</code> — dos consultas y una condición de carrera posible. UPSERT lo resuelve en una sola operación atómica.</p>
    `
  },
  {
    id: 10,
    title: "Schemas",
    content: `
      <p>Un <strong>schema</strong> en PostgreSQL es un espacio de nombres dentro de una misma base de datos — una forma de organizar tablas relacionadas juntas.</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>CREATE SCHEMA analytics;</code><br>
        <code>CREATE TABLE analytics.daily_revenue (...);</code>
      </p>
      <p>Se consulta indicando el schema antes del nombre de la tabla:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT * FROM analytics.daily_revenue;</code>
      </p>
      <p>Por defecto, todo vive en el schema <code>public</code> (el único que has usado hasta ahora, sin saberlo). Los schemas se usan para separar lógicamente datos de distintos equipos, aplicaciones, o capas (como la arquitectura raw/staging/mart que verás en el Módulo 15).</p>
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
            ¡Módulo 13 Completado!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            De SQLite a PostgreSQL — ya conoces las herramientas que vas a usar en producción.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:15px; color:var(--color-text);">JSONB · ARRAY · UUID · RETURNING · UPSERT</code>
        </div>
      </div>
    `
  }
];
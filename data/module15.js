// data/module15.js
export const module15Cards = [
  {
    id: 1,
    title: "¿Qué es Analytics Engineering?",
    content: `
      <p>Durante años, el trabajo con datos se dividió en dos roles separados:</p>
      <ul>
        <li>🔧 <strong>Data Engineer:</strong> construye los pipelines que mueven datos de un sistema a otro</li>
        <li>📊 <strong>Data/Business Analyst:</strong> escribe SQL para responder preguntas de negocio (como en el Módulo 11)</li>
      </ul>
      <p>Entre esos dos roles había un vacío: alguien tenía que <strong>transformar</strong> los datos crudos en tablas limpias y confiables, listas para que un analista las consultara sin reinventar la lógica cada vez.</p>
      <p><strong>Analytics Engineering</strong> es ese rol puente. Usa SQL (todo lo que ya aprendiste) con prácticas de ingeniería de software: control de versiones, pruebas automáticas, documentación.</p>
      <div class="analogy-box">
        <p>Si Data Engineering construye las tuberías y Business Analytics abre la llave para tomar agua, Analytics Engineering es quien se asegura de que el agua que sale sea potable.</p>
      </div>
    `
  },
  {
    id: 2,
    title: "ELT (no ETL)",
    content: `
      <p>El enfoque tradicional era <strong>ETL</strong>: Extract (extraer), Transform (transformar fuera de la base de datos), Load (cargar ya transformado).</p>
      <p>El enfoque moderno invirtió el orden: <strong>ELT</strong> — Extract, Load, Transform.</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Enfoque</span>
          <span>Dónde se transforma</span>
          <span>Cuándo tiene sentido</span>
        </div>
        <div class="table-row">
          <span>ETL</span>
          <span>Fuera del warehouse, antes de cargar</span>
          <span>Cuando el cómputo del warehouse era caro/limitado</span>
        </div>
        <div class="table-row">
          <span>ELT</span>
          <span>Dentro del warehouse, con SQL</span>
          <span>Hoy: cómputo en la nube es barato y potente</span>
        </div>
      </div>
      <p><strong>¿Por qué cambió?</strong> Los warehouses modernos son tan potentes que resulta más simple cargar los datos crudos primero, y transformarlos después usando el mismo SQL que ya sabes — en vez de un proceso externo separado.</p>
    `
  },
  {
    id: 3,
    title: "Raw Layer",
    content: `
      <p>La <strong>Raw Layer</strong> (capa cruda) contiene los datos exactamente como llegaron de la fuente — sin limpiar, sin transformar, sin corregir nada.</p>
      <p><strong>Por qué se conserva así, "sucia":</strong></p>
      <ul>
        <li>Es tu <strong>fuente de verdad</strong>. Si algo se rompe en una transformación más adelante, siempre puedes reconstruir todo desde aquí.</li>
        <li>Nunca se modifica manualmente ni se "arregla" — cualquier corrección ocurre en capas posteriores, de forma repetible.</li>
      </ul>
      <p>Piensa en la Raw Layer como el <code>populateSql</code> que viste en cada dataset de este curso: los datos tal cual, antes de que cualquier lógica los toque.</p>
    `
  },
  {
    id: 4,
    title: "Staging Layer",
    content: `
      <p>La <strong>Staging Layer</strong> hace la limpieza mínima, sin agregar lógica de negocio todavía:</p>
      <ul>
        <li>Renombrar columnas a un estándar consistente</li>
        <li>Convertir tipos de datos (texto a fecha, texto a número)</li>
        <li>Nada de JOINs con otras tablas, nada de reglas de negocio</li>
      </ul>
      <p>La convención más común: <strong>un modelo de staging por cada tabla cruda</strong>, con una relación 1 a 1.</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>-- stg_orders.sql<br>SELECT<br>&nbsp;&nbsp;id AS order_id,<br>&nbsp;&nbsp;CAST(order_date AS DATE) AS order_date<br>FROM raw.orders;</code>
      </p>
      <p>Nada emocionante todavía — y así debe ser. Esta capa es la base aburrida y confiable sobre la que se construye todo lo demás.</p>
    `
  },
  {
    id: 5,
    title: "Intermediate Layer",
    content: `
      <p>Aquí empieza la lógica real: la <strong>Intermediate Layer</strong> combina varios modelos de staging usando JOINs, y aplica reglas de negocio reutilizables.</p>
      <p><strong>Ejemplo:</strong> combinar <code>stg_orders</code> con <code>stg_order_items</code> y <code>stg_products</code> para calcular el revenue por pedido — exactamente el tipo de JOIN + agregación que ya dominas desde los Módulos 7 y 8.</p>
      <p>La idea clave: si dos o más reportes finales necesitan la misma lógica intermedia (por ejemplo, "revenue por pedido"), se calcula <strong>una sola vez aquí</strong>, no repetida en cada consulta final.</p>
      <div class="analogy-box">
        <p>Es el mismo principio de normalización del Módulo 12, aplicado a lógica en vez de a datos: evitar repetir el mismo cálculo en 10 lugares distintos.</p>
      </div>
    `
  },
  {
    id: 6,
    title: "Mart Layer",
    content: `
      <p>La <strong>Mart Layer</strong> es el destino final: tablas listas para que un analista, un dashboard, o alguien de negocio las consulte directamente.</p>
      <p>Suelen organizarse por dominio de negocio:</p>
      <ul>
        <li>📈 <code>marketing_mart</code> — métricas de campañas, adquisición</li>
        <li>💰 <code>finance_mart</code> — revenue, costos, márgenes</li>
        <li>📦 <code>product_mart</code> — uso de features, engagement</li>
      </ul>
      <p>Estas tablas suelen tener exactamente la forma del <strong>Star Schema</strong> que viste en el Módulo 12: una tabla de hechos con métricas, rodeada de dimensiones — lista para las consultas de Business Analytics del Módulo 11.</p>
      <p>Si alguien de negocio pregunta "¿de dónde sale este número del dashboard?", la respuesta debería ser: de una tabla en la Mart Layer, construida de forma trazable desde Raw → Staging → Intermediate → Mart.</p>
    `
  },
  {
    id: 7,
    title: "Data Quality",
    content: `
      <p>Una consulta que "corre sin error" no significa que el dato esté bien. Problemas comunes que pasan desapercibidos:</p>
      <ul>
        <li><strong>Filas duplicadas:</strong> un mismo pedido aparece dos veces por un error en el pipeline</li>
        <li><strong>Foreign Keys huérfanas:</strong> un <code>customer_id</code> en <code>orders</code> que no existe en <code>customers</code></li>
        <li><strong>NULLs inesperados:</strong> una columna que "nunca" debería estar vacía, y de repente lo está</li>
        <li><strong>Valores imposibles:</strong> una edad negativa, un precio en cero donde no debería pasar</li>
      </ul>
      <p>Ninguno de estos errores rompe la consulta — todos devuelven un resultado. Pero ese resultado está mintiendo silenciosamente.</p>
    `
  },
  {
    id: 8,
    title: "Tests",
    content: `
      <p>La solución a la Data Quality no es "revisar manualmente de vez en cuando" — es automatizar verificaciones que corren cada vez que se actualizan los datos.</p>
      <p><strong>Tipos de test más comunes:</strong></p>
      <ul>
        <li><strong>unique:</strong> esta columna no debe tener valores repetidos (ej. un id)</li>
        <li><strong>not_null:</strong> esta columna nunca debe estar vacía</li>
        <li><strong>relationships:</strong> todo valor de esta Foreign Key debe existir en la tabla referenciada</li>
        <li><strong>accepted_values:</strong> esta columna solo puede tener ciertos valores (ej. status IN ('activo', 'cancelado'))</li>
      </ul>
      <p>Si un test falla, el pipeline se detiene o alerta — antes de que el dato incorrecto llegue a un dashboard y alguien tome una decisión basada en él.</p>
    `
  },
  {
    id: 9,
    title: "Materializations",
    content: `
      <p>Cuando defines un modelo de transformación, tienes que decidir <strong>cómo se guarda</strong> el resultado. Las tres opciones principales:</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Tipo</span>
          <span>Velocidad de lectura</span>
          <span>Actualización</span>
        </div>
        <div class="table-row">
          <span>Vista (View)</span>
          <span>Se recalcula en cada consulta</span>
          <span>Siempre al día</span>
        </div>
        <div class="table-row">
          <span>Tabla (Table)</span>
          <span>Rápida (ya está calculada)</span>
          <span>Requiere reconstruirla</span>
        </div>
        <div class="table-row">
          <span>Vista Materializada</span>
          <span>Rápida (guardada como tabla)</span>
          <span>Se refresca manualmente o programada</span>
        </div>
      </div>
      <p>Una vista materializada es el punto medio: se define como una vista (una consulta), pero se guarda físicamente como una tabla — y hay que decidir cada cuánto refrescarla.</p>
      <p><strong>Regla práctica:</strong> capas que se consultan poco (Intermediate) suelen ser vistas; capas que se consultan constantemente (Mart) suelen materializarse como tablas.</p>
    `
  },
  {
    id: 10,
    title: "dbt (conceptual)",
    content: `
      <p>Todo lo que viste en este módulo — capas, tests, materializaciones — se convirtió en una práctica estándar de la industria gracias a una herramienta: <strong>dbt</strong> (data build tool).</p>
      <p>No la vas a instalar en este curso — la idea es entender <strong>qué resuelve</strong>:</p>
      <ul>
        <li>Escribes cada modelo como un <code>SELECT</code> normal (todo el SQL que ya sabes)</li>
        <li>dbt entiende las dependencias entre modelos (staging → intermediate → mart) y los construye en el orden correcto</li>
        <li>Corre los tests automáticamente antes de considerar el pipeline exitoso</li>
        <li>Genera documentación y un diagrama de dependencias, casi gratis</li>
      </ul>
      <p>En una frase: <strong>dbt le aplicó prácticas de ingeniería de software (versionado, pruebas, documentación) a algo que antes era solo SQL suelto en scripts.</strong> Es, probablemente, la herramienta más mencionada en ofertas de trabajo de Analytics Engineering hoy.</p>
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
            ¡Módulo 15 Completado!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            Ya entiendes cómo se organiza el SQL en un equipo de datos real, de punta a punta.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:15px; color:var(--color-text);">raw → staging → intermediate → mart</code>
        </div>
      </div>
    `
  }
];
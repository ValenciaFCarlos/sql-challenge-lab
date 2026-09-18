// data/module12.js
export const module12Cards = [
  {
    id: 1,
    title: "¿Qué es modelar datos?",
    content: `
      <p>Hasta ahora, en cada módulo recibiste una tabla ya lista, con sus columnas y su esquema definidos.</p>
      <p><strong>Modelar datos</strong> es la decisión que viene ANTES de eso: ¿qué tablas necesito? ¿qué columnas va en cada una? ¿cómo se conectan?</p>
      <div class="analogy-box">
        <p><strong>Analogía:</strong></p>
        <p>🏗️ No construyes una casa y luego dibujas el plano.</p>
        <p>Dibujas el plano, y ese plano determina qué tan fácil (o difícil) será vivir en esa casa después.</p>
      </div>
      <p>Un mal modelo de datos no se nota el primer día. Se nota seis meses después, cuando una pregunta simple del negocio requiere una consulta imposible de escribir.</p>
      <p>En este módulo aprenderás a diseñar el plano, no solo a habitar la casa.</p>
    `
  },
  {
    id: 2,
    title: "Entidades",
    content: `
      <p>En el Módulo 0 viste que una <strong>entidad</strong> es un objeto del mundo real que se convierte en una tabla.</p>
      <p>Ahora la pregunta cambia: dado un problema de negocio, ¿cómo identificas cuáles son las entidades?</p>
      <p><strong>Ejemplo:</strong> "Necesitamos un sistema para una tienda en línea."</p>
      <ul>
        <li>👤 <strong>Customer</strong> — quién compra</li>
        <li>📦 <strong>Product</strong> — qué se vende</li>
        <li>🧾 <strong>Order</strong> — qué se compró y cuándo</li>
        <li>💳 <strong>Payment</strong> — cómo se pagó</li>
      </ul>
      <p><strong>Truco práctico:</strong> los sustantivos importantes de la descripción del problema casi siempre son tus entidades candidatas.</p>
    `
  },
  {
    id: 3,
    title: "Relaciones",
    content: `
      <p>Ya sabes que las entidades se conectan con Primary Keys y Foreign Keys. La pregunta de diseño es: <strong>¿cuándo basta una FK directa, y cuándo necesitas una tabla puente?</strong></p>
      <ul>
        <li><strong>FK directa:</strong> cuando una entidad "pertenece" claramente a otra. Un <code>Order</code> pertenece a un <code>Customer</code> → <code>orders.customer_id</code>.</li>
        <li><strong>Tabla puente:</strong> cuando dos entidades se relacionan entre sí de forma independiente, y cada una puede relacionarse con muchas de la otra.</li>
      </ul>
      <p><strong>Ejemplo:</strong> un <code>Order</code> puede tener muchos <code>Product</code>, y un <code>Product</code> puede aparecer en muchos <code>Order</code>. Ninguno "pertenece" al otro — necesitas <code>order_items</code> como puente.</p>
      <p>Esta decisión no es arbitraria: depende directamente de la <strong>cardinalidad</strong> de la relación, que es la siguiente card.</p>
    `
  },
  {
    id: 4,
    title: "Cardinalidad",
    content: `
      <p>Ya viste 1:1, 1:N y N:M en el Módulo 0. Ahora veamos qué implica cada una <strong>al momento de diseñar</strong>:</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Cardinalidad</span>
          <span>Ejemplo</span>
          <span>Cómo se implementa</span>
        </div>
        <div class="table-row">
          <span>1:1</span>
          <span>Usuario ↔ Perfil</span>
          <span>A veces se fusionan en una sola tabla</span>
        </div>
        <div class="table-row">
          <span>1:N</span>
          <span>Cliente → Pedidos</span>
          <span>FK en el lado "muchos" (orders.customer_id)</span>
        </div>
        <div class="table-row">
          <span>N:M</span>
          <span>Pedidos ↔ Productos</span>
          <span>Tabla puente (order_items)</span>
        </div>
      </div>
      <p>Identificar mal la cardinalidad es el error de diseño más común — y el más caro de corregir después, porque ya hay datos guardados con la estructura equivocada.</p>
    `
  },
  {
    id: 5,
    title: "Normalización",
    content: `
      <p>La <strong>normalización</strong> es el proceso de organizar tablas para evitar redundancia y datos inconsistentes.</p>
      <p><strong>Ejemplo de un mal diseño (no normalizado):</strong></p>
      <div class="table-preview">
        <div class="table-row header">
          <span>order_id</span>
          <span>customer_name</span>
          <span>customer_email</span>
        </div>
        <div class="table-row">
          <span>1</span>
          <span>Ana López</span>
          <span>ana@mail.com</span>
        </div>
        <div class="table-row">
          <span>2</span>
          <span>Ana López</span>
          <span>ana@mail.com</span>
        </div>
      </div>
      <p>El nombre y el correo de Ana están repetidos en cada pedido. Si Ana cambia su correo, hay que actualizarlo en <strong>todas las filas</strong> — y si se te olvida una, tus datos quedan inconsistentes.</p>
      <p>Normalizar significa separar esto: una tabla <code>customers</code>, y <code>orders</code> solo guarda <code>customer_id</code>.</p>
    `
  },
  {
    id: 6,
    title: "1NF — Primera Forma Normal",
    content: `
      <p>Una tabla cumple la <strong>Primera Forma Normal (1NF)</strong> cuando:</p>
      <ul>
        <li>Cada columna contiene <strong>valores atómicos</strong> (no listas, no valores separados por comas).</li>
        <li>No hay grupos de columnas repetidas (como <code>phone1</code>, <code>phone2</code>, <code>phone3</code>).</li>
      </ul>
      <p><strong>Viola 1NF:</strong></p>
      <p style="margin:8px 0; padding:10px; background:rgba(255,95,87,0.06); border-radius:8px; border:1px solid rgba(255,95,87,0.15);">
        <code>phones: "555-1234, 555-5678"</code>
      </p>
      <p><strong>Cumple 1NF:</strong> una tabla separada <code>customer_phones</code> con una fila por teléfono.</p>
      <p>1NF es la base: sin valores atómicos, ni siquiera puedes filtrar o agregar esos datos correctamente con SQL.</p>
    `
  },
  {
    id: 7,
    title: "2NF — Segunda Forma Normal",
    content: `
      <p>La <strong>Segunda Forma Normal (2NF)</strong> aplica cuando una tabla tiene una <strong>clave primaria compuesta</strong> (dos o más columnas juntas).</p>
      <p>Exige que cada columna que no es parte de la clave dependa de <strong>toda</strong> la clave, no solo de una parte.</p>
      <p><strong>Ejemplo:</strong> una tabla <code>order_items(order_id, product_id, product_name, quantity)</code>.</p>
      <p><code>product_name</code> depende solo de <code>product_id</code>, no de <code>order_id</code> — eso es una dependencia parcial, y viola 2NF.</p>
      <p><strong>Solución:</strong> <code>product_name</code> se muda a la tabla <code>products</code>, donde depende completamente de su propia clave.</p>
    `
  },
  {
    id: 8,
    title: "3NF — Tercera Forma Normal",
    content: `
      <p>La <strong>Tercera Forma Normal (3NF)</strong> elimina las <strong>dependencias transitivas</strong>: cuando una columna no-clave depende de otra columna no-clave, en vez de depender de la clave primaria.</p>
      <p><strong>Ejemplo:</strong> una tabla <code>orders(order_id, customer_id, customer_city, customer_country)</code>.</p>
      <p><code>customer_country</code> depende de <code>customer_city</code>, y <code>customer_city</code> depende de <code>customer_id</code> — no de <code>order_id</code> directamente. Eso es una cadena transitiva.</p>
      <p><strong>Solución:</strong> esos datos del cliente pertenecen a la tabla <code>customers</code>, no a <code>orders</code>.</p>
      <p>La mayoría de las bases de datos operacionales (las que sostienen una aplicación en producción) buscan llegar hasta 3NF.</p>
    `
  },
  {
    id: 9,
    title: "Star Schema",
    content: `
      <p>Todo lo anterior aplica a bases de datos <strong>operacionales</strong>. Pero en analítica de negocio (como viste en el Módulo 11), el objetivo cambia: no es evitar redundancia, es <strong>hacer las consultas rápidas y simples</strong>.</p>
      <p>El <strong>Star Schema</strong> organiza los datos en:</p>
      <ul>
        <li><strong>Tabla de hechos (fact table):</strong> el centro — eventos o transacciones, con métricas numéricas (ej. <code>sales_fact</code>: revenue, quantity).</li>
        <li><strong>Tablas de dimensiones:</strong> alrededor — contexto para filtrar y agrupar (ej. <code>dim_customer</code>, <code>dim_product</code>, <code>dim_date</code>).</li>
      </ul>
      <div class="analogy-box">
        <p>⭐ Se llama "estrella" porque, dibujado, la tabla de hechos queda en el centro con las dimensiones alrededor, como los picos de una estrella.</p>
      </div>
      <p>Este es el modelo que hace posible las consultas del Módulo 11: <code>SELECT dim_date.month, SUM(sales_fact.revenue) FROM sales_fact JOIN dim_date ...</code></p>
    `
  },
  {
    id: 10,
    title: "Snowflake Schema",
    content: `
      <p>El <strong>Snowflake Schema</strong> es un Star Schema donde las dimensiones, a su vez, se normalizan en sub-tablas.</p>
      <p><strong>Ejemplo:</strong> en vez de que <code>dim_product</code> tenga una columna <code>category_name</code> repetida en cada producto, se separa en una tabla <code>dim_category</code> aparte.</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Modelo</span>
          <span>Ventaja</span>
          <span>Costo</span>
        </div>
        <div class="table-row">
          <span>Star</span>
          <span>Consultas simples, menos JOINs</span>
          <span>Algo de redundancia en dimensiones</span>
        </div>
        <div class="table-row">
          <span>Snowflake</span>
          <span>Menos redundancia</span>
          <span>Más JOINs, consultas más complejas</span>
        </div>
      </div>
      <p><strong>En la práctica:</strong> la mayoría de los equipos de analítica prefieren Star Schema — el espacio en disco es barato, pero el tiempo de un analista escribiendo JOINs extra no lo es.</p>
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
            ¡Módulo 12 Completado!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            Ahora sabes diseñar el plano, no solo habitar la casa. Demuéstralo en el quiz final.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:15px; color:var(--color-text);">1NF → 2NF → 3NF → Star Schema</code>
        </div>
      </div>
    `
  }
];
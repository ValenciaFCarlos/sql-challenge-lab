// data/module11.js
export const module11Cards = [
  {
    id: 1,
    title: "¿Qué es un KPI?",
    content: `
      <p>Hasta ahora, cada reto te pedía una consulta concreta: "selecciona esto", "filtra aquello".</p>
      <p>En el mundo real, nadie te pide un <code>SELECT</code>. Te preguntan:</p>
      <ul>
        <li>¿Cómo va el negocio este mes?</li>
        <li>¿Estamos creciendo o estancados?</li>
        <li>¿Los clientes se están yendo?</li>
      </ul>
      <p>Un <strong>KPI</strong> (Key Performance Indicator) es un número que resume el desempeño de algo importante para el negocio.</p>
      <div class="analogy-box">
        <p><strong>Analogía:</strong></p>
        <p>🚗 El velocímetro de un auto no te dice todo lo que pasa dentro del motor.</p>
        <p>Pero de un vistazo te dice si vas demasiado rápido o demasiado lento.</p>
        <p>Un KPI es el velocímetro del negocio.</p>
      </div>
      <p>En este módulo, tu trabajo cambia: <strong>de escribir SQL a responder preguntas de negocio con SQL.</strong></p>
    `
  },
  {
    id: 2,
    title: "Métricas vs. Dimensiones",
    content: `
      <p>Toda pregunta de negocio se puede descomponer en dos piezas:</p>
      <ul>
        <li><strong>Métrica:</strong> lo que se mide. Es numérico y se puede sumar, promediar o contar.</li>
        <li><strong>Dimensión:</strong> por lo que se corta o agrupa esa métrica. No se suma, se usa para segmentar.</li>
      </ul>
      <div class="table-preview">
        <div class="table-row header">
          <span>Pregunta</span>
          <span>Métrica</span>
          <span>Dimensión</span>
        </div>
        <div class="table-row">
          <span>Ventas por país</span>
          <span>revenue</span>
          <span>country</span>
        </div>
        <div class="table-row">
          <span>Usuarios por plan</span>
          <span>COUNT(users)</span>
          <span>plan</span>
        </div>
        <div class="table-row">
          <span>Ingresos por mes</span>
          <span>revenue</span>
          <span>month</span>
        </div>
      </div>
      <p>En SQL, esto se traduce casi literalmente: la métrica va en una función de agregación, la dimensión va en el <code>GROUP BY</code>.</p>
      <p style="margin-top:12px; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT country, SUM(revenue) FROM sales GROUP BY country;</code>
      </p>
    `
  },
  {
    id: 3,
    title: "Revenue",
    content: `
      <p><strong>Revenue</strong> (ingreso) es, casi siempre, la métrica más importante de cualquier negocio.</p>
      <p>En su forma más simple, es una suma:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT SUM(amount) AS revenue FROM orders WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';</code>
      </p>
      <p><strong>Pero "revenue" no es un solo número:</strong></p>
      <ul>
        <li><strong>Gross revenue:</strong> todo lo facturado, sin descontar nada.</li>
        <li><strong>Net revenue:</strong> descontando devoluciones, descuentos, impuestos.</li>
        <li><strong>MRR (Monthly Recurring Revenue):</strong> ingreso recurrente mensual, clave en negocios de suscripción.</li>
      </ul>
      <p>Antes de escribir la consulta, siempre pregunta: <strong>¿revenue de qué tipo, exactamente?</strong> Es el error más común al analizar negocios.</p>
    `
  },
  {
    id: 4,
    title: "Growth",
    content: `
      <p><strong>Growth</strong> (crecimiento) compara una métrica entre dos períodos.</p>
      <p>La fórmula es siempre la misma:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15); text-align:center;">
        <code>crecimiento % = (actual − anterior) / anterior × 100</code>
      </p>
      <p>Para calcular esto en SQL, necesitas el valor del período actual <strong>y</strong> el del período anterior en la misma fila. ¿Te suena familiar?</p>
      <p>Es exactamente el problema que resolviste con <strong>LAG()</strong> en el Módulo 10:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT month, revenue, LAG(revenue) OVER (ORDER BY month) AS revenue_mes_anterior FROM monthly_revenue;</code>
      </p>
      <p>Las window functions no eran solo un ejercicio técnico — son la herramienta que usa un analista de negocio todos los días.</p>
    `
  },
  {
    id: 5,
    title: "Retention",
    content: `
      <p><strong>Retention</strong> (retención) mide qué porcentaje de usuarios de un período siguen activos en el período siguiente.</p>
      <p><strong>Ejemplo:</strong> de los 100 usuarios que compraron en enero, ¿cuántos volvieron a comprar en febrero?</p>
      <ul>
        <li>Si 40 volvieron → retención de 40%.</li>
        <li>Los otros 60 se consideran "en riesgo" o ya perdidos.</li>
      </ul>
      <p>La retención suele calcularse comparando dos conjuntos de usuarios (el de un mes contra el del mes siguiente), típicamente con un <code>JOIN</code> o un <code>EXISTS</code> entre ambos períodos.</p>
      <div class="analogy-box">
        <p><strong>Por qué importa más que "cuántos usuarios nuevos llegaron":</strong></p>
        <p>Conseguir usuarios nuevos es caro. Un negocio que no retiene a nadie tiene que conseguir usuarios nuevos para siempre solo para mantenerse igual — como llenar un balde con un agujero.</p>
      </div>
    `
  },
  {
    id: 6,
    title: "Churn",
    content: `
      <p><strong>Churn</strong> es el reverso exacto de retention:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15); text-align:center;">
        <code>churn % = 100% − retention %</code>
      </p>
      <p>Si la retención fue 40%, el churn fue 60%: esos son los usuarios que se fueron.</p>
      <div class="analogy-box">
        <p>🪣 Retomando la analogía del balde con agujero:</p>
        <p><strong>Growth</strong> es cuánta agua le echas. <strong>Churn</strong> es qué tan grande es el agujero.</p>
        <p>Una empresa puede crecer en usuarios nuevos y aun así estar perdiendo, si el churn es más grande que el growth.</p>
      </div>
      <p>Por eso ningún KPI se analiza solo — <strong>growth sin churn es una historia incompleta.</strong></p>
    `
  },
  {
    id: 7,
    title: "Cohorts",
    content: `
      <p>Un <strong>cohort</strong> es un grupo de usuarios que comparten algo en común — normalmente, la fecha en la que empezaron.</p>
      <p><strong>Ejemplo:</strong> "el cohort de enero 2024" son todos los usuarios que se registraron en enero.</p>
      <p>El análisis de cohortes compara cómo se comporta cada grupo <strong>a medida que pasa el tiempo</strong>, no en un momento fijo:</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>Cohort</span>
          <span>Mes 1</span>
          <span>Mes 2</span>
        </div>
        <div class="table-row">
          <span>Enero</span>
          <span>100%</span>
          <span>45%</span>
        </div>
        <div class="table-row">
          <span>Febrero</span>
          <span>100%</span>
          <span>60%</span>
        </div>
      </div>
      <p>Esta tabla dice algo que un solo número nunca podría: <strong>el cohort de febrero retiene mejor que el de enero</strong> — quizás algo cambió en el producto entre esos dos meses.</p>
      <p>Sin cohortes, una métrica global de retención esconde estas diferencias.</p>
    `
  },
  {
    id: 8,
    title: "Funnels",
    content: `
      <p>Un <strong>funnel</strong> (embudo) mide cómo los usuarios avanzan a través de una secuencia de pasos.</p>
      <p><strong>Ejemplo clásico de e-commerce:</strong></p>
      <ul>
        <li>1. Visitó el sitio</li>
        <li>2. Agregó un producto al carrito</li>
        <li>3. Inició el pago</li>
        <li>4. Completó la compra</li>
      </ul>
      <p>En cada paso se pierden usuarios — eso es normal. Lo que importa es <strong>la tasa de conversión entre pasos</strong>.</p>
      <p>Un patrón muy común en SQL para esto es contar usuarios distintos por etapa, usando <code>CASE WHEN</code> dentro de una agregación:</p>
      <p style="margin:12px 0; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15);">
        <code>SELECT<br>&nbsp;&nbsp;COUNT(DISTINCT CASE WHEN event = 'visita' THEN user_id END) AS visitas,<br>&nbsp;&nbsp;COUNT(DISTINCT CASE WHEN event = 'compra' THEN user_id END) AS compras<br>FROM events;</code>
      </p>
      <p>Un funnel bien medido te dice exactamente <strong>en qué paso</strong> se está perdiendo a la gente — no solo que "las ventas están bajas".</p>
    `
  },
  {
    id: 9,
    title: "Traducir preguntas de negocio a SQL",
    content: `
      <p>La habilidad real de este módulo no es memorizar fórmulas — es traducir una pregunta ambigua en algo que SQL pueda responder.</p>
      <p><strong>Pregunta real:</strong> "¿Por qué cayeron las ventas en marzo?"</p>
      <p>Esa pregunta, tal cual, no se puede consultar. Hay que descomponerla:</p>
      <ul>
        <li><strong>Métrica:</strong> revenue</li>
        <li><strong>Dimensión de tiempo:</strong> por día o por semana dentro de marzo (no un solo número del mes)</li>
        <li><strong>Comparación:</strong> contra febrero, o contra marzo del año anterior</li>
        <li><strong>Dimensiones adicionales:</strong> ¿cayó en todos los países por igual, o solo en uno? ¿en todos los canales, o solo en publicidad pagada?</li>
      </ul>
      <p>Cada una de esas piezas es una consulta que ya sabes escribir. La pregunta de negocio solo te dice <strong>en qué orden hacerlas</strong>.</p>
    `
  },
  {
    id: 10,
    title: "Caso empresarial completo",
    content: `
      <p><strong>Escenario:</strong> Trabajas en una empresa de suscripciones (SaaS). El equipo de liderazgo nota que el MRR (revenue recurrente mensual) está creciendo más lento que antes.</p>
      <p><strong>Tu proceso de diagnóstico, paso a paso:</strong></p>
      <ul>
        <li><strong>1. Revenue:</strong> confirmas que el MRR total, en efecto, desaceleró los últimos 3 meses.</li>
        <li><strong>2. Growth:</strong> comparas mes a mes con LAG() y ves que el % de crecimiento cayó de 8% a 2%.</li>
        <li><strong>3. Churn:</strong> revisas si el churn subió — y sí: pasó de 3% a 7% en el mismo período.</li>
        <li><strong>4. Cohorts:</strong> analizas los cohortes recientes y descubres que los clientes que se registraron hace 2 meses retienen peor que los de meses anteriores.</li>
      </ul>
      <p><strong>Conclusión:</strong> el problema no es "menos clientes nuevos" — es que los clientes nuevos se están yendo más rápido. Esa es una historia de negocio completa, construida encima de SQL, no al revés.</p>
      <p>Eso es Business Analytics SQL: las técnicas son las mismas de siempre, pero puestas al servicio de una pregunta real.</p>
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
            ¡Módulo 11 Completado!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            Ya piensas en KPIs, no solo en queries. Ahora demuéstralo en el quiz final.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:15px; color:var(--color-text);">revenue, growth, retention, churn, cohorts, funnels</code>
        </div>
      </div>
    `
  }
];
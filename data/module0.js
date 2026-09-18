// data/module0.js
export const module0Cards = [
  {
    id: 1,
    title: "¿Qué es SQL?",
    content: `
      <p><strong>SQL</strong> significa:</p>
      <ul>
        <li><strong>Structured Query Language</strong></li>
        <li><strong>Lenguaje de Consulta Estructurada</strong></li>
      </ul>
      <p>SQL es el lenguaje estándar utilizado para comunicarse con bases de datos.</p>
      <p>Así como usamos español o inglés para comunicarnos con otras personas, usamos SQL para comunicarnos con los datos.</p>
      <p>Cuando una empresa necesita responder preguntas como:</p>
      <ul>
        <li>¿Cuántos clientes compraron este mes?</li>
        <li>¿Cuál fue el producto más vendido?</li>
        <li>¿Qué ciudades generan más ingresos?</li>
        <li>¿Qué empleados tuvieron el mejor desempeño?</li>
      </ul>
      <p>normalmente utiliza SQL.</p>
    `
  },
  {
    id: 2,
    title: "¿Qué NO es SQL?",
    content: `
      <p>Existe mucha confusión cuando alguien comienza a estudiar datos.</p>
      <p><strong>SQL NO es:</strong></p>
      <ul>
        <li>Una base de datos</li>
        <li>Un sistema operativo</li>
        <li>Un dashboard como Power BI</li>
        <li>Una hoja de cálculo como Excel</li>
        <li>Un lenguaje de programación general como Python</li>
      </ul>
      <div class="analogy-box">
        <p><strong>Analogía:</strong></p>
        <p>📚 Biblioteca = Base de Datos</p>
        <p>🧑‍🏫 Bibliotecario = Motor de Base de Datos</p>
        <p>🗣️ Idioma = SQL</p>
        <p>La información vive en la biblioteca. SQL es el idioma que utilizamos para pedir información.</p>
      </div>
    `
  },
  {
    id: 3,
    title: "El origen de SQL",
    content: `
      <p>SQL nació en la década de 1970 en IBM.</p>
      <p>Fue creado para gestionar información en sistemas de bases de datos relacionales.</p>
      <div class="timeline">
        <div class="timeline-item">
          <span class="year">1970</span>
          <p>Edgar Codd propone el modelo relacional.</p>
        </div>
        <div class="timeline-item">
          <span class="year">1974</span>
          <p>IBM desarrolla SEQUEL (predecesor de SQL).</p>
        </div>
        <div class="timeline-item">
          <span class="year">1986</span>
          <p>SQL se convierte en estándar ANSI.</p>
        </div>
        <div class="timeline-item">
          <span class="year">Hoy</span>
          <p>SQL es el lenguaje más utilizado para datos.</p>
        </div>
      </div>
      <p><strong>Dato curioso:</strong> SQL tiene más de 50 años y sigue siendo el rey de los datos.</p>
    `
  },
  {
    id: 4,
    title: "¿Qué es un dato?",
    content: `
      <p>Un <strong>dato</strong> es una representación de algo real.</p>
      <ul>
        <li><strong>Ejemplo:</strong> "Ana", 22, "CDMX"</li>
        <li><strong>Significado:</strong> Una persona llamada Ana, de 22 años, que vive en CDMX.</li>
      </ul>
      <p>Los datos adquieren valor cuando los interpretamos.</p>
      <div class="analogy-box">
        <p><strong>Analogía:</strong></p>
        <p>📦 Dato = Una pieza de un rompecabezas</p>
        <p>🧩 Información = El rompecabezas completo</p>
        <p>💡 Conocimiento = Entender lo que representa el rompecabezas</p>
      </div>
    `
  },
  {
    id: 5,
    title: "Datos en el mundo real",
    content: `
      <p>Los datos describen el mundo real.</p>
      <p><strong>Ejemplos:</strong></p>
      <ul>
        <li>📊 Ventas de una tienda</li>
        <li>👥 Empleados de una empresa</li>
        <li>🏥 Pacientes de un hospital</li>
        <li>🎓 Estudiantes de una universidad</li>
        <li>📦 Productos en un inventario</li>
      </ul>
      <p>SQL nos permite <strong>organizar, consultar y analizar</strong> estos datos.</p>
    `
  },
  {
    id: 6,
    title: "¿Qué es una tabla?",
    content: `
      <p>Una <strong>tabla</strong> es una estructura que organiza los datos en filas y columnas.</p>
      <p><strong>Analogía:</strong> Una tabla es como una hoja de cálculo.</p>
      <div class="table-preview">
        <div class="table-row header">
          <span>id</span>
          <span>nombre</span>
          <span>edad</span>
        </div>
        <div class="table-row">
          <span>1</span>
          <span>Ana</span>
          <span>22</span>
        </div>
        <div class="table-row">
          <span>2</span>
          <span>Luis</span>
          <span>24</span>
        </div>
        <div class="table-row">
          <span>3</span>
          <span>Maria</span>
          <span>21</span>
        </div>
      </div>
      <p>Cada <strong>fila</strong> es un registro. Cada <strong>columna</strong> es un atributo.</p>
    `
  },
  {
    id: 7,
    title: "Entidades y atributos",
    content: `
      <p>En el mundo relacional, trabajamos con <strong>entidades</strong> y <strong>atributos</strong>.</p>
      <ul>
        <li><strong>Entidad:</strong> Un objeto del mundo real (ej: Estudiante)</li>
        <li><strong>Atributo:</strong> Una característica de la entidad (ej: nombre, edad)</li>
      </ul>
      <p><strong>Ejemplo:</strong></p>
      <ul>
        <li>Entidad: <strong>Estudiante</strong></li>
        <li>Atributos: id, nombre, edad, ciudad</li>
      </ul>
      <p>Las entidades se convierten en <strong>tablas</strong>. Los atributos se convierten en <strong>columnas</strong>.</p>
    `
  },
  {
    id: 8,
    title: "Relaciones entre tablas",
    content: `
      <p>Las bases de datos relacionales conectan información a través de <strong>relaciones</strong>.</p>
      <p><strong>Ejemplo:</strong></p>
      <ul>
        <li>📋 <strong>students</strong> — Estudiantes</li>
        <li>📋 <strong>courses</strong> — Cursos</li>
        <li>📋 <strong>enrollments</strong> — Inscripciones (conecta estudiantes y cursos)</li>
      </ul>
      <p>La tabla <strong>enrollments</strong> relaciona a un estudiante con un curso.</p>
      <div class="analogy-box">
        <p>📚 Una biblioteca tiene libros (cursos) y personas (estudiantes).<br>
        El préstamo (enrollment) conecta a la persona con el libro.</p>
      </div>
    `
  },
  {
    id: 9,
    title: "Primary Key y Foreign Key",
    content: `
      <p>Las <strong>Primary Keys</strong> y <strong>Foreign Keys</strong> son los pilares del modelo relacional.</p>
      <ul>
        <li><strong>Primary Key (PK):</strong> Identifica de forma única cada fila en una tabla.</li>
        <li><strong>Foreign Key (FK):</strong> Conecta una tabla con otra.</li>
      </ul>
      <div class="table-preview">
        <div class="table-row header">
          <span>students.id (PK)</span>
          <span>name</span>
          <span>city</span>
        </div>
        <div class="table-row">
          <span>1</span>
          <span>Ana</span>
          <span>CDMX</span>
        </div>
        <div class="table-row">
          <span>2</span>
          <span>Luis</span>
          <span>GDL</span>
        </div>
      </div>
      <p><strong>Ejemplo:</strong> enrollments.student_id es una Foreign Key que apunta a students.id.</p>
    `
  },
  {
    id: 10,
    title: "Cardinalidad",
    content: `
      <p><strong>Cardinalidad</strong> describe cómo se relacionan las tablas.</p>
      <ul>
        <li><strong>Uno a uno (1:1):</strong> Un registro se relaciona con uno solo.</li>
        <li><strong>Uno a muchos (1:N):</strong> Un registro se relaciona con muchos.</li>
        <li><strong>Muchos a muchos (N:M):</strong> Muchos registros se relacionan con muchos.</li>
      </ul>
      <p><strong>Ejemplo:</strong></p>
      <ul>
        <li>Un estudiante puede tomar muchos cursos → 1:N</li>
        <li>Un curso puede tener muchos estudiantes → 1:N</li>
        <li>Estudiantes y cursos → N:M (a través de enrollments)</li>
      </ul>
    `
  },
  {
    id: 11,
    title: "Integridad referencial",
    content: `
      <p><strong>Integridad referencial</strong> asegura que las relaciones entre tablas sean válidas.</p>
      <p><strong>Reglas:</strong></p>
      <ul>
        <li>Un Foreign Key siempre debe apuntar a una Primary Key existente.</li>
        <li>No se puede eliminar un registro que está siendo referenciado.</li>
        <li>No se puede insertar un registro que haga referencia a un registro inexistente.</li>
      </ul>
      <p>Esto garantiza que los datos sean <strong>consistentes y confiables</strong>.</p>
    `
  },
  {
    id: 12,
    title: "El ecosistema de datos",
    content: `
      <p>SQL es parte de un ecosistema más grande.</p>
      <p><strong>¿Dónde se usa SQL?</strong></p>
      <ul>
        <li>🏢 Empresas de todo tipo</li>
        <li>📊 Análisis de datos y BI</li>
        <li>🤖 Machine Learning (preparación de datos)</li>
        <li>📱 Aplicaciones web y móviles</li>
        <li>☁️ Plataformas cloud (AWS, GCP, Azure)</li>
      </ul>
      <p>Aprender SQL es una de las <strong>mejores inversiones</strong> para tu carrera.</p>
    `
  },
  {
    id: 13,
    title: "Motores de base de datos SQL",
    content: `
      <p>Existen muchos motores de base de datos SQL.</p>
      <p><strong>Los más populares:</strong></p>
      <ul>
        <li>🐘 <strong>PostgreSQL</strong> — Avanzado, extensible, open source</li>
        <li>🗄️ <strong>MySQL</strong> — Rápido, ampliamente usado</li>
        <li>🪟 <strong>SQL Server</strong> — Microsoft, empresarial</li>
        <li>🍃 <strong>SQLite</strong> — Ligero, embebido, sin servidor</li>
        <li>☁️ <strong>BigQuery</strong> — Google, para grandes volúmenes</li>
      </ul>
      <p><strong>Lo bueno:</strong> El SQL es <em>casi</em> el mismo en todos.</p>
    `
  },
  {
    id: 14,
    title: "SQL Challenge Lab™",
    content: `
      <p>En <strong>SQL Challenge Lab™</strong> aprenderás SQL de forma práctica.</p>
      <p><strong>Nuestro enfoque:</strong></p>
      <ul>
        <li>🧠 <strong>Pensar</strong> antes de escribir</li>
        <li>💡 <strong>Entender</strong> los conceptos</li>
        <li>✍️ <strong>Escribir</strong> consultas reales</li>
        <li>✅ <strong>Validar</strong> tus resultados</li>
      </ul>
      <p>No memorizarás sintaxis. <strong>Desarrollarás pensamiento SQL.</strong></p>
    `
  },
  {
    id: 15,
    title: "¿Listo para el siguiente nivel?",
    content: `
      <p>Has recorrido el camino desde:</p>
      <ul>
        <li>✅ ¿Qué es SQL?</li>
        <li>✅ Tablas, filas y columnas</li>
        <li>✅ Primary Key y Foreign Key</li>
        <li>✅ Relaciones y cardinalidad</li>
        <li>✅ El ecosistema de datos</li>
      </ul>
      <p>Ahora es momento de <strong>poner manos a la obra</strong>.</p>
      <p>En el Módulo 1 ejecutarás tu <strong>primera consulta SQL real</strong>.</p>
      <p style="margin-top:12px; padding:12px; background:rgba(124,92,255,0.06); border-radius:8px; border:1px solid rgba(124,92,255,0.15); text-align:center;">
        <code style="font-family:var(--font-mono); font-size:14px; color:var(--color-cyan);">SELECT * FROM students;</code>
      </p>
    `
  },
  {
    id: 16,
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
            ¡Módulo 0 Completado!
          </p>
          <p style="font-size:18px; color:var(--color-text-secondary); margin:0;">
            Estás listo para tu primer desafío.
          </p>
        </div>

        <div style="
          padding:14px 26px;
          background:rgba(124,92,255,0.06);
          border-radius:10px;
          border:1px solid rgba(124,92,255,0.18);
          display:inline-block;
        ">
          <code style="font-family:var(--font-mono); font-size:17px; color:var(--color-text);">SELECT * FROM students;</code>
        </div>

        <div style="display:flex; flex-direction:column; align-items:center; gap:12px; margin-top:6px;">
          <button class="learning-nav-btn primary" style="
            padding:16px 44px;
            font-size:18px;
            border-radius:999px;
            border:1px solid transparent;
            background: linear-gradient(135deg, #8f6bff, #5b6bff);
            color: #fff;
            font-family: var(--font-family);
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          " onclick="window.startModule1()">
            🚀 Comenzar SQL Warrior
          </button>

          <button class="learning-nav-btn" style="
            padding:8px 24px;
            font-size:14px;
            background:transparent;
            border:1px solid var(--color-border);
            color:var(--color-text-secondary);
            border-radius:999px;
            cursor:pointer;
            font-family: var(--font-family);
            transition: all 0.2s ease;
          " onclick="window.location.href='#roadmap'">
            ← Volver al Roadmap
          </button>
        </div>
      </div>
    `
  }
];
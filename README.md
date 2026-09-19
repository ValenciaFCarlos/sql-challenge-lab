# SQL Challenge Lab™

**Un MVP educativo 100% local para aprender SQL de verdad — sin backend, sin base de datos remota, sin login.**
Todo corre en el navegador: el motor SQL es [SQL.js](https://sql.js.org/) (SQLite compilado a WebAssembly), y el progreso se guarda con `localStorage`. No hay servidor, no hay costos de infraestructura, no hay cuentas de usuario — solo abres el proyecto y empiezas a escribir SQL real.

---

<img width="1536" height="1024" alt="yes2" src="https://github.com/user-attachments/assets/14511a09-7ab2-4a36-abf8-f7d38e139574" />


## 🎯 Qué es esto

SQL Challenge Lab™ es un curso interactivo de 18 módulos que lleva a alguien desde **"¿qué es SQL?"** hasta **diseñar, optimizar y comunicar soluciones de datos reales**, con dos modos de aprendizaje que se alternan a lo largo del roadmap:

- **🧠 Learning Mode** — módulos de teoría con cards interactivas, terminando en un quiz de aprobación obligatoria.
- **⚔️ Practice Mode** — retos de SQL real, ejecutados contra una base de datos SQLite genuina (no simulada) en el navegador, con sistema de hints progresivos y un "SQL Thinking Assistant" que guía el razonamiento antes de escribir código.

Al completar un módulo se otorga un badge, se desbloquea el siguiente, y el progreso persiste entre sesiones.

<img width="1536" height="1024" alt="LAB" src="https://github.com/user-attachments/assets/971c5de7-bc63-401e-a0dd-34bbb39beb8b" />

## ✨ Características

- **73 ejercicios SQL reales**, verificados contra SQLite genuino — no validaciones de texto ni resultados hardcodeados.
- **8 quizzes de opción múltiple** (60 preguntas totales) con umbral de aprobación configurable por módulo.
- **18 badges coleccionables**, con galería visual y notificación al momento de ganarlos.
- **Progreso persistente**: cerrar la pestaña y volver no reinicia nada.
- **Sistema de desbloqueo progresivo**: cada módulo se habilita al completar el anterior.
- **Cero configuración de backend**: es HTML + CSS + JavaScript (ES Modules) puro, más SQL.js vía CDN.

<img width="1536" height="1024" alt="img3" src="https://github.com/user-attachments/assets/6d237660-11d1-419b-9163-8df8529dc202" />

## 🗺️ Roadmap del curso

| # | Módulo | Tipo | Contenido | Badge |
|---|---|---|---|---|
| 0 | Introducción a SQL | Learning | 16 cards + quiz | 👶 SQL Baby |
| 1 | Mentalidad Relacional | Practice | 4 ejercicios | ⚔️ SQL Warrior |
| 2 | SELECT Fundamentals | Practice | 6 ejercicios | 🦸 SQL Hero |
| 3 | Filtering | Practice | 8 ejercicios | 🦸‍♂️ SQL Avenger |
| 4 | Ordering & Result Control | Practice | 5 ejercicios | ⚡ SQL Superhero |
| 5 | Aggregations | Practice | 8 ejercicios | 🔥 SQL Super Saiyan |
| 6 | GROUP BY & HAVING | Practice | 8 ejercicios | 🐉 SQL Dragon |
| 7 | JOINs | Practice | 10 ejercicios | 👑 SQL Princeps |
| 8 | Subqueries | Practice | 8 ejercicios | 🎩 Grand Duke |
| 9 | CTEs | Practice | 6 ejercicios | 👑 SQL King |
| 10 | Window Functions | Practice | 10 ejercicios | 🔥 Data Warlord |
| 11 | Business Analytics SQL | Learning | 11 cards + quiz | 👑 SQL Overlord |
| 12 | Data Modeling | Learning | 11 cards + quiz | 🏛️ SQL Senator |
| 13 | PostgreSQL Core | Learning | 11 cards + quiz | ⚔️ SQL Dictator |
| 14 | SQL Performance | Learning | 11 cards + quiz (10 preg.) | 👑 SQL Emperor |
| 15 | Analytics Engineering | Learning | 11 cards + quiz (10 preg.) | 💎 SQL Grandmaster |
| 16 | SQL Interview Mastery | Learning | 11 cards + quiz (10 preg.) | 👁️ SQL Illuminati |
| 17 | Community Challenge | Learning | Capstone + examen final integrador | ☠️ SQL GOD |

**Totales: 18 módulos · 73 ejercicios SQL · 8 quizzes · 60 preguntas · 18 badges.**

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| Motor SQL | [SQL.js](https://sql.js.org/) — SQLite compilado a WebAssembly |
| Frontend | HTML + CSS + JavaScript, ES Modules nativos (sin bundler) |
| Persistencia | `localStorage` del navegador |
| Backend | Ninguno — 100% cliente |

No hay paso de build. No hay dependencias de npm para correr la app (SQL.js se carga desde CDN). Al no usar bundler, hay que servir el proyecto con un servidor local — los navegadores bloquean `import` de ES Modules bajo el protocolo `file://`.

## 🚀 Cómo correrlo localmente

Cualquier servidor estático simple funciona. Por ejemplo:

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node (npx, sin instalar nada globalmente)
npx serve .

# Opción 3: extensión "Live Server" de VS Code
```

Luego abre `http://localhost:8000/app.html` en el navegador.

## 📁 Estructura del proyecto

```
sql-challenge-lab/
├── app.html                  # Entrada principal de la aplicación
├── landing.html               # Página de aterrizaje
├── README.md
│
├── css/
│   ├── variables.css          # Tokens de diseño (colores, spacing, tipografía)
│   ├── styles.css
│   ├── components.css         # Componentes UI + Badge Gallery
│   └── learning-mode.css      # Estilos de Learning Mode + Quiz Engine
│
├── js/
│   ├── app.js                  # Orquestador principal
│   ├── roadmap.js              # Fuente de verdad de los 18 módulos + persistencia
│   ├── learning-mode.js        # Motor de Learning Mode (cards + quiz por módulo)
│   ├── practice-mode.js        # Motor de Practice Mode
│   ├── challenge-engine.js     # Motor de retos SQL individuales
│   ├── quiz-engine.js          # Motor de quizzes de opción múltiple
│   ├── badge-engine.js         # Otorgamiento y persistencia de badges
│   ├── sql-engine.js           # Wrapper sobre SQL.js
│   └── sidebar.js
│
└── data/
    ├── module0.js               # Cards del Módulo 0
    ├── module0-quiz.js          # Quiz del Módulo 0
    ├── module1-dataset.js       # Dataset + retos del Módulo 1
    ├── ...                       # (uno por módulo, 1 al 10)
    ├── module11.js               # Cards del Módulo 11
    ├── module11-quiz.js          # Quiz del Módulo 11
    └── ...                       # (uno por módulo, 11 al 17)
```

## 🧩 Arquitectura — Core Engine

El proyecto sigue un patrón consistente de **"loader por módulo"** en sus tres motores principales, lo que permite agregar contenido nuevo sin tocar el motor:

```js
// Mismo patrón en practice-mode.js, quiz-engine.js y learning-mode.js
const MODULE_LOADERS = {
  1: () => import('../data/module1-dataset.js').then(...),
  2: () => import('../data/module2-dataset.js').then(...),
  // agregar un módulo nuevo = agregar una línea
};
```

- **Roadmap Engine** (`roadmap.js`): fuente de verdad de los 18 módulos, su estado (locked/available/completed) y su progreso — persistido en `localStorage`.
- **Badge Engine** (`badge-engine.js`): se sincroniza automáticamente cada vez que el roadmap guarda su estado — cualquier módulo que llegue a "completed" recibe su badge sin que haya que llamarlo manualmente desde cada lugar del código.
- **Quiz Engine** (`quiz-engine.js`): motor genérico de opción múltiple con umbral de aprobación configurable por módulo, reintentos ilimitados y persistencia de resultados.
- **Challenge Engine** (`challenge-engine.js`) + **SQL Engine** (`sql-engine.js`): ejecutan SQL real contra una base de datos SQLite genuina en memoria, con hints progresivos y validadores por reto.

## ✅ Cómo se verificó

Los 73 ejercicios de Practice Mode fueron probados ejecutando SQL real contra una instancia de SQLite (vía `sql.js`) en un entorno de pruebas con Node.js — no son aserciones de texto ni resultados hardcodeados. Esto incluyó, entre otras cosas:

- Validación de JOINs, subqueries, CTEs y window functions con datos reales.
- Una prueba de integración instanciando el `ChallengeEngine` real para confirmar que resolver retos efectivamente desbloquea el siguiente módulo.
- Simulación de la cadena completa de los 18 módulos, de principio a fin, confirmando el otorgamiento correcto de badges y el manejo del caso especial de fin de curso (Módulo 17, sin módulo siguiente).

## 📜 Licencia

MIT — libre de usar, modificar y compartir.

---

<p align="center">
  Hecho como proyecto educativo y pieza de portfolio.
</p>

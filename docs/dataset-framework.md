# Challenge Framework™

> **Nota de esta revisión:** este documento fue reescrito para reflejar el sistema **tal como está implementado hoy** en SQL Challenge Lab™, no la visión de diseño original. Algunas ideas del documento original (Knowledge Gap Engine™, un módulo "SQL + AI Engineer™") todavía no existen en el código — quedan documentadas al final, en "Ideas futuras", para no perderlas, pero separadas de la descripción del sistema real.

## Purpose

El Challenge Framework™ define la estructura y el comportamiento de los retos dentro de SQL Challenge Lab™, a lo largo de sus 18 módulos oficiales (10 de Practice Mode, 8 de Learning Mode).

## Los dos modos de aprendizaje

SQL Challenge Lab™ no usa tres tipos de reto — usa **dos modos**, cada uno con su propia estructura interna.

### Practice Mode

Usado en los Módulos 1 al 10 (Mentalidad Relacional, SELECT Fundamentals, Filtering, Ordering & Result Control, Aggregations, GROUP BY & HAVING, JOINs, Subqueries, CTEs, Window Functions).

**Propósito:** enseñar SQL resolviendo retos ejecutados contra una base de datos SQLite real (vía SQL.js/WASM), no simulada.

**Estructura real de cada reto** (definida en `data/module{N}-dataset.js`):

| Campo | Descripción | Ejemplo real |
|---|---|---|
| `id` | Número simple dentro del módulo (no un código tipo `M1-001`) | `id: 4` |
| `title` | Título corto del reto | "Filtrar por un atributo" |
| `description` | El enunciado del reto | "Encuentra a los estudiantes cuya ciudad sea CDMX." |
| `difficulty` | Escala de 1 a 4 (no 1 a 5) | `difficulty: 2` |
| `tables` | Qué tablas del dataset del módulo intervienen | `['students']` |
| `hints` | Arreglo de 2 a 3 pistas progresivas, la última siempre una query ejecutable completa | `['¿Qué atributo...?', 'WHERE decide qué filas...', "SELECT * FROM students WHERE city = 'CDMX';"]` |
| `validator` | Función que recibe el resultado real de SQLite y decide si el reto está resuelto | ver "Validation Philosophy" abajo |

No existe un campo de taxonomía tipo "Mental Model" (Projection, Ranking, Set Membership, etc.) por reto — es un principio de diseño que guio qué retos escribir, pero no un dato estructurado en el código.

### Learning Mode

Usado en los Módulos 0, 11 al 17 (Introducción a SQL, Business Analytics SQL, Data Modeling, PostgreSQL Core, SQL Performance, Analytics Engineering, SQL Interview Mastery, Community Challenge).

**Propósito:** enseñar teoría antes de evaluarla con un quiz de aprobación obligatoria.

**Estructura real** (definida en `data/module{N}.js` + `data/module{N}-quiz.js`):
- 10 cards de contenido + 1 card de celebración (11 en total por módulo).
- Un quiz final de opción múltiple (5 preguntas para los Módulos 0, 11-13; 10 preguntas para los Módulos 14-17), con un umbral de aprobación (≥3/5 o ≥6/10 según el módulo).
- El quiz se dispara automáticamente al llegar a la penúltima card — no hay un "Dataset Explorer" ni un "SQL Workspace" en este modo: es contenido de lectura + evaluación de opción múltiple, sin editor SQL.

## SQL Workspace (solo en Practice Mode)

Contiene, en cada reto:
- **SQL Editor** — donde se escribe la query.
- **Botón de ejecución**, que corre la query contra SQLite real.
- **Panel de resultados**.
- **Knowledge Panel** y **Thinking Assistant** — ver abajo.

### Knowledge Panel y Thinking Assistant — estado real

Ambos paneles existen visualmente en la interfaz, pero **hoy muestran contenido estático genérico**, igual en todos los retos:

- Knowledge Panel: un texto fijo invitando a leer el reto y comprender los conceptos.
- Thinking Assistant: cuatro pasos genéricos fijos ("1. Observa el concepto", "2. Relaciona con ejemplos", "3. Formula preguntas", "4. Continúa tu viaje").

No hay "Socratic questioning" dinámico ni guía específica por reto todavía — es una idea de diseño válida, pero no implementada. Si se construye en el futuro, este documento debe actualizarse para reflejarlo.

## Validation Philosophy — con las excepciones reales

**Regla general:** los retos se validan por **corrección del resultado**, no por coincidencia exacta de sintaxis. Múltiples soluciones válidas se aceptan siempre que produzcan el resultado correcto.

**Excepción documentada y deliberada:** dos módulos exigen, además del resultado correcto, el uso de una palabra clave específica en la query — porque el objetivo pedagógico de ese reto es practicar esa sintaxis exacta, no solo llegar al resultado por cualquier camino:

- **Módulo 9 (CTEs):** todos los retos exigen la palabra clave `WITH` en la query (`usesCTE(query)`), incluso si el mismo resultado ya se logró con una subquery en un módulo anterior.
- **Módulo 8, reto 8 (Subqueries):** exige literalmente `NOT EXISTS`, no solo el resultado correcto.

En ambos casos, si el resultado es correcto pero falta la sintaxis exigida, el reto muestra el mensaje "Resultado correcto, pero..." explicando qué falta — no se rechaza en silencio.

## Roadmap oficial (18 módulos reales)

| Módulo | Nombre | Modo |
|---|---|---|
| 0 | Introducción a SQL | Learning |
| 1 | Mentalidad Relacional | Practice |
| 2 | SELECT Fundamentals | Practice |
| 3 | Filtering | Practice |
| 4 | Ordering & Result Control | Practice |
| 5 | Aggregations | Practice |
| 6 | GROUP BY & HAVING | Practice |
| 7 | JOINs | Practice |
| 8 | Subqueries | Practice |
| 9 | CTEs | Practice |
| 10 | Window Functions | Practice |
| 11 | Business Analytics SQL | Learning |
| 12 | Data Modeling | Learning |
| 13 | PostgreSQL Core | Learning |
| 14 | SQL Performance | Learning |
| 15 | Analytics Engineering | Learning |
| 16 | SQL Interview Mastery | Learning |
| 17 | Community Challenge (capstone) | Learning |

No existe un módulo "SQL + AI Engineer™" en el roadmap implementado.

## Challenge Flow real (Practice Mode)

```
Módulo seleccionado
        ↓
Se carga el dataset del módulo en SQLite (SQL.js/WASM)
        ↓
Se renderiza el primer reto: enunciado + tablas disponibles + SQL Editor
        ↓
El estudiante escribe y ejecuta SQL real
        ↓
El validator del reto evalúa el resultado
        ↓
Si pasa: se notifica al Roadmap (desbloqueo + badge si corresponde) y avanza al siguiente reto
```

No hay pantallas separadas para "Business Context", "Dataset Explorer" y "Objective" — todo se muestra junto en una sola vista de reto.

---

## Ideas futuras (no implementadas — se documentan aquí para no perderlas)

Estas ideas aparecían en la versión original de este documento como si ya existieran. Son válidas como roadmap de mejora, pero requieren desarrollo real antes de volver a describirse como parte del sistema actual:

- **Knowledge Gap Engine™** — un sistema que identifique en qué conceptos específicos falla un estudiante repetidamente, y ajuste el contenido o los hints en consecuencia. Hoy no existe: los hints son fijos y progresivos, iguales para todos.
- **Knowledge Panel / Thinking Assistant dinámicos** — contenido específico por reto, con preguntas socráticas reales, en vez del texto genérico actual.
- **Un módulo "SQL + AI Engineer™"** — no está en el roadmap oficial de 18 módulos; sería una extensión futura del curso, no parte del alcance actual.
- **Sistema formal de "Mental Models" por reto** — hoy es un principio de diseño implícito, no un campo estructurado que se pueda consultar o filtrar.

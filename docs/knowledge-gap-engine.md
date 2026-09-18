# Knowledge Gap Engine™ — Future Vision (Not Implemented)

> **Estado de implementación: 0%. Este documento describe una idea de producto, no una funcionalidad existente en SQL Challenge Lab™.**
>
> Lo que existe hoy en su lugar: `quiz-engine.js`, un motor de opción múltiple con preguntas en orden fijo, un umbral de aprobación por módulo (≥3/5 o ≥6/10 según el módulo), reintentos ilimitados, y persistencia del mejor puntaje. No hay dificultad adaptativa, no hay detección de conceptos débiles, y no hay perfil de maestría por tema. Ver `docs/dataset-framework.md` para la descripción del sistema real de evaluación.
>
> Este documento se conserva porque el diseño conceptual tiene valor — es una dirección legítima de mejora del producto — pero se reescribió por completo en tiempo futuro/condicional para no describirlo como si ya funcionara.

## Purpose (visión)

Un futuro Knowledge Gap Engine™ no buscaría determinar si un estudiante aprueba o reprueba, sino identificar el concepto exacto donde se rompe su comprensión — y recomendar qué hacer al respecto.

La pregunta que un sistema así intentaría responder no sería *"¿aprobó?"*, sino *"¿dónde está atorado, y qué debería hacer después?"*

## Core Philosophy (visión)

Un quiz tradicional (como el que existe hoy) mide desempeño en un momento dado. Un Knowledge Gap Engine™ real mediría comprensión a lo largo del tiempo, ajustando la dificultad según las respuestas del estudiante.

## Cómo funcionaría (diseño conceptual, sin construir)

1. El sistema empezaría con preguntas de mayor complejidad sobre un concepto.
2. Si el estudiante responde correctamente, asumiría dominio de ese concepto.
3. Si responde incorrectamente, generaría preguntas de menor complejidad sobre el mismo concepto, hasta ubicar el nivel real de comprensión.

**Requeriría construir:** un banco de preguntas etiquetado por concepto y nivel de dificultad (hoy las preguntas no tienen esa taxonomía), y lógica de ramificación en `quiz-engine.js` que hoy no existe (hoy el motor recorre las preguntas en orden fijo, sin decisiones basadas en respuestas previas).

### Niveles de dificultad propuestos

| Nivel | Nombre | Ejemplo de pregunta |
|---|---|---|
| 1 | Recognition | ¿Qué hace GROUP BY? |
| 2 | Understanding | ¿Qué pasa con las filas después de agrupar? |
| 3 | Application | Cuenta las ventas por cliente. |
| 4 | Analysis | Encuentra clientes con ventas por encima del promedio. |
| 5 | Mastery | Construye un análisis de retención de clientes. |

Ninguna pregunta real del proyecto está etiquetada hoy con este esquema de niveles.

## Ejemplo ilustrativo (hipotético, no un caso real del sistema)

*(El ejemplo original de este documento presentaba un resultado como si fuera una salida real del sistema. Se reescribe aquí explícitamente como hipotético, para no sugerir que ocurrió.)*

Si este sistema existiera, un flujo posible sería: un estudiante responde 3 de 5 preguntas de nivel alto sobre GROUP BY correctamente, el sistema detecta una debilidad específica en el concepto de "cambio de granularidad" tras agrupar, y lo ubica en nivel 2 de 5 para ese concepto puntual — en vez de solo decir "reprobaste GROUP BY".

## Learning Recovery Plan™ (visión, no construido)

Tras detectar una brecha, el sistema propuesto generaría un plan de recuperación personalizado: lecciones específicas recomendadas, retos de práctica dirigidos al concepto débil, y un tiempo estimado de recuperación — con tres acciones posibles para el estudiante (retomar la lección, practicar ahora, o continuar bajo su propio riesgo).

**Requeriría construir:** un motor de recomendación que hoy no existe — el desbloqueo actual del roadmap es puramente lineal (completar el módulo N habilita el módulo N+1), sin ninguna rama personalizada según desempeño.

## SQL Dominance Profile™ (visión, no construido)

La idea final sería un perfil de maestría por concepto SQL (SELECT, WHERE, GROUP BY, JOINs, Subqueries...), actualizado con cada evaluación, mostrando un porcentaje de dominio por tema — no una calificación general, sino un mapa de fortalezas y debilidades real.

**Requeriría construir:** agregación de resultados por concepto (hoy los resultados se guardan por módulo completo, no desglosados por técnica SQL dentro de ese módulo) y una vista de dashboard nueva para mostrarlo.

## Mission (visión)

La misión detrás de esta idea — enseñar a pensar con datos, no a memorizar sintaxis, y diagnosticar brechas de comprensión en vez de solo calificar — sigue siendo válida como dirección de producto. Es, de hecho, coherente con la filosofía pedagógica que sí está implementada en el resto del curso (por ejemplo, la insistencia en "atributos" y "entidades" desde el Módulo 0, o el enfoque en criterio sobre memorización en el Módulo 16).

**Lo que falta para que deje de ser una visión:** un banco de preguntas taxonomizado por concepto y nivel, lógica de ramificación adaptativa en el motor de quiz, un modelo de datos que desglose resultados por concepto (no solo por módulo), y una interfaz de "plan de recuperación" — ninguno de estos cuatro componentes existe hoy en el repositorio.

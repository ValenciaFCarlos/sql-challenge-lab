# SQL Challenge Lab™ Philosophy

> **Nota de esta revisión:** se corrigieron cuatro secciones que describían comportamiento o contenido que no existe en la implementación actual (ver `docs/dataset-framework.md` para el detalle técnico de lo que sí existe). El resto del documento se conserva porque está respaldado por el contenido real de los 18 módulos.

## Why SQL Challenge Lab Exists

SQL Challenge Lab™ no fue creado para enseñar sintaxis de SQL.

Internet ya tiene miles de tutoriales, videos, cursos y documentación explicando comandos SQL. Aprender sintaxis no es la parte difícil.

Lo difícil es desarrollar la capacidad de pensar analíticamente, razonar con datos, y resolver problemas usando SQL. Ese es el problema que SQL Challenge Lab está diseñado para resolver.

## Our Mission

La misión no es enseñar sintaxis de SQL. La misión es enseñar a pensar con datos.

Al terminar la plataforma, un estudiante debería poder:
- Leer queries SQL complejas
- Explicar queries en lenguaje de negocio
- Resolver problemas analíticos
- Diseñar soluciones basadas en datos
- Pensar relacionalmente

## Theory Before Practice, Then Query First Within Each Challenge

El curso completo empieza con el **Módulo 0 (Introducción a SQL)**: 16 cards de teoría — qué es SQL, qué no es, su origen, entidad/atributo, Primary Key/Foreign Key — antes de que el estudiante escriba una sola query. Esta base conceptual es intencional: sin entender qué es una entidad o un atributo, la sintaxis de SELECT no tiene contexto.

**Dentro de cada reto de Practice Mode**, sin embargo, sí aplica un principio de "problema antes que solución": cada reto presenta un enunciado y pide una query, con pistas progresivas que solo revelan la solución completa al final — nunca se muestra la respuesta antes de que el estudiante intente resolverla.

En resumen: el curso como un todo es *Teoría → Práctica*; cada reto individual dentro de Practice Mode es *Problema → Intento → Pistas progresivas → Solución*.

## Thinking Before Typing

Escribir SQL es solo una pequeña parte de la habilidad. Los analistas profesionales pasan más tiempo pensando que escribiendo.

Antes de resolver un reto, un estudiante debería entender: qué problema se está resolviendo, qué información se necesita, qué nivel de detalle se requiere, y qué pregunta de negocio se está respondiendo.

SQL se trata como un lenguaje para resolver problemas, no como una colección de comandos.

## Mental Models Over Syntax

SQL Challenge Lab enseña, a través de la secuencia de sus módulos, patrones reutilizables en vez de sentencias aisladas:

| Patrón | Módulo donde se enseña |
|---|---|
| Projection | Módulo 2 (SELECT Fundamentals) |
| Filtering | Módulo 3 (Filtering) |
| Aggregation | Módulo 5 (Aggregations) |
| Granularity Changes | Módulo 6 (GROUP BY & HAVING) |
| Set Membership | Módulo 8 (Subqueries — IN/EXISTS) |
| Ranking | Módulo 10 (Window Functions) |
| Comparison Against Average | Módulo 8 (subquery escalar) |

*(Nota: esta tabla es un principio de diseño detrás de la secuencia de módulos — no es un campo estructurado que exista por reto en el código. Ver `docs/dataset-framework.md`.)*

El objetivo no es memorizar soluciones. El objetivo es reconocer patrones.

## Knowledge Panel™ y Thinking Assistant™ — intención de diseño

Ambos paneles existen en el SQL Workspace de Practice Mode con la intención de guiar el pensamiento sin dar la respuesta directamente, en vez de generar SQL por el estudiante.

**Estado real de implementación:** hoy ambos paneles muestran contenido fijo y genérico, igual en todos los retos — no hacen preguntas específicas por reto todavía. Preguntas como *"¿qué representa cada fila?"* o *"¿estás filtrando o resumiendo?"* son ejemplos de la dirección de diseño futura, no de comportamiento actual. Ver `docs/knowledge-gap-engine.md` para el desarrollo de esta idea como visión de producto.

## Evaluation Philosophy

El objetivo no es verificar si el estudiante escribió exactamente la query esperada — distintas soluciones SQL pueden producir el mismo resultado correcto.

La evaluación prioriza, en general: corrección del resultado, calidad de la lógica, comprensión conceptual.

**Excepción real y documentada:** dos módulos (9 — CTEs, y el reto 8 del Módulo 8 — Subqueries) exigen, además del resultado correcto, el uso de una sintaxis específica (`WITH`, `NOT EXISTS`), porque el objetivo pedagógico de esos retos puntuales es practicar esa sintaxis exacta. Ver `docs/dataset-framework.md`.

## Reading Queries — una habilidad valiosa, todavía no evaluada directamente

Entender SQL ya escrito (no solo escribirlo) es una habilidad real de un analista profesional, y es parte del razonamiento que se le pide a un estudiante al leer los enunciados de cada reto y decidir cómo abordarlos.

**Estado real:** los 73 ejercicios de Practice Mode son todos del tipo "escribe una query para lograr X" — ninguno presenta una query ya construida para que el estudiante la interprete o explique sin escribir código. Un módulo o sección dedicada a interpretación de queries ajenas sería una extensión válida, pero no existe todavía.

## Final Goal

Al completar SQL Challenge Lab™, un estudiante debería ser capaz de: pensar relacionalmente, resolver problemas de negocio con datos, leer y entender SQL complejo, y diseñar soluciones analíticas.

El objetivo final es simple: enseñar a pensar con datos.

---

*Sección "Human + AI Analytics" removida de esta versión: el curso, en su alcance actual de 18 módulos, no incluye contenido sobre validación de SQL generado por IA ni sobre colaboración humano-IA en analítica. Si se agrega ese contenido en el futuro (sería una extensión natural del Módulo 16, Interview Mastery, dado que muchas entrevistas hoy sí tocan este tema), esta sección debería reincorporarse con una referencia al módulo real que la enseñe.*

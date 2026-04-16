# PRD — SQL Workbench para Base de Datos de Streaming

**Version:** 1.0  
**Fecha:** Abril 2026  
**Estado:** Activo

---

## 1. Vision del Producto

Aplicacion web enfocada en ejecutar consultas SQL sobre una base de datos de streaming, con una experiencia clara para usuarios tecnicos y semitecnicos.

Objetivo principal:
- Permitir escribir y ejecutar queries SQL rapidamente.
- Mostrar resultados en una tabla dinamica facil de leer.
- Reducir errores de escritura con una referencia de esquema siempre visible.

---

## 2. Alcance Funcional

La aplicacion incluye exactamente dos pantallas:
- `Workbench`
- `Schema Explorer`

No incluye dashboards, modelos de ML ni pantallas adicionales en esta version.

---

## 3. Datos (Tablas Soportadas)

La solucion se centra en estas 5 tablas:
- `content`
- `genres`
- `profiles`
- `subscription_tiers`
- `watch_history`

Estas tablas deben estar disponibles para consulta desde el Workbench y listadas en el Schema Explorer.

---

## 4. Stack Tecnologico

- Frontend: `React` + `Vite`
- Data access: `Supabase JS client`
- Deploy: `Vercel`

Requisito tecnico:
- Todas las consultas a la base de datos se realizan mediante Supabase JS client.

---

## 5. Pantalla 1 — Workbench

**Proposito:** Ejecutar consultas SQL ad hoc y visualizar resultados inmediatamente.

### Componentes obligatorios
- Editor SQL multi-linea.
- Boton `Execute` para correr la consulta.
- Tabla de resultados dinamica (columnas segun el resultado recibido).
- Indicador de estado de ejecucion:
  - `Success` cuando la consulta se ejecuta correctamente.
  - `Error` cuando la consulta falla.

### Comportamiento esperado
- El usuario escribe SQL en el editor.
- Al hacer click en `Execute`, se lanza la ejecucion.
- Si hay datos, se renderiza la tabla dinamica.
- Si no hay datos pero la consulta es valida, mostrar estado `Success` con mensaje informativo.
- Si hay fallo, mostrar estado `Error` con mensaje legible para depuracion.

---

## 6. Pantalla 2 — Schema Explorer

**Proposito:** Servir como referencia rapida del esquema para facilitar la escritura de queries.

### Componentes obligatorios
- Vista con las 5 tablas:
  - `content`
  - `genres`
  - `profiles`
  - `subscription_tiers`
  - `watch_history`
- Para cada tabla, listar:
  - Nombre de columna
  - Tipo de dato

### Comportamiento esperado
- El usuario puede revisar rapidamente columnas y tipos sin salir del flujo de escritura SQL.
- La informacion debe presentarse de forma clara y escaneable.

---

## 7. Requisitos No Funcionales

- Interfaz simple y rapida para consultas frecuentes.
- Feedback claro de exito y error al ejecutar SQL.
- Estructura preparada para despliegue en `Vercel`.
- Integracion estable con `Supabase JS client`.

---

## 8. Criterios de Aceptacion

1. Existe un editor SQL multi-linea funcional en `Workbench`.
2. El boton `Execute` dispara la ejecucion de la consulta.
3. Se muestran indicadores `Success` y `Error` segun resultado.
4. La tabla de resultados se adapta dinamicamente a las columnas devueltas.
5. `Schema Explorer` muestra las 5 tablas requeridas.
6. En cada tabla del explorador se muestran columnas y tipos.
7. El proyecto corre con stack `React + Vite + Supabase JS client` y despliegue objetivo en `Vercel`.


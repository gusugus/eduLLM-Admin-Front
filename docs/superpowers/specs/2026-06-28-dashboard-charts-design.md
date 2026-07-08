# Dashboard Charts — Diseño Técnico
**Fecha:** 2026-06-28  
**Alcance:** Ciencias Naturales (única materia activa en el sistema)  
**Enfoque:** Endpoint nuevo en el backend + Recharts en el frontend

---

## 1. Contexto

El dashboard actual muestra 4 tarjetas de conteo (profesores, estudiantes, materias, grados) via `GET /api/admin/board-stats`. No expone ningún indicador de rendimiento académico.

La base de datos `edu_llm` (schema `comun`) ya contiene toda la data de quizzes en las tablas:
- `tbl_t_prueba` — quizzes creados por profesores (vinculados a `tbl_t_profesor_materia`)
- `tbl_t_partida` — sesiones de juego
- `tbl_t_partida_estudiante` — resultados por estudiante (`puntaje_total`, `respuestas_correctas`)
- `tbl_t_pregunta` — preguntas por quiz (para calcular el total posible)

El backend del admin ya tiene acceso directo a estas tablas via Prisma. No se requiere llamar a ningún microservicio externo.

---

## 2. Objetivo

Agregar 3 gráficas modernas debajo de las tarjetas existentes en el dashboard (`/` y `/dashboard`), mostrando indicadores de rendimiento de profesores y estudiantes en Ciencias Naturales.

---

## 3. Gráficas

### 3.1 Ranking de Profesores (barras horizontales)
- **Qué muestra:** Cada profesor asignado a Ciencias Naturales con su promedio de aciertos (%).
- **Métrica:** `AVG(respuestas_correctas / total_preguntas_del_quiz * 100)` sobre todas sus partidas finalizadas.
- **Orden:** Descendente por promedio.
- **Empty state:** Mensaje "Sin datos de partidas finalizadas" si no hay resultados.

### 3.2 Rendimiento por Grado (barras verticales)
- **Qué muestra:** Promedio de aciertos (%) por cada grado/paralelo que tiene Ciencias Naturales asignada.
- **Métrica:** Misma fórmula, agrupada por `grado.grado + grado.paralelo`.
- **Etiqueta eje X:** Formato `"5° A"`, `"6° B"`, etc.
- **Empty state:** Mensaje si no hay partidas finalizadas.

### 3.3 Distribución de Puntajes (donut)
- **Qué muestra:** Proporción global de estudiantes en 4 rangos de rendimiento.
- **Rangos:**
  - Excelente: ≥ 80% de aciertos
  - Bueno: 60–79%
  - Regular: 40–59%
  - Bajo: < 40%
- **Unidad:** Cantidad de participaciones (partida_estudiante), no estudiantes únicos.
- **Empty state:** Mensaje si no hay datos.

---

## 4. Backend — `eduLLM-Admin-Back`

### 4.1 Nuevo archivo: `src/repositories/dashboard.repository.js`

Tres métodos con `prisma.$queryRaw`:

| Método | Retorna |
|--------|---------|
| `getProfessorRanking()` | `[{ nombre, promedio, totalPartidas }]` |
| `getGradePerformance()` | `[{ grado, promedio, totalEstudiantes }]` |
| `getScoreDistribution()` | `[{ rango, cantidad }]` × 4 filas |

Todos filtran por:
- `materia.nombre_normalizado ILIKE '%ciencias%naturales%'`
- `partida.estado_partida = 'finalizada'`
- `estado = true` en todas las tablas involucradas

### 4.2 Extender `src/services/dashboard.service.js`

Agregar método `getCharts()` que llama los 3 métodos del repositorio en `Promise.all` y retorna el objeto combinado.

### 4.3 Extender `src/controllers/dashboard.controller.js`

Agregar handler `getCharts` que llama `dashboardService.getCharts()` y responde `{ success: true, data: {...} }`.

### 4.4 Extender `src/routes/v1/dashboard.routes.js`

```
GET /board-charts  →  dashboardController.getCharts
```

### 4.5 Forma de la respuesta

```json
{
  "success": true,
  "data": {
    "profesorRanking": [
      { "nombre": "Juan Pérez", "promedio": 78.5, "totalPartidas": 12 }
    ],
    "rendimientoGrado": [
      { "grado": "5° A", "promedio": 72.3, "totalEstudiantes": 25 }
    ],
    "distribucionPuntajes": [
      { "rango": "Excelente", "cantidad": 45 },
      { "rango": "Bueno",     "cantidad": 30 },
      { "rango": "Regular",   "cantidad": 28 },
      { "rango": "Bajo",      "cantidad": 15 }
    ]
  }
}
```

---

## 5. Frontend — `eduLLM-Admin-Front`

### 5.1 Dependencia nueva

```
recharts  (npm install recharts)
```

### 5.2 Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `src/hooks/useDashboardCharts.js` | `useQuery` → `GET /api/admin/board-charts`. Retorna `{ charts, isLoading }` |
| `src/pages/DashboardPage.jsx` | Renderiza `<DashboardCards />` + `<DashboardCharts />` en columna |
| `src/features/dashboard/DashboardCharts.jsx` | Grid responsivo 3 columnas (1 en móvil) con título de sección y skeletons de carga |
| `src/features/dashboard/ProfesorRankingChart.jsx` | `BarChart` horizontal de Recharts. Colores degradado azul |
| `src/features/dashboard/RendimientoGradoChart.jsx` | `BarChart` vertical de Recharts. Colores degradado verde |
| `src/features/dashboard/DistribucionPuntajesChart.jsx` | `PieChart` donut de Recharts. 4 colores: verde/azul/amarillo/rojo |

### 5.3 Archivo a modificar

`src/routes/AppRoutes.jsx`: Las rutas `/` y `/dashboard` pasan de `<DashboardCards />` a `<DashboardPage />`.

### 5.4 Layout

```
┌────────────────────────────────────────────────────────┐
│  [Profesores]  [Estudiantes]  [Materias]  [Grados]     │  ← sin cambios
└────────────────────────────────────────────────────────┘

  Rendimiento académico — Ciencias Naturales              ← título sección

┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│  Ranking de  │ │ Rendimiento  │ │   Distribución de    │
│  Profesores  │ │  por Grado   │ │      Puntajes        │
│              │ │              │ │                      │
└──────────────┘ └──────────────┘ └──────────────────────┘
```

En mobile (< sm): 1 columna, gráficas apiladas.

### 5.5 Estilo

- Tarjetas con `rounded-2xl`, `shadow-md`, fondo blanco, igual estilo que las tarjetas actuales.
- Skeletons de carga mientras `isLoading = true`.
- Tooltips habilitados en las 3 gráficas.
- Recharts `ResponsiveContainer` para que sean fluidas.

---

## 6. Restricciones

- No se modifica la forma del endpoint `/board-stats` existente.
- Las gráficas son de solo lectura (no tienen controles de filtro en esta versión).
- Si no hay datos (cero partidas finalizadas), se muestra un estado vacío por gráfica, no se rompe la página.
- El filtro por "Ciencias Naturales" usa `nombre_normalizado ILIKE '%ciencias%naturales%'` para ser tolerante a variaciones de nombre.

---

## 7. Archivos fuera de alcance

- No se tocan: `DashboardCards.jsx`, `useDashboardStats.js`, ni ningún otro feature existente.
- No se agrega autenticación adicional al nuevo endpoint (hereda el middleware existente del router).

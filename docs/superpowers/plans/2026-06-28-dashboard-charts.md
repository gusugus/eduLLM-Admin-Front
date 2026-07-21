# Dashboard Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar 3 gráficas de rendimiento (Recharts) debajo de las tarjetas del dashboard, alimentadas por un nuevo endpoint `GET /api/admin/board-charts` en el backend del admin.

**Architecture:** El backend del admin tiene acceso directo a las tablas de quiz en la misma BD (`edu_llm`, schema `comun`) vía Prisma. Se agrega un `dashboard.repository.js` con 3 queries SQL raw, se extienden el service/controller/route del dashboard, y en el frontend se crean componentes Recharts consumidos desde un hook de react-query. Las rutas `/` y `/dashboard` pasan a renderizar un nuevo `DashboardPage` que apila las tarjetas existentes + las nuevas gráficas.

**Tech Stack:** Node.js + Express + Prisma (`$queryRaw`), React 18 + Vite + Tailwind CSS + MUI + @tanstack/react-query + Recharts

## Global Constraints

- Backend root: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back`
- Frontend root: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front`
- DB: `postgresql://admin:admin@localhost:5432/edu_llm?schema=comun`
- Las tablas se referencian sin prefijo de schema en raw SQL (el `search_path` ya es `comun`)
- Filtro de materia: `nombre_normalizado ILIKE '%ciencias%naturales%'`
- Solo partidas con `estado_partida = 'finalizada'` cuentan en las métricas
- Recharts versión `^2.12.0` (la más reciente compatible con React 18)
- No modificar `DashboardCards.jsx`, `useDashboardStats.js`, ni ningún feature existente
- Columnas SQL reales (ver `@map` en schema): `profesor.usuario_id`, `profesor_materia.profesor_id`, `profesor_materia.materia_id`, `materia.grado_id`
- Convertir siempre resultados de `$queryRaw` a `Number()` para evitar problemas de BigInt

---

## File Map

### Backend — crear
| Archivo | Responsabilidad |
|---------|----------------|
| `src/repositories/dashboard.repository.js` | 3 queries SQL raw para las 3 gráficas |

### Backend — modificar
| Archivo | Qué se agrega |
|---------|--------------|
| `src/services/dashboard.service.js` | Método `getCharts()` |
| `src/controllers/dashboard.controller.js` | Handler `getCharts` |
| `src/routes/v1/dashboard.routes.js` | `GET /board-charts` |

### Frontend — instalar
| Paquete | Comando |
|---------|---------|
| recharts | `npm install recharts` (en el directorio frontend) |

### Frontend — crear
| Archivo | Responsabilidad |
|---------|----------------|
| `src/hooks/useDashboardCharts.js` | `useQuery` → `GET /api/admin/board-charts` |
| `src/features/dashboard/ProfesorRankingChart.jsx` | Barras horizontales de rendimiento por profesor |
| `src/features/dashboard/RendimientoGradoChart.jsx` | Barras verticales de rendimiento por grado |
| `src/features/dashboard/DistribucionPuntajesChart.jsx` | Donut de distribución de puntajes |
| `src/features/dashboard/DashboardCharts.jsx` | Contenedor grid 3 columnas |
| `src/pages/DashboardPage.jsx` | Agrupa DashboardCards + DashboardCharts |

### Frontend — modificar
| Archivo | Qué cambia |
|---------|-----------|
| `src/routes/AppRoutes.jsx` | Rutas `/` y `/dashboard` → `<DashboardPage />` |

---

## Task 1: Backend — Dashboard Repository (3 queries SQL)

**Files:**
- Create: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back\src\repositories\dashboard.repository.js`

**Interfaces:**
- Consumes: `prisma` de `../config/prisma`
- Produces:
  - `getProfessorRanking()` → `Promise<Array<{ nombre: string, promedio: number, totalPartidas: number }>>`
  - `getGradePerformance()` → `Promise<Array<{ grado: string, promedio: number, totalEstudiantes: number }>>`
  - `getScoreDistribution()` → `Promise<Array<{ rango: string, cantidad: number }>>`

---

- [ ] **Step 1: Crear el archivo del repositorio**

Crear `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back\src\repositories\dashboard.repository.js` con el siguiente contenido:

```javascript
const prisma = require('../config/prisma');

class DashboardRepository {
  async getProfessorRanking() {
    const rows = await prisma.$queryRaw`
      SELECT
        u.primer_nombre || ' ' || u.apellido_paterno AS nombre,
        ROUND(
          AVG(
            CASE WHEN q.total_preguntas > 0
                 THEN (pe.respuestas_correctas::float / q.total_preguntas) * 100
                 ELSE 0 END
          )::numeric, 1
        ) AS promedio,
        COUNT(DISTINCT pa.id_partida)::int AS "totalPartidas"
      FROM tbl_m_profesor prof
      JOIN tbl_m_usuario u ON u.id_usuario = prof.usuario_id
      JOIN tbl_t_profesor_materia pm
        ON pm.profesor_id = prof.id_profesor AND pm.estado = true
      JOIN tbl_m_materia m
        ON m.id_materia = pm.materia_id
        AND m.nombre_normalizado ILIKE '%ciencias%naturales%'
        AND m.estado = true
      JOIN tbl_t_prueba pr
        ON pr.profesor_materia_id = pm.id_profesor_materia AND pr.estado = true
      LEFT JOIN (
        SELECT prueba_id, COUNT(*)::int AS total_preguntas
        FROM tbl_t_pregunta
        WHERE estado = true
        GROUP BY prueba_id
      ) q ON q.prueba_id = pr.id_prueba
      JOIN tbl_t_partida pa
        ON pa.prueba_id = pr.id_prueba
        AND pa.estado_partida = 'finalizada'
        AND pa.estado = true
      JOIN tbl_t_partida_estudiante pe
        ON pe.partida_id = pa.id_partida AND pe.estado = true
      WHERE prof.estado = true
      GROUP BY prof.id_profesor, u.primer_nombre, u.apellido_paterno
      ORDER BY promedio DESC NULLS LAST
    `;
    return rows.map(r => ({
      nombre: r.nombre,
      promedio: Number(r.promedio),
      totalPartidas: Number(r.totalPartidas),
    }));
  }

  async getGradePerformance() {
    const rows = await prisma.$queryRaw`
      SELECT
        g.grado || '° ' || g.paralelo AS grado,
        ROUND(
          AVG(
            CASE WHEN q.total_preguntas > 0
                 THEN (pe.respuestas_correctas::float / q.total_preguntas) * 100
                 ELSE 0 END
          )::numeric, 1
        ) AS promedio,
        COUNT(DISTINCT pe.id_partida_estudiante)::int AS "totalEstudiantes"
      FROM tbl_m_grado g
      JOIN tbl_m_materia m
        ON m.grado_id = g.id_grado
        AND m.nombre_normalizado ILIKE '%ciencias%naturales%'
        AND m.estado = true
      JOIN tbl_t_profesor_materia pm
        ON pm.materia_id = m.id_materia AND pm.estado = true
      JOIN tbl_t_prueba pr
        ON pr.profesor_materia_id = pm.id_profesor_materia AND pr.estado = true
      LEFT JOIN (
        SELECT prueba_id, COUNT(*)::int AS total_preguntas
        FROM tbl_t_pregunta
        WHERE estado = true
        GROUP BY prueba_id
      ) q ON q.prueba_id = pr.id_prueba
      JOIN tbl_t_partida pa
        ON pa.prueba_id = pr.id_prueba
        AND pa.estado_partida = 'finalizada'
        AND pa.estado = true
      JOIN tbl_t_partida_estudiante pe
        ON pe.partida_id = pa.id_partida AND pe.estado = true
      WHERE g.estado = true
      GROUP BY g.id_grado, g.grado, g.paralelo
      ORDER BY g.grado ASC NULLS LAST, g.paralelo ASC NULLS LAST
    `;
    return rows.map(r => ({
      grado: r.grado,
      promedio: Number(r.promedio),
      totalEstudiantes: Number(r.totalEstudiantes),
    }));
  }

  async getScoreDistribution() {
    const rows = await prisma.$queryRaw`
      WITH participaciones AS (
        SELECT
          CASE WHEN q.total_preguntas > 0
               THEN (pe.respuestas_correctas::float / q.total_preguntas) * 100
               ELSE 0 END AS pct
        FROM tbl_t_partida_estudiante pe
        JOIN tbl_t_partida pa
          ON pa.id_partida = pe.partida_id
          AND pa.estado_partida = 'finalizada'
          AND pa.estado = true
        JOIN tbl_t_prueba pr
          ON pr.id_prueba = pa.prueba_id AND pr.estado = true
        JOIN tbl_t_profesor_materia pm
          ON pm.id_profesor_materia = pr.profesor_materia_id AND pm.estado = true
        JOIN tbl_m_materia m
          ON m.id_materia = pm.materia_id
          AND m.nombre_normalizado ILIKE '%ciencias%naturales%'
          AND m.estado = true
        LEFT JOIN (
          SELECT prueba_id, COUNT(*) AS total_preguntas
          FROM tbl_t_pregunta WHERE estado = true
          GROUP BY prueba_id
        ) q ON q.prueba_id = pr.id_prueba
        WHERE pe.estado = true
      )
      SELECT
        rango,
        COUNT(*)::int AS cantidad
      FROM (
        SELECT
          CASE
            WHEN pct >= 80 THEN 'Excelente'
            WHEN pct >= 60 THEN 'Bueno'
            WHEN pct >= 40 THEN 'Regular'
            ELSE 'Bajo'
          END AS rango
        FROM participaciones
      ) buckets
      GROUP BY rango
      ORDER BY
        CASE rango
          WHEN 'Excelente' THEN 1
          WHEN 'Bueno'     THEN 2
          WHEN 'Regular'   THEN 3
          ELSE 4
        END
    `;
    return rows.map(r => ({
      rango: r.rango,
      cantidad: Number(r.cantidad),
    }));
  }
}

module.exports = new DashboardRepository();
```

- [ ] **Step 2: Verificar que el backend levanta sin errores de require**

En el directorio `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back` ejecutar:

```powershell
node -e "require('./src/repositories/dashboard.repository')" 2>&1
```

Salida esperada: sin errores (silencio o solo mensajes de Prisma de inicialización).

- [ ] **Step 3: Commit**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back"
git add src/repositories/dashboard.repository.js
git commit -m "feat: add dashboard repository with 3 chart queries for Ciencias Naturales"
```

---

## Task 2: Backend — Service + Controller + Route

**Files:**
- Modify: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back\src\services\dashboard.service.js`
- Modify: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back\src\controllers\dashboard.controller.js`
- Modify: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back\src\routes\v1\dashboard.routes.js`

**Interfaces:**
- Consumes: `dashboardRepository.getProfessorRanking()`, `dashboardRepository.getGradePerformance()`, `dashboardRepository.getScoreDistribution()` de Task 1
- Produces: `GET /board-charts` → `{ success: true, data: { profesorRanking, rendimientoGrado, distribucionPuntajes } }`

---

- [ ] **Step 1: Extender el service**

Reemplazar el contenido de `src/services/dashboard.service.js` con:

```javascript
const prisma = require('../config/prisma');
const professorRepository = require('../repositories/professor.repository');
const studentRepository = require('../repositories/student.repository');
const subjectRepository = require('../repositories/subject.repository');
const dashboardRepository = require('../repositories/dashboard.repository');
const ESTADOS = require('../constants/estados');

class DashboardService {
  async getStats() {
    const [profesores, estudiantes, materias, grados] = await Promise.all([
      professorRepository.count([ESTADOS.ACTIVO]),
      studentRepository.count([ESTADOS.ACTIVO]),
      subjectRepository.count([ESTADOS.ACTIVO]),
      prisma.grado.count(),
    ]);
    return { profesores, estudiantes, materias, grados };
  }

  async getCharts() {
    const [profesorRanking, rendimientoGrado, distribucionPuntajes] = await Promise.all([
      dashboardRepository.getProfessorRanking(),
      dashboardRepository.getGradePerformance(),
      dashboardRepository.getScoreDistribution(),
    ]);
    return { profesorRanking, rendimientoGrado, distribucionPuntajes };
  }
}

module.exports = new DashboardService();
```

- [ ] **Step 2: Extender el controller**

Reemplazar el contenido de `src/controllers/dashboard.controller.js` con:

```javascript
const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');

exports.getStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getStats();
  res.json({ success: true, data: stats });
});

exports.getCharts = catchAsync(async (req, res) => {
  const charts = await dashboardService.getCharts();
  res.json({ success: true, data: charts });
});
```

- [ ] **Step 3: Agregar la ruta**

Reemplazar el contenido de `src/routes/v1/dashboard.routes.js` con:

```javascript
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard.controller');

router.get('/board-stats', dashboardController.getStats);
router.get('/board-charts', dashboardController.getCharts);

module.exports = router;
```

- [ ] **Step 4: Probar el endpoint**

Asegurarse de que el servidor esté corriendo (`npm run dev` en el directorio del backend). Luego ejecutar:

```powershell
curl http://localhost:8002/api/admin/board-charts
```

Salida esperada (con datos o sin datos):
```json
{
  "success": true,
  "data": {
    "profesorRanking": [],
    "rendimientoGrado": [],
    "distribucionPuntajes": []
  }
}
```

Si hay datos de partidas finalizadas, los arrays tendrán elementos. Si no los hay, los arrays vacíos son el comportamiento correcto (el frontend mostrará el empty state).

- [ ] **Step 5: Commit**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Back"
git add src/services/dashboard.service.js src/controllers/dashboard.controller.js src/routes/v1/dashboard.routes.js
git commit -m "feat: add GET /board-charts endpoint with 3 chart datasets"
```

---

## Task 3: Frontend — Instalar Recharts + Hook de datos

**Files:**
- Modify: `package.json` (vía npm install)
- Create: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front\src\hooks\useDashboardCharts.js`

**Interfaces:**
- Consumes: `VITE_GATEWAY_URL`, axios, `@tanstack/react-query`
- Produces: `useDashboardCharts()` → `{ charts: { profesorRanking, rendimientoGrado, distribucionPuntajes }, isLoading: boolean }`

---

- [ ] **Step 1: Instalar Recharts**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm install recharts
```

Salida esperada: `added N packages` sin errores.

- [ ] **Step 2: Crear el hook**

Crear `src/hooks/useDashboardCharts.js`:

```javascript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';

const fetchCharts = async () => {
  let token;
  try {
    const verifyRes = await axios.get(`${GATEWAY}/api/auth/verify`, {
      withCredentials: true,
    });
    token = verifyRes.data?.token;
  } catch {
    // proceed without token
  }

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return axios
    .get(`${GATEWAY}/api/admin/board-charts`, { headers, withCredentials: true })
    .then(res => res.data.data || {})
    .catch(() => ({}));
};

const EMPTY = { profesorRanking: [], rendimientoGrado: [], distribucionPuntajes: [] };

export const useDashboardCharts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: fetchCharts,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    charts: data || EMPTY,
    isLoading,
  };
};
```

- [ ] **Step 3: Verificar que el frontend compila**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm run build 2>&1 | Select-Object -Last 10
```

Salida esperada: `built in Xs` sin errores de TypeScript/módulos.

- [ ] **Step 4: Commit**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
git add src/hooks/useDashboardCharts.js package.json package-lock.json
git commit -m "feat: install recharts and add useDashboardCharts hook"
```

---

## Task 4: Frontend — ProfesorRankingChart (barras horizontales)

**Files:**
- Create: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front\src\features\dashboard\ProfesorRankingChart.jsx`

**Interfaces:**
- Consumes: `data: Array<{ nombre: string, promedio: number, totalPartidas: number }>`
- Produces: componente React `<ProfesorRankingChart data={[...]} />`

---

- [ ] **Step 1: Crear el componente**

Crear `src/features/dashboard/ProfesorRankingChart.jsx`:

```jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';

const BLUE_SHADES = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800">{d.nombre}</p>
      <p className="text-blue-600 font-bold">{d.promedio}% aciertos</p>
      <p className="text-gray-500">{d.totalPartidas} sesiones</p>
    </div>
  );
};

export default function ProfesorRankingChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin datos de partidas finalizadas
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 52)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 40, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={v => `${v}%`}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="nombre"
          width={110}
          tick={{ fontSize: 12, fill: '#374151' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
        <Bar dataKey="promedio" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {data.map((_, i) => (
            <Cell key={i} fill={BLUE_SHADES[i % BLUE_SHADES.length]} />
          ))}
          <LabelList
            dataKey="promedio"
            position="right"
            formatter={v => `${v}%`}
            style={{ fontSize: 11, fill: '#374151', fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm run build 2>&1 | Select-Object -Last 5
```

Salida esperada: sin errores.

- [ ] **Step 3: Commit**

```powershell
git add src/features/dashboard/ProfesorRankingChart.jsx
git commit -m "feat: add ProfesorRankingChart horizontal bar component"
```

---

## Task 5: Frontend — RendimientoGradoChart (barras verticales)

**Files:**
- Create: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front\src\features\dashboard\RendimientoGradoChart.jsx`

**Interfaces:**
- Consumes: `data: Array<{ grado: string, promedio: number, totalEstudiantes: number }>`
- Produces: componente React `<RendimientoGradoChart data={[...]} />`

---

- [ ] **Step 1: Crear el componente**

Crear `src/features/dashboard/RendimientoGradoChart.jsx`:

```jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

const getColor = (promedio) => {
  if (promedio >= 80) return '#10b981';
  if (promedio >= 60) return '#3b82f6';
  if (promedio >= 40) return '#f59e0b';
  return '#ef4444';
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800">{d.grado}</p>
      <p style={{ color: getColor(d.promedio) }} className="font-bold">
        {d.promedio}% aciertos
      </p>
      <p className="text-gray-500">{d.totalEstudiantes} participantes</p>
    </div>
  );
};

export default function RendimientoGradoChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin datos de partidas finalizadas
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="grado"
          tick={{ fontSize: 12, fill: '#374151' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={v => `${v}%`}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
        <ReferenceLine y={60} stroke="#d1d5db" strokeDasharray="4 4" label={{ value: 'Meta 60%', position: 'insideTopRight', fontSize: 10, fill: '#9ca3af' }} />
        <Bar dataKey="promedio" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getColor(entry.promedio)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm run build 2>&1 | Select-Object -Last 5
```

Salida esperada: sin errores.

- [ ] **Step 3: Commit**

```powershell
git add src/features/dashboard/RendimientoGradoChart.jsx
git commit -m "feat: add RendimientoGradoChart vertical bar component"
```

---

## Task 6: Frontend — DistribucionPuntajesChart (donut)

**Files:**
- Create: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front\src\features\dashboard\DistribucionPuntajesChart.jsx`

**Interfaces:**
- Consumes: `data: Array<{ rango: string, cantidad: number }>`
- Produces: componente React `<DistribucionPuntajesChart data={[...]} />`

---

- [ ] **Step 1: Crear el componente**

Crear `src/features/dashboard/DistribucionPuntajesChart.jsx`:

```jsx
import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = {
  Excelente: '#10b981',
  Bueno:     '#3b82f6',
  Regular:   '#f59e0b',
  Bajo:      '#ef4444',
};

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold" style={{ color: COLORS[d.rango] }}>{d.rango}</p>
      <p className="text-gray-700">{d.cantidad} participaciones</p>
    </div>
  );
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, i) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export default function DistribucionPuntajesChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin datos de partidas finalizadas
      </div>
    );
  }

  const total = data.reduce((acc, d) => acc + d.cantidad, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="cantidad"
            nameKey="rango"
            labelLine={false}
            label={renderCustomLabel}
            strokeWidth={2}
            stroke="#fff"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.rango] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ paddingBottom: 36 }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">{total}</p>
          <p className="text-xs text-gray-400">participaciones</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm run build 2>&1 | Select-Object -Last 5
```

Salida esperada: sin errores.

- [ ] **Step 3: Commit**

```powershell
git add src/features/dashboard/DistribucionPuntajesChart.jsx
git commit -m "feat: add DistribucionPuntajesChart donut component"
```

---

## Task 7: Frontend — DashboardCharts (contenedor)

**Files:**
- Create: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front\src\features\dashboard\DashboardCharts.jsx`

**Interfaces:**
- Consumes: `useDashboardCharts()` de Task 3; `ProfesorRankingChart`, `RendimientoGradoChart`, `DistribucionPuntajesChart` de Tasks 4-6
- Produces: componente `<DashboardCharts />` listo para renderizar en el dashboard

---

- [ ] **Step 1: Crear el componente contenedor**

Crear `src/features/dashboard/DashboardCharts.jsx`:

```jsx
import React from 'react';
import { useDashboardCharts } from '../../hooks/useDashboardCharts';
import ProfesorRankingChart from './ProfesorRankingChart';
import RendimientoGradoChart from './RendimientoGradoChart';
import DistribucionPuntajesChart from './DistribucionPuntajesChart';

const CHART_CARDS = [
  {
    title: 'Ranking de Profesores',
    subtitle: 'Promedio de aciertos por docente',
    key: 'profesorRanking',
    Component: ProfesorRankingChart,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Rendimiento por Grado',
    subtitle: 'Promedio de aciertos por grado/paralelo',
    key: 'rendimientoGrado',
    Component: RendimientoGradoChart,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Distribución de Puntajes',
    subtitle: 'Nivel de desempeño de los estudiantes',
    key: 'distribucionPuntajes',
    Component: DistribucionPuntajesChart,
    gradient: 'from-violet-500 to-purple-600',
  },
];

const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
    <div className="h-48 bg-gray-100 rounded-xl" />
  </div>
);

export default function DashboardCharts() {
  const { charts, isLoading } = useDashboardCharts();

  return (
    <div className="mt-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-800">Rendimiento académico</h2>
        <p className="text-sm text-gray-500 mt-0.5">Ciencias Naturales · partidas finalizadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {CHART_CARDS.map(({ title, subtitle, key, Component, gradient }) => (
          <div
            key={key}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${gradient} flex-shrink-0`} />
              <div>
                <p className="text-sm font-bold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
              </div>
            </div>

            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <Component data={charts[key] || []} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar compilación**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm run build 2>&1 | Select-Object -Last 5
```

Salida esperada: sin errores.

- [ ] **Step 3: Commit**

```powershell
git add src/features/dashboard/DashboardCharts.jsx
git commit -m "feat: add DashboardCharts container with skeleton loading"
```

---

## Task 8: Frontend — DashboardPage + Wire Routes

**Files:**
- Create: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front\src\pages\DashboardPage.jsx`
- Modify: `C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front\src\routes\AppRoutes.jsx`

**Interfaces:**
- Consumes: `<DashboardCards />` de `../../components/layout/DashboardCards`, `<DashboardCharts />` de Task 7
- Produces: rutas `/` y `/dashboard` renderizan ambas secciones apiladas

---

- [ ] **Step 1: Crear DashboardPage**

Crear `src/pages/DashboardPage.jsx`:

```jsx
import React from 'react';
import DashboardCards from '../components/layout/DashboardCards';
import DashboardCharts from '../features/dashboard/DashboardCharts';

export default function DashboardPage() {
  return (
    <div>
      <DashboardCards />
      <DashboardCharts />
    </div>
  );
}
```

- [ ] **Step 2: Actualizar AppRoutes.jsx**

Reemplazar el contenido de `src/routes/AppRoutes.jsx` con:

```jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import ProfessorList from '../features/professors/ProfessorList';
import ProfessorForm from '../features/professors/ProfessorForm';
import StudentList from '../features/students/StudentList';
import StudentForm from '../features/students/StudentForm';
import SubjectList from '../features/subjects/SubjectList';
import SubjectForm from '../features/subjects/SubjectForm';
import AssignmentsPage from '../features/assignments/AssignmentsPage';
import GradoList from '../features/grados/GradoList';
import TutorPage from '../features/tutor/TutorPage';
import QuizzPage from '../features/quizz/QuizzPage';
import GradoForm from '../features/grados/GradoForm';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/professors" element={<ProfessorList />} />
      <Route path="/professors/new" element={<ProfessorForm />} />
      <Route path="/professors/:id" element={<ProfessorForm />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/students/new" element={<StudentForm />} />
      <Route path="/students/:id" element={<StudentForm />} />
      <Route path="/subjects" element={<SubjectList />} />
      <Route path="/subjects/new" element={<SubjectForm />} />
      <Route path="/subjects/:id" element={<SubjectForm />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/grados" element={<GradoList />} />
      <Route path="/grados/new" element={<GradoForm />} />
      <Route path="/grados/:id" element={<GradoForm />} />
      <Route path="/tutor" element={<TutorPage />} />
      <Route path="/quizz" element={<QuizzPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
```

- [ ] **Step 3: Build final de verificación**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm run build 2>&1
```

Salida esperada: `✓ built in Xs` sin ningún error. Si hay warnings de Recharts sobre `defaultProps`, son ignorables (son del propio Recharts interno).

- [ ] **Step 4: Verificar en el navegador**

Iniciar el servidor de desarrollo:

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
npm run dev
```

Abrir `http://localhost:5173` y verificar:
1. Las 4 tarjetas de conteo siguen apareciendo igual que antes.
2. Debajo aparece el título "Rendimiento académico — Ciencias Naturales · partidas finalizadas".
3. Las 3 gráficas renderizan (con datos reales o con el mensaje de empty state si no hay partidas finalizadas).
4. En pantallas pequeñas (< 768px), las gráficas se apilan en 1 columna.
5. Al hacer hover en las barras/segmentos del donut, aparecen los tooltips.

- [ ] **Step 5: Commit final**

```powershell
cd "C:\Users\User\Desktop\EduQuiz\eduLLM-Admin-Front\eduLLM-Admin-Front"
git add src/pages/DashboardPage.jsx src/routes/AppRoutes.jsx
git commit -m "feat: wire DashboardPage with charts into dashboard routes"
```

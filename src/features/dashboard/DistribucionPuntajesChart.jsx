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
    <text
      x={x} y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 12, fontWeight: 700 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, porEstudiante }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const label = porEstudiante ? 'participaciones' : 'estudiantes';
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold" style={{ color: COLORS[d.rango] }}>{d.rango}</p>
      <p className="text-gray-700">{d.cantidad} {label}</p>
    </div>
  );
};

const renderLegend = ({ payload }) => (
  <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
    {payload.map((entry, i) => (
      <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: entry.color }}
        />
        {entry.value}
      </li>
    ))}
  </ul>
);

export default function DistribucionPuntajesChart({ data, porEstudiante = false }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Sin datos de partidas finalizadas
      </div>
    );
  }

  const total = data.reduce((acc, d) => acc + d.cantidad, 0);
  const centerLabel = porEstudiante ? 'participaciones' : 'estudiantes';

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
          <Tooltip content={<CustomTooltip porEstudiante={porEstudiante} />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ paddingBottom: 36 }}
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">{total}</p>
          <p className="text-xs text-gray-400">{centerLabel}</p>
        </div>
      </div>
    </div>
  );
}

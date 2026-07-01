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
        <ReferenceLine
          y={60}
          stroke="#d1d5db"
          strokeDasharray="4 4"
          label={{ value: 'Meta 60%', position: 'insideTopRight', fontSize: 10, fill: '#9ca3af' }}
        />
        <Bar dataKey="promedio" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getColor(entry.promedio)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

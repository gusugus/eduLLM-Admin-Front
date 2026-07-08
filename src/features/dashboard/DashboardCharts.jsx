import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDashboardCharts } from '../../hooks/useDashboardCharts';
import studentService from '../../services/studentService';
import ProfesorRankingChart from './ProfesorRankingChart';
import RendimientoGradoChart from './RendimientoGradoChart';
import DistribucionPuntajesChart from './DistribucionPuntajesChart';

const PERIODOS = [
  { value: '', label: 'Todo' },
  { value: 'semana', label: 'Esta semana' },
  { value: 'mes', label: 'Este mes' },
];

const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
    <div className="h-48 bg-gray-100 rounded-xl" />
  </div>
);

export default function DashboardCharts() {
  const [periodo, setPeriodo] = useState('');
  const [estudianteId, setEstudianteId] = useState('');

  const { charts, isLoading } = useDashboardCharts({
    periodo: periodo || undefined,
    estudianteId: estudianteId || undefined,
  });

  const { data: estudiantes = [] } = useQuery({
    queryKey: ['students-all'],
    queryFn: () => studentService.getActive(),
    staleTime: 5 * 60 * 1000,
  });

  const estudianteSeleccionado = estudiantes.find(e => String(e.id) === String(estudianteId));

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
      subtitle: estudianteSeleccionado
        ? `Participaciones de ${estudianteSeleccionado.nombreCompleto}`
        : 'Nivel de desempeño de los estudiantes',
      key: 'distribucionPuntajes',
      Component: DistribucionPuntajesChart,
      gradient: 'from-violet-500 to-purple-600',
      extraProps: {
        porEstudiante: !!estudianteId,
      },
    },
  ];

  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Rendimiento académico</h2>
          <p className="text-sm text-gray-500 mt-0.5">Partidas finalizadas</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro de período — aplica a las 3 gráficas */}
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            {PERIODOS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriodo(value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  periodo === value
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filtro de estudiante — solo afecta la dona */}
          <div className="flex flex-col items-start gap-0.5">
            <select
              value={estudianteId}
              onChange={e => setEstudianteId(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 min-w-[180px]"
            >
              <option value="">Todos los estudiantes</option>
              {estudiantes.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nombreCompleto}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-gray-400 pl-1">Solo afecta la dona</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {CHART_CARDS.map(({ title, subtitle, key, Component, gradient, extraProps = {} }) => (
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
              <Component data={charts[key] || []} {...extraProps} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

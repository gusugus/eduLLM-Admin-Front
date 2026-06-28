import React from 'react';
import { useProfessors } from '../../features/professors/hooks/useProfessors';
import { useStudents } from '../../features/students/hooks/useStudents';
import { useSubjects } from '../../features/subjects/hooks/useSubjects';
import { useGrados } from '../../features/grados/hooks/useGrados';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useDashboardStats } from '../../hooks/useDashboardStats';

const cards = [
  {
    key: 'profesores',
    title: 'Profesores',
    gradient: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-400/30',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    path: '/professors',
  },
  {
    key: 'estudiantes',
    title: 'Estudiantes',
    gradient: 'from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-400/30',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    path: '/students',
  },
  {
    key: 'materias',
    title: 'Materias',
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-400/30',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    path: '/subjects',
  },
  {
    key: 'grados',
    title: 'Grados',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-400/30',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    path: '/grados',
  },
];

const DashboardCards = () => {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-3 text-white shadow-md
                      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xl font-bold mb-1">{card.title}</p>
              <p className="text-4xl font-bold tracking-tight mt-3 mb-3">
                {isLoading ? '...' : (stats[card.key] ?? 0)}
              </p>
            </div>
            <div className={`${card.iconBg} rounded-xl p-3.5`}>
              {card.icon}
            </div>
          </div>
          <p className="text-white text-lg mt-0.5 font-bold">Total registrados</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;

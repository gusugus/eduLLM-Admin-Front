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

import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useProfessors } from '../../features/professors/hooks/useProfessors';
import { useStudents } from '../../features/students/hooks/useStudents';
import { useSubjects } from '../../features/subjects/hooks/useSubjects';
import { useGrados } from '../../features/grados/hooks/useGrados';

const DashboardCards = () => {
  const { data: professors = [] } = useProfessors();
  const { data: students = [] } = useStudents();
  const { data: subjects = [] } = useSubjects();
  const { data: grados = [] } = useGrados();

  const cards = [
    { title: 'Profesores', count: professors.length, color: '#1976d2' },
    { title: 'Estudiantes', count: students.length, color: '#2e7d32' },
    { title: 'Materias', count: subjects.length, color: '#ed6c02' },
    { title: 'Grados', count: grados.length, color: '#9c27b0' },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.title}>
          <Card sx={{ backgroundColor: card.color, color: 'white' }}>
            <CardContent>
              <Typography variant="h5">{card.count}</Typography>
              <Typography variant="subtitle1">{card.title}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box, Paper } from '@mui/material';
import AssignProfessorSubject from './AssignProfessorSubject';
import AssignStudentSubject from './AssignStudentSubject';

const TabPanel = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const AssignmentsPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Asignaciones</Typography>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Profesor → Materia" />
          <Tab label="Estudiante → Materia" />
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={0}><AssignProfessorSubject /></TabPanel>
      <TabPanel value={tab} index={1}><AssignStudentSubject /></TabPanel>
    </Container>
  );
};

export default AssignmentsPage;

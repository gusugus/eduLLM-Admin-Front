import React, { useState } from 'react';
import {
  Box, Grid, Typography, Button, MenuItem, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Checkbox, IconButton, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStudents } from '../../features/students/hooks/useStudents';
import { useSubjects } from '../../features/subjects/hooks/useSubjects';
import { useAssignments } from './hooks/useAssignments';

const AssignStudentSubject = () => {
  const { data: studsData } = useStudents();
  const { data: subsData } = useSubjects();
  const { studentAssignments, isLoadingStud, assignStudents, removeStudentAssignment } = useAssignments();

  const students = studsData?.data || studsData || [];
  const subjects = subsData?.data || subsData || [];

  const [id_materia, setIdMateria] = useState('');
  const [selected, setSelected] = useState([]);

  const toggleStudent = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAssign = async () => {
    if (!id_materia || selected.length === 0) return;
    try {
      await assignStudents.mutateAsync({ id_estudiantes: selected, id_materia });
      setSelected([]);
    } catch (e) {
      // error handled by snackbar
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Asignar Estudiantes a Materia</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField select fullWidth label="Materia" value={id_materia}
            onChange={e => setIdMateria(e.target.value)}>
            {subjects.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={`${selected.length} seleccionados`} color="primary" variant="outlined" />
          <Button variant="contained" onClick={handleAssign}
            disabled={!id_materia || selected.length === 0 || assignStudents.isPending}>
            Asignar {selected.length > 0 ? `(${selected.length})` : ''}
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ maxHeight: 260, overflow: 'auto', mb: 3 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Código</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(s => (
              <TableRow key={s.id} hover selected={selected.includes(s.id)}
                onClick={() => toggleStudent(s.id)} sx={{ cursor: 'pointer' }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(s.id)} />
                </TableCell>
                <TableCell>{s.nombreCompleto}</TableCell>
                <TableCell>{s.cedula}</TableCell>
                <TableCell>{s.codigo_estudiante || '-'}</TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">Sin estudiantes</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>Asignaciones actuales</Typography>
      {isLoadingStud ? <Typography>Cargando...</Typography> : (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                <TableCell>Materia</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentAssignments?.filter(a => a.estado === 'Activo').map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.estudiante}</TableCell>
                  <TableCell>{a.materia}</TableCell>
                  <TableCell>{a.estado}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => removeStudentAssignment.mutateAsync(a.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {(!studentAssignments || studentAssignments.filter(a => a.estado === 'Activo').length === 0) && (
                <TableRow><TableCell colSpan={4} align="center">Sin asignaciones</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AssignStudentSubject;

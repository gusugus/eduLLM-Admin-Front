import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box, Grid, Typography, Button, MenuItem, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useProfessors } from '../../features/professors/hooks/useProfessors';
import { useSubjects } from '../../features/subjects/hooks/useSubjects';
import { useAssignments } from './hooks/useAssignments';

const AssignProfessorSubject = () => {
  const { data: profsData } = useProfessors();
  const { data: subsData } = useSubjects();
  const { professorAssignments, isLoadingProf, assignProfessor, removeProfessorAssignment } = useAssignments();

  const professors = profsData?.data || profsData || [];
  const subjects = subsData?.data || subsData || [];

  const { enqueueSnackbar } = useSnackbar();
  const [id_profesor, setIdProfesor] = useState('');
  const [id_materia, setIdMateria] = useState('');

  const handleAssign = async () => {
    if (!id_profesor || !id_materia) return;
    try {
      await assignProfessor.mutateAsync({ id_profesor, id_materia });
      setIdProfesor('');
      setIdMateria('');
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Error al asignar';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Asignar Profesor a Materia</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={5}>
          <TextField select fullWidth label="Profesor" value={id_profesor}
            onChange={e => setIdProfesor(e.target.value)}>
            {professors.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.nombreCompleto} — {p.cedula}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField select fullWidth label="Materia" value={id_materia}
            onChange={e => setIdMateria(e.target.value)}>
            {subjects.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.nombre} ({s.grado?.nombre_completo || 'Sin curso'})</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" fullWidth onClick={handleAssign}
            disabled={!id_profesor || !id_materia || assignProfessor.isPending}>
            Asignar
          </Button>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" gutterBottom>Asignaciones actuales</Typography>
      {isLoadingProf ? <Typography>Cargando...</Typography> : (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Profesor</TableCell>
                <TableCell>Materia</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {professorAssignments?.filter(a => a.estado === 'Activo').map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.profesor}</TableCell>
                  <TableCell>{a.materia}</TableCell>
                  <TableCell>{a.estado}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => removeProfessorAssignment.mutateAsync(a.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {(!professorAssignments || professorAssignments.filter(a => a.estado === 'Activo').length === 0) && (
                <TableRow><TableCell colSpan={4} align="center">Sin asignaciones</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AssignProfessorSubject;

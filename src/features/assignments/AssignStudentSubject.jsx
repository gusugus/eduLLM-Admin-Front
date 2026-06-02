import React, { useState, useMemo } from 'react';
import {
  Box, Grid, Typography, Button, MenuItem, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Checkbox, IconButton, Chip, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
  const [search, setSearch] = useState('');

  const handleMateriaChange = (e) => {
    setIdMateria(e.target.value);
    setSelected([]);
    setSearch('');
  };

  const assignedStudentIds = new Set(
    (studentAssignments || [])
      .filter(a => a.estado === 'Activo' && a.id_materia === parseInt(id_materia))
      .map(a => a.id_estudiante)
  );
  const availableStudents = students.filter(s => !assignedStudentIds.has(s.id));

  const filteredStudents = useMemo(() => {
    if (!search) return availableStudents;
    const q = search.toLowerCase();
    return availableStudents.filter(s =>
      s.nombreCompleto?.toLowerCase().includes(q) ||
      s.cedula?.toLowerCase().includes(q)
    );
  }, [availableStudents, search]);

  const toggleStudent = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filteredStudents.length) {
      setSelected([]);
    } else {
      setSelected(filteredStudents.map(s => s.id));
    }
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
            onChange={handleMateriaChange}>
            {subjects.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.nombre} ({s.grado?.nombre_completo || 'Sin curso'})</MenuItem>
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

      <TextField
        fullWidth size="small" placeholder="Buscar estudiante..."
        value={search} onChange={e => setSearch(e.target.value)}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
        }}
      />
      <Paper sx={{ maxHeight: 260, overflow: 'auto', mb: 3 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredStudents.length > 0 && selected.length === filteredStudents.length}
                  indeterminate={selected.length > 0 && selected.length < filteredStudents.length}
                  onClick={toggleAll}
                />
              </TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell>Cédula</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(s => (
              <TableRow key={s.id} hover selected={selected.includes(s.id)}
                onClick={() => toggleStudent(s.id)} sx={{ cursor: 'pointer' }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(s.id)} />
                </TableCell>
                <TableCell>{s.nombreCompleto}</TableCell>
                <TableCell>{s.cedula}</TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow><TableCell colSpan={3} align="center">{id_materia ? (search ? 'Sin resultados' : 'Todos los estudiantes ya están asignados') : 'Seleccione una materia'}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>Asignaciones actuales</Typography>
      {!id_materia ? (
        <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>Escoja materia para comenzar a asignar</Typography>
      ) : isLoadingStud ? (
        <Typography>Cargando...</Typography>
      ) : (
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
              {studentAssignments?.filter(a => a.estado === 'Activo' && a.id_materia === parseInt(id_materia)).map(a => (
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
              {(!studentAssignments || studentAssignments.filter(a => a.estado === 'Activo' && a.id_materia === parseInt(id_materia)).length === 0) && (
                <TableRow><TableCell colSpan={4} align="center">Sin asignaciones para esta materia</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AssignStudentSubject;

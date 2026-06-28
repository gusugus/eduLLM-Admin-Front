import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Grid, Typography, Button, MenuItem, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, Paper,
  Checkbox, IconButton, Chip, InputAdornment, TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { studentService } from '../../services/studentService';
import { subjectService } from '../../services/subjectService';
import assignmentService from '../../services/assignmentService';
import { useAssignments } from './hooks/useAssignments';

const AssignStudentSubject = () => {
  const [id_materia, setIdMateria] = useState('');
  const { studentAssignments, isLoadingStud, assignStudents, removeStudentAssignment, studPage, studLimit, setStudPage, setStudLimit } = useAssignments(id_materia);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    studentService.getActive().then(setStudents);
    subjectService.getActive().then(setSubjects);
  }, []);

  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [studentPage, setStudentPage] = useState(1);
  const [studentLimit, setStudentLimit] = useState(10);
  const [assignedIds, setAssignedIds] = useState([]);

  const refreshAssignedIds = () => {
    if (!id_materia) { setAssignedIds([]); return; }
    assignmentService.getStudentIdsByMateria(id_materia).then(setAssignedIds);
  };

  useEffect(() => { refreshAssignedIds(); }, [id_materia]);

  const handleMateriaChange = (e) => {
    setIdMateria(e.target.value);
    setSelected([]);
    setSearch('');
  };

  const assignedStudentIds = new Set(assignedIds);
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

  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentLimit;
    return filteredStudents.slice(start, start + studentLimit);
  }, [filteredStudents, studentPage, studentLimit]);

  const toggleAll = () => {
    const pageIds = paginatedStudents.map(s => s.id);
    const allOnPageSelected = pageIds.every(id => selected.includes(id));
    if (allOnPageSelected) {
      setSelected(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelected(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleAssign = async () => {
    if (!id_materia || selected.length === 0) return;
    try {
      await assignStudents.mutateAsync({ id_estudiantes: selected, id_materia });
      setSelected([]);
      refreshAssignedIds();
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
                  checked={paginatedStudents.length > 0 && paginatedStudents.every(s => selected.includes(s.id))}
                  indeterminate={selected.length > 0 && !paginatedStudents.every(s => selected.includes(s.id))}
                  onClick={toggleAll}
                />
              </TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell>Cédula</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map(s => (
              <TableRow key={s.id} hover selected={selected.includes(s.id)}
                onClick={() => toggleStudent(s.id)} sx={{ cursor: 'pointer' }}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(s.id)} />
                </TableCell>
                <TableCell>{s.nombreCompleto}</TableCell>
                <TableCell>{s.cedula}</TableCell>
              </TableRow>
            ))}
            {paginatedStudents.length === 0 && (
              <TableRow><TableCell colSpan={3} align="center">{id_materia ? (search ? 'Sin resultados' : 'Todos los estudiantes ya están asignados') : 'Seleccione una materia'}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredStudents.length}
          page={studentPage - 1}
          rowsPerPage={studentLimit}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={(_, p) => { setStudentPage(p + 1); setSelected([]); }}
          onRowsPerPageChange={(e) => { setStudentLimit(parseInt(e.target.value, 10)); setStudentPage(1); setSelected([]); }}
        />
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
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(studentAssignments?.data || []).map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.estudiante}</TableCell>
                  <TableCell>{a.materia}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => removeStudentAssignment.mutateAsync(a.id).then(refreshAssignedIds)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {(!studentAssignments?.data || studentAssignments.data.length === 0) && (
                <TableRow><TableCell colSpan={3} align="center">Sin asignaciones para esta materia</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          {studentAssignments?.pagination && (
            <TablePagination
              component="div"
              count={studentAssignments.pagination.total || 0}
              page={(studentAssignments.pagination.page || 1) - 1}
              rowsPerPage={studentAssignments.pagination.limit || 10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              onPageChange={(_, newPage) => setStudPage(newPage + 1)}
              onRowsPerPageChange={(e) => { setStudLimit(parseInt(e.target.value, 10)); setStudPage(1); }}
            />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AssignStudentSubject;

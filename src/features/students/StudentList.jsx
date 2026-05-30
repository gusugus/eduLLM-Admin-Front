import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudents } from './hooks/useStudents';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'nombreCompleto', headerName: 'Nombre' },
  { field: 'username', headerName: 'Username' },
  { field: 'codigo_estudiante', headerName: 'Código' },
  { field: 'estado', headerName: 'Estado' },
];

const StudentsList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteStudent } = useStudents();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const students = data?.data || data || [];

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  const confirmDelete = async () => {
    await deleteStudent.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Estudiantes</Typography>
      <Button variant="contained" onClick={() => navigate('/students/new')}>
        Crear Estudiante
      </Button>
      <DataTable
        columns={columns}
        data={students}
        onEdit={(row) => navigate(`/students/${row.id}`)}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        open={openDialog}
        title="Eliminar"
        message="¿Estás seguro de que deseas eliminar este estudiante?"
        onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
    </Container>
  );
};

export default StudentsList;

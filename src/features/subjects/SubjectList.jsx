import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSubjects } from './hooks/useSubjects';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'nombre', headerName: 'Nombre' },
  { field: 'descripcion', headerName: 'Descripción' },
  { field: 'estado', headerName: 'Estado' },
];

const SubjectsList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteSubject } = useSubjects();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const subjects = data?.data || data || [];

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  const confirmDelete = async () => {
    await deleteSubject.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Materias</Typography>
      <Button variant="contained" onClick={() => navigate('/subjects/new')}>
        Crear Materia
      </Button>
      <DataTable
        columns={columns}
        data={subjects}
        onEdit={(row) => navigate(`/subjects/${row.id}`)}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        open={openDialog}
        title="Eliminar"
        message="¿Estás seguro de que deseas eliminar esta materia?"
        onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
    </Container>
  );
};

export default SubjectsList;

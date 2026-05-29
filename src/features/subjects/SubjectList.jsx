import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSubjects } from './hooks/useSubjects';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Nombre' },
  // añade más según tu modelo
];

const SubjectsList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteSubjects } = useSubjects();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  const confirmDelete = async () => {
    await deleteSubjects.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Materias</Typography>
      <Button variant="contained" onClick={() => navigate('new')}>Crear Materia</Button>
      <DataTable columns={columns} data={data || []} onEdit={(row) => navigate(`${row.id}`)} onDelete={handleDelete} />
      <ConfirmDialog open={openDialog} title="Eliminar" message="¿Estás seguro?" onConfirm={confirmDelete} onCancel={() => setOpenDialog(false)} />
    </Container>
  );
};

export default SubjectsList;
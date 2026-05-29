import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProfessors } from './hooks/useProfessors';  
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ProfessorList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteProfessor } = useProfessors(); // true por defecto
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 🔥 Asegúrate de que 'data' es el array de profesores
  // Si 'data' viene envuelto en { success: true, data: [...] }, extrae data.data
  const professors = data?.data || data || [];

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'nombreCompleto', headerName: 'Nombre' },
    //{ field: 'cedula', headerName: 'Cédula' },
    //{ field: 'correo', headerName: 'Correo' },
    { field: 'username', headerName: 'Username' },
    //{ field: 'departamento', headerName: 'Departamento' },
    { field: 'estado', headerName: 'Estado' },
    //{ field: 'rol', headerName: 'Rol' },
  ];

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    await deleteProfessor.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Profesores</Typography>
      <Button variant="contained" onClick={() => navigate('/professors/new')}>
        Crear Profesor
      </Button>
      <DataTable 
        columns={columns} 
        data={professors}  
        onEdit={(row) => navigate(`/professors/${row.id}`)} 
        onDelete={handleDelete} 
      />
      <ConfirmDialog 
        open={openDialog} 
        title="Eliminar" 
        message="¿Estás seguro de que deseas eliminar este profesor?" 
        onConfirm={confirmDelete} 
        onCancel={() => setOpenDialog(false)} 
      />
    </Container>
  );
};

export default ProfessorList;
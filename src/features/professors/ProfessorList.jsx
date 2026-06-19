import React, { useState } from 'react';
import { Button, Container, Typography, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProfessors } from './hooks/useProfessors';
import professorService from '../../services/professorService';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProfileModal from '../../components/common/ProfileModal';

const ProfessorList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteProfessor, page, limit, search, setPage, setLimit, setSearch } = useProfessors();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  const professors = data?.data || [];
  const pagination = data?.pagination || null;

  const getInitials = (name) =>
    name?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '';

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'nombreCompleto', headerName: 'Nombre',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={row.foto_url} sx={{ width: 32, height: 32, fontSize: 13 }}>
            {getInitials(row.nombreCompleto)}
          </Avatar>
          {row.nombreCompleto}
        </Box>
      )
    },
    { field: 'username', headerName: 'Username' },
    { field: 'estado', headerName: 'Estado' },
  ];

  const handleView = async (row) => {
    try {
      const fullData = await professorService.getById(row.id);
      setSelectedProfessor(fullData || row);
    } catch {
      setSelectedProfessor(row);
    }
    setProfileOpen(true);
  };

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
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre o username..."
        onView={handleView}
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
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        person={selectedProfessor}
        type="profesor"
      />
    </Container>
  );
};

export default ProfessorList;

import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGrados } from './hooks/useGrados';
import gradoService from '../../services/gradoService';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ViewModal from '../../components/common/ViewModal';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'grado', headerName: 'Grado' },
  { field: 'paralelo', headerName: 'Paralelo' },
  { field: 'nombre_completo', headerName: 'Nombre Completo' },
  { field: 'estado', headerName: 'Estado' },
];

const GradosList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteGrado, page, limit, search, setPage, setLimit, setSearch } = useGrados();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedGrado, setSelectedGrado] = useState(null);

  const grados = data?.data || [];
  const pagination = data?.pagination || null;

  const handleView = async (row) => {
    try {
      const full = await gradoService.getById(row.id);
      setSelectedGrado(full || row);
    } catch {
      setSelectedGrado(row);
    }
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  const confirmDelete = async () => {
    await deleteGrado.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Grados</Typography>
      <Button variant="contained" onClick={() => navigate('/grados/new')}>
        Crear Grado
      </Button>
      <DataTable
        columns={columns}
        data={grados}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por grado o paralelo..."
        onView={handleView}
        onEdit={(row) => navigate(`/grados/${row.id}`)}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        open={openDialog}
        title="Eliminar"
        message="¿Estás seguro de que deseas eliminar este grado?"
        onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
      <ViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle de Grado"
        fields={[
          { label: 'Grado', value: selectedGrado?.grado },
          { label: 'Paralelo', value: selectedGrado?.paralelo },
        ]}
      />
    </Container>
  );
};

export default GradosList;

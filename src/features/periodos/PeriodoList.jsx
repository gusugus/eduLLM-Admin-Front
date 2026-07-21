import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePeriodos } from './hooks/usePeriodos';
import periodoService from '../../services/periodoService';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ViewModal from '../../components/common/ViewModal';

const columns = [
  { field: 'nombre', headerName: 'Nombre' },
  { field: 'fecha_inicio', headerName: 'Fecha Inicio' },
  { field: 'fecha_fin', headerName: 'Fecha Fin' },
  { field: 'estado', headerName: 'Estado' },
];

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const PeriodoList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deletePeriodo, activatePeriodo, page, limit, search, setPage, setLimit, setSearch } = usePeriodos();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  const [selectedActivateRow, setSelectedActivateRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);

  const periodos = (data?.data || []).map(p => ({
    ...p,
    fecha_inicio: formatDate(p.fecha_inicio),
    fecha_fin: formatDate(p.fecha_fin),
  }));
  const pagination = data?.pagination || null;

  const handleView = async (row) => {
    try {
      const full = await periodoService.getById(row.id);
      setSelectedPeriodo(full || row);
    } catch {
      setSelectedPeriodo(row);
    }
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  const confirmDelete = async () => {
    await deletePeriodo.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  const handleActivate = (row) => {
    setSelectedActivateRow(row);
    setOpenActivateDialog(true);
  };

  const confirmActivate = async () => {
    await activatePeriodo.mutateAsync(selectedActivateRow.id);
    setOpenActivateDialog(false);
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Periodos Lectivos</Typography>
      <Button variant="contained" onClick={() => navigate('/periodos/new')}>
        Crear Periodo
      </Button>
      <DataTable
        columns={columns}
        data={periodos}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre..."
        onView={handleView}
        onEdit={(row) => navigate(`/periodos/${row.id}`)}
        onDelete={handleDelete}
        onActivate={handleActivate}
      />
      <ConfirmDialog
        open={openDialog}
        title="Eliminar"
        message="¿Estás seguro de que deseas eliminar este periodo?"
        onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
      <ConfirmDialog
        open={openActivateDialog}
        title="Activar Periodo"
        message={`¿Estás seguro de que deseas activar el periodo "${selectedActivateRow?.nombre || 'este periodo'}"?`}
        confirmText="Activar"
        onConfirm={confirmActivate}
        onCancel={() => setOpenActivateDialog(false)}
      />
      <ViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle de Periodo"
        fields={[
          { label: 'Nombre', value: selectedPeriodo?.nombre },
          { label: 'Fecha Inicio', value: selectedPeriodo?.fecha_inicio ? formatDate(selectedPeriodo.fecha_inicio) : '' },
          { label: 'Fecha Fin', value: selectedPeriodo?.fecha_fin ? formatDate(selectedPeriodo.fecha_fin) : '' },
        ]}
      />
    </Container>
  );
};

export default PeriodoList;

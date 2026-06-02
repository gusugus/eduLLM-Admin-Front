import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSubjects } from './hooks/useSubjects';
import subjectService from '../../services/subjectService';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ViewModal from '../../components/common/ViewModal';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'nombre', headerName: 'Nombre' },
  { field: 'grado_nombre', headerName: 'Grado' },
  { field: 'descripcion', headerName: 'Descripción' },
  { field: 'estado', headerName: 'Estado' },
];

const SubjectsList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteSubject } = useSubjects();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = (data?.data || data || []).map((s) => ({
    ...s,
    grado_nombre: s.grado?.nombre_completo || '-'
  }));

  const handleView = async (row) => {
    try {
      const full = await subjectService.getById(row.id);
      setSelectedSubject(full || row);
    } catch {
      setSelectedSubject(row);
    }
    setViewOpen(true);
  };

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
        onView={handleView}
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
      <ViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Detalle de Materia"
        fields={[
          { label: 'ID', value: selectedSubject?.id },
          { label: 'Nombre', value: selectedSubject?.nombre },
          { label: 'Grado', value: selectedSubject?.grado?.nombre_completo || '-' },
          { label: 'Descripción', value: selectedSubject?.descripcion },
          { label: 'Nombre Normalizado', value: selectedSubject?.nombre_normalizado },
        ]}
        status={selectedSubject?.id_estado}
      />
    </Container>
  );
};

export default SubjectsList;

import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudents } from './hooks/useStudents';
import studentService from '../../services/studentService';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProfileModal from '../../components/common/ProfileModal';

const columns = [
  { field: 'nombreCompleto', headerName: 'Nombre' },
  { field: 'username', headerName: 'Username' },
  { field: 'estado', headerName: 'Estado' },
];

const StudentsList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteStudent, activateStudent, page, limit, search, setPage, setLimit, setSearch } = useStudents();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  const [selectedActivateRow, setSelectedActivateRow] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = data?.data || [];
  const pagination = data?.pagination || null;

  const handleView = async (row) => {
    try {
      const fullData = await studentService.getById(row.id);
      setSelectedStudent(fullData || row);
    } catch {
      setSelectedStudent(row);
    }
    setProfileOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  const confirmDelete = async () => {
    await deleteStudent.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  const handleActivate = (row) => {
    setSelectedActivateRow(row);
    setOpenActivateDialog(true);
  };

  const confirmActivate = async () => {
    await activateStudent.mutateAsync(selectedActivateRow.id);
    setOpenActivateDialog(false);
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
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre o username..."
        onView={handleView}
        onEdit={(row) => navigate(`/students/${row.id}`)}
        onDelete={handleDelete}
        onActivate={handleActivate}
      />
      <ConfirmDialog
        open={openDialog}
        title="Eliminar"
        message="¿Estás seguro de que deseas eliminar este estudiante?"
        onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
      <ConfirmDialog
        open={openActivateDialog}
        title="Activar Estudiante"
        message={`¿Estás seguro de que deseas activar a ${selectedActivateRow?.nombreCompleto || 'este estudiante'}?`}
        confirmText="Activar"
        onConfirm={confirmActivate}
        onCancel={() => setOpenActivateDialog(false)}
      />
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        person={selectedStudent}
        type="estudiante"
      />
    </Container>
  );
};

export default StudentsList;

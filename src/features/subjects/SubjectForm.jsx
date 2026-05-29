import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSubjects } from './hooks/useSubjects';

const SubjectsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, createSubjects, updateSubjects } = useSubjects();
  const { register, handleSubmit } = useForm({ defaultValues: id ? data?.find(item => item.id === parseInt(id)) : {} });

  const onSubmit = async (formData) => {
    if (id) await updateSubjects.mutateAsync({ id, data: formData });
    else await createSubjects.mutateAsync(formData);
    navigate('/subjects');
  };

  return (
    <Container>
      <Typography variant="h4">{id ? 'Editar' : 'Crear'} Materia</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField fullWidth label="Nombre" {...register('name')} margin="normal" required />
        <Button type="submit" variant="contained">Guardar</Button>
        <Button onClick={() => navigate('/subjects')}>Cancelar</Button>
      </Box>
    </Container>
  );
};

export default SubjectsForm;
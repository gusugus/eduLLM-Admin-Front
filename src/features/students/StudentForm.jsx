import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useStudents } from './hooks/useStudents';

const StudentsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, createStudents, updateStudents } = useStudents();
  const { register, handleSubmit } = useForm({ defaultValues: id ? data?.find(item => item.id === parseInt(id)) : {} });

  const onSubmit = async (formData) => {
    if (id) await updateStudents.mutateAsync({ id, data: formData });
    else await createStudents.mutateAsync(formData);
    navigate('/students');
  };

  return (
    <Container>
      <Typography variant="h4">{id ? 'Editar' : 'Crear'} Estudiante</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField fullWidth label="Nombre" {...register('name')} margin="normal" required />
        <Button type="submit" variant="contained">Guardar</Button>
        <Button onClick={() => navigate('/students')}>Cancelar</Button>
      </Box>
    </Container>
  );
};

export default StudentsForm;
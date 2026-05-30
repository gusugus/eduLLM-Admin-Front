import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box,
  Grid, Paper, CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FormInput from '../../components/common/FormInput';
import { useSubjects } from './hooks/useSubjects';

const SubjectsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createSubject, updateSubject, useSubjectById, error: loadError } = useSubjects({ enableList: false });

  const isEdit = !!id;

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      nombre: '',
      descripcion: '',
      nombre_normalizado: ''
    }
  });

  const { data: subjectData, isLoading: isLoadingSubject } = useSubjectById(isEdit ? id : null);

  useEffect(() => {
    if (isEdit && subjectData) {
      reset({
        nombre: subjectData.nombre || '',
        descripcion: subjectData.descripcion || '',
        nombre_normalizado: subjectData.nombre_normalizado || ''
      });
    }
  }, [isEdit, subjectData, reset]);

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateSubject.mutateAsync({ id, data: formData });
        enqueueSnackbar('Materia actualizada exitosamente', { variant: 'success' });
      } else {
        await createSubject.mutateAsync(formData);
        enqueueSnackbar('Materia creada exitosamente', { variant: 'success' });
      }
      navigate('/subjects');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  if (isEdit && isLoadingSubject) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando datos de la materia...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Editar Materia' : 'Nueva Materia'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <FormInput
              name="nombre"
              label="Nombre"
              register={register}
              errors={errors}
              control={control}
              required
              xs={12}
              validation={{
                required: 'El nombre es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              }}
            />
            <FormInput
              name="descripcion"
              label="Descripción"
              register={register}
              errors={errors}
              control={control}
              xs={12}
            />
            <FormInput
              name="nombre_normalizado"
              label="Nombre normalizado (para búsqueda)"
              register={register}
              errors={errors}
              control={control}
              xs={12}
            />

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/subjects')}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Materia')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubjectsForm;

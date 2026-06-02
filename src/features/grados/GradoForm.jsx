import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box,
  Grid, Paper, CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FormInput from '../../components/common/FormInput';
import { useGrados } from './hooks/useGrados';

const GradosForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createGrado, updateGrado, useGradoById, error: loadError } = useGrados({ enableList: false });

  const isEdit = !!id;

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      grado: '',
      paralelo: ''
    }
  });

  const { data: gradoData, isLoading: isLoadingGrado } = useGradoById(isEdit ? id : null);

  useEffect(() => {
    if (isEdit && gradoData) {
      reset({
        grado: gradoData.grado || '',
        paralelo: gradoData.paralelo || ''
      });
    }
  }, [isEdit, gradoData, reset]);

  const onSubmit = async (formData) => {
    try {
      const data = {
        ...formData,
        grado: parseInt(formData.grado, 10)
      };

      let response;
      if (isEdit) {
        response = await updateGrado.mutateAsync({ id, data });
      } else {
        response = await createGrado.mutateAsync(data);
      }
      enqueueSnackbar(response?.message || (isEdit ? 'Grado actualizado exitosamente' : 'Grado creado exitosamente'), { variant: 'success' });
      navigate('/grados');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  if (isEdit && isLoadingGrado) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando datos del grado...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Editar Grado' : 'Nuevo Grado'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <FormInput
              name="grado"
              label="Grado (número)"
              register={register}
              errors={errors}
              control={control}
              required
              xs={6}
              mask="numbers"
              validation={{
                required: 'El grado es requerido',
                min: { value: 1, message: 'Mínimo 1' },
                max: { value: 13, message: 'Máximo 2' }
              }}
            />
            <FormInput
              name="paralelo"
              label="Paralelo (letra)"
              register={register}
              errors={errors}
              control={control}
              xs={6}
              maxLength={1}
              mask="uppercase"
              validation={{
                required: 'El paralelo es requerido',
                maxLength: { value: 1, message: 'Solo una letra' }
              }}
            />

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/grados')}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Grado')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default GradosForm;

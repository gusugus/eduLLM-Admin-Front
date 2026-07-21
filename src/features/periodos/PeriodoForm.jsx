import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box,
  Grid, Paper, CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FormInput from '../../components/common/FormInput';
import { usePeriodos } from './hooks/usePeriodos';

const PeriodoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createPeriodo, updatePeriodo, usePeriodoById } = usePeriodos({ enableList: false });

  const isEdit = !!id;

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
    }
  });

  const { data: periodoData, isLoading: isLoadingPeriodo } = usePeriodoById(isEdit ? id : null);

  useEffect(() => {
    if (isEdit && periodoData) {
      const toDateInput = (d) => {
        if (!d) return '';
        const date = new Date(d);
        return date.toISOString().split('T')[0];
      };
      reset({
        nombre: periodoData.nombre || '',
        fecha_inicio: toDateInput(periodoData.fecha_inicio),
        fecha_fin: toDateInput(periodoData.fecha_fin),
      });
    }
  }, [isEdit, periodoData, reset]);

  const onSubmit = async (formData) => {
    try {
      let response;
      if (isEdit) {
        response = await updatePeriodo.mutateAsync({ id, data: formData });
      } else {
        response = await createPeriodo.mutateAsync(formData);
      }
      enqueueSnackbar(response?.message || (isEdit ? 'Periodo actualizado exitosamente' : 'Periodo creado exitosamente'), { variant: 'success' });
      navigate('/periodos');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  if (isEdit && isLoadingPeriodo) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando datos del periodo...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Editar Periodo' : 'Nuevo Periodo'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <FormInput
              name="nombre"
              label="Nombre del Periodo"
              register={register}
              errors={errors}
              control={control}
              required
              xs={12}
              validation={{
                required: 'El nombre es requerido',
              }}
            />
            <FormInput
              name="fecha_inicio"
              label="Fecha Inicio"
              register={register}
              errors={errors}
              control={control}
              required
              xs={6}
              type="date"
              validation={{
                required: 'La fecha de inicio es requerida',
              }}
            />
            <FormInput
              name="fecha_fin"
              label="Fecha Fin"
              register={register}
              errors={errors}
              control={control}
              required
              xs={6}
              type="date"
              validation={{
                required: 'La fecha de fin es requerida',
              }}
            />
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/periodos')}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Periodo')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default PeriodoForm;

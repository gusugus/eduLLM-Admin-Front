import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box,
  Grid, Paper, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FormInput from '../../components/common/FormInput';
import { useSubjects } from './hooks/useSubjects';
import { useGrados } from '../../features/grados/hooks/useGrados';

const SubjectsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createSubject, updateSubject, useSubjectById, error: loadError } = useSubjects({ enableList: false });

  const isEdit = !!id;

  const { data: grados, isLoading: isLoadingGrados } = useGrados();

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      nombre: '',
      descripcion: '',
      id_grado: ''
    }
  });

  const { data: subjectData, isLoading: isLoadingSubject } = useSubjectById(isEdit ? id : null);

  useEffect(() => {
    if (isEdit && subjectData) {
      reset({
        nombre: subjectData.nombre || '',
        descripcion: subjectData.descripcion || '',
        id_grado: subjectData.id_grado || ''
      });
    }
  }, [isEdit, subjectData, reset]);

  const onSubmit = async (formData) => {
    try {
      let response;
      if (isEdit) {
        response = await updateSubject.mutateAsync({ id, data: formData });
      } else {
        response = await createSubject.mutateAsync(formData);
      }
      enqueueSnackbar(response?.message || (isEdit ? 'Materia actualizada exitosamente' : 'Materia creada exitosamente'), { variant: 'success' });
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

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.id_grado}>
                <InputLabel id="grado-label">Grado</InputLabel>
                <Controller
                  name="id_grado"
                  control={control}
                  rules={{ required: 'El curso es obligatorio' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="grado-label"
                      label="Grado"
                      disabled={isLoadingGrados}
                    >
                      <MenuItem value="">
                        <em>Seleccione un curso</em>
                      </MenuItem>
                      {(grados?.data || []).map((g) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.nombre_completo}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.id_grado?.message}</FormHelperText>
              </FormControl>
            </Grid>

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

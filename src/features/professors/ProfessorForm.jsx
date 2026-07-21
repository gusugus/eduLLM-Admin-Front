import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, 
  Grid, Paper, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FormInput from '../../components/common/FormInput';
import { useProfessors } from './hooks/useProfessors';
import uploadService from '../../services/uploadService';
import { 
  professorValidationRules
} from '../../utils/validations';

const ProfessorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createProfessor, updateProfessor, useProfessorById, error: loadError, refetch } = useProfessors({ enableList: false });
  
  const isEdit = !!id;
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoUrlActual, setFotoUrlActual] = useState(null);

  // Inicializar useForm
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting }, clearErrors } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      cedula: '',
      primer_nombre: '',
      segundo_nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      correo: ''
    }
  });

  // Cargar datos del profesor si es edición
  const { data: professorData, isLoading: isLoadingProfessor } = useProfessorById(isEdit ? id : null);
  // Resetea el formulario cuando los datos del profesor estén disponibles
  useEffect(() => {
  if (isEdit && professorData) {
    const prof = professorData;    
    reset({
      cedula: prof.cedula || '',
      primer_nombre: prof.primer_nombre || '',
      segundo_nombre: prof.segundo_nombre || '',
      apellido_paterno: prof.apellido_paterno || '',
      apellido_materno: prof.apellido_materno || '',
      correo: prof.correo || ''
    });
    setFotoUrlActual(prof.foto_url || null);
    clearErrors();
  }
}, [isEdit, professorData, reset, clearErrors]);


  // Mostrar modal si hay error de carga
  useEffect(() => {
    if (loadError) {
      setErrorMessage(`Error al cargar datos: ${loadError.message}`);
      setErrorModalOpen(true);
    }
  }, [loadError]);

  const onSubmit = async (formData) => {
    try {
      let result;
      let idUsuario;

      if (isEdit) {
        result = await updateProfessor.mutateAsync({ id, data: formData });
        idUsuario = result?.data?.id_usuario;
      } else {
        result = await createProfessor.mutateAsync(formData);
        idUsuario = result?.data?.id_usuario;
      }

      const successMsg = result?.data?.message || (isEdit ? 'Profesor actualizado exitosamente' : 'Profesor creado exitosamente');

      if (foto && idUsuario) {
        try {
          await uploadService.uploadProfilePhoto(foto, idUsuario);
          enqueueSnackbar(successMsg, { variant: 'success' });
        } catch (uploadErr) {
          console.error('Error al subir foto:', uploadErr);
          enqueueSnackbar(successMsg + ' (error al subir la foto)', { variant: 'warning' });
        }
      } else {
        enqueueSnackbar(successMsg, { variant: 'success' });
      }

      navigate('/professors');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar';
      setErrorMessage(errorMsg);
      setErrorModalOpen(true);
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  const fields = {
    personal: [
      { name: 'cedula', label: 'Cédula', required: true, sm: 6, mask: 'cedula', maxLength: 10, validation: professorValidationRules.cedula },
      { name: 'primer_nombre', label: 'Primer Nombre', required: true, sm: 6, mask: 'letters', validation: professorValidationRules.primer_nombre },
      { name: 'segundo_nombre', label: 'Segundo Nombre', required: false, sm: 12, mask: 'letters', validation: professorValidationRules.segundo_nombre },
      { name: 'apellido_paterno', label: 'Apellido Paterno', required: true, sm: 12, mask: 'letters',
        validation: professorValidationRules.apellido_paterno
      },
      { name: 'apellido_materno', label: 'Apellido Materno', required: false, sm: 6, mask: 'letters', validation: professorValidationRules.apellido_materno },
      { name: 'correo', label: 'Correo Electrónico', required: true, type: 'email', sm: 6, validation: professorValidationRules.correo }
    ]
  };

  // Mostrar loading mientras se cargan los datos en edición
  if (isEdit && isLoadingProfessor) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando datos del profesor...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? 'Editar Profesor' : 'Nuevo Profesor'}
        </Typography>
        
        {/* Mostrar error de carga si existe */}
        {loadError && (
          <Alert severity="error" sx={{ mb: 3 }} action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Reintentar
            </Button>
          }>
            Error al cargar datos: {loadError.message}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">Datos Personales</Typography>
            </Grid>
            
            {fields.personal.map((field) => (
              <FormInput
                key={field.name}
                name={field.name}
                label={field.label}
                register={register}
                errors={errors}
                control={control}
                required={field.required}
                type={field.type || 'text'}
                sm={field.sm}
                mask={field.mask}
                maxLength={field.maxLength}
                validation={field.validation}
                onBlurCustom={field.onBlurCustom}
              />
            ))}

            <Grid item xs={12}>
              <Typography variant="h6" color="primary" gutterBottom>Foto de Perfil</Typography>
              <input
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
                id="profile-photo-input"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFoto(file);
                    setFotoPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <label htmlFor="profile-photo-input">
                <Button variant="outlined" component="span">
                  {foto ? 'Cambiar foto' : 'Seleccionar foto'}
                </Button>
              </label>
              {fotoPreview && (
                <Box sx={{ mt: 2 }}>
                  <img src={fotoPreview} alt="Preview" style={{ maxWidth: 150, maxHeight: 150, borderRadius: 8 }} />
                </Box>
              )}
              {!foto && fotoUrlActual && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Foto actual:</Typography>
                  <img src={fotoUrlActual} alt="Foto actual" style={{ maxWidth: 150, maxHeight: 150, borderRadius: 8, display: 'block' }} />
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/professors')}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Profesor')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Modal de error general */}
      <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white' }}>
          Error
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 2 }}>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorModalOpen(false)} variant="contained">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfessorForm;
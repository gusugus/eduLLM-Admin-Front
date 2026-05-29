import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Button, Box, 
  Grid, Paper, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { debounce } from 'lodash';
import FormInput from '../../components/common/FormInput';
import { useProfessors } from './hooks/useProfessors';
import { 
  professorValidationRules,
  checkUsernameAvailability,
  suggestUsername,
  validateUsername
} from '../../utils/validations';

const ProfessorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createProfessor, updateProfessor, useProfessorById, error: loadError, refetch } = useProfessors({ enableList: false });
  
  const isEdit = !!id;
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Inicializar useForm
  const { control, register, handleSubmit, watch, setValue, getValues, trigger, reset, formState: { errors, isSubmitting }, setError, clearErrors } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      cedula: '',
      primer_nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      correo: '',
      username: '',
      password: ''
    }
  });

  // Cargar datos del profesor si es edición
  const { data: professorData, isLoading: isLoadingProfessor } = useProfessorById(isEdit ? id : null);
  console.log(professorData);
  console.log(isEdit);
  console.log(professorData?.data);
  // Resetear el formulario cuando los datos del profesor estén disponibles
  useEffect(() => {
  if (isEdit && professorData) {  // <- Cambia professorData?.data a professorData
    const prof = professorData;
    console.log('Reseteando formulario con:', prof);
    
    reset({
      cedula: prof.cedula || '',
      primer_nombre: prof.primer_nombre || '',
      apellido_paterno: prof.apellido_paterno || '',
      apellido_materno: prof.apellido_materno || '',
      correo: prof.correo || '',
      username: prof.username || '',
      password: ''
    });
    
    setGeneratedUsername(prof.username || '');
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

  const primerNombre = watch('primer_nombre');
  const apellidoPaterno = watch('apellido_paterno');
  const currentUsername = watch('username');

  // Función para verificar username en BD (debounced)
  const checkUsernameAvailabilityDebounced = useCallback(
    debounce(async (username) => {
      if (!username || username.length < 3) {
        setUsernameExists(false);
        return;
      }
      
      setIsCheckingUsername(true);
      try {
        const result = await checkUsernameAvailability(username, id);
        if (!result.available) {
          setUsernameExists(true);
          setError('username', { 
            type: 'manual', 
            message: result.message || 'Este username ya existe. Haz clic en "Usar sugerido" para obtener uno disponible' 
          });
        } else {
          setUsernameExists(false);
          clearErrors('username');
        }
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500),
    [id, setError, clearErrors]
  );

  // Verificar cuando cambia el username
  useEffect(() => {
    if (currentUsername && !isEdit) {
      checkUsernameAvailabilityDebounced(currentUsername);
    }
    return () => checkUsernameAvailabilityDebounced.cancel();
  }, [currentUsername, isEdit, checkUsernameAvailabilityDebounced]);

  // Generar username automáticamente
  const generateNewUsername = useCallback(async () => {
    const currentPrimer = getValues('primer_nombre');
    const currentApellido = getValues('apellido_paterno');
    
    if (!currentPrimer || !currentApellido) {
      enqueueSnackbar('Complete nombre y apellido primero', { variant: 'warning' });
      return;
    }
    
    setIsCheckingUsername(true);
    try {
      const result = await suggestUsername(currentPrimer, currentApellido);
      const newUsername = result.username;
      
      setGeneratedUsername(newUsername);
      setUsernameExists(false);
      setValue('username', newUsername, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      
      await trigger('username');
      
      clearErrors('username');
      
      if (!result.isNew) {
        enqueueSnackbar(`Username sugerido automáticamente: ${newUsername}`, { variant: 'info' });
      }
    } catch (error) {
      console.error('Error generating username:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  }, [getValues, setValue, trigger, clearErrors, enqueueSnackbar]);

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        const { username, password, ...updateData } = formData;
      await updateProfessor.mutateAsync({ id, data: updateData });
        enqueueSnackbar('Profesor actualizado exitosamente', { variant: 'success' });
        navigate('/professors');
      } else {
        await createProfessor.mutateAsync(formData);
        enqueueSnackbar('Profesor creado exitosamente', { variant: 'success' });
        navigate('/professors');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar';
      setErrorMessage(errorMsg);
      setErrorModalOpen(true);
      enqueueSnackbar(errorMsg, { variant: 'error' });
      
      if (errorMsg.toLowerCase().includes('username')) {
        setError('username', { message: 'Username ya existe. Usa el botón "Usar sugerido"' });
        setUsernameExists(true);
      }
    }
  };

  const fields = {
    personal: [
      { name: 'cedula', label: 'Cédula', required: true, sm: 12, mask: 'cedula', maxLength: 10, validation: professorValidationRules.cedula },
      { name: 'primer_nombre', label: 'Primer Nombre', required: true, sm: 12, mask: 'letters', validation: professorValidationRules.primer_nombre,
        onBlurCustom: () => generateNewUsername()
      },
      { name: 'apellido_paterno', label: 'Apellido Paterno', required: true, sm: 12, mask: 'letters',
        validation: professorValidationRules.apellido_paterno,
        onBlurCustom: () => generateNewUsername()
      },
      { name: 'apellido_materno', label: 'Apellido Materno', required: false, sm: 12, mask: 'letters', validation: professorValidationRules.apellido_materno },
      { name: 'correo', label: 'Correo Electrónico', required: true, type: 'email', sm: 12, validation: professorValidationRules.correo }
    ],
    credenciales: !isEdit ? [
      { 
        name: 'username', 
        label: 'Username', 
        required: true, 
        sm: 12, 
        mask: 'username',
        helperText: generatedUsername ? `Última sugerencia: ${generatedUsername}` : '',
        validation: {
          required: 'El username es requerido',
          minLength: { value: 3, message: 'Mínimo 3 caracteres' },
          validate: (value) => {
            if (!validateUsername(value)) {
              return 'Solo letras, números, guiones y guiones bajos';
            }
            return true;
          }
        }
      },
      { name: 'password', label: 'Contraseña', required: true, type: 'password', sm: 12, validation: professorValidationRules.password }
    ] : []
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
            
            {fields.credenciales.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary">Credenciales de Acceso</Typography>
                </Grid>
                {fields.credenciales.map((field) => (
                  <FormInput
                    key={field.name === 'username' ? `username-${generatedUsername}` : field.name}
                    name={field.name}
                    label={field.label}
                    register={register}
                    errors={errors}
                    control={control}
                    required={field.required}
                    type={field.type}
                    sm={field.sm}
                    mask={field.mask}
                    validation={field.validation}
                    helperText={field.helperText}
                  />
                ))}
              </>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/professors')}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={isSubmitting || isCheckingUsername}
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
import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@mui/material';
import { useWatch } from 'react-hook-form';

const FormInput = ({ 
  name, 
  label, 
  register, 
  errors, 
  required = false, 
  type = 'text',
  xs = 12,
  helperText = '',
  validation = {},
  mask,
  maxLength,
  onBlurCustom,
  control,
  ...props 
}) => {
  const registerOptions = {
    ...(required && { required: `${label} es requerido` }),
    ...validation,
  };

  // Valor observado desde React Hook Form (se actualiza con reset, setValue, etc.)
  const watchedValue = useWatch({ control, name, defaultValue: '' });
  
  // Estado local para el valor durante la escritura (asegura que el label flote inmediatamente)
  const [localValue, setLocalValue] = useState(watchedValue);

  // Sincronizar el valor observado con el local (cuando viene de reset o setValue)
  useEffect(() => {
    setLocalValue(watchedValue);
  }, [watchedValue]);

  const handleInputChange = (e) => {
    let val = e.target.value;
    // Aplicar máscara
    switch(mask) {
      case 'cedula':
        val = val.replace(/\D/g, '').slice(0, 10);
        break;
      case 'numbers':
        val = val.replace(/\D/g, '');
        break;
      case 'letters':
        val = val.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '');
        break;
      case 'lettersNoSpace':
        val = val.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, '');
        break;
      case 'username':
        val = val.replace(/[^a-zA-Z0-9_-]/g, '');
        break;
      case 'uppercase': 
        val = val.toUpperCase();
        break;
      default:
        break;
    }
    if (maxLength && val.length > maxLength) val = val.slice(0, maxLength);
    
    // Actualizar el estado local inmediatamente
    setLocalValue(val);
    
    if (val !== e.target.value) {
      e.target.value = val;
      const event = new Event('input', { bubbles: true });
      e.target.dispatchEvent(event);
    }
  };

  const shrink = Boolean(localValue && localValue.toString().length > 0);

  return (
    <Grid item xs={xs}>
      <TextField
        fullWidth
        type={type}
        label={label}
        {...register(name, registerOptions)}
        error={!!errors[name]}
        helperText={errors[name]?.message || helperText}
        onChange={handleInputChange}
        onBlur={(e) => {
          if (register(name).onBlur) register(name).onBlur(e);
          if (onBlurCustom) onBlurCustom(e);
        }}
        inputProps={{ maxLength }}
        InputLabelProps={{ shrink }}
        {...props}
      />
    </Grid>
  );
};

export default FormInput;
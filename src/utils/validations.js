import validator from 'validator';
import api from '../services/api';

export const checkUsernameAvailability = async (username, excludeUserId = null) => {
  try {
    const { data } = await api.post('/users/check-username', {
      username,
      excludeUserId: excludeUserId ? parseInt(excludeUserId) : null
    });
    return { available: data.available, message: data.message };
  } catch (error) {
    console.error('Error checking username:', error);
    return { available: false, message: 'Error al verificar username' };
  }
};

export const suggestUsername = async (primerNombre, apellidoPaterno) => {
  try {
    const { data } = await api.post('/users/suggest-username', {
      primerNombre,
      apellidoPaterno
    });
    return { username: data.username, isNew: data.isNew, exists: data.exists };
  } catch (error) {
    console.error('Error suggesting username:', error);
    const fallback = `${primerNombre}${apellidoPaterno}`.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '');
    return { username: fallback, isNew: true, exists: false };
  }
};

// Resto de validaciones...
export const validateEcuadorianId = (cedula) => {
  if (!cedula || cedula.length !== 10) return false;
  if (!/^\d+$/.test(cedula)) return false;
  
  const digitos = cedula.split('').map(Number);
  const provincia = parseInt(cedula.substring(0, 2), 10);
  
  if (provincia < 1 || provincia > 24) return false;
  if (digitos[2] >= 6) return false;
  
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let mult = i % 2 === 0 ? 2 : 1;
    let valor = digitos[i] * mult;
    suma += valor > 9 ? valor - 9 : valor;
  }
  
  const decena = Math.ceil(suma / 10) * 10;
  const digitoVerificador = decena - suma;
  
  return digitos[9] === (digitoVerificador === 10 ? 0 : digitoVerificador);
};

export const onlyLetters = (value) => {
  return /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(value);
};

export const onlyNumbers = (value) => {
  return /^\d+$/.test(value);
};

export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validateUsername = (username) => {
  return /^[a-zA-Z0-9_-]+$/.test(username);
};

export const studentValidationRules = {
  cedula: {
    required: 'La cédula es requerida',
    validate: (value) => {
      if (!value) return true;
      if (!onlyNumbers(value)) return 'La cédula solo debe contener números';
      if (value.length !== 10) return 'La cédula debe tener 10 dígitos';
      if (!validateEcuadorianId(value)) return 'Cédula ecuatoriana inválida';
      return true;
    }
  },
  primer_nombre: {
    required: 'El nombre es requerido',
    validate: (value) => {
      if (!value) return true;
      if (!onlyLetters(value)) return 'El nombre solo debe contener letras';
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      return true;
    }
  },
  apellido_paterno: {
    required: 'El apellido paterno es requerido',
    validate: (value) => {
      if (!value) return true;
      if (!onlyLetters(value)) return 'El apellido solo debe contener letras';
      if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
      return true;
    }
  },
  apellido_materno: {
    validate: (value) => {
      if (value && !onlyLetters(value)) return 'El apellido solo debe contener letras';
      return true;
    }
  },
  segundo_nombre: {
    validate: (value) => {
      if (value && !onlyLetters(value)) return 'El nombre solo debe contener letras';
      return true;
    }
  },
  correo: {
    required: 'El correo es requerido',
    validate: (value) => {
      if (!value) return true;
      if (!validateEmail(value)) return 'Correo electrónico inválido';
      return true;
    }
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    }
  },
};

export const professorValidationRules = {
  cedula: {
    required: 'La cédula es requerida',
    validate: (value) => {
      if (!value) return true;
      if (!onlyNumbers(value)) return 'La cédula solo debe contener números';
      if (value.length !== 10) return 'La cédula debe tener 10 dígitos';
      if (!validateEcuadorianId(value)) return 'Cédula ecuatoriana inválida';
      return true;
    }
  },
  primer_nombre: {
    required: 'El nombre es requerido',
    validate: (value) => {
      if (!value) return true;
      if (!onlyLetters(value)) return 'El nombre solo debe contener letras';
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      return true;
    }
  },
  apellido_paterno: {
    required: 'El apellido paterno es requerido',
    validate: (value) => {
      if (!value) return true;
      if (!onlyLetters(value)) return 'El apellido solo debe contener letras';
      if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
      return true;
    }
  },
  apellido_materno: {
    validate: (value) => {
      if (value && !onlyLetters(value)) return 'El apellido solo debe contener letras';
      return true;
    }
  },
  segundo_nombre: {
    validate: (value) => {
      if (value && !onlyLetters(value)) return 'El nombre solo debe contener letras';
      return true;
    }
  },
  correo: {
    required: 'El correo es requerido',
    validate: (value) => {
      if (!value) return true;
      if (!validateEmail(value)) return 'Correo electrónico inválido';
      return true;
    }
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    }
  }
};
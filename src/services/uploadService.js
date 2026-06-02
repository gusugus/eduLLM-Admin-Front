import api from './api';

export const uploadService = {
  uploadProfilePhoto: (file, idUsuario) => {
    const formData = new FormData();
    formData.append('foto', file);
    formData.append('id_usuario', idUsuario);
    return api.post('/upload/profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.data);
  }
};

export default uploadService;

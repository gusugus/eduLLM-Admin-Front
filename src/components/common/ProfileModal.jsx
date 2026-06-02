import React from 'react';
import {
  Dialog, DialogContent, Box, Typography, Avatar, Chip, Divider, Grid, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 55%, 45%)`;
  return color;
};

const getInitials = (nombreCompleto) => {
  return nombreCompleto
    .split(' ')
    .filter(w => w.length > 0)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
};

const ProfileModal = ({ open, onClose, person, type = 'profesor' }) => {
  if (!person) return null;

  const photoUrl = person.foto_url;
  const initials = getInitials(person.nombreCompleto || '');
  const avatarColor = stringToColor(person.nombreCompleto || '');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ position: 'relative', bgcolor: '#f5f7fa' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1, color: '#666' }}>
          <CloseIcon />
        </IconButton>

        {/* Banner */}
        <Box sx={{
          height: 120,
          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)',
          borderRadius: '4px 4px 0 0'
        }} />

        {/* Avatar + Name */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -6, pb: 2 }}>
          {photoUrl ? (
            <Avatar
              src={photoUrl}
              alt={person.nombreCompleto}
              sx={{ width: 100, height: 100, border: '4px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
          ) : (
            <Avatar
              sx={{
                width: 100, height: 100, border: '4px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                bgcolor: avatarColor, fontSize: 36, fontWeight: 700
              }}
            >
              {initials}
            </Avatar>
          )}
          <Typography variant="h5" sx={{ mt: 1.5, fontWeight: 600, color: '#1a1a2e' }}>
            {person.nombreCompleto}
          </Typography>
          <Chip
            icon={type === 'profesor' ? <SchoolIcon /> : <PersonIcon />}
            label={type === 'profesor' ? 'Profesor' : 'Estudiante'}
            size="small"
            sx={{ mt: 0.5, bgcolor: type === 'profesor' ? '#e3f2fd' : '#e8f5e9', color: type === 'profesor' ? '#1565c0' : '#2e7d32', fontWeight: 500 }}
          />
        </Box>

        <Divider />

        {/* Details */}
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Información General</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BadgeIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Cédula</Typography>
                  <Typography variant="body2">{person.cedula || '—'}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Correo</Typography>
                  <Typography variant="body2">{person.correo || '—'}</Typography>
                </Box>
              </Box>
            </Grid>

            {type === 'profesor' && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ color: '#666', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Departamento</Typography>
                    <Typography variant="body2">{person.departamento || '—'}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {type === 'estudiante' && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ color: '#666', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Grado</Typography>
                    <Typography variant="body2">{person.grado_nombre || '—'}</Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#666', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Username</Typography>
                  <Typography variant="body2">{person.username || '—'}</Typography>
                </Box>
              </Box>
            </Grid>

            {person.materias && person.materias.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Materias Asignadas
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {person.materias.map((mat) => (
                      <Chip key={mat.id} label={mat.nombre} size="small" variant="outlined" color="primary" />
                    ))}
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ProfileModal;

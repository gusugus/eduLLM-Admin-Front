import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const FieldRow = ({ label, value }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value ?? '—'}</Typography>
  </Box>
);

const ViewModal = ({ open, onClose, title, fields, status }) => {
  if (!fields) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        {fields.map((f, i) => (
          <FieldRow key={i} label={f.label} value={f.value} />
        ))}
        {status && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">Estado</Typography>
              <Chip
                label={status === 1 ? 'Activo' : status === 2 ? 'Inactivo' : 'Eliminado'}
                size="small"
                color={status === 1 ? 'success' : status === 2 ? 'warning' : 'error'}
              />
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewModal;

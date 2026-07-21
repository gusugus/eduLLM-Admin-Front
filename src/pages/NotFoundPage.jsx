import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 420 }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 72, color: '#94a3b8', mb: 2 }} />
        <Typography variant="h2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: { xs: '4rem', sm: '6rem' }, lineHeight: 1, mb: 1 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
          La página que buscas no existe o fue movida.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </Box>
    </Box>
  )
}

export default NotFoundPage

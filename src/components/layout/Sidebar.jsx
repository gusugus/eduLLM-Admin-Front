import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, People, School, Book, Assignment, Layers } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Profesores', icon: <People />, path: '/professors' },
    { text: 'Estudiantes', icon: <School />, path: '/students' },
    { text: 'Materias', icon: <Book />, path: '/subjects' },
    { text: 'Grados', icon: <Layers />, path: '/grados' },
    { text: 'Asignaciones', icon: <Assignment />, path: '/assignments' },
    
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default Sidebar;
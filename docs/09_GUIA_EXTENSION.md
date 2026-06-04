# 9. Guía para Extender (Agregar Nueva Feature)

Para implementar Estudiantes o Materias con la misma funcionalidad completa que Profesores.

## Paso 1: Service (`src/services/[entity]Service.js`)

```javascript
import api from './api';

export const entityService = {
  getAll:  ()          => api.get('/entities').then(res => res.data.data || []).catch(() => []),
  getById: (id)        => api.get(`/entities/${id}`).then(res => res.data.data || []).catch(() => []),
  create:  (data)      => api.post('/entities', data).then(res => res.data.data || []).catch(() => []),
  update:  (id, data)  => api.put(`/entities/${id}`, data).then(res => res.data.data || []).catch(() => []),
  delete:  (id)        => api.delete(`/entities/${id}`).then(res => res.data || []),
};

export default entityService;
```

## Paso 2: Hook (`src/features/[entities]/hooks/use[Entities].js`)

Seguir el patrón de `useProfessors.js`:

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import entityService from '../../../services/entityService';

const QUERY_KEY = 'entities';

export const useEntities = ({ enableList = true } = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => entityService.getAll(),
    enabled: enableList,
  });

  const useEntityById = (id) => useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => entityService.getById(id),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: (newData) => entityService.create(newData),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entityService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entityService.delete(id),
    onSuccess: () => queryClient.invalidateQueries([QUERY_KEY]),
  });

  return {
    data, isLoading, error, refetch,
    useEntityById,
    createEntity: createMutation,
    updateEntity: updateMutation,
    deleteEntity: deleteMutation,
  };
};
```

**Reglas:**
- `QUERY_KEY` debe ser único por entidad
- `enableList` permite deshabilitar la query de listado desde el formulario
- `useEntityById` se ejecuta solo cuando `id` es truthy
- Todas las mutations invalidan el cache on success

## Paso 3: List Component (`src/features/[entities]/[Entity]List.jsx`)

```jsx
import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEntities } from './hooks/useEntities';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'nombreCompleto', headerName: 'Nombre' },
  { field: 'username', headerName: 'Username' },
  { field: 'estado', headerName: 'Estado' },
];

const EntityList = () => {
  const navigate = useNavigate();
  const { data, isLoading, deleteEntity } = useEntities();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const entities = data?.data || data || [];

  const handleDelete = (id) => { setSelectedId(id); setOpenDialog(true); };
  const confirmDelete = async () => {
    await deleteEntity.mutateAsync(selectedId);
    setOpenDialog(false);
  };

  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Entidades</Typography>
      <Button variant="contained" onClick={() => navigate('/entities/new')}>
        Crear Entidad
      </Button>
      <DataTable columns={columns} data={entities}
        onEdit={(row) => navigate(`/entities/${row.id}`)}
        onDelete={handleDelete} />
      <ConfirmDialog open={openDialog} title="Eliminar"
        message="¿Estás seguro?" onConfirm={confirmDelete}
        onCancel={() => setOpenDialog(false)} />
    </Container>
  );
};

export default EntityList;
```

## Paso 4: Form Component (`src/features/[entities]/[Entity]Form.jsx`)

Seguir el patrón de `ProfessorForm.jsx`:

```jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import FormInput from '../../components/common/FormInput';
import { useEntities } from './hooks/useEntities';

const EntityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createEntity, updateEntity, useEntityById } = useEntities({ enableList: false });
  const isEdit = !!id;

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { /* campos según entidad */ }
  });

  const { data: entityData, isLoading: isLoadingEntity } = useEntityById(isEdit ? id : null);

  useEffect(() => {
    if (isEdit && entityData) reset(entityData);
  }, [isEdit, entityData, reset]);

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateEntity.mutateAsync({ id, data: formData });
        enqueueSnackbar('Actualizado exitosamente', { variant: 'success' });
      } else {
        await createEntity.mutateAsync(formData);
        enqueueSnackbar('Creado exitosamente', { variant: 'success' });
      }
      navigate('/entities');
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  if (isEdit && isLoadingEntity) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4">{isEdit ? 'Editar' : 'Nuevo'} Entidad</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* FormInputs aquí */}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EntityForm;
```

## Paso 5: Registrar Rutas

En `src/routes/AppRoutes.jsx` ya existen las rutas para students y subjects:

```jsx
<Route path="/entities" element={<EntityList />} />
<Route path="/entities/new" element={<EntityForm />} />
<Route path="/entities/:id" element={<EntityForm />} />
```

## Paso 6: Actualizar Sidebar

En `src/components/layout/Sidebar.jsx` agregar el nuevo ítem al array `menuItems`:

```javascript
{ text: 'NuevaEntidad', icon: <NuevoIcono />, path: '/nueva-ruta' }
```

El componente usa `useLocation()` para resaltar automáticamente el ítem activo cuando `pathname === item.path`, por lo que no se requiere ninguna configuración adicional.

## Paso 7: Validaciones (Opcional)

En `src/utils/validations.js` agregar reglas de validación específicas de la entidad:

```javascript
export const entityValidationRules = {
  campo1: { required: 'Requerido', validate: (value) => ... },
  campo2: { required: 'Requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } },
};
```

## Resumen de Archivos

| # | Archivo | Acción |
|---|---------|--------|
| 1 | `src/services/[entity]Service.js` | Crear o actualizar |
| 2 | `src/features/[entities]/hooks/use[Entities].js` | Crear |
| 3 | `src/features/[entities]/[Entity]List.jsx` | Crear |
| 4 | `src/features/[entities]/[Entity]Form.jsx` | Crear |
| 5 | `src/utils/validations.js` | Actualizar (opcional) |

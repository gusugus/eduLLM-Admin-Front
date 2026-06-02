# 5. Componentes Comunes

## 5.1 Layout (`components/common/Layout.jsx`)

Estructura principal de la aplicación con AppBar fijo + Drawer lateral.

```
┌──────────────────────────────────────┐
│         AppBar (Header)              │
├──────────┬───────────────────────────┤
│          │                           │
│ Sidebar  │     Main Content          │
│ (Drawer) │     ({children})          │
│ 240px    │                           │
│          │                           │
└──────────┴───────────────────────────┘
```

**Comportamiento responsive:**
- Mobile (`< sm`): Drawer `temporary`, se abre con botón hamburguesa
- Desktop (`>= sm`): Drawer `permanent`, siempre visible
- Ancho del drawer: `240px`

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `children` | `ReactNode` | Contenido principal que se renderiza junto al drawer |

---

## 5.2 DataTable (`components/common/DataTable.jsx`)

Tabla genérica con columnas dinámicas y botones de acción.

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `columns` | `Array` | `[{ field: 'id', headerName: 'ID' }, ...]` — Cada columna puede incluir `render: (row) => <JSX>` para renderizado personalizado |
| `data` | `Array` | Array de objetos a renderizar |
| `onEdit` | `Function` | Callback con la fila completa al hacer clic en editar |
| `onDelete` | `Function` | Callback con el `id` al hacer clic en eliminar |

### Columnas predefinidas en ProfessorList:
```javascript
const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'nombreCompleto', headerName: 'Nombre' },
  { field: 'username', headerName: 'Username' },
  { field: 'estado', headerName: 'Estado' },
];
```

---

## 5.3 FormInput (`components/common/FormInput.jsx`)

Input reutilizable integrado con React Hook Form, con soporte para máscaras y validación.

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `name` | `string` | Nombre del campo (registrado en RHF) |
| `label` | `string` | Label del TextField |
| `register` | `Function` | Función `register()` de React Hook Form |
| `errors` | `Object` | Objeto `errors` de React Hook Form |
| `control` | `Object` | Control de React Hook Form (para `useWatch`) |
| `required` | `boolean` | Si el campo es requerido |
| `type` | `string` | Tipo de input (`text`, `email`, `password`, etc.) |
| `xs` | `number` | Tamaño Grid (12 = full width) |
| `mask` | `string` | Tipo de máscara (`cedula`, `numbers`, `letters`, `lettersNoSpace`, `username`) |
| `maxLength` | `number` | Límite de caracteres |
| `validation` | `Object` | Reglas de validación adicionales |
| `onBlurCustom` | `Function` | Callback adicional al perder foco |
| `helperText` | `string` | Texto de ayuda |

### Máscaras disponibles

| Máscara | Comportamiento |
|---------|---------------|
| `cedula` | Solo dígitos, máximo 10 |
| `numbers` | Solo dígitos |
| `letters` | Solo letras (incluye tildes, ñ, espacios) |
| `lettersNoSpace` | Solo letras (sin espacios) |
| `username` | Solo alfanumérico + guiones y guión bajo |

---

## 5.4 ConfirmDialog (`components/common/ConfirmDialog.jsx`)

Diálogo de confirmación para eliminar registros.

### Props
| Prop | Tipo | Descripción |
|------|------|-------------|
| `open` | `boolean` | Visibilidad del diálogo |
| `title` | `string` | Título del diálogo |
| `message` | `string` | Mensaje descriptivo |
| `onConfirm` | `Function` | Callback al confirmar |
| `onCancel` | `Function` | Callback al cancelar |

---

## 5.5 LoadingScreen (`components/common/LoadingScreen.jsx`)

Pantalla de carga con spinner y mensaje configurable.

### Props
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `message` | `string` | `'Cargando...'` | Mensaje que aparece tras el delay |
| `delay` | `number` | `500` | Milisegundos antes de mostrar el mensaje |

### Uso
```jsx
<LoadingScreen message="🔍 Verificando autenticación..." delay={300} />
```

---

## 5.6 RedirectWithDelay (`components/common/RedirectWithDelay.jsx`)

Componente de redirección con cuenta regresiva. Muestra un mensaje y redirige después de un delay.

### Props
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `to` | `string` | — | URL de destino |
| `message` | `string` | — | Mensaje a mostrar |
| `delay` | `number` | `2000` | Milisegundos antes de redirigir |

---

## 5.7 Header (`components/layout/Header.jsx`)

Barra superior dentro del AppBar. Muestra:
- Título "eduLLM Admin" (Typography h6)
- Avatar con menú desplegable con opción **Salir** (limpia localStorage y redirige a login)

---

## 5.8 Sidebar (`components/layout/Sidebar.jsx`)

Menú de navegación lateral con ListItemButtons:

| Ítem | Icono | Ruta |
|------|-------|------|
| Dashboard | `Dashboard` | `/` |
| Profesores | `People` | `/professors` |
| Estudiantes | `School` | `/students` |
| Materias | `Book` | `/subjects` |
| Asignaciones | `Assignment` | `/assignments` |

---

## 5.9 DashboardCards (`components/layout/DashboardCards.jsx`)

Tarjetas de resumen en el Dashboard. Cada tarjeta muestra un conteo.

| Tarjeta | Color | Fuente de datos |
|---------|-------|----------------|
| Profesores | `#1976d2` (azul) | `useProfessors()` |
| Estudiantes | `#2e7d32` (verde) | `useStudents()` |
| Materias | `#ed6c02` (naranja) | `useSubjects()` |

---

## 5.10 LoginForm (`components/auth/LoginForm.jsx`)

Formulario de login embebido. Llama `POST /api/auth/login` con credenciales y recibe cookie HttpOnly del gateway.

### Estados
- **Cargando**: botón muestra "Iniciando sesión..."
- **Error**: snackbar con mensaje del servidor
- **Éxito**: snackbar de bienvenida + navega a `/dashboard`

### Props
Sin props (componente autónomo con estado interno).

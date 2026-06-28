# 7. Services y Stores

## 7.1 API Service (`services/api.js`)

Instancia Axios base:

```javascript
const GATEWAY = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';

const api = axios.create({
  baseURL: `${GATEWAY}/api`,
  withCredentials: true
});
```

- **baseURL**: `{GATEWAY}/api` (ej: `http://localhost:8085/api`)
- **withCredentials**: `true` — envía cookies HttpOnly automáticamente
- **No usa** `Authorization: Bearer` headers (la autenticación es cookie-based)

### Interceptor de respuesta
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    if (error.response?.status === 403) {
      window.location.href = '/forbidden';
    }
    return Promise.reject(error);
  }
);
```

- **401** → redirige al login (sesión expirada/inválida)
- **403** → redirige a `/forbidden` (rol incorrecto o sin permisos)

## 7.2 professorService (`services/professorService.js`)

```javascript
{
  getAll:    () => GET    /professors      → res.data.data || []
  getById:   (id) => GET  /professors/:id  → res.data.data || []
  create:    (data) => POST /professors    → res.data.data || []
  update:    (id, data) => PUT /professors/:id → res.data.data || []
  delete:    (id) => DELETE /professors/:id → res.data
}
```

## 7.3 studentService (`services/studentService.js`)

Misma estructura que professorService, apuntando a `/students`.

## 7.4 subjectService (`services/subjectService.js`)

Misma estructura, apuntando a `/subjects`.

## 7.5 assignmentService (`services/assignmentService.js`)

```javascript
{
  assignProfessorToSubject: (data) => POST /assignments/professor-subject
  listProfessorSubjects:    ()      => GET  /assignments/professor-subject
  removeProfessorSubject:   (id)    => DELETE /assignments/professor-subject/:id
  assignStudentsToSubject:  (data)  => POST /assignments/student-subject
  listStudentSubjects:      ()      => GET  /assignments/student-subject
  removeStudentSubject:     (id)    => DELETE /assignments/student-subject/:id
}
```

## 7.6 Stores (Zustand)

### authStore (`stores/authStore.js`)
```javascript
useAuthStore.create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

- **Persistencia**: guarda estado en `localStorage` bajo la clave `auth-storage`
- **login**: setea token y objeto user
- **setUser**: actualiza solo el usuario (usado por `verifyAuth`)
- **logout**: limpia token y user

### uiStore (`stores/uiStore.js`)
```javascript
useUiStore.create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
```

- Estado local del sidebar (no persistido)

## 7.7 Hooks

### useAuth (`hooks/useAuth.js`)
```javascript
export const useAuth = () => {
  const { token, user, setUser, login, logout } = useAuthStore();

  const verifyAuth = useCallback(async () => {
    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8085';
    const response = await axios.get(`${GATEWAY_URL}/api/auth/verify`, {
      withCredentials: true
    });
    if (response.data?.authenticated) {
      setUser(response.data);
    }
    return response.data;
  }, [setUser]);

  return { token, user, setUser, login, logout, verifyAuth, isAuthenticated: !!user };
};
```

El `verifyAuth` retorna `{ authenticated, username, rol, idUsuario }`. El role check se hace en `AuthGate` (App.jsx), no dentro del hook.

| Retorno | Tipo | Descripción |
|---------|------|-------------|
| `token` | `string\|null` | Token JWT (para flujo legacy — no usado actualmente) |
| `user` | `object\|null` | Datos del usuario: `{ authenticated, username, rol, idUsuario }` |
| `setUser` | `Function` | Actualiza el usuario en el store |
| `login` | `Function` | Login con token + user |
| `logout` | `Function` | Limpia auth |
| `verifyAuth` | `Function` | Llama `/api/auth/verify` y setea usuario si autenticado |
| `isAuthenticated` | `boolean` | `!!user` |

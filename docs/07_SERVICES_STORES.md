# 7. Services y Stores

## 7.1 API Service (`services/api.js`)

Instancia Axios base con interceptor JWT:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // http://localhost:8002/api/v1
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

- **baseURL**: se toma de `VITE_API_URL`
- **Interceptor**: Lee token de `localStorage` y lo agrega como `Authorization: Bearer <token>`
- El token se guarda vía `authStore.login()` que usa `zustand/persist`

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

- Todos los métodos fallbackean a `[]` si hay error (`.catch(console.error)`)
- Extraen `res.data.data` del response del backend

## 7.3 studentService / subjectService

Misma estructura que professorService, apuntando a `/students` y `/subjects` respectivamente. Actualmente retornan datos vacíos porque el backend es stub.

## 7.4 Stores (Zustand)

### authStore (`stores/authStore.js`)
```javascript
useAuthStore.create(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'auth-storage' }  // clave en localStorage
  )
)
```

- **Persistencia**: guarda estado en `localStorage` bajo la clave `auth-storage`
- **login**: setea token y objeto user
- **logout**: limpia token y user

### uiStore (`stores/uiStore.js`)
```javascript
useUiStore.create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
```

- Estado local del sidebar (no persistido)
- **sidebarOpen**: controla visibilidad del drawer en mobile

## 7.5 Hooks

### useAuth (`hooks/useAuth.js`)
```javascript
export const useAuth = () => {
  const { token, user, login, logout } = useAuthStore();
  return { token, user, login, logout, isAuthenticated: !!token };
};
```
- Wrapper sobre `authStore` que agrega `isAuthenticated` computado
- Útil para componentes que necesitan saber si hay sesión activa

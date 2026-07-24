import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/domain/state/AuthContext';
import { Layout } from '@/presentation/components/Layout';
import { Dashboard } from '@/presentation/pages/Dashboard';
import { CategoriaInsumos } from '@/presentation/pages/compras/CategoriaInsumos';
import { Insumos } from '@/presentation/pages/compras/Insumos';
import { Proveedores } from '@/presentation/pages/compras/Proveedores';
import { GestionCompras } from '@/presentation/pages/compras/GestionCompras';
import { CategoriaProductos } from '@/presentation/pages/ventas/CategoriaProductos';
import { Productos } from '@/presentation/pages/ventas/Productos';
import { Clientes } from '@/presentation/pages/ventas/Clientes';
import { GestionVentas } from '@/presentation/pages/ventas/GestionVentas';
import { Roles } from '@/presentation/pages/configuracion/Roles';
import { Usuarios } from '@/presentation/pages/configuracion/Usuarios';
import { Login } from '@/presentation/pages/auth/Login';
import { ForgotPassword } from '@/presentation/pages/auth/ForgotPassword';
import { ResetPassword } from '@/presentation/pages/auth/ResetPassword';
import { ClienteLanding } from '@/presentation/pages/cliente/ClienteLanding';
import { CocineroDashboard } from '@/presentation/pages/cocinero/CocineroDashboard';
import { FichasTecnicas } from '@/presentation/pages/fichasTecnicas/FichasTecnicas';
import { GestionProduccion } from '@/presentation/pages/produccion/GestionProduccion';

/**
 * Maps permission names (as stored in the DB) to route paths.
 * A user with a given permission will have access to the corresponding route(s).
 */
const PERMISSION_ROUTE_MAP = {
  "Dashboard":             { path: "",                          element: <Dashboard /> },
  "Categoría Insumos":     { path: "compras/categoria-insumos", element: <CategoriaInsumos /> },
  "Insumos":               { path: "compras/insumos",           element: <Insumos /> },
  "Proveedores":           { path: "compras/proveedores",       element: <Proveedores /> },
  "Gestión de Compras":    { path: "compras/gestion",           element: <GestionCompras /> },
  "Categoría Productos":   { path: "ventas/categoria-productos",element: <CategoriaProductos /> },
  "Productos":             { path: "ventas/productos",          element: <Productos /> },
  "Fichas Técnicas":       { path: "ventas/fichas-tecnicas",    element: <FichasTecnicas /> },
  "Gestión de Producción": { path: "produccion/gestion",        element: <GestionProduccion /> },
  "Clientes":              { path: "ventas/clientes",           element: <Clientes /> },
  "Gestión de Ventas":     { path: "ventas/gestion-ventas",     element: <GestionVentas /> },
  "Roles":                 { path: "configuracion/roles",       element: <Roles /> },
  "Usuarios":              { path: "configuracion/usuarios",    element: <Usuarios /> },
};

export function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<ClienteLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const userRol = user?.rol?.toLowerCase();

  // ── Cliente: only landing page ──
  if (userRol === 'cliente') {
    return (
      <Routes>
        <Route path="/" element={<ClienteLanding />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // ── Cocinero: hardcoded limited view ──
  if (userRol === 'cocinero') {
    return (
      <Routes>
        <Route path="/" element={<CocineroDashboard />} />
        <Route path="/fichas-tecnicas" element={<FichasTecnicas readOnly />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // ── Administrador: full access to everything ──
  if (userRol === 'administrador') {
    return (
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="compras/categoria-insumos" element={<CategoriaInsumos />} />
          <Route path="compras/insumos" element={<Insumos />} />
          <Route path="compras/proveedores" element={<Proveedores />} />
          <Route path="compras/gestion" element={<GestionCompras />} />
          <Route path="produccion/gestion" element={<GestionProduccion />} />
          <Route path="ventas/categoria-productos" element={<CategoriaProductos />} />
          <Route path="ventas/productos" element={<Productos />} />
          <Route path="ventas/clientes" element={<Clientes />} />
          <Route path="ventas/gestion-ventas" element={<GestionVentas />} />
          <Route path="ventas/fichas-tecnicas" element={<FichasTecnicas />} />
          <Route path="configuracion/roles" element={<Roles />} />
          <Route path="configuracion/usuarios" element={<Usuarios />} />
        </Route>
      </Routes>
    );
  }

  // ── Any other role (e.g. Vendedor): permission-based access ──
  const userPermisos = user?.permisos || [];

  // Build the allowed routes from the user's permissions
  const allowedRoutes = [];
  for (const perm of userPermisos) {
    const routeConfig = PERMISSION_ROUTE_MAP[perm];
    if (routeConfig) {
      allowedRoutes.push(routeConfig);
    }
  }

  // If user has Dashboard permission, use it as index; otherwise show first allowed route
  const hasDashboard = userPermisos.includes("Dashboard");

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Layout />}>
        {hasDashboard && <Route index element={<Dashboard />} />}
        {!hasDashboard && allowedRoutes.length > 0 && (
          <Route index element={<Navigate to={`/${allowedRoutes[0].path}`} replace />} />
        )}
        {allowedRoutes.map((route) => (
          route.path !== "" && <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

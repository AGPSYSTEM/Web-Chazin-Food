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

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    const userRol = user.rol?.toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(userRol)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

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

  if (userRol === 'cliente') {
    return (
      <Routes>
        <Route path="/" element={<ClienteLanding />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

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

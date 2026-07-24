import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '@/domain/state/CartContext';
import { AuthProvider } from '@/domain/state/AuthContext';
import { ToastProvider } from '@/domain/state/ToastContext';
import { ConfirmProvider } from '@/domain/state/ConfirmContext';
import { AppRoutes } from '@/application/routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

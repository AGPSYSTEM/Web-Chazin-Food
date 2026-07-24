import { useToast } from '@/domain/state/ToastContext';
import { useConfirm } from '@/domain/state/ConfirmContext';

/**
 * Hook unificado para notificaciones y confirmaciones
 * Reemplaza completamente las funciones de alerts.ts (SweetAlert2)
 */
export function useNotifications() {
  const toast = useToast();
  const { confirm } = useConfirm();

  return {
    // Notificaciones Toast
    success: (title, message) => {
      toast.success(title, message);
    },

    error: (title, message) => {
      toast.error(title, message);
    },

    warning: (title, message) => {
      toast.warning(title, message);
    },

    info: (title, message) => {
      toast.info(title, message);
    },

    // Confirmaciones con modales
    confirmDelete: async (title, message) => {
      return await confirm({
        type: 'danger',
        title,
        message,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
      });
    },

    confirmAction: async (title, message, confirmText = 'Confirmar') => {
      return await confirm({
        type: 'warning',
        title,
        message,
        confirmText,
        cancelText: 'Cancelar',
      });
    },

    confirmLogout: async () => {
      return await confirm({
        type: 'warning',
        title: '¿Cerrar sesión?',
        message: '¿Estás seguro de que deseas salir del sistema?',
        confirmText: 'Sí, salir',
        cancelText: 'Cancelar',
      });
    },
  };
}

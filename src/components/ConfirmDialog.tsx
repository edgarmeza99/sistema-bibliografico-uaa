import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Manejar la tecla Escape y focus inicial
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir el scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      // Focus en el botón de cancelar
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: "⚠️",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
      focusRing: "focus:ring-red-500",
    },
    warning: {
      icon: "⚠️",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      focusRing: "focus:ring-yellow-500",
    },
    info: {
      icon: "ℹ️",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      focusRing: "focus:ring-blue-500",
    },
  };

  const styles = typeStyles[type];

  const handleBackdropClick = (e: React.MouseEvent) => {
    console.log("Backdrop clicked");
    if (e.target === e.currentTarget) {
      console.log("Calling onCancel from backdrop");
      onCancel();
    }
  };

  const handleConfirm = () => {
    console.log("Confirm button clicked");
    onConfirm();
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-400 bg-opacity-100"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div
              className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${styles.iconBg} mr-3`}
            >
              <span className="text-lg">{styles.icon}</span>
            </div>
            <h3 id="dialog-title" className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium text-white ${styles.buttonBg} border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.focusRing} transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

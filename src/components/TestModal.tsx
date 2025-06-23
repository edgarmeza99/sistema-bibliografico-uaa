import React from 'react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const TestModal: React.FC<TestModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
        <p className="mb-6">¿Estás seguro de que deseas eliminar este elemento?</p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestModal;

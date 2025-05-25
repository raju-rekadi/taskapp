import React from 'react';

const Modal = ({ children, onClose }) => {
  const handleOverlayClick = (e) => {
    // Close only if the click is directly on the overlay (not a child element)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <button 
            onClick={onClose}
            className="ml-auto block text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
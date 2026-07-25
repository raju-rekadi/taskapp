import React, { useEffect } from 'react';

const Modal = ({ children, onClose }) => {
  // Close on Escape, and stop the page behind the modal from scrolling.
  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
    >
      {/* Bottom sheet on mobile, centred dialog from sm up */}
      <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
          <h2 className="text-sm font-semibold text-gray-800">How CGPA is calculated</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Drag affordance for the mobile sheet */}
        <div className="mx-auto -mt-1 mb-1 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

import React, { useEffect } from 'react';

/**
 * Reusable presentation-only Modal component.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the modal visibility
 * @param {function} props.onClose - Function callback triggered on closing
 * @param {string} [props.title] - Modal header title
 * @param {string} [props.size='md'] - Modal size width: 'sm', 'md', 'lg', 'xl'
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children
}) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-content modal-${size}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
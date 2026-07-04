import React from 'react';

/**
 * Reusable presentation-only Input component.
 *
 * @param {object} props
 * @param {string} [props.label] - Label text above the input field
 * @param {string} [props.error] - Error message to show below the input field
 * @param {React.ReactNode} [props.icon] - Icon component to display on the left of input
 * @param {string} [props.className=''] - Additional custom CSS class names
 */
export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const containerClass = [
    'input-container',
    error ? 'has-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon-left">{icon}</span>}
        <input
          id={inputId}
          className={`input-field ${icon ? 'input-field-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
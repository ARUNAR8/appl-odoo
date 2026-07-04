import React from 'react';

/**
 * Reusable presentation-only Button component.
 *
 * @param {object} props
 * @param {string} [props.variant='primary'] - 'primary', 'secondary', 'outline', 'danger', 'success', 'ghost'
 * @param {string} [props.size='md'] - 'sm', 'md', 'lg'
 * @param {boolean} [props.loading=false] - Display a loading spinner
 * @param {React.ReactNode} [props.icon] - Icon component to display before text
 * @param {string} [props.className=''] - Additional custom CSS class names
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) {
  const buttonClass = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {!loading && icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
}
import React from 'react';

/**
 * Reusable presentation-only Card component.
 *
 * @param {object} props
 * @param {string} [props.title] - Card header title
 * @param {string} [props.subtitle] - Card header subtitle
 * @param {React.ReactNode} [props.action] - Component or action button to place on the top-right
 * @param {string} [props.className=''] - Additional custom CSS classes
 */
export default function Card({
  title,
  subtitle,
  action,
  children,
  className = ''
}) {
  const hasHeader = title || subtitle || action;

  return (
    <div className={`card ${className}`}>
      {hasHeader && (
        <div className="card-header">
          <div className="card-title-group">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
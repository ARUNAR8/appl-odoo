import React from 'react';

/**
 * Reusable presentation-only Loader spinner.
 *
 * @param {object} props
 * @param {boolean} [props.fullScreen=false] - Center the loader across the full viewport
 * @param {string} [props.className=''] - Additional custom CSS classes
 */
export default function Loader({ fullScreen = false, className = '' }) {
  const containerClass = [
    'loader-wrapper',
    fullScreen ? 'loader-fullscreen' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      <div className="loader-pulse" />
    </div>
  );
}
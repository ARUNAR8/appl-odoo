import React from 'react';

/**
 * Reusable presentation-only Navbar layout component.
 *
 * @param {object} props
 * @param {string} props.title - Current dashboard page header title
 * @param {number} [props.notificationsCount=0] - Number of unread notifications to badge
 * @param {function} props.onToggleSidebar - Triggered to slide open/close the sidebar (mobile drawer)
 * @param {function} props.onNotificationsClick - Callback triggered on notification bell icon clicked
 */
export default function Navbar({
  title = 'Dashboard',
  notificationsCount = 0,
  onToggleSidebar,
  onNotificationsClick,
  theme,
  onToggleTheme
}) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="navbar-toggle" 
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h2 className="navbar-title" style={{ margin: 0 }}>{title}</h2>
      </div>

      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Theme Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'background var(--transition-fast)'
            }}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.975-8.975h-2.25M4.275 12h-2.25m17.067-7.067l-1.591 1.591M6.82 17.18l-1.591 1.591m12.937 0l-1.591-1.591M6.82 6.82L5.229 5.229M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
              </svg>
            )}
          </button>
        )}

        <button 
          className="navbar-notification" 
          onClick={onNotificationsClick}
          aria-label="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {notificationsCount > 0 && (
            <span className="navbar-badge">{notificationsCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
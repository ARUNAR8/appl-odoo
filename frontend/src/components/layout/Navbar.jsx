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
  onNotificationsClick
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

      <div className="navbar-right">
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
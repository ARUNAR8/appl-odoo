import React from 'react';

/**
 * Reusable presentation-only Sidebar layout component.
 *
 * @param {object} props
 * @param {string} props.logoSrc - Source URL of the company logo image
 * @param {string} [props.logoText='HRMS'] - Text next to the logo image
 * @param {Array<{path: string, name: string, icon: React.ReactNode}>} props.menuItems - Navigation links
 * @param {string} props.activePath - Currently selected route path
 * @param {function} props.onItemClick - Callback trigger on item clicked
 * @param {object} props.user - Logged in user info { name, role }
 * @param {function} props.onLogout - Callback trigger on logout click
 * @param {boolean} [props.isOpen=false] - Controls sidebar slider on mobile/tablets
 * @param {function} props.onClose - Callback triggered on closing sidebar overlay on mobile
 */
export default function Sidebar({
  logoSrc,
  logoText = 'HRMS',
  menuItems = [],
  activePath,
  onItemClick,
  user,
  onLogout,
  isOpen = false,
  onClose
}) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <>
      {/* Mobile Overlay backdrop */}
      {isOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 99, background: 'rgba(0, 0, 0, 0.4)' }} 
          onClick={onClose} 
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          {logoSrc && <img src={logoSrc} alt={logoText} />}
          <span className="sidebar-logo-text">{logoText}</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <div
                key={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (onItemClick) onItemClick(item.path);
                  if (onClose) onClose(); // close mobile drawer
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user ? getInitials(user.name) : 'U'}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-username">{user ? user.name : 'Guest User'}</span>
              <span className="sidebar-userrole">{user ? user.role : 'Guest'}</span>
            </div>
          </div>
          <button 
            className="sidebar-logout" 
            onClick={onLogout} 
            title="Log Out"
            aria-label="Log Out"
            style={{ background: 'none', border: 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
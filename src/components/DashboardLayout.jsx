import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to determine if a link is active
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    // For exact matches, we need to be more specific to avoid conflicts
    if (path === '/enquiry') {
      // Only match /enquiry exactly, not /enquiry-dashboard
      return location.pathname === '/enquiry';
    }
    if (path === '/enquiry-dashboard') {
      // Only match /enquiry-dashboard exactly
      return location.pathname === '/enquiry-dashboard';
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div 
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} 
        id="sidebar-wrapper"
      >
        <div className="sidebar-heading border-bottom bg-light">
          <Link to="/">
            <img 
              src="\images\logo/Admin-Login-Page.png" 
              className="sidebar-logo"
              alt="Logo" 
            />
          </Link>
        </div>

        <div className="list-group list-group-flush sidebar-menu p-3">
          <Link className="logout-item" to="/">
            <div className={`logout mt-0 ${isActiveLink('/') ? 'active' : ''}`}>
              <img src="/images/icons/dashboard.png" width="20" height="20" alt="Dashboard" className="menu-icon" />
              <span>Dashboard</span>
            </div>
          </Link>

          <Link className="logout-item" to="/userlist">
            <div className={`logout ${isActiveLink('/userlist') ? 'active' : ''}`}>
              <img src="/images/icons/userlist.png" width="20" height="20" alt="User List" className="menu-icon" />
              <span>User List</span>
            </div>
          </Link>

          <Link className="logout-item" to="/enquiry">
            <div className={`logout ${isActiveLink('/enquiry') ? 'active' : ''}`}>
              <img src="/images/icons/help.png" width="20" height="20" alt="Enquiry" className="menu-icon" />
              <span>Enquiry</span>
            </div>
          </Link>

          <Link className="logout-item" to="/enquiry-dashboard">
            <div className={`logout ${isActiveLink('/enquiry-dashboard') ? 'active' : ''}`}>
              <img src="/images/icons/Enquirydashboard.png" width="20" height="20" alt="Enquiry Dashboard" className="menu-icon" />
              <span>Enquiry Dashboard</span>
            </div>
          </Link>

          <Link className="logout-item" to="/misreport">
            <div className={`logout ${isActiveLink('/misreport') ? 'active' : ''}`}>
              <img src="/images/icons/report.png" width="20" height="20" alt="MIS Report" className="menu-icon" />
              <span>MIS Report</span>
            </div>
          </Link>

          <Link className="logout-item" to="/">
            <div className="logout">
              <img src="/images/icons/logout.png" width="20" height="20" alt="Logout" className="menu-icon" />
              <span>LogOut</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Page Content */}
      <div id="page-content-wrapper">
        {/* Top Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom dashboard-navbar">
          <div className="container-fluid">
            <button className="btn sidebar-toggle-btn" id="sidebarToggle" onClick={toggleSidebar}>
              <img src="/images/bars.svg" alt="Toggle Sidebar" width="20" height="20" />
            </button>
            <h2 className='admin-title'>Welcome to Tax Ustaad Admin Dashboard</h2>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarSupportedContent" 
              aria-controls="navbarSupportedContent" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="navbarDropdownMenuLink" 
                    role="button" 
                    onClick={toggleDropdown}
                    aria-haspopup="true" 
                    aria-expanded={dropdownOpen}
                  >
                    <img 
                      src="/images/avatar.webp" 
                      width="40" 
                      height="40" 
                      className="rounded-circle user-avatar"
                      alt="User"
                    />
                  </a>
                  <div 
                    className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} 
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <div className="subscription-icons d-flex">
                      <img src="/images/setting.svg" className="add-icons" alt="Settings" width="20" height="20" />
                      <Link className="dropdown-item" to="/login">Login</Link>
                    </div>
                    <div className="subscription-icons d-flex">
                      <img src="/images/log-out.svg" className="add-icons" alt="Logout" width="20" height="20" />
                      <a className="dropdown-item" href="#">Logout</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container-fluid dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
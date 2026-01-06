import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";


const DashboardLayout = () => { 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [subcategoryMenuOpen, setSubcategoryMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shippingMenuOpen, setShippingMenuOpen] = useState(false);
  const [ordersMenuOpen, setOrdersMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const location = useLocation();

  // Responsive sidebar
  // useEffect(() => {
  //   const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  //}, []);

    
 useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  handleResize(); // 👈 important on first load
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const toggleSidebar = () => {
  setSidebarOpen(prev => !prev);
};



  // Toggle functions
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleProductMenu = () => setProductMenuOpen(!productMenuOpen);
  const toggleCategoryMenu= () => setCategoryMenuOpen(!categoryMenuOpen);
  const toggleSubcategoryMenu= () => setSubcategoryMenuOpen(!subcategoryMenuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleShippingMenu = () => setShippingMenuOpen(!shippingMenuOpen);
  const toggleOrdersMenu = () => setOrdersMenuOpen(!ordersMenuOpen);
  const toggleNotificationMenu = () => setNotificationMenuOpen(!notificationMenuOpen);

  // Active link checker
 // const isActiveLink = (path) => location.pathname.includes(path);
  const isActiveLink = (path) => location.pathname === path;


  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
        <div className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>

        <div className="sidebar-heading border-bottom bg-light">
          <Link to="/">
            <img
              src="\images\logo\Logo_K.jpg"
              className="sidebar-logo"
              alt="Logo"
              style={{
                width: '265px',
                height:'90px',
                background: '#FEC200',
                transform: 'translateX(-30px)',

              }}
            />
          </Link>
        </div>

        <div
          className="list-group list-group-flush sidebar-menu p-3"
          style={{ background: '#FEC200', height: '1000px' }}
        >
          {/* Dashboard */}
          <Link className="logout-item" to="/">
            <div className={`logout mt-0 ${isActiveLink('/dashboard') ? 'active' : ''}`}>
              <img src="/images/icons/dashboard.png" width="20" height="20" alt="Dashboard" className="menu-icon" />
              <span>Dashboard</span>
            </div>
          </Link>

          {/* ✅ Products Section */}
          <div className="logout-item" onClick={toggleProductMenu} style={{ cursor: 'pointer' }}>
            <div className="logout d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/images/icons/checklist-product.png" width="26" height="28" alt="Product" className="menu-icon" />
                <span>Products</span>
              </div>
              {productMenuOpen ? <FiMinus /> : <FiPlus/>}
            </div>
          </div>

          {productMenuOpen && (
            <div className="ms-4 mt-1">
              <Link className="logout-item" to="/product-list">
                <div className={`logout ${isActiveLink('/product-list') ? 'active' : ''}`}  >
                  <span>Product List</span>
                </div>
              </Link>

              <Link className="logout-item" to="/product-create">
                <div className={`logout ${isActiveLink('/product-create') ? 'active' : ''}`}>
                  <span>Products Add</span>
                </div>
              </Link>
              

              {/* <Link className="logout-item" to="/product-discount-list">
                <div className={`logout ${isActiveLink('/product-discount-list') ? 'active' : ''}`}>
                  <span>Product Discount List</span>
                </div>
              </Link>
              <Link className="logout-item" to="/product-discount">
                <div className={`logout ${isActiveLink('/product-discount') ? 'active' : ''}`}>
                  <span>Products Discount Add</span>
                </div>
              </Link>  */}
             
            </div>
          )}

           {/* ✅ category Section */}
          <div className="logout-item" onClick={toggleCategoryMenu} style={{ cursor: 'pointer' }}>
            <div className="logout d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/images/icons/checklist-product.png" width="26" height="28" alt="Product" className="menu-icon" />
                <span>Category</span>
              </div>
              {categoryMenuOpen ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {categoryMenuOpen && (
            <div className="ms-4 mt-1">
              
              
              <Link className="logout-item" to="/category-list">
                <div className={`logout ${isActiveLink('/category-list') ? 'active' : ''}`}>
                  <span>Category List</span>
                </div>
              </Link>   

              <Link className="logout-item" to="/manage-categories">
                <div className={`logout ${isActiveLink('/manage-categories') ? 'active' : ''}`}>
                  <span>Category Add</span>
                </div>
              </Link>   

              
            </div>

           
          )}

           {/* ✅ subcategory Section */}
          <div className="logout-item" onClick={toggleSubcategoryMenu} style={{ cursor: 'pointer' }}>
            <div className="logout d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/images/icons/checklist-product.png" width="26" height="28" alt="Product" className="menu-icon" />
                <span>Sub-Category</span>
              </div>
              {subcategoryMenuOpen ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {subcategoryMenuOpen && (
            <div className="ms-4 mt-1">
              
              
              <Link className="logout-item" to="/subcategories-list">
                <div className={`logout ${isActiveLink('/subcategories-list') ? 'active' : ''}`}>
                  <span>Sub Category List</span>
                </div>
              </Link>   

              <Link className="logout-item" to="/manage-subcategories">
                <div className={`logout ${isActiveLink('/manage-subcategories') ? 'active' : ''}`}>
                  <span>Sub-Category Add</span>
                </div>
              </Link>   

               
            </div>

           
          )}

          {/* ✅ Users Section */}
          <div className="logout-item" onClick={toggleUserMenu} style={{ cursor: 'pointer' }}>
            <div className="logout d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/images/icons/userlist.png" width="24" height="24" alt="Users" className="menu-icon" />
                <span>Users</span>
              </div>
              {userMenuOpen ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {userMenuOpen && (
            <div className="ms-4 mt-1">
              <Link className="logout-item" to="/userlist">
                <div className={`logout ${isActiveLink('/userlist') ? 'active' : ''}`}>
                  <span> User List</span>
                </div>
              </Link>
              <Link className="logout-item" to="/user-discount-list">
                <div className={`logout ${isActiveLink('/user-discount-list') ? 'active' : ''}`}>
                  <span> User Discount List</span>
                </div>
              </Link>
              <Link className="logout-item" to="/user-discount">
                <div className={`logout ${isActiveLink('/user-discount') ? 'active' : ''}`}>
                  <span> User Discount Add</span>
                </div>
              </Link>
             
            </div>
          )}

          {/* ✅ Shipping Section */}
          <div className="logout-item" onClick={toggleShippingMenu} style={{ cursor: 'pointer' }}>
            <div className="logout d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/images/icons/delivery-charge-icon.png" width="20" height="40" alt="Shipping" className="menu-icon" />
                <span>Shipping</span>
              </div>
              {shippingMenuOpen ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {shippingMenuOpen && (
            <div className="ms-4 mt-1">
              <Link className="logout-item" to="/shipping-charges-list">
                <div className={`logout ${isActiveLink('/shipping-charges-list') ? 'active' : ''}`}>
                  <span> Shipping Charges List</span>
                </div>
              </Link>
              <Link className="logout-item" to="/shipping-charges">
                <div className={`logout ${isActiveLink('/shipping-charges') ? 'active' : ''}`}>
                  <span>Shipping Charges Add</span>
                </div>
              </Link>
             
            </div>
          )}

          {/* ✅ Orders Section */}
          <div className="logout-item" onClick={toggleOrdersMenu} style={{ cursor: 'pointer' }}>
            <div className="logout d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/images/icons/shopping-discount.png" width="24" height="24" alt="Orders" className="menu-icon" />
                <span>Orders</span>
              </div>
              {ordersMenuOpen ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {ordersMenuOpen && (
            <div className="ms-4 mt-1">
              <Link className="logout-item" to="/orders-list">
                <div className={`logout ${isActiveLink('/orders-list') ? 'active' : ''}`}>
                  <span>Orders List</span>
                </div>
              </Link>
              {/* <Link className="logout-item" to="/order-details">
                <div className={`logout ${isActiveLink('/order-details') ? 'active' : ''}`}>
                  <span>Order Details</span>
                </div>
              </Link> */}
            </div>
          )}

          {/* ✅ Notifications Section */}
          <div className="logout-item" onClick={toggleNotificationMenu} style={{ cursor: 'pointer' }}>
            <div className="logout d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img src="/images/icons/user-discount.png" width="24" height="24" alt="Notification" className="menu-icon" />
                <span>Notifications</span>
              </div>
              {notificationMenuOpen ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {notificationMenuOpen && (
            <div className="ms-4 mt-1">
              <Link className="logout-item" to="/notification-list">
                <div className={`logout ${isActiveLink('/notification-list') ? 'active' : ''}`}>
                  <span>Notification Template List</span>
                </div>
              </Link>
              <Link className="logout-item" to="/notification-template-create">
                <div className={`logout ${isActiveLink('/notification-template-create') ? 'active' : ''}`}>
                  <span> Notification Template Add</span>
                </div>
              </Link>
              
            </div>
          )}

          {/* Other existing menu items */}
          {/* <Link className="logout-item" to="/enquiry-dashboard">
            <div className={`logout ${isActiveLink('/enquiry-dashboard') ? 'active' : ''}`}>
              <img src="/images/icons/Enquirydashboard.png" width="20" height="20" alt="Enquiry Dashboard" className="menu-icon" />
              <span>Products Dashboard</span>
            </div>
          </Link>

          <Link className="logout-item" to="/misreport">
            <div className={`logout ${isActiveLink('/misreport') ? 'active' : ''}`}>
              <img src="/images/icons/report.png" width="20" height="20" alt="MIS Report" className="menu-icon" />
              <span>MIS Report</span>
            </div>
          </Link> */}

          <Link className="logout-item" to="/">
            <div className="logout">
              <img src="/images/icons/logout.png" width="20" height="20" alt="Logout" className="menu-icon" />
              <span>LogOut</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Top Navbar + Page Content */}
    <div
  id="page-content-wrapper"
  className={sidebarOpen ? "sidebar-open" : "sidebar-closed"}
>

        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom dashboard-navbar">
          <div className="container-fluid">
            <button className="btn sidebar-toggle-btn" id="sidebarToggle" onClick={toggleSidebar}>
              <img src="/images/bars.svg" alt="Toggle Sidebar" width="20" height="20" />
            </button>
            <h2 className="admin-title" style={{ marginTop: '20px', marginBottom: '20px',color:'black' }}>
              Welcome to Kaushlya Miniatures eCommerce Admin Dashboard
            </h2>
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
                    <img src="/images/avatar.webp" width="40" height="40" className="rounded-circle user-avatar" alt="User" />
                  </a>
                  <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
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

        <div className="container-fluid dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

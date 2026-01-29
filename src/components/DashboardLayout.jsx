import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";
import api from "../api/axiosInstance";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🔥 ONE STATE TO RULE ALL MENUS
  const [menus, setMenus] = useState({
    product: false,
    category: false,
    subcategory: false,
    user: false,
    shipping: false,
    orders: false,
  });

  /* ---------------- Responsive Sidebar ---------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- Auto-open menu based on route ---------------- */
  useEffect(() => {
    if (location.pathname.startsWith("/product")) {
      openOnlyMenu("product");
    } else if (
      location.pathname.startsWith("/category") ||
      location.pathname.startsWith("/manage-categories")
    ) {
      openOnlyMenu("category");
    } else if (
      location.pathname.startsWith("/subcategories") ||
      location.pathname.startsWith("/manage-subcategories")
    ) {
      openOnlyMenu("subcategory");
    } else if (location.pathname.startsWith("/user-list")) {
      openOnlyMenu("user");
    } else if (location.pathname.startsWith("/shipping")) {
      openOnlyMenu("shipping");
    } else if (location.pathname.startsWith("/orders")) {
      openOnlyMenu("orders");
    }
  }, [location.pathname]);

  /* ---------------- Helpers ---------------- */
  const toggleSidebar = () => setSidebarOpen((p) => !p);
  const toggleDropdown = () => setDropdownOpen((p) => !p);

  const toggleMenu = (menu) => {
    setMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const openOnlyMenu = (menu) => {
    setMenus({
      product: false,
      category: false,
      subcategory: false,
      user: false,
      shipping: false,
      orders: false,
      [menu]: true,
    });
  };

  const isActiveLink = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await api.post("/Auth/logout");
    } catch {
      console.warn("Logout API failed");
    } finally {
      localStorage.removeItem("auth");
      navigate("/", { replace: true });
    }
  };

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
                width: "265px",
                height: "90px",
                background: "#FEC200",
                transform: "translateX(-30px)",
              }}
            />
          </Link>
        </div>
        <div
          className="sidebar-menu p-3"
          style={{
            background: "#FEC200",
            maxHeight: "100%",
            overflowY: "auto",
          }}
        >
          {/* Dashboard */}
          <Link to="/dashboard" className="logout-item">
            <div
              className={`logout ${isActiveLink("/dashboard") ? "active" : ""}`}
            >
              <span>Dashboard</span>
            </div>
          </Link>

          {/* Products */}
          <div className="logout-item" onClick={() => toggleMenu("product")}>
            <div className="logout d-flex justify-content-between">
              <span>Products</span>
              {menus.product ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {menus.product && (
            <div className="">
              <Link
                to="/product-list"
                className="logout-item"
                onClick={() => openOnlyMenu("product")}
              >
                <div
                  className={`logout ${isActiveLink("/product-list") ? "active" : ""}`}
                  style={{ background: "rgb(229 181 161)" }}
                >
                  Product List
                </div>
              </Link>

              <Link
                to="/product-create"
                className="logout-item"
                onClick={() => openOnlyMenu("product")}
              >
                <div
                  className={`logout ${isActiveLink("/product-create") ? "active" : ""}`}
                  style={{ background: "rgb(229 181 161)" }}
                >
                  Product Add
                </div>
              </Link>
            </div>
          )}

          {/* Category */}
          <div className="logout-item" onClick={() => toggleMenu("category")}>
            <div className="logout d-flex justify-content-between">
              <span>Category</span>
              {menus.category ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {menus.category && (
            <div className="">
              <Link
                to="/category-list"
                className="logout-item"
                onClick={() => openOnlyMenu("category")}
              >
                <div
                  className={`logout ${isActiveLink("/category-list") ? "active" : ""}`}
                  style={{ background: "rgb(229 181 161)" }}
                >
                  Category List
                </div>
              </Link>

              <Link
                to="/manage-categories"
                className="logout-item"
                onClick={() => openOnlyMenu("category")}
              >
                <div
                  className={`logout ${isActiveLink("/manage-categories") ? "active" : ""}`}
                  style={{ background: "rgb(229 181 161)" }}
                >
                  Category Add
                </div>
              </Link>
            </div>
          )}

          {/* Sub Category */}
          <div
            className="logout-item"
            onClick={() => toggleMenu("subcategory")}
          >
            <div className="logout d-flex justify-content-between">
              <span>Sub Category</span>
              {menus.subcategory ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {menus.subcategory && (
            <div className="">
              <Link
                to="/subcategories-list"
                className="logout-item"
                onClick={() => openOnlyMenu("subcategory")}
              >
                <div
                  className={`logout ${
                    isActiveLink("/subcategories-list") ? "active" : ""
                  }`}
                   style={{ background: "rgb(229 181 161)" }}
                >
                  Sub Category List
                </div>
              </Link>

              <Link
                to="/manage-subcategories"
                className="logout-item"
                onClick={() => openOnlyMenu("subcategory")}
              >
                <div
                  className={`logout ${
                    isActiveLink("/manage-subcategories") ? "active" : ""
                  }`}
                   style={{ background: "rgb(229 181 161)" }}
                >
                  Sub-Category Add
                </div>
              </Link>
            </div>
          )}

          {/* Users */}
          <div className="logout-item" onClick={() => toggleMenu("user")}>
            <div className="logout d-flex justify-content-between">
              <span>Users</span>
              {menus.user ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {menus.user && (
            <div className="">
              <Link
                to="/userlist"
                className="logout-item"
                onClick={() => openOnlyMenu("user")}
              >
                <div
                  className={`logout ${isActiveLink("/userList") ? "active" : ""}`}
                  style={{ background: "rgb(229 181 161)" }}
                >
                  User List
                </div>
              </Link>
              <Link
                to="/user-discount-list"
                className="logout-item"
                onClick={() => openOnlyMenu("user")}
              >
                <div
                  className={`logout ${isActiveLink("/user-discount-list") ? "active" : ""}`}
                  style={{ background: "rgb(229 181 161)" }}
                >
                  User Discount List
                </div>
              </Link>
              <Link
                to="/user-discount"
                className="logout-item"
                onClick={() => openOnlyMenu("user")}
              >
                <div
                  className={`logout ${isActiveLink("/user-discount") ? "active" : ""}`}
                  style={{ background: "rgb(229 181 161)" }}
                >
                  Add User Discount
                </div>
              </Link>
            </div>
          )}

          {/* Shipping */}
          <div className="logout-item" onClick={() => toggleMenu("shipping")}>
            <div className="logout d-flex justify-content-between">
              <span>Shipping</span>
              {menus.shipping ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {menus.shipping && (
            <div className="">
              <Link
                to="/shipping-charges-list"
                className="logout-item"
                onClick={() => openOnlyMenu("shipping")}
              >
                <div
                  className={`logout ${isActiveLink("/shipping-charges-list") ? "active" : ""}`}
                   style={{ background: "rgb(229 181 161)" }}
                >
                  Shipping Charges List
                </div>
              </Link>
              <Link
                to="/shipping-charges"
                className="logout-item"
                onClick={() => openOnlyMenu("shipping")}
              >
                <div className={`logout ${isActiveLink("/dashboard") ? "active" : ""}`}
                 style={{ background: "rgb(229 181 161)" }} 
                >Shipping Charges Add</div>
              </Link>
            </div>
          )}

          {/* Orders */}
          <div className="logout-item" onClick={() => toggleMenu("orders")}>
            <div className="logout d-flex justify-content-between">
              <span>Orders</span>
              {menus.orders ? <FiMinus /> : <FiPlus />}
            </div>
          </div>

          {menus.orders && (
            <div className="">
              <Link
                to="/orders-list"
                className="logout-item"
                onClick={() => openOnlyMenu("orders")}
              >
                <div className={`logout ${isActiveLink("/dashboard") ? "active" : ""}`}
                 style={{ background: "rgb(229 181 161)" }}>Orders List</div>
              </Link>
            </div>
          )}

          {/* Logout */}
          <div className="logout-item" onClick={handleLogout}>
            <div className="logout">Logout</div>
          </div>
        </div>
      </div>

      {/* Top Navbar + Page Content */}
      <div
        id="page-content-wrapper"
        className={sidebarOpen ? "sidebar-open" : "sidebar-closed"}
      >
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom dashboard-navbar">
          <div className="container-fluid">
            <button
              className="btn sidebar-toggle-btn"
              id="sidebarToggle"
              onClick={toggleSidebar}
            >
              {/* <img src="/images/bars.svg" alt="Toggle Sidebar" width="20" height="20" /> */}
            </button>
            <h2
              className="admin-title"
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                color: "black",
              }}
            >
              Welcome to Kaushlya Miniatures eCommerce Admin Dashboard
            </h2>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
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
                    className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
                    aria-labelledby="navbarDropdownMenuLink"
                  >
                    <div className="subscription-icons d-flex">
                      <img
                        src="/images/setting.svg"
                        className="add-icons"
                        alt="Settings"
                        width="20"
                        height="20"
                      />
                      <Link className="dropdown-item" to="/">
                        Login
                      </Link>
                    </div>
                    <div
                      className="subscription-icons d-flex"
                      onClick={handleLogout}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src="/images/log-out.svg"
                        className="add-icons"
                        alt="Logout"
                        width="20"
                        height="20"
                      />
                      <span className="dropdown-item">Logout</span>
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

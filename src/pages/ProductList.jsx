// src/pages/ProductList.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaTelegramPlane,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
} from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import api from "../api/axiosInstance";





const ProductList = () => {
  const navigate = useNavigate();

  // --- paging / filters / sorting ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const pageSizeOptions = [10, 15, 20, 25, 30, "All"];


  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // --- data ---
  const [products, setProducts] = useState([]); // raw server items
  const [mappedRows, setMappedRows] = useState([]); // mapped to design B fields
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

  // --- UI bits ---
  const [loading, setLoading] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    productId: true,
    productName: true,
    price: true,
    category: true,
    subCategory: true,
    createdAt: true,
  });

  const [copiedField, setCopiedField] = useState({ id: null, field: null });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusChoice, setStatusChoice] = useState(null);

  // --- protected ids as in Design B (keeps behavior) ---
  const protectedProductIds = [1,2];
  const [activeStatus, setActiveStatus] = useState({}); // local toggle snapshot (optional)

  // --- fetch categories once ---
  useEffect(() => {
    let mounted = true;
    api
      .get("/Category")
      .then((res) => {
        if (!mounted) return;
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.log("Category Fetch Error:", err));
    return () => (mounted = false);
  }, []);

  // --- fetch products from API (server-side paging/search/sort) ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || null,
        page,
        pageSize,
        fromDate: fromDate || null,
        toDate: toDate || null,
        sortKey: sortConfig.key,
        sortDir: sortConfig.direction,
      };

      const res = await api.get("/Product", { params });
      // Expect response: { total, page, pageSize, items }
      const data = res.data || {};
      const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
      setProducts(items);
      // map to design-B friendly rows (flat mapping)
      const rows = items.map((p) => ({
        id: p.product_id,
        productId: p.product_id,
        productName: p.product_name,
        // prefer discounted price if available; fallback to actual price
        price: p.product_discounted_price ?? p.product_actual_price ?? null,
        product_actual_price: p.product_actual_price,
        product_discounted_price: p.product_discounted_price,
        category: p.category_name ?? p.category ?? "-",
        subCategory: p.subcategory_name ?? p.subcategory ?? "-",
        createdAt: p.prdct_CrtdAt ?? p.createdAt ?? "-",
        is_active: typeof p.is_active === "boolean" ? p.is_active : !!p.isActive,
        raw: p,
      }));
      setMappedRows(rows);

      // totals / pageSize from server if provided
      setTotal(typeof data.total === "number" ? data.total : rows.length);
      if (data.pageSize) setPageSize(data.pageSize);
    } catch (err) {
      console.error("Product Fetch Error:", err);
      setProducts([]);
      setMappedRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // initial + dependency fetch
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchTerm, fromDate, toDate, sortConfig]);

  // --- fetch subcategories helper (if needed) ---
  const fetchSubCategories = (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    api
      .get(`/Category/sub/${categoryId}`)
      .then((res) => setSubCategories(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.log("Subcategory Error:", err));
  };

  // --- exports ---
  // --- exports ---
  
  const exportCSV = () => {
  window.open(`${api.defaults.baseURL}/Product/export?format=csv`, "_blank");
};

const exportPDF = () => {
  window.open(`${api.defaults.baseURL}/Product/export?format=pdf`, "_blank");
};


  // --- toggle status (calls backend) ---
  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/Product/${id}/status`, null, { params: { active: !currentStatus } });
      // reload page data
      fetchProducts();
    } catch (err) {
      console.error("Status Update Failed:", err);
      alert("Failed to update status");
    }
  };

  // --- copy to clipboard ---
  
   
  const handleDuplicate = async (productId) => {
  try {
    const res = await api.post(
      `/Product/${productId}/duplicate`
    );

    const newId = res.data.newProductId;

    Swal.fire({
      icon: "success",
      title: "Product Duplicated",
      text: "You can now edit the duplicated product",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate(`/product-details/${newId}`); // or product-create with id
  } catch (err) {
    console.error("Duplicate failed", err);
    Swal.fire("Error", "Failed to duplicate product", "error");
  }
};


  const copyToClipboard = async (text, id, field) => {
  try {
    // ✅ Modern Clipboard API (HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } 
    // ✅ Fallback (HTTP / older browsers)
    else {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (!successful) {
        throw new Error("Fallback copy failed");
      }
    }

    // ✅ UI feedback
    setCopiedField({ id, field });
    setTimeout(() => {
      setCopiedField({ id: null, field: null });
    }, 2000);

  } catch (err) {
    console.error("Copy failed:", err);
    alert("Copy failed. Please copy manually.");
  }
};


  // --- column headers (kept as design B) ---
  const getColumnHeaders = () => {
    const headers = [];
    if (visibleColumns.productId) headers.push({ key: "productId", label: "Product ID", style: { width: "100px" } });
    if (visibleColumns.productName) headers.push({ key: "productName", label: "Product Name", style: { width: "150px" } });
    if (visibleColumns.price) headers.push({ key: "price", label: "Item Price", style: { width: "100px" } });
    if (visibleColumns.category) headers.push({ key: "category", label: "Category", style: { width: "120px" } });
    if (visibleColumns.subCategory) headers.push({ key: "subCategory", label: "Sub Category", style: { width: "140px" } });
    if (visibleColumns.createdAt) headers.push({ key: "createdAt", label: "Created At", style: { width: "110px" } });

    headers.push({ key: "status", label: "Status", style: { width: "100px" } });
    headers.push({ key: "action", label: "Action", style: { width: "100px" } });

    return headers;
  };
  const columnHeaders = getColumnHeaders();

  // --- search & sort operate on mappedRows (client-side over server items) ---
  const filteredRows = useMemo(() => {
    if (!searchTerm) return mappedRows;
    const q = searchTerm.toLowerCase();
    return mappedRows.filter((r) => {
      return (
        String(r.productName ?? "").toLowerCase().includes(q) ||
        String(r.price ?? "").toLowerCase().includes(q) ||
        String(r.category ?? "").toLowerCase().includes(q) ||
        String(r.subCategory ?? "").toLowerCase().includes(q) ||
        String(r.createdAt ?? "").toLowerCase().includes(q)
      );
    });
  }, [mappedRows, searchTerm]);

  
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    const key = sortConfig.key;
    return [...filteredRows].sort((a, b) => {
      const A = a[key] ?? "";
      const B = b[key] ?? "";
      if (A < B) return sortConfig.direction === "asc" ? -1 : 1;
      if (A > B) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortConfig]);

  // pagination helpers (Design B shows client-side counts but we also read server total)
  const displayedProducts = sortedRows;
  const totalPages = Math.max(1, Math.ceil((total || displayedProducts.length) / pageSize));
  const gotoNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const gotoPrev = () => setPage((p) => Math.max(1, p - 1));

  // --- small handlers ---
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
    }
    return <FaSort className="ms-1" />;
  };

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  

  const handleView = (row) => {
  // Navigate to dynamic route with product ID
  navigate(`/product-details/${row.id}`);
};

  const handleToggleClick = (row) => {
    setSelectedUser(row);
    setStatusChoice(null);
    setShowConfirm(true);
  };

  const handleSubmitStatus = async () => {
    // If it's a protected ID in design B, update local activeStatus only (keeps previous logic)
    if (selectedUser && statusChoice.includes(selectedUser.id)) {
      setActiveStatus((prev) => ({ ...prev, [selectedUser.id]: statusChoice === "activate" }));
      setShowConfirm(false);
      setSelectedUser(null);
      setStatusChoice(null);
      return;
    }

    // If not protected, call backend
    if (selectedUser && statusChoice) {
      const shouldBeActive = statusChoice === "activate";
      try {
        await axios.patch(`${API_PRODUCT}/${selectedUser.id}/status`, null, { params: { active: shouldBeActive } });
        fetchProducts();
      } catch (err) {
        console.error("Status change failed:", err);
        alert("Failed to update status");
      }
    }

    setShowConfirm(false);
    setSelectedUser(null);
    setStatusChoice(null);
  };

  const handlePageSizeChange = (e) => {
  const value = e.target.value;

  if (value === "All") {
    setPageSize(total || displayedProducts.length || 999999);
  } else {
    setPageSize(Number(value));
  }

  setPage(1); // reset to first page
};


  return (
    <div className="container">
      <div className="row">
        <div className="category-table pb-3">
          <h4
            className="py-2 pl-3 text-center p-4 mb-0"
            style={{ color: "white", background: "#FEC200", border: "1px solid white", marginTop: "10px", borderRadius: "6px" }}
          >
            Product List
          </h4>

          {/* Toolbar */}
          <div
            className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
            style={{ backgroundColor: "#FEC200", flexWrap: "nowrap" }}
          >
            {/* Date Filters */}
            <div className="d-flex align-items-center">
              <label className="text-white me-2 mb-0" style={{ fontWeight: "500" }}>
                From:
              </label>
              <input
                type="date"
                className="form-control form-control-sm me-2"
                style={{ height: "34px", width: "150px" }}
                title="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label className="text-white me-2 mb-0" style={{ fontWeight: "500" }}>
                To:
              </label>
              <input
                type="date"
                className="form-control form-control-sm me-2"
                style={{ height: "34px", width: "150px" }}
                title="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <button
                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px", padding: 0 }}
                title="Apply Filter"
                onClick={() => {
                  setPage(1);
                  fetchProducts();
                }}
              >
                <FaTelegramPlane size={14} />
              </button>
            </div>

            {/* Search */}
            <div className="input-group align-items-center mx-3 py-2" style={{ maxWidth: "350px", width: "100%" }}>
              <input
                type="search"
                placeholder="Search by Name, Price, Category..."
                className="form-control form-control-sm"
                style={{ height: "34px" }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
              <button
                type="button"
                className="btn btn-light btn-sm ms-0 d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px", padding: 0 }}
                title="Search"
                onClick={() => {
                  setPage(1);
                  fetchProducts();
                }}
              >
                <i className="fas fa-search" style={{ fontSize: "13px" }} />
              </button>
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px", padding: 0 }}
                title="Customize Columns"
                onClick={() => setShowColumnSettings(!showColumnSettings)}
              >
                <IoMdSettings size={16} />
              </button>

              <button className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center" style={{ height: "34px", width: "34px", padding: 0 }} title="Export to PDF" onClick={exportPDF}>
                <FaFilePdf size={16} />
              </button>

              <button className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center" style={{ height: "34px", width: "34px", padding: 0 }} title="Export to Excel" onClick={exportCSV}>
                <FaFileExcel size={16} />
              </button>

              <button
                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px", padding: 0 }}
                title="Create New Product"
                onClick={() => navigate("/product-create")}
              >
                <FaPlus size={16} />
              </button>
            </div>
          </div>

          {/* Column Settings */}
          {showColumnSettings && (
            <div className="border p-3 mt-2 rounded">
              <h6>Customize Columns</h6>
              <div className="d-flex flex-wrap gap-3">
                {["productId", "productName", "price", "category", "subCategory", "createdAt"].map((col) => (
                  <div key={col} className="form-check">
                    <input className="form-check-input" type="checkbox" id={`${col}Check`} checked={visibleColumns[col]} onChange={() => toggleColumn(col)} />
                    <label className="form-check-label" htmlFor={`${col}Check`}>
                      {col === "productId" ? "Product ID" : col === "productName" ? "Product Name" : col === "price" ? "Item Price" : col === "category" ? "Category" : col === "subCategory" ? "Sub Category" : "Created At"}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="user-align" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "500px" }}>
            <table className="table table-bordered table-striped" style={{ minWidth: "1100px" }}>
              <thead className="thead-dark">
                <tr>
                  {columnHeaders.map((header) => (
                    <th
                      key={header.key}
                      className={`admin-user-sub-heading pl-3 p-3 sorting ${header.key === "action" ? "sticky-action" : ""}`}
                      style={{
                        ...header.style,
                        whiteSpace: "nowrap",
                        border: "1px solid #dee2e6",
                        cursor: header.key !== "action" && header.key !== "status" ? "pointer" : "default",
                        color: "#07486e",
                        ...(header.key === "action" ? { position: "sticky", right: 0, zIndex: 10, backgroundColor: "#f8f9fa" } : {}),
                      }}
                      onClick={() => header.key !== "action" && header.key !== "status" && handleSort(header.key)}
                    >
                      {header.label} {header.key !== "action" && header.key !== "status" && getSortIcon(header.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={columnHeaders.length} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={columnHeaders.length} className="text-center py-4">
                      No products found
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? "even" : "odd"}>
                      {/* Product ID + Status Circle (Protected) */}
                      {visibleColumns.productId && (
                        <td className="admin-user-option pl-3 p-3 text-center" style={{ border: "1px solid #dee2e6" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{user.productId}</span>
                            <button
                              className="btn btn-sm p-1"
                              title={copiedField.id === user.id && copiedField.field === "productId" ? "Copied" : "Copy"}

                              onClick={() => copyToClipboard(user.productId, user.id, "productId")}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {copiedField.id === user.id && copiedField.field === "productId" ? <img src={checkIcon} alt="Copied" style={{ width: "18px", height: "18px" }} /> : <MdContentCopy size={15} />}
                            </button>
                          </div>
                        
                        </td>
                      )}

                      {/* Product Name */}
                      {visibleColumns.productName && (
                        <td className="admin-user-option pl-3 p-3" style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{user.productName}</span>
                            <button
                              className="btn btn-sm p-1"
                              title={copiedField.id === user.id && copiedField.field === "productName" ? "Copied" : "Copy"}

                              onClick={() => copyToClipboard(user.productName, user.id, "productName")}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {copiedField.id === user.id && copiedField.field === "productName" ? <img src={checkIcon} alt="Copied" style={{ width: "18px", height: "18px" }} /> : <MdContentCopy size={15} />}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* Price */}
                      {visibleColumns.price && (
                        <td className="admin-user-option pl-3 p-3" style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>₹{user.price ?? "-"}</span>
                            <button
                              className="btn btn-sm p-1"
                              title={copiedField.id === user.id && copiedField.field === "price" ? "Copied" : "Copy"}

                              onClick={() => copyToClipboard(user.price ?? "", user.id, "price")}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {copiedField.id === user.id && copiedField.field === "price" ? <img src={checkIcon} alt="Copied" style={{ width: "18px", height: "18px" }} /> : <MdContentCopy size={15} />}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* Category */}
                      {visibleColumns.category && (
                        <td className="admin-user-option pl-3 p-3" style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                        
                          <div className="d-flex justify-content-between align-items-center">
                             <span>{user.category}</span> 
                            <button
                              className="btn btn-sm p-1"
                              title={copiedField.id === user.id && copiedField.field === "category" ? "Copied" : "Copy"}

                              onClick={() => copyToClipboard(user.category ?? "", user.id, "category")}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {copiedField.id === user.id && copiedField.field === "category" ? <img src={checkIcon} alt="Copied" style={{ width: "18px", height: "18px" }} /> : <MdContentCopy size={15} />}
                            </button>
                          </div>
                          
                        </td>
                      )}

                      {/* Sub Category */}
                      {visibleColumns.subCategory && (
                        <td className="admin-user-option pl-3 p-3" style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                         
                           <div className="d-flex justify-content-between align-items-center">
                             <span> {user.subCategory}</span> 
                            <button
                              className="btn btn-sm p-1"
                              title={copiedField.id === user.id && copiedField.field === "subCategory" ? "Copied" : "Copy"}

                              onClick={() => copyToClipboard(user.subCategory ?? "", user.id, "subCategory")}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {copiedField.id === user.id && copiedField.field === "subCategory" ? <img src={checkIcon} alt="Copied" style={{ width: "18px", height: "18px" }} /> : <MdContentCopy size={15} />}
                            </button>
                          </div>
                          
                        </td>
                      )}

                      {/* Created At */}
                      {visibleColumns.createdAt && (
                        <td className="admin-user-option pl-3 p-3" style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                        
                           <div className="d-flex justify-content-between align-items-center">
                             <span>{formatDate(user.createdAt)}</span>

                            <button
                              className="btn btn-sm p-1"
                              title={copiedField.id === user.id && copiedField.field === "createdAt" ? "Copied" : "Copy"}

                              onClick={() => copyToClipboard(user.createdAt ?? "", user.id, "createdAt")}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {copiedField.id === user.id && copiedField.field === "createdAt" ? <img src={checkIcon} alt="Copied" style={{ width: "18px", height: "18px" }} /> : <MdContentCopy size={15} />}
                            </button>
                          </div>
                        </td>
                      )}

                      {/* Status Toggle */}
                      <td className="admin-user-option pl-3 p-3 text-center" style={{ border: "1px solid #dee2e6" }}>
                        <div
                          onClick={() => handleToggleClick(user)}
                          style={{
                            width: "50px",
                            height: "26px",
                            borderRadius: "50px",
                            backgroundColor: activeStatus[user.id] ?? user.is_active ? "#4CAF50" : "#f44336",
                            position: "relative",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              backgroundColor: "white",
                              position: "absolute",
                              top: "2px",
                              left: activeStatus[user.id] ?? user.is_active ? "26px" : "2px",
                              transition: "left 0.3s ease",
                            }}
                          />
                        </div>
                      </td>

                      {/* Action */}
                      <td className="admin-user-option pl-3 p-3 sticky-action" style={{ border: "1px solid #dee2e6", position: "sticky", right: 0, backgroundColor: "white", zIndex: 1 }}>
                        {/* <button className="btn btn-sm btn-outline-success me-1" title="View" onClick={() => handleView(user)}>
                          <MdKeyboardArrowRight style={{ fontSize: "20px"}} />
                          <MdKeyboardArrowRight style={{ fontSize: "20px",marginLeft:"-13px" }} />
                        </button> */}

                        <button
                          className="btn btn-sm btn-outline-success me-1"
                          title="View"
                          onClick={() => handleView(user)}
                        >
                          <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
                          <MdKeyboardArrowRight style={{ fontSize: "20px", marginLeft: "-13px" }} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-warning"
                          title="Duplicate Product"
                          onClick={() => handleDuplicate(user.id)}
                        >
                          <FaPlus />
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="row mt-3">
           
           <div className="col-md-6 d-flex align-items-center gap-2">
              <span><strong>Show:</strong></span>

              <select
                className="form-select form-select-sm"
                style={{ width: "90px" }}
                value={
                  pageSize >= (total || displayedProducts.length)
                    ? "All"
                    : pageSize
                }
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              <span>
                <strong>
                  entries | Showing {(page - 1) * pageSize + 1} to{" "}
                  {Math.min(page * pageSize, total || displayedProducts.length)} of{" "}
                  {total || displayedProducts.length}
                </strong>
              </span>
            </div>

            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-end">
                  <li className="page-item">
                    <button className="page-link" onClick={gotoPrev} disabled={page <= 1} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "15px" }}>
                      <MdKeyboardArrowLeft style={{ fontSize: "20px" }} />
                      <MdKeyboardArrowLeft style={{ fontSize: "20px",marginLeft:"-18px" }} />
                      Previous
                    </button>
                  </li>
                  
                  <li className="page-item active">
                    <span className="page-link">{page}</span>
                  </li>
                  <li className="page-item">
                    <button className="page-link" onClick={gotoNext} disabled={page >= totalPages} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "15px" }}>
                      Next
                      <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
                      <MdKeyboardArrowRight style={{ fontSize: "20px", marginLeft: "-18px" }} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Confirmation Modal */}
          {showConfirm && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "25px 30px",
                  borderRadius: "10px",
                  textAlign: "center",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                  width: "570px",
                  maxWidth: "100%",
                  height: "200px",
                }}
              >
                <h5 className="mb-3" style={{ fontWeight: "600", textAlign: "left" }}>
                  Are you sure to change the status?
                </h5>
                <div className="d-flex justify-content-left mb-4" style={{ gap: "30px" }}>
                  {["activate", "deactivate"].map((opt) => (
                    <div key={opt} className="form-check" style={{ fontSize: "17px" }}>
                      <input className="form-check-input" type="checkbox" id={`${opt}Check`} checked={statusChoice === opt} onChange={() => setStatusChoice(opt)} />
                      <label className="form-check-label ms-1" htmlFor={`${opt}Check`} style={{ cursor: "pointer", fontSize: "17px" }}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button className="btn btn-outline-secondary" style={{ minWidth: "90px", borderRadius: "6px" }} onClick={() => setShowConfirm(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" style={{ minWidth: "90px", borderRadius: "6px" }} onClick={handleSubmitStatus} disabled={!statusChoice}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

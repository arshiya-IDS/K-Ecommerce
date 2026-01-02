import React, { useEffect, useMemo, useState } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaTelegramPlane,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_CATEGORY = "http://ecommerce-admin-backend.i-diligence.com/api/Category";
const API_SUBCATEGORY = "http://ecommerce-admin-backend.i-diligence.com/api/Category/sub";
const API_PRODUCT = "http://ecommerce-admin-backend.i-diligence.com/api/Product";

const ProductList = () => {
  const navigate = useNavigate();

  // --- UI state / filters / paging / sorting ---
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // --- data ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

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
  const [selectedProductForStatus, setSelectedProductForStatus] = useState(null);
  const [statusChoice, setStatusChoice] = useState(null);

  // --- fetch categories once ---
  useEffect(() => {
    let mounted = true;
    axios
      .get(API_CATEGORY)
      .then((res) => {
        if (!mounted) return;
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Category Fetch Error:", err);
      });
    return () => (mounted = false);
  }, []);

  // --- fetch products (server-side search/paging/sort) ---
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

      const res = await axios.get(API_PRODUCT, { params });
      // Expecting response: { total, page, pageSize, items }
      const data = res.data || {};
      setProducts(Array.isArray(data.items) ? data.items : []);
      setTotal(typeof data.total === "number" ? data.total : (data.items ? data.items.length : 0));
      if (data.pageSize) setPageSize(data.pageSize);
    } catch (err) {
      console.error("Product Fetch Error:", err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchTerm, fromDate, toDate, sortConfig]);

  // --- fetch subcategories for a category id (used if you add a category filter UI) ---
  const fetchSubCategories = (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    axios
      .get(`${API_SUBCATEGORY}/${categoryId}`)
      .then((res) => setSubCategories(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.log("Subcategory Error:", err));
  };

  // --- export handlers ---
  const exportCSV = () => {
    window.open(`${API_PRODUCT}/export?format=csv`, "_blank");
  };

  const exportPDF = () => {
    window.open(`${API_PRODUCT}/export?format=pdf`, "_blank");
  };

  // --- toggle status (calls backend) ---
  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_PRODUCT}/${id}/status`, null, { params: { active: !currentStatus } });
      // reload page data
      fetchProducts();
    } catch (err) {
      console.error("Status Update Failed:", err);
      alert("Failed to update status");
    }
  };

  // --- copy to clipboard ---
  const copyToClipboard = (text, id, field) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedField({ id, field });
        setTimeout(() => setCopiedField({ id: null, field: null }), 2000);
      })
      .catch(() => {
        // ignore
      });
  };

  // --- sorting UI ---
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

  // --- visible column toggler ---
  const toggleColumn = (column) => setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));

  // --- create column headers dynamically ---
  const getColumnHeaders = () => {
    const headers = [];
    if (visibleColumns.productId) headers.push({ key: "productId", label: "Product ID", style: { width: "90px" } });
    if (visibleColumns.productName) headers.push({ key: "productName", label: "Product Name", style: { width: "220px" } });
    if (visibleColumns.price) headers.push({ key: "price", label: "Item Price", style: { width: "120px" } });
    if (visibleColumns.category) headers.push({ key: "category", label: "Category", style: { width: "160px" } });
    if (visibleColumns.subCategory) headers.push({ key: "subCategory", label: "Sub Category", style: { width: "160px" } });
    if (visibleColumns.createdAt) headers.push({ key: "createdAt", label: "Created At", style: { width: "140px" } });

    headers.push({ key: "status", label: "Status", style: { width: "120px" } });
    headers.push({ key: "action", label: "Action", style: { width: "80px" } });

    return headers;
  };

  const columnHeaders = getColumnHeaders();

  // --- client-side representation of products for UI rendering (we receive server items) ---
  const displayedProducts = products || [];

  // --- pagination helpers ---
  const totalPages = Math.max(1, Math.ceil((total || displayedProducts.length) / pageSize));

  const gotoNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const gotoPrev = () => setPage((p) => Math.max(1, p - 1));

  return (
    <div className="container my-3">
      <div className="card shadow-sm p-0">
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2"
          style={{ background: "#FEC200", color: "#000", borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
        >
          <h5 className="mb-0">Product List</h5>

          <div className="d-flex gap-2 align-items-center">
            {/* From / To filters */}
            <div className="d-flex align-items-center gap-2">
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ height: 34 }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                title="From date"
              />
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ height: 34 }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                title="To date"
              />
              <button
                className="btn btn-light btn-sm"
                style={{ height: 34 }}
                title="Apply date filter"
                onClick={() => {
                  setPage(1);
                  fetchProducts();
                }}
              >
                <FaTelegramPlane />
              </button>
            </div>

            {/* Search */}
            <div className="input-group" style={{ maxWidth: 350 }}>
              <input
                type="search"
                placeholder="Search by Name, Price, Category..."
                className="form-control form-control-sm"
                style={{ height: 34 }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light btn-sm me-2"
                style={{ height: 34 }}
                title="Customize Columns"
                onClick={() => setShowColumnSettings((s) => !s)}
              >
                <IoMdSettings size={16} />
              </button>

              <button className="btn btn-light btn-sm me-2" style={{ height: 34 }} title="Export to PDF" onClick={exportPDF}>
                <FaFilePdf size={16} />
              </button>

              <button className="btn btn-light btn-sm me-2" style={{ height: 34 }} title="Export to CSV" onClick={exportCSV}>
                <FaFileExcel size={16} />
              </button>

              <button className="btn btn-light btn-sm" style={{ height: 34 }} title="Create New Product" onClick={() => navigate("/product-create")}>
                <FaPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Column settings panel */}
        {showColumnSettings && (
          <div className="p-3 border-bottom">
            <strong>Customize columns</strong>
            <div className="d-flex gap-3 mt-2 flex-wrap">
              {["productId", "productName", "price", "category", "subCategory", "createdAt"].map((col) => (
                <div key={col} className="form-check">
                  <input
                    id={`${col}Check`}
                    className="form-check-input"
                    type="checkbox"
                    checked={visibleColumns[col]}
                    onChange={() => toggleColumn(col)}
                  />
                  <label className="form-check-label" htmlFor={`${col}Check`}>
                    {col === "productId"
                      ? "Product ID"
                      : col === "productName"
                      ? "Product Name"
                      : col === "price"
                      ? "Item Price"
                      : col === "category"
                      ? "Category"
                      : col === "subCategory"
                      ? "Sub Category"
                      : "Created At"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="table table-bordered mb-0">
            <thead className="thead-light">
              <tr>
                {columnHeaders.map((header) => (
                  <th
                    key={header.key}
                    style={{
                      ...header.style,
                      cursor: header.key !== "action" && header.key !== "status" ? "pointer" : "default",
                    }}
                    onClick={() => header.key !== "action" && header.key !== "status" && handleSort(header.key === "productName" ? "productName" : header.key === "price" ? "price" : header.key === "createdAt" ? "createdAt" : header.key)}
                  >
                    {header.label} {header.key !== "action" && header.key !== "status" && getSortIcon(header.key === "productName" ? "productName" : header.key === "price" ? "price" : header.key === "createdAt" ? "createdAt" : header.key)}
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
                displayedProducts.map((p) => (
                  <tr key={p.product_id}>
                    {visibleColumns.productId && <td className="align-middle text-center">{p.product_id}</td>}
                    {visibleColumns.productName && (
                      <td className="align-middle">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>{p.product_name}</div>
                          <button className="btn btn-sm p-1" onClick={() => copyToClipboard(p.product_name, p.product_id, "productName")}>
                            {copiedField.id === p.product_id && copiedField.field === "productName" ? (
                              <img src={checkIcon} alt="copied" style={{ width: 16, height: 16 }} />
                            ) : (
                              <MdContentCopy size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    )}
                    {visibleColumns.price && <td className="align-middle">₹{p.product_actual_price}</td>}
                    {visibleColumns.category && <td className="align-middle">{p.category_name ?? "-"}</td>}
                    {visibleColumns.subCategory && <td className="align-middle">{p.subcategory_name ?? "-"}</td>}
                    {visibleColumns.createdAt && <td className="align-middle">{p.prdct_CrtdAt ?? "-"}</td>}

                    <td className="align-middle text-center">
                      <button className="btn btn-sm" onClick={() => toggleStatus(p.product_id, p.is_active)}>
                        {p.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="align-middle text-center">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate("/product-details", { state: { productData: p } })}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <div>
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total || displayedProducts.length)} of {total || displayedProducts.length} entries
          </div>

          <div className="d-flex gap-2 align-items-center">
            <button className="btn btn-sm btn-light" onClick={gotoPrev} disabled={page <= 1}>
              <MdKeyboardArrowLeft /> Prev
            </button>
            <div>
              Page {page} / {totalPages}
            </div>
            <button className="btn btn-sm btn-light" onClick={gotoNext} disabled={page >= totalPages}>
              Next <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal (simple) */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div className="bg-white p-4 rounded" style={{ width: 520 }}>
            <h5>Are you sure to change the status?</h5>
            <div className="d-flex gap-3 mt-3">
              {["activate", "deactivate"].map((opt) => (
                <div key={opt} className="form-check">
                  <input
                    id={opt}
                    className="form-check-input"
                    type="checkbox"
                    checked={statusChoice === opt}
                    onChange={() => setStatusChoice((s) => (s === opt ? null : opt))}
                  />
                  <label className="form-check-label" htmlFor={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn btn-outline-secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={!statusChoice}
                onClick={() => {
                  if (!selectedProductForStatus) return setShowConfirm(false);
                  const shouldBeActive = statusChoice === "activate";
                  toggleStatus(selectedProductForStatus.product_id, !shouldBeActive); // toggle to desired; backend expects active param, we call toggle endpoint
                  setShowConfirm(false);
                  setSelectedProductForStatus(null);
                  setStatusChoice(null);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
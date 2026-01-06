// ProductDiscountList.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilePdf,
  FaFileExcel,
  FaPlus,
} from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ProductDiscountList
 * - Expects API to return camelCase DTO:
 *   { productDiscountId, discountName, discountValue, actualPrice, discountedPrice, createdAt, isActive, status }
 */
const ProductDiscountList = () => {
  const navigate = useNavigate();

  const [copiedField, setCopiedField] = useState({ id: null, field: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusChoice, setStatusChoice] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // date filters (yyyy-mm-dd inputs)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // columns - using camelCase keys
  const [visibleColumns, setVisibleColumns] = useState({
    productDiscountId: true,
    discountName: true,
    discountValue: true,
    actualPrice: true,
    discountedPrice: true,
    createdAt: true,
  });

  

// VIEW HANDLER (FIXED)
const handleView = (row) => {
  // Use the correct property name
  const discountId = row.productDiscountId;

  if (!discountId) {
    toast.error("Product Discount ID is missing!");
    return;
  }

  navigate(`/product-discount-details/${discountId}`);
};


  // protected ids example (you had this earlier)
  const protectedProductIds = [1, 2];

  // ---------------------------
  // Fetch from API
  // ---------------------------
  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("https://localhost:7013/api/ProductDiscount/list");
      if (resp?.data?.success) {
        // map to expected camelCase if backend uses different casing
        const data = (resp.data.data || []).map((d) => ({
          productDiscountId: d.productDiscountId ?? d.productDiscountId ?? d.ProductDiscountId,
          discountName: d.discountName ?? d.discountName ?? d.DiscountName,
          discountValue: d.discountValue ?? d.discountValue ?? d.DiscountValue,
          actualPrice: d.actualPrice ?? d.actualPrice ?? d.ActualPrice,
          discountedPrice: d.discountedPrice ?? d.discountedPrice ?? d.DiscountedPrice,
          createdAt: d.createdAt ?? d.createdAt ?? d.CreatedAt,
          isActive: d.isActive ?? d.isActive ?? d.IsActive ?? Boolean(d.productDiscountIsActive),
          status: d.status ?? (d.isActive || d.IsActive ? "Active" : "Inactive"),
        }));
        setUsers(data);
      } else {
        toast.error("Failed to load discounts");
      }
    } catch (err) {
      console.error("fetchDiscounts:", err);
      toast.error("Error fetching discount list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------
  // Toggle status API
  // ---------------------------
  const toggleStatusApi = async (id) => {
    try {
      const resp = await axios.put(`https://localhost:7013/api/ProductDiscount/toggle-status/${id}`);
      return resp.data;

      
    } catch (err) {
      console.error("toggleStatusApi:", err);
      throw err;
    }
  };

 

  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setStatusChoice(null);
    setShowConfirm(true);
  };

  

const handleSubmitStatus = async () => {
  if (!selectedUser || !statusChoice) return;

  const isActive = statusChoice === "activate";
  const discountId = selectedUser.productDiscountId;

  if (protectedProductIds.includes(discountId)) {
    toast.error("This discount cannot be modified");
    return;
  }

  try {
    await axios.put(
      `https://localhost:7013/api/ProductDiscount/toggle-status/${discountId}?isActive=${isActive}`
    );

    // ✅ UPDATE THE SAME STATE USED BY UI
    setUsers(prev =>
      prev.map(u =>
        u.productDiscountId === discountId
          ? { ...u, isActive }
          : u
      )
    );

   

  } catch (error) {
    console.error("Failed to update status", error);
    toast.error("Status update failed");
  } finally {
    setShowConfirm(false);
    setSelectedUser(null);
    setStatusChoice(null);
  }
};



  // ---------------------------
  // Copy to clipboard helper
  // ---------------------------
  

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

  // ---------------------------
  // Search + filter + date
  // ---------------------------
  const parseCreatedAtToDate = (createdAtStr) => {
    // the API returns dd-MM-yyyy (as per your sample). Try dd-MM-yyyy first, fall back to Date parse.
    if (!createdAtStr) return null;
    const parts = createdAtStr.split("-");
    if (parts.length === 3) {
      // dd-MM-yyyy
      const [dd, mm, yyyy] = parts;
      const iso = `${yyyy}-${mm}-${dd}`; // yyyy-mm-dd
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d;
    }
    const d2 = new Date(createdAtStr);
    return isNaN(d2.getTime()) ? null : d2;
  };

  const filteredUsers = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    return users.filter((u) => {
      // search filter
      const hay = [
        String(u.productDiscountId ?? ""),
        String(u.discountName ?? ""),
        String(u.discountValue ?? ""),
        String(u.actualPrice ?? ""),
        String(u.discountedPrice ?? ""),
        String(u.createdAt ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      if (q && !hay.includes(q)) return false;

      // date filter
      if (fromDate || toDate) {
        const d = parseCreatedAtToDate(u.createdAt);
        if (!d) return false;
        if (fromDate) {
          const fd = new Date(fromDate + "T00:00:00");
          if (d < fd) return false;
        }
        if (toDate) {
          const td = new Date(toDate + "T23:59:59");
          if (d > td) return false;
        }
      }

      return true;
    });
  }, [users, searchTerm, fromDate, toDate]);

  // ---------------------------
  // Sorting
  // ---------------------------
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const av = a[sortConfig.key];
      const bv = b[sortConfig.key];
      // numeric fallback
      const an = Number(av);
      const bn = Number(bv);
      if (!isNaN(an) && !isNaN(bn)) {
        return sortConfig.direction === "asc" ? an - bn : bn - an;
      }
      const sa = String(av ?? "").toLowerCase();
      const sb = String(bv ?? "").toLowerCase();
      if (sa < sb) return sortConfig.direction === "asc" ? -1 : 1;
      if (sa > sb) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1" />;
    return sortConfig.direction === "asc" ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  // ---------------------------
  // Export CSV (Excel friendly)
  // ---------------------------
  const exportToCsv = () => {
    if (!users || users.length === 0) {
      toast.info("No data to export");
      return;
    }
    const rows = sortedUsers.map((r) => ({
      productDiscountId: r.productDiscountId,
      discountName: r.discountName,
      discountValue: r.discountValue,
      actualPrice: r.actualPrice,
      discountedPrice: r.discountedPrice,
      createdAt: r.createdAt,
      status: r.isActive ? "Active" : "Inactive",
    }));

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const cell = row[h] ?? "";
            // escape quotes
            const escaped = String(cell).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `product-discounts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------
  // Export to PDF (simple printable HTML)
  // ---------------------------
  const exportToPDF = () => {
    if (!users || users.length === 0) {
      toast.info("No data to export");
      return;
    }

    const rows = sortedUsers;
    const htmlRows = rows
      .map(
        (r) => `
      <tr>
        <td style="padding:6px;border:1px solid #ccc">${r.productDiscountId}</td>
        <td style="padding:6px;border:1px solid #ccc">${r.discountName}</td>
          <td style="padding:6px;border:1px solid #ccc">${r.discountValue}</td>
        <td style="padding:6px;border:1px solid #ccc">${r.actualPrice}</td>
        <td style="padding:6px;border:1px solid #ccc">${r.discountedPrice}</td>
        <td style="padding:6px;border:1px solid #ccc">${r.createdAt}</td>
        <td style="padding:6px;border:1px solid #ccc">${r.isActive ? "Active" : "Inactive"}</td>
      </tr>`
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Product Discounts</title>
        </head>
        <body>
          <h2>Product Discounts</h2>
          <table style="border-collapse:collapse;width:100%;font-family:Arial,Helvetica,sans-serif">
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #ccc">ID</th>
                <th style="padding:8px;border:1px solid #ccc">Name</th>
                <th style="padding:8px;border:1px solid #ccc">Value</th>
                <th style="padding:8px;border:1px solid #ccc">Actual Price</th>
                <th style="padding:8px;border:1px solid #ccc">Discounted Price</th>
                <th style="padding:8px;border:1px solid #ccc">Created At</th>
                <th style="padding:8px;border:1px solid #ccc">Status</th>
              </tr>
            </thead>
            <tbody>
              ${htmlRows}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // ---------------------------
  // Column header array
  // ---------------------------
  const columnHeaders = [
    visibleColumns.productDiscountId && { key: "productDiscountId", label: "Product Discount ID", width: "150px" },
    visibleColumns.discountName && { key: "discountName", label: "Discount Name", width: "180px" },
   visibleColumns.discountValue && { key: "discountValue", label: "Discount Value", width: "120px" },
    visibleColumns.actualPrice && { key: "actualPrice", label: "Actual Price", width: "120px" },
    visibleColumns.discountedPrice && { key: "discountedPrice", label: "Discounted Price", width: "130px" },
    visibleColumns.createdAt && { key: "createdAt", label: "Created At", width: "130px" },
    { key: "status", label: "Status", width: "100px" },
    { key: "action", label: "Action", width: "100px" },
  ].filter(Boolean);

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="container">
      <ToastContainer position="top-right" />
      <div className="row">
        <h4
          className="py-2 pl-3 text-center p-4 mb-0"
          style={{
            color: "white",
            background: "#FEC200",
            border: "1px solid white",
            marginTop: "10px",
            borderRadius: "6px",
          }}
        >
          Product Discount List
        </h4>

        {/* Filter / Search / Tools */}
        <div className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1" style={{ backgroundColor: "#FEC200", flexWrap: "nowrap" }}>
          <div className="d-flex align-items-center">
            <label className="text-white me-2 mb-0">From:</label>
            <input type="date" className="form-control form-control-sm me-2" style={{ width: "150px" }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label className="text-white me-2 mb-0">To:</label>
            <input type="date" className="form-control form-control-sm me-2" style={{ width: "150px" }} value={toDate} onChange={(e) => setToDate(e.target.value)} />
            <button className="btn btn-light btn-sm" style={{ height: "34px", width: "34px" }} onClick={() => fetchDiscounts()} title="Apply Filter">
              <FaTelegramPlane size={14} />
            </button>
          </div>

          <div className="input-group mx-3 py-2" style={{ maxWidth: "420px", width: "100%" }}>
            <input type="search" placeholder="Search by ID, Name, Price ..." className="form-control form-control-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="d-flex align-items-center">
            <button className="btn btn-light btn-sm me-2" style={{ height: "34px", width: "34px" }} onClick={() => setShowColumnSettings((s) => !s)} title="Customize Columns">
              <IoMdSettings size={16} />
            </button>

            <button className="btn btn-light btn-sm me-2" style={{ height: "34px", width: "34px" }} onClick={exportToPDF} title="Export to PDF">
              <FaFilePdf size={16} />
            </button>

            <button className="btn btn-light btn-sm me-2" style={{ height: "34px", width: "34px" }} onClick={exportToCsv} title="Export to Excel (CSV)">
              <FaFileExcel size={16} />
            </button>

            <button className="btn btn-light btn-sm" style={{ height: "34px", width: "34px" }} onClick={() => navigate("/product-discount")} title="Create New Product Discount">
              <FaPlus size={16} />
            </button>
          </div>
        </div>

        {/* Column settings */}
        {showColumnSettings && (
          <div className="border p-3 mt-2 rounded">
            <h6>Customize Columns</h6>
            <div className="d-flex flex-wrap">
              {Object.entries(visibleColumns).map(([col, val]) => (
                <div className="form-check me-3" key={col}>
                  <input className="form-check-input" type="checkbox" checked={val} onChange={() => setVisibleColumns((prev) => ({ ...prev, [col]: !prev[col] }))} id={`chk-${col}`} />
                  <label className="form-check-label" htmlFor={`chk-${col}`}>
                    {col}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto", maxHeight: "60vh", overflowY: "auto" }} className="mt-3">
          <table className="table table-bordered table-striped" style={{ minWidth: "1100px" }}>
            <thead>
              <tr>
                {columnHeaders.map((header) => (
                  <th key={header.key} style={{ width: header.width, whiteSpace: "nowrap", color: "#07486e", cursor: header.key !== "action" ? "pointer" : "default", border: "1px solid #dee2e6" }} onClick={() => header.key !== "action" && handleSort(header.key)}>
                    {header.label} {header.key !== "action" && getSortIcon(header.key)}
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
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={columnHeaders.length} className="text-center py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user, idx) => (
                  <tr key={user.productDiscountId ?? idx} className={idx % 2 === 0 ? "even" : "odd"}>
                    {visibleColumns.productDiscountId && (
                      <td style={{ border: "1px solid #dee2e6" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.productDiscountId}</span>
                          <button className="btn btn-sm p-1" onClick={() => copyToClipboard(user.productDiscountId, user.productDiscountId, "productDiscountId")} title="Copy ID" style={{ width: "28px", height: "28px" }}>
                            {copiedField.id === user.productDiscountId && copiedField.field === "productDiscountId" ? <img src={checkIcon} width={18} alt="copied" /> : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.discountName && (
                      <td style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.discountName}</span>
                          <button className="btn btn-sm p-1" onClick={() => copyToClipboard(user.discountName, user.productDiscountId, "discountName")} title="Copy Name" style={{ width: "28px", height: "28px" }}>
                            {copiedField.id === user.productDiscountId && copiedField.field === "discountName" ? <img src={checkIcon} width={18} alt="copied" /> : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.discountValue && (
                      <td style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.discountValue}</span>
                          <button className="btn btn-sm p-1" onClick={() => copyToClipboard(user.discountValue, user.productDiscountId, "discountValue")} title="Copy Value" style={{ width: "28px", height: "28px" }}>
                            {copiedField.id === user.productDiscountId && copiedField.field === "discountValue" ? <img src={checkIcon} width={18} alt="copied" /> : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.actualPrice && (
                      <td style={{ border: "1px solid #dee2e6", color: "#645959" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.actualPrice}</span>
                          <button className="btn btn-sm p-1" onClick={() => copyToClipboard(user.actualPrice, user.productDiscountId, "actualPrice")} title="Copy Actual Price" style={{ width: "28px", height: "28px" }}>
                            {copiedField.id === user.productDiscountId && copiedField.field === "actualPrice" ? <img src={checkIcon} width={18} alt="copied" /> : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.discountedPrice && <td style={{ border: "1px solid #dee2e6", color: "#645959" }}>{user.discountedPrice}</td>}

                    {visibleColumns.createdAt && <td style={{ border: "1px solid #dee2e6", color: "#645959" }}>{user.createdAt}</td>}

                    {/* Status */}
                    <td style={{ border: "1px solid #dee2e6", textAlign: "center" }}>
                      <div onClick={() => handleToggleClick(user)} style={{ width: "50px", height: "26px", borderRadius: "50px", backgroundColor: user.isActive ? "#4CAF50" : "#f44336", position: "relative", cursor: "pointer", transition: "background-color 0.3s ease" }}>
                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "white", position: "absolute", top: "2px", left: user.isActive ? "26px" : "2px", transition: "left 0.3s ease" }} />
                      </div>
                    </td>

                    {/* Action */}
                    <td className="sticky-action" style={{ border: "1px solid #dee2e6", position: "sticky", right: 0, backgroundColor: "white", zIndex: 1 }}>
                      <button className="btn btn-sm btn-outline-success me-1" title="View" onClick={() => handleView(user)}>
                        <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
                        <MdKeyboardArrowRight style={{ fontSize: "20px", marginLeft: "-10px" }} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div className="row mt-3">
          <div className="col-md-6">
            <strong>
              Showing {Math.min(1, sortedUsers.length)} to {sortedUsers.length} of {sortedUsers.length} entries
            </strong>
          </div>
        </div>

        {/* confirm modal */}
        {showConfirm && selectedUser && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
            <div style={{ backgroundColor: "white", padding: "25px 30px", borderRadius: "10px", width: "570px", maxWidth: "100%" }}>
              <h5 style={{ fontWeight: 600, textAlign: "left" }}>Are you sure to change the status?</h5>

              <div className="d-flex justify-content-left mb-4" style={{ gap: "30px" }}>
                <div className="form-check" style={{ fontSize: "17px" }}>
                  <input className="form-check-input" type="checkbox" id="activateCheck" checked={statusChoice === "activate"} onChange={() => setStatusChoice("activate")} />
                  <label className="form-check-label ms-1" htmlFor="activateCheck" style={{ cursor: "pointer", fontSize: "17px" }}>
                    Activate
                  </label>
                </div>

                <div className="form-check" style={{ fontSize: "17px" }}>
                  <input className="form-check-input" type="checkbox" id="deactivateCheck" checked={statusChoice === "deactivate"} onChange={() => setStatusChoice("deactivate")} />
                  <label className="form-check-label ms-1" htmlFor="deactivateCheck" style={{ cursor: "pointer", fontSize: "17px" }}>
                    Deactivate
                  </label>
                </div>
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
  );
};

export default ProductDiscountList;

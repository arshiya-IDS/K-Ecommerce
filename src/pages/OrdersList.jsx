import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { MdKeyboardArrowLeft } from "react-icons/md";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import api from "../api/axiosInstance";




import {
  FaEdit, 
  FaEye, 
  FaTrash,
  FaFilePdf,
  FaFileExcel,
  FaTelegramPlane,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import checkIcon from "../assets/check.png";

const OrdersList = () => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState({ id: null, field: null });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Simple pagination
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

const pageSizeOptions = [10, 20, 30, "All"];

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

// Simple pagination

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-"; // invalid date protection

  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};



const handlePageSizeChange = (e) => {
  const value = e.target.value;

  if (value === "All") {
    setPageSize(sortedOrders.length || 100000);
  } else {
    setPageSize(Number(value));
  }

  setPage(1);
};


  //  Hardcoded sample data
 const [orders, setOrders] = useState([]);
useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    const res = await api.get(
      "/OrderItem/list"
    );

   


    // If API returns single object → convert to array
    const data = Array.isArray(res.data) ? res.data : [res.data];

    setOrders(data);

    // Initialize toggle status from API
    const statusMap = {};
    data.forEach(item => {
      statusMap[item.order_id] = item.isActive;
    });
    setActiveStatus(statusMap);

  } catch (error) {
    console.error("Failed to fetch order items", error);
  }
};


  const [activeStatus, setActiveStatus] = useState({});
const [showConfirm, setShowConfirm] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [statusChoice, setStatusChoice] = useState(null);
const protectedProductIds = [1, 2];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
  order_id: true,
  order_item_id: true,
  product_name: true,
  product_price: true,
  product_quantity: true,
  order_date:true,
 // ordr_itm_CrtdAt: true,
  // ordr_itm_CrtdBy: true,
  // ordr_itm_UpdtdAt: true,
  // ordr_itm_UpdtdBy: true,
});


  const handleToggleClick = (user) => {
  setSelectedUser(user);
  setStatusChoice(null);
  setShowConfirm(true);
};


const exportCSV = () => {
    window.open(`${api.defaults.baseURL}/OrderItem/export?format=csv`, "_blank");
  };
  const exportPDF = () => {
    window.open(`${api.defaults.baseURL}/OrderItem/export?format=pdf`, "_blank");
  };

 

const handleView = (row) => {
  // Navigate to dynamic route with product ID
  navigate(`/order-details/${row.order_id}`);
};



const handleSubmitStatus = async () => {
  if (!selectedUser || !statusChoice) return;

  const orderId = selectedUser.order_id;
  const isActive = statusChoice === "activate";

  try {
    const res = await api.put(
      `/OrderItem/toggle-status/${orderId}?isActive=${isActive}`
    );

    // ✅ Update UI from known state
    setActiveStatus(prev => ({
      ...prev,
      [orderId]: isActive,
    }));

    console.log(res.data.message);

  } catch (error) {
    console.error("Failed to update order status", error);
    alert("Failed to update order status. Please try again.");
  } finally {
    setShowConfirm(false);
    setSelectedUser(null);
    setStatusChoice(null);
  }
};





  //  Handle View Product
 


  const filteredOrders = useMemo(() => {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return orders;

  return orders.filter((o) => {
    return (
      String(o.order_id ?? "").toLowerCase().includes(term) ||
      String(o.order_item_id ?? "").toLowerCase().includes(term) ||
      String(o.product_name ?? "").toLowerCase().includes(term) ||
      String(o.product_price ?? "").toLowerCase().includes(term) ||
      String(o.product_quantity ?? "").toLowerCase().includes(term)
    );
  });
}, [orders, searchTerm]);

const dateFilteredOrders = useMemo(() => {
  if (!fromDate && !toDate) return filteredOrders;

  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;

  return filteredOrders.filter((o) => {
    if (!o.created_at) return false;

    const rowDate = new Date(o.created_at);

    if (from && rowDate < from) return false;
    if (to && rowDate > to) return false;

    return true;
  });
}, [filteredOrders, fromDate, toDate]);




 const sortedOrders = useMemo(() => {
  if (!sortConfig.key) return dateFilteredOrders;

  return [...dateFilteredOrders].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
}, [dateFilteredOrders, sortConfig]);


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <FaSortUp className="ms-1" />
      ) : (
        <FaSortDown className="ms-1" />
      );
    }
    return <FaSort className="ms-1" />;
  };

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const getColumnHeaders = () => {
    const headers = [];
    for (const key of Object.keys(visibleColumns)) {
      if (visibleColumns[key]) {
        headers.push({
          key,
          label:
            key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()) || key,
        });
      }
    }

    headers.push({
    key: 'deactivate',
    label: 'Status',
    style: { width: '100px' }
});
    headers.push({
      key: 'action',
      label: 'Action',
      style: { width: '100px' }
    });

    return headers;
  };

  const columnHeaders = getColumnHeaders();

  return (
    <div className="container">
      <div className="row">
        <div className="category-table pb-3">
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
            Orders List
          </h4>

          {/* Filter + Search + Export Section */}
          <div
            className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
            style={{ backgroundColor: "#FEC200", flexWrap: "nowrap" }}
          >
            {/* From/To Filter */}
            <div className="d-flex align-items-center">
              <label className="text-white me-2 mb-0" style={{ fontWeight: "500" }}>
                From:
              </label>
             
              <input
              type="date"
              className="form-control form-control-sm me-2"
              style={{ height: "34px", width: "150px" }}
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
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
              <button
                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px" }}
                  onClick={() => setPage(1)}
                title="Apply Filter"
              >
                <FaTelegramPlane size={14} />
              </button>
            </div>

            {/* Search */}
            <div
              className="input-group align-items-center mx-3 py-2"
              style={{ maxWidth: "350px", width: "100%" }}
            >
              <input
                type="search"
                placeholder="Search orders..."
                className="form-control form-control-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-light btn-sm ms-0 d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px" }}
                title="Search"
              >
                <i className="fas fa-search" style={{ fontSize: "13px" }}></i>
              </button>
            </div>

            {/* Right Controls */}
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light btn-sm d-flex align-items-center justify-content-center me-2"
                style={{ height: "34px", width: "34px" }}
                title="Customize Columns"
                onClick={() => setShowColumnSettings(!showColumnSettings)}
              >
                <IoMdSettings size={16} />
              </button>
              <button
                className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px" }}
                title="Export to PDF"
                onClick={exportPDF}
              >
                <FaFilePdf size={16} />
              </button>
              <button
                className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px" }}
                title="Export to Excel"
                 onClick={exportCSV}
              >
                <FaFileExcel size={16} />
              </button>
            </div>
          </div>

          {/* Column Settings */}
          {showColumnSettings && (
            <div className="border p-3 mt-2 rounded">
              <h6>Customize Columns</h6>
              <div className="d-flex flex-wrap">
                {Object.keys(visibleColumns).map((key) => (
                  <div className="form-check me-3" key={key}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`${key}Check`}
                      checked={visibleColumns[key]}
                      onChange={() => toggleColumn(key)}
                    />
                    <label className="form-check-label" htmlFor={`${key}Check`}>
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div
            className="user-align"
            style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "500px",
            }}
          >
            <table
              className="table table-bordered table-striped"
              style={{ minWidth: "1200px", borderCollapse: "collapse" }}
            >
              <thead className="thead-dark">
                <tr>
                  {columnHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="admin-user-sub-heading pl-3 p-3 sorting sorting_asc"

                      style={{
                        whiteSpace: "nowrap",
                        border: "1px solid #dee2e6",
                        color: "#07486e",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort(header.key)}
                    >
                      {header.label} {getSortIcon(header.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* {sortedOrders.map((order, index) => ( */}
                  {sortedOrders.slice((page - 1) * pageSize, page * pageSize).map((order, index) => (

                  <tr key={index}>
                    {Object.keys(visibleColumns).map(
                      (key) =>
                        visibleColumns[key] && (
                          <td
                            key={key}
                            style={{
                              whiteSpace: "nowrap",
                              border: "1px solid #dee2e6",
                              color: "#645959",
                            }}
                          >
                            {/* <div className="d-flex justify-content-between align-items-center">
                              <span>{order[key]}</span>
                              <button
                                className="btn btn-sm ms-2 p-1"
                                onClick={() => copyToClipboard(order[key], index, key)}
                                title={`Copy ${key}`}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {copiedField.id === index &&
                                copiedField.field === key ? (
                                  <img
                                    src={checkIcon}
                                    alt="Copied"
                                    style={{ width: "18px", height: "18px" }}
                                  />
                                ) : (
                                  <MdContentCopy size={15} />
                                )}
                              </button>
                            </div> */}

                             <div className="d-flex justify-content-between align-items-center">
                  {/* Special handling for date column */}
                  {key === "order_date" ? (
                    <span>{formatDate(order[key])}</span>
                  ) : (
                    <span>{order[key] ?? "-"}</span>
                  )}

                  <button
                    className="btn btn-sm ms-2 p-1"
                    onClick={() =>
                      copyToClipboard(
                        key === "order_date"
                          ? formatDate(order[key])   // copy formatted date
                          : String(order[key] ?? ""),
                        order.order_item_id || index,
                        key
                      )
                    }
                    title={`Copy ${key.replace(/_/g, " ")}`}
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {copiedField.id === (order.order_item_id || index) &&
                    copiedField.field === key ? (
                      <img
                        src={checkIcon}
                        alt="Copied"
                        style={{ width: "18px", height: "18px" }}
                      />
                    ) : (
                      <MdContentCopy size={15} />
                    )}
                  </button>
                </div>

                          </td>
                        )
                    )}

                                       <td
                                  className="admin-user-option pl-3 p-3"
                                  style={{
                                    whiteSpace: 'nowrap',
                                    border: '1px solid #dee2e6',
                                    textAlign: 'center'
                                  }}
                                >
                                  <div
                                    onClick={() => handleToggleClick(order)}
                                    style={{
                                      width: '50px',
                                      height: '26px',
                                      borderRadius: '50px',
                                      backgroundColor: activeStatus[order.order_id] ? '#4CAF50' : '#f44336',
                                      position: 'relative',
                                      cursor: 'pointer',
                                      transition: 'background-color 0.3s ease'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        position: 'absolute',
                                        top: '2px',
                                        left: activeStatus[order.order_id] ? '26px' : '2px',
                                        transition: 'left 0.3s ease'
                                      }}
                                    ></div>
                                  </div>
                                </td>

                   

                  {/* action link     */}
                                                            <td
                                                              className="admin-user-option pl-3 p-3 sticky-action"
                                                              style={{
                                                                whiteSpace: 'nowrap',
                                                                border: '1px solid #dee2e6',
                                                                position: 'sticky',
                                                                right: 0,
                                                                backgroundColor: 'white',
                                                                zIndex: 1
                                                              }}
                                                            >
                                                              
                                        
                                                              <button
                                                              type="button"
                                                                className="btn btn-sm btn-outline-success me-1"
                                                                title="View"
                                                                onClick={() => handleView(order)}
                                                              >
                                                              <MdKeyboardArrowRight style={{ fontSize: "20px", lineHeight: 1 }}/> 
                                                              <MdKeyboardArrowRight style={{ fontSize: "20px", lineHeight: 1, marginLeft: "-15px" }} />
                                                              </button>
                                        
                                                              
                                                            </td> 
                                                          </tr>
                                                        ))}
                                                      </tbody>
                                                    </table>
                                                  </div>
                  

          {/* Pagination Placeholder */}
                                          {/* Pagination */}
<div className="row align-items-center">
  <div className="col-md-6 mt-3 d-flex align-items-center gap-2">
    <strong>Show</strong>

    <select
      className="form-select form-select-sm"
      style={{ width: "80px" }}
      value={pageSize >= sortedOrders.length ? "All" : pageSize}
      onChange={handlePageSizeChange}
    >
      {pageSizeOptions.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>

    <strong>
      entries | Showing {(page - 1) * pageSize + 1} to{" "}
      {Math.min(page * pageSize, sortedOrders.length)} of{" "}
      {sortedOrders.length}
    </strong>
  </div>

  <div className="col-md-6">
    <nav>
      <ul className="pagination justify-content-end mt-3">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <MdKeyboardArrowLeft />
            <MdKeyboardArrowLeft style={{ marginLeft: "-15px" }} />
            Previous
          </button>
        </li>

        <li className="page-item active">
          <span className="page-link">Page {page}</span>
        </li>

        <li
          className={`page-item ${
            page * pageSize >= sortedOrders.length ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <MdKeyboardArrowRight />
            <MdKeyboardArrowRight style={{ marginLeft: "-15px" }} />
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>

                    
                      {showConfirm && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        padding: '25px 30px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
        width: '570px', // ⬅️ Matches popup size from your image
        maxWidth: '100%',
        height:'200px'
      }}
    >
      {/* ✅ Updated Title */}
      <h5 className="mb-3" style={{ fontWeight: '600', textAlign: 'left' }}>
        Are you sure to change the status?
      </h5>

      {/* ✅ Side-by-side checkboxes */}
      <div
        className="d-flex justify-content-left mb-4"
        style={{ gap: '30px' ,textDecoration:'none'}}
      >
        <div className="form-check"
                           style={{ fontSize:'17px' }}

        
        >
          <input
            className="form-check-input"
            type="checkbox"
            id="activateCheck"
            checked={statusChoice === 'activate'}
            onChange={() => setStatusChoice('activate')}
          />
          <label className="form-check-label ms-1" htmlFor="activateCheck"
           style={{ textDecoration: 'none', cursor: 'pointer',fontSize:'17px' }}
          >
            Activate
          </label>
        </div>

        <div className="form-check"
                   style={{ fontSize:'17px' }}

        >
          <input
            className="form-check-input"
            type="checkbox"
            id="deactivateCheck"
            checked={statusChoice === 'deactivate'}
            onChange={() => setStatusChoice('deactivate')}
          />
          <label className="form-check-label ms-1" htmlFor="deactivateCheck"
           style={{ textDecoration: 'none', cursor: 'pointer', fontSize:'17px' }}
          >
            Deactivate
          </label>
        </div>
      </div>

      {/* ✅ Buttons styled like your uploaded popup */}
      <div className="d-flex justify-content-end gap-2 mt-2">
        <button
          className="btn btn-outline-secondary"
          style={{
            minWidth: '90px',
            borderRadius: '6px'
          }}
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-danger"
          style={{
            minWidth: '90px',
            borderRadius: '6px'
          }}
          onClick={handleSubmitStatus}
          disabled={!statusChoice}
        >
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

export default OrdersList;

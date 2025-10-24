import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from 'react-icons/md';


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
  const copyToClipboard = (text, id, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField({ id, field });
      setTimeout(() => {
        setCopiedField({ id: null, field: null });
      }, 2000);
    });
  };

  //  Hardcoded sample data
  const [orders] = useState([
    {
      order_id:'1',
      product_name:'tree',
      product_price:'2000',
      product_quantity:'1',
      order_date: "2025-09-29",
      ordrs_CrtdAt: "2025-09-29 11:00 AM",
      ordrs_CrtdBy: "Admin",
      ordrs_UpdtdAt: "2025-09-30 10:15 AM",
      ordrs_UpdtdBy: "Admin",
      
    },
    {
      order_id:'2',
      product_name:'palm tree',
      product_price:'1000',
      product_quantity:'1',
      order_date: "2025-10-03",
      ordrs_CrtdAt: "2025-10-03 09:45 AM",
      ordrs_CrtdBy: "Manager",
      ordrs_UpdtdAt: "2025-10-05 02:00 PM",
      ordrs_UpdtdBy: "Manager",
      
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    order_id:true,
    product_name:true,
    product_price:true,
    product_quantity:true,
    order_date: true,
    ordrs_CrtdAt: true,
    ordrs_CrtdBy: true,
    ordrs_UpdtdAt: true,
    ordrs_UpdtdBy: true,
    
  });


  //  Handle View Product
  const handleView = (order) => {
  const orderData = { ...order, description: "Sample order details" };
  const orderHistory = [
    { srNo: 1, date: "21/10/2025", action: "Created", by: "Admin" },
    { srNo: 2, date: "22/10/2025", action: "Updated", by: "Admin" }
  ];

  // navigate(`/order-details/${order.order_id}`, {
  //   state: { orderData, orderHistory, mode: "view" },
  // });
  navigate(`/order-details`, {
    state: { orderData, orderHistory, mode: "view" },
  });
};


  //  Handle Edit Product
  const handleEdit = (product) => {
    const productData = { ...product, description: "Sample product description" };
    const productHistory = [
      { srNo: 1, date: "21/10/2025", action: "Created", by: "Admin" },
      { srNo: 2, date: "22/10/2025", action: "Updated", by: "Admin" }
    ];

    navigate(`/product-edit/${product.id}`, {
      state: { productData, productHistory, mode: 'edit' }
    });
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter((o) =>
      Object.values(o)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortConfig]);

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
              />
              <label className="text-white me-2 mb-0" style={{ fontWeight: "500" }}>
                To:
              </label>
              <input
                type="date"
                className="form-control form-control-sm me-2"
                style={{ height: "34px", width: "150px" }}
              />
              <button
                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px" }}
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
                className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
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
              >
                <FaFilePdf size={16} />
              </button>
              <button
                className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px" }}
                title="Export to Excel"
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
              overflowY: "hidden",
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
                      className="pl-3 p-3 sorting sorting_asc"
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
                {sortedOrders.map((order, index) => (
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
                            <div className="d-flex justify-content-between align-items-center">
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
                            </div>
                          </td>
                        )
                    )}

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
          <div className="mt-3 text-center">
            <strong>
              Showing 1 to {sortedOrders.length} of {sortedOrders.length} entries
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;

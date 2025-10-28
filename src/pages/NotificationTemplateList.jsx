import React, { useState, useMemo } from "react";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaFilePdf,
  FaFileExcel,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
} from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { useNavigate } from "react-router-dom";

const NotificationTemplateList = () => {
  const navigate = useNavigate();

  const [copiedField, setCopiedField] = useState({ id: null, field: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [visibleColumns, setVisibleColumns] = useState({
    template_id: true,
    template_name: true,
    subject: true,
    created_at: true,
  });

  // ✅ Sample Data
  const [templates] = useState([
    {
      template_id: 1,
      template_name: "Order Confirmation",
      subject: "Your Order #{order_id} is Confirmed!",
      created_at: "2025-10-21",
    },
    {
      template_id: 2,
      template_name: "Shipping Update",
      subject: "Your Order #{order_id} has been Shipped!",
      created_at: "2025-10-22",
    },
  ]);

  // ✅ Copy field value
  const copyToClipboard = (text, id, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField({ id, field });
      setTimeout(() => setCopiedField({ id: null, field: null }), 2000);
    });
  };

  // ✅ Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
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

  // ✅ Search & Sort Logic
  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return templates;
    return templates.filter(
      (t) =>
        t.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.template_id.toString().includes(searchTerm)
    );
  }, [templates, searchTerm]);

  const sortedTemplates = useMemo(() => {
    if (!sortConfig.key) return filteredTemplates;
    return [...filteredTemplates].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTemplates, sortConfig]);

  // ✅ Toggle columns
  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // ✅ Handle actions
  const handleEdit = (template) => {
    navigate(`/notification-template-edit/${template.template_id}`, {
      state: { template, mode: "edit" },
    });
  };

  const handleView = (template) => {
    navigate(`/notification-template-details`, {
      state: { template, mode: "view" },
    });
  };

  // ✅ Column Headers
  const columnHeaders = [
    visibleColumns.template_id && { key: "template_id", label: "Template ID" },
    visibleColumns.template_name && { key: "template_name", label: "Template Name" },
    visibleColumns.subject && { key: "subject", label: "Subject" },
    visibleColumns.created_at && { key: "created_at", label: "Created At" },
    { key: "action", label: "Action" },
  ].filter(Boolean);

  return (
    <div className="container">
      <div className="row">
        <div className="category-table pb-3">
          {/* Header */}
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
            Notification Template List
          </h4>

          {/* Top Controls */}
          <div
            className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
            style={{ backgroundColor: "#FEC200", flexWrap: "nowrap" }}
          >
            {/* Left: Date Filters */}
            <div className="d-flex align-items-center">
              <label className="text-white me-2 mb-0 fw-semibold">From:</label>
              <input
                type="date"
                className="form-control form-control-sm me-2"
                style={{ height: "34px", width: "150px" }}
              />
              <label className="text-white me-2 mb-0 fw-semibold">To:</label>
              <input
                type="date"
                className="form-control form-control-sm me-2"
                style={{ height: "34px", width: "150px" }}
              />
              <button
                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px", padding: 0 }}
                title="Apply Filter"
              >
                <FaTelegramPlane size={14} />
              </button>
            </div>

            {/* Center: Search */}
            <div
              className="input-group align-items-center mx-3 py-2"
              style={{ maxWidth: "350px", width: "100%" }}
            >
              <input
                type="search"
                placeholder="Search by ID, Name, or Subject..."
                className="form-control form-control-sm"
                style={{ height: "34px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px", padding: 0 }}
              >
                <i className="fas fa-search" style={{ fontSize: "13px" }}></i>
              </button>
            </div>

            {/* Right: Settings / Export / Create */}
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
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

              {/* ✅ Create New Template Button */}
              <button
                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: "34px", width: "34px" }}
                title="Create New Notification Template"
                onClick={() => navigate("/notification-template-create")}
              >
                <FaPlus size={16} />
              </button>
            </div>
          </div>

          {/* Column Settings */}
          {showColumnSettings && (
            <div className="border p-3 mt-2 rounded">
              <h6>Customize Columns</h6>
              <div className="d-flex flex-wrap">
                {Object.keys(visibleColumns).map((col) => (
                  <div className="form-check me-3" key={col}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`${col}Check`}
                      checked={visibleColumns[col]}
                      onChange={() => toggleColumn(col)}
                    />
                    <label className="form-check-label" htmlFor={`${col}Check`}>
                      {col.replace("_", " ").toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div
            className="user-align"
            style={{ overflowX: "auto", overflowY: "hidden", maxHeight: "500px" }}
          >
            <table
              id="templateTable"
              className="table table-bordered table-striped dataTable no-footer"
              style={{ minWidth: "900px", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  {columnHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="admin-user-sub-heading pl-3 p-3 sorting sorting_asc"

                      style={{
                        border: "1px solid #dee2e6",
                        whiteSpace: "nowrap",
                        cursor: header.key !== "action" ? "pointer" : "default",
                        color: "#07486e",
                        ...(header.key === "action"
                          ? {
                              position: "sticky",
                              right: 0,
                              zIndex: 10,
                              backgroundColor: "#f8f9fa",
                            }
                          : {}),
                      }}
                      onClick={() =>
                        header.key !== "action" && handleSort(header.key)
                      }
                    >
                      {header.label}{" "}
                      {header.key !== "action" && getSortIcon(header.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedTemplates.map((t, index) => (
                  <tr key={t.template_id} className={index % 2 === 0 ? "even" : "odd"}>
                    {visibleColumns.template_id && (
                      <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>

                      <div className="d-flex justify-content-between align-items-center">
                        <span>{t.template_id}</span>

                        <button
                          className="btn btn-sm p-1 ms-2"
                          onClick={() => copyToClipboard(t.template_id, t.template_id, "template_id")}
                        >
                          {copiedField.id === t.template_id && copiedField.field === "template_id" ? (
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
                      
                    )}
                    
                    {visibleColumns.template_name && (
                  <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                    <span>{t.template_name}</span>
                    <button
                      className="btn btn-sm p-1 ms-2"
                      onClick={() =>
                        copyToClipboard(t.template_name, t.template_id, "template_name")
                      }
                    >
                      {copiedField.id === t.template_id &&
                      copiedField.field === "template_name" ? (
                        <img
                          src={checkIcon}
                          alt="Copied"
                          style={{ width: "18px", height: "18px" }}
                        />
                      ) : (
                        <MdContentCopy size={15} />
                      )}
                    </button>
                  </td>
                )}

                    

                    {visibleColumns.subject && (
                      <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                        <span>{t.subject}</span>
                        <button
                          className="btn btn-sm p-1 ms-2"
                          onClick={() =>
                            copyToClipboard(t.subject, t.template_id, "subject")
                          }
                        >
                          {copiedField.id === t.template_id &&
                          copiedField.field === "subject" ? (
                            <img
                              src={checkIcon}
                              alt="Copied"
                              style={{ width: "18px", height: "18px" }}
                            />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </td>
                    )}
                   

                    {visibleColumns.created_at && (
                    <td style={{ border: "1px solid #dee2e6" }}>
                      <span>{t.created_at}</span>
                      <button
                        className="btn btn-sm p-1 ms-2"
                        onClick={() =>
                          copyToClipboard(t.created_at, t.template_id, "created_at")
                        }
                      >
                        {copiedField.id === t.template_id &&
                        copiedField.field === "created_at" ? (
                          <img
                            src={checkIcon}
                            alt="Copied"
                            style={{ width: "18px", height: "18px" }}
                          />
                        ) : (
                          <MdContentCopy size={15} />
                        )}
                      </button>
                    </td>
                  )}

                    {/* Actions */}
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        border: "1px solid #dee2e6",
                        position: "sticky",
                        right: 0,
                        backgroundColor: "white",
                      }}
                    >
                     

                      <button
                        className="btn btn-sm btn-outline-success me-1"
                        title="View"
                        onClick={() => handleView(t)}
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

          {/* Pagination */}
          <div className="row mt-3">
            <div className="col-md-6">
              <strong>
                Showing 1 to {sortedTemplates.length} of {sortedTemplates.length} entries
              </strong>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination d-flex justify-content-end w-100 mt-3">
                  <li className="page-item">
                    <a className="page-link" href="#">
                       <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1 }}/> 
                        <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1, marginLeft: "-15px" }} />
                      Previous
                    </a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">
                      Page 1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      Next
                      <MdKeyboardArrowRight style={{ fontSize: "20px", lineHeight: 1 }}/> 
                      <MdKeyboardArrowRight style={{ fontSize: "20px", lineHeight: 1, marginLeft: "-15px" }} />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplateList;

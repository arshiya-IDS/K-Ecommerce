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
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import api from "../api/axiosInstance";




const NotificationTemplateList = () => {
  const navigate = useNavigate();

  const [copiedField, setCopiedField] = useState({ id: null, field: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [activeStatus, setActiveStatus] = useState({});
const [showConfirm, setShowConfirm] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [statusChoice, setStatusChoice] = useState(null);
const protectedProductIds = [1, 2];

const handleToggleClick = (user) => {
  setSelectedUser(user);
  setStatusChoice(null);
  setShowConfirm(true);
};


 

  const [visibleColumns, setVisibleColumns] = useState({
    template_id: true,
    template_name: true,
    subject: true,
    created_at: true,
    deactivate:true,
  });

  // ✅ Sample Data
 const [templates, setTemplates] = useState([]);
useEffect(() => {
  fetchTemplates();
}, []);

const fetchTemplates = async () => {
  try {
    const res = await api.get(
      "/Product/NtfcnTemplate/list"
    );

    const data = res.data || [];

    // Map API response to UI structure
    setTemplates(
      data.map((t) => ({
        template_id: t.template_id,
        template_name: t.template_name,
        subject: t.subject,
        created_at: t.ntfcn_CrtdAt
          ? new Date(t.ntfcn_CrtdAt).toLocaleDateString()
          : "N/A",
        is_active: t.is_active,
      }))
    );

    // Initialize toggle status
    const statusMap = {};
    data.forEach((t) => {
      statusMap[t.template_id] = t.is_active;
    });
    setActiveStatus(statusMap);
  } catch (error) {
    console.error("Failed to load notification templates", error);
  }
};

const exportCSV = () => {
    window.open(`/Product/export?format=csv`, "_blank");
  };
  const exportPDF = () => {
    window.open(`/Product/export?format=pdf`, "_blank");
  };

const handleView = (row) => {
  // Navigate to dynamic route with product ID
  navigate(`/notification-template-details/${row.template_id}`);
};

  // ✅ Copy field value
 

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


 const handleSubmitStatus = async () => {
  if (!selectedUser || !statusChoice) return;

  const isActive = statusChoice === "activate";

  try {
    await api.put(
      `/NtfcnTemplate/${selectedUser.template_id}/toggle-status`,
      null,
      { params: { isActive } }
    );

    setActiveStatus(prev => ({
      ...prev,
      [selectedUser.template_id]: isActive,
    }));

  } catch (error) {
    console.error("Status update failed", error);
  } finally {
    setShowConfirm(false);
    setSelectedUser(null);
    setStatusChoice(null);
  }
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

  

  // ✅ Column Headers
  const columnHeaders = [
    visibleColumns.template_id && { key: "template_id", label: "Template ID" },
    visibleColumns.template_name && { key: "template_name", label: "Template Name" },
    visibleColumns.subject && { key: "subject", label: "Subject" },
    visibleColumns.created_at && { key: "created_at", label: "Created At" },
   visibleColumns.deactivate && { key: "deactivate", label: "Status" },
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
                className="btn btn-light btn-sm ms-0 d-flex align-items-center justify-content-center"
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
            style={{ overflowX: "auto", overflowY: "auto", maxHeight: "500px" }}
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

                    <td
                                  className="admin-user-option pl-3 p-3"
                                  style={{
                                    whiteSpace: 'nowrap',
                                    border: '1px solid #dee2e6',
                                    textAlign: 'center'
                                  }}
                                >
                                  <div
                                    onClick={() => handleToggleClick(t)}
                                    style={{
                                      width: '50px',
                                      height: '26px',
                                      borderRadius: '50px',
                                      backgroundColor: activeStatus[t.template_id] ? '#4CAF50' : '#f44336',
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
                                        left: activeStatus[t.template_id] ? '26px' : '2px',
                                        transition: 'left 0.3s ease'
                                      }}
                                    ></div>
                                  </div>
                                </td>

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

export default NotificationTemplateList;

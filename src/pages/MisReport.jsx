import React, { useState, useMemo } from 'react';
import { FaEye, FaPaperPlane, FaFilePdf, FaFileExcel, FaTelegramPlane, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

const MisReport = () => {
  // Sample data for reports with the requested columns
  const [reports] = useState([
    {
      id: 1,
      enquiryId: 'ENQ001',
      status: 'Pending',
      createdAt: '02-06-2022',
      fullName: 'John Doe',
      contactNo: '+91 50123 14567',
      location: 'Dubai, UAE',
      email: 'john@example.com',
      category: 'Product Inquiry',
      message: 'I would like to know more about your products.'
    },
    {
      id: 2,
      enquiryId: 'ENQ002',
      status: 'Resolved',
      createdAt: '07-06-2022',
      fullName: 'Jane Smith',
      contactNo: '+91 50234 45678',
      location: 'Abu Dhabi, UAE',
      email: 'jane@example.com',
      category: 'Support Request',
      message: 'I need help with my recent purchase.'
    },
    {
      id: 3,
      enquiryId: 'ENQ003',
      status: 'In Progress',
      createdAt: '09-06-2022',
      fullName: 'Robert Johnson',
      contactNo: '+91 50345 6789',
      location: 'Sharjah, UAE',
      email: 'robert@example.com',
      category: 'Feedback',
      message: 'Great service, but delivery was delayed.'
    },
    {
      id: 4,
      enquiryId: 'ENQ004',
      status: 'Pending',
      createdAt: '10-06-2022',
      fullName: 'Sarah Wilson',
      contactNo: '+971 50 456 7890',
      location: 'Ajman, UAE',
      email: 'sarah@example.com',
      category: 'Product Inquiry',
      message: 'When will the new product line be available?'
    },
    
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    enquiryId: true,
    status: true,
    createdAt: true,
    fullName: true,
    contactNo: true,
    location: true,
    email: true,
    category: true,
    message: true
  });
  const [copiedField, setCopiedField] = useState({ id: null, field: null });

  // Filter reports based on search term
  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;
    
    return reports.filter(report => 
      report.enquiryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.contactNo.includes(searchTerm) ||
      report.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  // Sort reports based on sort configuration
  const sortedReports = useMemo(() => {
    if (!sortConfig.key) return filteredReports;
    
    return [...filteredReports].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredReports, sortConfig]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the useMemo hook
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
    }
    return <FaSort className="ms-1" />;
  };

  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Copy text to clipboard
  const copyToClipboard = async (text, reportId, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField({ id: reportId, field });
      setTimeout(() => setCopiedField({ id: null, field: null }), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getColumnHeaders = () => {
    const headers = [];
    
    if (visibleColumns.enquiryId) {
      headers.push({
        key: 'enquiryId',
        label: 'Enquiry ID',
        style: { width: '100px' }
      });
    }
    
    if (visibleColumns.status) {
      headers.push({
        key: 'status',
        label: 'Status',
        style: { width: '100px' }
      });
    }
    
    if (visibleColumns.createdAt) {
      headers.push({
        key: 'createdAt',
        label: 'Created At',
        style: { width: '100px' }
      });
    }
    
    if (visibleColumns.fullName) {
      headers.push({
        key: 'fullName',
        label: 'Full Name',
        style: { width: '150px' }
      });
    }
    
    if (visibleColumns.contactNo) {
      headers.push({
        key: 'contactNo',
        label: 'Contact No',
        style: { width: '120px' }
      });
    }
    
    if (visibleColumns.location) {
      headers.push({
        key: 'location',
        label: 'Location',
        style: { width: '120px' }
      });
    }
    
    if (visibleColumns.email) {
      headers.push({
        key: 'email',
        label: 'Email',
        style: { width: '150px' }
      });
    }
    
    if (visibleColumns.category) {
      headers.push({
        key: 'category',
        label: 'Category',
        style: { width: '130px' }
      });
    }
    
    if (visibleColumns.message) {
      headers.push({
        key: 'message',
        label: 'Message',
        style: { width: '200px' }
      });
    }
    
    return headers;
  };

  const columnHeaders = getColumnHeaders();

  return (
    <div className="container ">
      <div className="row">
        <div className="category-table  pb-3 ">
              <h4 className="py-2 pl-3 text-center p-4 mb-0" style={{ color: '#645959' }}>MIS Reports</h4>
<div
  className="category-1-heading d-flex justify-content-between align-items-center bg-success rounded-top px-1 py-1"
  style={{ backgroundColor: '#198754', flexWrap: 'nowrap' }}
>
  {/* Left: From / To Date + Filter */}
  <div className="d-flex align-items-center">
    <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>From:</label>
    <input
      type="date"
      className="form-control form-control-sm me-2"
      style={{ height: '34px', width: '150px', fontFamily: 'inherit', fontSize: 'inherit' }}
      title='From Date' 
    />
    <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>To:</label>
    <input
      type="date"
      className="form-control form-control-sm me-2"
      style={{ height: '34px', width: '150px', fontFamily: 'inherit', fontSize: 'inherit' }}
      title='To Date'
    />
    <button
      className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
      style={{ height: '34px', width: '34px', padding: 0 }}
      title="Apply Filter"
    >
      <FaTelegramPlane size={14} />
    </button>
  </div>

  {/* Center: Search Bar */}
  <div
    className="input-group align-items-center mx-3 py-2"
    style={{ maxWidth: '350px', width: '100%' }}
  >
    <input
      type="search"
      placeholder="Search by ID, Name, Contact, Email, Location..."
      className="form-control form-control-sm"
      style={{ height: '34px', fontFamily: 'inherit', fontSize: 'inherit' }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button
      type="button"
      className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
      style={{ height: '34px', width: '34px', padding: 0 }}
      title="Search"
      onClick={handleSearch}
    >
      <i className="fas fa-search" style={{ fontSize: '13px' }}></i>
    </button>
  </div>

  {/* Right: Settings, Export, Create */}
  <div className="d-flex align-items-center">
    {/* Settings Button */}
    <button
      className="btn btn-light btn-sm d-flex align-items-center justify-content-center me-2"
      style={{ height: '34px', width: '34px', padding: 0 }}
      title="Customize Columns"
      onClick={() => setShowColumnSettings(!showColumnSettings)}
    >
      <IoMdSettings size={16} />
    </button>

    {/* PDF Export */}
    <button
      className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
      style={{ height: '34px', width: '34px', padding: 0 }}
      title="Export to PDF"
    >
      <FaFilePdf size={16} />
    </button>

    {/* Excel Export */}
    <button
      className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
      style={{ height: '34px', width: '34px', padding: 0 }}
      title="Export to Excel"
    >
      <FaFileExcel size={16} />
    </button>

    {/* Create Button */}
   <button
                   className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                   style={{ height: '34px', width: '34px', padding: 0 }}
                   title="Create New Enquiry"
                   onClick={() => navigate('/enquiry-form')}
                 >
                   <FaPlus size={16} />
                 </button>
  </div>
</div>

          {/* Column Settings Panel */}
          {showColumnSettings && (
            <div className="border p-3 mt-2 rounded">
              <h6>Customize Columns</h6>
              <div className="d-flex flex-wrap">
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="enquiryIdCheck"
                    checked={visibleColumns.enquiryId}
                    onChange={() => toggleColumn('enquiryId')}
                  />
                  <label className="form-check-label" htmlFor="enquiryIdCheck">
                    Enquiry ID
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="statusCheck"
                    checked={visibleColumns.status}
                    onChange={() => toggleColumn('status')}
                  />
                  <label className="form-check-label" htmlFor="statusCheck">
                    Status
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="createdAtCheck"
                    checked={visibleColumns.createdAt}
                    onChange={() => toggleColumn('createdAt')}
                  />
                  <label className="form-check-label" htmlFor="createdAtCheck">
                    Created At
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="fullNameCheck"
                    checked={visibleColumns.fullName}
                    onChange={() => toggleColumn('fullName')}
                  />
                  <label className="form-check-label" htmlFor="fullNameCheck">
                    Full Name
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="contactNoCheck"
                    checked={visibleColumns.contactNo}
                    onChange={() => toggleColumn('contactNo')}
                  />
                  <label className="form-check-label" htmlFor="contactNoCheck">
                    Contact No
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="locationCheck"
                    checked={visibleColumns.location}
                    onChange={() => toggleColumn('location')}
                  />
                  <label className="form-check-label" htmlFor="locationCheck">
                    Location
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailCheck"
                    checked={visibleColumns.email}
                    onChange={() => toggleColumn('email')}
                  />
                  <label className="form-check-label" htmlFor="emailCheck">
                    Email
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="categoryCheck"
                    checked={visibleColumns.category}
                    onChange={() => toggleColumn('category')}
                  />
                  <label className="form-check-label" htmlFor="categoryCheck">
                    Category
                  </label>
                </div>
                <div className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="messageCheck"
                    checked={visibleColumns.message}
                    onChange={() => toggleColumn('message')}
                  />
                  <label className="form-check-label" htmlFor="messageCheck">
                    Message
                  </label>
                </div>
              </div>
            </div>
          )}

         
         

          <div className="user-align" style={{overflowX: 'auto', overflowY: 'auto', maxHeight: '500px'}}>
            <table id="myTable" className="table table-bordered table-striped dataTable no-footer" aria-describedby="myTable_info" style={{minWidth: '1100px', borderCollapse: 'collapse'}}>
              <thead className="thead-dark">
               <tr>
  {columnHeaders.map(header => (
    <th
      key={header.key}
      className={`admin-user-sub-heading pl-3 p-3 sorting sorting_asc ${
        header.key === 'action' ? 'sticky-action' : ''
      }`}
      tabIndex="0"
      aria-controls="myTable"
      rowSpan="1"
      colSpan="1"
      aria-sort="ascending"
      aria-label={`${header.label}: activate to sort column descending`}
      style={{
        ...header.style,
        whiteSpace: 'nowrap',
        border: '1px solid #dee2e6',
        cursor: header.key !== 'action' ? 'pointer' : 'default',
        color: '#07486e', // applied to all header cells
        ...(header.key === 'action'
          ? {
              position: 'sticky',
              right: 0,
              zIndex: 10,
              backgroundColor: '#f8f9fa'
            }
          : {})
      }}
      onClick={() => header.key !== 'action' && handleSort(header.key)}
    >
      {header.label} {header.key !== 'action' && getSortIcon(header.key)}
    </th>
  ))}
</tr>

              </thead>
              <tbody>
                {sortedReports.map((report, index) => (
                  <tr key={report.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {visibleColumns.enquiryId && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{report.enquiryId}</td>
                    )}
                    {visibleColumns.status && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <span className={`badge ${report.status === 'Pending' ? 'bg-warning' : report.status === 'Resolved' ? 'bg-success' : 'bg-primary'}`}>
                          {report.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.createdAt && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{report.createdAt}</td>
                    )}
                    {visibleColumns.fullName && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{report.fullName}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm ms-2 p-1"
                              onClick={() => copyToClipboard(report.fullName, report.id, 'fullName')}
                              title="Copy Full Name"
                            >
                              <MdContentCopy size={12} />
                            </button>
                            {copiedField.id === report.id && copiedField.field === 'fullName' && (
                              <span className="text-success ms-1" style={{ fontSize: '12px' }}>Copied!</span>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.contactNo && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{report.contactNo}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm ms-2 p-1"
                              onClick={() => copyToClipboard(report.contactNo, report.id, 'contactNo')}
                              title="Copy Contact Number"
                            >
                              <MdContentCopy size={12} />
                            </button>
                            {copiedField.id === report.id && copiedField.field === 'contactNo' && (
                              <span className="text-success ms-1" style={{ fontSize: '12px' }}>Copied!</span>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.location && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{report.location}</td>
                    )}
                    {visibleColumns.email && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{report.email}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm ms-2 p-1"
                              onClick={() => copyToClipboard(report.email, report.id, 'email')}
                              title="Copy Email"
                            >
                              <MdContentCopy size={12} />
                            </button>
                            {copiedField.id === report.id && copiedField.field === 'email' && (
                              <span className="text-success ms-1" style={{ fontSize: '12px' }}>Copied!</span>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.category && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{report.category}</td>
                    )}
                    {visibleColumns.message && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{report.message}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mt-3">
                <strong>Showing 1 to {sortedReports.length} of {sortedReports.length} entries</strong>
              </div>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination d-flex justify-content-end w-100 mt-3">
                  <li className="page-item" aria-current="page">
                    <a className="page-link" href="#">Previous <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Page 1</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
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

export default MisReport;
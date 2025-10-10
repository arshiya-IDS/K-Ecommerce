import React, { useState, useMemo } from 'react';
import { FaEdit, FaEye, FaTrash, FaPaperPlane, FaFilePdf, FaFileExcel, FaSearch, FaTelegramPlane, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy, MdKeyboardArrowRight } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { MdKeyboardArrowLeft } from "react-icons/md";


const Enquiry = () => {
  const navigate = useNavigate();
  
  const [copiedField, setCopiedField] = useState({ id: null, field: null });
     const copyToClipboard = (text, id, field) => {
    navigator.clipboard.writeText(text).then(() => {
      // Mark which row & field is copied
      setCopiedField({ id, field });
  
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedField({ id: null, field: null });
      }, 2000);
    });
  };
  // Sample data for enquiries with the requested columns
  const [enquiries] = useState([
    {
      id: 1,
      enquiryId: 'ENQ001',
      status: 'Pending',
      createdAt: '10-06-2022',
      fullName: 'John Doe',
      contactNo: '+91 50123 14567',
      category: 'Product Inquiry',
      location: 'Dubai, UAE',
      email: 'john@example.com'
    },
    {
      id: 2,
      enquiryId: 'ENQ002',
      status: 'Resolved',
      createdAt: '09-06-2022',
      fullName: 'Jane Smith',
      contactNo: '+91 50123 14567',
      category: 'Support Request',
      location: 'Abu Dhabi, UAE',
      email: 'jane@example.com'
    },
    {
      id: 3,
      enquiryId: 'ENQ003',
      status: 'In Progress',
      createdAt: '08-06-2022',
      fullName: 'Robert Johnson',
      contactNo: '+91 50123 14567',
      category: 'Feedback',
      location: 'Sharjah, UAE',
      email: 'robert@example.com'
    },
    {
      id: 4,
      enquiryId: 'ENQ004',
      status: 'Pending',
      createdAt: '07-06-2022',
      fullName: 'Sarah Wilson',
      contactNo: '+91 50123 14567',
      category: 'Product Inquiry',
      location: 'Ajman, UAE',
      email: 'sarah@example.com'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    enquiryId: true,
    status: true,
    createdAt: true,
    fullName: true,
    contactNo: true,
    category: true,
    location: true,
    email: true
  });
  //const [copiedField, setCopiedField] = useState({ id: null, field: null });

  const handleView = (enquiry) => {
    // In a real app, you would fetch the full enquiry details from the backend
    const enquiryData = {
      enquiryId: enquiry.enquiryId,
      contactNo: enquiry.contactNo,
      email: enquiry.email,
      message: "This is a sample message for the enquiry.",
      createdAt: enquiry.createdAt,
      fullName: enquiry.fullName,
      location: enquiry.location,
      category: enquiry.category,
      status: enquiry.status,
    };
    
    const enquiryInfo = [
      {
        srNo: 1,
        dateTime: "26/08/2025, 19:14:02",
        userName: "Tax Ustaad Admin",
        status: "Assigned",
        remark: "Please Process",
      },
      {
        srNo: 2,
        dateTime: "30/08/2025, 15:58:43",
        userName: "Tax Ustaad Admin",
        status: "Closed",
        remark: "-",
      },
    ];
    
    navigate(`/enquiry/${enquiry.id}`, { 
      state: { 
        enquiryData, 
        enquiryInfo, 
        mode: 'view' 
      } 
    });
  };

  const handleEdit = (enquiry) => {
    // In a real app, you would fetch the full enquiry details from the backend
    const enquiryData = {
      enquiryId: enquiry.enquiryId,
      contactNo: enquiry.contactNo,
      email: enquiry.email,
      message: "This is a sample message for the enquiry.",
      createdAt: enquiry.createdAt,
      fullName: enquiry.fullName,
      location: enquiry.location,
      category: enquiry.category,
      status: enquiry.status,
    };
    
    const enquiryInfo = [
      {
        srNo: 1,
        dateTime: "26/08/2025, 19:14:02",
        userName: "Tax Ustaad Admin",
        status: "Assigned",
        remark: "Please Process",
      },
      {
        srNo: 2,
        dateTime: "30/08/2025, 15:58:43",
        userName: "Tax Ustaad Admin",
        status: "Closed",
        remark: "-",
      },
    ];
    
    navigate(`/enquiry/${enquiry.id}`, { 
      state: { 
        enquiryData, 
        enquiryInfo, 
        mode: 'edit' 
      } 
    });
  };
  
  // Filter enquiries based on search term
  const filteredEnquiries = useMemo(() => {
    if (!searchTerm) return enquiries;
    
    return enquiries.filter(enquiry => 
      enquiry.enquiryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.contactNo.includes(searchTerm) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.createdAt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enquiries, searchTerm]);

  // Sort enquiries based on sort configuration
  const sortedEnquiries = useMemo(() => {
    if (!sortConfig.key) return filteredEnquiries;
    
    return [...filteredEnquiries].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredEnquiries, sortConfig]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the useMemo hook
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'asc';
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
  // const copyToClipboard = async (text, enquiryId, field) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     setCopiedField({ id: enquiryId, field });
  //     setTimeout(() => setCopiedField({ id: null, field: null }), 2000); // Reset after 2 seconds
  //   } catch (err) {
  //     console.error('Failed to copy text: ', err);
  //   }
  // };

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
    
    if (visibleColumns.category) {
      headers.push({
        key: 'category',
        label: 'Category',
        style: { width: '130px' }
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
    
    // Action column is always visible
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
        <div className="category-table  pb-3 ">
         <h4 className="py-2 pl-3 text-center p-4 mb-0" style={{ color: 'white', background:'#236c68',border:'1px solid',marginTop:'10px',borderRadius:'6px' }}>Enquiry</h4>
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
                <FaSearch />
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
      className={`admin-user-sub-heading pl-3 p-3 sorting sorting_desc ${
        header.key === 'action' ? 'sticky-action' : ''
      }`}
      tabIndex="0"
      aria-controls="myTable"
      rowSpan="1"
      colSpan="1"
      aria-sort="descending"
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
                {sortedEnquiries.map((enquiry, index) => (
                  <tr key={enquiry.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {visibleColumns.enquiryId && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{enquiry.enquiryId}</td>
                    )}
                    {visibleColumns.status && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                       <span
                            className={`badge ${
                              enquiry.status === 'Pending'
                                ? 'bg-warning'
                                : enquiry.status === 'Resolved'
                                ? 'bg-success'
                                : 'bg-primary'
                            }`}
                            style={{
                              minWidth: "100px",   // keeps them equal size
                              textAlign: "center", // centers text
                              display: "inline-block",
                              padding: "0.5em 0",
                              fontSize: "0.9rem",
                              borderRadius: "12px"
                            }}
                          >
                            {enquiry.status}
                          </span>

                                                </td>
                    )}
                    {visibleColumns.createdAt && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{enquiry.createdAt}</td>
                    )}
                    {visibleColumns.fullName && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{enquiry.fullName}</span>
                          <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-m ms-2 p-1"
                              onClick={() => copyToClipboard(enquiry.fullName, enquiry.id, 'fullName')}
                              title="Copy Full Name"
                               style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                            >


                             {copiedField.id === enquiry.id &&
                                             copiedField.field === "fullName" ? (
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
                                       </div>
                                     </td>
                                   )}
                    {visibleColumns.contactNo && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{enquiry.contactNo}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-m ms-2 p-1"
                              onClick={() => copyToClipboard(enquiry.contactNo, enquiry.id, 'contactNo')}
                              title="Copy Contact Number"
                               style={{
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                }}
                            >
  
                           {copiedField.id === enquiry.id &&
                                           copiedField.field === "contactNo" ? (
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
                                     </div>
                                   </td>
                                 )}
                    {visibleColumns.category && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{enquiry.category}</td>
                    )}
                    {visibleColumns.location && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{enquiry.location}</td>
                    )}
                    {visibleColumns.email && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{enquiry.email}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-m ms-2 p-1"  
                              onClick={() => copyToClipboard(enquiry.email, enquiry.id, 'email')}
                              title="Copy Email"
                               style={{
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
          }}
                            >

                             {copiedField.id === enquiry.id && copiedField.field === "email" ? (
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
                                                     </div>
                                                   </td>
                                                 )}
                    <td className={`admin-user-option pl-3 p-3 sticky-action`} style={{
                      whiteSpace: 'nowrap', 
                      border: '1px solid #dee2e6',
                      position: 'sticky',
                      right: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                      color: '#645959'
                    }}>
                      {/* <a 
                        href="#" 
                        className="btn btn-sm btn-outline-info subscription-edit mr-1" 
                        data-toggle="modal" 
                        data-target="#myModal"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(enquiry);
                        }}
                      >
                        <FaEdit size={18} />
                      </a> */}
                      <a 
                        href="#" 
                        className="btn btn-sm btn-outline-success mr-1"
                        onClick={(e) => {
                          e.preventDefault();
                          handleView(enquiry);
                        }}
                      >
                        <img src= "/images/icons/right.png" alt="view" width={18}/>
                        {/* <FaEye size={18} /> */}
                      </a>
                      {/* <a href="#" className="btn btn-sm btn-outline-danger" id={`modal-btn-open-${enquiry.id}`}>
                        <FaTrash size={18} />
                      </a> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mt-3">
                <strong>Showing 1 to {sortedEnquiries.length} of {sortedEnquiries.length} entries</strong>
              </div>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination d-flex justify-content-end w-100 mt-3">
                  <li className="page-item" aria-current="page">
                    
                       {
                       <a className="page-link" style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px", // spacing between arrow and text
                      fontSize: "15px", // adjust this to your desired text size
             }} href="#">
                       <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1 }}/> 
                       <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1, marginLeft: "-18px" }} />
                       Previous
                       </a> }

                    
                     </li>
                     <li className="page-item active">
                     <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Page 1</a>
                     </li>
                     <li className="page-item">
                      <a className="page-link" style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px", // spacing between arrow and text
                      fontSize: "15px", // adjust this to your desired text size
                     }} href="#">Next
                      <MdKeyboardArrowRight style={{ fontSize: "20px", lineHeight: 1 }}/> 
                       <MdKeyboardArrowRight style={{ fontSize: "20px", lineHeight: 1, marginLeft: "-18px" }} />
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

export default Enquiry;
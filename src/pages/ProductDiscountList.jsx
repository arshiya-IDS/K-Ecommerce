import React, { useState, useMemo } from 'react';
import { FaEdit, FaEye, FaTrash, FaPaperPlane, FaFilePdf, FaFileExcel, FaTelegramPlane, FaSort, FaSortUp, FaSortDown, FaCopy } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';


const ProductDiscountList = () => {
  // Sample data for users with the requested columns

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
  const [users] = useState([
    {
      id: 1,
      name: 'Diwali Discount',
      email: '10%',
      phoneNumber: '1000',
      createdAt: '900',
      formAttime:'02-10-2025',

    },
    {
      id: 2,
      name: 'Winter Sale',
      email: '5%',
      phoneNumber: '2000',
      createdAt: '1900',
      formAttime:'02-10-2025',

    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    phoneNumber: true,
    createdAt: true,
    formAttime: true

  });

   //  Handle View Product
  const handleView = (product) => {
    const productData = { ...product, description: "Sample product description" };
    const productHistory = [
      { srNo: 1, date: "21/10/2025", action: "Created", by: "Admin" },
      { srNo: 2, date: "22/10/2025", action: "Updated", by: "Admin" }
    ];

     navigate(`/product-discount-details`, {
      state: { productData, productHistory, mode: 'view' }
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

  //const [copiedField, setCopiedField] = useState({ id: null, field: null });

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      user.createdAt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Sort users based on sort configuration
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    
    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

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
  // const copyToClipboard = async (text, userId, field) => {
  //   try {
  //     await navigator.clipboard.writeText(text);
  //     setCopiedField({ id: userId, field });
  //     setTimeout(() => setCopiedField({ id: null, field: null }), 2000); // Reset after 2 seconds
  //   } catch (err) {
  //     console.error('Failed to copy text: ', err);
  //   }
  // };

  const getColumnHeaders = () => {
    const headers = [];
    
    if (visibleColumns.name) {
      headers.push({
        key: 'name',
        label: 'Discount Name',
        style: { width: '150px' }
      });
    }
    
    if (visibleColumns.email) {
      headers.push({
        key: 'email',
        label: 'Discount Value',
        style: { width: '150px' }
      });
    }
    
    if (visibleColumns.phoneNumber) {
      headers.push({
        key: 'phoneNumber',
        label: 'Actual Price',
        style: { width: '120px' }
      });
    }
    
    if (visibleColumns.createdAt) {
      headers.push({
        key: 'createdAt',
        label: 'Discounted Price',
        style: { width: '100px' }
      });
    }

     if (visibleColumns.formAttime) {
      headers.push({
        key: 'formAttime',
        label: 'Created At',
        style: { width: '100px' }
      });
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
        <div className="category-table  pb-3 ">
              <h4 className="py-2 pl-3 text-center p-4 mb-0" style={{ color: 'white', background:'#FEC200',border:'1px solid white',marginTop:'10px',borderRadius:'6px' }}>Product Discount List</h4>

          
<div
  className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
  style={{ backgroundColor: '#FEC200', flexWrap: 'nowrap'}}
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
      title="To Date"
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
                    title="Create New Product Discount"
                    onClick={() => navigate('/product-discount')}
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
                    id="nameCheck"
                    checked={visibleColumns.name}
                    onChange={() => toggleColumn('name')}
                  />
                  <label className="form-check-label unbold-label" htmlFor="nameCheck"
                   style={{ fontWeight: "normal !important"}}                 
                  >
                    Name
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
                    id="phoneNumberCheck"
                    checked={visibleColumns.phoneNumber}
                    onChange={() => toggleColumn('phoneNumber')}
                  />
                  <label className="form-check-label" htmlFor="phoneNumberCheck">
                    Phone Number
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
                  id="formAttimeCheck"
                  checked={visibleColumns.formAttime}
                  onChange={() => toggleColumn('formAttime')}
                />
                <label className="form-check-label" htmlFor="formAttimeCheck">
                  Form At Time
                </label>
              </div>
              </div>
            </div>
          )}

          <div className="user-align" style={{overflowX: 'auto', overflowY: 'hidden', maxHeight: '500px'}}>
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
                {sortedUsers.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {visibleColumns.name && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.name}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm ms-2 p-1"
                              onClick={() => copyToClipboard(user.name, user.id, 'name')}
                              title="Copy Name"
                                style={{
                              width: "28px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                }}
                            >
          
                             {copiedField.id === user.id  &&
                                                                         copiedField.field === "name" ? (
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
                    {visibleColumns.email && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.email}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm ms-2 p-1"
                              onClick={() => copyToClipboard(user.email, user.id, 'email')}
                              title="Copy Email"
                               style={{
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
          }}
                          >
             
                              {copiedField.id === user.id && copiedField.field === "email" ? (
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
                    {visibleColumns.phoneNumber && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.phoneNumber}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm ms-2 p-1"
                              onClick={() => copyToClipboard(user.phoneNumber, user.id, 'phoneNumber')}
                              title="Copy Phone Number"
                              style={{
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                }}
                            >

                              {copiedField.id === user.id &&
                                                                            copiedField.field === "phoneNumber" ? (
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
                    {visibleColumns.createdAt && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{user.createdAt}</td>
                    )}

                    {visibleColumns.formAttime && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{user.formAttime}</td>
                    )}
                    {/* ✅ Action Column */}
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
                                                                className="btn btn-sm btn-outline-success me-1"
                                                                title="View"
                                                                onClick={() => handleView(user)}
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
               

          <div className="row">
            <div className="col-md-6">
              <div className="mt-3">
                <strong>Showing 1 to {sortedUsers.length} of {sortedUsers.length} entries</strong>
              </div>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination d-flex justify-content-end w-100 mt-3">
                  <li className="page-item" aria-current="page">
                    <a className="page-link"

                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px", // spacing between arrow and text
                      fontSize: "15px", // adjust this to your desired text size
             }}
                    
                    href="#">

                      <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1 }}/> 
                      <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1, marginLeft: "-18px" }} />
                                             Previous
                    


                    </a>
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

export default ProductDiscountList
import React, { useState, useMemo } from 'react';
import { FaEdit, FaEye, FaTrash, FaPaperPlane, FaFilePdf, FaFileExcel, FaTelegramPlane, FaSort, FaSortUp, FaSortDown, FaCopy } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa";
import { FaArrowDownLong } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useEffect } from "react";
import axios from "axios";


const Userlist = () => {
  // Sample data for users with the requested columns

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
  const [users, setUsers] = useState([]);

  useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  try {
    const res = await axios.get("https://localhost:7013/api/users");

    const mappedUsers = res.data.map((u) => ({
      id: u.userId,
      name: u.userName,
      email: u.email,
      phoneNumber: u.phoneNumber ?? "—",
      role: u.role,
      createdAt: new Date(u.createdAt).toLocaleString()
    }));

    setUsers(mappedUsers);
  } catch (error) {
    console.error("Failed to load users", error);
  }
};

  
const [activeStatus, setActiveStatus] = useState({});
const [showConfirm, setShowConfirm] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [statusChoice, setStatusChoice] = useState(null);
const protectedProductIds = [1, 2];

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

const pageSizeOptions = [10, 20, 30, "All"];


  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
  name: true,
  email: true,
  phoneNumber: true,
  role: true,          // ✅ ADD
  createdAt: true,
  deactivate: true,
});


   //  Handle View Product
  const handleView = (product) => {
    const productData = { ...product, description: "Sample product description" };
    const productHistory = [
      { srNo: 1, date: "21/10/2025", action: "Created", by: "Admin" },
      { srNo: 2, date: "22/10/2025", action: "Updated", by: "Admin" }
    ];

    navigate(`/product-details/${product.id}`, {
      state: { productData, productHistory, mode: 'view' }
    });
  };

  const handleToggleClick = (user) => {
  setSelectedUser(user);
  setStatusChoice(null);
  setShowConfirm(true);
};

const handleSubmitStatus = () => {
  if (selectedUser && statusChoice && protectedProductIds.includes(selectedUser.id)) {
    setActiveStatus((prev) => ({
      ...prev,
      [selectedUser.id]: statusChoice === 'activate',
    }));
  }
  setShowConfirm(false);
  setSelectedUser(null);
  setStatusChoice(null);
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
       user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handlePageSizeChange = (e) => {
  const value = e.target.value;

  if (value === "All") {
    setPageSize(sortedUsers.length || 100000);
  } else {
    setPageSize(Number(value));
  }

  setPage(1);
};


  const getColumnHeaders = () => {
    const headers = [];
    
    if (visibleColumns.name) {
      headers.push({
        key: 'name',
        label: 'Name',
        style: { width: '150px' }
      });
    }
    
    if (visibleColumns.email) {
      headers.push({
        key: 'email',
        label: 'Email',
        style: { width: '150px' }
      });
    }
    
    if (visibleColumns.phoneNumber) {
      headers.push({
        key: 'phoneNumber',
        label: 'Phone Number',
        style: { width: '120px' }
      });
    }
    
    if (visibleColumns.role) {
  headers.push({
    key: "role",
    label: "Role",
    style: { width: "100px" }
  });
}

    
    if (visibleColumns.createdAt) {
      headers.push({
        key: 'createdAt',
        label: 'Created At',
        style: { width: '100px' }
      });
    }

   

    // headers.push({
    //   key: 'action',
    //   label: 'Action',
    //   style: { width: '100px' }
    // });
    
    return headers;
  };

  const columnHeaders = getColumnHeaders();

  return (
    <div className="container">
      <div className="row">
        <div className="category-table  pb-3 ">
              <h4 className="py-2 pl-3 text-center p-4 mb-0" style={{ color: 'white', background:'#FEC200',border:'1px solid',marginTop:'10px',borderRadius:'6px' }}>User List</h4>

          
<div
  className="category-1-heading d-flex justify-content-between align-items-center bg-success rounded-top px-1 py-1"
  style={{ backgroundColor: 'red', flexWrap: 'nowrap' }}
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
      className="btn btn-light btn-sm ms-0 d-flex align-items-center justify-content-center"
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
    {/* <button
                    className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                    style={{ height: '34px', width: '34px', padding: 0 }}
                    title="Create New Enquiry"
                    onClick={() => navigate('/enquiry-form')}
                  >
                    <FaPlus size={16} />
                  </button> */}
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
                {/* {sortedUsers.map((user, index) => ( */}
                  {sortedUsers.slice((page - 1) * pageSize, page * pageSize).map((user, index) => (

                  <tr key={user.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {visibleColumns.name && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.name}</span>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-sm ms-2 p-1"
                             title={copiedField.id === user.id  && copiedField.field === "name" ? "Copied" : "Copy"}

                              onClick={() => copyToClipboard(user.name, user.id, 'name')}
                            
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
                              title={copiedField.id === user.id  && copiedField.field === "email" ? "Copied" : "Copy"}

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
                              title={copiedField.id === user.id  && copiedField.field === "phoneNumber" ? "Copied" : "Copy"}

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

                            {visibleColumns.role && (
                            <td
                              className="admin-user-option pl-3 p-3"
                              style={{
                                whiteSpace: "nowrap",
                                border: "1px solid #dee2e6",
                                color: "#645959",
                                textTransform: "capitalize",
                                textAlign: "center"
                              }}
                            >
                              <span
                                className={`badge ${
                                  user.role === "admin" ? "bg-danger" : "bg-primary"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                          )}

                    {visibleColumns.createdAt && (
                      <td className="admin-user-option pl-3 p-3" style={{whiteSpace: 'nowrap', border: '1px solid #dee2e6', color: '#645959'}}>{user.createdAt}</td>
                    )}
                                 {/* <td
                            className="admin-user-option pl-3 p-3"
                            style={{
                              whiteSpace: 'nowrap',
                              border: '1px solid #dee2e6',
                              textAlign: 'center'
                            }}
                          > */}
                            {/* <div
                              onClick={() => handleToggleClick(user)}
                              style={{
                                width: '50px',
                                height: '26px',
                                borderRadius: '50px',
                                backgroundColor: activeStatus[user.id] ? '#4CAF50' : '#f44336',
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
                                  left: activeStatus[user.id] ? '26px' : '2px',
                                  transition: 'left 0.3s ease'
                                }}
                              ></div>
                            </div> */}
                          {/* </td> */}


                     {/* ✅ Action Column */}
                                                                                {/* <td
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
                                                            
                                                                                  
                                                                                </td> */}
                                                                              </tr>
                                                                            ))}
                                                                          </tbody>
                                                                        </table>
                                                                        </div>
                  

        {/* Pagination */}
<div className="row align-items-center">
  <div className="col-md-6 mt-3 d-flex align-items-center gap-2">
    <strong>Show</strong>

    <select
      className="form-select form-select-sm"
      style={{ width: "80px" }}
      value={pageSize >= sortedUsers.length ? "All" : pageSize}
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
      {Math.min(page * pageSize, sortedUsers.length)} of{" "}
      {sortedUsers.length}
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
            Previous
          </button>
        </li>

        <li className="page-item active">
          <span className="page-link">Page {page}</span>
        </li>

        <li
          className={`page-item ${
            page * pageSize >= sortedUsers.length ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
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

export default Userlist;
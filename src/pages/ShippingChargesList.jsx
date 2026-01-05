import {
  FaEdit,
  FaEye,
  FaTrash,
  FaPaperPlane,
  FaFilePdf,
  FaFileExcel,
  FaTelegramPlane,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCopy,
  FaPlus
} from 'react-icons/fa';
import { FaArrowDownLong } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';
import { MdContentCopy, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import checkIcon from "../assets/check.png";
import { useNavigate } from 'react-router-dom';

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

const API_PRODUCT = "https://localhost:7013/api/ShippingCharges";

const ShippingChargesList = () => {
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

  // ✅ Sample Data
 
  const [activeStatus, setActiveStatus] = useState({});
const [showConfirm, setShowConfirm] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [statusChoice, setStatusChoice] = useState(null);
const protectedProductIds = [1, 2];

const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

 const [ShippingCharges,  setShippingCharges] = useState([]);



  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    shipping_id: true,
    name: true,
    email: true,
    phoneNumber: true,
    createdAt: true,
    formAttime: true,
    deactivate:true,
  });

  const handleToggleClick = (user) => {
  setSelectedUser(user);
  setStatusChoice(null);
  setShowConfirm(true);
};

useEffect(() => {
  const fetchShippingCharges = async () => {
    try {
      const res = await axios.get(
        "https://localhost:7013/api/ShippingCharges/list"
      );

      const mappedData = res.data.map(item => ({
        shipping_id: item.shipping_id,
        name: item.charge_name,
        email: item.charge_type,
        phoneNumber: item.charge_value,
        createdAt: item.charge_estimated_days,
        formAttime: item.shppng_chrgs_mstr_CrtdAt
          ? new Date(item.shppng_chrgs_mstr_CrtdAt).toLocaleDateString()
          : "-",
        isActive: item.shipping_Charges_is_active
      }));

      setUsers(mappedData);

      const statusMap = {};
mappedData.forEach(item => {
  statusMap[item.shipping_id] = item.isActive;
});
setActiveStatus(statusMap);

    } catch (error) {
      console.error("Failed to load shipping charges", error);
    } finally {
      setLoading(false);
    }
  };

  fetchShippingCharges();
}, []);

const exportCSV = () => {
    window.open(`${API_PRODUCT}/export?format=csv`, "_blank");
  };
  const exportPDF = () => {
    window.open(`${API_PRODUCT}/export?format=pdf`, "_blank");
  };

const handleSubmitStatus = async () => {
  if (!selectedUser || !statusChoice) return;

  const isActive = statusChoice === "activate";

  try {
    await axios.put(
      `https://localhost:7013/api/ShippingCharges/toggle-status/${selectedUser.shipping_id}?isActive=${isActive}`
    );

    // ✅ Update toggle UI correctly
    setActiveStatus(prev => ({
      ...prev,
      [selectedUser.shipping_id]: isActive,
    }));

    // ✅ Update table/list if present
    setShippingCharges(prev =>
      prev.map(c =>
        c.shipping_id === selectedUser.shipping_id
          ? { ...c, Shipping_Charges_is_active: isActive }
          : c
      )
    );

    setShowConfirm(false);
    setSelectedUser(null);
    setStatusChoice(null);

  } catch (error) {
    console.error("Status update failed", error);
    alert("❌ Failed to change shipping charge status");
  }
};




  // View Handler
 
const handleView = (row) => {
  // Navigate to dynamic route with product ID
  navigate(`/shipping-charges-detail/${row.shipping_id}`);
};

  // Filter and sort
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm) ||
      user.shipping_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const handleSearch = (e) => e.preventDefault();

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
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

  // ✅ Column Headers
  const getColumnHeaders = () => {
    const headers = [];

    if (visibleColumns.shipping_id) {
      headers.push({
        key: 'shipping_id',
        label: 'Shipping ID',
        style: { width: '120px' }
      });
    }

    if (visibleColumns.name) {
      headers.push({
        key: 'name',
        label: 'Charge Name',
        style: { width: '150px' }
      });
    }

    if (visibleColumns.email) {
      headers.push({
        key: 'email',
        label: 'Charge Type',
        style: { width: '150px' }
      });
    }

    if (visibleColumns.phoneNumber) {
      headers.push({
        key: 'phoneNumber',
        label: 'Charge Value',
        style: { width: '120px' }
      });
    }

    if (visibleColumns.createdAt) {
      headers.push({
        key: 'createdAt',
        label: 'Estimated Days',
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
          <h4 className="py-2 pl-3 text-center p-4 mb-0"
            style={{ color: 'white', background: '#FEC200', border: '1px solid white', marginTop: '10px', borderRadius: '6px' }}>
            Shipping Charges List
          </h4>

          {/* Header Controls */}
          <div className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
            style={{ backgroundColor: '#FEC200', flexWrap: 'nowrap' }}>
            
            {/* Left: Date Filter */}
            <div className="d-flex align-items-center">
              <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>From:</label>
              <input type="date" className="form-control form-control-sm me-2"
                style={{ height: '34px', width: '150px' }} title='From Date' />
              <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>To:</label>
              <input type="date" className="form-control form-control-sm me-2"
                style={{ height: '34px', width: '150px' }} title="To Date" />
              <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: '34px', width: '34px', padding: 0 }} title="Apply Filter">
                <FaTelegramPlane size={14} />
              </button>
            </div>

            {/* Center: Search Bar */}
            <div className="input-group align-items-center mx-3 py-2" style={{ maxWidth: '350px', width: '100%' }}>
              <input type="search" placeholder="Search by ID, Name, Contact, Email, Location..."
                className="form-control form-control-sm" style={{ height: '34px' }}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="button" className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
                style={{ height: '34px', width: '34px' }} title="Search" onClick={handleSearch}>
                <i className="fas fa-search" style={{ fontSize: '13px' }}></i>
              </button>
            </div>

            {/* Right Controls */}
            <div className="d-flex align-items-center">
              <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center me-2"
                style={{ height: '34px', width: '34px' }} title="Customize Columns"
                onClick={() => setShowColumnSettings(!showColumnSettings)}>
                <IoMdSettings size={16} />
              </button>
              <button className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
                style={{ height: '34px', width: '34px' }} title="Export to PDF" onClick={exportPDF}>
                <FaFilePdf size={16} />
              </button>
              <button className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
                style={{ height: '34px', width: '34px' }} title="Export to Excel"  onClick={exportCSV}>
                <FaFileExcel size={16} />
              </button>
              <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                style={{ height: '34px', width: '34px' }} title="Create New Shipping Charges"
                onClick={() => navigate('/shipping-charges')}>
                <FaPlus size={16} />
              </button>
            </div>
          </div>

          {/* Column Settings */}
          {showColumnSettings && (
            <div className="border p-3 mt-2 rounded">
              <h6>Customize Columns</h6>
              <div className="d-flex flex-wrap">
                <div className="form-check me-3">
                  <input className="form-check-input" type="checkbox" id="shippingIdCheck"
                    checked={visibleColumns.shipping_id} onChange={() => toggleColumn('shipping_id')} />
                  <label className="form-check-label" htmlFor="shippingIdCheck">Shipping ID</label>
                </div>

                <div className="form-check me-3">
                  <input className="form-check-input" type="checkbox" id="nameCheck"
                    checked={visibleColumns.name} onChange={() => toggleColumn('name')} />
                  <label className="form-check-label" htmlFor="nameCheck">Name</label>
                </div>

                <div className="form-check me-3">
                  <input className="form-check-input" type="checkbox" id="emailCheck"
                    checked={visibleColumns.email} onChange={() => toggleColumn('email')} />
                  <label className="form-check-label" htmlFor="emailCheck">Email</label>
                </div>

                <div className="form-check me-3">
                  <input className="form-check-input" type="checkbox" id="phoneNumberCheck"
                    checked={visibleColumns.phoneNumber} onChange={() => toggleColumn('phoneNumber')} />
                  <label className="form-check-label" htmlFor="phoneNumberCheck">Phone Number</label>
                </div>

                <div className="form-check me-3">
                  <input className="form-check-input" type="checkbox" id="createdAtCheck"
                    checked={visibleColumns.createdAt} onChange={() => toggleColumn('createdAt')} />
                  <label className="form-check-label" htmlFor="createdAtCheck">Created At</label>
                </div>

                <div className="form-check me-3">
                  <input className="form-check-input" type="checkbox" id="formAttimeCheck"
                    checked={visibleColumns.formAttime} onChange={() => toggleColumn('formAttime')} />
                  <label className="form-check-label" htmlFor="formAttimeCheck">Form At Time</label>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="user-align" style={{ overflowX: 'auto',overflowY: "auto", maxHeight: '500px' }}>
            <table className="table table-bordered table-striped" style={{ minWidth: '1100px' }}>
              <thead className="thead-dark">
                <tr>
                  {columnHeaders.map(header => (
                    <th key={header.key}
                    className="admin-user-sub-heading pl-3 p-3 sorting sorting_asc"

                      onClick={() => header.key !== 'action' && handleSort(header.key)}
                      style={{
                        ...header.style,
                        border: '1px solid #dee2e6',
                        whiteSpace: 'nowrap',
                        color: '#07486e',
                        cursor: header.key !== 'action' ? 'pointer' : 'default',
                        ...(header.key === 'action'
                          ? { position: 'sticky', right: 0, backgroundColor: '#f8f9fa', zIndex: 10 }
                          : {})
                      }}>
                      {header.label} {header.key !== 'action' && getSortIcon(header.key)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sortedUsers.map((user, index) => (
                  <tr key={user.shipping_id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {visibleColumns.shipping_id && (
                      <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap', color: '#645959' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.shipping_id}</span>
                          <button
                            className="btn btn-sm ms-2 p-1"
                            onClick={() => copyToClipboard(user.shipping_id, user.shipping_id, 'shipping_id')}
                            title="Copy Shipping ID"
                            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {copiedField.id === user.shipping_id && copiedField.field === 'shipping_id'
                              ? <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                              : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.name && (
                      <td style={{ border: '1px solid #dee2e6', color: '#645959', whiteSpace: 'nowrap' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.name}</span>
                          <button
                            className="btn btn-sm ms-2 p-1"
                            onClick={() => copyToClipboard(user.name, user.shipping_id, 'name')}
                            title="Copy Name"
                            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {copiedField.id === user.shipping_id && copiedField.field === 'name'
                              ? <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                              : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.email && (
                      <td style={{ border: '1px solid #dee2e6', color: '#645959', whiteSpace: 'nowrap' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.email}</span>
                          <button
                            className="btn btn-sm ms-2 p-1"
                            onClick={() => copyToClipboard(user.email, user.shipping_id, 'email')}
                            title="Copy Email"
                            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {copiedField.id === user.shipping_id && copiedField.field === 'email'
                              ? <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                              : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.phoneNumber && (
                      <td style={{ border: '1px solid #dee2e6', color: '#645959', whiteSpace: 'nowrap' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.phoneNumber}</span>
                          <button
                            className="btn btn-sm ms-2 p-1"
                            onClick={() => copyToClipboard(user.phoneNumber, user.shipping_id, 'phoneNumber')}
                            title="Copy Phone Number"
                            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {copiedField.id === user.shipping_id && copiedField.field === 'phoneNumber'
                              ? <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                              : <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.createdAt && (
                      <td style={{ border: '1px solid #dee2e6', color: '#645959', whiteSpace: 'nowrap' }}>
                        {user.createdAt}
                      </td>
                    )}

                    {visibleColumns.formAttime && (
                      <td style={{ border: '1px solid #dee2e6', color: '#645959', whiteSpace: 'nowrap' }}>
                        {user.formAttime}
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
                                    onClick={() => handleToggleClick(user)}
                                    style={{
                                      width: '50px',
                                      height: '26px',
                                      borderRadius: '50px',
                                      backgroundColor: activeStatus[user.shipping_id] ? '#4CAF50' : '#f44336',
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
                                        left: activeStatus[user.shipping_id] ? '26px' : '2px',
                                        transition: 'left 0.3s ease'
                                      }}
                                    ></div>
                                  </div>
                                </td>

                   

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


export default ShippingChargesList
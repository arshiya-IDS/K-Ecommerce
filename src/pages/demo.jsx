import React, { useState, useMemo,useEffect } from 'react';
import {
  FaEdit, FaEye, FaTrash, FaPaperPlane, FaFilePdf, FaFileExcel,
  FaTelegramPlane, FaSort, FaSortUp, FaSortDown, FaCopy, FaPlus
} from 'react-icons/fa';
import { FaArrowDownLong } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import checkIcon from "../assets/check.png";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

import axios from "axios";

const API_CATEGORY = "https://localhost:7031/api/Category";
const API_SUBCATEGORY = "https://localhost:7031/api/Category/sub";
const API_PRODUCT = "https://localhost:7031/api/Product";


const ProductList = () => {
  const navigate = useNavigate();
   const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
const [toDate, setToDate] = useState('');
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [users] = useState([]);


  

  // ==================== CORRECTED SAMPLE DATA ====================
  // const [users] = useState([
  //   {
  //     id: 1,
  //     productId: 1,
  //     productName: 'Palm Trees',
  //     price: '2000',
  //     category: 'Big Tree',
  //     subCategory: 'Coconut Trees',
  //     createdAt: '02-10-2025',
  //   },
  //   {
  //     id: 2,
  //     productId: 2,
  //     productName: 'Big Trees',
  //     price: '1000',
  //     category: 'Large Tree',
  //     subCategory: 'Palm Trees',
  //     createdAt: '02-10-2025',
  //   }
  // ]);

  useEffect(() => {
  axios.get(API_CATEGORY)
    .then(res => setCategories(res.data))
    .catch(err => console.log("Category Fetch Error:", err));
}, []);

const fetchProducts = async () => {
  try {
    setLoading(true);

    const response = await axios.get(API_PRODUCT, {
      params: {
        search: searchTerm || null,
        page,
        pageSize,
        fromDate: fromDate || null,
        toDate: toDate || null,
        sortKey: sortConfig.key,
        sortDir: sortConfig.direction
      }
    });

    setProducts(response.data.items);
  } catch (error) {
    console.error("Product Fetch Error:", error);
  }
  setLoading(false);
};
useEffect(() => {
  fetchProducts();
}, [page, searchTerm, fromDate, toDate, sortConfig]);

const fetchSubCategories = (id) => {
  axios.get(`${API_SUBCATEGORY}/${id}`)
    .then(res => setSubCategories(res.data))
    .catch(err => console.log("Subcategory Error:", err));
};

const toggleStatus = async (id, currentStatus) => {
  try {
    await axios.patch(`${API_PRODUCT}/${id}/status`, null, {
      params: { active: !currentStatus }
    });

    fetchProducts(); // reload
  } catch (error) {
    console.log("Status Update Failed:", error);
  }
};

  // =================================================================

  const [copiedField, setCopiedField] = useState({ id: null, field: null });
  const copyToClipboard = (text, id, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField({ id, field });
      setTimeout(() => setCopiedField({ id: null, field: null }), 2000);
    });
  };

  
  const [visibleColumns, setVisibleColumns] = useState({
    productId: true,
    productName: true,
    price: true,
    category: true,
    subCategory: true,
    createdAt: true
  });

  // Handle View Product
  const handleView = (product) => {
    const productData = { ...product, description: "Sample product description" };
    const productHistory = [
      { srNo: 1, date: "21/10/2025", action: "Created", by: "Admin" },
      { srNo: 2, date: "22/10/2025", action: "Updated", by: "Admin" }
    ];

    navigate(`/product-details`, {
      state: { productData, productHistory, mode: 'view' }
    });
  };

  // Toggle Active/Inactive (Protected IDs: 1, 2)
  const protectedProductIds = [1, 2];
  const [activeStatus, setActiveStatus] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusChoice, setStatusChoice] = useState(null);
 
const [products, setProducts] = useState([]);


const [categories, setCategories] = useState([]);
const [subCategories, setSubCategories] = useState([]);

const [loading, setLoading] = useState(false);





  const handleToggleClick = (user) => {
    setSelectedUser(user);
    setStatusChoice(null);
    setShowConfirm(true);
  };

  const exportCSV = () => {
  window.open(`${API_PRODUCT}/export?format=csv`, "_blank");
};

const exportPDF = () => {
  window.open(`${API_PRODUCT}/export?format=pdf`, "_blank");
};

  const handleSubmitStatus = () => {
    if (selectedUser && statusChoice && protectedProductIds.includes(selectedUser.id)) {
      setActiveStatus(prev => ({
        ...prev,
        [selectedUser.id]: statusChoice === 'activate'
      }));
    }
    setShowConfirm(false);
    setSelectedUser(null);
    setStatusChoice(null);
  };

  // Search & Sort
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user =>
      user.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.price.includes(searchTerm) ||
      user.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.createdAt.includes(searchTerm)
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
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  // ============== COLUMN HEADERS (UPDATED KEYS & LABELS) ==============
  const getColumnHeaders = () => {
    const headers = [];

    if (visibleColumns.productId) {
      headers.push({ key: 'productId', label: 'Product ID', style: { width: '100px' } });
    }
    if (visibleColumns.productName) {
      headers.push({ key: 'productName', label: 'Product Name', style: { width: '150px' } });
    }
    if (visibleColumns.price) {
      headers.push({ key: 'price', label: 'Item Price', style: { width: '100px' } });
    }
    if (visibleColumns.category) {
      headers.push({ key: 'category', label: 'Category', style: { width: '120px' } });
    }
    if (visibleColumns.subCategory) {
      headers.push({ key: 'subCategory', label: 'Sub Category', style: { width: '140px' } });
    }
    if (visibleColumns.createdAt) {
      headers.push({ key: 'createdAt', label: 'Created At', style: { width: '110px' } });
    }

    headers.push({ key: 'status', label: 'Status', style: { width: '100px' } });
    headers.push({ key: 'action', label: 'Action', style: { width: '100px' } });

    return headers;
  };
  const columnHeaders = getColumnHeaders();
  // ====================================================================

  return (
    <div className="container">
      <div className="row">
        <div className="category-table pb-3">
          <h4 className="py-2 pl-3 text-center p-4 mb-0"
              style={{ color: 'white', background: '#FEC200', border: '1px solid white', marginTop: '10px', borderRadius: '6px' }}>
            Product List
          </h4>

          {/* Toolbar */}
          <div className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
               style={{ backgroundColor: '#FEC200', flexWrap: 'nowrap' }}>
            {/* Date Filters */}
            <div className="d-flex align-items-center">
              <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>From:</label>
              <input type="date" className="form-control form-control-sm me-2"
                     style={{ height: '34px', width: '150px' }} title="From Date" />
              <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>To:</label>
              <input type="date" className="form-control form-control-sm me-2"
                     style={{ height: '34px', width: '150px' }} title="To Date" />
              <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                      style={{ height: '34px', width: '34px', padding: 0 }} title="Apply Filter">
                <FaTelegramPlane size={14} />
              </button>
            </div>

            {/* Search */}
            <div className="input-group align-items-center mx-3 py-2" style={{ maxWidth: '350px', width: '100%' }}>
              <input type="search" placeholder="Search by Name, Price, Category..."
                     className="form-control form-control-sm" style={{ height: '34px' }}
                     value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="button" className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
                      style={{ height: '34px', width: '34px', padding: 0 }} title="Search">
                <i className="fas fa-search" style={{ fontSize: '13px' }}></i>
              </button>
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center">
              <button className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
                      style={{ height: '34px', width: '34px', padding: 0 }} title="Customize Columns"
                      onClick={() => setShowColumnSettings(!showColumnSettings)}>
                <IoMdSettings size={16} />
              </button>
              
              <button
  className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
  style={{ height: "34px", width: "34px", padding: 0 }}
  title="Export to PDF"
  onClick={exportPDF}
>
  <FaFilePdf size={16} />
</button>

<button
  className="btn btn-light btn-sm me-2 d-flex align-items-center justify-content-center"
  style={{ height: "34px", width: "34px", padding: 0 }}
  title="Export to Excel"
  onClick={exportCSV}
>
  <FaFileExcel size={16} />
</button>

             
              <button className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                      style={{ height: '34px', width: '34px', padding: 0 }} title="Create New Product"
                      onClick={() => navigate('/product-create')}>
                <FaPlus size={16} />
              </button>
            </div>
          </div>

          {/* Column Settings */}
          {showColumnSettings && (
            <div className="border p-3 mt-2 rounded">
              <h6>Customize Columns</h6>
              <div className="d-flex flex-wrap gap-3">
                {['productId', 'productName', 'price', 'category', 'subCategory', 'createdAt'].map(col => (
                  <div key={col} className="form-check">
                    <input className="form-check-input" type="checkbox" id={`${col}Check`}
                           checked={visibleColumns[col]} onChange={() => toggleColumn(col)} />
                    <label className="form-check-label" htmlFor={`${col}Check`}>
                      {col === 'productId' ? 'Product ID' :


                       col === 'productName' ? 'Product Name' :
                       col === 'price' ? 'Item Price' :
                       col === 'category' ? 'Category' :
                       col === 'subCategory' ? 'Sub Category' :
                       'Created At'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="user-align" style={{ overflowX: 'auto', overflowY: 'hidden', maxHeight: '500px' }}>
            <table className="table table-bordered table-striped" style={{ minWidth: '1100px' }}>
              <thead className="thead-dark">
                <tr>
                  {columnHeaders.map(header => (
                    <th key={header.key}
                        className={`admin-user-sub-heading pl-3 p-3 sorting ${header.key === 'action' ? 'sticky-action' : ''}`}
                        style={{
                          ...header.style,
                          whiteSpace: 'nowrap',
                          border: '1px solid #dee2e6',
                          cursor: header.key !== 'action' && header.key !== 'status' ? 'pointer' : 'default',
                          color: '#07486e',
                          ...(header.key === 'action' ? {
                            position: 'sticky', right: 0, zIndex: 10, backgroundColor: '#f8f9fa'
                          } : {})
                        }}
                        onClick={() => header.key !== 'action' && header.key !== 'status' && handleSort(header.key)}>
                      {header.label} {header.key !== 'action' && header.key !== 'status' && getSortIcon(header.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {/* Product ID + Status Circle (Protected) */}
                    {visibleColumns.productId && (
                      <td className="admin-user-option pl-3 p-3 text-center"
                          style={{ border: '1px solid #dee2e6' }}>
                        {protectedProductIds.includes(user.id) ? (
                          <span style={{ fontWeight: '500', color: '#333' }}>{user.productId}</span>
                        ) : (
                          <div onClick={() => handleToggleClick(user)}
                               style={{
                                 width: '40px', height: '40px', borderRadius: '50%',
                                 backgroundColor: activeStatus[user.id] ? '#4CAF50' : '#f44336',
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 color: 'white', cursor: 'pointer', fontWeight: 'bold'
                               }}
                               title={activeStatus[user.id] ? 'Active' : 'Inactive'}>
                            {activeStatus[user.id] ? 'A' : 'I'}
                          </div>
                        )}
                      </td>
                    )}

                    {/* Product Name */}
                    {visibleColumns.productName && (
                      <td className="admin-user-option pl-3 p-3" style={{ border: '1px solid #dee2e6', color: '#645959' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{user.productName}</span>
                          <button className="btn btn-sm p-1"
                                  onClick={() => copyToClipboard(user.productName, user.id, 'productName')}
                                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {copiedField.id === user.id && copiedField.field === 'productName' ?
                              <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} /> :
                              <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {/* Price */}
                    {visibleColumns.price && (
                      <td className="admin-user-option pl-3 p-3" style={{ border: '1px solid #dee2e6', color: '#645959' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>₹{user.price}</span>
                          <button className="btn btn-sm p-1"
                                  onClick={() => copyToClipboard(user.price, user.id, 'price')}
                                  style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {copiedField.id === user.id && copiedField.field === 'price' ?
                              <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} /> :
                              <MdContentCopy size={15} />}
                          </button>
                        </div>
                      </td>
                    )}

                    {/* Category */}
                    {visibleColumns.category && (
                      <td className="admin-user-option pl-3 p-3" style={{ border: '1px solid #dee2e6', color: '#645959' }}>
                        {user.category}
                      </td>
                    )}

                    {/* Sub Category */}
                    {visibleColumns.subCategory && (
                      <td className="admin-user-option pl-3 p-3" style={{ border: '1px solid #dee2e6', color: '#645959' }}>
                        {user.subCategory}
                      </td>
                    )}

                    {/* Created At */}
                    {visibleColumns.createdAt && (
                      <td className="admin-user-option pl-3 p-3" style={{ border: '1px solid #dee2e6', color: '#645959' }}>
                        {user.createdAt}
                      </td>
                    )}

                    {/* Status Toggle */}
                    <td className="admin-user-option pl-3 p-3 text-center"
                        style={{ border: '1px solid #dee2e6' }}>
                      <div onClick={() => handleToggleClick(user)}
                           style={{
                             width: '50px', height: '26px', borderRadius: '50px',
                             backgroundColor: activeStatus[user.id] ? '#4CAF50' : '#f44336',
                             position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s ease'
                           }}>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'white',
                          position: 'absolute', top: '2px',
                          left: activeStatus[user.id] ? '26px' : '2px',
                          transition: 'left 0.3s ease'
                        }}></div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="admin-user-option pl-3 p-3 sticky-action"
                        style={{ border: '1px solid #dee2e6', position: 'sticky', right: 0, backgroundColor: 'white', zIndex: 1 }}>
                      <button className="btn btn-sm btn-outline-success me-1" title="View"
                              onClick={() => handleView(user)}>
                        <MdKeyboardArrowRight style={{ fontSize: "20px", marginLeft: "-15px" }} />
                        <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
                      </button>
                    </td>
                  </tr>
//                   <tr key={user.product_id}>
//   {visibleColumns.productId && <td>{user.product_id}</td>}
//   {visibleColumns.productName && <td>{user.product_name}</td>}
//   {visibleColumns.price && <td>{user.product_actual_price}</td>}
//   {visibleColumns.category && <td>{user.category_name}</td>}
//   {visibleColumns.subCategory && <td>{user.subcategory_name}</td>}
//   {visibleColumns.createdAt && <td>{user.prdct_CrtdAt}</td>}

//   <td>
//     <button onClick={() => toggleStatus(user.product_id, user.is_active)}>
//       {user.is_active ? "Active" : "Inactive"}
//     </button>
//   </td>
// </tr>

                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="row mt-3">
            <div className="col-md-6">
              <strong>Showing 1 to {sortedUsers.length} of {sortedUsers.length} entries</strong>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-end">
                  <li className="page-item">
                    <a className="page-link" href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px' }}>
                      <MdKeyboardArrowLeft style={{ fontSize: "20px", marginLeft: "-18px" }} />
                      <MdKeyboardArrowLeft style={{ fontSize: "20px" }} />
                      Previous
                    </a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px' }}>
                      Next
                      <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
                      <MdKeyboardArrowRight style={{ fontSize: "20px", marginLeft: "-18px" }} />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Confirmation Modal */}
          {showConfirm && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
              alignItems: 'center', zIndex: 9999
            }}>
              <div style={{
                backgroundColor: 'white', padding: '25px 30px', borderRadius: '10px',
                textAlign: 'center', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                width: '570px', maxWidth: '100%', height: '200px'
              }}>
                <h5 className="mb-3" style={{ fontWeight: '600', textAlign: 'left' }}>
                  Are you sure to change the status?
                </h5>
                <div className="d-flex justify-content-left mb-4" style={{ gap: '30px' }}>
                  {['activate', 'deactivate'].map(opt => (
                    <div key={opt} className="form-check" style={{ fontSize: '17px' }}>
                      <input className="form-check-input" type="checkbox" id={`${opt}Check`}
                             checked={statusChoice === opt}
                             onChange={() => setStatusChoice(opt)} />
                      <label className="form-check-label ms-1" htmlFor={`${opt}Check`}
                             style={{ cursor: 'pointer', fontSize: '17px' }}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button className="btn btn-outline-secondary"
                          style={{ minWidth: '90px', borderRadius: '6px' }}
                          onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className="btn btn-danger"
                          style={{ minWidth: '90px', borderRadius: '6px' }}
                          onClick={handleSubmitStatus} disabled={!statusChoice}>
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

export default ProductList;
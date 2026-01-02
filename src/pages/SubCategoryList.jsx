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
} from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { MdContentCopy, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import checkIcon from '../assets/check.png';
import { useNavigate } from 'react-router-dom';
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

const API_CATEGORY = "http://ecommerce-admin-backend.i-diligence.com/api/SubCategory";

const SubCategoryList = () => {
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

  

const [activeStatus, setActiveStatus] = useState({});
const [showConfirm, setShowConfirm] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [statusChoice, setStatusChoice] = useState(null);
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(false);

const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    subCategoryId: true,
    categoryName: true,
    subCategory: true,
    createdAt: true,
    updatedAt: true,
     deactivate: true,
  });

  const handleToggleClick = (user) => {
  setSelectedUser(user);
  setStatusChoice(null);
  setShowConfirm(true);
};

const applyDateFilter = () => {
  setPage(1);
  fetchSubCategories(); // instead of fetchProducts
};
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const exportCSV = () => {
    window.open(`${API_CATEGORY}/export?format=csv`, "_blank");
  };
  const exportPDF = () => {
    window.open(`${API_CATEGORY}/export?format=pdf`, "_blank");
  };

  const handleView = (category) => {
    navigate(`/subcategories/details/${category.subCategoryId}`, {
      state: { category, mode: 'view' },
    });
  };

 useEffect(() => {
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || null,
        page,
        pageSize,
        fromDate: fromDate || null,
        toDate: toDate || null,
        sortKey: sortConfig.key,
        sortDir: sortConfig.direction,
      };

      const res = await axios.get('http://ecommerce-admin-backend.i-diligence.com/api/SubCategory/list');

      // 🔹 Map table data
      const mappedData = res.data.map((item) => ({
        id: item.sub_Category_Id,
        subCategoryId: `${item.sub_Category_Id}`,
        categoryName: ` ${item.category_Name}`,
        subCategory: item.sub_Category_Name,
        createdAt: item.sb_catgrs_CrtdAt,
        updatedAt: item.sb_catgrs_UpdtdAt,
        isActive: item.sub_Category_Is_Active,

       
      }));

      // 🔹 Map status toggle data
      const statusMap = {};
      res.data.forEach(item => {
        statusMap[item.sub_Category_Id] = item.sub_Category_Is_Active;
      });

      setCategories(mappedData);
      setActiveStatus(statusMap);

    } catch (error) {
      console.error('Error fetching sub categories', error);
    } finally {
      setLoading(false);
    }
  };

  fetchSubCategories();
},[page, pageSize, searchTerm, fromDate, toDate, sortConfig]);


  

const handleSubmitStatus = async () => {
  if (!selectedUser || !statusChoice) return;

  const isActive = statusChoice === 'activate';

  try {
    await axios.put(
      `http://ecommerce-admin-backend.i-diligence.com/api/SubCategory/toggle-status/${selectedUser.id}?isActive=${isActive}`
    );

    // ✅ Update UI instantly
    setActiveStatus((prev) => ({
      ...prev,
      [selectedUser.id]: isActive,
    }));

    setShowConfirm(false);
    setSelectedUser(null);
    setStatusChoice(null);

  } catch (error) {
    console.error('Failed to update status', error);
    alert('Status update failed');
  }
};



  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(
      (cat) =>
        cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.subCategoryId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const sortedCategories = useMemo(() => {
    if (!sortConfig.key) return filteredCategories;
    return [...filteredCategories].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCategories, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
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

  const columnHeaders = [
    { key: 'subCategoryId', label: 'Sub-Category ID', visible: visibleColumns.subCategoryId },
    { key: 'categoryName', label: 'Category Name', visible: visibleColumns.categoryName },
    { key: 'subCategory', label: 'Sub-Category Name', visible: visibleColumns.subCategory },
    { key: 'createdAt', label: 'Created At', visible: visibleColumns.createdAt },
    { key: 'updatedAt', label: 'Updated At', visible: visibleColumns.updatedAt },
    { key: 'deactivate', label: 'Status', visible: visibleColumns.deactivate },
    { key: 'action', label: 'Action', visible: true },
  ];

  return (
    <div className="container">
      <div className="category-table pb-3">
        <h4
          className="py-2 text-center mb-0"
          style={{
            color: 'white',
            background: '#FEC200',
            border: '1px solid white',
            marginTop: '10px',
            borderRadius: '6px',
          }}
        >
          Sub Category List
        </h4>

        {/* Header controls */}
        <div
          className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
          style={{ backgroundColor: '#FEC200', flexWrap: 'nowrap' }}
        >
          {/* Date filter */}
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
                         style={{ height: "34px", width: "34px", padding: 0 }}
                         title="Apply Filter"
                         onClick={applyDateFilter}
                       >
                         <FaTelegramPlane size={14} />
                       </button>
                     </div>

          {/* Search */}
          <div className="input-group align-items-center mx-3 py-2" style={{ maxWidth: '350px', width: '100%' }}>
            <input
              type="search"
              placeholder="Search sub-categories..."
              className="form-control form-control-sm"
              style={{ height: '34px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" className="btn btn-light btn-sm ms-2" style={{ height: '34px', width: '34px' }}>
              <i className="fas fa-search" style={{ fontSize: '13px' }}></i>
            </button>
          </div>

          {/* Action buttons */}
          <div className="d-flex align-items-center">
            <button className="btn btn-light btn-sm me-2" onClick={() => setShowColumnSettings(!showColumnSettings)}>
              <IoMdSettings size={16} />
            </button>
            <button className="btn btn-light btn-sm me-2" title="Export PDF" onClick={exportPDF}>
              <FaFilePdf size={16} />
            </button>
           
            <button className="btn btn-light btn-sm me-2" title="Export CSV" onClick={exportCSV}>
              <FaFileExcel size={16} />
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => navigate('/manage-subcategories')}
            >
              <FaPlus size={16} />
            </button>
          </div>
        </div>

        {/* Column settings */}
        {showColumnSettings && (
          <div className="border p-3 mt-2 rounded">
            <h6>Customize Columns</h6>
            <div className="d-flex flex-wrap">
              {Object.keys(visibleColumns).map((col) => (
                <div className="form-check me-3" key={col}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={col}
                    checked={visibleColumns[col]}
                    onChange={() => toggleColumn(col)}
                  />
                  <label className="form-check-label" htmlFor={col}>
                    {col}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '500px' }}>
          <table className="table table-bordered table-striped" style={{ minWidth: '1000px' }}>
            <thead>
              <tr>
                {columnHeaders.map(
                  (header) =>
                    header.visible && (
                      <th
                        key={header.key}
                       className="admin-user-sub-heading pl-3 p-3 sorting sorting_asc"

                        style={{
                          border: '1px solid #dee2e6',
                          cursor: header.key !== 'action' ? 'pointer' : 'default',
                          color: '#07486e',
                          ...(header.key === 'action'
                            ? { position: 'sticky', right: 0, backgroundColor: '#f8f9fa' }
                            : {}),
                        }}
                        onClick={() => header.key !== 'action' && handleSort(header.key)}
                      >
                        {header.label} {header.key !== 'action' && getSortIcon(header.key)}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map((cat) => (
                <tr key={cat.id}>
                  {/* Sub Category ID */}
                  {visibleColumns.subCategoryId && (
                    <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{cat.subCategoryId}</span>
                        <button
                          className="btn btn-sm p-1"
                          onClick={() => copyToClipboard(cat.subCategoryId, cat.id, 'subCategoryId')}
                        >
                          {copiedField.id === cat.id && copiedField.field === 'subCategoryId' ? (
                            <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Category Name */}
                  {visibleColumns.categoryName && (
                    <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{cat.categoryName}</span>
                        <button
                          className="btn btn-sm p-1"
                          onClick={() => copyToClipboard(cat.categoryName, cat.id, 'categoryName')}
                        >
                          {copiedField.id === cat.id && copiedField.field === 'categoryName' ? (
                            <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Sub Category Name */}
                  {visibleColumns.subCategory && (
                    <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{cat.subCategory}</span>
                        <button
                          className="btn btn-sm p-1"
                          onClick={() => copyToClipboard(cat.subCategory, cat.id, 'subCategory')}
                        >
                          {copiedField.id === cat.id && copiedField.field === 'subCategory' ? (
                            <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Created At */}
                  {visibleColumns.createdAt && (
                    <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{cat.createdAt}</span>
                        <button
                          className="btn btn-sm p-1"
                          onClick={() => copyToClipboard(cat.createdAt, cat.id, 'createdAt')}
                        >
                          {copiedField.id === cat.id && copiedField.field === 'createdAt' ? (
                            <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Updated At */}
                  {visibleColumns.updatedAt && (
                    <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{cat.updatedAt}</span>
                        <button
                          className="btn btn-sm p-1"
                          onClick={() => copyToClipboard(cat.updatedAt, cat.id, 'updatedAt')}
                        >
                          {copiedField.id === cat.id && copiedField.field === 'updatedAt' ? (
                            <img src={checkIcon} alt="Copied" style={{ width: '18px', height: '18px' }} />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </div>
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
                            //  onClick={() => handleToggleClick(cat)}
                              onClick={() => !showConfirm && handleToggleClick(cat)}

                              style={{
                                width: '50px',
                                height: '26px',
                                borderRadius: '50px',
                                backgroundColor: activeStatus[cat.id] ? '#4CAF50' : '#f44336',
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
                                  left: activeStatus[cat.id] ? '26px' : '2px',

                                  transition: 'left 0.3s ease'
                                }}
                              ></div>
                            </div>
                          </td>


                  {/* Action */}
                  <td style={{ position: 'sticky', right: 0, backgroundColor: 'white',border: '1px solid #dee2e6' }}>
                    <button className="btn btn-sm btn-outline-success me-1" onClick={() => handleView(cat)}>
                      <MdKeyboardArrowRight style={{ fontSize: '20px' }} />
                      <MdKeyboardArrowRight style={{ fontSize: '20px', marginLeft: '-15px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="row">
          <div className="col-md-6 mt-3">
            <strong>
              Showing 1 to {sortedCategories.length} of {sortedCategories.length} entries
            </strong>
          </div>
          <div className="col-md-6">
            <nav aria-label="Page navigation">
              <ul className="pagination d-flex justify-content-end w-100 mt-3">
                <li className="page-item">
                  <a className="page-link" href="#">
                    <MdKeyboardArrowLeft style={{ fontSize: '20px' }} />
                    <MdKeyboardArrowLeft style={{ fontSize: '20px', marginLeft: '-15px' }} /> Previous
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    Page 1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    Next <MdKeyboardArrowRight style={{ fontSize: '20px' }} />
                    <MdKeyboardArrowRight style={{ fontSize: '20px', marginLeft: '-15px' }} />
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
  );
};

export default SubCategoryList;

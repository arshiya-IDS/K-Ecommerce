import React, { useState, useMemo } from 'react';
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

const CategoryList = () => {
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

  const [categories] = useState([
    {
      id: 1,
      categoryName: 'Metal Cutting',
      subCategory: 'Laser Cutting',
      createdAt: '2025-10-01',
      updatedAt: '2025-10-15',
    },
    {
      id: 2,
      categoryName: 'Wood Work',
      subCategory: 'CNC Engraving',
      createdAt: '2025-09-25',
      updatedAt: '2025-10-10',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, // ✅ Added Category ID as the first column
    categoryName: true,
    subCategory: true,
    createdAt: true,
    updatedAt: true,
  });

  const handleView = (category) => {
    navigate(`/category-details`, {
      state: { category, mode: 'view' },
    });
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(
      (cat) =>
        cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
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
    { key: 'id', label: 'Category ID', visible: visibleColumns.id }, // ✅ Added ID header
    { key: 'categoryName', label: 'Category Name', visible: visibleColumns.categoryName },
    { key: 'subCategory', label: 'Sub Category', visible: visibleColumns.subCategory },
    { key: 'createdAt', label: 'Created At', visible: visibleColumns.createdAt },
    { key: 'updatedAt', label: 'Updated At', visible: visibleColumns.updatedAt },
    { key: 'action', label: 'Action', visible: true },
  ];

  return (
    <div className="container">
      <div className="row">
      <div className="category-table pb-3">
        <h4
          className="py-2 pl-3 text-center p-4 mb-0"
          style={{
            color: 'white',
            background: '#FEC200',
            border: '1px solid white',
            marginTop: '10px',
            borderRadius: '6px',
          }}
        >
          Category List
        </h4>

        {/* Header controls */}
        <div
          className="category-1-heading d-flex justify-content-between align-items-center rounded-top px-1 py-1"
          style={{ backgroundColor: '#FEC200', flexWrap: 'nowrap' }}
        >
          {/* From/To Date */}
          <div className="d-flex align-items-center">
            <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>
              From:
            </label>
            <input
              type="date"
              className="form-control form-control-sm me-2"
              style={{ height: '34px', width: '150px' }}
            />
            <label className="text-white me-2 mb-0" style={{ fontWeight: '500' }}>
              To:
            </label>
            <input
              type="date"
              className="form-control form-control-sm me-2"
              style={{ height: '34px', width: '150px' }}
            />
            <button
              className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
              style={{ height: '34px', width: '34px' }}
              title="Apply Filter"
            >
              <FaTelegramPlane size={14} />
            </button>
          </div>

          {/* Search Bar */}
          <div
            className="input-group align-items-center mx-3 py-2"
            style={{ maxWidth: '350px', width: '100%' }}
          >
            <input
              type="search"
              placeholder="Search categories..."
              className="form-control form-control-sm"
              style={{ height: '34px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
              style={{ height: '34px', width: '34px' }}
              title="Search"
            >
              <i className="fas fa-search" style={{ fontSize: '13px' }}></i>
            </button>
          </div>

          {/* Buttons */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-light btn-sm me-2"
              title="Customize Columns"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
            >
              <IoMdSettings size={16} />
            </button>
            <button className="btn btn-light btn-sm me-2" title="Export PDF">
              <FaFilePdf size={16} />
            </button>
            <button className="btn btn-light btn-sm me-2" title="Export Excel">
              <FaFileExcel size={16} />
            </button>
            <button
              className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
              title="Create Category"
              onClick={() => navigate('/manage-categories')}
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
        <div
          className="user-align"
          style={{ overflowX: 'auto', overflowY: 'hidden', maxHeight: '500px' }}
        >
          <table
            className="table table-bordered table-striped"
            style={{ minWidth: '1000px', borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                {columnHeaders.map(
                  (header) =>
                    header.visible && (
                      <th
                        key={header.key}
                        className="admin-user-sub-heading pl-3 p-3 sorting sorting_asc"
                        style={{
                          whiteSpace: 'nowrap',
                          border: '1px solid #dee2e6',
                          cursor: header.key !== 'action' ? 'pointer' : 'default',
                          color: '#07486e',
                          ...(header.key === 'action'
                            ? {
                                position: 'sticky',
                                right: 0,
                                zIndex: 10,
                                backgroundColor: '#f8f9fa',
                              }
                            : {}),
                        }}
                        onClick={() =>
                          header.key !== 'action' && handleSort(header.key)
                        }
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
                  {/* ✅ Category ID Column */}
                  {visibleColumns.id && (
                    <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>{cat.id}</strong>
                        <button
                          className="btn btn-sm p-1"
                          onClick={() => copyToClipboard(cat.id, cat.id, 'id')}
                        >
                          {copiedField.id === cat.id && copiedField.field === 'id' ? (
                            <img
                              src={checkIcon}
                              alt="Copied"
                              style={{ width: '18px', height: '18px' }}
                            />
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
                          onClick={() =>
                            copyToClipboard(cat.categoryName, cat.id, 'categoryName')
                          }
                        >
                          {copiedField.id === cat.id &&
                          copiedField.field === 'categoryName' ? (
                            <img
                              src={checkIcon}
                              alt="Copied"
                              style={{ width: '18px', height: '18px' }}
                            />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Sub Category */}
                  {visibleColumns.subCategory && (
                    <td style={{ border: '1px solid #dee2e6', whiteSpace: 'nowrap' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{cat.subCategory}</span>
                        <button
                          className="btn btn-sm p-1"
                          onClick={() =>
                            copyToClipboard(cat.subCategory, cat.id, 'subCategory')
                          }
                        >
                          {copiedField.id === cat.id &&
                          copiedField.field === 'subCategory' ? (
                            <img
                              src={checkIcon}
                              alt="Copied"
                              style={{ width: '18px', height: '18px' }}
                            />
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
                          onClick={() =>
                            copyToClipboard(cat.createdAt, cat.id, 'createdAt')
                          }
                        >
                          {copiedField.id === cat.id &&
                          copiedField.field === 'createdAt' ? (
                            <img
                              src={checkIcon}
                              alt="Copied"
                              style={{ width: '18px', height: '18px' }}
                            />
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
                          onClick={() =>
                            copyToClipboard(cat.updatedAt, cat.id, 'updatedAt')
                          }
                        >
                          {copiedField.id === cat.id &&
                          copiedField.field === 'updatedAt' ? (
                            <img
                              src={checkIcon}
                              alt="Copied"
                              style={{ width: '18px', height: '18px' }}
                            />
                          ) : (
                            <MdContentCopy size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Action */}
                  <td
                    style={{
                      position: 'sticky',
                      right: 0,
                      backgroundColor: 'white',
                    }}
                  >
                    <button
                      className="btn btn-sm btn-outline-success me-1"
                      onClick={() => handleView(cat)}
                    >
                      <MdKeyboardArrowRight style={{ fontSize: '20px', lineHeight: 1 }} />
                      <MdKeyboardArrowRight
                        style={{ fontSize: '20px', lineHeight: 1, marginLeft: '-15px' }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="row">
          <div className="col-md-6">
            <div className="mt-3">
              <strong>
                Showing 1 to {sortedCategories.length} of {sortedCategories.length} entries
              </strong>
            </div>
          </div>
          <div className="col-md-6">
            <nav aria-label="Page navigation">
              <ul className="pagination d-flex justify-content-end w-100 mt-3">
                <li className="page-item" aria-current="page">
                  <a
                    className="page-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '15px',
                    }}
                    href="#"
                  >
                    <MdKeyboardArrowLeft style={{ fontSize: '20px', lineHeight: 1 }} />
                    <MdKeyboardArrowLeft
                      style={{ fontSize: '20px', lineHeight: 1, marginLeft: '-18px' }}
                    />
                    Previous
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">
                    Page 1
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '15px',
                    }}
                    href="#"
                  >
                    Next
                    <MdKeyboardArrowRight style={{ fontSize: '20px', lineHeight: 1 }} />
                    <MdKeyboardArrowRight
                      style={{ fontSize: '20px', lineHeight: 1, marginLeft: '-18px' }}
                    />
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

export default CategoryList;

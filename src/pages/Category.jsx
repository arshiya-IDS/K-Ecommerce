import React, { useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const Category = () => {
  // Sample data for categories
  const [categories] = useState([
    {
      id: 1,
      name: 'Artistic Grey',
      categoryOf: 'Furnitures',
      image: ''
    },
    {
      id: 2,
      name: 'iPad 12',
      categoryOf: 'Mobile & Tablets',
      image: ''
    },
    {
      id: 3,
      name: 'Da Vinci decor',
      categoryOf: 'Laptops',
      image: ''
    },
    {
      id: 4,
      name: 'Swirling Spiral',
      categoryOf: 'Artifacts',
      image: ''
    }
  ]);

  return (
    <div className="container p-5">
      <div className="row">
        <div className="category-table pt-3 px-3">
          <div className="category-1-heading d-flex justify-content-between bg-success rounded-top" style={{backgroundColor:'#198754'}}>
            <h4 className="py-2 pl-3 text-white p-4">All Category</h4>
            <button className="btn craete-category-btn" id="create-new-subscription-modal-btn-open">Create New</button>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="btn-group mb-3 mt-3">
                <button type="button" className="btn btn-secondary">Exel</button>
                <button type="button" className="btn btn-secondary">PDF</button>
                <button type="button" className="btn btn-secondary">PDF</button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group d-flex justify-content-end w-100 mb-2 mt-3" style={{margin: '43px'}}>
                <div className="form-outline" style={{width: '70%'}}>
                  <input type="search" placeholder="Search ...." id="form1" className="form-control" />
                </div>
                <button type="button" className="btn btn-serch">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="user-align" style={{overflow: 'auto'}}>
            <table id="create-table">
              <thead>
                <tr>
                  <th className="admin-category-sub-heading">Category Name</th>
                  <th className="admin-category-sub-heading">Category Of</th>
                  <th className="admin-category-sub-heading">Category Image</th>
                  <th className="admin-category-sub-heading sticky-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="admin-category-option">{category.name}</td>
                    <td className="admin-category-option">{category.categoryOf}</td>
                    <td className="admin-category-option">
                      <div className="admin-category-images">
                        <img src={category.image} alt="Category Image" />
                      </div>
                    </td>
                    <td className="sticky-action">
                      <a href="#" className="btn btn-sm btn-outline-info subscription-edit" data-toggle="modal" data-target="#myModal">
                        <FaEdit size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-success">
                        <FaEye size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-danger" id={`modal-btn-open-${category.id}`}>
                        <FaTrash size={18} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mt-3">
                <strong>Showing 1 to {categories.length} of {categories.length} entries</strong>
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

export default Category;
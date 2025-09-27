import React, { useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const Product = () => {
  // Sample data for products
  const [products] = useState([
    {
      id: 1,
      title: 'Product 1',
      category: 'Category 1',
      type: 'Type 1',
      price: '$100',
      image: ''
    },
    {
      id: 2,
      title: 'Product 2',
      category: 'Category 2',
      type: 'Type 2',
      price: '$200',
      image: ''
    },
    {
      id: 3,
      title: 'Product 3',
      category: 'Category 3',
      type: 'Type 3',
      price: '$300',
      image: ''
    }
  ]);

  return (
    <div className="container p-5">
      <div className="row">
        <div className="category-table pt-3 px-3">
          <div className="category-1-heading d-flex justify-content-between bg-success rounded-top"style={{backgroundColor:'#198754'}}>
            <h4 className="py-2 pl-3 text-white p-4">All Products</h4>
            <button type="button" className="btn craete-category-btn" id="addcategory">Create New</button>
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
                  <th className="admin-category-sub-heading">Product Title</th>
                  <th className="admin-category-sub-heading">Product Category</th>
                  <th className="admin-category-sub-heading">Product Type</th>
                  <th className="admin-category-sub-heading">Market Price</th>
                  <th className="admin-category-sub-heading">Product Image</th>
                  <th className="admin-category-sub-heading sticky-action">Action</th>
                </tr>
              </thead>
              <tbody id="catlist">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="admin-category-option">{product.title}</td>
                    <td className="admin-category-option">{product.category}</td>
                    <td className="admin-category-option">{product.type}</td>
                    <td className="admin-category-option">{product.price}</td>
                    <td className="admin-category-option">
                      <div className="admin-category-images">
                        <img src={product.image} alt="Product Image" />
                      </div>
                    </td>
                    <td className="sticky-action">
                      <a href="#" className="btn btn-sm btn-outline-info" id={`edit-${product.id}-modal-btn-open`}>
                        <FaEdit size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-success" id={`view-${product.id.toString().padStart(2, '0')}-modal-btn-open`}>
                        <FaEye size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-danger" id={`delete-${product.id}-modal-btn-open`}>
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
                <strong>Showing 1 to {products.length} of {products.length} entries</strong>
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

      {/* Edit Product Modal */}
      <div className="modal" id="myModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Modal Heading</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="producttitle">Product Title</label>
                      <input type="text" className="form-control" id="producttitle" />
                    </div>
                  </div>
                  <input type="hidden" id="index" value="" />
                  <div className="col-md-6">
                    <label htmlFor="productcategory">Product Category</label>
                    <input type="text" className="form-control" id="productcategory" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="Producttype">Product Type</label>
                    <input type="text" className="form-control" id="Producttype" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="marketprice">Market Price</label>
                    <input type="text" className="form-control" id="marketprice" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="productimage">Product Image</label>
                    <input type="text" className="form-control" id="productimage" />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" id="save">Save</button>
              <button type="button" className="btn btn-danger" id="cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
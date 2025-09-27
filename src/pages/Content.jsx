import React, { useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const Content = () => {
  // Sample data for content items
  const [contents] = useState([
    {
      id: 1,
      title: 'Home Banner',
      contentType: 'Home Page',
      author: 'Admin',
      status: 'Published',
      updated: '11-04-2022'
    },
    {
      id: 2,
      title: 'Profile Slider',
      contentType: 'Home Page',
      author: 'Admin',
      status: 'Published',
      updated: '11-04-2022'
    },
    {
      id: 3,
      title: 'Create An Auction Yourself',
      contentType: 'Home Page',
      author: 'Admin',
      status: 'Published',
      updated: '11-04-2022'
    },
    {
      id: 4,
      title: 'Home Banner',
      contentType: 'Home Page',
      author: 'Admin',
      status: 'Published',
      updated: '11-04-2022'
    }
  ]);

  return (
    <div className="container p-5">
      <div className="row">
        <div className="category-table pt-4 pb-3 px-3">
          <div className="category-1-heading d-flex justify-content-between bg-success rounded-top">
            <h4 className="py-2 pl-3 text-white">All Content</h4>
            <button className="btn craete-category-btn" id="create-new-modal-btn-open">Create New</button>
          </div>

          <div className="input-group d-flex justify-content-end w-100 mb-2 mt-3" style={{margin: '43px'}}>
                <div className="form-outline" style={{width: '70%'}}>
                  <input type="search" placeholder="Search ...." id="form1" className="form-control" />
                </div>
                <button type="button" className="btn btn-serch">
                  <i className="fas fa-search"></i>
                </button>
              </div>

          <table id="myTable" className="table-responsive dataTable no-footer" aria-describedby="myTable_info">
            <thead>
              <tr>
                <th className="admin-user-sub-heading pl-3 p-4 sorting sorting_asc" tabIndex="0" 
                    aria-controls="myTable" rowSpan="1" colSpan="1" aria-sort="ascending" 
                    aria-label="Title Name: activate to sort column descending" 
                    style={{width: '180.7188px', borderBottom: 'none'}}>Title Name</th>
                <th className="admin-user-sub-heading pl-3 sorting" tabIndex="0" aria-controls="myTable" 
                    rowSpan="1" colSpan="1" aria-label="Content Type : activate to sort column ascending" 
                    style={{width: '120.031px', borderBottom: 'none'}}>Content Type</th>
                <th className="admin-user-sub-heading pl-3 sorting" tabIndex="0" aria-controls="myTable" 
                    rowSpan="1" colSpan="1" aria-label="Autor: activate to sort column ascending" 
                    style={{width: '100.6562px', borderBottom: 'none'}}>Autor</th>
                <th className="admin-user-sub-heading pl-3 sorting" tabIndex="0" aria-controls="myTable" 
                    rowSpan="1" colSpan="1" aria-label="Status: activate to sort column ascending" 
                    style={{width: '100.2812px', borderBottom: 'none'}}>Status</th>
                <th className="admin-user-sub-heading pl-3 sorting" tabIndex="0" aria-controls="myTable" 
                    rowSpan="1" colSpan="1" aria-label="Updated: activate to sort column ascending" 
                    style={{width: '150.6562px', borderBottom: 'none'}}>Updated</th>
                <th className="admin-user-sub-heading pl-3 sorting" tabIndex="0" aria-controls="myTable" 
                    rowSpan="1" colSpan="1" aria-label="Action: activate to sort column ascending" 
                    style={{width: '140.9062px', borderBottom: 'none'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((content, index) => (
                <tr key={content.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td className={`admin-user-option pl-3 p-3 sorting_1 ${index < 2 ? 'border-0' : ''}`}>{content.title}</td>
                  <td className={`admin-user-option pl-3 ${index < 2 ? 'border-0' : ''}`}>{content.contentType}</td>
                  <td className={`admin-user-option pl-3 ${index < 2 ? 'border-0' : ''}`}>{content.author}</td>
                  <td className={`admin-user-option pl-3 ${index < 2 ? 'border-0' : ''}`}>{content.status}</td>
                  <td className={`admin-user-option pl-3 ${index < 2 ? 'border-0' : ''}`}>{content.updated}</td>
                  <td>
                    <a href="#" className="btn btn-sm btn-outline-info" id={`user-${content.id}-modal-btn-open`}>
                      <FaEdit size={18} />
                    </a>
                    <a href="#" className="btn btn-sm btn-outline-success" id={`view-${content.id.toString().padStart(3, '0')}-modal-btn-open`}>
                      <FaEye size={18} />
                    </a>
                    <a href="#" className="btn btn-sm btn-outline-danger" id={`delete-${content.id}-modal-btn-open`}>
                      <FaTrash size={18} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Content;
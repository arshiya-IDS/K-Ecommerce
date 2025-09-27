import React, { useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const User = () => {
  // Sample data for users
  const [users] = useState([
    {
      id: 1,
      fullName: 'Mohammad Alharbi',
      userCode: 'UAE2098',
      email: 'Alharbi@gmail.com',
      gender: 'Male',
      age: '25'
    },
    {
      id: 2,
      fullName: 'Ahmed Mohammed',
      userCode: 'UAE2099',
      email: 'Ahmed@gmail.com',
      gender: 'Male',
      age: '30'
    },
    {
      id: 3,
      fullName: 'Fatima Ali',
      userCode: 'UAE2100',
      email: 'Fatima@gmail.com',
      gender: 'Female',
      age: '28'
    }
  ]);

  return (
    <div className="container mt-4 px-5">
      <div className="row">
        
        <div className="category-table m-0 py-4 px-3 mb-5">
          <div className="category-1-heading d-flex justify-content-between bg-success rounded-top" style={{backgroundColor:'#198754'}}>
            <h4 className="py-2 pl-3 text-white p-4">User Management</h4>
            <button className="btn craete-category-btn" id="create-modal-btn-open">Create New</button>
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
            <table>
              <thead>
                <tr>
                  <th className="admin-user-sub-heading">Full Name</th>
                  <th className="admin-user-sub-heading">User Code</th>
                  <th className="admin-user-sub-heading">Email ID</th>
                  <th className="admin-user-sub-heading">Gender</th>
                  <th className="admin-user-sub-heading">Age</th>
                  <th className="admin-user-sub-heading sticky-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-user-option">{user.fullName}</td>
                    <td className="admin-user-option">{user.userCode}</td>
                    <td className="admin-user-option">{user.email}</td>
                    <td className="admin-user-option">{user.gender}</td>
                    <td className="admin-user-option">{user.age}</td>
                    <td className="sticky-action">
                      <a href="#" className="btn btn-sm btn-outline-info" id={`user-${user.id.toString().padStart(2, '0')}-modal-btn-open`}>
                        <FaEdit size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-success" id={`view-${user.id.toString().padStart(3, '0')}-modal-btn-open`}>
                        <FaEye size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-danger" id={`delete-${user.id.toString().padStart(2, '0')}-modal-btn-open`}>
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
                <strong>Showing 1 to {users.length} of {users.length} entries</strong>
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

      {/* Create User Modal */}
      <div id="create-myModal" className="delete-modal">
        <div className="Delete-modal-content">
          <div className="modal-body" style={{backgroundColor: 'aliceblue', borderRadius: '12px'}}>
            <span className="close-delete">&times;</span>
            <div className="container mt-2 mb-5 px-4">
              <div className="row">
                <div className="create-user-view">
                  <h3>Create User</h3>
                </div>
                <hr className="mt-3" />
                <div className="form-group row">
                  <div className="col-md-6">
                    <label htmlFor="FirstName">First Name</label>
                    <input type="text" placeholder="Enter First Name" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="LastName">Last Name</label>
                    <input type="text" placeholder="Enter Last Name" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
                    <label htmlFor="Age">Age</label>
                    <input type="text" placeholder="Enter Age" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="Gender">Gender</label>
                    <select className="form-control">
                      <option value="" selected="selected">select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
                    <label htmlFor="Occupation">Occupation</label>
                    <input type="text" placeholder="Enter Occupation" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="Education">Education</label>
                    <input type="text" placeholder="Enter Education" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
                    <label htmlFor="Email">Email</label>
                    <input type="text" placeholder="Enter Email" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="Mobile">Mobile</label>
                    <input type="number" placeholder="Enter Mobile Number" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-6">
                    <label htmlFor="admin">Roles</label>
                    <select className="form-control">
                      <option value="" select="selected">select</option>
                      {/* Role options would go here */}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
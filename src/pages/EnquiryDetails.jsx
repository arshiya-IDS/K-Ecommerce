import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";


const EnquiryDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enquiryData, enquiryInfo, mode } = location.state || {};

  // If no data is passed, use default data
  const defaultEnquiryData = {
    enquiryId: "ENQ002",
    contactNo: "+91 50234 45678",
    email: "jane@example.com",
    message: "This is a sample message for the enquiry.",
    createdAt: "2022-06-08",
    fullName: "Jane Smith",
    location: "Abu Dhabi, UAE",
    category: "Support Request",
    status: "Resolved",
  };

  const defaultEnquiryInfo = [
    {
      srNo: 1,
      dateTime: "26/08/2025, 19:14:02",
      userName: "Tax Ustaad Admin",
      status: "Assigned",
      remark: "Please Process",
    },
    {
      srNo: 2,
      dateTime: "30/08/2025, 15:58:43",
      userName: "Tax Ustaad Admin",
      status: "Closed",
      remark: "-",
    },
  ];

  const [formData, setFormData] = useState(enquiryData || defaultEnquiryData);
  const [infoData, setInfoData] = useState(enquiryInfo || defaultEnquiryInfo);
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [categoryForm, setCategoryForm] = useState({
    category: "",
    subCategory: "",
    user: "Tax Ustaad Admin",
    status: "Offline",
    remark: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: value,
    });
  };

  const handleBack = () => {
    navigate("/enquiry");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, you would save the data to a backend here
    setIsEditing(false);
    // For now, we'll just stay in view mode
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData(enquiryData || defaultEnquiryData);
    setIsEditing(false);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 mt-2">
          {/* Back Button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button 
              onClick={handleBack}
              className="btn btn-primary"
             style={{
              display: "flex",
              alignItems: "center",
              gap: "4px", // spacing between arrow and text
              fontSize: "16px", // adjust this to your desired text size
             }}
            >
              <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1 }}/> 
              <MdKeyboardArrowLeft style={{ fontSize: "20px", lineHeight: 1, marginLeft: "-18px" }} />

              BACK 
            </button>
            <h2 className="text-center mb-0 text-primary flex-grow-1">{formData.enquiryId}</h2>
            <div style={{ width: '60px' }}></div> {/* Spacer to balance the layout */}
          </div>

          {/* Enquiry Details Form */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h4 className="mb-0">Enquiry Details</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Enquiry ID:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="text"
                          name="enquiryId"
                          value={formData.enquiryId}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.enquiryId}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Full Name:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.fullName}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Contact No:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="text"
                          name="contactNo"
                          value={formData.contactNo}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.contactNo}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Location:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.location}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Email:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.email}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Category:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.category}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-12 mb-3">
                  <div className="row">
                    <div className="col-2">
                      <label className="form-label fw-bold">Message:</label>
                    </div>
                    <div className="col-10">
                      {isEditing ? (
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          rows="3"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.message}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Status:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="text"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">
                          <span className={`badge ${
                            formData.status === 'Pending' ? 'bg-warning' : 
                            formData.status === 'Resolved' ? 'bg-success' : 
                            formData.status === 'In Progress' ? 'bg-primary' : 'bg-secondary'
                          }`}>
                            {formData.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label fw-bold">Created At:</label>
                    </div>
                    <div className="col-8">
                      {isEditing ? (
                        <input
                          type="text"
                          name="createdAt"
                          value={formData.createdAt}
                          onChange={handleInputChange}
                          className="form-control border-bottom pb-2"
                          style={{ borderRadius: '0', border: 'none', borderBottom: '1px solid #dee2e6', boxShadow: 'none' }}
                        />
                      ) : (
                        <div className="border-bottom pb-2">{formData.createdAt}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="d-flex justify-content-end">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="btn btn-secondary me-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                  </>
                ) : (
                    <button
                      onClick={handleEdit}
                      className="btn btn-success"
                      style={{
                        position: 'absolute',
                        bottom: '390px',
                        right: '10px',
                        zIndex: 10
                      }}
                    >
                      Edit
                    </button>

                )}
              </div>
            </div>
          </div>

          {/* Enquiry Info Table */}
          <div className="card shadow-sm mb-5">
            <div className="card-header bg-light">
              <h4 className="mb-0">Enquiry Info</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped" style={{borderCollapse: 'collapse'}}>
                  <thead className="thead-dark">
                    <tr>
                      <th className="admin-user-sub-heading p-3 text-black" style={{border: '1px solid #dee2e6'}}>SR. NO.</th>
                      <th className="admin-user-sub-heading p-3 text-black" style={{border: '1px solid #dee2e6'}}>DATE–TIME</th>
                      <th className="admin-user-sub-heading p-3 text-black" style={{border: '1px solid #dee2e6'}}>USER NAME</th>
                      <th className="admin-user-sub-heading p-3 text-black" style={{border: '1px solid #dee2e6'}}>STATUS</th>
                      <th className="admin-user-sub-heading p-3 text-black" style={{border: '1px solid #dee2e6'}}>REMARK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoData.map((row) => (
                      <tr key={row.srNo}>
                        <td className="p-3" style={{border: '1px solid #dee2e6'}}>{row.srNo}</td>
                        <td className="p-3" style={{border: '1px solid #dee2e6'}}>{row.dateTime}</td>
                        <td className="p-3" style={{border: '1px solid #dee2e6'}}>{row.userName}</td>
                        <td className="p-3" style={{border: '1px solid #dee2e6'}}>
                          <span className={`badge ${
                            row.status === 'Assigned' ? 'bg-warning' : 
                            row.status === 'Closed' ? 'bg-success' : 'bg-secondary'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="p-3" style={{border: '1px solid #dee2e6'}}>{row.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Category Form */}
          <div className="card shadow-sm">
            {/* <div className="card-header bg-light">
              <h4 className="mb-0">Category</h4>
            </div> */}
            {isEditing && (
              <div className="card-body">
                <div className="row">
                  {/* First row with Category and Sub-Category side by side */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Select Category:</label>
                    <select 
                      className="form-control"
                      name="category"
                      value={categoryForm.category}
                      onChange={handleCategoryFormChange}
                    >
                      <option value="">Select Category</option>
                      <option value="Support">Support</option>
                      <option value="Inquiry">Inquiry</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Sub-Category:</label>
                    <select 
                      className="form-control"
                      name="subCategory"
                      value={categoryForm.subCategory}
                      onChange={handleCategoryFormChange}
                    >
                      <option value="">Select Sub-category</option>
                      <option value="Technical">Technical</option>
                      <option value="Billing">Billing</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  
                  {/* Second row with User and Status side by side */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">User:</label>
                    <select 
                      className="form-control"
                      name="user"
                      value={categoryForm.user}
                      onChange={handleCategoryFormChange}
                    >
                      <option value="Tax Ustaad Admin">Tax Ustaad Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Status:</label>
                    <select 
                      className="form-control"
                      name="status"
                      value={categoryForm.status}
                      onChange={handleCategoryFormChange}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  
                  {/* Remark field spanning full width */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-bold">Remark:</label>
                    <textarea
                      className="form-control"
                      name="remark"
                      value={categoryForm.remark}
                      onChange={handleCategoryFormChange}
                      rows="3"
                      placeholder="Enter Remark"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetails;
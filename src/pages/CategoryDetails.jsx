import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";
import { MdDescription } from "react-icons/md";

const CategoryDetails = () => {
  // Hardcoded category details
  const [category, setCategory] = useState({
    category_id: 1,
    category_name: "Artistic Grey",
    category_of: "Furnitures",
    is_active: "Active",
    parent_categoryid:"2",
    description:"abc",
    created_at: "2025-10-20",
    updated_at: "2025-10-22",
  });

  const [searchTerm, setSearchTerm,users] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Toggle Edit Mode
  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? " Edit mode disabled." : " Edit mode enabled.");
  };

   const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };
  
  // Handle Deactivation
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setCategory({ ...category, is_active: "Inactive" });
    setMessage("⚠️ This category has been deactivated successfully!");
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 rounded"

        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-40px",
          height: "50px",
        }}
      >
        <h2 style={{ fontSize: "20px",fontWeight:'normal',marginLeft:'420px' }}>Category Details</h2>

        {/* Center: Search Bar */}
    <div
      className="input-group"
      style={{
        maxWidth: "350px",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <input
        type="search"
        placeholder="Search by ID, Name, Contact, Email, Location..."
        className="form-control form-control-sm"
        style={{
          height: "30px",
          fontFamily: "inherit",
          fontSize: "inherit",
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
        style={{ height: "34px", width: "34px", padding: 0 }}
        title="Search"
        onClick={handleSearch}
      >
        <i className="fas fa-search" style={{ fontSize: "13px" }}></i>
      </button>
    </div>
  
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}
       style={{marginTop:"6px"}}
      >
        {/* <h5 className="fw mb-3">Category Information</h5> */}

        <div className="row">
          {[
            ["category_id", "Category ID"],
            ["category_name", "Category Name"],
            ["category_of", "Category Type"],
            ["is_active", "Status"],
            ["parent_categoryid","Parent Category ID"],
            ["description","Description"],
            ["created_at", "Created At"],
            ["updated_at", "Last Updated"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              <input
                type="text"
                name={key}
                className="form-control"
                 style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
                value={category[key]}
                onChange={handleChange}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        

        {/* Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-primary fw-bold px-4 py-2 rounded-3"
            disabled={isDeactivated}
          >
            {isEditable ? "Submit" : "Edit"}
          </button>

          {/* <button
            type="button"
            onClick={handleDeactivate}
            className={`fw-bold px-4 py-2 rounded-3 btn ${
              isDeactivated ? "btn-secondary" : "btn-danger"
            }`}
            disabled={isDeactivated}
          >
            {isDeactivated ? "Deactivated" : "Deactivate"}
          </button> */}
        </div>

        {/* Message */}
        {message && (
          <div className="alert alert-success text-center mt-4">{message}</div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;

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
        className="text-center py-3 mb-4 rounded"
        style={{
          backgroundColor: "#FEC200",
          color: "black",
          border: "1px solid black",
          marginTop: "-35px",
          height: "45px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginTop: "-5px" }}>Category Details</h2>
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>
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
            {isEditable ? "Save Changes" : "Edit"}
          </button>

          <button
            type="button"
            onClick={handleDeactivate}
            className={`fw-bold px-4 py-2 rounded-3 btn ${
              isDeactivated ? "btn-secondary" : "btn-danger"
            }`}
            disabled={isDeactivated}
          >
            {isDeactivated ? "Deactivated" : "Deactivate"}
          </button>
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

import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";

const SubCategoryDetails = () => {
  // Hardcoded subcategory details
  const [subCategory, setSubCategory] = useState({
    sub_category_id: 1,
    sub_category_name: "Steel Frames",
    sub_category_description: "High-quality steel frames for industrial use.",
    parent_category_id: 2,
    category_type: "Metal Works",
    is_active: "Active",
    created_at: "2025-10-18",
    updated_at: "2025-10-21",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategory({ ...subCategory, [name]: value });
  };

  // Toggle Edit Mode
  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? "✏️ Edit mode disabled." : "✏️ Edit mode enabled.");
  };

  // Handle Deactivation
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setSubCategory({ ...subCategory, is_active: "Inactive" });
    setMessage("⚠️ This subcategory has been deactivated successfully!");
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
        <h2 style={{ fontSize: "20px", marginTop: "-5px" }}>
          Subcategory Details
        </h2>
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>

        <div className="row">
          {[
            ["sub_category_id", "Subcategory ID"],
            ["sub_category_name", "Subcategory Name"],
            ["sub_category_description", "Description"],
            ["parent_category_id", "Parent Category ID"],
            ["category_type", "Category Type"],
            ["is_active", "Status"],
            ["created_at", "Created At"],
            ["updated_at", "Last Updated"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              {key === "sub_category_description" ? (
                <textarea
                  name={key}
                  className="form-control"
                  rows="3"
                  value={subCategory[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                ></textarea>
              ) : (
                <input
                  type="text"
                  name={key}
                  className="form-control"
                  value={subCategory[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                />
              )}
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

export default SubCategoryDetails;

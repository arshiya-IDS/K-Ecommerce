import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";

const NotificationTemplateDetails = () => {
  // Hardcoded notification template details
  const [template, setTemplate] = useState({
    template_id: 1,
    template_name: "Order Confirmation",
    subject: "Your order has been confirmed!",
    body: "Hello {username},\n\nYour order #{order_id} has been confirmed and will be shipped soon.\n\nThank you for shopping with us.",
    user_id: 101,
    product_id: 202,
    is_active: "Active",
    created_at: "2025-10-20",
    updated_at: "2025-10-22",
  });

  const [searchTerm, setSearchTerm,users] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate({ ...template, [name]: value });
  };

  const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
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
    setTemplate({ ...template, is_active: "Inactive" });
    setMessage("⚠️ This notification template has been deactivated successfully!");
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div
       className="d-flex align-items-center justify-content-between px-3 rounded"

        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-35px",
          height: "45px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight:'normal',marginLeft:'420px' }}>
          Notification Template Details
        </h2>

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

        <div className="row">
          {[
            ["template_id", "Template ID"],
            ["template_name", "Template Name"],
            ["subject", "Subject"],
            ["body", "Body"],
            ["is_active", "Status"],
            ["created_at", "Created At"],
            ["updated_at", "Last Updated"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              {key === "body" ? (
                <textarea
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
                  rows="5"
                  value={template[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                ></textarea>
              ) : (
                <input
                  type={key.includes("id") ? "number" : "text"}
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
                  value={template[key]}
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
            {isEditable ? "Submit" : "Edit"}
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

export default NotificationTemplateDetails;

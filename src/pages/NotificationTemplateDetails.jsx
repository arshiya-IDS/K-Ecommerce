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

  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate({ ...template, [name]: value });
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
          Notification Template Details
        </h2>
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>

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

export default NotificationTemplateDetails;

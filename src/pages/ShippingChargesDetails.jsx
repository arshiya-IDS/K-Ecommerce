import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";

const ShippingChargesDetails = () => {
  // Hardcoded shipping charge details
  const [shippingCharge, setShippingCharge] = useState({
    charge_id: 1,
    charge_name: "Standard Shipping",
    charge_type: "Fixed", // Fixed or Percentage
    charge_value: "50",
    min_purchase_amount: "500",
    estimated_days: "5",
    is_active: "Active",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingCharge({ ...shippingCharge, [name]: value });
  };

  // Toggle Edit Mode
  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? "✏️ Edit mode disabled." : "✏️ Edit mode enabled.");
  };

  // Deactivate Record
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setShippingCharge({ ...shippingCharge, is_active: "Inactive" });
    setMessage("⚠️ This shipping charge rule has been deactivated successfully!");
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
          Shipping Charges Details
        </h2>
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>
        <h5 className="fw mb-3">Shipping Charge Information</h5>

        <div className="row">
          {[
            ["charge_id", "Charge ID"],
            ["charge_name", "Charge Name"],
            ["charge_type", "Charge Type"],
            ["charge_value", "Charge Value"],
            ["min_purchase_amount", "Minimum Purchase Amount ($)"],
            ["estimated_days", "Estimated Delivery Days"],
            ["is_active", "Status"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              <input
                type="text"
                name={key}
                className="form-control"
                value={shippingCharge[key]}
                onChange={handleChange}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Info Text */}
        <hr />
        <h5 className="fw mb-3">Rule Information</h5>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            value={`This rule applies to orders above $${shippingCharge.min_purchase_amount}. Estimated delivery time is ${shippingCharge.estimated_days} days.`}
            readOnly
          ></textarea>
          <small className="text-muted">
            The above details describe this shipping rule.
          </small>
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

export default ShippingChargesDetails;

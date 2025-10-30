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
  const [searchTerm, setSearchTerm,users] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingCharge({ ...shippingCharge, [name]: value });
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
        className="d-flex align-items-center justify-content-between px-3 rounded"
        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-35px",
          height: "45px",
        }}
      >
        <h2 style={{ fontSize: "20px",fontWeight:'normal',marginLeft:'420px' }}>
          Shipping Charges Details
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
                 style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
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
            style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
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

export default ShippingChargesDetails;

import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";

const UserDiscountDetails = () => {
  // Hardcoded user discount details
  const [discount, setDiscount] = useState({
    user_discount_id: 101,
    user_name: "John Doe",
    userDiscountName: "Loyalty Bonus",
    userDiscountType: "percentage",
    userDiscountValue: "10",
    userDiscountStartDate: "2025-10-10",
    userDiscountEndDate: "2025-11-10",
    userDiscountIsActive: "Active",
  });

  const [searchTerm, setSearchTerm,users] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change during edit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount({ ...discount, [name]: value });
  };

  const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };
  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? "✏️ Edit mode disabled." : "✏️ Edit mode enabled.");
  };

  // Deactivate discount
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setDiscount({ ...discount, userDiscountIsActive: "Inactive" });
    setMessage("⚠️ This user discount has been deactivated successfully!");
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
          User Discount Details
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
            ["user_discount_id", "Discount ID"],
            ["user_name", "User Name"],
            ["userDiscountName", "Discount Name"],
            ["userDiscountType", "Discount Type"],
            ["userDiscountValue", "Discount Value"],
            ["userDiscountStartDate", "Start Date"],
            ["userDiscountEndDate", "End Date"],
            ["userDiscountIsActive", "Status"],
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
                value={
                  key === "userDiscountValue"
                    ? discount.userDiscountType === "percentage"
                      ? `${discount[key]} %`
                      : `$ ${discount[key]}`
                    : discount[key]
                }
                onChange={handleChange}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        <hr />

        {/* Notes Section */}
        <h5 className="fw mb-3">Discount Notes</h5>
        <div className="mb-3">
          <textarea
            name="notes"
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
            value={
              discount.userDiscountIsActive === "Active"
                ? "This discount is currently active for the selected user."
                : "This discount has been deactivated and is no longer valid."
            }
            readOnly
          ></textarea>
          <small className="text-muted">
            Notes auto-updated based on discount status.
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

export default UserDiscountDetails;

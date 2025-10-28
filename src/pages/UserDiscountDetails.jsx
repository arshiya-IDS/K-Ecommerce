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

  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change during edit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount({ ...discount, [name]: value });
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
          User Discount Details
        </h2>
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>

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

export default UserDiscountDetails;

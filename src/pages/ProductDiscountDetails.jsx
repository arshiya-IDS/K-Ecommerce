import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";

const ProductDiscountDetails = () => {
  // Hardcoded discount details
  const [discount, setDiscount] = useState({
    discount_id: 1,
    discount_name: "Festive Offer",
    discount_value: "15",
    category_name: "Metal Works",
    sub_category_name: "Steel",
    products: ["Laser Cut Plate", "Steel Rod", "Industrial Frame"],
    start_date: "2025-10-01",
    end_date: "2025-10-31",
    is_active: "Active",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount({ ...discount, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? "✏️ Edit mode disabled." : "✏️ Edit mode enabled.");
  };

  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setDiscount({ ...discount, is_active: "Inactive" });
    setMessage("⚠️ This discount has been deactivated successfully!");
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
          Product Discount Details
        </h2>
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>

        <div className="row">
          {[
            ["discount_id", "Discount ID"],
            ["discount_name", "Discount Name"],
            ["discount_value", "Discount Value (%)"],
            ["category_name", "Category"],
            ["sub_category_name", "Sub-Category"],
            ["start_date", "Start Date"],
            ["end_date", "End Date"],
            ["is_active", "Status"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              <input
                type="text"
                name={key}
                className="form-control"
                value={discount[key]}
                onChange={handleChange}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Product List */}
        <hr />
        <h5 className="fw mb-3">Applicable Products</h5>
        <div className="mb-3">
          <textarea
            name="products"
            className="form-control"
            rows="4"
            value={discount.products.join(", ")}
            readOnly
          ></textarea>
          <small className="text-muted">These products are under this discount offer.</small>
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

export default ProductDiscountDetails;

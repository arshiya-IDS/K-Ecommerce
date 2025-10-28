import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";

const ProductDetails = () => {
  // Hardcoded product data
  const [product, setProduct] = useState({
    product_id: 101,
    product_name: "Laser Cut Steel Plate",
    product_description:
      "High-precision laser cut steel plate ideal for industrial and architectural projects. Offers excellent durability and finish.",
    product_actual_price: "2500",
    product_discounted_price: "2200",
    category_name: "Metal Works",
    subcategory_name: "Steel",
    product_type: "Physical",
    created_at: "2025-10-20",
    status: "Active",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? "✏️ Edit mode disabled." : "✏️ Edit mode enabled.");
  };

  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setMessage("⚠️ Product has been deactivated successfully!");
  };

  return (
    <div className="container my-5">
      {/* Header Section */}
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
        <h2 style={{ fontSize: "20px", marginTop: "-5px" }}>Product Details</h2>
      </div>

      {/* Card Section */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>
        {/* Product Info */}
        <div className="row">
          {[
            ["product_id", "Product ID"],
            ["product_name", "Product Name"],
            ["product_description", "Description"],
            ["product_actual_price", "Actual Price (₹)"],
            ["product_discounted_price", "Discounted Price (₹)"],
            ["category_name", "Category"],
            ["subcategory_name", "Subcategory"],
            ["product_type", "Product Type"],
            ["created_at", "Created At"],
            ["status", "Status"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              {key === "product_description" ? (
                <textarea
                  name={key}
                  className="form-control"
                  rows="3"
                  value={product[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                ></textarea>
              ) : (
                <input
                  type="text"
                  name={key}
                  className="form-control"
                  value={product[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                />
              )}
            </div>
          ))}
        </div>

        {/* Product Images */}
        <hr />
        <h5 className="fw mb-3">Product Images</h5>
        <div className="d-flex gap-3 flex-wrap">
          {product.images.map((img, index) => (
            <div
              key={index}
              className="border rounded-3 p-2"
              style={{ width: "150px", backgroundColor: "#f9f9f9" }}
            >
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="img-fluid rounded"
                style={{ height: "100px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-primary fw-bold px-4 py-2 rounded-3"
            disabled={isDeactivated}
          >
            {isEditable ? "Save Changes" : "Edit"}
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

export default ProductDetails;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const ProductDiscountDetails = () => {
      const navigate = useNavigate();
  
  const { id } = useParams();
  const [discount, setDiscount] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Separate states for controlled inputs (prices are read-only in most cases)
  const [actualPrice, setActualPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");

  // -----------------------------------------
  // FETCH DISCOUNT DETAILS
  // -----------------------------------------
  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `http://ecommerce-admin-backend.i-diligence.com/api/ProductDiscount/details/${id}`
      );
      const d = res.data.data;

      // Store the full discount object directly
      setDiscount(d);

      // Set deactivated state
      setIsDeactivated(!d.isActive);

      // Initialize price fields
      setActualPrice(d.actualPrice ?? "");
      setDiscountedPrice(d.discountedPrice ?? "");
    } catch (err) {
      console.error("Fetch details error:", err);
      toast.error("Failed to load discount details");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!discount) {
    return (
      <div className="text-center p-5">
        <h5>Loading...</h5>
      </div>
    );
  }

  // -----------------------------------------
  // CHANGE HANDLER
  // -----------------------------------------
  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "discountValue") {
      const numValue = Number(value);
      setDiscount((prev) => ({ ...prev, discountValue: numValue }));

      // Auto-calculate discounted price when discount % changes
      if (numValue > 0 && numValue <= 100 && actualPrice) {
        const newDiscounted = Math.round(
          actualPrice - (actualPrice * numValue) / 100,
          2
        );
        setDiscountedPrice(newDiscounted);
      }
    } else if (name === "startDate" || name === "endDate") {
      // Keep full ISO string for backend
      setDiscount((prev) => ({ ...prev, [name]: value ? `${value}T00:00:00` : null }));
    } else {
      setDiscount((prev) => ({ ...prev, [name]: value }));
    }
  };

  // -----------------------------------------
  // EDIT / SUBMIT TOGGLE
  // -----------------------------------------
  const handleEditToggle = async () => {
    if (!isEditable) {
      setIsEditable(true);
      setMessage("Edit mode enabled.");
      return;
    }

    // Validation
    if (!discount.discountName?.trim()) {
      toast.error("Discount name is required");
      return;
    }
    if (
      !discount.discountValue ||
      discount.discountValue <= 0 ||
      discount.discountValue > 100
    ) {
      toast.error("Discount value must be between 1 and 100");
      return;
    }

    try {
      const payload = {
        discountName: discount.discountName.trim(),
        discountValue: Number(discount.discountValue),
        startDate: discount.startDate,
        endDate: discount.endDate,
        isActive: discount.isActive,
      };

      const res = await axios.put(
        `http://ecommerce-admin-backend.i-diligence.com/api/ProductDiscount/${id}`,
        payload
      );

      toast.success("Discount updated successfully!");
      setIsEditable(false);
      setMessage("Changes saved.");
      navigate("/product-discount-list");


      // Update state with fresh data from server
      const updated = res.data.data;
      setDiscount(updated);
      setActualPrice(updated.actualPrice ?? "");
      setDiscountedPrice(updated.discountedPrice ?? "");
      setIsDeactivated(!updated.isActive);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update discount"
      );
    }
  };

  // Helper to safely extract date part for <input type="date">
  const getDateValue = (dateString) => {
    if (!dateString) return "";
    return dateString.substring(0, 10); // YYYY-MM-DD
  };

  const fields = [
    { key: "productDiscountId", label: "Discount ID", type: "text", readOnly: true },
    { key: "discountName", label: "Discount Name", type: "text" },
    { key: "discountValue", label: "Discount Value (%)", type: "number" },
    { key: "actualPrice", label: "Actual Price", type: "number", readOnly: true },
    { key: "discountedPrice", label: "Discounted Price", type: "number", readOnly: true },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "createdAt", label: "Created At", type: "text", readOnly: true },
  ];

  return (
    <div className="container my-5">
      {/* Header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 rounded"
        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-40px",
          height: "50px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "normal",
            marginLeft: "400px",
          }}
        >
          Product Discount Details
        </h2>
      </div>

      {/* Card */}
      <div className="card shadow-sm p-4" style={{ marginTop: "6px" }}>
        <div className="row">
          {fields.map(({ key, label, type, readOnly: forceReadOnly }) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>

              {key === "isActive" ? (
                <select
                  className="form-control"
                  value={discount.isActive ? "Active" : "Inactive"}
                  onChange={(e) =>
                    setDiscount((prev) => ({
                      ...prev,
                      isActive: e.target.value === "Active",
                    }))
                  }
                  disabled={!isEditable || isDeactivated}
                  style={{
                    backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                    border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : (
                <input
                  type={type}
                  name={key}
                  className="form-control"
                  style={{
                    backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                    border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                  value={
                    key === "startDate" || key === "endDate"
                      ? getDateValue(discount[key])
                      : key === "actualPrice"
                      ? actualPrice
                      : key === "discountedPrice"
                      ? discountedPrice
                      : discount[key] ?? ""
                  }
                  onChange={
                    key === "actualPrice"
                      ? (e) => setActualPrice(e.target.value)
                      : key === "discountedPrice"
                      ? (e) => setDiscountedPrice(e.target.value)
                      : onChangeHandler
                  }
                  readOnly={
                    !isEditable ||
                    isDeactivated ||
                    forceReadOnly ||
                    key === "actualPrice" ||
                    key === "discountedPrice" ||
                    key === "createdAt" ||
                    key === "productDiscountId"
                  }
                />
              )}
            </div>
          ))}

          {/* Status Field (isActive) - placed after others */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-control"
              value={discount.isActive ? "Active" : "Inactive"}
              onChange={(e) =>
                setDiscount((prev) => ({
                  ...prev,
                  isActive: e.target.value === "Active",
                }))
              }
              disabled={!isEditable || isDeactivated}
              style={{
                backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <hr />
        <h5 className="mb-3">Applicable Products</h5>
        <textarea
          className="form-control"
          rows="4"
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            padding: "10px",
          }}
          value={
            discount.products?.length > 0
              ? discount.products
                  .map((p) => `${p.productName} (ID: ${p.productId})`)
                  .join("\n")
              : "No products found"
          }
          readOnly
        />

        <small className="text-muted">
          These products are under this discount offer.
        </small>

        {/* Buttons */}
        <div className="mt-4 d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-primary fw-bold px-4 py-2 rounded-3"
          >
            {isEditable ? "Submit Changes" : "Edit"}
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div className="alert alert-success text-center mt-4">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ProductDiscountDetails;
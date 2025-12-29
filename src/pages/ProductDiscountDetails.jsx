import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProductDiscountDetails = () => {
  const { id } = useParams(); // discount id (from URL)
  const [discount, setDiscount] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Editing states: these were missing and caused "not defined" errors
  const [actualPrice, setActualPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  // If you need to edit a specific product, keep this; otherwise it's unused.
  const [editProductId, setEditProductId] = useState(null);

  // -----------------------------------------
  // FETCH DISCOUNT DETAILS
  // -----------------------------------------
  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7013/api/ProductDiscount/details/${id}`
      );
      const d = res.data.data;

      setDiscount({
        discount_id: d.productDiscountId,
        discount_name: d.discountName,
        discount_value: d.discountValue,
        actual_price: d.actualPrice ?? "",
        discounted_price: d.discountedPrice ?? "",
        created_at: d.createdAt,
        is_active: d.isActive ? "Active" : "Inactive",
        products: d.products || [],
      });

      setIsDeactivated(!d.isActive);

      // initialize edit fields from API values
      setActualPrice(d.actualPrice ?? "");
      setDiscountedPrice(d.discountedPrice ?? "");

      // default edit product (if you want to edit product-specific price)
      if (d.products && d.products.length > 0) {
        setEditProductId(d.products[0].productId);
      } else {
        setEditProductId(null);
      }
    } catch (err) {
      console.error("Fetch details error:", err);
      toast.error("Failed to load discount details");
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!discount) {
    return (
      <div className="text-center p-5">
        <h5>Loading...</h5>
      </div>
    );
  }

  // -----------------------------------------
  // CHANGE HANDLER FOR NON-price FIELDS
  // -----------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiscount({ ...discount, [name]: value });
  };

  // Product selector handler (optional — only needed if editing a specific product)
  const handleProductSelect = (e) => {
    const pid = Number(e.target.value);
    setEditProductId(pid);

    // if API provides product-specific price fields, find them and populate
    const selected = discount.products.find((p) => p.productId === pid);
    if (selected) {
      setActualPrice(selected.productActualPrice ?? discount.actual_price ?? "");
      setDiscountedPrice(
        selected.productDiscountedPrice ?? discount.discounted_price ?? ""
      );
    } else {
      setActualPrice(discount.actual_price ?? "");
      setDiscountedPrice(discount.discounted_price ?? "");
    }
  };

  // -----------------------------------------
  // ENABLE / DISABLE EDIT MODE & SUBMIT
  // -----------------------------------------
  const handleEditToggle = async () => {
    // If not currently editable -> enable edit mode and return
    if (!isEditable) {
      setIsEditable(true);
      setMessage("Edit mode enabled.");
      return;
    }

    // Submitting when in edit mode
    // Basic validation
    const actualNum = Number(actualPrice);
    const discNum = Number(discountedPrice);

    if (Number.isNaN(actualNum) || Number.isNaN(discNum)) {
      toast.error("Actual price and discounted price must be valid numbers.");
      return;
    }

    if (discNum > actualNum) {
      toast.error("Discounted price cannot be greater than actual price.");
      return;
    }

    try {
      // NOTE:
      // I assume your backend accepts PUT /api/ProductDiscount/edit-discount/{id}
      // where {id} is the discount id. If your backend expects PRODUCT id,
      // change the URL to `/edit-discount/${editProductId}` instead.
      const url = `https://localhost:7013/api/ProductDiscount/edit-discount/${id}`;

      const payload = {
        // keys used previously in your examples
        productActualPrice: actualNum,
        productDiscountedPrice: discNum,
        updatedBy: "Admin",
        // optional: include discount id in body if backend needs it
        productDiscountId: id,
        // optional: include product id if editing a specific product
        productId: editProductId,
      };

      const response = await axios.put(url, payload);

      toast.success("Discount updated successfully!");
      setIsEditable(false);
      setMessage("Edit mode disabled.");

      // If backend returns an updated product object, update local list
      if (response?.data?.product) {
        const updatedProd = response.data.product;
        setDiscount((prev) => {
          const nextProducts = prev.products.map((p) =>
            p.productId === updatedProd.product_Id
              ? {
                  ...p,
                  productName: updatedProd.product_Name,
                  productActualPrice: updatedProd.product_Actual_Price,
                  productDiscountedPrice:
                    updatedProd.product_Discounted_Price,
                }
              : p
          );
          return { ...prev, products: nextProducts };
        });
      }

      // Refresh entire details to be safe
      await fetchDetails();
    } catch (error) {
      console.error("Update error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to update discount";
      toast.error(msg);
    }
  };

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
      <div
        className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}
        style={{ marginTop: "6px" }}
      >
        <div className="row">
          {[
            ["discount_id", "Discount ID"],
            ["discount_name", "Discount Name"],
            ["discount_value", "Discount Value (%)"],
            ["actual_price", "Actual Price"],
            ["discounted_price", "Discounted Price"],
            ["created_at", "Created At"],
            ["is_active", "Status"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              <input
                type={key === "actual_price" || key === "discounted_price" ? "number" : "text"}
                name={key}
                className="form-control"
                style={{
                  backgroundColor:
                    isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                  border:
                    isEditable && !isDeactivated
                      ? "1px solid #80bdff"
                      : "1px solid #dee2e6",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#212529",
                  transition: "all 0.3s ease",
                }}
                value={
                  key === "actual_price"
                    ? actualPrice
                    : key === "discounted_price"
                    ? discountedPrice
                    : discount[key]
                }
                onChange={(e) => {
                  if (key === "actual_price") setActualPrice(e.target.value);
                  else if (key === "discounted_price")
                    setDiscountedPrice(e.target.value);
                  else handleChange(e);
                }}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Products */}
        <hr />
        <h5 className="fw mb-3">Applicable Products</h5>

        {/* Optional: product selector when you want to edit a specific product */}
        {discount.products && discount.products.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Select product to edit (optional)</label>
            <select
              className="form-control"
              value={editProductId ?? ""}
              onChange={handleProductSelect}
              disabled={!isEditable || isDeactivated}
            >
              {discount.products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName} (ID: {p.productId})
                </option>
              ))}
            </select>
          </div>
        )}

        <textarea
          className="form-control"
          rows="4"
          style={{
            backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
            border:
              isEditable && !isDeactivated
                ? "1px solid #80bdff"
                : "1px solid #dee2e6",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "8px",
          }}
          value={
            discount.products.length > 0
              ? discount.products
                  .map((p) => `${p.productName} (ID: ${p.productId})`)
                  .join("\n")
              : "No products found"
          }
          readOnly
        ></textarea>

        <small className="text-muted">
          These products are under this discount offer.
        </small>

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
          <div className="alert alert-success text-center mt-4">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDiscountDetails;

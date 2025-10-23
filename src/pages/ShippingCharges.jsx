// ShippingCharges.jsx
import React, { useState } from "react";
import axios from "axios";

const ShippingCharges = () => {
  const [chargeName, setChargeName] = useState("");
  const [chargeType, setChargeType] = useState("fixed"); // fixed or percentage
  const [chargeValue, setChargeValue] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState(""); // Minimum order amount for this shipping charge
  const [estimatedDays, setEstimatedDays] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chargeName || !chargeValue || !purchaseAmount || !estimatedDays) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      chargeName,
      chargeType,
      chargeValue: parseFloat(chargeValue),
      minPurchaseAmount: parseFloat(purchaseAmount),
      chargeEstimatedDays: parseInt(estimatedDays),
      shippingChargesIsActive: isActive,
    };

    try {
      await axios.post("/api/shipping-charges", payload);
      alert("Shipping charge rule added successfully!");
      // Reset form
      setChargeName("");
      setChargeType("fixed");
      setChargeValue("");
      setPurchaseAmount("");
      setEstimatedDays("");
      setIsActive(true);
    } catch (error) {
      console.error(error);
      alert("Error adding shipping charge rule.");
    }
  };

  return (
    <div className="container my-5">
      {/* Heading */}
      <div
        className="text-center py-3 mb-4 rounded"
        style={{ backgroundColor: "#FEC200", color: "black", border: "1px solid black", marginTop:'-35px', height: "45px" }}
      >
        <h2
        style={{fontSize: "20px",marginTop:'-5px'}}
        >Shipping Charges Management</h2>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit}>
          {/* Charge Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Charge Name</label>
            <input
              type="text"
              className="form-control"
              value={chargeName}
              onChange={(e) => setChargeName(e.target.value)}
              placeholder="Enter charge name (e.g., Standard Shipping)"
              required
            />
          </div>

          {/* Minimum Purchase Amount */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Minimum Purchase Amount ($)</label>
            <input
              type="number"
              className="form-control"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              min="0"
              placeholder="Enter minimum order amount for this charge"
              required
            />
          </div>

          {/* Charge Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Charge Type</label>
            <select
              className="form-select"
              value={chargeType}
              onChange={(e) => setChargeType(e.target.value)}
            >
              <option value="fixed">Fixed Amount ($)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>

          {/* Charge Value */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Charge Value</label>
            <input
              type="number"
              className="form-control"
              value={chargeValue}
              onChange={(e) => setChargeValue(e.target.value)}
              min="0"
              placeholder={`Enter charge value in ${
                chargeType === "percentage" ? "%" : "$"
              }`}
              required
            />
          </div>

          {/* Estimated Days */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Estimated Delivery Days</label>
            <input
              type="number"
              className="form-control"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              min="1"
              placeholder="Enter estimated delivery days"
              required
            />
          </div>

          {/* Is Active */}
          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
              id="activeCheck"
            />
            <label className="form-check-label fw-semibold" htmlFor="activeCheck">
              Active
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-warning text-balck fw-bold float-end">
            Add Rule
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingCharges;

// ShippingCharges.jsx
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useParams, useNavigate } from "react-router-dom";
import "sweetalert2/src/sweetalert2.scss";

const ShippingCharges = () => {
   const navigate = useNavigate();
   const [errors, setErrors] = useState({});


  const [chargeName, setChargeName] = useState("");
  const [chargeType, setChargeType] = useState("fixed"); // fixed or percentage
  const [chargeValue, setChargeValue] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [isActive, setIsActive] = useState(true);

  


  const [minAmount, setMinAmount] = useState("");
const [maxAmount, setMaxAmount] = useState("");

const validateForm = () => {
  const newErrors = {};

  if (!chargeName.trim()) {
    newErrors.chargeName = "Charge name is required";
  }

  if (minAmount === "" || Number(minAmount) < 0) {
    newErrors.minAmount = "Minimum amount must be 0 or greater";
  }

  if (maxAmount === "" || Number(maxAmount) <= 0) {
    newErrors.maxAmount = "Maximum amount must be greater than 0";
  }

  if (
    minAmount !== "" &&
    maxAmount !== "" &&
    Number(minAmount) >= Number(maxAmount)
  ) {
    newErrors.maxAmount = "Maximum amount must be greater than minimum amount";
  }

  if (chargeValue === "" || Number(chargeValue) <= 0) {
    newErrors.chargeValue =
      chargeType === "percentage"
        ? "Percentage must be greater than 0"
        : "Charge value must be greater than 0";
  }

  if (chargeType === "percentage" && Number(chargeValue) > 100) {
    newErrors.chargeValue = "Percentage cannot exceed 100%";
  }

  if (estimatedDays === "" || Number(estimatedDays) <= 0) {
    newErrors.estimatedDays = "Estimated days must be greater than 0";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
   if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please correct the highlighted fields",
    });
    return;
  }

    

    const payload = {
  chargeName: chargeName,
  chargeType: chargeType,
  chargeValue: Number(chargeValue),
  chargeEstimatedDays: Number(estimatedDays),
  shippingChargesIsActive: isActive,
  minAmount: Number(minAmount),
  maxAmount: Number(maxAmount),
};

    try {
      await axios.post(
  "https://localhost:7013/api/ShippingCharges/Create",
  payload
);

       Swal.fire({
      icon: "success",
      title: "Added!",
      text: "New Shipping charge rule",
      timer: 1500,
      showConfirmButton: false
    });
        navigate("/shipping-charges-list");
      // Reset form
      setChargeName("");
      setChargeType("fixed");
      setChargeValue("");
      setMinAmount("");
      setMaxAmount("");
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
        style={{ backgroundColor: "#FEC200", color: "black", marginTop:'-40px', height: "50px" }}
      >
        <h2
        style={{fontSize: "20px",marginTop:'-5px',fontWeight:'normal'}}
        >Shipping Charges Management</h2>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm p-4"
      style={{marginTop:"-18px"}}
      >
        <form onSubmit={handleSubmit}>
          {/* Charge Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Charge Name</label>
           
            <input
            type="text"
            className={`form-control ${errors.chargeName ? "is-invalid" : ""}`}
            value={chargeName}
            placeholder="Enter charge name (e.g., Standard Shipping)"
            onChange={(e) => {
              setChargeName(e.target.value);
              setErrors({ ...errors, chargeName: "" });
            }}
          />
          {errors.chargeName && (
  <div className="invalid-feedback">{errors.chargeName}</div>
)}


          </div>

          {/* Minimum Purchase Amount */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Minimum Purchase Amount ($)</label>
            
                    
                      <input
            type="number"
            className={`form-control ${errors.minAmount ? "is-invalid" : ""}`}
            value={minAmount}
            min="0"
          placeholder="Enter minimum order amount for this charge"
            onChange={(e) => {
              setMinAmount(e.target.value);
              setErrors({ ...errors, minAmount: "" });
            }}
          />

          {errors.minAmount && (
  <div className="invalid-feedback">{errors.minAmount}</div>
)}


          </div>

            <div className="mb-3">
            <label className="form-label fw-semibold">Maximum Purchase Amount ($)</label>
              
          
            <input
          type="number"
          className={`form-control ${errors.maxAmount ? "is-invalid" : ""}`}
          value={maxAmount}
          placeholder="Enter maximum order amount for this charge"
          onChange={(e) => {
            setMaxAmount(e.target.value);
            setErrors({ ...errors, maxAmount: "" });
          }}
        />
        {errors.maxAmount && (
  <div className="invalid-feedback">{errors.maxAmount}</div>
)}


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
              className={`form-control ${errors.chargeValue ? "is-invalid" : ""}`}
              value={chargeValue}
              min="0"
                          placeholder={`Enter charge value in ${
                            chargeType === "percentage" ? "%" : "$"
                          }`}
              onChange={(e) => {
                setChargeValue(e.target.value);
                setErrors({ ...errors, chargeValue: "" });
              }}
            />
            {errors.chargeValue && (
  <div className="invalid-feedback">{errors.chargeValue}</div>
)}


          </div>

          {/* Estimated Days */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Estimated Delivery Days</label>
           
            <input
            type="number"
            className={`form-control ${errors.estimatedDays ? "is-invalid" : ""}`}
            value={estimatedDays}
            min="1"
            placeholder="Enter estimated delivery days"
            onChange={(e) => {
              setEstimatedDays(e.target.value);
              setErrors({ ...errors, estimatedDays: "" });
            }}
          />
          {errors.estimatedDays && (
  <div className="invalid-feedback">{errors.estimatedDays}</div>
)}


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

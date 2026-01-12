import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const ShippingChargesDetails = () => {

  const navigate=useNavigate();

  const { id } = useParams(); // shipping_id



  // Hardcoded shipping charge details
 
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  const [shippingCharge, setShippingCharge] = useState(null);


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
 const handleEditToggle = async () => {
  // If already editable → SUBMIT
  if (isEditable) {
    try {
      const payload = {
        chargeName: shippingCharge.charge_name,
        chargeType: shippingCharge.charge_type,
        chargeValue: Number(shippingCharge.charge_value),
        chargeEstimatedDays: Number(shippingCharge.estimated_days),
        shippingChargesIsActive: shippingCharge.is_active === "Active",
        minAmount: Number(shippingCharge.min_purchase_amount),
        maxAmount: Number(shippingCharge.max_purchase_amount),
      };

      await axios.put(
        `https://localhost:7013/api/ShippingCharges/edit-User/${id}`,
        payload
      );

      
             Swal.fire({
            icon: "success",
            title: "Updated",
            text: "Shipping charge updated",
            timer: 1500,
            showConfirmButton: false
          });
              navigate("/shipping-charges-list");
      setIsEditable(false);
    } catch (err) {
      console.error("Edit error", err);
      setMessage("❌ Failed to update shipping charge");
    }
  } 
  // Enable edit mode
  else {
    setIsEditable(true);
    setMessage("✏️ Edit mode enabled.");
  }
};

  useEffect(() => {
  if (!id) return;

  axios
    .get(`https://localhost:7013/api/ShippingCharges/details/${id}`)
    .then((res) => {
      const d = res.data;

      setShippingCharge({
        charge_id: d.shipping_id,
        charge_name: d.charge_name,
        charge_type: d.charge_type,
        charge_value: d.charge_value,
        min_purchase_amount: d.min_amount,
        max_purchase_amount: d.max_amount,
        estimated_days: d.charge_estimated_days,
        is_active: d.shipping_Charges_is_active ? "Active" : "Inactive",
      });
    })
    .catch((err) => {
      console.error("Shipping charge fetch error", err);
      setMessage("❌ Failed to load shipping charge details");
    });
}, [id]);


  // Deactivate Record
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setShippingCharge({ ...shippingCharge, is_active: "Inactive" });
    setMessage("⚠️ This shipping charge rule has been deactivated successfully!");
  };

  if (!shippingCharge) {
  return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-warning" role="status" />
      <p className="mt-2">Loading shipping charge details...</p>
    </div>
  );
}


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
    {/* <div
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
    </div> */}

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
            ["max_purchase_amount", "Maximum Purchase Amount ($)"],

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
                value={
                  key === "is_active"
                    ? shippingCharge.is_active
                    : shippingCharge[key] ?? ""
                }

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
            value={`This rule applies to orders between ₹${shippingCharge.min_purchase_amount} and ₹${shippingCharge.max_purchase_amount}. Estimated delivery time is ${shippingCharge.estimated_days} days.`}

            readOnly
          ></textarea>
          <small className="text-muted">
            The above details describe this shipping rule.
          </small>
        </div>

        {/* Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">
           <Link to="/shipping-charges-list">
                                          <button
                                          type="button"
                                          className="btn btn-primary fw-bold px-4 py-2 rounded-3"
                                        >
                                         Back
                                        </button>
                                        </Link>
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

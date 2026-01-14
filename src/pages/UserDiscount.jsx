// UserDiscount.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useParams, useNavigate } from "react-router-dom";
import "sweetalert2/src/sweetalert2.scss";

const UserDiscount = () => {

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [discountName, setDiscountName] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // percentage or fixed
  const [discountValue, setDiscountValue] = useState("");
  const [discountStartDate, setDiscountStartDate] = useState("");
  const [discountEndDate, setDiscountEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  
  useEffect(() => {
  axios
    .get("http://ecommerce-admin-backend.i-diligence.com/api/users")
    .then((res) => setUsers(res.data))
    .catch(err => console.error("Users API error", err));
}, []);

const validateForm = () => {
  const newErrors = {};

  if (!discountName.trim()) {
    newErrors.discountName = "Discount name is required";
  }

  if (!selectedUser) {
    newErrors.selectedUser = "Please select a user";
  }

  if (!discountValue) {
    newErrors.discountValue = "Discount value is required";
  } else if (Number(discountValue) <= 0) {
    newErrors.discountValue = "Discount value must be greater than 0";
  }

  if (discountType === "percentage" && Number(discountValue) > 100) {
    newErrors.discountValue = "Percentage cannot exceed 100";
  }

  if (!discountStartDate) {
    newErrors.discountStartDate = "Start date is required";
  }

  if (!discountEndDate) {
    newErrors.discountEndDate = "End date is required";
  }

  if (
    discountStartDate &&
    discountEndDate &&
    new Date(discountEndDate) < new Date(discountStartDate)
  ) {
    newErrors.discountEndDate = "End date must be after start date";
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
  discountName: discountName,
  discountType: discountType,
  discountValue: Number(discountValue),
  startDate: new Date(discountStartDate).toISOString(),
  endDate: new Date(discountEndDate).toISOString(),
  isActive: isActive,
  userName: selectedUser
};

    try {
      await axios.post(
  "http://ecommerce-admin-backend.i-diligence.com/api/UserDiscount",
  payload
);

       Swal.fire({
      icon: "success",
      title: "Added!",
      text: "New discount applied",
      timer: 1500,
      showConfirmButton: false
    });
        navigate("/user-discount-list");
      // Reset form
      setDiscountName("");
      setDiscountType("percentage");
      setDiscountValue("");
      setSelectedUser("");
      setDiscountStartDate("");
      setDiscountEndDate("");
      setIsActive(true);
    } catch (error) {
      console.error(error);
      alert("Error applying user discount.");
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
        >User Discount Management</h2>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm p-4"
             style={{marginTop:"-18px"}}

      >
        <form onSubmit={handleSubmit}>
          {/* Discount Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Discount Name</label>
            

            <input
                type="text"
                className={`form-control ${errors.discountName ? "is-invalid" : ""}`}
                value={discountName}
                onChange={(e) => {
                  setDiscountName(e.target.value);
                  setErrors({ ...errors, discountName: "" });
                }}
              />
              {errors.discountName && (
                <div className="invalid-feedback">{errors.discountName}</div>
              )}

          </div>

          {/* Select User */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select User</label>
            <select
  className={`form-select ${errors.selectedUser ? "is-invalid" : ""}`}
  value={selectedUser}
  onChange={(e) => {
    setSelectedUser(e.target.value);
    setErrors({ ...errors, selectedUser: "" });
  }}
>
  {errors.selectedUser && (
  <div className="invalid-feedback">{errors.selectedUser}</div>
)}

              <option value="">Select User</option>
             {users.map((user) => (
            <option key={user.userId} value={user.userName}>
              {user.userName}
            </option>
          ))}

            </select>
           

          </div>

          {/* Discount Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Discount Type</label>
            <select
              className="form-select"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
             

                        <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>

            </select>
          </div>

          {/* Discount Value */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Discount Value</label>
          

            <input
            type="number"
            className={`form-control ${errors.discountValue ? "is-invalid" : ""}`}
              placeholder={`Enter discount value in ${
                          discountType === "percentage" ? "%" : "$"
                        }`}
            value={discountValue}
            onChange={(e) => {
              setDiscountValue(e.target.value);
              setErrors({ ...errors, discountValue: "" });
            }}
          />
          {errors.discountValue && (
  <div className="invalid-feedback">{errors.discountValue}</div>
)}


          </div>

          {/* Start Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Start Date</label>
            
            <input
            type="date"
            className={`form-control ${errors.discountStartDate ? "is-invalid" : ""}`}
            value={discountStartDate}
            onChange={(e) => {
              setDiscountStartDate(e.target.value);
              setErrors({ ...errors, discountStartDate: "" });
            }}
          />
          {errors.discountStartDate && (
  <div className="invalid-feedback">{errors.discountStartDate}</div>
)}

          </div>

          {/* End Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">End Date</label>
            
            <input
            type="date"
            className={`form-control ${errors.discountEndDate ? "is-invalid" : ""}`}
            value={discountEndDate}
            onChange={(e) => {
              setDiscountEndDate(e.target.value);
              setErrors({ ...errors, discountEndDate: "" });
            }}
          />
          {errors.discountEndDate && (
  <div className="invalid-feedback">{errors.discountEndDate}</div>
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
          <button type="submit" className="btn btn-warning text-black fw-bold float-end">
            Apply User Discount
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDiscount;

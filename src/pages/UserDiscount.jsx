// UserDiscount.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDiscount = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [discountName, setDiscountName] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // percentage or fixed
  const [discountValue, setDiscountValue] = useState("");
  const [discountStartDate, setDiscountStartDate] = useState("");
  const [discountEndDate, setDiscountEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch users on mount
  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!discountName || !discountValue || !selectedUser) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      userDiscountName: discountName,
      userDiscountType: discountType,
      userDiscountValue: parseFloat(discountValue),
      userDiscountStartDate: discountStartDate,
      userDiscountEndDate: discountEndDate,
      userDiscountIsActive: isActive,
      userId: selectedUser,
    };

    try {
      await axios.post("/api/user-discounts", payload);
      alert("User discount applied successfully!");
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
              className="form-control"
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
              placeholder="Enter discount name"
              required
            />
          </div>

          {/* Select User */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select User</label>
            <select
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.user_name} - Total Purchases: ${user.annual_purchase || 0}
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
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Discount Value</label>
            <input
              type="number"
              className="form-control"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={`Enter discount value in ${
                discountType === "percentage" ? "%" : "$"
              }`}
              min="0"
              required
            />
          </div>

          {/* Start Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={discountStartDate}
              onChange={(e) => setDiscountStartDate(e.target.value)}
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">End Date</label>
            <input
              type="date"
              className="form-control"
              value={discountEndDate}
              onChange={(e) => setDiscountEndDate(e.target.value)}
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
          <button type="submit" className="btn btn-warning text-black fw-bold float-end">
            Apply User Discount
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDiscount;

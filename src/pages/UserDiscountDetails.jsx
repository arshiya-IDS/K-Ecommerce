import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const UserDiscountDetails = () => {

  const navigate=useNavigate();
  // Hardcoded user discount details
  const { id } = useParams(); // userId


  const [searchTerm, setSearchTerm] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");


  // Handle input change during edit
 

  const handleChange = (e) => {
  const { name, value } = e.target;
  setDiscount((prev) => ({ ...prev, [name]: value }));
};

 // const [discount, setDiscount] = useState({
 

const [discount, setDiscount] = useState({
  user_discount_id: "",
  user_id: "",
  user_discount_name: "",
  user_discount_type: "",
  user_discount_value: "",
  user_discount_start_date: "",
  user_discount_end_date: "",
  user_discount_is_active: false,
});


  const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };
  // Toggle edit mode
 const handleEditToggle = async () => {
  if (!isEditable) {
    setIsEditable(true);
    setMessage("✏️ Edit mode enabled");
    return;
  }

  if (!discount.user_discount_id) {
    setMessage("❌ Discount ID missing");
    return;
  }

  try {
    const payload = {
      UserDiscountID: discount.user_discount_id,
      DiscountName: discount.user_discount_name,
      DiscountType: discount.user_discount_type,
      DiscountValue: discount.user_discount_value,
      StartDate: discount.user_discount_start_date,
      EndDate: discount.user_discount_end_date,
      IsActive: discount.user_discount_is_active,
    };

    await axios.put(
      `https://localhost:7013/api/UserDiscount/${discount.user_discount_id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    setIsEditable(false);
    Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "User Discount",
            timer: 1500,
            showConfirmButton: false
          });
          navigate("/user-discount-list");
  } catch (error) {
    console.error("Update failed", error);
    setMessage("❌ Failed to update User Discount Details");
  }
};




useEffect(() => {
  if (!id) return;

  const fetchUserDiscount = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7013/api/UserDiscount/${id}`
      );

      const d = res.data;

      setDiscount({
        user_discount_id: d.user_discount_id,
        user_id: d.user_id,
        user_discount_name: d.user_discount_name,
        user_discount_type: d.user_discount_type,
        user_discount_value: d.user_discount_value,
        user_discount_start_date: d.user_discount_start_date?.split("T")[0],
        user_discount_end_date: d.user_discount_end_date?.split("T")[0],
        user_discount_is_active: d.user_discount_is_active,
      });
    } catch (err) {
      console.error("Discount fetch error", err);
      setMessage("❌ Failed to load user discount details");
    }
  };

  fetchUserDiscount();
}, [id]);



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
        className="d-flex align-items-center justify-content-between px-3 rounded"

        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-35px",
          height: "45px",
        }}
      >
        <h2 style={{ fontSize: "20px",fontWeight:'normal',marginLeft:'420px' }}>
          User Discount Details
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
              ["user_discount_id", "Discount ID"],
              ["user_id", "User ID"],
              ["user_discount_name", "Discount Name"],
              ["user_discount_type", "Discount Type"],
              ["user_discount_value", "Discount Value"],
              ["user_discount_start_date", "Start Date"],
              ["user_discount_end_date", "End Date"],
              ["user_discount_is_active", "Status"],
            ].map(([key, label]) => (
              <div className="col-md-6 mb-3" key={key}>
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type="text"
                  name={key}
                  className="form-control"
                  value={
                    key === "user_discount_is_active"
                      ? discount[key] ? "Active" : "Inactive"
                      : discount[key] ?? ""
                  }
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                />
              </div>
            ))}

        </div>

  

        {/* Notes Section */}
        {/* <h5 className="fw mb-3">Discount Notes</h5> */}
        {/* <div className="mb-3">
          <textarea
            name="notes"
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
            discount.userDiscountIsActive
              ? "This discount is currently active for the selected user."
              : "This discount has been deactivated and is no longer valid."
          }

            readOnly
          ></textarea>
          <small className="text-muted">
            Notes auto-updated based on discount status.
          </small>
        </div> */}

        {/* Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">
          <Link to="/user-discount-list">
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

export default UserDiscountDetails;

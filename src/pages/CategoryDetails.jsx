import { FaEdit, FaBan } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const CategoryDetails = () => {
  const navigate=useNavigate();
  // Hardcoded category details
  const [category, setCategory] = useState({
    category_id: 1,
    category_name: "Artistic Grey",
    category_of: "Furnitures",
    is_active: "Active",
    parent_categoryid:"2",
    description:"abc",
    created_at: "2025-10-20",
    updated_at: "2025-10-22",
  });

  

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");
  const { categoryId } = useParams();
const [loading, setLoading] = useState(true);


  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Toggle Edit Mode
 const handleEditToggle = async () => {
  // ENTER EDIT MODE
  if (!isEditable) {
    setIsEditable(true);
    setMessage("✏️ Edit mode enabled.");
    return;
  }

  // SUBMIT (SAVE)
  try {
   const payload = {
  category_Id: Number(category.category_Id),
  category_Name: category.category_Name || "",
  category_Description: category.category_Description || "",
  parent_Category_Id: category.parent_Category_Id
    ? Number(category.parent_Category_Id)
    : 0, // API-safe fallback
  category_Type: category.category_Type || "",
  category_Is_Active:
    category.category_Is_Active === true ||
    category.category_Is_Active === "Active",
  catgrs_UpdtdBy: "Admin"
};


    const res = await axios.put(
      `http://ecommerce-admin-backend.i-diligence.com/api/Category/${category.category_Id}`,
      payload,
       {
    headers: {
      "Content-Type": "application/json"
    }
  }
    );

    // Update UI with response
    setCategory(res.data.category);
    setIsEditable(false);
      Swal.fire({
    icon: "success",
    title: "Updated!",
    text: "Category Updated",
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
    navigate("/category-list");
  });

  } catch (error) {
    console.error("Update failed", error);
    setMessage("❌ Failed to update category");
  }
};


   const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };
  
  // Handle Deactivation
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setCategory({ ...category, is_active: "Inactive" });
    setMessage("⚠️ This category has been deactivated successfully!");
  };
  useEffect(() => {
  fetchCategoryDetails();
}, [categoryId]);

const fetchCategoryDetails = async () => {
  try {
    const res = await axios.get(
      `http://ecommerce-admin-backend.i-diligence.com/api/Category/${categoryId}`
    );

    setCategory(res.data);
  } catch (error) {
    console.error("Failed to fetch category details", error);
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-warning" />
      <p className="mt-2">Loading category details...</p>
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
          marginTop: "-40px",
          height: "50px",
        }}
      >
        <h2 style={{ fontSize: "20px",fontWeight:'normal',marginLeft:'420px' }}>Category Details</h2>

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
        {/* <h5 className="fw mb-3">Category Information</h5> */}

       <div className="row">
            {Object.entries(category).map(([key, value]) => (
              <div className="col-md-6 mb-3" key={key}>
                <label className="form-label text-capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  name={key}
                  className="form-control"
                  value={
                    ["catgrs_CrtdAt", "catgrs_UpdtdAt"].includes(key) && value
                      ? new Date(value).toLocaleString()
                      : value === null
                        ? ""
                        : String(value)
                  }
                  onChange={handleChange}
                  readOnly={
                    !isEditable || ["category_Id", "catgrs_CrtdAt", "catgrs_UpdtdAt"].includes(key)
                  }
                />


                
              
              </div>
            ))}
          </div>

 
        

        {/* Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">

          <Link to="/category-list">
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

export default CategoryDetails;

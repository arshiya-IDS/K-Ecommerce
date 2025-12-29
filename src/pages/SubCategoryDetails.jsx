import React, { useState,useEffect } from "react";
import { FaEdit, FaBan } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";


const SubCategoryDetails = () => {
  // Hardcoded subcategory details
const { id } = useParams();

const [subCategory, setSubCategory] = useState(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategory({ ...subCategory, [name]: value });
  };

  // Toggle Edit Mode
  const handleEditToggle = async () => {
  // 1️⃣ If NOT editable → enable edit mode
  if (!isEditable) {
    setIsEditable(true);
    setMessage(" Edit mode enabled.");
    return;
  }

  // 2️⃣ If editable → SUBMIT changes
  try {
    const payload = {
      sub_Category_Id: subCategory.sub_category_id,
      category_Id: subCategory.parent_category_id,
      sub_Category_Name: subCategory.sub_category_name,
      sub_Category_Description: subCategory.sub_category_description,
      sub_Category_Is_Active:subCategory.sub_Category_Is_Active,
      sb_catgrs_UpdtdBy: "System", // or logged-in user
    };

    await axios.put(
      `https://localhost:7013/api/SubCategory/edit-SubCategory/${subCategory.sub_category_id}`,
       payload,
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
    );

    await fetchSubCategoryDetails();

    setIsEditable(false);
    setMessage("✅ Subcategory updated successfully!");

  } catch (error) {
    console.error("Update failed", error);
    setMessage("❌ Failed to update subcategory");
  }
};


  const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };
  // Handle Deactivation

  useEffect(() => {
  if (id) {
    fetchSubCategoryDetails();
  }
}, [id]);

const fetchSubCategoryDetails = async () => {
  try {
    const res = await axios.get(
      `https://localhost:7013/api/SubCategory/details/${id}`
    );

    const data = res.data;

    setSubCategory({
      sub_category_id: data.sub_Category_Id,
      sub_category_name: data.sub_Category_Name,
      sub_category_description: data.sub_Category_Description,
      parent_category_id: data.category_Id,
      category_name: data.category_Name,
      is_active: data.sub_Category_Is_Active ? "Active" : "Inactive",
      created_at: new Date(data.sb_catgrs_CrtdAt).toLocaleString(),
      updated_at: data.sb_catgrs_UpdtdAt
        ? new Date(data.sb_catgrs_UpdtdAt).toLocaleString()
        : "—",
      created_by: data.sb_catgrs_CrtdBy,
      updated_by: data.sb_catgrs_UpdtdBy ?? "—",
    });
  } catch (error) {
    console.error("Failed to load subcategory details", error);
  }
};

  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setSubCategory({ ...subCategory, is_active: "Inactive" });
    setMessage("⚠️ This subcategory has been deactivated successfully!");
  };

  if (!subCategory) {
  return (
    <div className="text-center mt-5">
      <span className="spinner-border text-warning"></span>
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
        <h2 style={{ fontSize: "20px",fontWeight:'normal',marginLeft:'420px' }}>
          Subcategory Details
        </h2>
         {/* Center: Search Bar */}
    <div
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
    </div>
      </div>

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}
       style={{marginTop:"6px"}}
      >

        <div className="row">
          {[
            
            
            ["sub_category_id", "Subcategory ID"],
            ["sub_category_name", "Subcategory Name"],
            ["sub_category_description", "Description"],
            ["category_name", "Category Name"],
            ["parent_category_id", "Category ID"],
            ["is_active", "Status"],
            ["created_by", "Created By"],
            ["created_at", "Created At"],
            ["updated_at", "Last Updated"],


          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              {key === "sub_category_description" ? (
                <textarea
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
                  rows="3"
                  value={subCategory[key]}
                  onChange={handleChange}
                  readOnly={
                    !isEditable ||
                    isDeactivated ||
                    !["sub_category_name", "sub_category_description"].includes(key)
                  }

                ></textarea>
              ) : (
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
                  value={subCategory[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                />
              )}
            </div>
          ))}
        </div>

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

export default SubCategoryDetails;

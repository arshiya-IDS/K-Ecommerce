import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useParams, useNavigate } from "react-router-dom";
import "sweetalert2/src/sweetalert2.scss";


const ManageCategories = () => {
  // ✅ Category state
const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [category, setCategory] = useState({
    category_name: "",
    category_description: "",
    parent_category_id: "",
    category_type: "",
    category_is_active: true,
  });

  // ✅ Subcategory state
  const [subCategory, setSubCategory] = useState({
    category_id: "",
    sub_category_name: "",
    sub_category_description: "",
    sub_category_is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Handle input change for category
 
  const handleCategoryChange = (e) => {
  setCategory({ ...category, [e.target.name]: e.target.value });
  setErrors({ ...errors, [e.target.name]: "" });
};


  const validateCategoryForm = () => {
  const newErrors = {};

  if (!category.category_name.trim()) {
    newErrors.category_name = "Category name is required";
  } else if (category.category_name.length < 3) {
    newErrors.category_name = "Category name must be at least 3 characters";
  }

  if (!category.category_description.trim()) {
    newErrors.category_description = "Description is required";
  }

  if (
    category.parent_category_id &&
    Number(category.parent_category_id) < 0
  ) {
    newErrors.parent_category_id = "Parent category ID cannot be negative";
  }

  if (!category.category_type.trim()) {
    newErrors.category_type = "Category type is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // ✅ Handle category submission
 const handleCategorySubmit = async (e) => {
  e.preventDefault();
   if (!validateCategoryForm()) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please correct the highlighted fields",
    });
    return;
  }
  setLoading(true);
  setMessage("");

  try {
    const payload = {
      category_Name: category.category_name,
      category_Description: category.category_description,
      parent_Category_Id:
        category.parent_category_id === ""
          ? 0
          : Number(category.parent_category_id),
      category_Type: category.category_type,
      category_Is_Active: category.category_is_active,
    };

    const response = await axios.post(
      "http://ecommerce-admin-backend.i-diligence.com/api/Category",
      payload
    );


     Swal.fire({
      icon: "success",
      title: "Added!",
      text: "New Category Added",
      timer: 1500,
      showConfirmButton: false
    });
        navigate("/category-list");

    // reset form
    setCategory({
      category_name: "",
      category_description: "",
      parent_category_id: "",
      category_type: "",
      category_is_active: true,
    });
  } catch (error) {
    console.error(error);
    setMessage("❌ Failed to add category");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container my-5">
      {/* HEADER */}
      <div
        className="text-center py-3 mb-4 rounded"
        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-40px",
          height: "50px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginTop: "-5px",fontWeight:'normal' }}>
          Manage Categories
        </h2>
      </div>

      {/* CARD */}
      <div className="card shadow-sm p-4"
      style={{marginTop:"-18px"}}
      >
        {/* CATEGORY FORM */}
        <form onSubmit={handleCategorySubmit}>
          {/* <h5 className="fw mb-3">
            Add New Category
          </h5> */}

          <div className="mb-3">
            <label className="form-label fw-semibold">Category Name</label>
            
            <input
            type="text"
            name="category_name"
            className={`form-control ${errors.category_name ? "is-invalid" : ""}`}
            value={category.category_name}
            onChange={handleCategoryChange}
          />
          {errors.category_name && (
            <div className="invalid-feedback">{errors.category_name}</div>
          )}

          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            
            <textarea
              name="category_description"
              className={`form-control ${errors.category_description ? "is-invalid" : ""}`}
              rows="3"
              value={category.category_description}
              onChange={handleCategoryChange}
            />
            {errors.category_description && (
              <div className="invalid-feedback">{errors.category_description}</div>
            )}

          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parent Category ID</label>
              <input
                type="number"
                name="parent_category_id"
                className="form-control"
                placeholder="Enter parent category ID (optional)"
                value={category.parent_category_id}
                onChange={handleCategoryChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Category Type</label>
              
              <input
                type="text"
                name="category_type"
                className={`form-control ${errors.category_type ? "is-invalid" : ""}`}
                value={category.category_type}
                onChange={handleCategoryChange}
              />
              {errors.category_type && (
                <div className="invalid-feedback">{errors.category_type}</div>
              )}

            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="category_is_active"
              checked={category.category_is_active}
              onChange={(e) =>
                setCategory({
                  ...category,
                  category_is_active: e.target.checked,
                })
              }
            />
            <label className="form-check-label fw-semibold">
              Category Active
            </label>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-warning text-black fw-bold px-4 py-2 rounded-3 float-end"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Category"}
            </button>
          </div>
        </form>

        

        {/* MESSAGE */}
        {message && (
          <div
            className={`alert mt-4 ${
              message.includes("✅")
                ? "alert-success"
                : "alert-danger"
            } text-center`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;

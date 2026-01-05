import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useParams, useNavigate } from "react-router-dom";


const ManageSubCategories = () => {
  // ✅ Category state
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
const [categories, setCategories] = useState([]);

 

  // ✅ Handle input change for subcategory
  const handleSubCategoryChange = (e) => {
    setSubCategory({ ...subCategory, [e.target.name]: e.target.value });
  };

useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const res = await axios.get("https://localhost:7013/api/Category");
    setCategories(res.data);
  } catch (error) {
    console.error("Error loading categories", error);
  }
};

  

  // ✅ Handle subcategory submission
 const handleSubCategorySubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const payload = {
      category_Id: subCategory.category_id,
      sub_Category_Name: subCategory.sub_category_name,
      sub_Category_Description: subCategory.sub_category_description,
      sub_Category_Is_Active: subCategory.sub_category_is_active,
      sb_catgrs_CrtdAt: new Date().toISOString(),
      sb_catgrs_CrtdBy: "ADMIN"
    };

    const res = await axios.post(
      "https://localhost:7013/api/SubCategory",
      payload
    );

     Swal.fire({
      icon: "success",
      title: "Added!",
      text: "New Subcategory  Added",
      timer: 1500,
      showConfirmButton: false
    });
        navigate("/subcategories-list");
    setSubCategory({
      category_id: "",
      sub_category_name: "",
      sub_category_description: "",
      sub_category_is_active: true,
    });
  } catch (error) {
    setMessage("❌ Failed to add subcategory");
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
          Manage Sub-Categories
        </h2>
      </div>

      {/* CARD */}
      <div className="card shadow-sm p-4"
       style={{marginTop:"-18px"}}
      >
       

        {/* SUBCATEGORY FORM */}
        <form onSubmit={handleSubCategorySubmit}>
          {/* <h5 className="fw  mb-3">
             Add New Subcategory
          </h5> */}

          <div className="row">
           <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parent Category</label>
              <select
                className="form-select"
                name="category_id"
                value={subCategory.category_id}
                onChange={handleSubCategoryChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.category_Id} value={cat.category_Id}>
                    {cat.category_Name}
                  </option>
                ))}
              </select>
            </div>


            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Subcategory Name</label>
              <input
                type="text"
                name="sub_category_name"
                className="form-control"
                placeholder="Enter subcategory name"
                value={subCategory.sub_category_name}
                onChange={handleSubCategoryChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Subcategory Description
            </label>
            <textarea
              name="sub_category_description"
              className="form-control"
              rows="3"
              placeholder="Enter subcategory description"
              value={subCategory.sub_category_description}
              onChange={handleSubCategoryChange}
            ></textarea>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="sub_category_is_active"
              checked={subCategory.sub_category_is_active}
              onChange={(e) =>
                setSubCategory({
                  ...subCategory,
                  sub_category_is_active: e.target.checked,
                })
              }
            />
            <label className="form-check-label fw-semibold">
              Subcategory Active
            </label>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-warning text-black fw-bold px-4 py-2 rounded-3 float-end"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Subcategory"}
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

export default ManageSubCategories;

import { FaEdit, FaBan } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


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

const [newImage, setNewImage] = useState(null);
const [previewImage, setPreviewImage] = useState("");
const [removeImage, setRemoveImage] = useState(false);


const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    setImageFile(file);
    setRemoveImage(false); // 🔑 important
  }
};

const handleRemoveImage = () => {
  setImageFile(null);
  setRemoveImage(true);
};




  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Toggle Edit Mode
 const handleEditToggle = async () => {
  if (!isEditable) {
    setIsEditable(true);
    setMessage("✏️ Edit mode enabled.");
    return;
  }

  // ── Prepare FormData ───────────────────────────────────────
  const formData = new FormData();

  
  
   

  // Use correct casing — must match DTO property names exactly
  formData.append("Category_Id",       category.category_Id);
  formData.append("Category_Name",     category.category_Name);
  formData.append("Category_Description", category.category_Description);
  formData.append("Parent_Category_Id", Number(category.parent_Category_Id));
 formData.append("Category_Type", category.category_Type);
 // formData.append("Category_Is_Active", true);    
//   formData.append("RemoveImage", removeImage ? "true" : "false");
formData.append("Category_Is_Active", "true");           // or category.category_Is_Active
  formData.append("catgrs_UpdtdBy",    "Admin");

  // Image handling

 if (removeImage === true) {
  formData.append("RemoveImage", "true");
}


else if (newImage) {
  formData.append("RemoveImage", "false");
  formData.append("ImageFile", newImage);
}

  
  
  try {
    const response = await api.put(
  `/Category/${category.category_Id}`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
);




    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Category updated successfully",
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      navigate("/category-list");
    });

  } catch (error) {
    console.error("Update error:", error?.response?.data || error);
    Swal.fire({
      icon: "error",
      title: "Update failed",
      text: error?.response?.data?.message || "Something went wrong",
    });
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
    setLoading(true);
    const res = await api.get(`/Category/${categoryId}`);

    const data = res.data;

    // Normalize keys to camelCase (makes form easier to work with)
    setCategory({
      category_Id:          data.category_Id,
      category_Name:        data.category_Name,
      category_Description: data.category_Description,
      parent_Category_Id:   data.parent_Category_Id,
      category_Type:        data.category_Type,
      category_Is_Active:   data.category_Is_Active,
      catgrs_CrtdAt:        data.catgrs_CrtdAt,
      catgrs_UpdtdAt:       data.catgrs_UpdtdAt,
      catgrs_UpdtdBy:       data.catgrs_UpdtdBy,
      category_Image_Url:   data.category_Image_Url,
    });

    // Image preview  
    let imageUrl = data.category_Image_Url;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `https://admin-backend.kaushalyagroup.com/${imageUrl}`; // ← adjust port/host if needed
    }

    
    setPreviewImage(imageUrl || "");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Could not load category", "error");
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
    
    <div className="container my-2">
      

      {/* Header */}
  <div
  className="d-flex align-items-center mb-4"
  style={{
    backgroundColor: "#FEC200",
    padding: "12px",
    borderRadius: "8px",
    color: "white"
  }}
>
  {/* Left: Back Button */}
  <div style={{ flex: 1 }}>
    <button
      className="btn btn-light"
      onClick={() => navigate(-1)}
    >
      Back
    </button>
  </div>

  {/* Center: Product Details */}
  <div style={{ flex: 1, textAlign: "center" }}>
    <h3 className="mb-0">
      Category Details - #{category.category_Id}
    </h3>
  </div>

  {/* Right: Edit Button */}
  <div style={{ flex: 1, textAlign: "right" }}>
   
     <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-light"
            disabled={isDeactivated}
          >
            {isEditable ? "Submit" : "Edit"}
          </button>

  </div>
</div>


      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}
       style={{marginTop:"6px"}}
      >
        {/* <h5 className="fw mb-3">Category Information</h5> */}

       <div className="row">

        {/* CATEGORY IMAGE SECTION */}
<div className="mb-4">
  <label className="form-label fw-bold">Category Image</label>

  <div className="d-flex align-items-center gap-4">
    {/* Image Preview */}
    <div
      style={{
        width: "180px",
        height: "180px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #dee2e6",
        backgroundColor: "#f8f9fa"
      }}
    >
      <img
        src={
          removeImage
            ? "/assets/Images/default.jpg"
            : previewImage || "/assets/Images/default.jpg"
        }
        alt="Category"
        className="w-100 h-100 object-fit-cover"
      />
    </div>

    {/* Edit Controls */}
    {isEditable && (
      <div className="d-flex flex-column gap-2">
        {/* Upload */}
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setNewImage(file);
              setPreviewImage(URL.createObjectURL(file));
              setRemoveImage(false);
            }
          }}
        />

        {/* Delete */}
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => {
            setNewImage(null);
            setPreviewImage("");
            setRemoveImage(true);
          }}
        >
          Delete Image
        </button>
      </div>
    )}
  </div>
</div>

            {Object.entries(category).map(([key, value]) => (
              <div className="col-md-6 mb-3" key={key}>
                <label className="form-label text-capitalize">
                  {key.replace(/_/g, " ")}
                </label>
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

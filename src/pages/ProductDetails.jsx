import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import api from "../api/axiosInstance";
import heic2any from "heic2any";



const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
  images: []
});

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [message, setMessage] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  const [replaceAllImages, setReplaceAllImages] = useState(false);
  const [replaceImageMap, setReplaceImageMap] = useState({});
  const [heicPreviews, setHeicPreviews] = useState({});


    const [isDeactivated, setIsDeactivated] = useState(false);



  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchSubcategories = async (categoryId) => {
  const res = await api.get(`/Category/sub/${categoryId}`);
  setSubcategories(res.data);
};


  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Product/details/${id}`);
      setProduct(res.data);
       if (res.data.category_id) {
    fetchSubcategories(res.data.category_id);
  }
      const images = res.data.images || [];
      setProduct({ ...res.data, images });
      setPrimaryImageId(images.find(img => img.isPrimary)?.id || null);

    } catch (err) {
      setMessage("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
  const loadCategories = async () => {
    const res = await api.get("/Category");
    setCategories(res.data);
  };
  loadCategories();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const toggleDeleteImage = (imageId) => {
    setDeleteImageIds(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const getNewImagePreview = (index) => {
  if (!newImages[index]) return null;
  return URL.createObjectURL(newImages[index]);
};


  const handleSubmit = async () => {
    

    const formData = new FormData();
    formData.append("Product_ID", product.product_id);
    formData.append("Product_Name", product.product_name);
    formData.append("Product_Description", product.product_description);
    formData.append("Product_Actual_Price", product.product_actual_price);
    if (product.product_discounted_price)
      formData.append("Product_Discounted_Price", product.product_discounted_price);
    formData.append("SubCategory_Id", product.subcategory_id);

    // Replace individual images
Object.entries(replaceImageMap).forEach(([imageId, file]) => {
  formData.append("ReplaceImageIds", imageId);
  formData.append("ReplaceImages", file);
});


    if (replaceAllImages && newImages.length > 0) {
  // Mark all existing images for deletion
  product.images.forEach(img => {
    formData.append("DeleteImageIds", img.id);
  });

  // Upload new images
  newImages.forEach(file => {
    formData.append("Images", file);
  });
} else {
  // Normal behavior (individual delete + add)
  newImages.forEach(file => formData.append("Images", file));
  deleteImageIds.forEach(id => formData.append("DeleteImageIds", id));
}

    if (primaryImageId) formData.append("PrimaryImageId", primaryImageId);

    try {
      await api.put(`/Product/update/${id}`, formData, {

        headers: { "Content-Type": "multipart/form-data" }
      });
         Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Product updated",
            timer: 1500,
            showConfirmButton: false
          });
          navigate("/product-list");

          setReplaceAllImages(false);

          setReplaceImageMap({});

      setIsEditable(false);
      setNewImages([]);
      setDeleteImageIds([]);
      fetchProduct(); // Refresh
    } catch (err) {
      setMessage("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : "N/A";

  if (loading) return <div className="text-center py-5"><h4>Loading...</h4></div>;
  if (!product) return <div className="text-center text-danger">Product not found</div>;

  
  const handleReplaceSingleImage = async (imageId, file) => {
  setReplaceImageMap(prev => ({
    ...prev,
    [imageId]: file
  }));

  // If HEIC → convert to JPG for preview
  if (file && (file.type === "image/heic" || file.name.endsWith(".heic"))) {
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8
    });

    const previewUrl = URL.createObjectURL(convertedBlob);
    setHeicPreviews(prev => ({
      ...prev,
      [imageId]: previewUrl
    }));
  }
};



const getImagePreviewSrc = (img) => {
  const file = replaceImageMap[img.id];

  // No replacement → show server image
  if (!file) return img.url;

  // HEIC preview fix
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    return ""; // handled separately
  }

  // Normal images
  return URL.createObjectURL(file);
};

const inputStyle = {
  backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
  border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
  borderRadius: "8px",
  padding: "10px",
  color: "#212529",
  transition: "all 0.3s ease"
};

  return (
    <div className="container my-2">
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
      Product Details - #{product.product_id}
    </h3>
  </div>

  {/* Right: Edit Button */}
 
 {/* Right: Edit / Submit Buttons */}
<div style={{ flex: 1, textAlign: "right" }}>
  {!isEditable ? (
    <button
      className="btn btn-light"
      onClick={() => setIsEditable(true)}
    >
      <FaEdit /> Edit
    </button>
  ) : (
    <>
     

      <button
        className="btn btn-light"
        onClick={handleSubmit}
        disabled={isDeactivated}
      >
        Save
      </button>
    </>
  )}
</div>

</div>


      <div className="card shadow p-4">
        <div className="row g-3">
          {[
            ["product_id", "Product ID"],
            ["product_name", "Product Name"],
            ["product_actual_price", "Actual Price (₹)"],
            ["product_discounted_price", "Discounted Price (₹)"],
           

          ].map(([key, label, type]) => (
            <div className="col-md-6" key={key}>
              <label className="form-label fw-bold">{label}</label>
              {type === "textarea" ? (
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
                  rows="4"
                  name={key}
                  value={product[key] || ""}
                  onChange={handleChange}
                  readOnly={!isEditable}
                />
              ) : (
                <input
                  type="text"
                  className="form-control"
                   style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
                  name={key}
                  value={product[key] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}

{/* DESCRIPTION + STATUS */}
<div className="col-md-8">
  <label className="form-label fw-bold">Description</label>
  <textarea
    className="form-control"
    rows="4"
    name="product_description"
    value={product.product_description || ""}
    onChange={handleChange}
    readOnly={!isEditable}
    style={inputStyle}
  />
</div>



          {/* CATEGORY */}
<div className="col-md-6">
  <label className="form-label fw-bold">Category</label>
  <select
    className="form-select"
    disabled={!isEditable}
    value={product.category_id || ""}
    onChange={(e) => {
      setProduct(prev => ({
        ...prev,
        category_id: e.target.value,
        subcategory_id: ""
      }));
      fetchSubcategories(e.target.value);
    }}
     style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
  >
    <option value="">Select Category</option>
    {categories.map(cat => (
      <option key={cat.category_Id} value={cat.category_Id}>
        {cat.category_Name}
      </option>
    ))}
  </select>
</div>

{/* SUBCATEGORY */}
<div className="col-md-6">
  <label className="form-label fw-bold">Subcategory</label>
  <select
    className="form-select"
    disabled={!isEditable}
    value={product.subcategory_id || ""}
    onChange={(e) =>
      setProduct(prev => ({
        ...prev,
        subcategory_id: e.target.value
      }))
    }
     style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
  >
    <option value="">Select Subcategory</option>
    {subcategories.map(sub => (
      <option
        key={sub.sub_category_Id}
        value={sub.sub_category_Id}
      >
        {sub.sub_category_Name}
      </option>
    ))}
  </select>
</div>

          <div className="col-md-6"
          
          >
            <label className="form-label fw-bold">Created At</label>
            <input type="text" className="form-control"
             style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
             value={formatDate(product.created_at)} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Status</label>
            <input type="text" className="form-control" 
             style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
            value={product.status} readOnly />
          </div>
        </div>

        <hr className="my-4" />

        <h5>Product Images</h5>

<div className="d-flex gap-2">
  {product.images && product.images.length > 0 ? (
    product.images.map(img => (
      <div
        key={img.id}
        className="position-relative border rounded p-2"
        style={{ width: "18%" }}
      >
        <img
          src={heicPreviews[img.id] || getImagePreviewSrc(img)}
          alt="Product"
          className="img-fluid rounded"
          style={{ height: "120px", objectFit: "cover" }}
        />
  
        {img.isPrimary && (
          <FaStar className="text-warning position-absolute top-0 end-0 m-2" />
        )}
  
        {isEditable && (
          <>
            <button
              className="btn btn-sm btn-danger position-absolute top-0 start-0 m-2"
              onClick={() => toggleDeleteImage(img.id)}
            >
              <FaTrash />
            </button>
  
            <button
              className={`btn btn-sm position-absolute bottom-0 start-0 m-2 ${
                primaryImageId === img.id
                  ? "btn-warning"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setPrimaryImageId(img.id)}
            >
              Primary
            </button>
  
            <input
              type="file"
              accept="image/*"
              className="form-control form-control-sm mt-2"
              onChange={(e) =>
                handleReplaceSingleImage(img.id, e.target.files[0])
              }
            />
          </>
        )}
  
        {deleteImageIds.includes(img.id) && (
          <div className="bg-danger text-white text-center small mt-1">
            Will be deleted
          </div>
        )}
      </div>
    ))
  ) : (
  
  <>
    <div className="text-muted mb-2"
    >No images available</div>

  
    {isEditable && (
        <div
    className="d-flex gap-3"
    style={{
      flexWrap: "nowrap",
      overflowX: "auto",
      paddingBottom: "10px"
    }}
  >
  
        {[0, 1, 2, 3].map((index) => (
            <div
    key={index}
    style={{ minWidth: "160px", flex: "0 0 auto" }}
  >
  
            <div className="border rounded p-2 text-center h-100">
              {/* IMAGE PREVIEW */}
              {getNewImagePreview(index) ? (
                <img
                  src={getNewImagePreview(index)}
                  alt={`Preview ${index + 1}`}
                  className="img-fluid rounded mb-2"
                  style={{ height: "90px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded mb-2"
                  style={{ height: "90px", fontSize: "12px", color: "#999" }}
                >
                  No Image
                </div>
              )}
  
              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
  
                  setReplaceAllImages(true);
  
                  setNewImages((prev) => {
                    const updated = [...prev];
                    updated[index] = file;
                    return updated.slice(0, 4);
                  });
                }}
              />
  
              <small className="text-muted">Image {index + 1}</small>
            </div>
          
          </div>
        ))}
      </div>
  
    )}
  </>
  
  
  )}
</div>

 


       {/* {isEditable && (
  <div className="mt-3">
    <label className="form-label fw-bold">
      Replace All Product Images (4 Images)
    </label>

    <input
      type="file"
      multiple
      accept="image/*"
      className="form-control"
      onChange={(e) => {
        setReplaceAllImages(true);
        handleImageChange(e);
      }}
    />

    {newImages.length > 0 && (
      <small className="text-warning">
        {newImages.length} new image(s) selected — existing images will be replaced
      </small>
    )}
  </div>
)} */}


      

        

        {message && <div className={`alert mt-3 ${message.includes("success") ? "alert-success" : "alert-danger"}`}>{message}</div>}
      </div>
    </div>
  );
};

export default ProductDetails;
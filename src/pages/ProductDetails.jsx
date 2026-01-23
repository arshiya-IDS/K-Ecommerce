import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import api from "../api/axiosInstance";



const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
  images: []
});

  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [message, setMessage] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  const [replaceAllImages, setReplaceAllImages] = useState(false);
  const [replaceImageMap, setReplaceImageMap] = useState({});

    const [isDeactivated, setIsDeactivated] = useState(false);



  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Product/details/${id}`);
      setProduct(res.data);
      const images = res.data.images || [];
      setProduct({ ...res.data, images });
      setPrimaryImageId(images.find(img => img.isPrimary)?.id || null);

    } catch (err) {
      setMessage("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("Product_ID", product.product_id);
    formData.append("Product_Name", product.product_name);
    formData.append("Product_Description", product.product_description);
    formData.append("Product_Actual_Price", product.product_actual_price);
    if (product.product_discounted_price)
      formData.append("Product_Discounted_Price", product.product_discounted_price);
    formData.append("SubCategory_Id", product.subcategory_id);
    formData.append("Product_Type", product.product_type);

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

  const handleReplaceSingleImage = (imageId, file) => {
  setReplaceImageMap(prev => ({
    ...prev,
    [imageId]: file
  }));
};

const getImagePreviewSrc = (img) => {
  // If this image is marked for replacement, show local preview
  if (replaceImageMap[img.id]) {
    return URL.createObjectURL(replaceImageMap[img.id]);
  }

  // Otherwise show existing image from server
  return img.url;
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
        Submit
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
            ["product_description", "Description", "textarea"],
            ["product_actual_price", "Actual Price (₹)"],
            ["product_discounted_price", "Discounted Price (₹)"],
            ["category_name", "Category (Read-only)"],
            ["subcategory_name", "Subcategory (Read-only)"],
            ["product_type", "Product Type"],
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
                  readOnly={!isEditable || ["category_name", "subcategory_name"].includes(key)}
                />
              )}
            </div>
          ))}
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

<div className="d-flex flex-wrap gap-3">
  {product.images && product.images.length > 0 ? (
    product.images.map(img => (
      <div
        key={img.id}
        className="position-relative border rounded p-2"
        style={{ width: "160px" }}
      >
        
                <img
          src={getImagePreviewSrc(img)}
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
    

    {/* 🔽 REPLACE SINGLE IMAGE */}
 
   <div className="mt-10">
      <input
        type="file"
        accept="image/*"
        className="form-control form-control-sm"
        onChange={(e) =>
          handleReplaceSingleImage(img.id, e.target.files[0])
        }
      />
      {replaceImageMap[img.id] && (
        <small className="text-warning">Image will be replaced</small>
      )}
    </div>
   
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
    <div className="text-muted">No images available</div>
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


        {isEditable && (
          <div className="text-end mt-4">
            <button className="btn btn-success btn-lg px-5" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        )}

        {message && <div className={`alert mt-3 ${message.includes("success") ? "alert-success" : "alert-danger"}`}>{message}</div>}
      </div>
    </div>
  );
};

export default ProductDetails;
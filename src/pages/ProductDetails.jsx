import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";

const API_BASE = "https://localhost:7013/api/Product";

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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/details/${id}`);
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

    newImages.forEach(file => formData.append("Images", file));
    deleteImageIds.forEach(id => formData.append("DeleteImageIds", id));
    if (primaryImageId) formData.append("PrimaryImageId", primaryImageId);

    try {
      await axios.put(`${API_BASE}/update/${id}`, formData, {

        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage("Product updated successfully!");
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

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4"
        style={{ backgroundColor: "#FEC200", padding: "12px", borderRadius: "8px", color: "white" }}>
        <h3>Product Details - #{product.product_id}</h3>
        <div>
          <button className="btn btn-light me-2" onClick={() => navigate(-1)}>Back</button>
          <button className="btn btn-warning" onClick={() => setIsEditable(!isEditable)}>
            <FaEdit /> {isEditable ? "Cancel" : "Edit"}
          </button>
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
                  name={key}
                  value={product[key] || ""}
                  onChange={handleChange}
                  readOnly={!isEditable || ["category_name", "subcategory_name"].includes(key)}
                />
              )}
            </div>
          ))}
          <div className="col-md-6">
            <label className="form-label fw-bold">Created At</label>
            <input type="text" className="form-control" value={formatDate(product.created_at)} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Status</label>
            <input type="text" className="form-control" value={product.status} readOnly />
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
          src={img.url}
          alt="Product"
          className="img-fluid rounded"
          style={{ height: "120px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "/assets/Images/placeholder.png";
          }}
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


        {isEditable && (
          <div className="mt-3">
            <label className="form-label">Add New Images</label>
            <input type="file" multiple className="form-control" onChange={handleImageChange} />
            {newImages.length > 0 && <small>{newImages.length} file(s) selected</small>}
          </div>
        )}

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
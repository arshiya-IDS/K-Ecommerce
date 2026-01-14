import React, { useState, useEffect } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useParams, useNavigate } from "react-router-dom";
import "sweetalert2/src/sweetalert2.scss";


const ProductCreate = () => {
    const navigate = useNavigate();
    // Validation errors
const [errors, setErrors] = useState({});


  // Product State
  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_actual_price: "",
    product_discounted_price: "",
    category_id: "",
    subcategory_id: "",
    product_type: "",
  });

  // Dynamic Categories / Subcategories
  

  const [categories, setCategories] = useState([]);
const [subcategories, setSubcategories] = useState([]);



  // Image & Media States
  const [images, setImages] = useState([null, null, null, null]);
  const [previewImages, setPreviewImages] = useState(["", "", "", ""]);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [primaryIndex, setPrimaryIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Categories
  useEffect(() => {
    fetch("https://localhost:7013/api/Category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.log("Failed to load categories"));
  }, []);

  // Fetch Subcategories when category changes
  // useEffect(() => {
  //   if (product.category_id) {
  //     fetch(`https://localhost:7013/api/Category/sub/${product.category_id}`)
  //       .then((res) => res.json())
  //       .then((data) => setSubCategories(data))
  //       .catch(() => console.log("Failed to load subcategories"));
  //   }
  // }, [product.category_id]);

  const fetchSubcategories = async (categoryId) => {
  try {
    const res = await fetch(`https://localhost:7013/api/Category/sub/${categoryId}`);
    const data = await res.json();
    setSubcategories(data);
  } catch (error) {
    console.error("Failed to fetch subcategories", error);
  }
};


  // Handle Input Change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Submit Product
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   let formData = new FormData();
  //   formData.append("Product_Name", product.product_name);
  //   formData.append("Product_Description", product.product_description);
  //   formData.append("Product_Actual_Price", product.product_actual_price);
  //   formData.append("Product_Discounted_Price", product.product_discounted_price);
  //   formData.append("Category_Id", product.category_id);
  //   formData.append("SubCategory_Id", product.subcategory_id);
  //   formData.append("Product_Type", product.product_type);
  //   formData.append("PrimaryIndex", primaryIndex);

  //   // Attach Images
  //   images.forEach((img) => {
  //     if (img) formData.append("Images", img);
  //   });

  //   // Attach Extra Media
  //   if (media) {
  //     formData.append("Media", media);
  //   }

  //   await fetch("https://localhost:7013/api/Product/create", {

  //     method: "POST",
  //     body: formData,
  //   });

  //   setLoading(false);
  //   alert("Product created successfully!");
  // };

  const validateForm = () => {
  const newErrors = {};

  if (!product.product_name.trim())
    newErrors.product_name = "Product name is required";

  if (!product.product_description.trim())
    newErrors.product_description = "Description is required";

  if (!product.product_actual_price)
    newErrors.product_actual_price = "Actual price is required";
  else if (Number(product.product_actual_price) <= 0)
    newErrors.product_actual_price = "Price must be greater than 0";

  if (
    product.product_discounted_price &&
    Number(product.product_discounted_price) < 0
  )
    newErrors.product_discounted_price = "Discount price cannot be negative";

  if (!product.category_id)
    newErrors.category_id = "Please select a category";

  if (!product.subcategory_id)
    newErrors.subcategory_id = "Please select a subcategory";

  if (!product.product_type)
    newErrors.product_type = "Please select product type";

  // At least one image
  if (!images.some(img => img))
    newErrors.images = "At least one product image is required";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
  e.preventDefault();

   if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please fix the highlighted fields",
    });
    return;
  }
  
  // Ensure numbers are proper
  const actualPrice = Number(product.product_actual_price);
  const discountedPrice = product.product_discounted_price ? Number(product.product_discounted_price) : null;
  if (Number.isNaN(actualPrice) || actualPrice <= 0) return alert("Actual price must be a positive number");
  if (discountedPrice !== null && (Number.isNaN(discountedPrice) || discountedPrice < 0)) return alert("Discounted price must be a valid number");

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("Product_Name", product.product_name);
    formData.append("Product_Description", product.product_description);
    // Use invariant string formatting for decimals
    formData.append("Product_Actual_Price", actualPrice.toString());
    formData.append("Product_Discounted_Price", discountedPrice !== null ? discountedPrice.toString() : "");
    // API expects SubCategory_Id — make sure it is a number string
    formData.append("SubCategory_Id", String(product.subcategory_id));
    formData.append("Product_Type", product.product_type);

    // PrimaryIndex: if null, send -1 (server should tolerate -1 or you can make it nullable)
    const primary = primaryIndex === null || primaryIndex === undefined ? -1 : primaryIndex;
    formData.append("PrimaryIndex", String(primary));

    // Append images (multiple entries with the same name)
    images.forEach((img) => {
      if (img) formData.append("Images", img);
    });

    // Attach media if present
    if (media) {
      formData.append("Media", media);
    }

    const res = await fetch("https://localhost:7013/api/Product/create", {
      method: "POST",
      body: formData,
    });

    // IMPORTANT: check response before success
    if (res.ok) {
      const json = await res.json().catch(() => null);
      setLoading(false);
       Swal.fire({
      icon: "success",
      title: "Added!",
      text: "New Product created ",
      timer: 1500,
      showConfirmButton: false
    });
        navigate("/product-list");
      // optionally clear form here
    } else {
      // read error body (could be JSON or text)
      let errText = "";
      try {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const errJson = await res.json();
          // If server returned ModelState, it will be contained here — stringify it
          errText = JSON.stringify(errJson);
        } else {
          errText = await res.text();
        }
      } catch (ex) {
        errText = "Unknown server error";
      }

      setLoading(false);
      console.error("Server returned 400", errText);
      alert("Failed to create product: " + (errText || res.statusText));
    }
  } catch (networkErr) {
    console.error("Network error", networkErr);
    setLoading(false);
    alert("Network error while creating product");
  }
};


  return (
    <div className="container my-5">
      {/* Header */}
      <div
        className="text-center py-3 mb-4 rounded"
        style={{ backgroundColor: "#FEC200", color: "black", marginTop: "-40px", height: "50px" }}
      >
        <h2 style={{ fontSize: "20px", marginTop: "-5px", fontWeight: "normal" }}>
          Add New Product
        </h2>
      </div>

      {/* Card */}
      <div className="card shadow-sm p-4" style={{ marginTop: "-18px" }}>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Name</label>
            <input
              type="text"
              name="product_name"
              className={`form-control ${errors.product_name ? "is-invalid" : ""}`}
              placeholder="Enter product name"
              value={product.product_name}
              onChange={handleChange}
              required
            />
            {errors.product_name && (
  <div className="invalid-feedback">{errors.product_name}</div>
)}
          </div>
          

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="product_description"
              className={`form-control ${errors.product_description ? "is-invalid" : ""}`}              rows="3"
              placeholder="Enter product description"
              value={product.product_description}
              onChange={handleChange}
              required
            ></textarea>
            {errors.product_description && (
  <div className="invalid-feedback">{errors.product_description}</div>
)}
          </div>

          {/* Prices */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Actual Price (₹)</label>
              <input
                type="number"
                name="product_actual_price"
                className={`form-control ${errors.product_actual_price ? "is-invalid" : ""}`}
                placeholder="Enter price"
                value={product.product_actual_price}
                onChange={handleChange}
                required
              />
              {errors.product_actual_price && (
  <div className="invalid-feedback">{errors.product_actual_price}</div>
)}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Discounted Price (₹)</label>
              <input
                type="number"
                name="product_discounted_price"
                className={`form-control ${errors.product_discounted_price ? "is-invalid" : ""}`}
                placeholder="Enter discounted price"
                value={product.product_discounted_price}
                onChange={handleChange}
              />
              {errors.product_discounted_price && (
  <div className="invalid-feedback">{errors.product_discounted_price}</div>
)}
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="row">
            {/* CATEGORY DROPDOWN */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Category</label>
           
              {/* <select
                className="form-select"
                name="Category_Id"
                value={product.category_Id}
                onChange={(e) => {
                    handleChange(e);
                    fetchSubcategories(e.target.value);
                }}
              >
                        {Array.isArray(categories) && categories.map((cat) => (
          <option key={cat.category_Id} value={cat.category_Id}>
            {cat.category_Name}
          </option>
        ))}

              
              </select> */}

              <select
                className={`form-select ${errors.category_id ? "is-invalid" : ""}`}
                name="category_id"
                value={product.category_id} 
                onChange={(e) => {
                  handleChange(e);
                  fetchSubcategories(e.target.value);
                }}
              >
                {errors.category_id && (
  <div className="invalid-feedback">{errors.category_id}</div>
)}
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.category_Id} value={cat.category_Id}>
                    {cat.category_Name}
                  </option>
                ))}
              </select>

            </div>

            {/* SUBCATEGORY DROPDOWN */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Subcategory</label>
              {/* <select
                name="subcategory_id"
                className="form-control"
                value={product.subcategory_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Subcategory</option>

                {subCategories.map((sub) => (
                  <option key={sub.subCategory_Id} value={sub.subCategory_Id}>
                    {sub.subCategory_Name}
                  </option>
                ))}
              </select> */}
              {/* <select
                className="form-select"
                name="Sub_Category_Id"
                value={product.Sub_Category_Id}
                onChange={handleChange}
              >
                {Array.isArray(subcategories) && subcategories.map((sub) => (
  <option key={sub.sub_Category_Id} value={sub.sub_Category_Id}>
    {sub.sub_Category_Name}
  </option>
))}

              </select> */}

              {/* <select
                className="form-select"
                name="subcategory_id"
                value={product.subcategory_id}
                onChange={handleChange}
              >
                <option value="">Select Subcategory</option>

                {subcategories.map((sub) => (
                  <option key={sub.sub_Category_Id} value={sub.sub_Category_Id}>
                    {sub.sub_Category_Name}
                  </option>
                ))}
              </select> */}

              <select
                 className={`form-select ${errors.subcategory_id ? "is-invalid" : ""}`}
                name="subcategory_id"
                value={product.subcategory_id}
                onChange={handleChange}
              >
                {errors.subcategory_id && (
  <div className="invalid-feedback">{errors.subcategory_id}</div>
)}

                <option value="">Select Subcategory</option>

                {subcategories.map((sub) => (
                  <option key={sub.sub_category_Id} value={sub.sub_category_Id}>
                    {sub.sub_category_Name}
                  </option>
                ))}
              </select>


            </div>

            {/* PRODUCT TYPE */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Product Type</label>
              <select
                name="product_type"
                className={`form-select ${errors.product_type ? "is-invalid" : ""}`}
                value={product.product_type}
                onChange={handleChange}
                required
              >
                {errors.product_type && (
  <div className="invalid-feedback">{errors.product_type}</div>
)}

                <option value="">Select type</option>
                <option value="Physical">Physical</option>
                <option value="Digital">Digital</option>
                <option value="Service">Service</option>
              </select>
            </div>
          </div>

          {/* Image & Media Upload */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Upload Product Media</label>
            <p className="text-muted small mb-3">
              Upload up to 4 images and 1 media file (image or video). Select one as the primary
              display.
            </p>

            {/* Image Inputs */}
            <div className="row">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Image {num}</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const updatedImages = [...images];
                      updatedImages[num - 1] = file;
                      setImages(updatedImages);

                      const updatedPreviews = [...previewImages];
                      updatedPreviews[num - 1] = URL.createObjectURL(file);
                      setPreviewImages(updatedPreviews);
                    }}
                  />
                  {errors.images && (
  <div className="text-danger small mt-2">{errors.images}</div>
)}

                </div>
              ))}
            </div>

            {/* Media Upload */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Additional Media (Image or Video)</label>
              <input
                type="file"
                accept="image/*,video/*"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setMedia(file);
                  setMediaPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            {/* Preview Section */}
            <div className="d-flex flex-wrap mt-3 gap-3">
              {/* Images */}
              {previewImages.map((src, index) => (
                <div
                  key={index}
                  className={`position-relative border rounded-3 p-2 ${
                    primaryIndex === index ? "border-success border-3" : ""
                  }`}
                  style={{ width: "130px" }}
                >
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    className="img-fluid rounded"
                    style={{ height: "100px", objectFit: "cover" }}
                  />
                  <div className="form-check mt-2 text-center">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="primaryMedia"
                      onChange={() => setPrimaryIndex(index)}
                      checked={primaryIndex === index}
                    />
                    <label className="form-check-label small">Primary</label>
                  </div>
                </div>
              ))}

              {/* Media Preview */}
              {mediaPreview && (
                <div
                  className={`position-relative border rounded-3 p-2 ${
                    primaryIndex === 4 ? "border-success border-3" : ""
                  }`}
                  style={{ width: "130px" }}
                >
                  {media && media.type.startsWith("video/") ? (
                    <video
                      src={mediaPreview}
                      controls
                      className="rounded"
                      style={{ width: "100%", height: "100px", objectFit: "cover" }}
                    ></video>
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="media-preview"
                      className="img-fluid rounded"
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  )}
                  <div className="form-check mt-2 text-center">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="primaryMedia"
                      onChange={() => setPrimaryIndex(4)}
                      checked={primaryIndex === 4}
                    />
                    <label className="form-check-label small">Primary</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-warning text-black fw-bold px-4 py-2 rounded-3 float-end"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`alert mt-4 ${
              message.includes("✅")
                ? "alert-success"
                : message.includes("❌")
                ? "alert-danger"
                : "alert-warning"
            } text-center`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCreate;

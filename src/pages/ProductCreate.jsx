import React, { useState } from "react";

const ProductCreate = () => {
  // State declarations
  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_actual_price: "",
    product_discounted_price: "",
    subcategory_id: "",
    product_type: "",
  });



  const [images, setImages] = useState([null, null, null, null]);
  const [previewImages, setPreviewImages] = useState(["", "", "", ""]);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [primaryIndex, setPrimaryIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes for product
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setMessage("✅ Product created successfully!");
      console.log({
        product,
        images,
        media,
        primaryIndex,
      });
    }, 1500);
  };

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div
        className="text-center py-3 mb-4 rounded"
        style={{ backgroundColor: "#FEC200", color: "black", border: "1px solid black", marginTop:'-35px', height: "45px" }}
      >
        <h2 style={{ fontSize: "20px",marginTop:'-5px' }}>Add New Product</h2>
      </div>

      {/* Card Section */}
      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Name</label>
            <input
              type="text"
              name="product_name"
              className="form-control"
              placeholder="Enter product name"
              value={product.product_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="product_description"
              className="form-control"
              rows="3"
              placeholder="Enter product description"
              value={product.product_description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Prices */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Actual Price (₹)</label>
              <input
                type="number"
                name="product_actual_price"
                className="form-control"
                placeholder="Enter price"
                value={product.product_actual_price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Discounted Price (₹)</label>
              <input
                type="number"
                name="product_discounted_price"
                className="form-control"
                placeholder="Enter discounted price"
                value={product.product_discounted_price}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Subcategory & Product Type */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Subcategory ID</label>
              <input
                type="number"
                name="subcategory_id"
                className="form-control"
                placeholder="Enter subcategory ID"
                value={product.subcategory_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Product Type</label>
              <select
                name="product_type"
                className="form-select"
                value={product.product_type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                <option value="Physical">Physical</option>
                <option value="Digital">Digital</option>
                <option value="Service">Service</option>
              </select>
            </div>
          </div>

          {/* Image & Media Upload Section */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Upload Product Media</label>
            <p className="text-muted small mb-3">
              Upload up to 4 images and 1 media file (image or video). Select one as the primary display.
            </p>

            {/* Individual Image Inputs */}
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
                </div>
              ))}
            </div>

            {/* Media Upload (Image or Video) */}
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

        {/* Message Section */}
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


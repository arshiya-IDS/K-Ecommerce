// ProductDiscount.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductDiscount = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountName, setDiscountName] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountStartDate, setDiscountStartDate] = useState("");
  const [discountEndDate, setDiscountEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  // Fetch sub-categories when category changes
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`/api/subcategories?categoryId=${selectedCategory}`)
        .then((res) => setSubCategories(res.data));
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
    }
    setProducts([]);
    setSelectedProducts([]);
  }, [selectedCategory]);

  // Fetch products when sub-category changes
  useEffect(() => {
    if (selectedSubCategory) {
      axios
        .get(`/api/products?subCategoryId=${selectedSubCategory}`)
        .then((res) => setProducts(res.data));
    } else {
      setProducts([]);
      setSelectedProducts([]);
    }
  }, [selectedSubCategory]);

  const handleProductSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setSelectedProducts(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!discountName || !discountValue || selectedProducts.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      discountName,
      discountValue: parseFloat(discountValue),
      discountStartDate,
      discountEndDate,
      isActive,
      products: selectedProducts,
    };

    try {
      await axios.post("/api/product-discounts", payload);
      alert("Discounts applied successfully!");
      // Reset form
      setDiscountName("");
      setDiscountValue("");
      setSelectedCategory("");
      setSelectedSubCategory("");
      setSelectedProducts([]);
      setDiscountStartDate("");
      setDiscountEndDate("");
      setIsActive(true);
    } catch (error) {
      console.error(error);
      alert("Error applying discounts.");
    }
  };

  return (
    <div className="container my-5">
      <div
        className="text-center py-3 mb-4 rounded"
        style={{ backgroundColor: "#FEC200", color: "black", border: "1px solid black", marginTop:'-35px', height: "45px" }}
      >
        <h2
        style={{fontSize: "20px",marginTop:'-5px'}}
        >Product Discount Management</h2>
      </div>

      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit}>
          {/* Discount Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Discount Name</label>
            <input
              type="text"
              className="form-control"
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
              placeholder="Enter discount name"
              required
            />
          </div>

          {/* Discount Value */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Discount Value (%)</label>
            <input
              type="number"
              className="form-control"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              min="0"
              max="100"
              placeholder="Enter discount percentage"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Sub-Category</label>
            <select
              className="form-select"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              required
              disabled={!subCategories.length}
            >
              <option value="">Select Sub-Category</option>
              {subCategories.map((sub) => (
                <option key={sub.sub_category_id} value={sub.sub_category_id}>
                  {sub.sub_category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Products */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Products</label>
            <select
              multiple
              className="form-select"
              value={selectedProducts}
              onChange={handleProductSelect}
              required
              disabled={!products.length}
              size={Math.min(5, products.length)}
            >
              {products.map((prod) => (
                <option key={prod.product_id} value={prod.product_id}>
                  {prod.product_name} - ${prod.product_actual_price}
                </option>
              ))}
            </select>
            <small className="form-text text-muted">
              Hold Ctrl (Cmd on Mac) to select multiple products.
            </small>
          </div>

          {/* Start Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={discountStartDate}
              onChange={(e) => setDiscountStartDate(e.target.value)}
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold">End Date</label>
            <input
              type="date"
              className="form-control"
              value={discountEndDate}
              onChange={(e) => setDiscountEndDate(e.target.value)}
              required
            />
          </div>

          {/* Is Active */}
          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
              id="activeCheck"
            />
            <label className="form-check-label fw-semibold" htmlFor="activeCheck">
              Active
            </label>
          </div>

          <button type="submit" className="btn btn-warning text-black fw-bold  float-end">
            Apply Discount
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDiscount;

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

  // ---------------------------
  // 1) FETCH CATEGORIES
  // ---------------------------
  useEffect(() => {
    axios
      .get("https://localhost:7013/api/Category")   
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // ---------------------------
  // 2) FETCH SUBCATEGORIES WHEN CATEGORY CHANGES
  // ---------------------------

 
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`https://localhost:7013/api/Category/sub/${selectedCategory}`)
        .then((res) => setSubCategories(res.data))
        .catch((err) => console.error("Error loading subcategories:", err));
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
    }
    setProducts([]);
    setSelectedProducts([]);
  }, [selectedCategory]);

  // ---------------------------
  // 3) FETCH PRODUCTS WHEN SUBCATEGORY CHANGES
  // ---------------------------
  useEffect(() => {
    if (selectedSubCategory) {
      axios
        .get(`https://localhost:7013/api/Category/products/${selectedSubCategory}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error loading products:", err));
    } else {
      setProducts([]);
      setSelectedProducts([]);
    }
  }, [selectedSubCategory]);

  // ---------------------------
  // HANDLE MULTI PRODUCT SELECT
  // ---------------------------
 
  const handleProductSelect = (e) => {
  const selected = Array.from(e.target.selectedOptions, option => option.value);
  setSelectedProducts(selected);
};


  // ---------------------------
  // SUBMIT DISCOUNT
  // ---------------------------
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
  products: selectedProducts.map(Number) // 🔥 ENSURE INTS
};


    try {
      await axios.post("https://localhost:7013/api/ProductDiscount", payload);

      alert("Discount created successfully!");

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
      alert("Error creating discount.");
    }
  };

  return (
    <div className="container my-5">

      <div
        className="text-center py-3 mb-4 rounded"
        style={{ backgroundColor: "#FEC200", color: "black", marginTop: "-40px", height: "50px" }}
      >
        <h2 style={{ fontSize: "20px", marginTop: "-5px", fontWeight: "normal" }}>
          Product Discount Management
        </h2>
      </div>

      <div className="card shadow-sm p-4" style={{ marginTop: "-18px" }}>
        <form onSubmit={handleSubmit}>

          {/* DISCOUNT NAME */}
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

          {/* DISCOUNT VALUE */}
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

          {/* CATEGORY SELECT */}
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
              <option key={cat.category_Id} value={cat.category_Id}>
                {cat.category_Name}
              </option>
            ))}
          </select>

          </div>

          {/* SUB CATEGORY SELECT */}
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
                  <option key={sub.sub_category_Id} value={sub.sub_category_Id}>
                    {sub.sub_category_Name}
                  </option>
                ))}
              </select>

          </div>

          {/* PRODUCT MULTI SELECT */}
        <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
  {products.length === 0 && (
    <div className="text-muted small">No products available</div>
  )}

  {products.map((prod) => (
    <div key={prod.product_id} className="form-check">
      
       <input
            className="form-check-input"
            type="checkbox"
            id={`prod-${prod.product_id}`}
            value={prod.product_id}
            checked={selectedProducts.includes(Number(prod.product_id))}
            onChange={(e) => {
              const id = Number(prod.product_id);

              setSelectedProducts((prev) =>
                e.target.checked
                  ? [...prev, id]
                  : prev.filter((p) => p !== id)
              );
            }}
          />


      <label
        className="form-check-label"
        htmlFor={`prod-${prod.product_id}`}
      >
        {prod.product_name} — ₹{prod.product_actual_price}
      </label>
    </div>
  ))}
</div>


          {/* START DATE */}
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

          {/* END DATE */}
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

          {/* ACTIVE CHECKBOX */}
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

          <button type="submit" className="btn btn-warning text-black fw-bold float-end">
            Apply Discount
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDiscount;

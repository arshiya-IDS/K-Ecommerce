import React, { useState } from "react";

const ManageSubCategories = () => {
  // ✅ Category state
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

 

  // ✅ Handle input change for subcategory
  const handleSubCategoryChange = (e) => {
    setSubCategory({ ...subCategory, [e.target.name]: e.target.value });
  };


  

  // ✅ Handle subcategory submission
  const handleSubCategorySubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate saving
    setTimeout(() => {
      setLoading(false);
      setMessage("✅ Subcategory added successfully!");
      console.log("New Subcategory:", subCategory);
      setSubCategory({
        category_id: "",
        sub_category_name: "",
        sub_category_description: "",
        sub_category_is_active: true,
      });
    }, 1500);
  };

  return (
    <div className="container my-5">
      {/* HEADER */}
      <div
        className="text-center py-3 mb-4 rounded"
        style={{
          backgroundColor: "#FEC200",
          color: "black",
          border: "1px solid black",
          marginTop: "-35px",
          height: "45px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginTop: "-5px" }}>
          Manage Sub-Categories
        </h2>
      </div>

      {/* CARD */}
      <div className="card shadow-sm p-4">
       

        {/* SUBCATEGORY FORM */}
        <form onSubmit={handleSubCategorySubmit}>
          {/* <h5 className="fw  mb-3">
             Add New Subcategory
          </h5> */}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parent Category ID</label>
              <input
                type="number"
                name="category_id"
                className="form-control"
                placeholder="Enter category ID"
                value={subCategory.category_id}
                onChange={handleSubCategoryChange}
                required
              />
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

import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";
import { useMemo } from 'react';


const ProductDetails = () => {
  // Hardcoded product data
  const [product, setProduct] = useState({
    product_id: 101,
    product_name: "Laser Cut Steel Plate",
    product_description:
      "High-precision laser cut steel plate ideal for industrial and architectural projects. Offers excellent durability and finish.",
    product_actual_price: "2500",
    product_discounted_price: "2200",
    category_name: "Metal Works",
    subcategory_name: "Steel",
    product_type: "Physical",
    created_at: "2025-10-20",
    status: "Active",
    images: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  });

  const [searchTerm, setSearchTerm,users] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? "✏️ Edit mode disabled." : "✏️ Edit mode enabled.");
  };

   const filteredUsers = useMemo(() => {
      if (!searchTerm) return users;
      
      return users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm) ||
        user.createdAt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [users, searchTerm]);
  
    // Sort users based on sort configuration
    const sortedUsers = useMemo(() => {
      if (!sortConfig.key) return filteredUsers;
      
      return [...filteredUsers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }, [filteredUsers, sortConfig]);
  
    const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };
  
    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };

  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setMessage("⚠️ Product has been deactivated successfully!");
  };

  return (
   <div className="container my-5">
  {/* Header Section */}
  <div
    className="d-flex align-items-center justify-content-between px-3 rounded"
    style={{
      backgroundColor: "#FEC200",
      color: "balck",
      marginTop: "-40px",
      height: "50px",
    }}
  >
    {/* Left: Title */}
    <h2 style={{ fontSize: "20px",fontWeight:'normal', marginLeft:"420px" }}>Product Details</h2>

    {/* Center: Search Bar */}
    <div
      className="input-group"
      style={{
        maxWidth: "350px",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <input
        type="search"
        placeholder="Search by ID, Name, Contact, Email, Location..."
        className="form-control form-control-sm"
        style={{
          height: "30px",
          fontFamily: "inherit",
          fontSize: "inherit",
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-light btn-sm ms-2 d-flex align-items-center justify-content-center"
        style={{ height: "34px", width: "34px", padding: 0 }}
        title="Search"
        onClick={handleSearch}
      >
        <i className="fas fa-search" style={{ fontSize: "13px" }}></i>
      </button>
    </div>
  </div>

      {/* Card Section */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}
      style={{marginTop:"6px"}}
      
      >
        {/* Product Info */}
        <div className="row">
          {[
            ["product_id", "Product ID"],
            ["product_name", "Product Name"],
            ["product_description", "Description"],
            ["product_actual_price", "Actual Price (₹)"],
            ["product_discounted_price", "Discounted Price (₹)"],
            ["category_name", "Category"],
            ["subcategory_name", "Subcategory"],
            ["product_type", "Product Type"],
            ["created_at", "Created At"],
            ["status", "Status"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
             {key === "product_description" ? (
                    <textarea
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
                      rows="3"
                      value={product[key]}
                      onChange={handleChange}
                      readOnly={!isEditable || isDeactivated}
                    ></textarea>
                  ) : (
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
                      value={product[key]}
                      onChange={handleChange}
                      readOnly={!isEditable || isDeactivated}
                    />
                  )}


            </div>
          ))}
        </div>

        {/* Product Images */}
        <hr />
        <h5 className="fw mb-3">Product Images</h5>
        <div className="d-flex gap-3 flex-wrap"
        // style={{
        //       backgroundColor: '#f8f9fa',  
        //       border: '1px solid #dee2e6', 
        //       borderRadius: '8px',         
        //       padding: '10px',
        //       color: '#212529'          
        //     }}
          style={{
                        backgroundColor: isEditable && !isDeactivated ? "#fff" : "#f8f9fa",
                        border: isEditable && !isDeactivated ? "1px solid #80bdff" : "1px solid #dee2e6",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#212529",
                        transition: "all 0.3s ease"
                      }}
        >
          
          {product.images.map((img, index) => (
            <div
              key={index}
              className="border rounded-3 p-2"
              style={{ width: "150px", backgroundColor: "#f9f9f9" }}
            >
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="img-fluid rounded"
                style={{ height: "100px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-primary fw-bold px-4 py-2 rounded-3"
            disabled={isDeactivated}
          >
            {isEditable ? "Submit" : "Edit"}
          </button>

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

export default ProductDetails;

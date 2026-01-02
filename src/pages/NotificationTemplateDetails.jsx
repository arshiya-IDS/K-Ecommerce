import React, { useState } from "react";
import { FaEdit, FaBan } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";


const NotificationTemplateDetails = () => {

  const { id } = useParams();

  // Hardcoded notification template details
 const [template, setTemplate] = useState(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [message, setMessage] = useState("");


useEffect(() => {
  const fetchTemplateDetails = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7013/api/NtfcnTemplate/details/${id}`
      );

      const data = res.data;

      setTemplate({
        template_id: data.template_id,
        template_name: data.template_name,
        subject: data.subject,
        body: data.body,
        user_id: data.user_id,
        product_id: data.product_id,
        is_active: data.is_active ? "Active" : "Inactive",
        created_at: data.ntfcn_CrtdAt,
        updated_at: data.ntfcn_UpdtdAt,
      });
    } catch (error) {
      console.error("Failed to load template details", error);
      setMessage("❌ Failed to load notification template");
    }
  };

  if (id) fetchTemplateDetails();
}, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate({ ...template, [name]: value });
  };

  const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };
  // Toggle Edit Mode
const handleEditToggle = async () => {
  // SUBMIT MODE
  if (isEditable) {
    try {
      const payload = {
        user_id: template.user_id,
        product_id: template.product_id,
        subject: template.subject,
        body: template.body,
        template_name: template.template_name,
        is_active: template.is_active === "Active",
        order_id: 0
      };

      await axios.put(
        `https://localhost:7013/api/NtfcnTemplate/edit-User/${id}`,
        payload
      );

      setMessage("✅ Notification template updated successfully!");
      setIsEditable(false);
    } catch (error) {
      console.error("Update failed", error);
      setMessage("❌ Failed to update notification template");
    }
  } 
  // EDIT MODE
  else {
    setIsEditable(true);
    setMessage("✏️ Edit mode enabled.");
  }
};
 

  // Handle Deactivation
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setTemplate({ ...template, is_active: "Inactive" });
    setMessage("⚠️ This notification template has been deactivated successfully!");
  };

  if (!template) {
  return (
    <div className="text-center mt-5">
      <span className="spinner-border spinner-border-sm"></span> Loading...
    </div>
  );
}

  return (
    <div className="container my-5">
      {/* Header */}
      <div
       className="d-flex align-items-center justify-content-between px-3 rounded"

        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-35px",
          height: "45px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight:'normal',marginLeft:'420px' }}>
          Notification Template Details
        </h2>

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

      {/* Card */}
      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}
       style={{marginTop:"6px"}}
      
      >

        <div className="row">
          {[
            ["template_id", "Template ID"],
            ["template_name", "Template Name"],
            ["subject", "Subject"],
            ["body", "Body"],
            ["is_active", "Status"],
            ["created_at", "Created At"],
            ["updated_at", "Last Updated"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              {key === "body" ? (
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
                  rows="5"
                  value={template[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                ></textarea>
              ) : (
                <input
                  type={key.includes("id") ? "number" : "text"}
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
                  value={template[key]}
                  onChange={handleChange}
                  readOnly={!isEditable || isDeactivated}
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-primary fw-bold px-4 py-2 rounded-3"
            disabled={isDeactivated}
          >
            {isEditable ? "Submit" : "Edit"}
          </button>

        
        </div>

        {/* Message */}
        {message && (
          <div className="alert alert-success text-center mt-4">{message}</div>
        )}
      </div>
    </div>
  );
};

export default NotificationTemplateDetails;

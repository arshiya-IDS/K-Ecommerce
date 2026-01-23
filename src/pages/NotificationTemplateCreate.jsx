import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useParams, useNavigate } from "react-router-dom";
import "sweetalert2/src/sweetalert2.scss";
import api from "../api/axiosInstance";


const NotificationTemplateCreate = () => {
  const navigate = useNavigate();

  // State for the notification template form
  const [template, setTemplate] = useState({
    template_name: "",
    subject: "",
    body: "",
    user_id: "",
    product_id: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate({
      ...template,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const payload = {
      template_name: template.template_name,
      subject: template.subject,
      body: template.body,
      is_active: template.is_active,
    };

    await api.post(
      "/NtfcnTemplate/create",
      payload
    );

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "New Notification Template Added",
      timer: 1500,
      showConfirmButton: false
    });
        navigate("/notification-list");

    // Optional: reset form
    setTemplate({
      template_name: "",
      subject: "",
      body: "",
      user_id: "",
      product_id: "",
      is_active: true,
    });
  } catch (error) {
    console.error("Create template failed", error);
    setMessage("❌ Failed to create notification template");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div
        className="text-center py-3 mb-4 rounded"
        style={{
          backgroundColor: "#FEC200",
          color: "black",
          marginTop: "-40px",
          height: "50px",
        }}
      >
        <h2 style={{ fontSize: "20px", marginTop: "-5px",fontWeight:'normal' }}>
          Create Notification Template
        </h2>
      </div>

      {/* Card Section */}
      <div className="card shadow-sm p-4"
      style={{marginTop:"-18px"}}
      >
        <form onSubmit={handleSubmit}>
          {/* Template Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Template Name</label>
            <input
              type="text"
              name="template_name"
              className="form-control"
              placeholder="Enter template name (e.g., Order Confirmation)"
              value={template.template_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Subject */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Enter subject line"
              value={template.subject}
              onChange={handleChange}
            />
          </div>

          {/* Body */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Body</label>
            <textarea
              name="body"
              className="form-control"
              rows="5"
              placeholder="Enter template body (you can include placeholders like {username}, {order_id})"
              value={template.body}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* User ID and Product ID
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">User ID</label>
              <input
                type="number"
                name="user_id"
                className="form-control"
                placeholder="Enter user ID (optional)"
                value={template.user_id}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Product ID</label>
              <input
                type="number"
                name="product_id"
                className="form-control"
                placeholder="Enter product ID (optional)"
                value={template.product_id}
                onChange={handleChange}
              />
            </div>
          </div> */}

          {/* Active Status */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={template.is_active}
              onChange={handleChange}
            />
            <label className="form-check-label fw-semibold" htmlFor="is_active">
              Active Template
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-warning text-black fw-bold px-4 py-2 rounded-3 float-end"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create Template"}
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

export default NotificationTemplateCreate;

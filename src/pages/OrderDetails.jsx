import React, { useState } from "react";
import jsPDF from "jspdf";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderDetails = () => {

  const { id } = useParams(); // order_id from URL

  // Hardcoded demo data for testing
 
const [order, setOrder] = useState({});
const [invoice, setInvoice] = useState({});
const[payment,setPayment]=useState({});
const [discount,setDiscount]=useState({});
const [shipping,setShipping]=useState({});

useEffect(() => {
  if (id) {
    fetchOrderItem();
  }
}, [id]);

const fetchOrderItem = async () => {
  try {
    const res = await axios.get(
      `http://ecommerce-admin-backend.i-diligence.com/api/OrderItem/OrderDetails`,

      {
        params: { order_id: id }
      }
    );

    const data = res.data;

    // ORDER
    setOrder({
      order_id: data.order.order_id,
      order_total_amount: data.order.order_total_amount,
      order_status: data.order.order_status,
      order_date: data.order.order_date,
      Orders_shipping_address: data.order.orders_shipping_address ?? "N/A",
      product_name:data.order.product_name,
      product_quantity:data.order.product_quantity
    });

    // PAYMENT
    setPayment({
      payment_id: data.payment.payment_id,
      transaction_id: data.payment.transaction_id,
      payment_amount: data.payment.payment_amount,
      payment_method: data.payment.payment_method,
      payment_status: data.payment.payment_status,
    });

    // DISCOUNT
    setDiscount({
      product_discount_name: data.product_discount.product_discount_name,
      product_discount_value: data.product_discount.product_discount_value,
      product_actual_price: data.product_discount.product_actual_price,
      product_discounted_price: data.product_discount.product_discounted_price,
    });

    // SHIPPING
    setShipping({
      charge_base_amount: data.shipping_charge.charge_base_amount,
      applied_charge_value: data.shipping_charge.applied_charge_value,
      total_after_shipping: data.shipping_charge.total_after_shipping,
    });

    // INVOICE
    setInvoice({
      invoice_number: data.invoice.invoice_number,
      invoice_date: data.invoice.invc_CrtdAt,
      Invoice_total_amount: data.invoice.invoice_total_amount,
      gst_amount: data.invoice.gst_amount,
      total_gst_amount:data.invoice.total_gst_amount
    });

  } catch (error) {
    console.error("Failed to fetch order details", error);
  }
};

  

  

  

  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "order") setOrder({ ...order, [name]: value });
    if (section === "payment") setPayment({ ...payment, [name]: value });
    if (section === "discount") setDiscount({ ...discount, [name]: value });
    if (section === "shipping") setShipping({ ...shipping, [name]: value });
    if (section === "invoice") setInvoice({ ...invoice, [name]: value });
  };

  const handleSearch = (e) => {
      e.preventDefault();
      // Search is handled by the useMemo hook
    };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Invoice Details", 14, y);
    y += 10;

    const data = [
      ["Invoice Number", invoice.invoice_number],
      ["Invoice Date", invoice.invoice_date],
      ["GST Amount", invoice.gst_amount],
      ["Invoice Total", invoice.Invoice_total_amount],
      ["Order ID", order.order_id],
      ["Order Total Amount", order.order_total_amount],
      ["Order Status", order.order_status],
      ["Payment Method", payment.payment_method],
      ["Payment Status", payment.payment_status],
      ["Discount Name", discount.product_discount_name],
      ["Discount Value", discount.product_discount_value],
      ["Shipping Base Charge", shipping.charge_base_amount],
      ["Applied Shipping Charge", shipping.applied_charge_value],
      ["Total After Shipping", shipping.total_after_shipping],
      ["Shipping Address", order.Orders_shipping_address],
    ];

    doc.setFontSize(12);
    data.forEach(([field, value]) => {
      doc.text(`${field}:`, 14, y);
      doc.text(String(value), 80, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${invoice.invoice_number}.pdf`);
    setMessage("✅ PDF generated successfully with latest invoice data!");
  };

  // Edit functionality
  const handleEditToggle = () => {
    setIsEditable(!isEditable);
    setMessage(isEditable ? "✏️ Edit mode disabled." : "✏️ Edit mode enabled.");
  };

  // Deactivate functionality
  const handleDeactivate = () => {
    setIsDeactivated(true);
    setIsEditable(false);
    setMessage("⚠️ Order has been deactivated successfully!");
  };

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
          Order Details & Invoice
        </h2>

          {/* Center: Search Bar */}
    {/* <div
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
    </div> */}
      </div>

      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}

                         style={{marginTop:"6px"}}

      >
        {/* Order Section */}
        <h5 className="fw mb-3">Order Information</h5>
        <div className="row">
          {[
            
            ["order_id", "Order ID"],
            ["product_name", "Product Name"],
            ["product_quantity", "Quantity"],
            ["order_total_amount", "Product Total (₹)"],
            ["order_status", "Status"],
            ["order_date", "Created Date"],
          

          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
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
                value={order[key]}
                onChange={(e) => handleChange(e, "order")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <hr />
        <h5 className="fw mb-3">Payment Details</h5>
        <div className="row">
          {[
            ["payment_id", "Payment ID"],
            ["transaction_id", "Transaction ID"],
            ["payment_amount", "Payment Amount (₹)"],
            ["payment_method", "Payment Method"],
            ["payment_status", "Payment Status"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
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
                value={payment[key]}
                onChange={(e) => handleChange(e, "payment")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Discount Section */}
        {/* <hr /> */}
        {/* <h5 className="fw mb-3">Discount Information</h5> */}
        {/* <div className="row">
          {[
            ["product_discount_name", "Discount Name"],
            ["product_discount_value", "Discount Value (%)"],
            ["product_actual_price", "Actual Price (₹)"],
            ["product_discounted_price", "Discounted Price (₹)"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
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
                value={discount[key]}
                onChange={(e) => handleChange(e, "discount")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div> */}

        {/* Shipping Section */}
        {/* <hr /> */}
        {/* <h5 className="fw mb-3">Shipping Charges</h5> */}
        {/* <div className="row">
          {[
            ["charge_base_amount", "Base Charge (₹)"],
            ["applied_charge_value", "Applied Charge (₹)"],
            ["total_after_shipping", "Total After Shipping (₹)"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
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
                value={shipping[key]}
                onChange={(e) => handleChange(e, "shipping")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div> */}

        {/* Invoice Section */}
        <hr />
        <h5 className="fw mb-3">Invoice Details</h5>
        <div className="row">
          {[
            ["invoice_number", "Invoice Number"],
            ["invoice_date", "Invoice Date"],
            ["Invoice_total_amount", "Total Invoice Amount (₹)"],
            ["total_gst_amount", "GST Amount (₹)"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
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
                value={invoice[key]}
                onChange={(e) => handleChange(e, "invoice")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-4 d-flex justify-content-end gap-3">
          {/* <button
            type="button"
            onClick={handleEditToggle}
            className="btn btn-primary fw-bold px-4 py-2 rounded-3"
            disabled={isDeactivated}
          >
            {isEditable ? "Submit" : "Edit"}
          </button> */}

         <Link to="/orders-list">
                               <button
                               type="button"
                               className="btn btn-primary fw-bold px-4 py-2 rounded-3"
                             >
                              Back
                             </button>
                             </Link>

          <button
            type="button"
            onClick={handleGeneratePDF}
            className="btn btn-warning text-black fw-bold px-4 py-2 rounded-3"
            disabled={isDeactivated}
          >
            Get Invoice
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

export default OrderDetails;

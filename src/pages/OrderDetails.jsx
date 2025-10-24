import React, { useState } from "react";
import jsPDF from "jspdf";

const OrderDetails = () => {
  // Hardcoded demo data for testing
  const [order, setOrder] = useState({
    order_id: "ORD12345",
    user_id: "USR789",
    payment_id: "PAY567",
    shipping_id: "SHP890",
    order_total_amount: "2500",
    order_status: "Delivered",
    Orders_payment_status: "Paid",
    Orders_shipping_address: "221B Baker Street, London, UK",
    order_date: "2025-10-23",
  });

  const [payment, setPayment] = useState({
    payment_id: "PAY567",
    transaction_id: "TXN987654321",
    payment_amount: "2500",
    payment_method: "Credit Card",
    payment_status: "Success",
  });

  const [discount, setDiscount] = useState({
    product_discount_name: "Festive Sale",
    product_discount_value: "10%",
    product_actual_price: "2800",
    product_discounted_price: "2520",
  });

  const [shipping, setShipping] = useState({
    charge_base_amount: "100",
    applied_charge_value: "50",
    total_after_shipping: "2570",
  });

  const [invoice, setInvoice] = useState({
    invoice_number: "INV-2025-1001",
    invoice_date: "2025-10-24",
    Invoice_total_amount: "2570",
    gst_amount: "230",
  });

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
          Order Details & Invoice
        </h2>
      </div>

      <div className={`card shadow-sm p-4 ${isDeactivated ? "opacity-50" : ""}`}>
        {/* Order Section */}
        <h5 className="fw mb-3">Order Information</h5>
        <div className="row">
          {[
            ["order_id", "Order ID"],
            ["user_id", "User ID"],
            ["order_total_amount", "Order Total (₹)"],
            ["order_status", "Order Status"],
            ["Orders_payment_status", "Payment Status"],
            ["Orders_shipping_address", "Shipping Address"],
            ["order_date", "Order Date"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              <input
                type="text"
                name={key}
                className="form-control"
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
                value={payment[key]}
                onChange={(e) => handleChange(e, "payment")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Discount Section */}
        <hr />
        <h5 className="fw mb-3">Discount Information</h5>
        <div className="row">
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
                value={discount[key]}
                onChange={(e) => handleChange(e, "discount")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Shipping Section */}
        <hr />
        <h5 className="fw mb-3">Shipping Charges</h5>
        <div className="row">
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
                value={shipping[key]}
                onChange={(e) => handleChange(e, "shipping")}
                readOnly={!isEditable || isDeactivated}
              />
            </div>
          ))}
        </div>

        {/* Invoice Section */}
        <hr />
        <h5 className="fw mb-3">Invoice Details</h5>
        <div className="row">
          {[
            ["invoice_number", "Invoice Number"],
            ["invoice_date", "Invoice Date"],
            ["Invoice_total_amount", "Total Invoice Amount (₹)"],
            ["gst_amount", "GST Amount (₹)"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label fw-semibold">{label}</label>
              <input
                type="text"
                name={key}
                className="form-control"
                value={invoice[key]}
                onChange={(e) => handleChange(e, "invoice")}
                readOnly={!isEditable || isDeactivated}
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
            {isEditable ? "Save Changes" : "Edit"}
          </button>

          <button
            type="button"
            onClick={handleDeactivate}
            className={`fw-bold px-4 py-2 rounded-3 btn ${
              isDeactivated ? "btn-secondary" : "btn-danger"
            }`}
            disabled={isDeactivated}
          >
            {isDeactivated ? "Deactivated" : "Deactivate"}
          </button>

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

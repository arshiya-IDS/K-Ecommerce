import React from 'react';
import { IoIosArrowBack } from "react-icons/io";

const EnquiryForm = () => {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="container-fluid px-0 mt-0 p-3">
            <div className='d-flex justify-content-between align-items-center mb-1'>
                <button onClick={handleBack} className="btn btn-primary">
                    <IoIosArrowBack />
                </button>
                <h4 className='title-for-main-head mb-0 mt-0 d-flex justify-content-center w-100'>
                    New Enquiry Form
                </h4>
            </div>

            <div className='p-3' style={{ border: '1px solid #dee2e6', backgroundColor: 'white', borderRadius: '8px' }}>
                <form>
                    {/* Full Name & Contact */}
                    <div className="row mb-3">
                        <div className="col-6 d-flex align-items-center">
                            <label className="me-2" style={{ width: '23%' }}>Full Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter full name"
                                style={{ border: '1px solid #dee2e6' }}
                            />
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <label className="me-2" style={{ width: '23%' }}>Contact No:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter 10-digit mobile number"
                                style={{ border: '1px solid #dee2e6' }}
                                maxLength="10"
                            />
                        </div>
                    </div>

                    {/* Location & Email */}
                    <div className="row mb-3">
                        <div className="col-6 d-flex align-items-center">
                            <label className="me-2" style={{ width: '23%' }}>Location:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter location"
                                style={{ border: '1px solid #dee2e6' }}
                            />
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <label className="me-2" style={{ width: '23%' }}>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email address"
                                style={{ border: '1px solid #dee2e6' }}
                            />
                        </div>
                    </div>

                    {/* Message & Category */}
                    <div className="row mb-3">
                        <div className="col-6 d-flex align-items-center">
                            <label className="me-2" style={{ width: '23%' }}>Message:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter message (optional)"
                                style={{ border: '1px solid #dee2e6' }}
                            />
                        </div>
                        <div className="col-6 d-flex align-items-center">
                            <label className="me-2" style={{ width: '23%' }}>Category:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter category"
                                style={{ border: '1px solid #dee2e6' }}
                            />
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="agreeToTerms"
                                />
                                <label className="form-check-label" htmlFor="agreeToTerms">
                                    I agree to all terms and conditions
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn btn-primary mt-3">
                        Submit Enquiry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnquiryForm;

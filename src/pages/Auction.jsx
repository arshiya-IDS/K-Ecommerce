import React, { useState } from 'react';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const Auction = () => {
  // Sample data for auctions
  const [auctions] = useState([
    {
      id: 1,
      startDate: '2022-06-07T00:00',
      endDate: '2022-06-07T00:00',
      biddingAmount: '$99',
      maxBid: '500',
      image: ''
    },
    {
      id: 2,
      startDate: '2022-06-07T00:00',
      endDate: '2022-06-07T00:00',
      biddingAmount: '$99',
      maxBid: '500',
      image: ''
    },
    {
      id: 3,
      startDate: '2022-06-07T00:00',
      endDate: '2022-06-07T00:00',
      biddingAmount: '$99',
      maxBid: '500',
      image: ''
    },
    {
      id: 4,
      startDate: '2022-06-07T00:00',
      endDate: '2022-06-07T00:00',
      biddingAmount: '$99',
      maxBid: '500',
      image: ''
    }
  ]);

  return (
    <div className="container p-5">
      <div className="row">
        <div className="category-table pt-3 px-3 mb-5">
          <div className="category-1-heading d-flex justify-content-between bg-success rounded-top" style={{backgroundColor:'#198754'}}>
            <h4 className="py-2 pl-3 text-white p-4">Auctions</h4>
            <button className="btn craete-category-btn" id="create-modal-btn-open">Create New</button>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="btn-group mb-3 mt-3">
                <button type="button" className="btn btn-secondary">Exel</button>
                <button type="button" className="btn btn-secondary">PDF</button>
                <button type="button" className="btn btn-secondary">PDF</button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group d-flex justify-content-end w-100 mb-2 mt-3" style={{margin: '43px'}}>
                <div className="form-outline" style={{width: '70%'}}>
                  <input type="search" placeholder="Search ...." id="form1" className="form-control" />
                </div>
                <button type="button" className="btn btn-serch">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="user-align" style={{overflow: 'auto'}}>
            <table id="create-table">
              <thead>
                <tr>
                  <th className="admin-category-sub-heading">Start Date & Time</th>
                  <th className="admin-category-sub-heading">End Date & Time</th>
                  <th className="admin-category-sub-heading">Bidding Amount</th>
                  <th className="admin-category-sub-heading">Maximum bid</th>
                  <th className="admin-category-sub-heading">Bid Images</th>
                  <th className="admin-category-sub-heading sticky-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {auctions.map((auction) => (
                  <tr key={auction.id}>
                    <td className="admin-category-option">
                      <input 
                        type="datetime-local" 
                        id={`meeting-times-${auction.id}`} 
                        className="form-control" 
                        name="meeting-time" 
                        value={auction.startDate} 
                        onChange={() => {}} 
                      />
                    </td>
                    <td className="admin-category-option">
                      <input 
                        type="datetime-local" 
                        id={`meeting-timess-${auction.id}`} 
                        className="form-control" 
                        name="meeting-time" 
                        value={auction.endDate} 
                        onChange={() => {}} 
                      />
                    </td>
                    <td className="admin-category-option text-center">
                      <div className="admin-category-images">{auction.biddingAmount}</div>
                    </td>
                    <td className="admin-category-option text-center">
                      <div className="admin-category-images">{auction.maxBid}</div>
                    </td>
                    <td className="admin-category-option">
                      <div className="admin-category-images">
                        <img src={auction.image} alt="Auction Image" />
                      </div>
                    </td>
                    <td className="sticky-action">
                      <a href="#" className="btn btn-sm btn-outline-info" id={`auction-edit-modal-btn-open-${auction.id}`}>
                        <FaEdit size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-success" id={`view-modal-btn-open-${auction.id}`}>
                        <FaEye size={18} />
                      </a>
                      <a href="#" className="btn btn-sm btn-outline-danger" id={`auction-delete-modal-btn-open-${auction.id}`}>
                        <FaTrash size={18} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mt-3">
                <strong>Showing 1 to {auctions.length} of {auctions.length} entries</strong>
              </div>
            </div>
            <div className="col-md-6">
              <nav aria-label="Page navigation">
                <ul className="pagination d-flex justify-content-end w-100 mt-3">
                  <li className="page-item" aria-current="page">
                    <a className="page-link" href="#">Previous <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Page 1</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
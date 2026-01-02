import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleRight } from 'react-icons/fa';

const Dashboard = () => {
  // Dashboard boxes data
  const dashboardBoxes = [
    {
      id: 'Current Month Total Sale',
      title: 'Current Month  Sale',
      description: 'Current Month Total Sale',
      backgroundColor: '#4be891',
      iconBackgroundColor: '#37b56f',
      link: '/userlist'
    },
    {
      id: 'enquiry',
      title: 'Enquiry',
      description: 'Enquiry Management',
      backgroundColor: '#5479bb',
      iconBackgroundColor: '#7694cb',
      link: '/enquiry'
    },
    {
      id: 'misreport',
      title: 'MIS Report',
      description: 'MIS Report Management',
      backgroundColor: 'burlywood',
      iconBackgroundColor: '#cf9c5a',
      link: '/misreport'
    },
   
  ];

  return (
    <div className="container px-1">
      <div className="row ">
        {dashboardBoxes.map((box) => (
          <div className="col-md-3 " style={{marginTop:'2rem'}} key={box.id}>
            <div className="admin-box" style={{backgroundColor: box.backgroundColor, padding: '1rem', borderRadius: '0.5rem', marginBottom: '0.5rem'}}>
              <div className="inner-box">
                <h4 className="pl-2 text-white font-weight-bold">{box.title}</h4>
                <p className="pl-2 text-white">{box.description}</p>
                <div className="admin-icons d-flex justify-content-between p-2" style={{backgroundColor: box.iconBackgroundColor, marginLeft: '-1rem', marginRight: '-1rem', marginBottom: '-1rem'}}>
                  <Link className="text-white text-decoration-none" to={box.link}>More info</Link>
                  <Link to={box.link}><FaArrowCircleRight size={24} className="text-white" /></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="foot" style={{background: 'linear-gradient(148deg, #ff5441, #294b8f)', marginTop: '4rem', padding: '1rem 0'}}>
        <p className="pt-3 pl-5 text-white">Copyright © 2021-2030 <strong className="text-dark">SSK PROJECT</strong>. All rights reserved.</p>
      </div> */}
    </div>
  );
};

export default Dashboard;
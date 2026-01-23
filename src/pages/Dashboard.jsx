import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleRight } from 'react-icons/fa';
import axios from 'axios';
import api from "../api/axiosInstance";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSale: 0,
    totalRegistrations: 0,
    totalOrders: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          registrationsRes,
          currentMonthSaleRes,
          totalOrdersRes
        ] = await Promise.all([
          api.get('/Auth/total-registrations'),
          api.get('/OrderItem/CurrentMonthPaidOrderTotal'),
          api.get('/OrderItem/TotalConfirmedPaidOrderCount')
        ]);

        setDashboardData({
          totalRegistrations: registrationsRes.data.totalRegistrations,
          totalSale: currentMonthSaleRes.data.total_order_amount,
          totalOrders: totalOrdersRes.data.total_orders
        });

      } catch (error) {
        console.error('Dashboard API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardBoxes = [
    {
      id: 'sale',
      title: 'Current Month Sale',
      value: `₹ ${dashboardData.totalSale}`,
      description: 'Total Sale This Month',
      backgroundColor: '#4be891',
      iconBackgroundColor: '#37b56f',
      link: '/orders-list'
    },
    {
      id: 'users',
      title: 'Registered Users',
      value: dashboardData.totalRegistrations,
      description: 'Total Registered Users',
      backgroundColor: '#5479bb',
      iconBackgroundColor: '#7694cb',
      link: '/userlist'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: dashboardData.totalOrders,
      description: 'Confirmed Paid Orders',
      backgroundColor: 'burlywood',
      iconBackgroundColor: '#cf9c5a',
      link: '/orders-list'
    }
  ];

  return (
    <div className="container px-1">
      <div className="row">
        {dashboardBoxes.map((box) => (
          <div className="col-md-3" style={{ marginTop: '2rem' }} key={box.id}>
            <div
              className="admin-box"
              style={{
                backgroundColor: box.backgroundColor,
                padding: '1rem',
                borderRadius: '0.5rem'
              }}
            >
              <div className="inner-box">
                <h5 className="pl-2 text-white font-weight-bold">
                  {box.title}
                </h5>

                <h2 className="pl-2 text-white font-weight-bold">
                  {loading ? '...' : box.value}
                </h2>

                <p className="pl-2 text-white">{box.description}</p>

                <div
                  className="admin-icons d-flex justify-content-between p-2"
                  style={{
                    backgroundColor: box.iconBackgroundColor,
                    marginLeft: '-1rem',
                    marginRight: '-1rem',
                    marginBottom: '-1rem'
                  }}
                >
                  <Link className="text-white text-decoration-none" to={box.link}>
                    More info
                  </Link>
                  <Link to={box.link}>
                    <FaArrowCircleRight size={24} className="text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

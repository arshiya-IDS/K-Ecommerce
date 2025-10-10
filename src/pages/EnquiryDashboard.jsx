import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { FaChartBar, FaChartPie, FaChartLine } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const EnquiryDashboard = () => {
  // Sample data for enquiries
  const [enquiries] = useState([
    {
      id: 1,
      enquiryId: 'ENQ001',
      status: 'Pending',
      createdAt: '07-06-2022',
      fullName: 'John Doe',
      contactNo: '+91 50123 14567',
      category: 'Product Inquiry',
      location: 'Dubai, UAE',
      email: 'john@example.com'
    },
    {
      id: 2,
      enquiryId: 'ENQ002',
      status: 'Resolved',
      createdAt: '08-06-2022',
      fullName: 'Jane Smith',
      contactNo: '+91 50123 14567',
      category: 'Support Request',
      location: 'Abu Dhabi, UAE',
      email: 'jane@example.com'
    },
    {
      id: 3,
      enquiryId: 'ENQ003',
      status: 'In Progress',
      createdAt: '09-06-2022',
      fullName: 'Robert Johnson',
      contactNo: '+91 50123 14567',
      category: 'Feedback',
      location: 'Sharjah, UAE',
      email: 'robert@example.com'
    },
    {
      id: 4,
      enquiryId: 'ENQ004',
      status: 'Pending',
      createdAt: '10-06-2022',
      fullName: 'Sarah Wilson',
      contactNo: '+91 50123 14567',
      category: 'Product Inquiry',
      location: 'Ajman, UAE',
      email: 'sarah@example.com'
    },
    {
      id: 5,
      enquiryId: 'ENQ005',
      status: 'Resolved',
      createdAt: '11-06-2022',
      fullName: 'Michael Brown',
      contactNo: '+91 50123 14567',
      category: 'Support Request',
      location: 'Dubai, UAE',
      email: 'michael@example.com'
    },
    {
      id: 6,
      enquiryId: 'ENQ006',
      status: 'Pending',
      createdAt: '12-06-2022',
      fullName: 'Emily Davis',
      contactNo: '+91 50123 14567',
      category: 'Feedback',
      location: 'Abu Dhabi, UAE',
      email: 'emily@example.com'
    },
    {
      id: 7,
      enquiryId: 'ENQ007',
      status: 'In Progress',
      createdAt: '13-06-2022',
      fullName: 'David Wilson',
      contactNo: '+91 50123 14567',
      category: 'Product Inquiry',
      location: 'Sharjah, UAE',
      email: 'david@example.com'
    },
    {
      id: 8,
      enquiryId: 'ENQ008',
      status: 'Resolved',
      createdAt: '14-06-2022',
      fullName: 'Sophia Miller',
      contactNo: '+91 50123 14567',
      category: 'Support Request',
      location: 'Ajman, UAE',
      email: 'sophia@example.com'
    }
  ]);

  // ✅ Sort enquiries in descending order by createdAt
  const sortedEnquiries = useMemo(() => {
    return [...enquiries].sort((a, b) => {
      const [da, ma, ya] = a.createdAt.split('-').map(Number);
      const [db, mb, yb] = b.createdAt.split('-').map(Number);
      return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da); // DESC
    });
  }, [enquiries]);

  // Chart data (status)
  const statusData = useMemo(() => {
    const statusCount = {};
    sortedEnquiries.forEach(enquiry => {
      statusCount[enquiry.status] = (statusCount[enquiry.status] || 0) + 1;
    });

    return {
      labels: Object.keys(statusCount),
      datasets: [
        {
          label: 'Enquiries by Status',
          data: Object.values(statusCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [sortedEnquiries]);

  // Chart data (category)
  const categoryData = useMemo(() => {
    const categoryCount = {};
    sortedEnquiries.forEach(enquiry => {
      categoryCount[enquiry.category] = (categoryCount[enquiry.category] || 0) + 1;
    });

    return {
      labels: Object.keys(categoryCount),
      datasets: [
        {
          label: 'Enquiries by Category',
          data: Object.values(categoryCount),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [sortedEnquiries]);

  // Chart data (location)
  const locationData = useMemo(() => {
    const locationCount = {};
    sortedEnquiries.forEach(enquiry => {
      const city = enquiry.location.split(',')[0];
      locationCount[city] = (locationCount[city] || 0) + 1;
    });

    return {
      labels: Object.keys(locationCount),
      datasets: [
        {
          label: 'Enquiries by Location',
          data: Object.values(locationCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [sortedEnquiries]);

  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Enquiry Distribution',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Enquiry Statistics',
      },
    },
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h4 className="py-2 pl-3 text-center p-4 mb-0" style={{ color: '#645959' }}>Enquiry Dashboard</h4>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-white mb-3 shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="bg-primary rounded d-flex align-items-center justify-content-center chart-icon-container" style={{ width: '50px', height: '50px' }}>
                <FaChartBar size={20} color="white" />
              </div>
              <div>
                <p className="text-muted mb-1">Total Enquiries</p>
                <h5 className="card-title">{sortedEnquiries.length}</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white mb-3 shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="bg-success rounded d-flex align-items-center justify-content-center chart-icon-container" style={{ width: '50px', height: '50px' }}>
                <FaChartPie size={20} color="white" />
              </div>
              <div>
                <p className="text-muted mb-1">Resolved</p>
                <h5 className="card-title">
                  {sortedEnquiries.filter(e => e.status === 'Resolved').length}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white mb-3 shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div className="bg-warning rounded d-flex align-items-center justify-content-center chart-icon-container" style={{ width: '50px', height: '50px' }}>
                <FaChartLine size={20} color="white" />
              </div>
              <div>
                <p className="text-muted mb-1">Pending</p>
                <h5 className="card-title">
                  {sortedEnquiries.filter(e => e.status === 'Pending').length}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-white mb-3 shadow">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div className="bg-info rounded d-flex align-items-center justify-content-center chart-icon-container" style={{ width: '50px', height: '50px' }}>
                  <FaChartBar size={20} color="white" />
                </div>
              <div>
                <p className="text-muted mb-1">In Progress</p>
                <h5 className="card-title">
                  {sortedEnquiries.filter(e => e.status === 'In Progress').length}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Enquiries by Status</h5>
              <Pie 
                data={statusData} 
                options={pieOptions} 
                style={{ height: '20px', width: '20px' }} 
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Enquiries by Category</h5>
              <Bar data={categoryData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Enquiries by Location</h5>
              <Bar data={locationData} options={barOptions} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Enquiry Trends</h5>
              <Line 
                data={{
                  labels: sortedEnquiries.map(e => e.createdAt),
                  datasets: [
                    {
                      label: 'Enquiries Over Time',
                      data: sortedEnquiries.map((_, index) => index + 1),
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }
                  ]
                }} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Enquiry Trends',
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDashboard;

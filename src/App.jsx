import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import User from './pages/User';
import Userlist from './pages/Userlist';
import Product from './pages/Product';
import Auction from './pages/Auction';
import Subscription from './pages/Subscription';
import Content from './pages/Content';
import Enquiry from './pages/Enquiry';
import EnquiryDashboard from './pages/EnquiryDashboard';
import MisReport from './pages/MisReport';
import Login from './pages/Login';
import EnquiryDetails from './pages/EnquiryDetails';
import EnquiryForm from './pages/EnquiryForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="user" element={<User />} />
          <Route path="userlist" element={<Userlist />} />
          <Route path="product" element={<Product />} />
          <Route path="auction" element={<Auction />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="content" element={<Content />} />
          <Route path="enquiry" element={<Enquiry />} />
          <Route path="enquiry-dashboard" element={<EnquiryDashboard />} />
          <Route path="enquiry/:id" element={<EnquiryDetails />} />
          <Route path="enquiry-form" element={<EnquiryForm />} />
          <Route path="misreport" element={<MisReport />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import User from './pages/User';
import Userlist from './pages/Userlist';
import Product from './pages/Product';
import UserDiscount from './pages/UserDiscount';
import ProductCreate from './pages/productcreate';
import ProductDiscount from './pages/ProductDiscount';
import ShippingCharges from './pages/ShippingCharges';
import Auction from './pages/Auction';
import Subscription from './pages/Subscription';
import Content from './pages/Content';
import Enquiry from './pages/Enquiry';
import EnquiryDashboard from './pages/EnquiryDashboard';
import MisReport from './pages/MisReport';
import Login from './pages/Login';
import EnquiryDetails from './pages/EnquiryDetails';
import EnquiryForm from './pages/EnquiryForm';
import ProductList from './pages/ProductList';
import ProductDiscountList from './pages/ProductDiscountList';
import UserDiscountList from './pages/UserDiscountList';
import ShippingChargesList from './pages/ShippingChargesList';

function App() {
  return (
   <Router>
      <Routes>

        {/* 🔹 Public Login Route */}
        <Route path="/" element={<Login />} />

        {/* 🔹 Dashboard Layout Wrapping All Internal Pages */}
        <Route element={<DashboardLayout />}>
          {/* Dashboard Home */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Main Sections */}
          <Route path="/category" element={<Category />} />
          <Route path="/user" element={<User />} />
          <Route path="/userlist" element={<Userlist />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product-create" element={<ProductCreate />} />
          <Route path="/product-discount" element={<ProductDiscount/>}/>
          <Route path="/user-discount" element={<UserDiscount/>}/>
          <Route path="/product-list" element={<ProductList/>}/>
          <Route path="/product-discount-list" element={<ProductDiscountList/>}/>
          <Route path="/user-discount-list" element={<UserDiscountList/>}/>
          <Route path="/shipping-charges" element={<ShippingCharges/>}/>
          <Route path="/shipping-charges-list" element={<ShippingChargesList/>}/>
          <Route path="/auction" element={<Auction />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/content" element={<Content />} />

          {/* Enquiry Related */}
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/enquiry-dashboard" element={<EnquiryDashboard />} />
          <Route path="/enquiry/:id" element={<EnquiryDetails />} />
          <Route path="/enquiry-form" element={<EnquiryForm />} />

          {/* Reports */}
          <Route path="/misreport" element={<MisReport />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
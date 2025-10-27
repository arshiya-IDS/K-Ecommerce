import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Category from './pages/Category';
import User from './pages/User';
import Userlist from './pages/Userlist';
import Product from './pages/Product';
import UserDiscount from './pages/UserDiscount';
import ProductCreate from './pages/ProductCreate';
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
import OrdersList from './pages/OrdersList';
import CategoryList from './pages/CategoryList';
import ManageCategories from './pages/ManageCategories';
import NotificationTemplateList from './pages/NotificationTemplateList';
import NotificationTemplateCreate from './pages/NotificationTemplateCreate';
import OrderDetails from './pages/OrderDetails';
import SubCategoryList from './pages/SubCategoryList';
import ManageSubCategories from './pages/ManageSubCategories';
import ProductDetails from './pages/ProductDetails';
import ProductDiscountDetails from './pages/ProductDiscountDetails';
import UserDiscountDetails from './pages/UserDiscountDetails';
import ShippingChargesDetails from './pages/ShippingChargesDetails';
import CategoryDetails from './pages/CategoryDetails';
import SubCategoryDetails from './pages/SubCategoryDetails';
import NotificationTemplateDetails from './pages/NotificationTemplateDetails';

function App() {
  return (
   <Router>
      <Routes>

        {/* 🔹 Public Login Route */}
        <Route path="/" element={<Dashboard/>} />

        {/* 🔹 Dashboard Layout Wrapping All Internal Pages */}
        <Route element={<DashboardLayout />}>
          {/* Dashboard Home */}
          <Route path="/login" element={<Login />} />

          {/* Main Sections */}
          <Route path="/category" element={<Category />} />
          <Route path="/user" element={<User />} />
          <Route path="/userlist" element={<Userlist />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product-create" element={<ProductCreate />} />
          <Route path="/product-discount" element={<ProductDiscount/>}/>
          <Route path="/user-discount" element={<UserDiscount/>}/>
          <Route path="/product-list" element={<ProductList/>}/>
          <Route path="/orders-list" element={<OrdersList/>}/>
          <Route path="/category-list" element={<CategoryList/>}/>
          <Route path="/product-details" element={<ProductDetails/>}/>
          <Route path="/notification-list" element={<NotificationTemplateList/>}/>
          <Route path="/order-details" element={<OrderDetails/>}/>
          <Route path="/product-discount-details" element={<ProductDiscountDetails/>}/>
          <Route path="/user-discount-details" element={<UserDiscountDetails/>}/>
          <Route path="/shipping-charges-details" element={<ShippingChargesDetails/>}/>
          <Route path="/category-details" element={<CategoryDetails/>}/>
          <Route path="/sub-categories-details" element={<SubCategoryDetails/>}/>
          <Route path="/notification-template-details" element={<NotificationTemplateDetails/>}/>
          <Route path="/subcategories-list" element={<SubCategoryList/>}/>
          <Route path="/manage-subcategories" element={<ManageSubCategories/>}/>
          <Route path="/notification-template-create" element={<NotificationTemplateCreate/>}/>
          <Route path="/manage-categories" element={<ManageCategories/>}/>
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
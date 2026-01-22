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
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
   <Router>
      <Routes>

        {/* 🔹 Public Login Route */}
       
  <Route path="/" element={<Login />} />
        {/* 🔹 Dashboard Layout Wrapping All Internal Pages */}
        <Route element={<DashboardLayout />}>
          {/* Dashboard Home */}
         
        
           

<Route
  path="/dashboard"
  element={
    
    <ProtectedRoute><Dashboard /></ProtectedRoute>
      
  
  }
/>

          {/* Main Sections */}
          <Route path="/category" element={ <ProtectedRoute><Category /></ProtectedRoute>} />
          <Route path="/user" element={ <ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/userlist" element={ <ProtectedRoute><Userlist /></ProtectedRoute>} />
          <Route path="/product" element={ <ProtectedRoute><Product /></ProtectedRoute>} />
          <Route path="/product-create" element={  <ProtectedRoute><ProductCreate /></ProtectedRoute>} />
          <Route path="/product-discount" element={<ProtectedRoute><ProductDiscount/></ProtectedRoute>}/>
          <Route path="/user-discount" element={<ProtectedRoute><UserDiscount/></ProtectedRoute>}/>
          <Route path="/product-list" element={<ProtectedRoute><ProductList/></ProtectedRoute>}/>
          <Route path="/orders-list" element={ <ProtectedRoute><OrdersList/></ProtectedRoute>}/>
          <Route path="/category-list" element={<ProtectedRoute><CategoryList/></ProtectedRoute>}/>
          <Route path="/product-details/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/notification-list" element={<ProtectedRoute><NotificationTemplateList/></ProtectedRoute>}/>
          <Route path="/order-details/:id" element={<ProtectedRoute><OrderDetails/></ProtectedRoute>}/>
          <Route path="/product-discount-details/:id" element={<ProtectedRoute><ProductDiscountDetails/></ProtectedRoute>}/>
          <Route path="/user-discount-detail/:id"element={<ProtectedRoute><UserDiscountDetails/></ProtectedRoute>}/>
          <Route path="/notification-template-details/:id" element={<ProtectedRoute><NotificationTemplateDetails/></ProtectedRoute>}/>

          <Route path="/shipping-charges-detail/:id" element={<ProtectedRoute><ShippingChargesDetails/></ProtectedRoute>}/>

          <Route path="/categories/:categoryId" element={<ProtectedRoute><CategoryDetails/></ProtectedRoute>}/>


          <Route path="/subcategories/details/:id" element={<ProtectedRoute><SubCategoryDetails/></ProtectedRoute>}/>
          

          <Route path="/subcategories-list" element={<ProtectedRoute><SubCategoryList/></ProtectedRoute>}/>
          <Route path="/manage-subcategories" element={<ProtectedRoute><ManageSubCategories/></ProtectedRoute>}/>
          <Route path="/notification-template-create" element={<NotificationTemplateCreate/>}/>
          <Route path="/manage-categories" element={<ProtectedRoute><ManageCategories/></ProtectedRoute>}/>
          <Route path="/product-discount-list" element={<ProtectedRoute><ProductDiscountList/></ProtectedRoute>}/>
          <Route path="/user-discount-list" element={<ProtectedRoute><UserDiscountList/></ProtectedRoute>}/>
          <Route path="/shipping-charges" element={<ProtectedRoute><ShippingCharges/></ProtectedRoute>}/>
          <Route path="/shipping-charges-list" element={<ProtectedRoute><ShippingChargesList/></ProtectedRoute>}/>

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
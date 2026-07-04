import { useState } from 'react'
import Layout from './Layout'
import './App.css'
import Home from './components/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Event from './components/Event'
import Events from './components/Events'
import Details from './components/Details'
import {BrowserRouter as Router, Route, Routes,useLocation } from 'react-router-dom'//npm i react-router-dom
import Contactus from './components/Contactus'
import Account from './components/Account'
import Changepass from './components/Changepass'
import Changedetail from './components/Changedetail'
import Register from './components/Register';
import Signin from './components/Signin'
import Gallary from './components/Gallary'
import Forgetpass from './components/Forgetpass'
import Booking from './components/Booking'
import ResetPassword from './components/ResetPassword'

import AdminLayout from './components/admin/AdminLayout'
import { Dashbord } from './components/admin/Dashbord'
import Adminlogin from './components/admin/Adminlogin'
import A_userlist from './components/admin/A_userlist'
import A_Addevent from './components/admin/A_Addevent'
import A_Addcategory from './components/admin/A_Addcategory'
import A_Bookinglist from './components/admin/A_Bookinglist'
import A_Addgallary from './components/admin/A_Addgallary'
import A_Contactlist from './components/admin/A_Contactlist'
import  A_Profile  from './components/admin/A_Profile'
import A_Personaldetail from './components/admin/A_Personaldetail'
import A_Changepassword from './components/admin/A_Changepasssword'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import A_Addaboutus from './components/admin/A_Addaboutus'
import A_Addmenu from './components/admin/A_Addmenu'

function AppContent() {
    const location = useLocation();


     // Footer Hide Pages
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forget" ||
    location.pathname === "/resetpassword" ||
    location.pathname.startsWith("/admin"); //all the admin pages included in this 
    
  
  return (
    <>
  
  
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route path="" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/event" element={<Event/>}/>
      <Route path="/events/:categ" element={<Events/>}/>
      <Route path="/details/:id" element={<Details/>}/>
      <Route path="/contectus" element={<Contactus/>}/>
      <Route path="/account" element={<Account/>}/>
      <Route path='/changepass' element={<Changepass/>}/>
      <Route path="/changedetail" element={<Changedetail/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Signin/>}/>
      <Route path="/gallary" element={<Gallary/>}/>
      <Route path="/forget" element={<Forgetpass/>}/>
      <Route path="/booking" element={<Booking/>}/>
      <Route path='/resetpassword' element={<ResetPassword/>}/>
     </Route>

      <Route path="/admin/adminlogin" element={<Adminlogin/>}/>
            
          <Route path='/admin' element={<AdminLayout/>}>
           <Route index element={<Dashbord />} />
           <Route path='userlist' element={<A_userlist/>}/> 
           <Route path='addevent' element={<A_Addevent/>}/>  
           <Route path='addmenu' element={<A_Addmenu/>}/>  
           <Route path='addcategory' element={<A_Addcategory/>}/>  
            <Route path='addgallary' element={<A_Addgallary/>}/>
            <Route path='addaboutus' element={<A_Addaboutus/>}/>
          <Route path='contactlist' element={<A_Contactlist/>}/>
          <Route path='bookinglist' element={<A_Bookinglist/>}/>

          <Route path='profile/'  element={<A_Profile/>}>
              <Route path='' element={<A_Personaldetail/>}/>
              <Route path='changepass' element={<A_Changepassword/>}/>
          </Route>
      </Route>

        
       
    </Routes>
   
     {!hideFooter && <Footer />}
   
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App;


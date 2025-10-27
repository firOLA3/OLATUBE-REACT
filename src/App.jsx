import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';
import SignUpPage from './Components/SignUpPage';
import LogoAnimationPage from './Components/LogoAnimationPage';
import { Formik } from 'formik';
import Form from './Components/Form';
import SignInPage from './Components/SignInPage';
import UserInfo from './Pages/UserInfo/UserInfo';
import NotFound from './Pages/NotFound';
import InDevelopment from './Pages/InDevelopment';


const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [category, setCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();

  
  const hideNavbarPaths = ['/', '/signup', '/signin' , '*' , '/indevelopment'];

  
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
     
      {shouldShowNavbar && <Navbar setSidebar={setSidebar} setSearchQuery={setSearchQuery} searchQuery={searchQuery} />}
      
      <Routes>
        <Route path='/' element={<LogoAnimationPage />} />
        <Route path='/home' element={<Home sidebar={sidebar} category={category} setCategory={setCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path='/home/video/:categoryId/:videoId' element={<Video sidebar={sidebar} category={category} setCategory={setCategory} />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/formik' element={<Formik />} />
        <Route path='/form' element={<Form />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/userinfo' element={<UserInfo />} />
        <Route path='/indevelopment' element={<InDevelopment />} />
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  );
};

export default App;

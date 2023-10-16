import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<MainLayout/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
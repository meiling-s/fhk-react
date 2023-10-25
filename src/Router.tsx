import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import CollectionPoint from './pages/CollectionPoint';
import CollectionOrder from './pages/CollectionOrder';
import Staff from './pages/Staff';
import Report from './pages/Report';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<MainLayout/>}>
          <Route path="/homepage/collectionpoint" element={<CollectionPoint/>}/>
          <Route path="/homepage/collectionorder" element={<CollectionOrder/>}/>
          <Route path="/homepage/report" element={<Report/>}/>
          <Route path="/homepage/staff" element={<Staff/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
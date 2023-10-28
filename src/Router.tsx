import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CompanyDetails from './pages/TenantRegister/CompanyDetails';
import CompanyContact from './pages/TenantRegister/CompanyContact';
import RegisterResult from './pages/TenantRegister/RegisterResult';
import MainLayout from './layouts/MainLayout';
import CollectionPoint from './pages/Collector/CollectionPoint';
import CollectionOrder from './pages/Collector/CollectionOrder';
import Staff from './pages/Collector/Staff';
import Report from './pages/Collector/Report';
import CompanyManage from './pages/ASTD/CompanyManage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register/details/:inviteID" element={<CompanyDetails />}/>
        <Route path="/register/contact" element={<CompanyContact />}/>
        <Route path="/register/result" element={<RegisterResult />}/>

        <Route element={<MainLayout/>}>
          <Route path="/collector" element={<CollectionPoint/>}/>
          <Route path="/collector/collectionorder" element={<CollectionOrder/>}/>
          <Route path="/collector/report" element={<Report/>}/>
          <Route path="/collector/staff" element={<Staff/>}/> 
        </Route>

        <Route element={<MainLayout/>}>
          <Route path="/astd" element={<CompanyManage/>}/>
          <Route path="/astd/collectionPoint" element={<></>}/>
          <Route path="/astd/collectionorder" element={<></>}/>
          <Route path="/astd/report" element={<></>}/>
          <Route path="/astd/staff" element={<></>}/> 
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default Router;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Auth/Login";
import ResetPassword from "./pages/Auth/ResetPassword";
import ConfirmResetPassword from "./pages/Auth/ConfirmResetPassword";
import ChangePassword from "./pages/Auth/ChangePassword"
//ASTD admin
import CompanyManage from "./pages/ASTD/CompanyManage";


//collection point
import CollectionPoint from "./pages/Collector/CollectionPoint/CollectionPoint/CollectionPoint";
import CreateCollectionPoint from "./pages/Collector/CollectionPoint/CreateCollectionPoint/CreateCollectionPoint";
import EditCollectionPoint from "./pages/Collector/CollectionPoint/EditCollectionPoint/EditCollectionPoint";
//warehouse
import Overview from "./pages/Collector/Manage/CheckoutRequest";
import Settings from "./pages/Collector/Warehouse/Settings";
import Vehicles from "./pages/Collector/Vehicles/Vechicles"
//Tenant Register
// import CompanyDetails from "./pages/TenantRegister/CompanyDetails";
// import CompanyContact from "./pages/TenantRegister/CompanyContact";
import RegisterResult from "./pages/TenantRegister/RegisterResult";
//new tenantpage
import TenantRegister from "./pages/TenantRegister/Register";
// import RegisterStepOne from "./pages/TenantRegister/RegisterStepOne";
// import RegisterStepTwo from "./pages/TenantRegister/RegisterStepTwo";

//general
import Staff from "./pages/Collector/Staff";
//import Report from "./pages/Collector/Report";
import Report from "./pages/Collector/EventRecording/Report";
import RecycleShipment from "./pages/Collector/RecycleShipment";
import RecycleShipmentCheckOut from "./pages/Collector/RecycleShipmentCheckOut";
import ProcessRecord from "./pages/Collector/Manage/ProcessRecord";
import PickupOrder from "./pages/Collector/PickupOrder/PickupOrder";
import CreatePickupOrder from "./pages/Collector/PickupOrder/CreatePickupOrder";
import EditPickupOrder from "./pages/Collector/PickupOrder/EditPickupOrder";

import AuthGuard from "./components/Guards/AuthGuard";
import AutoLogout from "./components/AutoLogout";
import ShipmentManage from "./pages/Collector/RecycleShipment";


const Router = () => {
  
    return (
        <BrowserRouter>
         
            <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<AutoLogout />}>
            <Route element={<AuthGuard />}>
                
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route
                    path="/confirmNewPassword"
                    element={<ConfirmResetPassword />}
                />
                 <Route
                    path="/changePassword/:idReset?"
                    element={<ChangePassword />}
                />
                

        {/* tenant page */}
        {/* <Route
          path="/register/details/:inviteId"
          element={<CompanyDetails />}
        />
        <Route path="/register/contact" element={<CompanyContact />} /> */}
        <Route path="/register/details/:tenantId" element={<TenantRegister />} />
        {/* <Route path="/register/firstStep" element={<RegisterStepOne />} />
        <Route path="/register/secondStep" element={<RegisterStepTwo />} /> */}
        <Route path="/register/result" element={<RegisterResult />} />

        {/* collector admin */}
        <Route element={<MainLayout />}>
          <Route path="/collector" element={<CollectionPoint />} />
          <Route path="/collector/collectionPoint"element={<CollectionPoint />} />
          <Route path="/collector/processRecord" element={<></>} />
          <Route path="/collector/pickupOrder" element={<PickupOrder />} />
          <Route path="/collector/createPickupOrder" element={<CreatePickupOrder/>} />
          <Route path="/collector/editPickupOrder" element={<EditPickupOrder />} />
          <Route path="/collector/shipmentCheckout"element={<RecycleShipmentCheckOut />}/>
          <Route path="/collector/report" element={<Report />} />
          <Route path="/collector/staff" element={<Staff />} />
          <Route path="/collector/createCollectionPoint"element={<CreateCollectionPoint />}/>
          <Route path="/collector/editCollectionPoint" element={<EditCollectionPoint />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/astd" element={<CompanyManage />} />
          <Route path="/astd/company" element={<CompanyManage />} />
          <Route path="/astd/notice" element={<></>} />
          <Route path="/astd/report" element={<></>} />
          <Route path="/astd/statistics/recyclables" element={<></>} />
          <Route path="/astd/statistics/convoy" element={<></>} />
          <Route path="/astd/statistics/recycleCompany" element={<></>} />
          <Route path="/astd/statistics/recyclePlant" element={<></>} />
          <Route path="/astd/setting" element={<Settings />} />
          <Route path="/astd/account" element={<></>} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/warehouse" element={<RecycleShipment />} />
          <Route path="/warehouse/shipment" element={<RecycleShipment />} />
          <Route path="/warehouse/checkout" element={<RecycleShipmentCheckOut />} />
          <Route path="/warehouse/process" element={<ProcessRecord />} />
          <Route path="/warehouse/staff" element={<Staff />} />
          <Route path="/warehouse/settings" element={<Settings />} />
          <Route path="/warehouse/settings/vehicle" element={<Vehicles />} />
          
        </Route>

        </Route>
        </Route>
      
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

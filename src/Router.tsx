import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Login from './pages/Auth/Login'
import ResetPassword from './pages/Auth/ResetPassword'
import ConfirmResetPassword from './pages/Auth/ConfirmResetPassword'
import ChangePassword from './pages/Auth/ChangePassword'
//ASTD admin
import CompanyManage from './pages/ASTD/CompanyManage'
import AstdVehicleDashboard from './pages/Logistic/Dashboard/dashboard'

//collection point
import CollectionPoint from './pages/Collector/CollectionPoint/CollectionPoint/CollectionPoint'
import CreateCollectionPoint from './pages/Collector/CollectionPoint/CreateCollectionPoint/CreateCollectionPoint'
import EditCollectionPoint from './pages/Collector/CollectionPoint/EditCollectionPoint/EditCollectionPoint'
//warehouse
import Overview from './pages/Collector/Manage/CheckoutRequest'
import Settings from './pages/Collector/Warehouse/Settings'
import Vehicles from './pages/Collector/Vehicles/Vechicles'
import WarehouseDashboard from './pages/Collector/Warehouse/WarehouseDashboard'
//Tenant Register
// import CompanyDetails from "./pages/TenantRegister/CompanyDetails";
// import CompanyContact from "./pages/TenantRegister/CompanyContact";
import RegisterResult from './pages/TenantRegister/RegisterResult'
//new tenantpage
import TenantRegister from './pages/TenantRegister/Register'
// import RegisterStepOne from "./pages/TenantRegister/RegisterStepOne";
// import RegisterStepTwo from "./pages/TenantRegister/RegisterStepTwo";

//general
import Staff from './pages/Collector/Staff'
//import Report from "./pages/Collector/Report";
import Report from './pages/GeneralModule/Report/Report'
import RecycleShipment from './pages/Collector/RecycleShipment'

//import ProcessRecord from "./pages/Collector/Manage/ProcessRecord";
import ProcessRecord from './pages/Collector/ProcessRecord/ProcessRecord'
import PickupOrder from './pages/Collector/PickupOrder/PickupOrder'
import CreatePickupOrder from './pages/Collector/PickupOrder/CreatePickupOrder'
import EditPickupOrder from './pages/Collector/PickupOrder/EditPickupOrder'
import Inventory from './pages/Collector/Inventory/Inventory'
import StaffManagement from './pages/Collector/StaffManagement/StaffParent'

// import AuthGuard from "./components/Guards/AuthGuard";
// import AutoLogout from "./components/AutoLogout";

import CheckoutRequest from './pages/Collector/Manage/CheckoutRequest'
import UserGroup from './pages/Collector/UserGroup/UserGroup'
import { CheckInAndCheckOut } from './pages/Collector/CheckInAndCheckOut'

//logistic
import JobOrder from './pages/Logistic/JobOrder/JobOrder'
import CreateOrUpdateJobOrder from './pages/Logistic/JobOrder/CreateOrUpdateJobOrder'
import LogisticAccount from './pages/Logistic/Account'
import Driver from './pages/Logistic/Driver'
import Notice from './pages/ASTD/Notice/Index'
import UpdateTemplate from './pages/ASTD/Notice/UpdateTemplate'
import StaffEnquiry from './pages/Collector/StaffEnquiry/StaffEnquiry'
import LogisticVehicleDashboard from './pages/Logistic/Dashboard/dashboard'

//manufacturer
import PurchaseOrder from './pages/Manufacturer/PurchaseOrder/PurchaseOrder'
import CustomerAccount from './pages/Logistic/Account'
import CreatePurchaseOrder from './pages/Manufacturer/PurchaseOrder/CreatePurchaseOrder'
import EditPurchaseOrder from './pages/Manufacturer/PurchaseOrder/EditPurchaseOrder'
import PickupPurchaseOrder from './pages/Manufacturer/PurchaseOrder/PickupPurchaseOrder'
import DashboardRecyclables from './pages/Collector/Dashboard/Recyclables'
import ManufacturerDashboard from './pages/Manufacturer/Dashboard/Dashboard'
import RecyclablesAstd from './pages/ASTD/Dashboard/RecyclablesAstd'
import PageNotFound from './pages/Common/PageNotFound'
import MaintenancePage from './pages/Common/MaintenancePage'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/confirmNewPassword" element={<ConfirmResetPassword />} />
        {/* <Route element={<AuthGuard />}> */}
        <Route path="/changePassword/:idReset?" element={<ChangePassword />} />
        {/* tenant page */}
        <Route
          path="/register/details/:tenantId"
          element={<TenantRegister />}
        />
        <Route path="/register/result" element={<RegisterResult />} />
        <Route path="/register/result" element={<RegisterResult />} />

        {/* collector admin */}
        <Route element={<MainLayout />}>
          <Route path="/collector" element={<CollectionPoint />} />
          <Route
            path="/collector/collectionPoint"
            element={<CollectionPoint />}
          />
          <Route
            path="/:realmApiRoute/processRecord"
            element={<ProcessRecord />}
          />
          <Route path="/collector/pickupOrder" element={<PickupOrder />} />
          <Route
            path="/collector/createPickupOrder"
            element={<CreatePickupOrder />}
          />
          <Route
            path="/collector/editPickupOrder"
            element={<EditPickupOrder />}
          />
          <Route path="/collector/report" element={<Report />} />
          {/* <Route path="/collector/staff" element={<Staff />} /> */}
          <Route
            path="/collector/createCollectionPoint"
            element={<CreateCollectionPoint />}
          />
          <Route
            path="/collector/editCollectionPoint"
            element={<EditCollectionPoint />}
          />
          <Route path="/collector/inventory" element={<Inventory />} />
          <Route path="/collector/userGroup" element={<UserGroup />} />
          <Route path="/collector/account" element={<LogisticAccount />} />
          <Route
            path="/collector/checkInAndCheckout"
            element={<CheckInAndCheckOut />}
          />
          <Route path="/collector/notice/" element={<Notice />} />
          <Route
            path="/collector/notice/:type/:templateId"
            element={<UpdateTemplate />}
          />
          <Route path="/collector/staff" element={<StaffManagement />} />
          <Route
            path="/collector/dashboard"
            element={<DashboardRecyclables />}
          />
          <Route path="/collector/warehouse" element={<WarehouseDashboard />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/astd" element={<CompanyManage />} />
          <Route path="/astd/company" element={<CompanyManage />} />
          <Route path="/astd/notice/" element={<Notice />} />
          <Route
            path="/astd/notice/:type/:templateId"
            element={<UpdateTemplate />}
          />
          <Route path="/astd/report" element={<></>} />
          <Route path="/astd/statistics/recyclables" element={<></>} />
          <Route path="/astd/statistics/convoy" element={<></>} />
          <Route path="/astd/statistics/recycleCompany" element={<></>} />
          <Route path="/astd/statistics/recyclePlant" element={<></>} />
          <Route path="/astd/setting" element={<Settings />} />
          <Route path="/astd/account" element={<></>} />
          <Route
            path="/astd/createPicoLogistic"
            element={<CreatePickupOrder />}
          />
          <Route path="/astd/editPicoLogistic" element={<EditPickupOrder />} />
          <Route path="/astd/inventory/" element={<Inventory />} />
          <Route path="/astd/warehouse" element={<WarehouseDashboard />} />
          <Route path="/astd/dashboard" element={<RecyclablesAstd />} />
          <Route path="/astd/vehicleDashboard" element={<AstdVehicleDashboard />} />
          <Route
            path="/astd/vehicleDashboard"
            element={<AstdVehicleDashboard />}
          />
            <Route path="/astd/report" element={<Report />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/warehouse" element={<WarehouseDashboard />} />
          <Route path="/warehouse/shipment" element={<RecycleShipment />} />
          <Route path="/warehouse/checkout" element={<CheckoutRequest />} />
          <Route path="/warehouse/process" element={<ProcessRecord />} />
          {/* <Route path="/warehouse/staff" element={<StaffManagement />} /> */}
          <Route path="/warehouse/settings" element={<Settings />} />
          <Route path="/warehouse/settings/vehicle" element={<Vehicles />} />
          <Route path="/warehouse/staff-enquiry" element={<StaffEnquiry />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/logistic/pickupOrder" element={<PickupOrder />} />
          <Route path="/logistic/jobOrder" element={<JobOrder />} />
          <Route
            path="/logistic/createJobOrder/:picoId"
            element={<CreateOrUpdateJobOrder />}
          />
          <Route
            path="/logistic/createPickupOrder"
            element={<CreatePickupOrder />}
          />
          <Route
            path="/logistic/editPickupOrder"
            element={<EditPickupOrder />}
          />
          <Route path="/logistic/account" element={<LogisticAccount />} />
          <Route path="/logistic/driver" element={<Driver />} />
          <Route path="/logistic/notice/" element={<Notice />} />
          <Route
            path="/logistic/notice/:type/:templateId"
            element={<UpdateTemplate />}
          />
          <Route path="/logistic/staff" element={<StaffManagement />} />
          <Route
            path="/logistic/vehicleDashboard"
            element={<LogisticVehicleDashboard />}
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/manufacturer/pickupOrder" element={<PickupOrder />} />
          <Route
            path="/manufacturer/createPickupOrder"
            element={<CreatePickupOrder />}
          />
          <Route
            path="/manufacturer/editPickupOrder"
            element={<EditPickupOrder />}
          />
          <Route path="/manufacturer/shipment" element={<RecycleShipment />} />
          <Route path="/manufacturer/checkout" element={<CheckoutRequest />} />
          <Route path="/manufacturer/account" element={<LogisticAccount />} />
          <Route path="/manufacturer/inventory" element={<Inventory />} />
          <Route path="/manufacturer/setting" element={<Settings />} />
          <Route
            path="/manufacturer/purchaseOrder"
            element={<PurchaseOrder />}
          />
          <Route path="/manufacturer/notice/" element={<Notice />} />
          <Route
            path="/manufacturer/notice/:type/:templateId"
            element={<UpdateTemplate />}
          />
          <Route path="/manufacturer/staff" element={<StaffManagement />} />
          <Route
            path="/manufacturer/approvePurchaseOrder"
            element={<PickupPurchaseOrder />}
          />
          <Route
            path="/manufacturer/warehouse"
            element={<WarehouseDashboard />}
          />
          <Route
            path="/manufacturer/dashboard"
            element={<ManufacturerDashboard />}
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/customer/purchaseOrder" element={<PurchaseOrder />} />
          <Route
            path="/customer/createPurchaseOrder"
            element={<CreatePurchaseOrder />}
          />
          <Route
            path="/customer/editPurchaseOrder"
            element={<EditPurchaseOrder />}
          />
          <Route path="/customer/account" element={<CustomerAccount />} />
          <Route path="/customer/notice/" element={<Notice />} />
          <Route
            path="/customer/notice/:type/:templateId"
            element={<UpdateTemplate />}
          />
          <Route path="/customer/staff" element={<StaffManagement />} />
        </Route>
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router

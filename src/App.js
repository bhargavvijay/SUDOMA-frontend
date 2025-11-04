import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { checkAuthAsync, selectUser, selectAuthStatus } from './features/auth/authSlice';
import Sidebar from './Components/SideBar';
import Dashboard from './Components/Dashboard';
import Login from './features/auth/Components/Login';
import ForgotPassword from './features/auth/Components/ForgotPassword';
import ResetPassword from './features/auth/Components/ResetPassword';
import { AddArtBank } from './Components/AddArtBank';
import { ManageDonorRequirement } from './Components/ManageDonarRequirments';
import { RaiseRequisition } from './Components/RaiseRequesition';
import SpermDonorSpecificationsForm from './Components/SpermDonorSpecificationsForm';
import ViewSpermRequesition from './Components/ViewSpermRequesition';
import OocyteRequisitionForm from './Components/OcyteDonarSpecificationsForm';
import ViewOocyteRequisitions from './Components/ViewOcyteRequistion';
import SurrogacyDonarSpecificationsForm from './Components/SurrogacyDonarSpecificationsForm';
import ViewSurrogateRequisition from './Components/ViewSurrogateRequisition';
import ManageSpermSamples from './Components/ManageSpermSamples';
import AddSpermSample from './Components/AddSpermSample';
import ReceiveSpermSamples from './Components/ReceiveSpermSamples';
import ViewReceivedSpermSamples from './Components/ViewReceivedSpermSamples';
import IssueSampleSperm from './Components/IssueSampleSperm';
import ViewCollectedSpermSamples from './Components/ViewCollectedSpermSamples';
import ViewIssuedSpermSamples from './Components/ViewIssuedSpermSamples';
import ManageOocyteDonors from './Components/ManageOocyteDonors';
import RecruitOocyteDonor from './Components/RecruitOocyteDonor';
import ReceiveOocyteDonor from './Components/ReceiveOocyteDonor';
import ViewReceivedOocyteDonors from './Components/ViewReceivedOocyteDonors';
import ViewRecruitedOocyteDonors from './Components/ViewRecruitedOocyteDonors';
import DeleteOcyteDonorSample from './Components/DeleteOcyteDonorSample';
import IssueDonorSample from './Components/IssueDonorSample';
import ViewOocyteIssuedSamples from './Components/ViewOocyteIssuedSamples';
import ManageSurrogates from './Components/ManageSurrogates';
import RecruitSurrogate from './Components/RecruitSurrogate';
import ReceiveSurrogate from './Components/ReceiveSurrogate';
import ViewReceivedSurrogates from './Components/ViewReceivedSurrogates';
import ViewRecruitedSurrogates from './Components/ViewRecruitedSurrogates';
import IssueSurrogateSample from './Components/IssueSurrogateSample';
import ViewIssuedSurrogate from './Components/ViewIssuedSurrogate';
import DeleteSurrogateSamples from './Components/DeleteSurrogateSamples';
import DeleteSpermSamples from './Components/DeleteSpermSamples';
import ViewSpermSample from './Components/ViewSpermSample';
import ViewSurrogateDetail from './Components/ViewSurrogateDetail';
import ViewOocyteDonorDetails from './Components/ViewOocyteDonorDetails';
import AssignPermissions from './Components/AssignPermissions';
import { ViewArtBanks } from './Components/ViewArtBanks';
import CreateUser from './Components/CreateUser';
import ManageUsers from './Components/ManageUsers';
import AadhaarVerification from './Components/AadhaarVerification';

// 🔹 Layout for Authenticated Routes (Includes Sidebar)
const AuthLayout = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
    <div style={{ width: '250px', backgroundColor: '#333', color: 'white' }}>
      <Sidebar />
    </div>
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
      {children}
    </div>
  </div>
);

// 🔹 Loading Component for better UX during auth checks
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    flexDirection: 'column' 
  }}>
    <div style={{ marginBottom: '20px' }}>Verifying your session...</div>
    <div style={{ 
      width: '50px', 
      height: '50px', 
      border: '5px solid #f3f3f3', 
      borderTop: '5px solid #3498db', 
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// 🔹 Modified ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const authStatus = useSelector(selectAuthStatus);
  
  // Show loading while checking auth
  if (authStatus === 'loading') {
    return <LoadingScreen />;
  }
  
  // Redirect to login if not authenticated, preserving the current route
  if (!user) {
    // Save the current location they were trying to access for redirecting back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Return children (the protected component) if authenticated
  return children;
};

// 🔹 Main App Component]]]]
function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const user = useSelector(selectUser);

  useEffect(() => {
    // Check authentication status when app loads
    dispatch(checkAuthAsync());
  }, [dispatch]);

  // Don't render routes until the initial auth check has completed
  if (authStatus === 'loading' && user === null) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* 🔹 Public Routes */}
       
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />

        {/* 🔹 Protected Routes (Require Auth) */}
        <Route path="/dashboard" element={<ProtectedRoute><AuthLayout><Dashboard /></AuthLayout></ProtectedRoute>} />
        
        {/* Art Bank Management */}
        <Route path="/add-art-bank" element={<ProtectedRoute><AuthLayout><AddArtBank /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-art-banks" element={<ProtectedRoute><AuthLayout><ViewArtBanks /></AuthLayout></ProtectedRoute>} />
        
        {/* Donor Requirements */}
        <Route path="/manage-donor-requirments" element={<ProtectedRoute><AuthLayout><ManageDonorRequirement /></AuthLayout></ProtectedRoute>} />
        
        {/* Requisition Management */}
        <Route path="/raise-requisition" element={<ProtectedRoute><AuthLayout><RaiseRequisition /></AuthLayout></ProtectedRoute>} />
        
        <Route path="/verify-aadhaar" element={<ProtectedRoute><AuthLayout><AadhaarVerification /></AuthLayout></ProtectedRoute>} />


        {/* Sperm Requisition */}
        <Route path="/raise-requisition/sperm" element={<ProtectedRoute><AuthLayout><SpermDonorSpecificationsForm /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-requisitions/sperm" element={<ProtectedRoute><AuthLayout><ViewSpermRequesition /></AuthLayout></ProtectedRoute>} />
        
        {/* Oocyte Requisition */}
        <Route path="/raise-requisition/ocyte" element={<ProtectedRoute><AuthLayout><OocyteRequisitionForm/></AuthLayout></ProtectedRoute>} />
        <Route path="/view-requisitions/ocyte" element={<ProtectedRoute><AuthLayout><ViewOocyteRequisitions /></AuthLayout></ProtectedRoute>} />
        
        {/* Surrogate Requisition */}
        <Route path="/raise-requisition/surrogate" element={<ProtectedRoute><AuthLayout><SurrogacyDonarSpecificationsForm /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-requisitions/surrogate" element={<ProtectedRoute><AuthLayout><ViewSurrogateRequisition /></AuthLayout></ProtectedRoute>} />
        
        {/* Sperm Sample Management */}
        <Route path="/manage-samples/sperm" element={<ProtectedRoute><AuthLayout><ManageSpermSamples /></AuthLayout></ProtectedRoute>} />
        <Route path="/add-sample/sperm" element={<ProtectedRoute><AuthLayout><AddSpermSample collect={true}/></AuthLayout></ProtectedRoute>} />
        <Route path="/receive-sample/sperm" element={<ProtectedRoute><AuthLayout><AddSpermSample collect={false} /></AuthLayout></ProtectedRoute>} />
        <Route path="/issue-sample/sperm" element={<ProtectedRoute><AuthLayout><IssueSampleSperm /></AuthLayout></ProtectedRoute>} />
        <Route path="/delete-sperm-sample" element={<ProtectedRoute><AuthLayout><DeleteSpermSamples /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-received-sperm-samples" element={<ProtectedRoute><AuthLayout><ViewReceivedSpermSamples /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-sample-details/:id" element={<ProtectedRoute><AuthLayout><ViewSpermSample /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-collected-sperm-samples" element={<ProtectedRoute><AuthLayout><ViewCollectedSpermSamples /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-issued-sperm-samples" element={<ProtectedRoute><AuthLayout><ViewIssuedSpermSamples /></AuthLayout></ProtectedRoute>} />
        
        {/* Oocyte Donor Management */}
        <Route path="/manage-donors/oocyte" element={<ProtectedRoute><AuthLayout><ManageOocyteDonors /></AuthLayout></ProtectedRoute>} />
        <Route path="/recruit-donor/oocyte" element={<ProtectedRoute><AuthLayout><RecruitOocyteDonor collect={true} /></AuthLayout></ProtectedRoute>} />
        <Route path="/receive-donor/oocyte" element={<ProtectedRoute><AuthLayout><RecruitOocyteDonor collect={false} /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-received-oocyte-donors" element={<ProtectedRoute><AuthLayout><ViewReceivedOocyteDonors /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-recruited-oocyte-donors" element={<ProtectedRoute><AuthLayout><ViewRecruitedOocyteDonors /></AuthLayout></ProtectedRoute>} />
        <Route path="/delete-oocyte-donor" element={<ProtectedRoute><AuthLayout><DeleteOcyteDonorSample /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-oocyte-donor-details/:id" element={<ProtectedRoute><AuthLayout><ViewOocyteDonorDetails /></AuthLayout></ProtectedRoute>} />
        <Route path="/allocate-donor/oocyte" element={<ProtectedRoute><AuthLayout><IssueDonorSample /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-allocated-oocyte-donors" element={<ProtectedRoute><AuthLayout><ViewOocyteIssuedSamples /></AuthLayout></ProtectedRoute>} />
        
        {/* Surrogate Management */}
        <Route path="/manage-surrogates" element={<ProtectedRoute><AuthLayout><ManageSurrogates /></AuthLayout></ProtectedRoute>} />
        <Route path="/recruit-surrogate" element={<ProtectedRoute><AuthLayout><RecruitSurrogate collect={true}/></AuthLayout></ProtectedRoute>} />
        <Route path="/receive-surrogate" element={<ProtectedRoute><AuthLayout><RecruitSurrogate collect={false}/></AuthLayout></ProtectedRoute>} />
        <Route path="/view-received-surrogates" element={<ProtectedRoute><AuthLayout><ViewReceivedSurrogates /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-recruited-surrogates" element={<ProtectedRoute><AuthLayout><ViewRecruitedSurrogates /></AuthLayout></ProtectedRoute>} />
        <Route path="/allocate-surrogate" element={<ProtectedRoute><AuthLayout><IssueSurrogateSample /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-allocated-surrogates" element={<ProtectedRoute><AuthLayout><ViewIssuedSurrogate /></AuthLayout></ProtectedRoute>} />
        <Route path="/view-surrogate-details/:id" element={<ProtectedRoute><AuthLayout><ViewSurrogateDetail /></AuthLayout></ProtectedRoute>} />
        <Route path="/delete-surrogate" element={<ProtectedRoute><AuthLayout><DeleteSurrogateSamples /></AuthLayout></ProtectedRoute>} />
        
        {/* User Management */}
        <Route path="/manage-users" element={<ProtectedRoute><AuthLayout><ManageUsers /></AuthLayout></ProtectedRoute>} />
        <Route path="/create-user" element={<ProtectedRoute><AuthLayout><CreateUser /></AuthLayout></ProtectedRoute>} />
        <Route path="/manage-permissions" element={<ProtectedRoute><AuthLayout><AssignPermissions /></AuthLayout></ProtectedRoute>} />

        {/* 🔹 404 Page */}
        
        
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
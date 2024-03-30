import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentCredits from './components/StudentCredits';
import Admin from './components/Admin';
import Top from './components/Top';
import ProtectedRoute from './components/ProtectedRoute';
import RecordCredit from './components/RecordCredit';
import Mechanism from './components/Mechanism';
import Navbar from './components/Navbar'; // 引入顶部导航栏组件
import LayoutWithMenu from './components/LayoutWithMenu';
import HomePage from './components/HomePage';
import Approve from './components/Approve';
import CreditTransfer from './components/CreditTransfer';
import CreditTransferList from './components/CreditTransfersList';
import ModifyCredit from './components/ModifyCredit';
import GetStudentCreditByMechanism from './components/GetStudentCreditByMechanism';
import AddTeacher from './components/AddTeacher';
import RemoveTeacher from './components/RemoveTeacher';
import Cancel from './components/Cancel';
import AllrequestCreditTransfer from './components/AllrequestCreditTransfer';
import AddAdmin from './components/AddAdmin';
import RemoveAdmin from './components/RemoveAdmin';

function App() {
    
    return (
        <Router>
            <Navbar /> 
            <div style={{ paddingTop: '60px' }}>
            <LayoutWithMenu>
            <Routes>
                <Route path="/homePage" element={<HomePage />} /> 
                
                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/credits-detail" element={
                    <ProtectedRoute component={StudentCredits} role="student" />
                } />

                <Route path="/credits-transfer" element={
                    <ProtectedRoute component={CreditTransfer} role="student" />
                } />
                <Route path="/credits-transferList" element={
                    <ProtectedRoute component={CreditTransferList} role="student" />
                } />

                <Route path="/approve" element={
                    <ProtectedRoute component={Approve} role="student" />
                } />

                <Route path="/admin" element={
                    <ProtectedRoute component={Admin} role="admin" />
                } />

                <Route path="/record-credit" element={
                    <ProtectedRoute component={RecordCredit} role="teacher" />
                } />

                <Route path="/modify-credit" element={
                    <ProtectedRoute component={ModifyCredit} role="teacher" />
                } />

                <Route path="/get-student-credit-by-mechanism" element={
                    <ProtectedRoute component={GetStudentCreditByMechanism} role="mechanism" />
                } />

                <Route path="/add-teacher" element={
                    <ProtectedRoute component={AddTeacher} role="admin" />
                } />

                <Route path="/remove-teacher" element={
                    <ProtectedRoute component={RemoveTeacher} role="admin" />
                } />

                <Route path="/cancel-credit" element={
                    <ProtectedRoute component={Cancel} role="admin" />
                } />

                <Route path="/all-request-credit-transfer" element={
                    <ProtectedRoute component={AllrequestCreditTransfer} role="admin" />
                } />

                <Route path="/add-admin" element={
                    <ProtectedRoute component={AddAdmin} role="top" />
                } />
                <Route path="/remove-admin" element={
                    <ProtectedRoute component={RemoveAdmin} role="top" />
                } />

                <Route path="/Top" element={
                    <ProtectedRoute component={Top} role="top" />
                } />
                <Route path="/mechanism" element={
                    <ProtectedRoute component={Mechanism} role="mechanism" />
                } />

            </Routes>
            </LayoutWithMenu>
            </div>
        </Router>
    );
}

export default App;

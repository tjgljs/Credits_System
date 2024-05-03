import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import Approve from './components/Approve2';
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
import RequsetStudent from './components/RequestStudent';
import WelcomePage from './components/WelcomePage';
import One from './components/one';
import AddCourse from './components/AddCourse';


function App() {

    
    
    return (
        <Router>
            <Navbar /> 
            <div style={{ paddingTop: '60px' }}>
            
            <LayoutWithMenu>
            <Routes>
                <Route path="/homePage" element={<HomePage />} /> 

                <Route path="/" element={<RootRedirect />} /> 

                <Route path='/one' element={<One/>}/>
                
                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/credits-detail" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={StudentCredits} roles={["student"]} />
                } />

                <Route path="/credits-transfer" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={CreditTransfer} roles={["student"]} />
                } />
                <Route path="/credits-transferList" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={CreditTransferList} roles={["student"]} />
                } />

                <Route path="/approve" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={Approve} roles={["student"]} />
                } />

                <Route path="/admin" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={Admin} roles={["admin"]} />
                } />

                <Route path="/record-credit" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={RecordCredit} roles={["teacher","top","admin"]} />
                } />

                <Route path="/modify-credit" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={ModifyCredit} roles={["teacher","top","admin"]} />
                } />

                <Route path="/get-student-credit-by-mechanism" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={GetStudentCreditByMechanism} roles={["mechanism"]} />
                } />

                <Route path="/request-student" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={RequsetStudent} roles={["mechanism"]} />
                } />

                <Route path="/add-teacher" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={AddTeacher} roles={["admin","top"]} />
                } />

                <Route path="/remove-teacher" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={RemoveTeacher} roles={["admin","top"]} />
                } />

                <Route path="/cancel-credit" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={Cancel} roles={["admin","top"]} />
                } />

                <Route path="/all-request-credit-transfer" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={AllrequestCreditTransfer} roles={["admin","top"]} />
                } />
                

                <Route path="/add-admin" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={AddAdmin} roles={["top"]} />
                } />

                <Route path="/remove-admin" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={RemoveAdmin} roles={["top"]} />
                } />

                <Route path='/add-course' element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={AddCourse} roles={['admin', 'top']} />
                }/>

                <Route path="/Top" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={Top} roles={["top"]} />
                } />
                <Route path="/mechanism" element={
                    // eslint-disable-next-line
                    <ProtectedRoute component={Mechanism} roles={["mechanism"]} />
                } />

            </Routes>
            </LayoutWithMenu>
            </div>
        </Router>
    );
}


function RootRedirect() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/one'); // 如果token存在，重定向到/one
            window.location.reload(); // 强制页面刷新
        }
    }, [navigate]);

    return <WelcomePage />; // 默认显示WelcomePage组件
}

export default App;

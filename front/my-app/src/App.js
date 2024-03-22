import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Student from './components/Student';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Teacher from './components/Teacher';
import Top from './components/Top';
import Mechanism from './components/Mechanism';
import { ContractProvider } from './components/Metamask';

function App() {
    return (
        <ContractProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/student" element={
                    <ProtectedRoute component={Student} role="student" />
                } />

                <Route path="/admin" element={
                    <ProtectedRoute component={Admin} role="admin" />
                } />

                <Route path="/teacher" element={
                    <ProtectedRoute component={Teacher} role="teacher" />
                } />

                <Route path="/topAdmin" element={
                    <ProtectedRoute component={Top} role="top" />
                } />

                <Route path="/mechanism" element={
                    <ProtectedRoute component={Mechanism} role="mechanism" />
                } />

            </Routes>
        </Router>
        </ContractProvider>
    );
}

export default App;

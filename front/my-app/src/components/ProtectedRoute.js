import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, role }) => {
    const token = localStorage.getItem('token');
    const is_admin = localStorage.getItem('is_admin') === '1';
    const is_teacher = localStorage.getItem('is_teacher') === '1';
    const is_top = localStorage.getItem('is_top') === '1';
    const is_mechanism = localStorage.getItem('is_mechanism') === '1';
    const is_student = localStorage.getItem('is_student') === '1';
    
    let userRole = "student";
    if (is_admin) userRole = "admin";
    if (is_teacher) userRole = "teacher";
    if (is_top) userRole = "top";
    if (is_mechanism) userRole = "mechanism";
    if(is_student) userRole="student";

    // 如果用户有令牌且角色匹配，则渲染组件，否则重定向到登录页面
    return token && userRole === role ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

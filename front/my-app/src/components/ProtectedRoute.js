import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, roles = [] }) => {  // 确保默认roles是空数组
    const token = localStorage.getItem('token');
    const is_admin = localStorage.getItem('is_admin') === '1';
    const is_teacher = localStorage.getItem('is_teacher') === '1';
    const is_top = localStorage.getItem('is_top') === '1';
    const is_mechanism = localStorage.getItem('is_mechanism') === '1';
    const is_student = localStorage.getItem('is_student') === '1';
    
    let allowedRoles = [];
    if (is_admin) allowedRoles.push("admin");
    if (is_teacher) allowedRoles.push("teacher");
    if (is_top) allowedRoles.push("top");
    if (is_mechanism) allowedRoles.push("mechanism");
    if (is_student) allowedRoles.push("student");

    // 检查用户角色是否在允许的角色数组中
    const isAuthorized = roles.some(role => allowedRoles.includes(role));

    // 如果用户有令牌且角色匹配，则渲染组件，否则重定向到首页
    return token && isAuthorized ? <Component /> : <Navigate to="/homePage" />;
};

export default ProtectedRoute;

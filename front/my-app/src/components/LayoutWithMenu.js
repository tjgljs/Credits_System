// 在 src/components/LayoutWithMenu.js 中
import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuLeft from './Menu';

const LayoutWithMenu = ({ children }) => {
    const location = useLocation();
   // 显示 MenuLeft 除非是登录页或注册页
   const showMenuLeft = location.pathname !== '/' && location.pathname !== '/register';


    return (
        <div style={{ paddingTop: '22px', display: 'flex', height: 'calc(100vh - 22px)' }}> {/* 为 Navbar 预留空间 */}
        {showMenuLeft && <MenuLeft style={{ width: '256px', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
            {children}
        </div>
    </div>
    );
};

export default LayoutWithMenu;

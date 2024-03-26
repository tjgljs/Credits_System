// 在 src/components/LayoutWithMenu.js 中
import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuLeft from './Menu';

const LayoutWithMenu = ({ children }) => {
    const location = useLocation();
    const showMenuLeft = location.pathname !== '/'; // 如果不是登录页则显示 MenuLeft

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
        {showMenuLeft && <MenuLeft style={{ width: '256px', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
            {children}
        </div>
    </div>
    );
};

export default LayoutWithMenu;

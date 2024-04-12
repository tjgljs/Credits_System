// 在 src/components/LayoutWithMenu.js 中
import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuLeft from './Menu';

const LayoutWithMenu = ({ children }) => {
    const location = useLocation();
    const showMenuLeft = location.pathname !== '/login' && location.pathname !== '/register'&&location.pathname!=='/';

    return (
        <div style={{ paddingTop: '50px', display: 'flex', height: 'calc(100vh - 22px)' }}> {/* 为 Navbar 预留空间 */}
        {showMenuLeft && (
            <MenuLeft style={{ 
                width: '256px', 
                flexShrink: 0, 
                marginTop: '20px'
            }} />
        )}
        <div style={{ flex: 1 }}>
            {children}
        </div>
    </div>
    );
};

export default LayoutWithMenu;


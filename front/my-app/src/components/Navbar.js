import React, { useState, useEffect } from 'react';
import '../Navbar.css';
import logoImage from './logo1.png'; 
import { Button, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';  // 导入useNavigate钩子

function Navbar() {
    const [account, setCurrentAccount] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setCurrentAccount(accounts[0]);
                console.log("连接的钱包账户:", accounts[0]);
            } catch (error) {
                console.error("连接钱包失败:", error);
            }
        } else {
            console.log("未检测到以太坊钱包插件（如MetaMask）");
        }
    };

    const popoverContent = () => (
        <div>
            {account ? <p>{account}</p> : <p>No wallet connected</p>}
        </div>
    );

    useEffect(() => {
        connectWallet();
        const handleTokenChange = () => {
            setToken(localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleTokenChange);

        return () => {
            window.removeEventListener('storage', handleTokenChange);
        };
    }, []); 

    const isLoggedIn = () => token !== null;

    const goToLoginPage = () => {
        navigate('/login');
    };

    const goToSignUpPage = () => {
        navigate('/register');
    };

    return (
        <div className="navbar-container">
            <img src={logoImage} alt="Logo" className="navbar-logo" />
            <div className="button-group">
                {!isLoggedIn() && (
                    <>
                        <Button className="pink-button" onClick={goToLoginPage}>Log in</Button>
                        <Button className="pink-button" onClick={goToSignUpPage}>Sign up</Button>
                    </>
                )}
                <Popover content={popoverContent()} title="Address">
                    <Button className="pink-button">Wallet Address</Button>
                </Popover>
            </div>
        </div>
    );
}

export default Navbar;

import React, { useState, useEffect } from 'react';


import { Button, Popover } from 'antd';

function Navbar() {
    const [account, setCurrentAccount] = useState(null);
    const connectWallet = async () => {
        if (window.ethereum) { // 检测是否有以太坊提供者（如MetaMask）
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
            console.log("连接的钱包账户:", accounts[0]);
            // 在这里处理连接成功后的逻辑，例如保存用户账户地址
          } catch (error) {
            console.error("连接钱包失败:", error);
            // 在这里处理连接失败的情况
          }
        } else {
          console.log("未检测到以太坊钱包插件（如MetaMask）");
          // 处理未安装钱包插件的情况
        }
      };

     // 动态生成弹出窗口内容
    const popoverContent = () => {
        return (
            <div>
                {account ? (
                    <p>{account}</p> // 显示账户地址
                ) : (
                    <p>No wallet connected</p> // 或显示无钱包连接的消息
                )}
            </div>
        );
    };
    useEffect(() => {
        connectWallet()
    }, []); 



    return (
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
            <Popover content={popoverContent()} title="Address">
                <Button type="primary">Wallet Address</Button>
            </Popover>
         </div>
    );
}

export default Navbar;

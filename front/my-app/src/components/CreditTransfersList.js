import React, { useState, useEffect, useCallback  } from 'react';
import { ethers } from 'ethers';
import { Table, message } from 'antd';
import MyContractABI from './abi.json';

const CreditTransferList = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [account, setCurrentAccount] = useState(null);
    const [contract, setContract] = useState(null);

    const columns = [
        // 定义表格列
        { title: 'Student Addr', dataIndex: 'studentAddr', key: 'studentAddr' },
        { title: 'Course ID', dataIndex: 'courseId', key: 'courseId' },
        { title: 'Target Institution', dataIndex: 'targetInstitution', key: 'targetInstitution' },
        { title: 'Is Approved', dataIndex: 'isApproved', key: 'isApproved' },
        { title: 'Is Executed', dataIndex: 'isExecuted', key: 'isExecuted' },
        // 添加更多列来展示其他数据
      ];


      const formattedData = transfers.map((data, index) => {
        console.log("transfers",transfers)
        let rowData = {
          key: index.toString(),
          studentAddr:data[0].toString(),
          courseId: data[1].toString(),
          targetInstitution: data[2].toString(),
          isApproved: data[3].toString(),
          isExecuted: data[4].toString(),
        };
      
        return rowData;
      });

      const fetchTransfers = useCallback(async () => {
        if (!contract || !account) {
          return;
        }
        try {
          const data = await contract.getCreditTransfersOfStudent(account);
          console.log("data",data)
          setTransfers(data);
        } catch (error) {
          console.error('Error fetching transfers:', error);
          message.error('Failed to fetch transfers');
        } finally {
          setLoading(false);
        }
      },[contract, account]);

    // 合约初始化
    const connectWalletAndGetContract = async () => {
        if (!window.ethereum) {
            console.error("MetaMask not found");
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = '0x87AA2FeCF0d6F1a6F73a8E103C8A3A410914C9c1'; // Your Contract Address
            const contractABI = MyContractABI; // Your Contract ABI
            const newContract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(newContract);
        } catch (error) {
            console.error("Error connecting to MetaMask", error);
        }
    };

    useEffect(() => {
        connectWalletAndGetContract();
        fetchTransfers();
    }, [fetchTransfers]);

    

    const h2Style = {
        textAlign: 'center',   // 文本居中
        color: '#4a4a4a',      // 设置字体颜色，您可以根据需要更改颜色代码
        fontSize: '24px',      // 字体大小
        fontWeight: 'normal',  // 字体粗细
        margin: '20px 0',      // 上下边距
        // 可以添加更多样式来进一步美化标题
      };

    return (
        <div>
        <h2 style={h2Style}>Student Credit Transfers</h2>
        <Table columns={columns} dataSource={formattedData} loading={loading} />
      </div>
    );
};

export default CreditTransferList;

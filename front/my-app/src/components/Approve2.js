import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Avatar, List, Space, message, Radio, Button } from 'antd';
import MyContractABI from './abi.json';
import { CONTRACT_ADDRESS } from './contractAddr';

const ApproveCredits = () => {
  
  const [account, setCurrentAccount] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);

  const positionOptions = ['top', 'bottom', 'both'];
  const alignOptions = ['start', 'center', 'end'];

  const [position, setPosition] = useState('bottom');
  const [align, setAlign] = useState('center');

  const connectWalletAndGetContract = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not found");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = CONTRACT_ADDRESS;
      const newContract = new ethers.Contract(contractAddress, MyContractABI, signer);
      setContract(newContract);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  useEffect(() => {
    connectWalletAndGetContract();
  }, []);

  const fetchAllTransfers = useCallback(async () => {
    if (contract ) {
      try {
        setLoading(true);
        const rawTransfers = await contract.GetAllApproveList();
        console.log("111",rawTransfers)
        const formattedTransfers = rawTransfers.map((transfer, ) => ({
          mechanismAddr: transfer.mechanism,
          num: transfer.expectNum,
          isApproved:transfer.isApproved,
          id:transfer.id
        }));
        setTransfers(formattedTransfers);
      } catch (error) {
        console.error('Error fetching transfers:', error);
        message.error('Failed to fetch transfers');
      } finally {
        setLoading(false);
      }
    }
  }, [contract]);
  
  

  useEffect(() => {
    const intervalId = setInterval(fetchAllTransfers, 1000);
    return () => clearInterval(intervalId);
  }, [fetchAllTransfers]);

  const approveTransfer = async (spender, num, requestId) => {
    if (!contract) {
      message.error('Contract not loaded');
      return;
    }
  
    try {
      const tx = await contract.approve(spender, num, requestId);
      await tx.wait();
      message.success('Transfer approved successfully');
      fetchAllTransfers();
      // 更新前端的请求列表，或执行其他必要的更新
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };
  
  
  



  const h2Style = {
    textAlign: 'center',
    color: '#4a4a4a',
    fontSize: '24px',
    fontWeight: 'normal',
    margin: '20px 0'
  };

  return (
    <>
      <h2 style={h2Style}>批准第三方参看请求</h2>
      <Space direction="vertical" style={{ marginBottom: '20px' }} size="middle">
        <Space>
          <span>Pagination Position:</span>
          <Radio.Group optionType="button" value={position} onChange={(e) => setPosition(e.target.value)}>
            {positionOptions.map((item) => (<Radio.Button key={item} value={item}>{item}</Radio.Button>))}
          </Radio.Group>
        </Space>
        <Space>
          <span>Pagination Align:</span>
          <Radio.Group optionType="button" value={align} onChange={(e) => setAlign(e.target.value)}>
    {alignOptions.map((item) => (
        <Radio.Button key={item} value={item}>{item}</Radio.Button>
    ))}
</Radio.Group>

</Space>
</Space>

<List
    loading={loading}
    itemLayout="horizontal"
    pagination={{ position, align }}
    dataSource={transfers}
    renderItem={(item, index) => (
        <List.Item actions={[
            <Button onClick={() => approveTransfer(item.mechanismAddr, item.num, item.id)} disabled={item.isApproved}>{item.isApproved ? '已批准' : '批准'}</Button>,
        ]}>
            <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                title={`学生地址: ${account}`}
                description={`
                    第三方企业地址: ${item.mechanismAddr}, 
                    请求查看次数: ${item.num},
                    请求ID: ${item.id}`
                }
            />
        </List.Item>
    )}
/>

</>
);
};

export default ApproveCredits;

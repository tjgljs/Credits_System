import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Avatar, List, Space, message, Radio, Button } from 'antd';
import MyContractABI from './abi.json';

const AllrequestCreditTransfer = () => {
  const [transferIndexes, setTransferIndexes] = useState({});
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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = '0xab0844B396f8Af27c886559C7EE45eA10e0D5813';
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
    if (contract) {
      try {
        setLoading(true);
        const rawTransfers = await contract.getAllrequestCreditTransfer();
        const formattedTransfers = rawTransfers.map((transfer, index) => ({
          studentAddr: transfer.studentAddr,
          courseId: transfer.courseId.toString(),
          targetInstitution: transfer.targetInstitution,
          isApproved: transfer.isApproved,
          isExecuted: transfer.isExecuted,
          index: index
        }));
        setTransfers(formattedTransfers);

        const newTransferIndexes = {};
        formattedTransfers.forEach((transfer, index) => {
            const studentAddr = transfer.studentAddr;
            if (!newTransferIndexes[studentAddr]) {
              newTransferIndexes[studentAddr] = [];
            }
            newTransferIndexes[studentAddr].push(index); // 确保这里的 index 是正确的
          });
          setTransferIndexes(newTransferIndexes);
          
        
      } catch (error) {
        console.error('Error fetching transfers:', error);
        message.error('Failed to fetch transfers');
      } finally {
        setLoading(false);
      }
    }
  }, [contract]);

  useEffect(() => {
    const intervalId = setInterval(fetchAllTransfers, 10000); // 更新数据的间隔时间
    return () => clearInterval(intervalId);
  }, [fetchAllTransfers]);

  const approveTransfer = async (studentAddr, transferIndex) => {
    console.log("transferIndexes:", transferIndexes);
    console.log("transferIndex:", transferIndex);
    if (!contract) {
      message.error('Contract not loaded');
      return;
    }

    try {
      const index = transferIndexes[studentAddr][transferIndex];
      console.log("Contract:", contract);
        console.log("Student Address:", studentAddr);
        console.log("Resolved index:", index);
      const tx = await contract.approveCreditTransfer(studentAddr, index);
      console.log("index",index)
      await tx.wait();
      message.success('Transfer approved successfully');
      fetchAllTransfers();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  const executeTransfer = async (studentAddr, transferIndex) => {
    if (!contract) {
      message.error('Contract not loaded');
      return;
    }

    try {
      const index = transferIndexes[studentAddr][transferIndex];
      const tx = await contract.executeCreditTransfer(studentAddr, index);
      await tx.wait();
      message.success('Transfer executed successfully');
      fetchAllTransfers();
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
      <h2 style={h2Style}>All Request Credit Transfers</h2>
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
            {alignOptions
.map((item) => (<Radio.Button key={item} value={item}>{item}</Radio.Button>))}
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
            <Button onClick={() => approveTransfer(item.studentAddr, transferIndexes[item.studentAddr][index])} disabled={item.isApproved}>Approve</Button>,
            <Button onClick={() => executeTransfer(item.studentAddr, transferIndexes[item.studentAddr][index])} disabled={!item.isApproved || item.isExecuted}>Execute</Button>
          ]}>
        <List.Item.Meta
          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={`Student Address: ${item.studentAddr}`}
          description={`
            Course ID: ${item.courseId}, 
            Target Institution: ${item.targetInstitution},
            Approved: ${item.isApproved ? 'Yes' : 'No'}, 
            Executed: ${item.isExecuted ? 'Yes' : 'No'}`
          }
        />
      </List.Item>
    )}
  />
</>
);
};

export default AllrequestCreditTransfer;


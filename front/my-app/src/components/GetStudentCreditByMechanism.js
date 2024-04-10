import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Input, Space, Table, message } from 'antd';
import MyContractABI from './abi.json';
import { CONTRACT_ADDRESS } from './contractAddr';

const GetStudentCreditByMechanism = () => {
    const [credits, setCredits] = useState([]);
    const [contract, setContract] = useState(null);
    const [studentAddr, setStudentAddr] = useState('');

    // Columns for the table
    const columns = [
        {
        title: '学生地址',
        dataIndex: 'student',
        },
        {
            title: '课程ID',
            dataIndex: 'courseId',
        },
        {
            title: '获得学分',
            dataIndex: 'credits',
        },
        {
            title: '课程成绩',
            dataIndex: 'score',
        },
        {
            title: '发布时间',
            dataIndex: 'issueDate',
        },
        {
            title: '是否被修改',
            dataIndex: 'isModified',
        },
        {
            title: '修改次数',
            dataIndex: 'modifyNum',
        },
        {
            title: '是否被撤销',
            dataIndex: 'isRevoked',
        },
        {
            title: '授予学分的教育机构',
            dataIndex: 'issuingInstitution',
        },
        {
            title: '是否被转出',
            dataIndex: 'isTransferred',
        },
        {
            title: '转移的目标机构',
            dataIndex: 'targetInstitution',
        },
    ];

    // Function to convert the timestamp to a standard date format
    function convertUint256TimestampToStandard(timestamp) {
        // Check if timestamp is within the JavaScript safe integer range
        if (timestamp <= Number.MAX_SAFE_INTEGER) {
            const timestampNumber = Number(timestamp);
            const date = new Date(timestampNumber * 1000);
            return date.toLocaleString();
        } else {
            return "Timestamp too large";
        }
    }

    // Connect to wallet and get contract
    const connectWalletAndGetContract = async () => {
        if (!window.ethereum) {
            console.error("MetaMask not found");
            return;
        }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const newContract = new ethers.Contract(CONTRACT_ADDRESS, MyContractABI, signer);
            setContract(newContract);
        } catch (error) {
            console.error("Error connecting to MetaMask", error);
        }
    };

    useEffect(() => {
        connectWalletAndGetContract();
    }, []);

    // 设置事件监听器
    useEffect(() => {
      if (!contract) return;

      const handleEvent = (student, courseId, credits, score, issueDate, isModified, modifyNum, isRevoked, issuingInstitution, isTransferred, targetInstitution) => {
          const newCredit = {
              key: courseId.toString(),
              student:student.toString(),
              courseId:courseId.toString(),
              credits: (parseInt(credits, 10) / 100).toString(),
              score:score.toString(),
              issueDate: convertUint256TimestampToStandard(issueDate),
              isModified: isModified.toString(),
              modifyNum: modifyNum.toString(),
              isRevoked: isRevoked.toString(),
              issuingInstitution: issuingInstitution,
              isTransferred: isTransferred.toString(),
              targetInstitution: targetInstitution.toString(),
          };
          setCredits((prevCredits) => [...prevCredits, newCredit]);
      };

      contract.on('LogCreditDetails', handleEvent);

       // 清除监听器
       return () => {
        if (contract) {
            contract.off('LogCreditDetails', handleEvent);
        }
    };
}, [contract]);

    // 处理表单提交
    const handleTransfer = async () => {
      if (!contract) {
          message.error('合约未加载');
          return;
      }
      try {
          setCredits([]); // 清空当前的学分列表
          await contract.getStudentCreditByMechanism(studentAddr);
          // 此处不直接更新状态，事件监听器会处理新事件
      } catch (error) {
          message.error('处理时出错: ' + error.message);
      }
  };
  return (
    <div>
        <h2>记录学分</h2>
        <Form layout="vertical" onFinish={handleTransfer}>
            <Form.Item name="studentAddr" label="学生地址" rules={[{ required: true }]}>
                <Input value={studentAddr} onChange={(e) => setStudentAddr(e.target.value)} />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <Table columns={columns} dataSource={credits} />
    </div>
);
};

export default GetStudentCreditByMechanism;
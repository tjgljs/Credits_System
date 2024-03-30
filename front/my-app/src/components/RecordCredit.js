import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Input, Space ,message} from 'antd';
import MyContractABI from './abi.json';
import { CONTRACT_ADDRESS } from './contractAddr';

const RecordCredit = () => {
    const [contract, setContract] = useState(null);
    const [courseId, setCourseId] = useState('');
    const [score, setScore] = useState('');
    const [studentAddr, setStudentAddr] = useState('');
    const [issuingInstitution, setIssuingInstitution] = useState('');

    const SubmitButton = ({ form, children }) => {
        const [submittable, setSubmittable] = React.useState(false);
      
        // Watch all values
        const values = Form.useWatch([], form);
        React.useEffect(() => {
          form.validateFields({validateOnly: true,})
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
        }, [form, values]);
        return (
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {children}
          </Button>
          
        );
        
      };

    // 合约初始化
    const connectWalletAndGetContract = async () => {
        if (!window.ethereum) {
            console.error("MetaMask not found");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = CONTRACT_ADDRESS; // Your Contract Address
            const contractABI = MyContractABI; // Your Contract ABI
            const newContract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(newContract);
        } catch (error) {
            console.error("Error connecting to MetaMask", error);
        }
    };

    useEffect(() => {
        connectWalletAndGetContract();
    }, []);

    const handleTransfer = async () => {
        if (!contract) {
            message.error('Contract not loaded');
            console.log("no")
            return;
        }
        try {
            const tx = await contract.recordCredit(studentAddr,courseId,score, issuingInstitution);
            await tx.wait();
            message.success('CreditTransfer successful');
        } catch (error) {
            message.error(`Error: ${error.message}`);
        }
    };
    const [form] = Form.useForm();

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
            <h2 style={h2Style}>Record Credit</h2>
            
            <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleTransfer}>

            <Form.Item name="studentAddr" label="StudentAddr"  rules={[{ required: true }]} >
                <Input value={studentAddr} onChange={e => setStudentAddr(e.target.value)}/>
            </Form.Item>

            <Form.Item name="courseId" label="CourseId" rules={[{ required: true }]} >
                <Input value={courseId} onChange={e => setCourseId(e.target.value)}/>
            </Form.Item>

           
            <Form.Item name="score" label="Score" rules={[{ required: true }]} >
                <Input value={score} onChange={e => setScore(e.target.value)}/>
            </Form.Item>

            <Form.Item name="issuingInstitution" label="IssuingInstitution" rules={[{ required: true }]} >
                <Input value={issuingInstitution} onChange={e => setIssuingInstitution(e.target.value)}/>
            </Form.Item>

            <Form.Item>
                <Space>
                <SubmitButton form={form}>Submit</SubmitButton>
                <Button htmlType="reset">Reset</Button>
                </Space>
            </Form.Item>
            </Form>
        </div>
    );
};

export default RecordCredit;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Input, Space ,message} from 'antd';
import MyContractABI from './abi.json';
import axios from 'axios';

const RemoveTeacher = () => {
    const [contract, setContract] = useState(null);
    const [teacherAddr, setTeacherAddr] = useState('');
    

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
            const contractAddress = '0x57a414f61436d97dcb7297e90299dd3D1Dc0D8D8'; // Your Contract Address
            const contractABI =MyContractABI; // Your Contract ABI
            const newContract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(newContract);
        } catch (error) {
            console.error("Error connecting to MetaMask", error);
        }
    };

    useEffect(() => {
        connectWalletAndGetContract();
    }, []);

    const fetchUserDetails = async (publicKey) => {
        try {
          const response = await axios.get(`http://localhost:8080/is-user?publicKey=${publicKey}`);
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.log('Error fetching user details:', error);
          message.error('Failed to fetch user details');
          return null;
        }
      };

    const handleTransfer = async () => {
        if (!contract) {
            message.error('Contract not loaded');
            console.log("no")
            return;
        }
        const userDetails = await fetchUserDetails(teacherAddr);
        if ( userDetails.code !== 200) {
            message.error('User does not exist or error fetching details');
            return;
        }
        try {
            const tx = await contract.removeTeacher(teacherAddr);
            await tx.wait();
            message.success('Remove teacher successful');

            try{
                const token=localStorage.getItem('token');

                const response=await axios.post('http://localhost:8080/admin/remove_teacher',{
                    teacherWallet:teacherAddr
                },{
                        headers:{
                            'Authorization': token, 
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                console.log(response.data);
                message.success('Teacher remove successfully in backed');
            }catch(error){
                console.log('Backend API error:',error);
                message.error('Failed to update teacher data in backend');
            }
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
            <h2 style={h2Style}>Remove Teacher</h2>
            
            <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleTransfer}>

            <Form.Item name="teacherAddr" label="TeacherAddr"  rules={[{ required: true }]} >
                <Input value={teacherAddr} onChange={e => setTeacherAddr(e.target.value)}/>
            </Form.Item>


            <Form.Item>
                <Space>
                <SubmitButton form={form}>Confirm Removal</SubmitButton>
                <Button htmlType="reset">Reset</Button>
                </Space>
            </Form.Item>
            </Form>
        </div>
    );
};

export default RemoveTeacher;

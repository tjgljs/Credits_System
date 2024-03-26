import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Form, Input, Space ,message} from 'antd';

const CreditTransfer = () => {
    const [contract, setContract] = useState(null);
    const [courseId, setCourseId] = useState('');
    const [targetInstitution, setTargetInstitution] = useState('');

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
            const contractAddress = '0xAf44d766506E9CcA560e047a7F62D2e8Ac3F8Ff7'; // Your Contract Address
            const contractABI = [
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newAdmin",
                            "type": "address"
                        }
                    ],
                    "name": "AdminAdded",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "admin",
                            "type": "address"
                        }
                    ],
                    "name": "AdminRemoved",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "courseId",
                            "type": "uint256"
                        }
                    ],
                    "name": "Cancel",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_newAdmin",
                            "type": "address"
                        }
                    ],
                    "name": "addAdmin",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "courseId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "credits",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "courseName",
                            "type": "string"
                        }
                    ],
                    "name": "addCourse",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "teacher",
                            "type": "address"
                        }
                    ],
                    "name": "addTeacher",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "allowance",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "num",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "index",
                            "type": "uint256"
                        }
                    ],
                    "name": "approveCreditTransfer",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "courseExists",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "courseLists",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "courserInfo",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "courserId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "courserName",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "credits",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createTime",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "creditTransferRequests",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "courseId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "targetInstitution",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "isApproved",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "isExecuted",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "index",
                            "type": "uint256"
                        }
                    ],
                    "name": "executeCreditTransfer",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getAllCourseID",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "courseId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getCourseInfo",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "courserId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "string",
                                    "name": "courserName",
                                    "type": "string"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "credits",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "createTime",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct Creditcertification.CourserInfo",
                            "name": "",
                            "type": "tuple"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        }
                    ],
                    "name": "getCreditTransfersOfStudent",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "courseId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "string",
                                    "name": "targetInstitution",
                                    "type": "string"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isApproved",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isExecuted",
                                    "type": "bool"
                                }
                            ],
                            "internalType": "struct Creditcertification.CreditTransfer[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getCreditsOfStudent",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "courserId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "credits",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "score",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "issueDate",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isModified",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "modifyNum",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isRevoked",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "string",
                                    "name": "issuingInstitution",
                                    "type": "string"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isTransferred",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "string",
                                    "name": "targetInstitution",
                                    "type": "string"
                                }
                            ],
                            "internalType": "struct Creditcertification.Credit[]",
                            "name": "creditList",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        }
                    ],
                    "name": "getStudentCreditByMechanism",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "courserId",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "credits",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "score",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "issueDate",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isModified",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "modifyNum",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isRevoked",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "string",
                                    "name": "issuingInstitution",
                                    "type": "string"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "isTransferred",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "string",
                                    "name": "targetInstitution",
                                    "type": "string"
                                }
                            ],
                            "internalType": "struct Creditcertification.Credit[]",
                            "name": "creditList",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "isAdmin",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "courseId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "newCredits",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "newScore",
                            "type": "uint256"
                        }
                    ],
                    "name": "modifyCredit",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "student",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "courserId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "score",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "issuingInstitution",
                            "type": "string"
                        }
                    ],
                    "name": "recordCredit",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_admin",
                            "type": "address"
                        }
                    ],
                    "name": "removeAdmin",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "teacher",
                            "type": "address"
                        }
                    ],
                    "name": "removeTeacher",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "courseId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "targetInstitution",
                            "type": "string"
                        }
                    ],
                    "name": "requestCreditTransfer",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "studentCourseIds",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "studentCredits",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "courserId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "credits",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "score",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "issueDate",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isModified",
                            "type": "bool"
                        },
                        {
                            "internalType": "uint256",
                            "name": "modifyNum",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bool",
                            "name": "isRevoked",
                            "type": "bool"
                        },
                        {
                            "internalType": "string",
                            "name": "issuingInstitution",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "isTransferred",
                            "type": "bool"
                        },
                        {
                            "internalType": "string",
                            "name": "targetInstitution",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "name": "teachers",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]; // Your Contract ABI
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
            const tx = await contract.requestCreditTransfer(courseId, targetInstitution);
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
            <h2 style={h2Style}>Credit Transfer</h2>
            
            <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" onFinish={handleTransfer}>
            <Form.Item name="courseId" label="CourseId"  rules={[{ required: true }]} >
                <Input value={courseId} onChange={e => setCourseId(e.target.value)}/>
            </Form.Item>
            <Form.Item name="targetInstitution" label="TargetInstitution" rules={[{ required: true }]} >
                <Input value={targetInstitution} onChange={e => setTargetInstitution(e.target.value)}/>
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

export default CreditTransfer;

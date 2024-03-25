import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Table, Button, Menu } from 'antd';

import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
  } from '@ant-design/icons';

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('Option 3', '3', <ContainerOutlined />),
  ];

const StudentCredits = () => {

    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };


    const [credits, setCredits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [contract, setContract] = useState(null);
    console.log(credits)

    const columns = [
        {
          title: '课程ID',
          dataIndex: 'courseId',
        },
        {
          title: '获得学分',
          dataIndex: 'credits',
          sorter: {
            compare: (a, b) => a.credits - b.credits,
            multiple: 5,
          },
        },
        {
          title: '课程成绩',
          dataIndex: 'score',
          sorter: {
            compare: (a, b) => a.score - b.score,
            multiple: 4,
          },
        },
        {
            title: '发布时间',
            dataIndex: 'issueDate',
            sorter: {
              compare: (a, b) => a.issueDate - b.issueDate,
              multiple: 3,
            },
          },
          {
            title: '是否被修改',
            dataIndex: 'isModified',
            sorter: {
              compare: (a, b) => a.isModified - b.isModified,
              multiple: 2,
            },
          },
          {
            title: '修改次数',
            dataIndex: 'modifyNum',
            sorter: {
              compare: (a, b) => a.modifyNum - b.modifyNum,
              multiple: 1,
            },
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

       // 函数转换时间戳为标准日期格式
       function convertUint256TimestampToStandard(timestamp) {
        // 首先，检查 timestamp 是否在 JavaScript 安全整数范围内
        if (timestamp <= Number.MAX_SAFE_INTEGER) {
          // 将 timestamp 转换为 Number
          const timestampNumber = Number(timestamp);
          // 使用 Date 对象将其转换为标准时间
          const date = new Date(timestampNumber * 1000); // 假设时间戳是以秒为单位，转换为毫秒
          // 返回转换后的日期字符串
          return date.toLocaleString();
        } else {
          // 如果时间戳太大，不在安全范围内，则返回错误或其他处理
          return "Timestamp too large";
        }
      }
      
      
      const formattedData = credits.map((credit, index) => {
        let rowData = {
          key: index.toString(),
          courseId: credit[0].toString(),
          credits: credit[1].toString(),
          score: credit[2].toString(),
          issueDate: convertUint256TimestampToStandard(credit[3]),
        };
      
        // 只有在字段不为空时，才添加到 rowData
        if (credit[4]) {
          rowData.isModified = credit[4].toString();
        }
        if (credit[5]) {
          rowData.modifyNum = credit[5].toString();
        }
        if (credit[6]) {
          rowData.isRevoked = credit[6].toString();
        }
        if (credit[7]) {
          rowData.issuingInstitution = credit[7].toString();
        }
        if (credit[8]) {
          rowData.isTransferred = credit[8].toString();
        }
        if (credit[9]) {
          rowData.targetInstitution = credit[9].toString();
        }
      
        return rowData;
      });
      
      
      const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };
   
    const fetchCredits = useCallback(async () => {
        if (!contract) {
            return;
        }

        try {
            const creditsList = await contract.getCreditsOfStudent();
            setCredits(creditsList);
        } catch (error) {
            console.error('Error fetching credits:', error);
        } finally {
            setIsLoading(false);
        }
    }, [contract]); // 依赖项是contract

    const connectWalletAndGetContract = async () => {
        if (!window.ethereum) {
            console.error("MetaMask not found");
            return;
        }
    
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            //setCurrentAccount(accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = '0xAf44d766506E9CcA560e047a7F62D2e8Ac3F8Ff7'; // Your Contract Address
            const contractABI = [
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
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
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
        fetchCredits();
    }, [fetchCredits]); // 添加了refreshCount作为依赖项

   

    if (isLoading) {
        return <p>Loading credits...</p>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <h2>学分详情</h2>
            </div>
            {credits.length > 0 ? (
               <Table columns={columns} dataSource={formattedData} onChange={onChange} />
            ) : (
                <p>No credits available</p>
            )}

        <div style={{width: 256,}}>
        <Button type="primary" onClick={toggleCollapsed} style={{  marginBottom: 16, }} >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu defaultSelectedKeys={['1']}   defaultOpenKeys={['sub1']} mode="inline"  theme="dark" inlineCollapsed={collapsed} items={items}/>
    </div>
        </div>
        

    );
};

export default StudentCredits;

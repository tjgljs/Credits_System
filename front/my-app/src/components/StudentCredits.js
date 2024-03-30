import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Table } from 'antd';
import MyContractABI from './abi.json';
import { CONTRACT_ADDRESS } from './contractAddr';



const StudentCredits = () => {

    
    const [credits, setCredits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [contract, setContract] = useState(null);
    const [, setCurrentAccount] = useState(null);

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
          credits: (parseInt(credit[1], 10) / 100).toString(),
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
        //console.log('params', pagination, filters, sorter, extra);
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
            setCurrentAccount(accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = CONTRACT_ADDRESS; // Your Contract Address
            const contractABI =MyContractABI; // Your Contract ABI
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <h2 style={h2Style}>Credit Details</h2>
            </div>
            {credits.length > 0 ? (
               <Table columns={columns} dataSource={formattedData} onChange={onChange} />
            ) : (
                <p>No credits available</p>
            )}
        </div>
        

    );
};

export default StudentCredits;

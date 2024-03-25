import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
    const [contract, setContract] = useState(null);
    const [currentAccount, setCurrentAccount] = useState(null);

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
    }, []);

    return (
        <ContractContext.Provider value={{ contract, currentAccount }}>
            {children}
        </ContractContext.Provider>
    );
};

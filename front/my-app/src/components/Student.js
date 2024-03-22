// StudentCredits.js
import React, { useState, useEffect } from 'react';
import { useContract } from './Metamask';

const StudentCredits = () => {
    const { contract } = useContract();
    console.log(contract)
    const [credits, setCredits] = useState(null);

    const fetchCredits = async () => {
        if (contract) {
            try {
                // 调用智能合约的方法
                const creditsList = await contract.getCreditsOfStudent();
                setCredits(creditsList);
                console.log(creditsList)
            } catch (error) {
                console.error('Error fetching credits:', error);
            }
        }
    };

    useEffect(() => {
        fetchCredits();
    }, [contract]);

    return (
        <div>
            <h2>My Credits</h2>
            {credits ? (
                <ul>
                    {credits.map((credit, index) => (
                        <li key={index}>
                            Course ID: {credit.courseId.toString()}, 
                            Credits: {credit.credits.toString()}, 
                            Score: {credit.score.toString()}
                            {/* Add other credit properties if needed */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading credits...</p>
            )}
        </div>
    );
};

export default StudentCredits;

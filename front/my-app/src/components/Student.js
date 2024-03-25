import React, { useContext, useState, useEffect } from 'react';
import { ContractContext } from './Metamask'; 

const StudentCredits = () => {
    const { contract } = useContext(ContractContext);
    const [credits, setCredits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCredits = async () => {
            if (!contract) {
                console.log("Contract not available yet.");
                return;
            }
            console.log("Attempting to fetch credits");
            try {
                const creditsList = await contract.getCreditsOfStudent();
                console.log("credits", creditsList);
                setCredits(creditsList);
            } catch (error) {
                console.error('Error fetching credits:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCredits();
    }, [contract]);

    return (
        <div>
            <h2>My Credits</h2>
            {isLoading ? (
                <p>Loading credits...</p>
            ) : credits.length > 0 ? (
                <ul>
                    {credits.map((credit, index) => (
                        <li key={index}>
                            Course ID: {credit.courseId.toString()}, 
                            Credits: {credit.credits.toString()}, 
                            Score: {credit.score.toString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No credits available.</p>
            )}
        </div>
    );
};

export default StudentCredits;

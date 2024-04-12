import React, { useState, useEffect } from 'react';
import '../Welcome.css';
import { GithubOutlined, UsergroupAddOutlined, ArrowDownOutlined } from '@ant-design/icons';
import qrcodeImage from './erweima.jpg';
import '../RotatingCircle.css';

const One = () => {
    const [showQRCode, setShowQRCode] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const toggleQRCode = () => {
        setShowQRCode(!showQRCode);
        console.log("QR Code state before toggle:", showQRCode);
    };

    const handleResearchClick = () => {
        window.open("https://github.com/tjgljs/Credits_System", "_blank");
    };

    const circlePoints = [
        { description: '不可篡改的学术记录: 利用区块链的去中心化和数据不可变性特点，确保每个学分的真实性和可验证性。', angle: 0 },
        { description: '全球认证接入: 打破地域限制，任何认可的教育机构都可以加入并发放经过验证的学分和证书。', angle: 60 },
        { description: '透明可追踪: 学分获取和转移过程完全透明，可供所有授权用户追踪验证，确保信任和透明度。', angle: 120 },
        { description: '简化管理过程: 自动化的学分管理流程，降低教育机构的行政负担，同时提高数据处理的效率和准确性。', angle: 180 },
        { description: '安全的数据存储: 采用先进的加密技术，保护个人数据和学术记录的安全。', angle: 240 },
        { description: '易于整合的系统接口: 提供灵活的API接口, 允许轻松集成到现有的教育管理系统中。', angle: 300 }
    ];

    const [activeText, setActiveText] = useState(circlePoints[0].description);

    useEffect(() => {
        let interval;
        if (!isPaused) {
            interval = setInterval(() => {
                setActiveIndex(prevIndex => (prevIndex + 1) % circlePoints.length);
                setActiveText(circlePoints[(activeIndex + 1) % circlePoints.length].description);
            }, 5000); // Rotate to next point every 5 seconds including a 2-second pause
        }

        return () => clearInterval(interval);
    }, [activeIndex, isPaused, circlePoints]);

    const handlePointClick = (index) => {
        setActiveIndex(index);
        setActiveText(circlePoints[index].description);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 2000); // Continue rotating after 2 seconds
    };

    const center = 150; // Center of the SVG
    const radius = 130; // Radius from center to the point

    return (
        <div className="welcome-container">
            <h1 className="welcome-title">区块链学分认证系统：</h1>
            <div className="welcome-content">
                <p className="centered-text">
                    <span className="bold-text">塑造未来教育的新标准</span>
                    <br />
                    <p className="p-text">在数字时代的浪潮中，教育和认证领域迎来了革新性的变革。我们的区块链学分认证系统致力于为学术成就和专业资格提供一个安全、透明且不可篡改的记录平台。通过结合最先进的区块链技术和用户友好的界面，我们为学生、教育机构和雇主提供一个无缝、互信的学分和证书管理体系。</p>
                    
                </p>
                <div className="centered-text">
                    <span className="bold-text">核心特性：</span>
                    <div className="feature-container">
                    <div className="circle-container">
                        <svg width="300" height="300" style={{ animation: `spin ${isPaused ? 'paused' : '20s linear infinite'}` }}>
                            <circle cx="150" cy="150" r="130" fill="none" stroke="#ddd" strokeWidth="2" />
                            {circlePoints.map((point, index) => (
                                <circle
                                    key={index}
                                    className="icon-circle"
                                    cx={center + radius * Math.cos(Math.PI * point.angle / 180)}
                                    cy={center + radius * Math.sin(Math.PI * point.angle / 180)}
                                    r="10"
                                    fill={activeIndex === index ? "#7bdcb5" : "#285c6c"}
                                    onClick={() => handlePointClick(index)}
                                />
                            ))}
                        </svg>
                        <div className="info-display">{activeText}</div>
                    </div>
                    <img src="	https://www.evernym.com/wp-content/uploads/2017/04/TPI_new1-1.png" alt="Data Chaos" className="side-image" />
                    <img src="	https://www.evernym.com/wp-content/uploads/2017/04/TPI_new2.png" alt="Data Chaos" className="side-image" />
                    <img src="	https://www.evernym.com/wp-content/uploads/2017/04/TPI_new3.png" alt="Data Chaos" className="side-image" />
                    </div>
                    
                </div>
                无论您是正在追求学术发展的学生，还是致力于维护教育质量和诚信的教育机构，或是寻求合格人才的企业，我们的区块链学分认证系统都将是您理想的选择。我们相信，通过这个平台，我们能共同推进教育领域的透明度和公正性，为学生和专业人士开启更广阔的可能性。
                <br /><br />
                <p>如钱包丢失请添加管理员<ArrowDownOutlined style={{ fontSize: '24px', color: '285c6c' }} /></p>
                <div className="welcome-actions">
                    <button className="welcome-btn" onClick={handleResearchClick}>
                        <GithubOutlined style={{ fontSize: '24px', color: '285c6c' }} /> Github
                    </button>
                    <button className="welcome-btn" onClick={toggleQRCode}>
                        <UsergroupAddOutlined style={{ fontSize: '24px', color: '285c6c' }} /> Administrator
                    </button>
                    <div className={showQRCode ? "modal" : "modal hidden"} onClick={() => setShowQRCode(false)}>
                        <div className="modal-content">
                            <img src={qrcodeImage} alt="QR Code" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default One;

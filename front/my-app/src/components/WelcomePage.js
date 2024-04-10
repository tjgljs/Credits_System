    import React, { useState } from 'react';
    import '../Welcome.css';
    import { GithubOutlined, UsergroupAddOutlined,ArrowDownOutlined } from '@ant-design/icons';
    import qrcodeImage from './erweima.jpg'; // 确保图片路径正确

    const WelcomePage = () => {
    const [showQRCode, setShowQRCode] = useState(false);

    const toggleQRCode = () => {
        setShowQRCode(!showQRCode);
        console.log("QR Code state before toggle:", showQRCode);
    };

    const handleResearchClick = () => {
        window.open("https://github.com/tjgljs/Credits_System", "_blank");
    };

    return (
        <div className="welcome-container">
        <h1 className="welcome-title">区块链学分认证系统：</h1>
        <div className="welcome-content" >

            <p className="centered-text">
            <span className="bold-text">塑造未来教育的新标准</span>
            
            <br /><br />
            在数字时代的浪潮中，教育和认证领域迎来了革新性的变革。我们的区块链学分认证系统致力于为学术成就和专业资格提供一个安全、透明且不可篡改的记录平台。通过结合最先进的区块链技术和用户友好的界面，我们为学生、教育机构和雇主提供一个无缝、互信的学分和证书管理体系。
            </p>

            <div className="centered-text">
            <span className="bold-text">核心特性：</span>
            <ul>
                <li>不可篡改的学术记录:利用区块链的去中心化和数据不可变性特点，确保每个学分的真实性和可验证性。</li>
                <li>全球认证接入:打破地域限制，任何认可的教育机构都可以加入并发放经过验证的学分和证书。</li>
                <li>透明可追踪:学分获取和转移过程完全透明，可供所有授权用户追踪验证，确保信任和透明度。</li>
                <li>简化管理过程:自动化的学分管理流程，降低教育机构的行政负担，同时提高数据处理的效率和准确性。</li>
                <li>安全的数据存储:采用先进的加密技术，保护个人数据和学术记录的安全。</li>
                <li>易于整合的系统接口:提供灵活的API接口,允许轻松集成到现有的教育管理系统中。</li>
            </ul>
            无论您是正在追求学术发展的学生，还是致力于维护教育质量和诚信的教育机构，或是寻求合格人才的企业，我们的区块链学分认证系统都将是您理想的选择。我们相信，通过这个平台，我们能共同推进教育领域的透明度和公正性，为学生和专业人士开启更广阔的可能性。
            <br /><br />
            <p>如钱包丢失请添加管理员<ArrowDownOutlined style={{ fontSize: '24px', color: 'white' }} /></p>
            </div>

            <div className="welcome-actions">
            <button className="welcome-btn" onClick={handleResearchClick}>
                <GithubOutlined style={{ fontSize: '24px', color: 'white' }} />
                Github
            </button>
            
            <button className="welcome-btn" onClick={toggleQRCode}>
                <UsergroupAddOutlined style={{ fontSize: '24px', color: 'white' }} />
                Administrator
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

    export default WelcomePage;

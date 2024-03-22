import React, { useState } from 'react';
import '../Register.css'; // 引入样式文件
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs'; // 引入 qs 库

function Register() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isMechanism, setIsMechanism] = useState(0); // 初始化为0，表示默认不是机构
    const [isStudent, setIsStudent] = useState(0); // 初始化为0，表示默认不是机构
    const [registerSuccess, setRegisterSuccess] = useState(false); // 添加注册成功状态
    const history = useNavigate(); // 使用 useHistory 钩子获取 history 对象


    const handleCheckboxChange = (event) => {
        // 如果复选框被勾选，则设置为1，否则为0
        setIsMechanism(event.target.checked ? 1 : 0);
    };

    const handleCheckboxChange1 = (event) => {
        // 如果复选框被勾选，则设置为1，否则为0
        setIsStudent(event.target.checked ? 1 : 0);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // 构造发送到后端的数据
            const userData = {
                mail: email,
                code: code,
                name: name,
                password: password,
                phone: phone,
                IsMechanism: isMechanism ? 1 : 0, // 将布尔值转换为数字，1 表示勾选了机构，0 表示未勾选
                isStudent:isStudent?1:0
            };

            // 使用 qs 库将数据转换为 application/x-www-form-urlencoded 格式
            const formData = qs.stringify(userData);

            // 发送 POST 请求到注册 API
            const response = await axios.post('http://localhost:8080/register', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('注册响应:', response.data);

            if(response.data.code===200){
                alert('恭喜你 注册成功！')
                setRegisterSuccess(true)
                history('/')
            }else{
                alert(`注册失败：${response.data.msg}`)
            }

        } catch (error) {
            console.error('注册失败:', error);

        // Display error in alert
        if (error.response) {
            alert(`注册失败: ${error.response.data.msg}`);
        } else {
            alert('注册请求未能成功发送或处理');
        }
        }
    };


    const handleSendCode = async () => {
        try {
            const response = await axios.post('http://localhost:8080/send-code', `email=${encodeURIComponent(email)}`);
            console.log(response.data);
            // 处理响应
        } catch (error) {
            console.error('发送验证码失败:', error);
            // 处理错误
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="姓名"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="密码"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="tel"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="电话号码"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="邮箱"
                        required
                    />
                    <button type="button" onClick={handleSendCode}>发送验证码</button>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="验证码"
                        required
                    />
                </div>
               
                <div className="checkbox-group">
                    <label>
                        是否为机构：
                        <input
                            type="checkbox"
                            checked={isMechanism === 1} // 当isMechanism为1时，复选框被勾选
                            onChange={handleCheckboxChange} // 使用新的状态处理函数
                        />
                    </label>
            </div>
            <div className="checkbox-group">
                    <label>
                        是否为学生：
                        <input
                            type="checkbox"
                            checked={isStudent === 1} // 当isStudent为1时，复选框被勾选
                            onChange={handleCheckboxChange1} // 使用新的状态处理函数
                        />
                    </label>
            </div>
                <button type="submit" className="btn-submit">注册</button>
            </form>

            {registerSuccess && <p>注册成功！</p>} {/* 注册成功时显示提示 */}
            <Link to="/">已有账号？登录</Link>
        </div>
    );
}

export default Register;
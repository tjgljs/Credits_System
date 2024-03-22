import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs'; // 引入 qs 库
import '../Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // 用于导航到其他页面

    
   

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log("Username:", username);
      console.log("Password:", password);
      try {
          const userData = {
            username: username,
            password: password,
          };
  
          const formData = qs.stringify(userData);
          console.log("Form Data:", formData);
  
          const response = await axios.post('http://localhost:8080/login', formData, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          });
          if (response.data.code === 200) {
            console.log('登录成功:', response.data);
            localStorage.setItem('token',response.data.data.token);
            localStorage.setItem('is_admin',response.data.data.is_admin);
            localStorage.setItem('is_top',response.data.data.is_top);
            localStorage.setItem('is_mechanism',response.data.data.is_mechanism)
            localStorage.setItem('is_teacher',response.data.data.is_teacher)
            localStorage.setItem('is_student',response.data.data.is_student)
            if(response.data.data.is_admin===1){
                navigate('/admin')
            }
            if(response.data.data.is_top===1){
                navigate('/topAdmin')
            }
            if(response.data.data.is_mechanism===1){
                navigate('/mechanism')
            }
            if(response.data.data.is_teacher===1){
                navigate('/teacher')
            }
            if(response.data.data.is_student===1){
                navigate('/student')
            }


          } else {
              console.log('登录失败:', response.data);
              alert('登录失败: ' + response.data.msg); // 确保后端返回的字段是msg
          }
      } catch (error) {
          console.error('登录请求失败:', error);
          if (error.response) {
              // 处理来自后端的具体错误消息
              alert(`登录失败: ${error.response.data.msg}`);
          } else {
              // 处理其他类型的错误（如网络问题）
              alert('登录请求失败');
          }
      }
  };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="用户名"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="密码"
                    />
                </div>
                <button type="submit" className="btn-submit">登录</button>

            </form>
            <div className="register-link">
              <Link to="/register">没有账号？注册</Link>
            </div>
            {/* 其他内容 */}
            

        </div>
    );
}

export default Login;

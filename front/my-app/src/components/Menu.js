import React, { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
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
  getItem('介绍', 'sub7', <AppstoreOutlined />, [
    getItem('开始', '20'),
  ]),
    getItem('学生', 'sub1', <AppstoreOutlined />, [
      getItem('学分详情', '1'),
      getItem('批准', '2'),
      getItem('学分转移', '3'),
      getItem('学分转移记录', '4'),
    ]),
    getItem('老师', 'sub2', <AppstoreOutlined />, [
      getItem('登记学分', '5'),
      getItem('修改学分', '6'),
    //   getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('第三方机构', 'sub4', <AppstoreOutlined />, [
      getItem('查询学生学分详情', '9'),
      getItem('请求查询学生学分','19')
    ]),
    getItem('管理员', 'sub5', <AppstoreOutlined />, [
        getItem('添加老师', '13'),
        getItem('移除老师 ', '14'),
        getItem('撤销学分', '15'),
        getItem('学生转移学分请求', '16'),
        
        getItem('顶级管理员', 'sub6', null, [getItem('添加管理员', '17'), getItem('移除管理员', '18')]),
      ]),
  ];

function MenuLeft() {
    const [theme, ] = useState('Light');
    const [current, setCurrent] = useState('1');
  
    const navigate = useNavigate();
    const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if (e.key === '1') {
        navigate('/credits-detail'); 
      }
    if(e.key==='2'){
        navigate('/approve')
    }  
    if(e.key==='3'){
        navigate('/credits-transfer');
    }
    if(e.key==='4'){
        navigate('/credits-transferList')
    }
    if(e.key==='5'){
        navigate('/record-credit')
    }
    if(e.key==='6'){
        navigate('/modify-credit')
    }
    if(e.key==='9'){
        navigate('/get-student-credit-by-mechanism')
    }
    if(e.key==='13'){
        navigate('add-teacher')
    }
    if(e.key==='14'){
        navigate('remove-teacher')
    }
    if(e.key==='15'){
        navigate('cancel-credit')
    }
    if(e.key==='16'){
        navigate('all-request-credit-transfer')
    }
    if(e.key==='17'){
      navigate('add-admin')
    }
    if(e.key==='18'){
      navigate('remove-admin')
    }
    if(e.key==='19'){
      navigate('request-student')
    }
    if(e.key==="20"){
      navigate('/one')
    }
    
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}> {/* 设置容器高度为视口高度 */}
        
        <Menu
            theme={theme}
            onClick={onClick}
            defaultOpenKeys={[]}
            selectedKeys={[current]}
            mode="inline"
            items={items}
            style={{ flex: 1, overflow: 'auto',borderRight: '1px solid #293541' }} // 设置菜单填充剩余空间，自动添加滚动条
        />
    </div>
);
};
export default MenuLeft;

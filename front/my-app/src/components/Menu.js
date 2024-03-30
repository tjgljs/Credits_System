import React, { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Menu, Switch } from 'antd';
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
    const [theme, setTheme] = useState('dark');
    const [current, setCurrent] = useState('1');
    const changeTheme = (value) => {
        setTheme(value ? 'dark' : 'light');
  };
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
  };
  return (
    <>
    
      <Switch
        checked={theme === 'dark'}
        onChange={changeTheme}
        checkedChildren="Dark"
        unCheckedChildren="Light"
      />
      <br />
      <br />
      <Menu
        theme={theme}
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
      
    </>
  );
};
export default MenuLeft;

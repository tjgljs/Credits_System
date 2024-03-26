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
    getItem('Student', 'sub1', <AppstoreOutlined />, [
      getItem('Credit details', '1'),
      getItem('Approve', '2'),
      getItem('CreditTransfer', '3'),
      getItem('CreditTransferList', '4'),
    ]),
    getItem('Teacher', 'sub2', <AppstoreOutlined />, [
      getItem('RecordCredit', '5'),
      getItem('ModifyCredit', '6'),
    //   getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('Mechanism', 'sub4', <AppstoreOutlined />, [
      getItem('StudentCredit', '9'),
      getItem('Option 10', '10'),
      getItem('Option 11', '11'),
      getItem('Option 12', '12'),
    ]),
    getItem('Navigation Four', 'sub5', <AppstoreOutlined />, [
        getItem('Option 13', '13'),
        getItem('Option 14', '14'),
        getItem('Option 15', '15'),
        getItem('Option 16', '16'),
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

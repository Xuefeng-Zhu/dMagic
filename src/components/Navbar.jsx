import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';

import { useWeb3Context } from '../contexts/Web3ContextProvider';

const { Header } = Layout;

const useStyles = createUseStyles({
  title: {
    float: 'left',
    color: 'white',
  },
  extra: {
    position: 'absolute',
    right: 15,
    top: 0,
  },
});

const Navbar = () => {
  const classes = useStyles();
  const { loadWeb3Modal, logoutOfWeb3Modal, address } = useWeb3Context();

  return (
    <Header>
      <h2 className={classes.title}>dMagic</h2>
      <Menu theme="dark" mode="horizontal" selectable={false}>
        <Menu.Item key="home">
          <Link to="/home">Home</Link>
        </Menu.Item>
        <Menu.Item key="draw">
          <Link to="/draw">Draw</Link>
        </Menu.Item>
      </Menu>

      <div className={classes.extra}>
        {address ? (
          <Button type="danger" onClick={logoutOfWeb3Modal}>
            Logout
          </Button>
        ) : (
          <Button type="primary" onClick={loadWeb3Modal}>
            Connect Wallet
          </Button>
        )}
      </div>
    </Header>
  );
};

export default Navbar;

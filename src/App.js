import React, { useState } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Layout } from 'antd';

import Navbar from './components/Navbar';
import Home from './components/Home';
import DrawCard from './components/DrawCard';
import { useWeb3Context } from './contexts/Web3ContextProvider';

import './app.css';

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="app">
        <Navbar />
        <Content className="body">
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/draw" component={DrawCard} />
            <Redirect to="/home" />
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;

import React, { Component } from 'react';
import { Button, Modal, Input, Avatar, message } from 'antd';
import Config from './config'
import cookie from 'react-cookies'
import './App.css';
import User from './components/user'
import Repair from './components/repair'
import Member from './components/member'
import Box from './components/box'
import Drink from './components/drink'
import Chart from './components/charts'
import { GetDepart } from './components/user'

import { Layout, Menu, Icon, Row, Col } from 'antd';
import config from './config';
import { async } from 'rxjs/internal/scheduler/async';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const privilege = [
  [],
  ["1", "3", "6"],
  ["7"],
  ["8"],
  ["1", "3", "6", "7", "8", "9"]
]

class App extends React.Component {
  state = {
    collapsed: false,
    loginname: "",
    password: "",
    showLogin: false,
    loginTitle: "登录",
    loginLoading: false,
    token: "",

    depart: 0,
    sex: true,
    username: "用户",
    tele: "10000000000",

    content: (<div style={{
      height: "100%", width: "100%", top: "50%", textAlign: "center", fontSize: "50"
    }}>欢迎使用</div>),

    selectedKey: [],

  };

  pages = {
    "1": <Box />,
    "3": <Member />,
    "6": <Drink />,
    "7": <Repair />,
    "8": <Chart />,
    "9": <User />
  }


  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    var token = cookie.load("token");
    console.log("mount");
    console.log(token);
    if (!(token && token.length !== 0)) {
      this.setState({
        showLogin: true
      });
    }
  }

  usernameChange = e => {
    this.setState({
      loginname: e.target.value
    });
  }
  passwordChange = e => {
    this.setState({
      password: e.target.value
    });
  }

  login = async () => {
    if (this.state.loginname.length === 0 || this.state.password.length === 0 || this.state.loginLoading) {
      return;
    }
    this.setState({
      loginLoading: true
    });
    var request = new Request(config.loginUrl, {
      method: 'post',
      body: JSON.stringify({
        Username: this.state.loginname,
        Password: this.state.password
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    var response = await fetch(request);
    if (response.status == 200) {
      var info = await response.json();
      this.setState({
        showLogin: false,
        depart: info.Depart,
        sex: info.Sex,
        username: info.UserName,
        tele: info.Tel,
        token: info.Token
      });
      console.log(this.state);
    } else {
      this.setState({
        loginTitle: "登录失败，请重试",
        loginLoading: false
      });
    }
  }

  select = e => {
    if (privilege[this.state.depart].findIndex((s) => s == e.key) != -1) {
      this.setState({
        selectedKey: [e.key]
      });
      if (this.pages[e.key]) {
        this.setState({
          content: this.pages[e.key]
        });
      }
    } else {
      message.error("您的部门是：" + GetDepart(this.state.depart) + "，不具有该页面的权限");
    }
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div style={{margin:"10px auto"}}>
            <img style={{borderRadius:"50%",  width:"100%", height:"100%", padding:"40px"}} src="logo.jpg"/>
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={this.state.selectedKey} onSelect={this.select}>
            <SubMenu
              key="reception"
              title={
                <span>
                  <Icon type="desktop" />
                  <span>前台业务</span>
                </span>
              }
            >
              <Menu.Item key="1">预订包厢</Menu.Item>
              <Menu.Item key="3">会员管理</Menu.Item>
            </SubMenu>

            <Menu.Item key="6">
              <Icon type="coffee" />
              <span>酒水管理</span>
            </Menu.Item>

            <Menu.Item key="7">
              <Icon type="tool" />
              <span>报修单</span>
            </Menu.Item>
            <Menu.Item key="8">
              <Icon type="money-collect" />
              <span>销售详情</span>
            </Menu.Item>
            <Menu.Item key="9">
              <Icon type="user" />
              <span>用户管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>

          <Modal title={this.state.loginTitle} closable={false} visible={this.state.showLogin} confirmLoading={this.state.loginLoading} onOk={this.login}>
            <Input placeholder="用户名" value={this.state.loginname} onChange={this.usernameChange} />
            <div style={{ height: "30px" }}></div>
            <Input.Password placeholder="密码" value={this.state.password} onChange={this.passwordChange} />
          </Modal>
          <div style={{ height: "30px" }}></div>
          {this.state.content}
          <Footer style={{ textAlign: 'center' }}>天声 KTV 管理系统</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
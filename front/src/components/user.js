import React from 'react'
import config from '../config'
import { Menu, Icon, Spin, Table, Layout, Button, Modal, Divider, message } from 'antd';
import { Form, Input, DatePicker, TimePicker, Select, Cascader, InputNumber } from 'antd';
import { async } from 'rxjs/internal/scheduler/async';
import { get } from 'http';

const { Option } = Select;


export function GetDepart(i) {
    switch (i) {
        case 1:
            return "前台";
        case 2:
            return "后勤部";
        case 3:
            return "财务部";
        default:
            return "经理";
    }
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

export default class User extends React.Component {
    state = {
        users: [],
        showForm: false,
        isCreate: true,
        title: "输入用户信息",
        form: {
            LoginName: "",
            Password: "",
            Depart: 1,
            Sex: 1,
            UserName: "",
            Tel: ""
        }
    }

    columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "ID"
        },
        {
            title: "姓名",
            dataIndex: "UserName",
            key: "UserName"
        }, {
            title: "性别",
            dataIndex: "Sex",
            key: "Sex"
        },
        {
            title: "部门",
            dataIndex: "Depart",
            key: "Depart"
        },
        {
            title: "电话",
            dataIndex: "Tel",
            key: "Tel"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => {
                return (<span>
                    <Button type="dashed" onClick={() => {
                        this.changeUserInfo(record);
                    }}>
                        修改
                    </Button>
                    <Divider type="vertical" />
                    <Button type="danger" onClick={() => {
                        this.deleteUser(record);
                    }}>
                        删除
                    </Button>
                </span>);
            }
        }
    ]

    addUser = () => {
        this.setState({
            isCreate: true,
            form: {
                LoginName: "",
                Password: "",
                Depart: 1,
                Sex: 1,
                UserName: "",
                Tel: ""
            },
            showForm: true
        });
    }

    deleteUser = user => {

        fetch(config.deleteUser, {
            method: "post",
            body: JSON.stringify({
                ID: user.ID
            })
        }).then((responese) => {
            if (responese.ok) {
                this.getAllUser();
                this.setState({
                    showForm: false
                });
                message.info("操作成功");
            } else {
                message.error("操作失败，请检查各字段是否非空且不为 0");
            }
        })
    }

    changeUserInfo = user => {
        var depart = 1;
        if (user.Depart == "前台")
            depart = 1;
        else if (user.Depart == "后勤部")
            depart = 2;
        else if (user.Depart == "财务部")
            depart = 3;
        else
            depart = 4;
        var sex = 1;
        if (user.Sex == "女")
            sex = 2;
        this.setState({
            form: {
                ...user,
                Depart: depart,
                Sex: sex
            },
            showForm: true,
            isCreate: false
        });
    }

    handleFormOK = () => {
        console.log(this.state.form);
        fetch(this.state.isCreate ? config.addUser : config.changeUser, {
            method: "post",
            body: JSON.stringify(this.state.form)
        }).then(async (response) => {
            if (response.ok) {
                console.log(await response.json());
                this.getAllUser();
                this.setState({
                    showForm: false
                });
                message.info("操作成功");
            } else {
                message.error("操作失败，请检查各字段是否非空且不为 0");
            }
        });
    }
    handleCancel = () => {
        this.setState({
            showForm: false
        });
    }

    getAllUser = async () => {
        var response = await fetch(config.allUser, {
            method: "post",
        });
        if (response.status == 200) {
            var users = (await response.json()).users;
            this.setState({
                users: users.map((e) => {
                    return {
                        ...e,
                        Depart: GetDepart(e.Depart),
                        Sex: e.Sex == 1 ? "男" : "女"
                    }
                }),
                title: "输入用户信息"
            });
            message.info("加载成功");
        }
    }

    componentDidMount() {
        this.getAllUser();
    }

    handleClick = e => {
        this.setState({
            current: e.key
        });
    }

    render() {
        return (
            <Layout.Content style={{ margin: '16px 16px', width: "100%", paddingRight: '16px' }}>

                <div style={{ paddingLeft: "20px" }}>
                    <Button onClick={this.addUser}>
                        添加用户
                        </Button>
                </div>

                <div style={{ margin: "0 auto", textAlign: "center", padding: "20px" }}>
                    {
                        this.state.users ?
                            <Table dataSource={this.state.users} columns={this.columns} />
                            : <Spin size="large" />
                    }
                </div>


                <Modal
                    title={this.state.title}
                    visible={this.state.showForm}
                    onOk={this.handleFormOK}
                    onCancel={this.handleCancel}
                    closable={false}
                >
                    <Form {...formItemLayout}>
                        <Form.Item
                            label="登录名"
                        >
                            <Input value={this.state.form.LoginName} onChange={this.handleLoginName} />
                        </Form.Item>

                        <Form.Item
                            label="密码" >
                            <Input value={this.state.form.Password} onChange={this.handlePassword} />
                        </Form.Item>

                        <Form.Item
                            label="部门"
                        >
                            <Select defaultValue={this.state.form.Depart.toString()} style={{ width: 120 }} onChange={this.handleDepart}>
                                <Option value="1">前台</Option>
                                <Option value="2">后勤部</Option>
                                <Option value="3">财务部</Option>
                                <Option value="4">经理</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="性别">
                            <Select defaultValue={this.state.form.Sex.toString()} style={{ width: 120 }} onChange={this.handleSex}>
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="姓名">
                            <Input value={this.state.form.UserName} onChange={this.handleName} />
                        </Form.Item>

                        <Form.Item label="电话号码">
                            <Input value={this.state.form.Tel} onChange={this.handleTel} />
                        </Form.Item>
                    </Form>
                </Modal>

            </Layout.Content>
        );

    }

    handleLoginName = e => {
        this.setState({
            form: {
                ...this.state.form,
                LoginName: e.target.value
            }
        });
    }
    handlePassword = e => {
        this.setState({
            form: {
                ...this.state.form,
                Password: e.target.value
            }
        });
    }
    handleDepart = e => {
        this.setState({
            form: {
                ...this.state.form,
                Depart: parseInt(e)
            }
        });
    }
    handleSex = e => {
        this.setState({
            form: {
                ...this.state.form,
                Sex: parseInt(e)
            }
        });
    }
    handleName = e => {
        this.setState({
            form: {
                ...this.state.form,
                UserName: e.target.value
            }
        });
    }
    handleTel = e => {
        this.setState({
            form: {
                ...this.state.form,
                Tel: e.target.value
            }
        });
    }
}

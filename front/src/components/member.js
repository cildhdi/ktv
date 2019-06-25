import React from 'react'
import { async } from 'rxjs/internal/scheduler/async';
import config from '../config'
import { Layout, Table, Button, Modal, Form, Input, Select, Divider, message, Radio, Icon } from 'antd';
const { Option } = Select;
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

export default class Member extends React.Component {
    state = {
        members: [],
        form: {
            Name: "",
            Tel: "",
            Cumcon: 1,
            Sex: 1,
            Discount: 1
        },
        showModal: false,
        isCreate: true,

        ftName: "",
        ftTel: "",
        ftSex: 0
    }

    defaultForm = {
        Name: "",
        Tel: "",
        Cumcon: 1,
        Sex: 1,
        Discount: 1
    }

    columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "ID"
        },
        {
            title: "姓名",
            dataIndex: "Name",
            key: "Name"
        },
        {
            title: "电话号码",
            dataIndex: "Tel",
            key: "Tel"
        },
        {
            title: "积分",
            dataIndex: "Cumcon",
            key: "Cumcon"
        },
        {
            title: "性别",
            dataIndex: "Sex",
            key: "Sex",
            render: (text, record) => {
                return record.Sex == 1 ? "男" : "女";
            }
        },
        {
            title: "折扣",
            dataIndex: "Discount",
            key: "Discount"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => {
                return (<span>
                    <Button type="dashed" onClick={() => {
                        this.changeMember(record);
                    }}>
                        修改
                    </Button>
                    <Divider type="vertical" />
                    <Button type="danger" onClick={() => {
                        this.deleteMember(record);
                    }}>
                        删除
                    </Button>
                </span>);
            }
        }
    ]

    getAllMember = async () => {
        var response = await fetch(config.allMember, {
            method: "post"
        });
        var members = (await response.json()).members;

        if (this.state.ftName.length != 0) {
            var ftMembers = [];
            members.forEach((ele) => {
                if (ele.Name.startsWith(this.state.ftName))
                    ftMembers.push(ele);
            });
            members = ftMembers;
        }

        if (this.state.ftTel.length != 0) {
            var ftMembers = [];
            members.forEach((ele) => {
                if (ele.Tel.startsWith(this.state.ftTel))
                    ftMembers.push(ele);
            });
            members = ftMembers;
        }

        if (this.state.ftSex != 0) {
            var ftMembers = [];
            members.forEach((ele) => {
                if (ele.Sex == this.state.ftSex)
                    ftMembers.push(ele);
            });
            members = ftMembers;
        }

        this.setState({
            members: members
        });
        message.info("加载成功");

    }

    componentDidMount() {
        this.getAllMember();
    }

    addMember = () => {
        this.setState({
            showModal: true,
            form: {
                Name: "",
                Tel: "",
                Cumcon: 1,
                Sex: 1,
                Discount: 1
            }
        });
    }

    changeMember = (member) => {
        this.setState({
            form: {
                ...member
            },
            showModal: true,
            isCreate: false
        });
    }

    deleteMember = (member) => {
        fetch(config.deleteMember, {
            method: "post",
            body: JSON.stringify({
                ID: member.ID
            })
        }).then(() => {
            this.getAllMember();
            this.setState({
                showModal: false
            });
        })
    }

    handleOK = async () => {
        fetch(this.state.isCreate ? config.addMember : config.changeMember, {
            method: "post",
            body: JSON.stringify({
                ...this.state.form,
                Discount: parseFloat(this.state.form.Discount.toString())
            })
        }).then(async (response) => {
            if (response.ok) {
                console.log(await response.json());
                this.getAllMember();
                this.setState({
                    showModal: false
                });
                message.info("操作成功");
            } else {
                message.error("操作失败，请检查各字段是否非空且不为 0");
            }
        });
    }

    handleCancel = () => {
        this.setState({
            showModal: false
        });
    }

    ftNameChange = (e) => {
        this.setState({
            ftName: e.target.value
        });
        this.getAllMember();
    }

    ftTelChange = (e) => {
        this.setState({
            ftTel: e.target.value
        });
        this.getAllMember();
    }

    ftSexChange = (e) => {
        this.setState({
            ftSex: parseInt(e.target.value)
        });
        this.getAllMember();
    }

    render() {
        return (
            <Layout.Content style={{ margin: '16px 16px', width: "100%", paddingRight: '16px' }}>
                <div style={{ paddingLeft: "20px" }}>

                    <Input
                        value={this.state.ftName}
                        style={{ width: "200px" }}
                        placeholder="输入姓名进行筛选"
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        onChange={this.ftNameChange}
                    />
                    <Divider type="vertical" />
                    <Input
                        value={this.state.ftTel}
                        style={{ width: "200px" }}
                        placeholder="输入电话号码进行筛选"
                        prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        onChange={this.ftTelChange}
                    />
                    <Divider type="vertical" />
                    <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.ftSexChange}>
                        <Radio.Button value="0">全部</Radio.Button>
                        <Radio.Button value="1">男</Radio.Button>
                        <Radio.Button value="2">女</Radio.Button>
                    </Radio.Group>
                    <Divider type="vertical" />
                    <Button onClick={this.addMember}>
                        添加会员
                        </Button>
                </div>
                <div style={{ margin: "0 auto", textAlign: "center", padding: "20px" }}>
                    <Table columns={this.columns} dataSource={this.state.members} />
                </div>


                <Modal
                    title="请输入信息"
                    visible={this.state.showModal}
                    onOk={this.handleOK}
                    closable={false}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item
                            label="姓名"
                        >
                            <Input value={this.state.form.Name} onChange={this.handleName} />
                        </Form.Item>

                        <Form.Item label="电话号码">
                            <Input value={this.state.form.Tel} onChange={this.handleTel} />
                        </Form.Item>

                        <Form.Item label="性别">
                            <Select defaultValue={this.state.form.Sex.toString()} style={{ width: 120 }} onChange={this.handleSex}>
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="折扣">
                            <Input value={this.state.form.Discount} onChange={this.handleDiscount} />
                        </Form.Item>

                    </Form>
                </Modal>

            </Layout.Content >
        );
    }

    handleName = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Name: e.target.value
            }
        });
    }

    handleTel = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Tel: e.target.value
            }
        });
    }

    handleSex = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Sex: parseInt(e)
            }
        });
    }

    handleDiscount = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Discount: e.target.value
            }
        });
    }
}
import React from 'react'
import { async } from 'rxjs/internal/scheduler/async';
import config from '../config'
import { Layout, Table, Button, Modal, Form, Input, Select, Divider, message } from 'antd';

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

export default class Repair extends React.Component {
    state = {
        repairs: [],
        form: {
            BoxID: 0,
            Reason: ""
        },
        showModal: false,
        isCreate: true
    }

    defaultForm = {
        BoxID: 0,
        Reason: ""
    }

    columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "ID"
        },
        {
            title: "房间号",
            dataIndex: "BoxID",
            key: "BoxID"
        },
        {
            title: "报修原因",
            dataIndex: "Reason",
            key: "Reason"
        },
        {
            title: "日期",
            dataIndex: "Time",
            key: "Time"
        }
    ]

    getAllRepair = async () => {
        var response = await fetch(config.allRepair, {
            method: "post"
        });
        var repairs = await response.json();
        this.setState({
            repairs: repairs.repairs
        });
        message.info("加载成功");
    }

    componentDidMount() {
        this.getAllRepair();
    }

    addRepair = () => {
        this.setState({
            showModal: true,
            form: {
                BoxID: 0,
                Reason: ""
            }
        });
    }


    handleOK = async () => {
        fetch(config.addRepair, {
            method: "post",
            credentials: "include",
            body: JSON.stringify({
                ...this.state.form,
                BoxID: parseInt(this.state.form.BoxID.toString())
            })
        }).then(async (response) => {
            if (response.ok) {
                console.log(await response.json());
                this.getAllRepair();
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

    render() {
        return (
            <Layout.Content style={{ margin: '16px 16px', width: "100%" , paddingRight: '16px'}}>
                <div style={{ paddingLeft: "20px" }}>
                    <Button onClick={this.addRepair}>
                        添加报修记录
                        </Button>
                </div>
                <div style={{ margin: "0 auto", textAlign: "center", padding: "20px" }}>
                    <Table columns={this.columns} dataSource={this.state.repairs} />
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
                            label="房间号"
                        >
                            <Input value={this.state.form.BoxID} onChange={this.handleBoxID} />
                        </Form.Item>

                        <Form.Item label="报修原因">
                            <Input value={this.state.form.Reason} onChange={this.handleReason} />
                        </Form.Item>
                    </Form>
                </Modal>

            </Layout.Content >
        );
    }

    handleBoxID = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                BoxID: e.target.value
            }
        });
    }

    handleReason = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Reason: e.target.value
            }
        });
    }
}
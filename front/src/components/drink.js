import React from 'react'
import { async } from 'rxjs/internal/scheduler/async';
import config from '../config'
import { Layout, Table, Button, Modal, Form, Input, Select, Divider, message, InputNumber } from 'antd';
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

export default class Drink extends React.Component {
    state = {
        drinks: [],
        form: {
            Name: "",
            Price: 0.0,
            Stock: 0
        },
        showModal: false,
        isCreate: true,

        count: 0,
        max: 0
    }

    defaultForm = {
        Name: "",
        Price: 0.0,
        Stock: 0
    }

    columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "ID"
        },
        {
            title: "名称",
            dataIndex: "Name",
            key: "Name"
        },
        {
            title: "价格",
            dataIndex: "Price",
            key: "Price"
        },
        {
            title: "库存",
            dataIndex: "Stock",
            key: "Stock",
            render: (text, record) => {
                return record.Stock - 1;
            }
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => {
                return (<span>
                    <Button type="dashed" onClick={() => {
                        this.setState({
                            form: {
                                ...record
                            },
                            max: record.Stock - 1,
                            count: 1
                        })
                    }} disabled={record.Stock == 1}>
                        出售
                    </Button>
                </span>);
            }
        }
    ]

    getAllDrink = async () => {
        var response = await fetch(config.allDrink, {
            method: "post"
        });
        var drinks = await response.json();
        this.setState({
            drinks: drinks.drinks
        });
        message.info("加载成功");

    }

    componentDidMount() {
        this.getAllDrink();
    }

    addDrink = () => {
        this.setState({
            showModal: true,
            form: {
                Name: "",
                Price: 0.0,
                Stock: 0
            }
        });
    }

    handleOK = async () => {
        fetch(config.addDrink, {
            method: "post",
            body: JSON.stringify({
                ...this.state.form,
                Price: parseFloat(this.state.form.Price.toString()),
                Stock: parseInt(this.state.form.Stock) + 1
            })
        }).then(async (response) => {
            if (response.ok) {
                console.log(await response.json());
                this.getAllDrink();
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
            showModal: false,
            count: 0
        });
    }

    handleBuy = () => {
        fetch(config.changeDrink, {
            method: "post",
            body: JSON.stringify({
                ...this.state.form,
                Stock: parseInt(this.state.form.Stock) - this.state.count
            })
        }).then(async (response) => {
            if (response.ok) {
                console.log(await response.json());
                this.getAllDrink();
                this.setState({
                    showModal: false,
                    count: 0
                });
                message.info("操作成功");
            } else {
                message.error("操作失败，请检查各字段是否非空且不为 0");
            }
        });
    }

    render() {
        return (
            <Layout.Content style={{ margin: '16px 16px', width: "100%", paddingRight: '16px' }}>
                <div style={{ paddingLeft: "20px" }}>
                    <Button onClick={this.addDrink}>
                        酒水入库
                        </Button>
                </div>
                <div style={{ margin: "0 auto", textAlign: "center", padding: "20px" }}>
                    <Table columns={this.columns} dataSource={this.state.drinks} />
                </div>


                <Modal
                    title="请输入信息"
                    visible={this.state.showModal}
                    onOk={this.handleOK}
                    closable={false}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="名称">
                            <Input value={this.state.form.Name} onChange={this.handleName} />
                        </Form.Item>

                        <Form.Item label="单价">
                            <Input value={this.state.form.Price} onChange={this.handlePrice} />
                        </Form.Item>

                        <Form.Item label="数量">
                            <Input value={this.state.form.Stock} onChange={this.handleStock} />
                        </Form.Item>

                    </Form>
                </Modal>


                <Modal
                    title="请输入数量"
                    visible={this.state.count != 0}
                    onOk={this.handleBuy}
                    closable={false}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="数量">
                            <InputNumber min={1} max={this.state.max} defaultValue={1} onChange={this.handleCount} />
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

    handlePrice = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Price: e.target.value
            }
        });
    }

    handleStock = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Stock: e.target.value
            }
        });
    }

    handleCount = (e) => {
        this.setState({
            count: e
        });
    }
}
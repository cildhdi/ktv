import React from 'react'
import { async } from 'rxjs/internal/scheduler/async';
import config from '../config'
import { Layout, Table, Button, Modal, Form, Input, Select, Divider, message, TimePicker, Radio, Icon } from 'antd';
import moment from 'moment'
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

export default class Box extends React.Component {
    state = {
        boxes: [],
        form: {
            No: "",
            Type: 1,
            Price: 0.0,
            State: 1,
        },
        showModal: false,
        isCreate: true,
        showBook: false,

        OpenTime: null,
        Duration: null,
        isOpen: false,
        ID: 0,

        ftType: "getAll",
        ftName: ""
    }

    defaultForm = {
        No: "",
        Type: 1,
        Price: 0.0,
        State: 1,
    }

    columns = [
        {
            title: "ID",
            dataIndex: "ID",
            key: "ID"
        },
        {
            title: "房间号",
            dataIndex: "No",
            key: "No"
        },
        {
            title: "房间类型",
            dataIndex: "Type",
            key: "Type",
            render: (text, record) => {
                switch (record.Type) {
                    case 1:
                        return "迷你包";
                    case 2:
                        return "小包";
                    case 3:
                        return "中包";
                    case 4:
                        return "大包";
                    case 5:
                        return "豪华间";
                }
            }
        },
        {
            title: "状态",
            dataIndex: "State",
            key: "State",
            render: (text, record) => {
                switch (record.State) {
                    case 1:
                        return "已预订";
                    case 2:
                        return "可使用";
                    case 3:
                        return "使用中";
                }
            }
        },
        {
            title: "预定时间",
            dataIndex: "BookTime",
            key: "BookTime",
            render: (text, record) => {
                if (record.State == 1)
                    return record.BookTime;
                else
                    return "未预订";
            }
        },
        {
            title: "开厢时间",
            dataIndex: "OpenTime",
            key: "OpenTime",
            render: (text, record) => {
                if (record.State == 3)
                    return record.OpenTime;
                else
                    return "未在使用中";
            }
        },
        {
            title: "时长",
            dataIndex: "Duration",
            key: "Duration",
            render: (text, record) => {
                if (record.State == 1)
                    return (record.Duration / 60).toString() + " 分钟";
                else if (record.State == 3)
                    return parseInt(((record.Duration - (Date.now() - Date.parse(record.OpenTime))
                        / 1000) / 60).toString()) + " / " + (record.Duration / 60).toString() + " 分钟";
                else
                    return "未在使用中";
            }
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => {
                return (<span>
                    <Button type="dashed" onClick={() => {
                        this.bookBox(record);
                    }} disabled={record.State != 2}>
                        预订
                    </Button>
                    <Divider type="vertical" />
                    <Button type="primary" onClick={() => {
                        this.openBox(record);
                    }} disabled={record.State != 2}>
                        开厢
                    </Button>
                </span>);
            }
        }
    ]

    getAllBox = async () => {
        var response = await fetch(config.allBox, {
            method: "post"
        });
        var boxes = (await response.json()).boxes;

        if (this.state.ftType != "getAll") {
            var typebox = []
            boxes.forEach((ele) => {
                if (ele.State.toString() == this.state.ftType)
                    typebox.push(ele);
            })
            boxes = typebox;
        }
        if (this.state.ftName.length != 0) {
            var noboxes = []
            boxes.forEach((ele) => {
                if (ele.No.toString().startsWith(this.state.ftName))
                    noboxes.push(ele);
            })
            boxes = noboxes;
        }

        this.setState({
            boxes: boxes
        });
        message.info("加载成功");
    }

    componentDidMount() {
        this.getAllBox();
    }

    addBox = () => {
        this.setState({
            showModal: true,
            form: {
                No: "",
                Type: 1,
                Price: 0.0,
                State: 1,
            }
        });
    }

    handleOK = async () => {
        fetch(config.addBox, {
            method: "post",
            body: JSON.stringify({
                ...this.state.form,
                Type: parseInt(this.state.form.Type),
                Price: parseFloat(this.state.form.Price),
                State: parseInt(this.state.form.State),
            })
        }).then(async (response) => {
            if (response.ok) {
                console.log(await response.json());
                this.getAllBox()
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
            showBook: false
        });
    }

    bookBox = (record) => {
        this.setState({
            showBook: true,
            isOpen: false,
            Duration: 0,
            OpenTime: moment(),
            ID: record.ID
        });
    }

    openBox = (record) => {
        this.setState({
            showBook: true,
            isOpen: true,
            Duration: 0,
            OpenTime: moment(),
            ID: record.ID
        });
    }

    handleBookOK = () => {
        fetch(this.state.isOpen ? config.openBox : config.bookBox, {
            method: "post",
            body: JSON.stringify({
                ID: this.state.ID,
                OpenTime: parseInt(this.state.OpenTime.unix() / 1000),
                Duration: parseInt(this.state.Duration) * 60
            })
        }).then(async (response) => {
            if (response.ok) {
                console.log(await response.json());
                this.getAllBox()
                this.setState({
                    showModal: false,
                    showBook: false
                });
                message.info("操作成功");
            } else {
                message.error("操作失败，请检查各字段是否非空且不为 0");
            }
        });
    }


    radioChange = (e) => {
        this.setState({
            ftType: e.target.value
        });
        this.getAllBox();
    }

    ftNameChange = (e) => {
        this.setState({
            ftName: e.target.value
        });
        this.getAllBox();

    }

    render() {
        return (
            <Layout.Content style={{ margin: '16px 16px', width: "100%", paddingRight: '16px' }}>
                <div style={{ paddingLeft: "20px" }}>
                    <Radio.Group defaultValue="getAll" buttonStyle="solid" onChange={this.radioChange}>
                        <Radio.Button value="getAll">全部</Radio.Button>
                        <Radio.Button value="1">已预订</Radio.Button>
                        <Radio.Button value="2">可使用</Radio.Button>
                        <Radio.Button value="3">使用中</Radio.Button>
                    </Radio.Group>
                    <Divider type="vertical" />
                    <Input
                        value={this.state.ftName}
                        style={{ width: "200px" }}
                        placeholder="输入房间号进行筛选"
                        prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        onChange={this.ftNameChange}
                    />
                    <Divider type="vertical" />

                    <Button onClick={this.addBox}>
                        添加包厢
                        </Button>
                </div>
                <div style={{ margin: "0 auto", textAlign: "center", padding: "20px" }}>
                    <Table columns={this.columns} dataSource={this.state.boxes} />
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
                            <Input value={this.state.form.No} onChange={this.handleNo} />
                        </Form.Item>

                        <Form.Item label="房间类型">
                            <Select defaultValue={this.state.form.Type.toString()} style={{ width: 120 }} onChange={this.handleType}>
                                <Option value="1">迷你包</Option>
                                <Option value="2">小包</Option>
                                <Option value="3">中包</Option>
                                <Option value="4">大包</Option>
                                <Option value="5">豪华间</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="单价">
                            <Input value={this.state.form.Price} onChange={this.handlePrice} />
                        </Form.Item>

                    </Form>
                </Modal>


                <Modal
                    title="请输入信息"
                    visible={this.state.showBook}
                    onOk={this.handleBookOK}
                    closable={false}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="请选择时间">
                            <TimePicker value={this.state.OpenTime} onChange={this.handleTimeChange} disabled={this.state.isOpen} />
                        </Form.Item>
                        <Form.Item label="时长(/分钟)">
                            <Input value={this.state.Duration} onChange={this.handleDuration} />
                        </Form.Item>

                    </Form>
                </Modal>
            </Layout.Content >
        );
    }

    handleNo = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                No: e.target.value
            }
        });
    }

    handleType = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                Type: parseInt(e)
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

    handleTimeChange = (e) => {
        console.log(e);
        this.setState({
            OpenTime: e
        });
    }

    handleDuration = (e) => {
        this.setState({
            Duration: e.target.value
        });
    }
}
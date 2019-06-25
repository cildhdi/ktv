import React from 'react'

import { Layout } from 'antd'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default class Charts extends React.Component {

    state = {
        xAxisData: [],
        data1: [],
        data2: []
    }

    chart = null

    componentDidMount() {
        this.chart = echarts.init(document.getElementById('main_chart'));
        this.update();
        setInterval(this.update, 1500);
        window.addEventListener("resize", () => {
            this.chart.resize();
        });
    }

    update = () => {
        var data1 = [];
        var data2 = [];
        var xAxisData = [];
        for (var i = 0; i < 100; i++) {
            xAxisData.push(i);
            data1.push(300 + 200 * Math.random());
            data2.push(300 + 200 * Math.random());
        }
        this.setState({
            data1: data1,
            data2: data2,
            xAxisData: xAxisData
        });
        this.chart.setOption({
            title: {
                text: '酒水包厢销售情况（模拟数据）'
            },
            legend: {
                data: ['酒水', '包厢'],
                align: 'left'
            },
            toolbox: {
                // y: 'bottom',
                feature: {
                    magicType: {
                        type: ['stack', 'tiled']
                    },
                    dataView: {},
                    saveAsImage: {
                        pixelRatio: 2
                    }
                }
            },
            tooltip: {},
            xAxis: {
                data: xAxisData,
                silent: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
            },
            series: [{
                name: '酒水',
                type: 'bar',
                data: data1,
                animationDelay: function (idx) {
                    return idx * 10;
                }
            }, {
                name: '包厢',
                type: 'bar',
                data: data2,
                animationDelay: function (idx) {
                    return idx * 10 + 100;
                }
            }],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
        });
        this.setState({});
    }

    render() {
        return (
            <Layout.Content style={{ margin: '16px 16px', width: "100%", padding: '16px' }}>
                <div id="main_chart" style={{ height: "100%", width: "100%" }}></div>
            </Layout.Content>
        );
    }
}
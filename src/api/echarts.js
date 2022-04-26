
export const memoryChartsOption = memoryInfo => {
    const gaugeData = [
        {
            value: (memoryInfo.memory_used / 1024 / 1024).toFixed(2),
            name: '服务器已用内存',
            title: {
                offsetCenter: ['0%', '-30%']
            },
            detail: {
                valueAnimation: true,
                offsetCenter: ['0%', '-20%']
            }
        },
        {
            value: (memoryInfo.memory_available / 1024 / 1024).toFixed(2),
            name: '服务器空闲内存',
            title: {
                offsetCenter: ['0%', '0%']
            },
            detail: {
                valueAnimation: true,
                offsetCenter: ['0%', '10%']
            }
        },
        {
            value: (memoryInfo.memory_cur / 1024 / 1024).toFixed(2),
            name: '实例已用内存',
            title: {
                offsetCenter: ['0%', '30%']
            },
            detail: {
                valueAnimation: true,
                offsetCenter: ['0%', '40%']
            }
        }
    ];
    return {
        series: [
            {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: {
                    show: false
                },
                max: memoryInfo.memory_total / 1024 / 1024,
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#464646'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 40
                    }
                },
                splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    distance: 50
                },
                data: gaugeData,
                title: {
                    fontSize: 10
                },
                detail: {
                    width: 50,
                    height: 14,
                    fontSize: 12,
                    color: 'auto',
                    borderColor: 'auto',
                    borderRadius: 20,
                    borderWidth: 1,
                    formatter: '{value}MB'
                }
            }
        ]
    };
}

export const raftChartsOption = raftInfo => {
    return {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['current_term', 'current_index', 'commit_index', 'raft_status']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'current_term',
                type: 'line',
                showSymbol: false,
                data: raftInfo[0].data
            },
            {
                name: 'current_index',
                type: 'line',
                showSymbol: false,
                data: raftInfo[1].data
            },
            {
                name: 'commit_index',
                type: 'line',
                showSymbol: false,
                data: raftInfo[2].data
            },
            {
                name: 'raft_status',
                type: 'line',
                showSymbol: false,
                data: raftInfo[3].data
            },
        ]
    };

}
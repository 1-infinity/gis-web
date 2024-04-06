const targetData = [
    [{
        id: "A0",
        target: "水源地模块化布置及连通程度",
        system: "生命线系统",
        focus: "吸收力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [1, 0, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "整体/单元",
        detail: "评价的水源地单个供水量需满足总供水量5%以上；水源地模块化布置：地区水源地数量及水源地总供水量；水源地连通程度：各水源地设置原水管数量及连通管数量"
    },
    {
        id: "A1",
        target: "能源设施的模块化布置及连通程度",
        system: "生命线系统",
        focus: "吸收力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [1, 0, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "整体/单元",
        detail: "评价的变电站电压等级不低于110kV，且单个变电站以满足区域电力负荷5%以上；能源设施模块化布置：地区变电所数量及变电所总供电量；多种能源设施数量及总功能量；能源设施连通程度：各种能源设施的设置数量及互补情况"
    },
    {
        id: "A2",
        target: "饮用水、能源和食物的应急储备率和覆盖人口比例",
        system: "生命线系统",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [1, 0, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "总体/单元/详细",
        detail: "饮用水应急储备率=饮用水应急储备总量/（地区人口*人均标准饮用水应急储备量）；食物应急储备率=食物应急储备总量/（地区人口*人均标准食物应急储备量）；能源应急储备率=能源应急储备总量/（地区人口*人均标准能源应急储备量）；覆盖人口比例=应急储备的饮用水、能源和食物服务人口/地区总人口。"
    },
    {
        id: "A3",
        target: "重要生命线工程设施设防标准",
        system: "生命线系统",
        focus: "抵抗力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [1, 0, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "单元",
        detail: "抗震设防标准达到《建筑工程抗震设防分类标准》（GB50223-2008）特殊设防类或重点设防类建设的重要生命线工程设施数量/重要生命线工程设施总数量"
    },
    {
        id: "A4",
        target: "菜市场（生鲜超市）可步行10分钟覆盖率",
        system: "生命线系统",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [1, 0, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "单元",
        detail: "以正常营业的菜市场（生鲜超市）为起点，步行10min可达到范围的区域面积/地区总面积"
    }],
    [{
        id: "B0",
        target: "位于灾害危险区的重要建筑物比例",
        system: "重要建筑物",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 1, 0, 0, 0, 0, 0],
        dir: "负向",
        scale: "中心城区",
        level: "单元",
        detail: "位于灾害危险区的重要建筑物数量/重要建筑物总数量"
    },
    {
        id: "B1",
        target: "重要建筑物设防标准",
        system: "重要建筑物",
        focus: "抵抗力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 1, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "抗震设防标准达到《建筑工程抗震设防分类标准》（GB50223-2008）特殊设防类或重点设防类建设的重要建筑物数量/重要建筑物总数量"
    },
    {
        id: "B2",
        target: "超高层建筑比例",
        system: "重要建筑物",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 1, 0, 0, 0, 0, 0],
        dir: "负向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "超高层建筑数量/地区建筑总数量"
    },
    {
        id: "B3",
        target: "是否有灾中应急指挥固定场所",
        system: "重要建筑物",
        focus: "恢复力/适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 1, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "总体/单元",
        detail: "地区总人口/灾中应急指挥固定场所数量"
    },
    {
        id: "B4",
        target: "人均应急避难场所面积",
        system: "重要建筑物",
        focus: "恢复力/适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [0, 1, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "地区应急避难场所总面积/地区总人口"
    },
    {
        id: "B5",
        target: "消防救援5分钟可达覆盖率",
        system: "重要建筑物",
        focus: "恢复力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [0, 1, 0, 0, 0, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "以消防求援站为起点，消防车接警出动后5min可达到范围的区域面积/地区总面积"
    }],
    [{
        id: "C0",
        target: "位于灾害危险区的重要交通基础设施比例",
        system: "连接系统",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 1, 0, 0, 0, 0],
        dir: "负向",
        scale: "中心城区",
        level: "单元",
        detail: "位于灾害危险区的重要交通基础设施数量/重要交通基础设施总数量"
    },
    {
        id: "C1",
        target: "重要交通基础设施的设防标准",
        system: "连接系统",
        focus: "抵抗力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 1, 0, 0, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "抗震设防标准达到《建筑工程抗震设防分类标准》（GB50223-2008）特殊设防类或重点设防类建设的重要交通基础设施数量/重要交通基础设施总数量"
    },
    {
        id: "C2",
        target: "重要公共服务设施的灾中可达性",
        system: "连接系统",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 1, 0, 0, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "详细",
        detail: "以灾中可保证设施完好、功能完整的重要公共服务设施为起点，步行15min可达到范围的区域面积/地区总面积为"
    },
    {
        id: "C3",
        target: "人均应急疏散道路长度",
        system: "连接系统",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [0, 0, 1, 0, 0, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "单元",
        detail: "满足《城市综合防灾规划标准》条件的道路总长/评价区域总人口"
    }],
    [{
        id: "D0",
        target: "每十万人应急医疗设施用地面积",
        system: "医疗服务系统",
        focus: "恢复力/转化力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [0, 0, 0, 1, 0, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "总体/单元",
        detail: "地区应急医疗设施用地面积/地区总人口"
    },
    {
        id: "D1",
        target: "社区卫生服务设施步行15分钟覆盖率",
        system: "医疗服务系统",
        focus: "恢复力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: true,
        score: [0, 0, 0, 1, 0, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "以社区卫生服务设施为起点，步行15min可达到范围的区域面积/地区总面积"
    },
    {
        id: "D2",
        target: "医疗救护高峰时段规定时间内可达覆盖率",
        system: "医疗服务系统",
        focus: "恢复力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 1, 0, 0, 0],
        dir: "负向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "以医疗急救中心为起点，按照指定时速15min可达到范围的区域面积/地区总面积"
    }],
    [{
        id: "E0",
        target: "污水、废弃物处理厂站的模块化布置程度",
        system: "污染处理系统",
        focus: "适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 1, 0, 0],
        dir: "正向",
        scale: "市域",
        level: "总体",
        detail: "所有模块化分散式污水、固废处理厂处理规模之和/地区总污水量、固废量"
    },
    {
        id: "E1",
        target: "排水系统覆盖率和雨污分流比例",
        system: "污染处理系统",
        focus: "抵抗力/吸收力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 1, 0, 0],
        dir: "正向",
        scale: "中心城区",
        level: "总体/单元",
        detail: "排水系统覆盖率=设有排水管道的道路长度/地区道路总长度（除高架、桥梁、高速公路、城市快速路外）;雨污分流比例=设有雨水管道的道路长度/地区道路总长度（除高架、桥梁、高速公路、城市快速路外）"
    }],
    [{
        id: "F0",
        target: "河湖水面率",
        system: "开放空间系统",
        focus: "吸收力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 0, 1, 0],
        dir: "正向",
        scale: "市域",
        level: "总体/单元",
        detail: "河、湖等水域面积/地区总面积"
    },
    {
        id: "F1",
        target: "生态空间面积占比",
        system: "开放空间系统",
        focus: "吸收力/适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 0, 1, 0],
        dir: "正向",
        scale: "市域",
        level: "总体/单元",
        detail: "绿地、林地、农田、山地、水域、湿地等总面积/地区总面积"
    },
    {
        id: "F2",
        target: "满足防灾避险要求的城市绿地比例",
        system: "开放空间系统",
        focus: "恢复力/适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 0, 1, 0],
        dir: "正向",
        scale: "中心城区",
        level: "单元/详细",
        detail: "低于城市防洪标准规定的洪水淹没线以下的城市绿地、坡度大于15%的区域面积超过绿地总面积60%的城市绿地 ，以及开敞空间小于600平方米的城市绿地不应作为城市防灾避险功能绿地"
    },
    {
        id: "F3",
        target: "降雨就地消纳率（可浸区面积比例）",
        system: "开放空间系统",
        focus: "吸收力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 0, 1, 0],
        dir: "正向",
        scale: "中心城区",
        level: "详细",
        detail: "根据地区现状下垫面分析及海绵控规，地区总体可到达为年径流总量控制率"
    }],
    [{
        id: "G0",
        target: "规划留白用地比例",
        system: "其他",
        focus: "适应力/转化力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 0, 0, 1],
        dir: "正向",
        scale: "中心城区",
        level: "总体",
        detail: "规划留白用地总面积/规划用地总面积"
    },
    {
        id: "G1",
        target: "土地利用方式与扰动风险特征适应",
        system: "其他",
        focus: "抵抗力/吸收力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 0, 0, 1],
        dir: "正向",
        scale: "市域",
        level: "总体/单元",
        detail: "根据《城市综合防灾规划标准》（GB/T51327-2018）评价原则评判，适宜的打分"
    },
    {
        id: "G2",
        target: "绘制风险地图的社区比例",
        system: "其他",
        focus: "抵抗力/适应力",
        val: 0,
        change: ["", "", "", "", "", "", "", ""],
        pp: false,
        score: [0, 0, 0, 0, 0, 0, 1],
        dir: "正向",
        scale: "市域",
        level: "总体/单元",
        detail: "绘制风险地图并在显著位置展示的社区数量/地区所有社区数量"
    }]
];

const options = [
    {
        value: "珠三角城市群",
        label: "珠三角城市群（除广州）",
        disabled: false,
        children: [
            {
                value: "foshan",
                label: "佛山",
                disabled: false,
            },
            {
                value: "zhaoqing",
                label: "肇庆",
                disabled: false,
            },
            {
                value: "shenzhen",
                label: "深圳",
                disabled: false,
            },
            {
                value: "dongguan",
                label: "东莞",
                disabled: false,
            },
            {
                value: "huizhou",
                label: "惠州",
                disabled: false,
            },
            {
                value: "zhuhai",
                label: "珠海",
                disabled: false,
            },
            {
                value: "zhongshan",
                label: "中山",
                disabled: false,
            },
            {
                value: "jiangmen",
                label: "江门",
                disabled: false,
            },
        ],
    },
    {
        value: "直辖市",
        label: "直辖市",
        disabled: false,
        children: [
            {
                value: "shanghai",
                label: "上海",
                disabled: false,
            },
            {
                value: "chongqing",
                label: "重庆",
                disabled: false,
            },
        ],
    },
    {
        value: "省会城市",
        label: "省会城市",
        disabled: false,
        children: [
            {
                value: "guangzhou",
                label: "广州",
                disabled: false,
            },
            {
                value: "wulumuqi",
                label: "乌鲁木齐",
                disabled: false,
            },
        ],
    },
    {
        value: "计划单列市",
        label: "计划单列市",
        disabled: false,
        children: [
            {
                value: "ningbo",
                label: "宁波",
                disabled: false,
            },
        ],
    },
    {
        value: "地级市",
        label: "地级市",
        disabled: false,
        children: [
            {
                value: "dongying",
                label: "东营",
                disabled: false,
            },
            {
                value: "weihai",
                label: "威海",
                disabled: false,
            },
            {
                value: "zibo",
                label: "淄博",
                disabled: false,
            },
            {
                value: "lianyungang",
                label: "连云港",
                disabled: false,
            },
            {
                value: "wuxi",
                label: "无锡",
                disabled: false,
            },
            {
                value: "ezhou",
                label: "鄂州",
                disabled: false,
            },
            {
                value: "sihui",
                label: "四会",
                disabled: false,
            },
            {
                value: "shaoxing",
                label: "绍兴",
                disabled: false,
            },
        ],
    },
];

const Soptions = [
    [
        [
            [{
                value: "1-1-1",
                label: "1个",
            },
            {
                value: "1-1-2",
                label: "2个",
            },
            {
                value: "1-1-3",
                label: "2个以上",
            }],
            [{
                value: "1-1-1",
                label: "没有",
            },
            {
                value: "1-1-2",
                label: "有10%",
            },
            {
                value: "1-1-3",
                label: "有20%",
            }],
            [{
                value: "1-1-1",
                label: "只有一根",
            },
            {
                value: "1-1-2",
                label: "设多根",
            }],
            [{
                value: "1-1-1",
                label: "未设",
            },
            {
                value: "1-1-2",
                label: "设",
            }],
        ],
        [
            [{
                value: "1-2-1",
                label: "单一能源，设两个以下区域能源设施",
            },
            {
                value: "1-2-2",
                label: "单一能源，设两个及以上区域能源设施",
            },
            {
                value: "1-2-3",
                label: "两种及以上能源，设两个以下区域能源设施",
            },
            {
                value: "1-2-4",
                label: "两种及以上能源，设两个及以上区域能源设施",
            }],
            [{
                value: "1-2-1",
                label: "没有",
            },
            {
                value: "1-2-2",
                label: "有10%",
            },
            {
                value: "1-2-3",
                label: "有20%",
            }],
        ],
        [
            [{
                value: "1-3-1",
                label: "90%",
            },
            {
                value: "1-3-2",
                label: "95%",
            },
            {
                value: "1-3-3",
                label: "100%",
            },
            {
                value: "1-3-4",
                label: "110%",
            },
            {
                value: "1-3-5",
                label: "120%",
            }],
            [{
                value: "1-3-1",
                label: "90%",
            },
            {
                value: "1-3-2",
                label: "95%",
            },
            {
                value: "1-3-3",
                label: "100%",
            },
            {
                value: "1-3-4",
                label: "110%",
            },
            {
                value: "1-3-5",
                label: "120%",
            }],
            [{
                value: "1-3-1",
                label: "90%",
            },
            {
                value: "1-3-2",
                label: "95%",
            },
            {
                value: "1-3-3",
                label: "100%",
            },
            {
                value: "1-3-4",
                label: "110%",
            },
            {
                value: "1-3-5",
                label: "120%",
            }],
            [{
                value: "1-3-1",
                label: "90%",
            },
            {
                value: "1-3-2",
                label: "95%",
            },
            {
                value: "1-3-3",
                label: "100%",
            },
            {
                value: "1-3-4",
                label: "110%",
            },
            {
                value: "1-3-5",
                label: "120%",
            }],
        ],
        [
            [{
                value: "1-4-1",
                label: "5%及以上未达到重点设防标准",
            },
            {
                value: "1-4-2",
                label: "2%及以上未达到重点设防标准",
            },
            {
                value: "1-4-3",
                label: "全部达到重点设防标准",
            },
            {
                value: "1-4-4",
                label: "5%及以上高于重点设防标准（达到特殊设防标准）",
            },
            {
                value: "1-4-5",
                label: "10%及以上高于重点设防标准（达到特殊设防标准）",
            }],
        ],
        [
            [{
                value: "1-5-1",
                label: "60%",
            },
            {
                value: "1-5-2",
                label: "70%",
            },
            {
                value: "1-5-3",
                label: "80%",
            },
            {
                value: "1-5-4",
                label: "90%",
            },
            {
                value: "1-5-5",
                label: "100%",
            }],
        ],
    ],
    [
        [
            [{
                value: "2-1-1",
                label: "10%以上",
            },
            {
                value: "2-1-2",
                label: "5%~10%",
            },
            {
                value: "2-1-3",
                label: "2%~5%",
            },
            {
                value: "2-1-4",
                label: "0~2%",
            },
            {
                value: "2-1-5",
                label: "无",
            }],
        ],
        [
            [{
                value: "2-2-1",
                label: "5%及以上未达到",
            },
            {
                value: "2-2-2",
                label: "2%及以上未达到",
            },
            {
                value: "2-2-3",
                label: "全部达到",
            },
            {
                value: "2-2-4",
                label: "5%及以上高于",
            },
            {
                value: "2-2-5",
                label: "10%及以上高于",
            }],
        ],
        [
            [{
                value: "2-3-1",
                label: "30%及以上",
            },
            {
                value: "2-3-2",
                label: "20~30%",
            },
            {
                value: "2-3-3",
                label: "15~20%",
            },
            {
                value: "2-3-4",
                label: "5~15%",
            },
            {
                value: "2-3-5",
                label: "5%以下",
            }],
        ],
        [
            [{
                value: "2-4-1",
                label: "50万及以上",
            },
            {
                value: "2-4-2",
                label: "40~50万",
            },
            {
                value: "2-4-3",
                label: "30~40万",
            },
            {
                value: "2-4-4",
                label: "20~30万",
            },
            {
                value: "2-4-5",
                label: "20万以下",
            }],
        ],
        [
            [{
                value: "2-5-1",
                label: "0.5",
            },
            {
                value: "2-5-2",
                label: "1.0",
            },
            {
                value: "2-5-3",
                label: "2.0",
            },
            {
                value: "2-5-4",
                label: "3.0",
            },
            {
                value: "2-5-5",
                label: "4.5",
            }],
        ],
        [
            [{
                value: "2-6-1",
                label: "80%以下",
            },
            {
                value: "2-6-2",
                label: "80~90%",
            },
            {
                value: "2-6-3",
                label: "90~95%",
            },
            {
                value: "2-6-4",
                label: "95~100%",
            },
            {
                value: "2-6-5",
                label: "100%",
            }],
        ],
    ],
    [
        [
            [{
                value: "3-1-1",
                label: "5%",
            },
            {
                value: "3-1-2",
                label: "3%",
            },
            {
                value: "3-1-3",
                label: "2%",
            },
            {
                value: "3-1-4",
                label: "1%",
            },
            {
                value: "3-1-5",
                label: "0%",
            }],
        ],
        [
            [{
                value: "3-2-1",
                label: "5%及以上未达到",
            },
            {
                value: "3-2-2",
                label: "2%及以上未达到",
            },
            {
                value: "3-2-3",
                label: "全部达到",
            },
            {
                value: "3-2-4",
                label: "5%及以上高于",
            },
            {
                value: "3-2-5",
                label: "10%及以上高于",
            }],
        ],
        [
            [{
                value: "3-3-1",
                label: "60%以下",
            },
            {
                value: "3-3-2",
                label: "60~70%",
            },
            {
                value: "3-3-3",
                label: "70~80%",
            },
            {
                value: "3-3-4",
                label: "80~90%",
            },
            {
                value: "3-3-5",
                label: "90~100%",
            }],
        ],
        [
            [{
                value: "3-4-1",
                label: "0.3",
            },
            {
                value: "3-4-2",
                label: "0.4",
            },
            {
                value: "3-4-3",
                label: "0.5",
            },
            {
                value: "3-4-4",
                label: "0.65",
            },
            {
                value: "3-4-5",
                label: "0.8",
            }],
        ],
    ],
    [
        [
            [{
                value: "4-1-1",
                label: "3",
            },
            {
                value: "4-1-2",
                label: "3.5",
            },
            {
                value: "4-1-3",
                label: "4",
            },
            {
                value: "4-1-4",
                label: "5",
            },
            {
                value: "4-1-5",
                label: "6",
            }],
        ],
        [
            [{
                value: "4-2-1",
                label: "60%以下",
            },
            {
                value: "4-2-2",
                label: "60~70%",
            },
            {
                value: "4-2-3",
                label: "70~80%",
            },
            {
                value: "4-2-4",
                label: "80~90%",
            },
            {
                value: "4-2-5",
                label: "90~100%",
            }],
        ],
        [
            [{
                value: "4-3-1",
                label: "60",
            },
            {
                value: "4-3-2",
                label: "50",
            },
            {
                value: "4-3-3",
                label: "40",
            },
            {
                value: "4-3-4",
                label: "30",
            },
            {
                value: "4-3-5",
                label: "20",
            }],
            [{
                value: "4-3-1",
                label: "80%以下",
            },
            {
                value: "4-3-2",
                label: "80~90%",
            },
            {
                value: "4-3-3",
                label: "90~95%",
            },
            {
                value: "4-3-4",
                label: "95~100%",
            },
            {
                value: "4-3-5",
                label: "100%",
            }],
        ],
    ],
    [
        [
            [{
                value: "5-1-1",
                label: "50%",
            },
            {
                value: "5-1-2",
                label: "60%",
            },
            {
                value: "5-1-3",
                label: "70%",
            },
            {
                value: "5-1-4",
                label: "85%",
            },
            {
                value: "5-1-5",
                label: "100%",
            }],
        ],
        [
            [{
                value: "5-2-1",
                label: "80%",
            },
            {
                value: "5-2-2",
                label: "85%",
            },
            {
                value: "5-2-3",
                label: "90%",
            },
            {
                value: "5-2-4",
                label: "95%",
            },
            {
                value: "5-2-5",
                label: "100%",
            }],
            [{
                value: "5-2-1",
                label: "80%",
            },
            {
                value: "5-2-2",
                label: "85%",
            },
            {
                value: "5-2-3",
                label: "90%",
            },
            {
                value: "5-2-4",
                label: "95%",
            },
            {
                value: "5-2-5",
                label: "100%",
            }],
        ],
    ],
    [
        [
            [{
                value: "6-1-1",
                label: "10%以下",
            },
            {
                value: "6-1-2",
                label: "10%~20%",
            },
            {
                value: "6-1-3",
                label: "20%~30%",
            },
            {
                value: "6-1-4",
                label: "30%~40%",
            },
            {
                value: "6-1-5",
                label: "40%及以上",
            }],
        ],
        [
            [{
                value: "6-2-1",
                label: "20%以下",
            },
            {
                value: "6-2-2",
                label: "20~25%",
            },
            {
                value: "6-2-3",
                label: "25~30%",
            },
            {
                value: "6-2-4",
                label: "30~35%",
            },
            {
                value: "6-2-5",
                label: "35%及以上",
            }],
        ],
        [
            [{
                value: "6-3-1",
                label: "低于20%",
            },
            {
                value: "6-3-2",
                label: "20%~30%",
            },
            {
                value: "6-3-3",
                label: "30%~40%",
            },
            {
                value: "6-3-4",
                label: "40%~50%",
            },
            {
                value: "6-3-5",
                label: "50%~60%",
            }],
        ],
        [
            [{
                value: "6-4-1",
                label: "65%以下",
            },
            {
                value: "6-4-2",
                label: "65~70%",
            },
            {
                value: "6-4-3",
                label: "70~75%",
            },
            {
                value: "6-4-4",
                label: "75~80%",
            },
            {
                value: "6-4-5",
                label: "85%以上",
            }],
        ],
    ],
    [
        [
            [{
                value: "7-1-1",
                label: "0%",
            },
            {
                value: "7-1-2",
                label: "1.5%",
            },
            {
                value: "7-1-3",
                label: "3%",
            },
            {
                value: "7-1-4",
                label: "4%",
            },
            {
                value: "7-1-5",
                label: "5%",
            }],
        ],
        [
            [{
                value: "7-2-1",
                label: "极不适宜",
            },
            {
                value: "7-2-2",
                label: "不适宜",
            },
            {
                value: "7-2-3",
                label: "有条件适宜",
            },
            {
                value: "7-2-4",
                label: "较适宜",
            },
            {
                value: "7-2-5",
                label: "适宜",
            }],
        ],
        [
            [{
                value: "7-3-1",
                label: "10%以下",
            },
            {
                value: "7-3-2",
                label: "10~25%",
            },
            {
                value: "7-3-3",
                label: "25~40%",
            },
            {
                value: "7-3-4",
                label: "40~60%",
            },
            {
                value: "7-3-5",
                label: "60%及以上",
            }],
        ],
    ]
];

const Coptions = [
    [
        [
            [{
                value: "1.1.1",
                label: "未达到",
            },
            {
                value: "1.1.2",
                label: "符合",
            },
            {
                value: "1.1.3",
                label: "符合",
            }],
            [{
                value: "1.1.1",
                label: "或",

            },
            {
                value: "1.1.2",
                label: "且",

            },
            {
                value: "1.1.3",
                label: "且",

            }],
            [{
                value: "1.1.1",
                label: "不足",

            },
            {
                value: "1.1.2",
                label: "达到",

            },
            {
                value: "1.1.3",
                label: "达到",

            }],
            [{
                value: "1.1.1",
                label: "80%，或未连通",

            },
            {
                value: "1.1.2",
                label: "80%~90%，且设置和连通多根",

            },
            {
                value: "1.1.3",
                label: "90%~100%以上，且设置和连通多根",

            }],
        ],
        [
            [{
                value: "1.2.1",
                label: "未达到",
            },
            {
                value: "1.2.2",
                label: "符合",
            },
            {
                value: "1.2.3",
                label: "符合",
            }],
            [{
                value: "1.2.1",
                label: "或",
            },
            {
                value: "1.2.2",
                label: "且",
            },
            {
                value: "1.2.3",
                label: "且",
            }],
            [{
                value: "1.2.1",
                label: "不足",
            },
            {
                value: "1.2.2",
                label: "达到",
            },
            {
                value: "1.2.3",
                label: "达到",
            }],
            [{
                value: "1.2.1",
                label: "80%",
            },
            {
                value: "1.2.2",
                label: "80%~90%",
            },
            {
                value: "1.2.3",
                label: "90%~100%及以上",
            }],
            [{
                value: "1.2.1",
                label: "没有",
            },
            {
                value: "1.2.2",
                label: "有多种",
            },
            {
                value: "1.2.3",
                label: "有多种",
            }],
        ],
        [
            [{
                value: "1.3.1",
                label: "不足",
            },
            {
                value: "1.3.2",
                label: "达到",
            },
            {
                value: "1.3.3",
                label: "达到",
            }],
            [{
                value: "1.3.1",
                label: "80%",
            },
            {
                value: "1.3.2",
                label: "80%~90%",
            },
            {
                value: "1.3.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "1.4.1",
                label: "0.3",
            },
            {
                value: "1.4.2",
                label: "0.5",
            },
            {
                value: "1.4.3",
                label: "大于0.5",
            }],
            [{
                value: "1.4.1",
                label: "5年",
            },
            {
                value: "1.4.2",
                label: "10年",
            },
            {
                value: "1.4.3",
                label: "大于10年",
            }],
        ],
        [
            [{
                value: "1.5.1",
                label: "不足",
            },
            {
                value: "1.5.2",
                label: "为",
            },
            {
                value: "1.5.3",
                label: "为",
            }],
            [{
                value: "1.5.1",
                label: "50%",
            },
            {
                value: "1.5.2",
                label: "50%~65%",
            },
            {
                value: "1.5.3",
                label: "65%~80%及以上",
            }],
        ],
    ],
    [
        [
            [{
                value: "2.1.1",
                label: "为20~30%",
            },
            {
                value: "2.1.2",
                label: "为10~20%",
            },
            {
                value: "2.1.3",
                label: "低于10%",
            }],
        ],
        [
            [{
                value: "2.2.1",
                label: "0.3",
            },
            {
                value: "2.2.2",
                label: "0.5",
            },
            {
                value: "2.2.3",
                label: "大于0.5",
            }],
            [{
                value: "2.2.1",
                label: "5年",
            },
            {
                value: "2.2.2",
                label: "10年",
            },
            {
                value: "2.2.3",
                label: "大于10年",
            }],
        ],
        [
            [{
                value: "2.3.1",
                label: "为20%~30%",
            },
            {
                value: "2.3.2",
                label: "为10%~20%",
            },
            {
                value: "2.3.3",
                label: "低于10%",
            }],
        ],
        [
            [{
                value: "2.4.1",
                label: "不足",
            },
            {
                value: "2.4.2",
                label: "达到",
            },
            {
                value: "2.4.3",
                label: "达到",
            }],
            [{
                value: "2.4.1",
                label: "80%",
            },
            {
                value: "2.4.2",
                label: "80%~90%",
            },
            {
                value: "2.4.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "2.5.1",
                label: "不足",
            },
            {
                value: "2.5.2",
                label: "达到",
            },
            {
                value: "2.5.3",
                label: "达到",
            }],
            [{
                value: "2.5.1",
                label: "80%",
            },
            {
                value: "2.5.2",
                label: "80%~90%",
            },
            {
                value: "2.5.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "2.6.1",
                label: "8min以上",
            },
            {
                value: "2.6.2",
                label: "5~8min以内",
            },
            {
                value: "2.6.3",
                label: "5min以内",
            }],
        ],
    ],
    [
        [
            [{
                value: "3.1.1",
                label: "为20~30%",
            },
            {
                value: "3.1.2",
                label: "为10~20%",
            },
            {
                value: "3.1.3",
                label: "低于10%",
            }],
        ],
        [
            [{
                value: "3.2.1",
                label: "0.3",
            },
            {
                value: "3.2.2",
                label: "0.5",
            },
            {
                value: "3.2.3",
                label: "大于0.5",
            }],
            [{
                value: "3.2.1",
                label: "5年",
            },
            {
                value: "3.2.2",
                label: "10年",
            },
            {
                value: "3.2.3",
                label: "大于10年",
            }],
        ],
        [
            [{
                value: "3.3.1",
                label: "不足",
            },
            {
                value: "3.3.2",
                label: "为",
            },
            {
                value: "3.3.3",
                label: "为",
            }],
            [{
                value: "3.3.1",
                label: "70%",
            },
            {
                value: "3.3.2",
                label: "70%~85%",
            },
            {
                value: "3.3.3",
                label: "85%~100%",
            }],
        ],
        [
            [{
                value: "3.4.1",
                label: "不足",
            },
            {
                value: "3.4.2",
                label: "达到",
            },
            {
                value: "3.4.3",
                label: "达到",
            }],
            [{
                value: "3.4.1",
                label: "80%",
            },
            {
                value: "3.4.2",
                label: "80%~90%",
            },
            {
                value: "3.4.3",
                label: "90%~100%及以上",
            }],
        ],
    ],
    [
        [
            [{
                value: "4.1.1",
                label: "不足",
            },
            {
                value: "4.1.2",
                label: "达到",
            },
            {
                value: "4.1.3",
                label: "达到",
            }],
            [{
                value: "4.1.1",
                label: "80%",
            },
            {
                value: "4.1.2",
                label: "80%~90%",
            },
            {
                value: "4.1.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "4.2.1",
                label: "不足",
            },
            {
                value: "4.2.2",
                label: "达到",
            },
            {
                value: "4.2.3",
                label: "达到",
            }],
            [{
                value: "4.2.1",
                label: "80%",
            },
            {
                value: "4.2.2",
                label: "80%~90%",
            },
            {
                value: "4.2.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "4.3.1",
                label: "15分钟以上",
            },
            {
                value: "4.3.2",
                label: "10~15分钟",
            },
            {
                value: "4.3.3",
                label: "10分钟以内",
            }],
        ],
    ],
    [
        [
            [{
                value: "5.1.1",
                label: "40%以上",
            },
            {
                value: "5.1.2",
                label: "30%~40%",
            },
            {
                value: "5.1.3",
                label: "20%及以下",
            }],
        ],
        [
            [{
                value: "5.2.1",
                label: "不足",
            },
            {
                value: "5.2.2",
                label: "达到",
            },
            {
                value: "5.2.3",
                label: "达到",
            }],
            [{
                value: "5.2.1",
                label: "80%",
            },
            {
                value: "5.2.2",
                label: "80%~90%",
            },
            {
                value: "5.2.3",
                label: "90%~100%及以上",
            }],
        ],
    ],
    [
        [
            [{
                value: "6.1.1",
                label: "不足",
            },
            {
                value: "6.1.2",
                label: "达到",
            },
            {
                value: "6.1.3",
                label: "达到",
            }],
            [{
                value: "6.1.1",
                label: "80%",
            },
            {
                value: "6.1.2",
                label: "80%~90%",
            },
            {
                value: "6.1.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "6.2.1",
                label: "不足",
            },
            {
                value: "6.2.2",
                label: "达到",
            },
            {
                value: "6.2.3",
                label: "达到",
            }],
            [{
                value: "6.2.1",
                label: "80%",
            },
            {
                value: "6.2.2",
                label: "80%~90%",
            },
            {
                value: "6.2.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "6.3.1",
                label: "不足",
            },
            {
                value: "6.3.2",
                label: "达到",
            },
            {
                value: "6.3.3",
                label: "达到",
            }],
            [{
                value: "6.3.1",
                label: "80%",
            },
            {
                value: "6.3.2",
                label: "80%~90%",
            },
            {
                value: "6.3.3",
                label: "90%~100%及以上",
            }],
        ],
        [
            [{
                value: "6.4.1",
                label: "不足80%",
            },
            {
                value: "6.4.2",
                label: "为80%~90%",
            },
            {
                value: "6.4.3",
                label: "为90%~100%",
            }],
        ],
    ],
    [
        [
            [{
                value: "7.1.1",
                label: "2%~3%",
            },
            {
                value: "7.1.2",
                label: "3%~4%",
            },
            {
                value: "7.1.3",
                label: "4%~5%",
            }],
        ],
        [
            [{
                value: "7.2.1",
                label: "不足85%",
            },
            {
                value: "7.2.2",
                label: "达到85%以上",
            },
            {
                value: "7.2.3",
                label: "达到100%",
            }],
        ],
        [
            [{
                value: "7.3.1",
                label: "小于40%",
            },
            {
                value: "7.3.2",
                label: "为40%~60%",
            },
            {
                value: "7.3.3",
                label: "大于60%",
            }],
        ],
    ]
];

const Poptions = [
    [
        [
            [{
                value: "1~1~1",
                label: "低于现状情况",
            },
            {
                value: "1~1~2",
                label: "与现状情况相同",
            },
            {
                value: "1~1~3",
                label: "高于现状情况",
            }],
        ],
        [
            [{
                value: "1~2~1",
                label: "低于现状情况",
            },
            {
                value: "1~2~2",
                label: "与现状情况相同",
            },
            {
                value: "1~2~3",
                label: "高于现状情况",
            }],
        ],
        [
            [{
                value: "1~3~1",
                label: "低于现状",
            },
            {
                value: "1~3~2",
                label: "等于现状",
            },
            {
                value: "1~3~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "1~4~1",
                label: "低于",
            },
            {
                value: "1~4~2",
                label: "达到",
            },
            {
                value: "1~4~3",
                label: "高于",
            }],
        ],
        [
            [{
                value: "1~5~1",
                label: "低于现状",
            },
            {
                value: "1~5~2",
                label: "等于现状",
            },
            {
                value: "1~5~3",
                label: "高于现状",
            }],
        ]
    ],
    [
        [
            [{
                value: "2~1~1",
                label: "低于现状",
            },
            {
                value: "2~1~2",
                label: "等于现状",
            },
            {
                value: "2~1~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "2~2~1",
                label: "低于",
            },
            {
                value: "2~2~2",
                label: "达到",
            },
            {
                value: "2~2~3",
                label: "高于",
            }],
        ],
        [
            [{
                value: "2~3~1",
                label: "低于现状",
            },
            {
                value: "2~3~2",
                label: "等于现状",
            },
            {
                value: "2~3~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "2~4~1",
                label: "低于现状",
            },
            {
                value: "2~4~2",
                label: "等于现状",
            },
            {
                value: "2~4~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "2~5~1",
                label: "低于现状",
            },
            {
                value: "2~5~2",
                label: "等于现状",
            },
            {
                value: "2~5~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "2~6~1",
                label: "低于现状",
            },
            {
                value: "2~6~2",
                label: "等于现状",
            },
            {
                value: "2~6~3",
                label: "高于现状",
            }],
        ]
    ],
    [
        [
            [{
                value: "3~1~1",
                label: "低于现状",
            },
            {
                value: "3~1~2",
                label: "等于现状",
            },
            {
                value: "3~1~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "3~2~1",
                label: "低于",
            },
            {
                value: "3~2~2",
                label: "达到",
            },
            {
                value: "3~2~3",
                label: "高于",
            }],
        ],
        [
            [{
                value: "3~3~1",
                label: "低于现状",
            },
            {
                value: "3~3~2",
                label: "等于现状",
            },
            {
                value: "3~3~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "3~4~1",
                label: "小于",
            },
            {
                value: "3~4~2",
                label: "等于",
            },
            {
                value: "3~4~3",
                label: "大于",
            }],
        ]
    ],
    [
        [
            [{
                value: "4~1~1",
                label: "低于现状",
            },
            {
                value: "4~1~2",
                label: "等于现状",
            },
            {
                value: "4~1~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "4~2~1",
                label: "低于现状",
            },
            {
                value: "4~2~2",
                label: "等于现状",
            },
            {
                value: "4~2~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "4~3~1",
                label: "低于现状",
            },
            {
                value: "4~3~2",
                label: "等于现状",
            },
            {
                value: "4~3~3",
                label: "高于现状",
            }],
        ],
    ],
    [
        [
            [{
                value: "5~1~1",
                label: "低于现状",
            },
            {
                value: "5~1~2",
                label: "等于现状",
            },
            {
                value: "5~1~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "5~2~1",
                label: "低于现状",
            },
            {
                value: "5~2~2",
                label: "等于现状",
            },
            {
                value: "5~2~3",
                label: "高于现状",
            }],
        ],
    ],
    [
        [
            [{
                value: "6~1~1",
                label: "低于现状",
            },
            {
                value: "6~1~2",
                label: "等于现状",
            },
            {
                value: "6~1~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "6~2~1",
                label: "低于现状",
            },
            {
                value: "6~2~2",
                label: "等于现状",
            },
            {
                value: "6~2~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "6~3~1",
                label: "低于现状",
            },
            {
                value: "6~3~2",
                label: "等于现状",
            },
            {
                value: "6~3~3",
                label: "高于现状",
            }],
        ],
        [
            [{
                value: "6~4~1",
                label: "低于现状",
            },
            {
                value: "6~4~2",
                label: "等于现状",
            },
            {
                value: "6~4~3",
                label: "高于现状",
            }],
        ],
    ],
    [
        [
            [{
                value: "7~1~1",
                label: "低于现状",
            },
            {
                value: "7~1~2",
                label: "等于现状",
            },
            {
                value: "7~1~3",
                label: "高于现状",
            }],
        ],
        [],
        [
            [{
                value: "7~3~1",
                label: "低于现状",
            },
            {
                value: "7~3~2",
                label: "等于现状",
            },
            {
                value: "7~3~3",
                label: "高于现状",
            }],
        ],
    ],
];

//模拟城市得分的数据
const moniData = [
    //上海
    {
        "city": "上海",
        "type": "standard",
        "cityScore": [11, 16, 14, 8, 6, 16, 12],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 2 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 3 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 3 },
                    { "name": "重要生命线工程设施设防标准", "value": 1 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 2 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 2 },
                    { "name": "重要建筑物设防标准", "value": 3 },
                    { "name": "超高层建筑数量", "value": 4 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 5 },
                    { "name": "应急避难场所人均避难面积", "value": 1 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 1 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 3 },
                    { "name": "重要交通基础设施的设防标准", "value": 1 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 5 },
                    { "name": "人均应急疏散道路长度", "value": 5 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 4 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 3 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 1 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 2 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 4 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 4 },
                    { "name": "生态空间面积占比", "value": 5 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 4 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 3 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 3 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 4 },
                    { "name": "绘制风险地图的社区比例", "value": 5 }
                ]
            }
        ]
    },
    //无锡
    {
        "city": "无锡",
        "type": "standard",
        "cityScore": [13, 12, 15, 7, 8, 17, 11],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 1 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 2 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 4 },
                    { "name": "重要生命线工程设施设防标准", "value": 3 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 2 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 4 },
                    { "name": "重要建筑物设防标准", "value": 2 },
                    { "name": "超高层建筑数量", "value": 3 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 2 },
                    { "name": "应急避难场所人均避难面积", "value": 3 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 4 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 3 },
                    { "name": "重要交通基础设施的设防标准", "value": 4 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 5 },
                    { "name": "人均应急疏散道路长度", "value": 2 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 3 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 2 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 3 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 1 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 5 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 3 },
                    { "name": "生态空间面积占比", "value": 4 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 3 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 2 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 5 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //重庆
    {
        "city": "重庆",
        "type": "standard",
        "cityScore": [9, 14, 13, 6, 7, 15, 9],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 3 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 1 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 2 },
                    { "name": "重要生命线工程设施设防标准", "value": 4 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 3 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 2 },
                    { "name": "重要建筑物设防标准", "value": 3 },
                    { "name": "超高层建筑数量", "value": 2 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 3 },
                    { "name": "应急避难场所人均避难面积", "value": 4 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 3 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 3 },
                    { "name": "重要交通基础设施的设防标准", "value": 2 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 3 },
                    { "name": "人均应急疏散道路长度", "value": 2 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 3 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 2 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 3 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 3 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 5 },
                    { "name": "生态空间面积占比", "value": 3 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 4 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 3 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 2 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 4 }
                ]
            }
        ]
    },
    //珠三角城市群
    {
        "city": "珠三角城市群",
        "type": "standard",
        "cityScore": [9, 15, 9, 11, 5, 11, 9],
        "details":
            [{
                "system": "生命线系统",
                "children":
                    [{ "name": "水源地模块化布置及连通程度", "value": 2 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 1 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 3 },
                    { "name": "重要生命线工程设施设防标准", "value": 2 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 2 }]
            },
            {
                "system": "重要建筑物",
                "children": [{ "name": "位于灾害危险区的重要建筑物比例", "value": 1 },
                { "name": "重要建筑物设防标准", "value": 2 },
                { "name": "超高层建筑数量", "value": 4 },
                { "name": "是否有灾中应急指挥固定场所", "value": 5 },
                { "name": "应急避难场所人均避难面积", "value": 1 },
                { "name": "消防救援5分钟可达覆盖率", "value": 2 }]
            }, {
                "system": "连接系统",
                "children":
                    [{ "name": "位于灾害危险区的重要交通基础设施比例", "value": 2 }, {
                        "name": "重要交通基础设施的设防标准", "value": 2
                    },
                    { "name": "重要公共服务设施的灾中可达性", "value": 2 },
                    { "name": "人均应急疏散道路长度", "value": 3 }]
            },
            {
                "system": "医疗服务系统",
                "children": [{ "name": "每十万人预留应急医疗设施用地面积", "value": 4 },
                { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                { "name": "医疗救护工程高峰时段反应时间", "value": 3 }]
            }, {
                "system": "污染处理系统",
                "children": [
                    {
                        "name": "污水、废弃物处理厂站的模块化布置程度", "value": 4
                    },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 1 }]
            }, {
                "system": "开放空间系统",
                "children": [{ "name": "河湖水面率", "value": 3 },
                { "name": "生态空间面积占比", "value": 1 },
                { "name": "满足防灾避险要求的城市绿地比例", "value": 2 },
                { "name": "降雨就地消纳率（可浸区面积比例）", "value": 5 }]
            },
            {
                "system": "其他",
                "children": [{ "name": "规划留白用地比例", "value": 5 },
                { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                { "name": "绘制风险地图的社区比例", "value": 1 }]
            }]
    },
    //宁波
    { "city": "宁波", "type": "standard", "cityScore": [11, 16, 14, 8, 6, 16, 12], "details": [{ "system": "生命线系统", "children": [{ "name": "水源地模块化布置及连通程度", "value": 2 }, { "name": "能源设施的模块化布置及连通程度", "value": 3 }, { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 3 }, { "name": "重要生命线工程设施设防标准", "value": 1 }, { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 2 }] }, { "system": "重要建筑物", "children": [{ "name": "位于灾害危险区的重要建筑物比例", "value": 2 }, { "name": "重要建筑物设防标准", "value": 3 }, { "name": "超高层建筑数量", "value": 4 }, { "name": "是否有灾中应急指挥固定场所", "value": 5 }, { "name": "应急避难场所人均避难面积", "value": 1 }, { "name": "消防救援5分钟可达覆盖率", "value": 1 }] }, { "system": "连接系统", "children": [{ "name": "位于灾害危险区的重要交通基础设施比例", "value": 3 }, { "name": "重要交通基础设施的设防标准", "value": 1 }, { "name": "重要公共服务设施的灾中可达性", "value": 5 }, { "name": "人均应急疏散道路长度", "value": 5 }] }, { "system": "医疗服务系统", "children": [{ "name": "每十万人预留应急医疗设施用地面积", "value": 4 }, { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 3 }, { "name": "医疗救护工程高峰时段反应时间", "value": 1 }] }, { "system": "污染处理系统", "children": [{ "name": "污水、废弃物处理厂站的模块化布置程度", "value": 2 }, { "name": "排水系统覆盖率和雨污分流比例", "value": 4 }] }, { "system": "开放空间系统", "children": [{ "name": "河湖水面率", "value": 4 }, { "name": "生态空间面积占比", "value": 5 }, { "name": "满足防灾避险要求的城市绿地比例", "value": 4 }, { "name": "降雨就地消纳率（可浸区面积比例）", "value": 3 }] }, { "system": "其他", "children": [{ "name": "规划留白用地比例", "value": 3 }, { "name": "土地利用方式与扰动风险特征适应", "value": 4 }, { "name": "绘制风险地图的社区比例", "value": 5 }] }] },
    //四会
    { "city": "四会", "type": "standard", "cityScore": [13, 19, 14, 7, 8, 13, 10], "details": [{ "system": "生命线系统", "children": [{ "name": "水源地模块化布置及连通程度", "value": 2 }, { "name": "能源设施的模块化布置及连通程度", "value": 3 }, { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 3 }, { "name": "重要生命线工程设施设防标准", "value": 3 }, { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 2 }] }, { "system": "重要建筑物", "children": [{ "name": "位于灾害危险区的重要建筑物比例", "value": 3 }, { "name": "重要建筑物设防标准", "value": 4 }, { "name": "超高层建筑数量", "value": 4 }, { "name": "是否有灾中应急指挥固定场所", "value": 2 }, { "name": "应急避难场所人均避难面积", "value": 3 }, { "name": "消防救援5分钟可达覆盖率", "value": 3 }] }, { "system": "连接系统", "children": [{ "name": "位于灾害危险区的重要交通基础设施比例", "value": 2 }, { "name": "重要交通基础设施的设防标准", "value": 4 }, { "name": "重要公共服务设施的灾中可达性", "value": 4 }, { "name": "人均应急疏散道路长度", "value": 4 }] }, { "system": "医疗服务系统", "children": [{ "name": "每十万人预留应急医疗设施用地面积", "value": 2 }, { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 2 }, { "name": "医疗救护工程高峰时段反应时间", "value": 3 }] }, { "system": "污染处理系统", "children": [{ "name": "污水、废弃物处理厂站的模块化布置程度", "value": 4 }, { "name": "排水系统覆盖率和雨污分流比例", "value": 4 }] }, { "system": "开放空间系统", "children": [{ "name": "河湖水面率", "value": 3 }, { "name": "生态空间面积占比", "value": 4 }, { "name": "满足防灾避险要求的城市绿地比例", "value": 1 }, { "name": "降雨就地消纳率（可浸区面积比例）", "value": 5 }] }, { "system": "其他", "children": [{ "name": "规划留白用地比例", "value": 3 }, { "name": "土地利用方式与扰动风险特征适应", "value": 4 }, { "name": "绘制风险地图的社区比例", "value": 3 }] }] },
    //广州
    {
        "city": "广州",
        "type": "standard",
        "cityScore": [12, 13, 9, 2, 11, 10, 9],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 3 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 2 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 1 },
                    { "name": "重要生命线工程设施设防标准", "value": 2 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 3 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 4 },
                    { "name": "重要建筑物设防标准", "value": 3 },
                    { "name": "超高层建筑数量", "value": 5 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 2 },
                    { "name": "应急避难场所人均避难面积", "value": 3 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 4 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 2 },
                    { "name": "重要交通基础设施的设防标准", "value": 4 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 3 },
                    { "name": "人均应急疏散道路长度", "value": 4 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 2 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 3 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 5 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 4 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 3 },
                    { "name": "生态空间面积占比", "value": 2 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 1 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 3 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 2 },
                    { "name": "绘制风险地图的社区比例", "value": 1 }
                ]
            }
        ]
    },
    //乌鲁木齐
    {
        "city": "乌鲁木齐",
        "type": "standard",
        "cityScore": [8, 10, 6, 4, 7, 9, 11],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 2 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 3 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 4 },
                    { "name": "重要生命线工程设施设防标准", "value": 1 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 2 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 3 },
                    { "name": "重要建筑物设防标准", "value": 2 },
                    { "name": "超高层建筑数量", "value": 1 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 4 },
                    { "name": "应急避难场所人均避难面积", "value": 3 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 5 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 4 },
                    { "name": "重要交通基础设施的设防标准", "value": 3 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 2 },
                    { "name": "人均应急疏散道路长度", "value": 1 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 3 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 2 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 1 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 5 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 4 },
                    { "name": "生态空间面积占比", "value": 3 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 2 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 4 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 2 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 5 },
                    { "name": "绘制风险地图的社区比例", "value": 3 }
                ]
            }
        ]
    },
    //东营
    {
        "city": "东营",
        "type": "standard",
        "cityScore": [10, 8, 11, 9, 7, 6, 12],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 4 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 3 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 2 },
                    { "name": "重要生命线工程设施设防标准", "value": 1 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 5 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 3 },
                    { "name": "重要建筑物设防标准", "value": 5 },
                    { "name": "超高层建筑数量", "value": 4 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 2 },
                    { "name": "应急避难场所人均避难面积", "value": 1 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 3 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 2 },
                    { "name": "重要交通基础设施的设防标准", "value": 4 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 3 },
                    { "name": "人均应急疏散道路长度", "value": 5 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 1 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 2 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 3 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 4 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 5 },
                    { "name": "生态空间面积占比", "value": 2 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 3 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 1 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 5 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //威海    
    {
        "city": "威海",
        "type": "standard",
        "cityScore": [9, 7, 11, 10, 8, 12, 6],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 3 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 2 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 4 },
                    { "name": "重要生命线工程设施设防标准", "value": 1 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 3 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 5 },
                    { "name": "重要建筑物设防标准", "value": 3 },
                    { "name": "超高层建筑数量", "value": 4 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 2 },
                    { "name": "应急避难场所人均避难面积", "value": 1 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 2 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 3 },
                    { "name": "重要交通基础设施的设防标准", "value": 4 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 5 },
                    { "name": "人均应急疏散道路长度", "value": 3 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 2 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 3 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 5 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 3 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 2 },
                    { "name": "生态空间面积占比", "value": 4 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 5 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 1 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 3 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 5 },
                    { "name": "绘制风险地图的社区比例", "value": 4 }
                ]
            }
        ]
    },
    //淄博
    {
        "city": "淄博",
        "type": "standard",
        "cityScore": [8, 12, 9, 10, 6, 11, 7],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 2 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 4 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 1 },
                    { "name": "重要生命线工程设施设防标准", "value": 3 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 4 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 4 },
                    { "name": "重要建筑物设防标准", "value": 2 },
                    { "name": "超高层建筑数量", "value": 3 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 5 },
                    { "name": "应急避难场所人均避难面积", "value": 1 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 3 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 3 },
                    { "name": "重要交通基础设施的设防标准", "value": 4 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 5 },
                    { "name": "人均应急疏散道路长度", "value": 2 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 3 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 2 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 5 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 4 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 3 },
                    { "name": "生态空间面积占比", "value": 2 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 5 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 3 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 1 },
                    { "name": "绘制风险地图的社区比例", "value": 5 }
                ]
            }
        ]
    },
    //连云港
    {
        "city": "连云港",
        "type": "standard",
        "cityScore": [10, 8, 12, 7, 9, 11, 6],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 3 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 4 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 2 },
                    { "name": "重要生命线工程设施设防标准", "value": 5 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 3 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 1 },
                    { "name": "重要建筑物设防标准", "value": 5 },
                    { "name": "超高层建筑数量", "value": 3 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 2 },
                    { "name": "应急避难场所人均避难面积", "value": 4 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 1 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 4 },
                    { "name": "重要交通基础设施的设防标准", "value": 3 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 2 },
                    { "name": "人均应急疏散道路长度", "value": 5 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 3 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 5 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 5 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 3 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 2 },
                    { "name": "生态空间面积占比", "value": 1 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 4 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 5 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //鄂州    
    {
        "city": "鄂州",
        "type": "standard",
        "cityScore": [10, 12, 8, 3, 9, 11, 10],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 2 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 4 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 3 },
                    { "name": "重要生命线工程设施设防标准", "value": 2 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 1 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 3 },
                    { "name": "重要建筑物设防标准", "value": 5 },
                    { "name": "超高层建筑数量", "value": 2 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 4 },
                    { "name": "应急避难场所人均避难面积", "value": 3 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 2 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 4 },
                    { "name": "重要交通基础设施的设防标准", "value": 1 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 3 },
                    { "name": "人均应急疏散道路长度", "value": 4 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 3 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 4 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 3 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 2 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 3 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 5 },
                    { "name": "生态空间面积占比", "value": 3 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 4 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 2 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //佛山  
    {
        "city": "佛山",
        "type": "foshan",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //肇庆 
    {
        "city": "肇庆",
        "type": "zhaoqing",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //深圳 
    {
        "city": "深圳",
        "type": "shenzhen",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //东莞
    {
        "city": "东莞",
        "type": "dongguan",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //惠州
    {
        "city": "惠州",
        "type": "huizhou",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //珠海
    {
        "city": "珠海",
        "type": "zhuhai",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //中山
    {
        "city": "中山",
        "type": "zhongshan",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
    //江门
    {
        "city": "江门",
        "type": "jiangmen",
        "cityScore": [0, 0, 0, 0, 0, 0, 0],
        "details": [
            {
                "system": "生命线系统",
                "children": [
                    { "name": "水源地模块化布置及连通程度", "value": 0 },
                    { "name": "能源设施的模块化布置及连通程度", "value": 0 },
                    { "name": "饮用水、能源和食物的应急储备率和覆盖人口比例", "value": 0 },
                    { "name": "重要生命线工程设施设防标准", "value": 0 },
                    { "name": "菜市场（生鲜超市）灾中可步行10分钟覆盖率", "value": 0 }
                ]
            },
            {
                "system": "重要建筑物",
                "children": [
                    { "name": "位于灾害危险区的重要建筑物比例", "value": 0 },
                    { "name": "重要建筑物设防标准", "value": 0 },
                    { "name": "超高层建筑数量", "value": 0 },
                    { "name": "是否有灾中应急指挥固定场所", "value": 0 },
                    { "name": "应急避难场所人均避难面积", "value": 0 },
                    { "name": "消防救援5分钟可达覆盖率", "value": 0 }
                ]
            },
            {
                "system": "连接系统",
                "children": [
                    { "name": "位于灾害危险区的重要交通基础设施比例", "value": 0 },
                    { "name": "重要交通基础设施的设防标准", "value": 0 },
                    { "name": "重要公共服务设施的灾中可达性", "value": 0 },
                    { "name": "人均应急疏散道路长度", "value": 0 }
                ]
            },
            {
                "system": "医疗服务系统",
                "children": [
                    { "name": "每十万人预留应急医疗设施用地面积", "value": 0 },
                    { "name": "社区卫生服务设施步行15分钟覆盖率", "value": 0 },
                    { "name": "医疗救护工程高峰时段反应时间", "value": 0 }
                ]
            },
            {
                "system": "污染处理系统",
                "children": [
                    { "name": "污水、废弃物处理厂站的模块化布置程度", "value": 0 },
                    { "name": "排水系统覆盖率和雨污分流比例", "value": 0 }
                ]
            },
            {
                "system": "开放空间系统",
                "children": [
                    { "name": "河湖水面率", "value": 0 },
                    { "name": "生态空间面积占比", "value": 0 },
                    { "name": "满足防灾避险要求的城市绿地比例", "value": 0 },
                    { "name": "降雨就地消纳率（可浸区面积比例）", "value": 0 }
                ]
            },
            {
                "system": "其他",
                "children": [
                    { "name": "规划留白用地比例", "value": 4 },
                    { "name": "土地利用方式与扰动风险特征适应", "value": 3 },
                    { "name": "绘制风险地图的社区比例", "value": 2 }
                ]
            }
        ]
    },
];

//多选框的选项
const COMPRoptions = [
    {
        value: "珠三角城市群",
        label: "珠三角城市群（除广州）",
        disabled: false,
        children: [
            {
                value: "佛山",
                label: "佛山",
                disabled: false,
            },
            {
                value: "肇庆",
                label: "肇庆",
                disabled: false,
            },
            {
                value: "深圳",
                label: "深圳",
                disabled: false,
            },
            {
                value: "东莞",
                label: "东莞",
                disabled: false,
            },
            {
                value: "惠州",
                label: "惠州",
                disabled: false,
            },
            {
                value: "珠海",
                label: "珠海",
                disabled: false,
            },
            {
                value: "中山",
                label: "中山",
                disabled: false,
            },
            {
                value: "江门",
                label: "江门",
                disabled: false,
            },
        ],
    },
    {
        value: "直辖市",
        label: "直辖市",
        disabled: false,
        children: [
            {
                value: "上海",
                label: "上海",
                disabled: false,
            },
            {
                value: "重庆",
                label: "重庆",
                disabled: false,
            },
        ],
    },
    {
        value: "省会城市",
        label: "省会城市",
        disabled: false,
        children: [
            {
                value: "广州",
                label: "广州",
                disabled: false,
            },
            {
                value: "乌鲁木齐",
                label: "乌鲁木齐",
                disabled: false,
            },
        ],
    },
    {
        value: "计划单列市",
        label: "计划单列市",
        disabled: false,
        children: [
            {
                value: "宁波",
                label: "宁波",
                disabled: false,
            },
        ],
    },
    {
        value: "地级市",
        label: "地级市",
        disabled: false,
        children: [
            {
                value: "东营",
                label: "东营",
                disabled: false,
            },
            {
                value: "威海",
                label: "威海",
                disabled: false,
            },
            {
                value: "淄博",
                label: "淄博",
                disabled: false,
            },
            {
                value: "连云港",
                label: "连云港",
                disabled: false,
            },
            {
                value: "无锡",
                label: "无锡",
                disabled: false,
            },
            {
                value: "鄂州",
                label: "鄂州",
                disabled: false,
            },
            {
                value: "四会",
                label: "四会",
                disabled: false,
            },
        ],
    },
];


export {
    targetData,
    options,
    Soptions,
    Coptions,
    Poptions,
    moniData,
    COMPRoptions,
}

const explodeData = {
    "shanghai": {
        StationOptions: [{
            value: '121.810307',
            label: '中国石化（九华加油站）'
        }, {
            value: '121.610393',
            label: '中国石化（金科加油站）'
        }, {
            value: '121.562878',
            label: '中国石化（北蔡加油站）'
        }, {
            value: '121.574445',
            label: '中国石油加油站（绿缘别墅南站）'
        }, {
            value: '121.548392',
            label: '中国石化（花木加油站）'
        }, {
            value: '121.403282',
            label: '中国石化（远中加油站）'
        }, {
            value: '121.519967',
            label: '中国石化（联明加油站）'
        }, {
            value: '121.575919',
            label: '中国石化（锦绣加油站）'
        }, {
            value: '121.320907',
            label: '中国石化（扬虹加油站）'
        }, {
            value: '121.573535',
            label: '中国石化（羽山路加油站）'
        }],
    },
    "chongqing": {
        StationOptions: [

        ],
    },
    "guangzhou": {
        StationOptions: [{
            value: '113.260752',
            label: '中国石化(瑶台加油站)'
        }, {
            value: '113.252745',
            label: '中国石化(站前路加油站)'
        }, {
            value: '113.302003',
            label: '中国石化(农林加油站)'
        }, {
            value: '113.322296',
            label: '中国石化(珠江二加油站)'
        }, {
            value: '113.37707',
            label: '中国石化(东郊加油站)'
        }],
    },
    "wulumuqi": {
        StationOptions: [

        ],
    },
    "ningbo": {
        StationOptions: [

        ],
    },
    "dongying": {
        StationOptions: [

        ],
    },
    "weihai": {
        StationOptions: [

        ],
    },
    "zibo": {
        StationOptions: [

        ],
    },
    "lianyungang": {
        StationOptions: [

        ],
    },
    "wuxi": {
        StationOptions: [

        ],
    },
    "ezhou": {
        StationOptions: [

        ],
    },
    "sihui": {
        StationOptions: [

        ],
    }
};

let stationData = [
    {
        id: 1, name: "中国石化（九华加油站）", lng: 121.810307, lat: 31.164832,
        data: [{ lng: 121.810307, lat: 31.164832, count: 100 }],
        gridData: [{ type: '建筑', level: '高', name: '中国石化（九华加油站）' },
        { type: '道路', level: '高', name: '东启航路' },
        { type: '道路', level: '高', name: '海天东六路' },
        { type: '道路', level: '高', name: '迎宾高速' },
        { type: '道路', level: '中', name: '启航路' },
        { type: '道路', level: '中', name: '海天六路' },
        { type: '建筑', level: '中', name: '神州租车' },
        { type: '建筑', level: '低', name: '上海浦东国际机场' },
        { type: '建筑', level: '低', name: '春秋航空' }]
    },
    {
        id: 2, name: "中国石化（金科加油站）", lng: 121.610393, lat: 31.203467,
        data: [{ lng: 121.610393, lat: 31.203467, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（金科加油站）' },
            { type: '建筑', level: '高', name: '上海浦东软件园（祖冲之园）' },
            { type: '建筑', level: '高', name: '汇智湖畔家园' },
            { type: '建筑', level: '高', name: '国家生物医药基地' },
            { type: '道路', level: '高', name: '高科中路' },
            { type: '道路', level: '中', name: '金科路' },
            { type: '道路', level: '中', name: '李冰路' },
            { type: '建筑', level: '低', name: '上海中医药大学' },
            { type: '建筑', level: '低', name: '上海实验动物研究中心' },
            { type: '建筑', level: '低', name: '张江高科技园区' }]
    },
    {
        id: 3, name: "中国石化（北蔡加油站）", lng: 121.562878, lat: 31.186656,
        data: [{ lng: 121.562878, lat: 31.186656, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（北蔡加油站）' },
            { type: '建筑', level: '高', name: '东联大厦' },
            { type: '建筑', level: '高', name: '莲中二村' },
            { type: '道路', level: '高', name: '沪南路' },
            { type: '道路', level: '高', name: '高科中路' },
            { type: '道路', level: '中', name: '川杨河桥' },
            { type: '道路', level: '中', name: '莲中路' },
            { type: '建筑', level: '中', name: '龙博公寓' },
            { type: '建筑', level: '中', name: '北中路278弄小区' },
            { type: '建筑', level: '中', name: '北中路280弄小区' },
            { type: '建筑', level: '中', name: '莲中路191弄小区' },
            { type: '建筑', level: '低', name: '北蔡镇中心小学' },
            { type: '建筑', level: '低', name: '莲琼苑' },
            { type: '建筑', level: '低', name: '莲溪一村' },
            { type: '建筑', level: '低', name: '上海市浦东新区莲溪小学' }]
    },

    {
        id: 4, name: "中国石油加油站（绿缘别墅南站）", lng: 121.574445, lat: 31.146094,
        data: [{ lng: 121.574445, lat: 31.146094, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石油加油站（绿缘别墅南站）' },
            { type: '建筑', level: '高', name: '绿缘别墅' },
            { type: '建筑', level: '高', name: '周康二村' },
            { type: '道路', level: '高', name: '沪南公路' },
            { type: '道路', level: '高', name: '秀康路' },
            { type: '建筑', level: '中', name: '中国交通建设工程学院' },
            { type: '建筑', level: '中', name: '上海市公安局交通警察总队车辆管理所' },
            { type: '道路', level: '中', name: '秀沈路' },
            { type: '建筑', level: '低', name: '上海申花足球训练基地' },
            { type: '建筑', level: '低', name: '周康新苑' },
            { type: '建筑', level: '低', name: '绿宝馥庭' },
            { type: '建筑', level: '低', name: '周康四村' },
            { type: '建筑', level: '低', name: '中邦城市' }]
    },

    {
        id: 5, name: "中国石化（花木加油站）", lng: 121.548392, lat: 31.212856,
        data: [{ lng: 121.548392, lat: 31.212856, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（花木加油站）' },
            { type: '建筑', level: '高', name: '梅花苑' },
            { type: '建筑', level: '高', name: '牡丹苑' },
            { type: '建筑', level: '高', name: '瑞达苑' },
            { type: '建筑', level: '高', name: '锦绣苑' },
            { type: '道路', level: '高', name: '浦建路' },
            { type: '建筑', level: '中', name: '锦绣满堂花园' },
            { type: '建筑', level: '中', name: '牡丹小区' },
            { type: '建筑', level: '中', name: '花木苑' },
            { type: '建筑', level: '中', name: '上海市建平香梅中学' },
            { type: '道路', level: '中', name: '锦绣路' },
            { type: '道路', level: '中', name: '梅花路' },
            { type: '建筑', level: '低', name: '香梅花园' },
            { type: '建筑', level: '低', name: '锦绣天地花园' },
            { type: '道路', level: '低', name: '玉兰路' },]
    },

    {
        id: 6, name: "中国石化（远中加油站）", lng: 121.403282, lat: 31.178059,
        data: [{ lng: 121.403282, lat: 31.178059, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（远中加油站）' },
            { type: '建筑', level: '高', name: '航天新苑' },
            { type: '建筑', level: '高', name: '民润大厦' },
            { type: '建筑', level: '高', name: '新思大楼' },
            { type: '道路', level: '高', name: '虹许路' },
            { type: '道路', level: '高', name: '中环路' },
            { type: '道路', level: '高', name: '虹梅路' },
            { type: '建筑', level: '中', name: '虹梅小区' },
            { type: '建筑', level: '中', name: '漕河泾开发区企业园艺文化园' },
            { type: '建筑', level: '中', name: '复星科技园' },
            { type: '建筑', level: '中', name: '永兆豪庭' },
            { type: '道路', level: '中', name: '桂果路' },
            { type: '建筑', level: '低', name: '新业园' },
            { type: '建筑', level: '低', name: '长兴园' },
            { type: '建筑', level: '低', name: '虹兴苑小区' },
            { type: '建筑', level: '低', name: '上海嘉会国际医院' },
            { type: '建筑', level: '低', name: '漕河泾开发区公园' },]
    },

    {
        id: 7, name: "中国石化（联明加油站）", lng: 121.519967, lat: 31.156419,
        data: [{ lng: 121.519967, lat: 31.156419, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（联明加油站）' },
            { type: '建筑', level: '高', name: '上海三林联丰文化活动中心' },
            { type: '建筑', level: '高', name: '翰锦苑' },
            { type: '道路', level: '高', name: '三林北港桥' },
            { type: '道路', level: '高', name: '联明路' },
            { type: '建筑', level: '中', name: '都林嘉苑' },
            { type: '建筑', level: '中', name: '上海市实验学校南校' },
            { type: '建筑', level: '中', name: '东方医院南院' },
            { type: '道路', level: '中', name: '华夏西路' },
            { type: '道路', level: '中', name: '中环路' },
            { type: '道路', level: '中', name: '云台路' },
            { type: '道路', level: '中', name: '杨南路' },
            { type: '道路', level: '中', name: '洪山路' },
            { type: '建筑', level: '低', name: '尚桂苑' },
            { type: '建筑', level: '低', name: '翰城国际' },]
    },

    {
        id: 8, name: "中国石化（锦绣加油站）", lng: 121.575919, lat: 31.232236,
        data: [{ lng: 121.575919, lat: 31.232236, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（锦绣加油站）' },
            { type: '建筑', level: '高', name: '天合金桂家园' },
            { type: '建筑', level: '高', name: '东方幼儿园' },
            { type: '道路', level: '高', name: '锦绣路' },
            { type: '道路', level: '高', name: '罗山路' },
            { type: '建筑', level: '中', name: '吉云公寓' },
            { type: '建筑', level: '低', name: '上海瑞东医院' },
            { type: '建筑', level: '低', name: '浦东虹桥花园' }]
    },

    {
        id: 9, name: "中国石化（扬虹加油站）", lng: 121.320907, lat: 31.207077,
        data: [{ lng: 121.320907, lat: 31.207077, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（扬虹加油站）' },
            { type: '建筑', level: '高', name: '上海协信星光天地' },
            { type: '建筑', level: '高', name: '万科时一区' },
            { type: '道路', level: '高', name: '扬虹路' },
            { type: '道路', level: '高', name: '申长路' },
            { type: '道路', level: '高', name: '泰虹路' },
            { type: '建筑', level: '中', name: '虹桥汇' },
            { type: '建筑', level: '中', name: '虹桥万科中心' },
            { type: '道路', level: '中', name: '申虹路' },
            { type: '道路', level: '中', name: '兴虹路' },
            { type: '道路', level: '中', name: '通虹路' },
            { type: '建筑', level: '低', name: '上海虹桥站' },
            { type: '建筑', level: '低', name: '正荣中心北区' }]
    },

    {
        id: 10, name: "中国石化（羽山路加油站）", lng: 121.573535, lat: 31.250408,
        data: [{ lng: 121.573535, lat: 31.250408, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（羽山路加油站）' },
            { type: '建筑', level: '高', name: '天虹苑' },
            { type: '建筑', level: '高', name: '天枫公寓' },
            { type: '建筑', level: '高', name: '名人苑' },
            { type: '建筑', level: '高', name: '艾山新村' },
            { type: '道路', level: '高', name: '羽山路' },
            { type: '道路', level: '高', name: '金杨路' },
            { type: '道路', level: '高', name: '德平路' },
            { type: '建筑', level: '中', name: '香山新村西北街坊' },
            { type: '建筑', level: '中', name: '香山集贸市场' },
            { type: '建筑', level: '中', name: '天元公寓' },
            { type: '道路', level: '中', name: '张杨路' },
            { type: '建筑', level: '低', name: '上泰花苑' },
            { type: '建筑', level: '低', name: '住友名人花园' },
            { type: '建筑', level: '低', name: '香山新村东北街坊' }]
    },

    {
        id: 11, name: "中国石化（瑶台加油站）", lng: 113.260752, lat: 23.162255,
        data: [{ lng: 113.260752, lat: 23.162255, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（瑶台加油站）' },
            { type: '建筑', level: '高', name: '广州市公安局交通警察支队环城大队' },
            { type: '建筑', level: '高', name: '广东技术师范大学（北校区）' },
            { type: '道路', level: '高', name: '广园西路' },
            { type: '建筑', level: '中', name: '广州市白云区妇幼保健院' },
            { type: '建筑', level: '中', name: '龙头美食城' },
            { type: '建筑', level: '中', name: '尚峰广场' },
            { type: '建筑', level: '中', name: '御龙服装城' },
            { type: '道路', level: '中', name: '瑶台大街' },
            { type: '建筑', level: '低', name: '瑶台瑶池北街小区' },
            { type: '建筑', level: '低', name: '隆台逸品君庭' }]
    },

    {
        id: 12, name: "中国石化(站前路加油站)", lng: 113.252745, lat: 23.144831,
        data: [{ lng: 113.252745, lat: 23.144831, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（站前路加油站）' },
            { type: '建筑', level: '高', name: '广铁西站小区' },
            { type: '建筑', level: '高', name: '医药大厦' },
            { type: '建筑', level: '高', name: '西郊大厦' },
            { type: '道路', level: '高', name: '流花路' },
            { type: '道路', level: '高', name: '站前路' },
            { type: '建筑', level: '中', name: '广州市流花中学' },
            { type: '建筑', level: '中', name: '流花路小学' },
            { type: '建筑', level: '中', name: '流花华侨新村' },
            { type: '建筑', level: '中', name: '流花湖公园' },
            { type: '道路', level: '中', name: '西湾东路' },
            { type: '建筑', level: '低', name: '荔湾区流花路小学（西校区）' },
            { type: '建筑', level: '低', name: '流花君庭' },
            { type: '建筑', level: '低', name: '广东广雅中学（本部校区）' },
            { type: '道路', level: '低', name: '东风西路' },]
    }
    ,

    {
        id: 13, name: "中国石化(农林加油站)", lng: 113.302003, lat: 23.132346,
        data: [{ lng: 113.302003, lat: 23.132346, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（农林加油站）' },
            { type: '建筑', level: '高', name: '马棚岚小区' },
            { type: '建筑', level: '高', name: '东山锦轩现代城' },
            { type: '建筑', level: '高', name: '广东药科大学附属第一医院' },
            { type: '建筑', level: '中', name: '百好居' },
            { type: '建筑', level: '中', name: '广州市执信南路小学' },
            { type: '建筑', level: '中', name: '东山口职工住宅小区' },
            { type: '建筑', level: '中', name: '安安幼儿园' },
            { type: '道路', level: '中', name: '东华北路' },
            { type: '道路', level: '中', name: '内环路' },
            { type: '建筑', level: '低', name: '中山大学附属第一医院' },
            { type: '建筑', level: '低', name: '广州铁路大厦' },
            { type: '建筑', level: '低', name: '越秀东园' },
            { type: '建筑', level: '低', name: '广州市第七中学初中部' }]
    }
    ,

    {
        id: 14, name: "中国石化(珠江二加油站)", lng: 113.322296, lat: 23.122579,
        data: [{ lng: 113.322296, lat: 23.122579, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（珠江二加油站）' },
            { type: '建筑', level: '高', name: '富力爱丁堡国际公寓' },
            { type: '道路', level: '高', name: '广州大道中' },
            { type: '建筑', level: '中', name: '东山实验小学' },
            { type: '建筑', level: '中', name: '保利香槟花园' },
            { type: '建筑', level: '中', name: '广东省政协' },
            { type: '道路', level: '中', name: '广州大道珠江新城隧道' },
            { type: '道路', level: '中', name: '明月二路' },
            { type: '道路', level: '中', name: '临江大道' },
            { type: '道路', level: '中', name: '花城大道' },
            { type: '建筑', level: '低', name: '东湖社区' },
            { type: '建筑', level: '低', name: '国家税务总局广州市税务局' },
            { type: '建筑', level: '低', name: '广州海关大楼' },
            { type: '建筑', level: '低', name: '嘉裕君玥公馆' },
            { type: '建筑', level: '低', name: '美国驻广州总领事馆' },
            { type: '道路', level: '低', name: '广州大桥' },]
    }
    ,

    {
        id: 15, name: "中国石化(东郊加油站)", lng: 113.37707, lat: 23.127306,
        data: [{ lng: 113.37707, lat: 23.127306, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石化（东郊加油站）' },
            { type: '建筑', level: '高', name: '广州天河软件园科韵园区南区' },
            { type: '建筑', level: '高', name: '五羊小区' },
            { type: '道路', level: '高', name: '黄埔大道中' },
            { type: '建筑', level: '中', name: '广州市天河区中医医院' },
            { type: '建筑', level: '中', name: '腰岚小区' },
            { type: '建筑', level: '中', name: '粤大金融城国际酒店' },
            { type: '建筑', level: '中', name: '天河区财政局' },
            { type: '建筑', level: '低', name: '广州天河软件园科韵园区北区' },
            { type: '建筑', level: '低', name: '海景花园' },
            { type: '建筑', level: '低', name: '员村四横路自编10号大院' },
            { type: '道路', level: '低', name: '科韵路' },]
    }
    ,

    {
        id: 16, name: "中国石油(杨高南路浦三路口加油站)", lng: 121.527074, lat: 31.185428,
        data: [{ lng: 121.527074, lat: 31.185428, count: 100 }],
        gridData: [
            { type: '建筑', level: '高', name: '中国石油(杨高南路浦三路口加油站)' },
            { type: '建筑', level: '高', name: '浦三锦苑' },
            { type: '道路', level: '高', name: '浦三路' },
            { type: '道路', level: '高', name: '杨高南路' },
            { type: '建筑', level: '中', name: '昌五小区' },
            { type: '建筑', level: '中', name: '大华锦绣华城四街坊' },
            { type: '建筑', level: '低', name: '轻工六里小区' },
            { type: '建筑', level: '低', name: '上海市上南中学北校' },
            { type: '建筑', level: '低', name: '艾东小区' },]
    }
    // ...此处添加更多的数据集
];

export {explodeData,stationData};
// 后端请求相关函数
import axios from "axios";
import ajax from "../simulator/ajax";
import serverInfo from '../simulator/serverInfo';

// 地图相关函数
import *  as mapUtils from "./mapUtils";

// 保存文件
import { saveAs } from 'file-saver';

// 获取模拟任务列表
export function getTaskList(bindThis, callback) {
    const that = bindThis;
    ajax("/simulation/processes")
        .then((res) => {
            res.sort((a, b) => { return a.id - b.id });
            res.forEach((r) => {
                r["simulationDate"] = new Date(r.simulationDate).toLocaleString();
                if (r.simulationState === 'processing') {
                    r.simulationTime = "计算中";
                }
                else {
                    r.simulationTime = (parseInt(r.simulationTime) / 1000).toString() + " 秒";
                }
                r["taskType"] = "现状模拟";
                r["status"] = r.simulationState;
                r["city"] = r.simulationArea;
                that.floodSimulationList.push(r);
                if (r.city === that.city)
                    that.currentTask = r;
            });
            that.simulationTaskList = [...that.floodSimulationList,...that.infectionSimulationList];

            that.$message({
                message: "获取模拟任务列表成功",
                type: "success",
            });
            if (callback) {
                callback();
            }
        })
        .catch((err) => {
            console.log(err, 11);
            if (err.message.indexOf("timeout") !== -1) {
                that.$message({
                    message: "获取模拟任务列表失败",
                    type: "error",
                });
            }
        });
}

// 获取任务结果
export async function getTaskResult(bindThis, task, callback) {
    const that = bindThis;

    // console.log("Task:", task);
    const resultTypes = ["submergedcells", "availableroads", "dangerousroads", "submergedroads"];
    const times = ["4", "8", "12", "16", "20", "24"];
    let resCount = 0, resultLens = {};
    resultTypes.forEach((resultType) => {
        resultLens[resultType] = {};
        times.forEach(async (time) => {
            try {
                let len = await ajax(`information/simulation/length/${task.id}/${resultType}/${time}`);
                resultLens[resultType][`${time}`] = len;
                // console.log(`获取模拟数据 ${resultType}:${time} 成功！`);
            }
            catch {
                console.log(`获取模拟数据 ${resultType}:${time} 失败！`);
            }
            finally {
                // mapUtils.buildMapAtTime(that, that.stepTimeMap[that.activeTimeIndex]);
                resCount++;
                //所有请求结束
                if (resCount >= resultTypes.length * times.length) {
                    that.infoTask = {
                        resultLens: resultLens,
                        date: task.simulationDate,
                        area: task.simulationArea,
                        id: task.id,
                        computeTime: task.simulationTime,
                    };
                    that.$message({
                        message: "获取模拟任务数据完成",
                        type: "success",
                    });
                    // 处理数据并添加图层
                    mapUtils.buildMapAtTime(that, that.stepTimeMap[that.activeTimeIndex]);

                    if (callback) callback();
                }
            }
        });
    });

}

// 获取数据信息
export function getDataInfo(bindThis) {
    const that = bindThis;
    that.dataFileList.forEach((item, index) => {
        let formData = new FormData();
        formData.append("city", that.city);
        formData.append("type", item.type);
        let url = serverInfo.baseURL_file + "/search";
        let headers = {
            "Content-Type": "multipart/form-data",
        };
        axios
            .post(url, formData, { headers: headers })
            .then((res) => {
                if (res.data.status === true) {
                    that.dataFileList[index].status = true;
                    that.dataFileList[index].filesInfo = res.data.files;
                    res.data.files.forEach((file) => {
                        file.type = item.type;
                    });
                    if (item.type in that.hasLayers_basic) {
                        getBasicGeomData(that, item.type);
                    }
                }
                else {
                    that.dataFileList[index].status = false;
                }
            })
            .catch((err) => {
                console.log(err);
                that.$message({
                    message: "获取数据信息失败",
                    type: "error",
                });
            });
    });
}

// 上传数据
export function uploadData(bindThis, dataItem, callback) {
    const that = bindThis;
    let formData = new FormData();
    formData.append("city", that.city);
    formData.append("type", dataItem.type);
    dataItem.files.forEach((f) => {
        formData.append("files", f.raw);
    });
    let url = serverInfo.baseURL_file + "/upload";
    let headers = {
        "Content-Type": "multipart/form-data",
    };
    axios
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.status === true) {
                that.$message({
                    message: "上传文件成功",
                    type: "success",
                });
                if (callback) callback();
            }
            else {
                that.$message({
                    message: that.data.msg,
                    type: "warning",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "上传文件失败",
                type: "error",
            });
        });
}

// 获取图层数据
async function getBasicGeomData(bindThis, type) {
    const that = bindThis;
    try {
        let res = await ajax(`information/getstaticdata?city=${that.city}&type=${type}&maxlen=${that.resultMaxLen}`);
        mapUtils.buildStaticLayer(that, type, res);
        that.hasLayers_basic[type] = true;
        that.$message({
            message: `获取${that.layerNames_basic[type]}图层数据成功`,
            type: "success",
        });
    }
    catch {
        that.$message({
            message: `获取${that.layerNames_basic[type]}图层数据失败`,
            type: "error",
        });
    }

}

// 发布图层
export async function publishGeo(city, type) {
    try {
        let res = await ajax(`information/publishGeo/${city}/${type}`);
        that.$message({
            message: `发布图层数据状态：${res}`,
            type: "success",
        });
    }
    catch {
        that.$message({
            message: `发布图层数据失败`,
            type: "warning",
        });
    }

}

// 获取应急选址结果信息
export function getPlanResultInfo(bindThis) {
    const that = bindThis;

    const levelNames = {
        1: "小雨",
        2: "中雨",
        3: "大雨",
        4: "暴雨",
        5: "大暴雨",
        6: "特大暴雨"
    };
    const typeNames = {
        "Shelter-alternative_point": "避难安置场所选址",
        "Shelter-result": "风险点至避难安置场所路线",
        "Shelter-risk": "避难安置场所风险点",
        "Shelter-straight_line_res": "风险点至避难安置场所直线",

        "Supply-alternative_point": "应急物资供应设施选址",
        "Supply-result": "风险点至物资供应点路线",
        "Supply-risk": "应急物资供应风险点",
        "Supply-straight_line_res": "风险点至物资供应点直线",

        "Aid-alternative_point": "急救站选址",
        "Aid-result": "风险点至急救站路线",
        "Aid-risk": "急救站风险点",
        "Aid-straight_line_res": "风险点至急救站直线",
    };

    let formData = new FormData();
    formData.append("city", that.city);
    let url = serverInfo.baseURL_file + "/searchPlan";
    let headers = {
        "Content-Type": "multipart/form-data",
    };
    axios
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.status === true) {
                that.emergencyPlanData = res.data.files
                res.data.files.forEach((item) => {
                    item["name"] = `${levelNames[item.level]}淹没图层-${item.time}h-${typeNames[`${item.sheme}-${item.type}`]}`;
                    item["layerName"] = `${item.sheme}-${item.level}-${item.time}-${item.type}`;
                })
            }
            else {
            }
            that.$message({
                message: "获取应急选址结果信息成功",
                type: "success",
            });
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "获取应急选址结果信息失败",
                type: "error",
            });
        })
}


// 获取应急选址结果
export async function getPlanResult(bindThis, plan) {
    const that = bindThis;

    try {
        // let url = `information/gisdata/${that.city}/${plan.sheme}/${plan.level}/${plan.time}/${plan.type}`;
        let url = `information/gisdata/${that.city}/${plan.planNumber}/${plan.sheme}/${plan.level}/${plan.time}/${plan.type}`;
        let result = await ajax(url);
        mapUtils.buildPlanLayer(that, plan, result);
        console.log(`获取应急选址结果数据 ${plan.name} 成功！`);
    }
    catch {
        console.log(`获取应急选址结果数据 ${plan.name} 失败！`);
    }

}

// 提交暴雨洪涝模拟任务
export function submitFloodSimulation(bindThis,callback) {
    const that = bindThis;
    if (
        Number(that.floodParam["Movement direction"]) > 360 ||
        Number(that.floodParam["Movement direction"]) < 0
    ) {
        return that.$message.error("移动方向必须在0-360之间");
    }
    if (
        Number(that.floodParam["Diffusion rate"]) > 1 ||
        Number(that.floodParam["Diffusion rate"]) < 0
    ) {
        return that.$message.error("扩散速率必须在0-1之间");
    }
    if (
        Number(that.floodParam["InitX"]) > 1 ||
        Number(that.floodParam["InitX"]) < 0
    ) {
        return that.$message.error("初始降雨中心点X坐标必须在0-1之间");
    }
    if (
        Number(that.floodParam["InitY"]) > 1 ||
        Number(that.floodParam["InitY"]) < 0
    ) {
        return that.$message.error("初始降雨中心点Y坐标必须在0-1之间");
    }
    if (
        Number(that.floodParam["Radius"]) > 1 ||
        Number(that.floodParam["Radius"]) < 0
    ) {
        return that.$message.error("降雨半径必须在0-1之间");
    }
    if (
        Number(that.floodParam["Movement speed"]) > 1 ||
        Number(that.floodParam["Movement speed"]) < 0
    ) {
        return that.$message.error("移动速度必须在0-1之间");
    }
    if (Number(that.floodParam["Rainfall per hour"]) < 0) {
        return that.$message.error("每小时降雨量不可以是负数");
    }

    //年降水文件导入后，相关的的输入参数合法判断
    if (
        Number(that.floodParam["Rain band initX"]) > 1 ||
        Number(that.floodParam["Rain band initX"]) < 0
    ) {
        return that.$message.error("降雨带中心点X坐标必须在0-1之间")
    }
    if (
        Number(that.floodParam["Rain band initY"]) > 1 ||
        Number(that.floodParam["Rain band initY"]) < 0
    ) {
        return that.$message.error("降雨带中心点Y坐标必须在0-1之间")
    }
    if (
        Number(that.floodParam["Rain band width"]) > 1 ||
        Number(that.floodParam["Rain band width"]) < 0
    ) {
        return that.$message.error("降雨带宽度必须在0-1之间")
    }
    if (
        Number(that.floodParam["Rain band length"]) > 1 ||
        Number(that.floodParam["Rain band length"]) < 0
    ) {
        return that.$message.error("降雨带宽度必须在0-1之间")
    }
    if (
        Number(that.floodParam["Rain band intensity"]) < 0
    ) {
        return that.$message.error("降雨带中心区域降雨强度不可以是负数")
    }
    if (
        Number(that.floodParam["Wind start"]) > 360 ||
        Number(that.floodParam["Wind start"]) < 0
    ) {
        return that.$message.error("降雨带0h移动方向必须在0-360之间");
    }
    if (
        Number(that.floodParam["Wind end"]) > 360 ||
        Number(that.floodParam["Wind end"]) < 0
    ) {
        return that.$message.error("降雨带24h移动方向必须在0-360之间");
    }
    if (
        Number(that.floodParam["Wind speed"]) < 0
    ) {
        return that.$message.error("降雨带移动速度不可以是负数")
    }



    const loading = that.$loading({
        lock: true,
        text: "暴雨洪涝模拟任务上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
    });


    let headers = {
        "Content-Type": "multipart/form-data",
    };

    let formData = new FormData();

    formData.append("type", "flood");
    formData.append("area", that.city);
    formData.append("name", that.taskName);
    formData.append(
        "disturbance",
        JSON.stringify(
            that.floodParam
        )
    );

    let url = serverInfo.baseURL + "/simulation/gisSimulator";

    axios
        .post(url, formData, { headers: headers })
        .then((res) => {
            loading.close();
            that.$message({
                message: res.data,
                type: "success",
            });
            if(callback) callback();
        })
        .catch((err) => {
            console.log(err);
            loading.close();
            that.$message({
                message: "暴雨洪涝模拟任务提交失败",
                type: "error",
            });
        });
}

// 获取传染病网格
export function getInfectionGrid(bindThis, useInfectionPolicy, callback) {
    const that = bindThis;

    // let port = "80";
    // let res = await ajax(`http://${serverInfo.baseIP}:${port}/tj-httpd/static/Infection/grid_shp.json`);
    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city)

    service
        .post('/get_grid_shp', formData, { headers: headers })
        .then((res) => {
            if (res.data.data) {
                let remove_grids = [2, 4, 5, 6, 8, 9, 10,12, 18, 53, 54, 55, 57, 58, 56, 59, 60, 
                    65, 68, 69, 81, 84,103,104,108,111, 112, 113, 114, 118, 119, 120];
                let grid_data = [];
                if(that.city === "chongqing"){
                    res.data.data.forEach((item)=>{
                        if(!remove_grids.includes(item.gid))    grid_data.push(item);
                    });
                }
                else{
                    grid_data = res.data.data;
                }
                let processResult = mapUtils.processPolygon(that, grid_data, that.layerColors["grid"], "infection");
                processResult.layer.set("layerName", "infection-grid");
                if (that.currentInfectionGridLayer)
                    that.map.removeLayer(that.currentInfectionGridLayer);
                that.currentInfectionGridLayer = processResult.layer;
                that.currentInfectionGridSource = processResult.source;
                if (that.showLayers["grid"])
                    that.map.addLayer(processResult.layer);
                if (useInfectionPolicy) {
                    let processResult = mapUtils.processPolygon(that, res.data.data, that.layerColors["policy"], "infection");
                    processResult.layer.set("layerName", "infection-policy");
                    if (that.currentInfectionPolicyLayer)
                        that.map.removeLayer(that.currentInfectionPolicyLayer);
                    that.currentInfectionPolicyLayer = processResult.layer;
                    that.currentInfectionPolicySource = processResult.source;
                    if (that.showLayers["policy"])
                        that.map.addLayer(processResult.layer);
                }
                that.$message({
                    message: "获取城市网格数据成功",
                    type: "success",
                });
                if (callback) callback();
            }
            else {
                that.$message({
                    message: res.data.msg,
                    type: "warning",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "获取城市网格数据失败",
                type: "error",
            });
        });


}

// 提交传染病模拟任务
export function submitInfectionGridSimulation(bindThis,callback) {
    const that = bindThis;
    if (Number(that.infectionParam["I_H_para"]) < 0) {
        return that.$message.error("感染后住院率必须大于0");
    }
    if (Number(that.infectionParam["I_R_para"]) < 0) {
        return that.$message.error("感染后自愈率必须大于0");
    }
    if (Number(that.infectionParam["H_R_para"]) < 0) {
        return that.$message.error("住院后治愈率必须大于0");
    }
    if (Number(that.infectionParam["R0"]) < 0) {
        return that.$message.error("R0必须大于0");
    }
    if (Number(that.infectionParam["simulation_days"]) < 0) {
        return that.$message.error("模拟总天数必须大于0");
    }

    const loading = that.$loading({
        lock: true,
        text: "传染病模拟任务上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
    });


    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();

    that.infectionParam["simulation_city"] = that.city;

    let I_input = {}, region_list = {};
    that.initInfectionList.forEach((infection, index) => {
        I_input[index] = infection.population;
        region_list[index] = infection.position;
    });
    that.infectionParam['I_input'] = JSON.stringify(I_input);
    that.infectionParam['region_list'] = JSON.stringify(region_list);

    if (that.useLockInfection) {
        let lock_area = {};
        that.lockInfectionList.forEach((infection, index) => {
            lock_area[index] = infection.position;
        });
        that.infectionParam['lock_area'] = JSON.stringify(lock_area);
        that.infectionParam['lock_day'] = that.infectionLockDay;
    }

    for (let key in that.infectionParam) {
        formData.append(key, that.infectionParam[key]);
    }
    let url = (that.useLockInfection) ? 'lock_simulation' : 'grid_simulation';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            loading.close();
            if (res.data.status === true) {
                that.$message({
                    message: "传染病模拟任务上传成功",
                    type: "success",
                });
                if(callback) callback();
            }
            else {
                that.$message({
                    message: res.data.msg,
                    type: "warning",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            loading.close();
            that.$message({
                message: "传染病模拟任务上传失败",
                type: "error",
            });
        });
}

// 查询多少城市存在模拟结果
export function inquireCityInfectionSimulation(bindThis, lockType = 0, callback = null) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let url;
    if (lockType === 0)
        url = '/inquire_city_simulation_result';
    else if (lockType === 1)
        url = '/inquire_city_simulation_lock_result';
    else if (lockType === 2)
        url = '/query_city_simulation_MADDPG_result';

    function convertTime(time) {
        const items = time.split('_');
        return `${items[0]} ${items[1]}:${items[2]}:${items[3]}`;
    }
    function parseTime(time) {
        const items1 = time.split('_');
        const items2 = items1[0].split('-');
        const items = [...items2, ...items1];
        items.forEach((v, index, arr) => {
            arr[index] = parseInt(v);
        });
        return items;
    }
    console.log("获取传染病模拟记录：",url);
    service
        .post(url, { headers: headers })
        .then((res) => {
            if (res.data.msg === "success") {
                that.$message({
                    message: "传染病模拟任务列表获取成功",
                    type: "success",
                });

                res.data.simulation_task.forEach((task) => {
                    if (task.simulation_record_num > 0 && task.simulation_record.length > 0) {   // 该城市存在传染病模拟任务
                        task.simulation_record.forEach((record) => {
                            record.city = task.city;
                            record.simulationType = "infection";
                            record.simulationTime = convertTime(record.simulation_time);
                            record.lockType = lockType;
                            if(record.task_state === "True")
                                record.status = "finish";
                            else
                                record.status = "processing";
                            record.name = "任务";
                            record.taskType = "现状模拟";
                            that.infectionSimulationList.push(record);
                        });
                    }

                });
                // 根据时间排序
                that.infectionSimulationList.sort((a, b) => {
                    const timeItems1 = parseTime(a.simulation_time);
                    const timeItems2 = parseTime(b.simulation_time);
                    for (let i = 0; i < timeItems1.length; ++i) {
                        if (timeItems1[i] !== timeItems2[i]) {
                            return timeItems1[i] - timeItems2[i];
                        }
                    }
                    return 0;
                });
                that.infectionSimulationList.forEach((record, index) => {
                    record.id = index + 1;
                });
                that.simulationTaskList = [...that.floodSimulationList,...that.infectionSimulationList];
                if (callback) callback();
            }
            else {
                that.$message({
                    message: "传染病模拟任务列表获取失败：" + res.data.msg,
                    type: "warning",
                });
            }

        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "传染病模拟任务列表获取失败",
                type: "error",
            });
        });
}

// 获取传染病模拟结果
export function getInfectionSimulationResult(bindThis, day, hour, fileName, lockType, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);
    if (lockType !== 2) {
        formData.append("simulation_day", day);
        formData.append("simulation_hour", hour);
    }
    else {
        formData.append("date", day);
        formData.append("time", hour);
    }
    formData.append("simulation_file_name",fileName);

    let url;
    if (lockType === 0)
        url = '/get_simulation_result';
    else if (lockType === 1)
        url = '/get_lock_simulation_result';
    else if (lockType === 2)
        url = '/get_MADDPG_simulation_result';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.state === "current task completed" || res.data.state === "all tasks completed") {
                that.$message({
                    message: `获取第${day}天第${hour}时刻的传染病模拟结果成功`,
                    type: "success",
                });
                that.infectionResultData[`${day}_${hour}`] = res.data;
                that.infection_num_result = res.data.num_result;
                if (callback) {
                    callback();
                }
            }
            else if (res.data.state === "not completed") {
                that.$message({
                    message: `第${day}天第${hour}时刻的传染病模拟未完成`,
                    type: "warning",
                });
            }
            else if (res.data.state === "no simulationTask") {
                that.$message({
                    message: "没有该城市的传染病模拟任务，请提交任务",
                    type: "warning",
                });
            }
            else {
                that.$message({
                    message: res.data.state,
                    type: "warning",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "传染病模拟结果获取失败",
                type: "error",
            });
        });
}

// 获取传染病模拟风险点
export function getInfectionRiskPoint(bindThis, day, hour,fileName, threshold, lockType, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);
    formData.append("simulation_day", day);
    formData.append("simulation_hour", hour);
    formData.append("threshold_Infected", threshold);
    formData.append("simulation_file_name",fileName);

    let url;
    if (lockType === 0)
        url = 'get_simulation_risk_point';
    else if (lockType === 1)
        url = 'get_lock_simulation_risk_point';
    else if (lockType === 2)
        url = 'get_MADDPG_simulation_risk_point';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.msg === "success") {
                that.$message({
                    message: `获取第${day}天第${hour}的传染病模拟风险点成功`,
                    type: "success",
                });
                mapUtils.updateRiskLayer(that, res.data.result);

                if (callback) {
                    callback(res.data.result);
                }
            }
            else {
                that.$message({
                    message: res.data.msg,
                    type: "warning",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "传染病模拟风险点获取失败",
                type: "error",
            });
        });
}

// 获取传染病模拟结果每小时感染总人数
export function getInfectionTotalPopulation(bindThis, lockType,fileName, store, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);
    if(fileName)
        formData.append("simulation_file_name", fileName);

    const urls = ['get_every_hour_infection', 'get_lock_every_hour_infection', 'get_MADDPG_every_hour_result'];
    let url = urls[lockType];

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.result) {
                that.$message({
                    message: `获得每小时的感染总人数成功`,
                    type: "success",
                });
                res.data.result.forEach((item, index, arr) => {
                    arr[index] = item.toFixed(0);
                })
                if (store) {
                    that.totalPopulation = res.data.result;
                }

                if (callback) {
                    callback(res.data.result);
                }
            }
            else{
                that.$message({
                    message: "获得每小时的感染总人数失败:"+res.data.msg,
                    type: "warning",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "获得每小时的感染总人数失败",
                type: "error",
            });
        });
}

// 生成强化学习传染病人口流动性控制
export function calculateGridControlPolicy(bindThis, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);
    formData.append("weight_1", 0.5);
    formData.append("weight_2", 0.5);

    let url = 'grid_control_policy';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.status === true) {
                that.$message({
                    message: "传染病人口流动控制决策成功",
                    type: "success",
                });
                if (callback) callback();
            }
            else {
                that.$message({
                    message: res.data,
                    type: "success",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "传染病人口流动控制决策成功失败",
                type: "error",
            });
        });
}

// 查询强化学习传染病人口流动性控制
export function searchGridControlPolicy(bindThis, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);

    let url = 'get_grid_control_policy_func_finish';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.status === true) {
                that.$message({
                    message: "传染病人口流动控制决策成功",
                    type: "success",
                });
                if (callback) callback();
            }
            else {
                that.$message({
                    message: res.data,
                    type: "success",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "传染病人口流动控制决策成功失败",
                type: "error",
            });
        });
}

// 获取强化学习传染病人口流动性控制结果
export function getGridControlPolicy(bindThis, day, time, fileName, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);
    formData.append("policy_day", day);
    let time_map = 4;
    while (time_map < time && time_map < 24) {
        time_map += 4;
    }
    formData.append("policy_time", time_map);
    if(fileName)
        formData.append("simulation_file_name",fileName);

    let url = 'get_policy_result';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.quota) {
                that.$message({
                    message: "获取强化学习传染病人口流动性控制结果成功",
                    type: "success",
                });
                if (callback) callback(res.data.quota);
            }
            else {
                console.warn("获取强化学习传染病人口流动性控制结果失败：" + res.data.msg);
                // that.$message({
                //     message: "获取强化学习传染病人口流动性控制结果失败：" + res.data.msg,
                //     type: "warning",
                // });
            }
        })
        .catch((err) => {
            console.log(err);
            console.warn("获取强化学习传染病人口流动性控制结果失败：接口出错");
            // that.$message({
            //     message: "获取强化学习传染病人口流动性控制结果失败：接口出错",
            //     type: "warning",
            // });
        });
}


// 提交强化学习策略下的模拟任务
export function MADDPGSimultion(bindThis, fileName, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);
    if(fileName)
        formData.append("simulation_file_name",fileName);

    let url = 'MADDPG_simulation';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.status === true) {
                that.$message({
                    message: "强化学习策略下的模拟任务生成成功",
                    type: "success",
                });
                if (callback) callback();
            }
            else {
                that.$message({
                    message: res.data.msg,
                    type: "warning",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "强化学习策略下的模拟任务生成失败",
                type: "error",
            });
        });
}


// 强化学习策略下的模拟结果
export function getMADDPGSimultionResult(bindThis, day, hour, callback) {
    const that = bindThis;

    let headers = {
        "Content-Type": "multipart/form-data",
    };
    const service = axios.create({
        baseURL: serverInfo.baseURL_infection,
        timeout: 16000000,
    });
    let formData = new FormData();
    formData.append("city", that.city);
    formData.append("date", day);
    formData.append("time", hour);

    let url = 'get_MADDPG_simulation_result';

    service
        .post(url, formData, { headers: headers })
        .then((res) => {
            if (res.data.state) {
                if (callback) callback(res.data);
            }
        })
        .catch((err) => {
            console.log(err);
            that.$message({
                message: "强化学习策略下的模拟结果获取失败",
                type: "error",
            });
        });
}

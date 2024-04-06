<template>
  <div class="category">
    <div id="world-chart"></div>
    <div class="fi">
      <i
        class="code_arrow"
        :class="[show3 ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
        @click="show3 = !show3"
      ></i>
      <transition name="el-fade-in-linear">
        <div class="right" v-show="show3">
          <el-select
            filterable
            clearable
            v-model="queryParams.cityId"
            placeholder="请选择城市"
            style="width: 100%"
            @clear="handleCity"
            @change="handleCity"
          >
            <el-option
              v-for="dict in cityList"
              :key="dict.id"
              :label="dict.cityName"
              :value="dict.id"
              style="width: 240px"
            ></el-option>
          </el-select>
          <div class="main">
            <!--            <div class="disp" v-for="(val, i) in roleList" :key="i">-->
            <!--              <el-checkbox-->
            <!--                v-model="val.checked"-->
            <!--                @change="(value) => handleCheckAllChange(value, val)"-->
            <!--              ></el-checkbox>-->
            <!--              <div>-->
            <!--                <div>{{ val.coverageName }}</div>-->
            <!--                <div>{{ val.createTime }}</div>-->
            <!--              </div>-->
            <!--            </div>-->
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="基础图层" name="first">
                <div class="disp" v-for="(val, i) in roleList" :key="i">
                  <el-checkbox
                    v-model="val.checked"
                    @change="(value) => handleCheckAllChange(value, val)"
                  ></el-checkbox>
                  <div>
                    <div>{{ val.coverageName }}</div>
                    <div>{{ val.createTime }}</div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="规划图层" name="second">
                <div v-for="(val, i) in treeList" :key="i">

                  <div @click="clickCity(i)" style="color:#409EFF;font-weight: 600;margin: 5px 0">
                    <a>
                    {{ val.cityName }}
                    {{ val.topicName != null && val.topicName != '' ? '-' + val.topicName : '' }}
                    {{ val.measure != null && val.measure != '' ? '-' + val.measure : '' }}
                    {{val.isLong == null ? (val.level != null && val.level != '' ? '-' + val.level : '') : '' }}
                    {{val.isLong == null ? (val.time == null || val.time == '' ? '' : val.time.indexOf("-") != -1 ? '-' + val.time :  '-' + val.time + '时') : '' }}
                    </a>
                  </div>
                  <!--                  <div>{{ val.createTime }}</div>-->

                  <div v-show="i == checkIndex">
                    <div v-if="val.isLong == null">
                    <div style="color: #ffba00;font-weight: 600">规划方案1 (综合)</div>
                    <div v-for="item in val.list">
                      <div class="disp" v-if="item.plan == 1">
                        <el-checkbox
                          v-model="item.checked"
                          @change="(value) => handleCheckAllChange(value, item)"
                        ></el-checkbox>
                        <div>
                          <div>{{ item.typeName }}</div>
                          <div>{{ item.createTime }}</div>
                        </div>
                      </div>
                    </div>
                    <div  style="color: #ffba00;font-weight: 600">规划方案2 (侧重覆盖人数)</div>
                    <div v-for="item in val.list">
                      <div class="disp" v-if="item.plan == 2">
                        <el-checkbox
                          v-model="item.checked"
                          @change="(value) => handleCheckAllChange(value, item)"
                        ></el-checkbox>
                        <div>
                          <div>{{ item.typeName }}</div>
                          <div>{{ item.createTime }}</div>
                        </div>
                      </div>
                    </div>
                    <div  style="color: #ffba00;font-weight: 600">规划方案3 (侧重疏散时间)</div>
                    <div v-for="item in val.list">
                      <div class="disp" v-if="item.plan == 3">
                        <el-checkbox
                          v-model="item.checked"
                          @change="(value) => handleCheckAllChange(value, item)"
                        ></el-checkbox>
                        <div>
                          <div>{{ item.typeName }}</div>
                          <div>{{ item.createTime }}</div>
                        </div>
                      </div>
                    </div>
                    <div  style="color: #ffba00;font-weight: 600">规划方案4 (侧重成本)</div>
                    <div v-for="item in val.list">
                      <div class="disp" v-if="item.plan == 4">
                        <el-checkbox
                          v-model="item.checked"
                          @change="(value) => handleCheckAllChange(value, item)"
                        ></el-checkbox>
                        <div>
                          <div>{{ item.typeName }}</div>
                          <div>{{ item.createTime }}</div>
                        </div>
                      </div>
                    </div>
                    </div>
                    <div v-else>
                      <div v-for="item in val.list">
<!--                        v-if="item.plan == 1"-->
                        <div class="disp">
                          <el-checkbox
                            v-model="item.checked"
                            @change="(value) => handleCheckAllChange(value, item)"
                          ></el-checkbox>
                          <div>
                            <div>{{ item.typeName }}</div>
                            <div>{{ item.createTime }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

            </el-tabs>

          </div>
          <div>
            <el-button style="width: 100%;margin-bottom: 10px" type="primary" @click="openLong = true">
              长期规划选项输入
            </el-button>
            <el-button style="width: 100%;margin-left: 0px !important;" type="primary" @click="open = true">
              应急规划选项输入
            </el-button>
          </div>
        </div>
      </transition>
    </div>
    <layer-loading :open="open" @close="close"></layer-loading>
    <long-loading :open="openLong" @close="closeLong"></long-loading>
  </div>
</template>

<script>
import { detailListConfig } from '@/api/sysdata/config'
import {
  listRole,
  listRoleCverg,
  getRole,
  delRole,
  addRole,
  updateRole,
  cityList,
  invoking,
  typeListUp,
  dataScope,
  dataFile,
  getListByTree
} from '@/api/gis/gis'

import layerLoading from '../../components/layer-loading'
import longLoading from '../../components/long-loading'
export default {
  name: 'coverage',
  components: {
    layerLoading,
    longLoading
  },
  dicts: ['data_config_type', 'point_style', 'line_style'],
  data() {
    return {
      openLong: false,
      checkIndex: null,
      treeList: [],
      activeName: 'first',
      url: process.env.VUE_APP_BASE_API,
      open: false,
      show3: true,

      id: '',
      wmsLayer: {},
      wmsLayer1: {},
      map: {},
      zoom: 10,
      // 版本号
      version: '3.8.2',
      // 标准数据配置表格数据
      configList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        addType: 0,
        cityId: Number(this.$route.query.cityId) || null
      },
      cityList: [],

      item: {},
      flag: true,
      roleList: [],

      rules: {
        cityId: [
          { required: true, message: '请输入城市名称', trigger: 'change' }
        ]
      },
      center: { lnt: 113.259987, lat: 23.131407 }
    }
  },
  created() {
    this.cityLists()
    this.getList()
  },
  mounted() {
    this.initChart1()
  },
  methods: {

    timeJudge(val) {
      val.index
    },

    levelData(data){

      if (data == '大雨淹没图层') {
        return '大雨'
      } else if (data == '暴雨淹没图层') {
        return '暴雨'
      } else if (data == '大暴雨淹没图层') {
        return '大暴雨'
      } else if (data == '特大暴雨淹没图层') {
        return '特大暴雨'
      }
      return ''
    },
    clickCity(val) {
      // console.log("valvalval", val)
      if (this.checkIndex != null) {
        this.checkIndex = null
      } else {
        this.checkIndex = val
      }

    },
    handleClick() {

    },
    close() {
      this.open = false
      this.getList()
    },
    closeLong() {
      this.openLong = false
      this.getList()
    },

    handleCheckAllChange(value, val) {
      if (value) {
        this.map.addLayer(val.wmsLayer)
      } else {
        this.map.removeLayer(val.wmsLayer)
      }
    },

    handleCity(val) {
      if (!val) return this.getList()
      let index = this.cityList.findIndex((bal) => bal.id == val)
      let _this = this
      let geocoder = new T.Geocoder()
      this.map.clearOverLays()
      geocoder.getPoint(this.cityList[index].cityName, (res) => {
        _this.center.lnt = res.location.lon
        _this.center.lat = res.location.lat
        // this.initChart1();
        _this.map.panTo(res.location, 10)
      })

      this.getList()
    },
    async cityLists() {
      const data = await cityList()
      this.cityList = data
    },
    getList() {
      getListByTree(this.queryParams).then((res) => {
        //
        res.rows.forEach((item) => {
          item.list.forEach(val => {
            val.checked = false
            let config1 = {
              service: 'WMS',
              version: '1.1.1',
              request: 'GetMap',
              format: 'image/png',
              transparent: true,
              styles: '',
              layers: val.workspace + ':' + val.layerName,
              // exceptions: 'application/vnd.ogc.se_inimage',
              srs: 'EPSG:4326'
              // width: 616,
              // height: 768
              // bbox: '112.65655517578125,22.1923828125,114.34844970703125,24.3017578125'
              // zIndex: 100
            }
            // 设置地址
            val.wmsLayer = new T.TileLayer.WMS(
              `${process.env.VUE_APP_GIS_API}/${val.workspace}/wms`,
              config1
            )
            if (this.$route.query.id == val.id) {
              this.map.addLayer(val.wmsLayer)
              val.checked = true
            } else {
              val.checked = false
            }
          })
        })
        this.treeList = res.rows
        console.log('treeList', this.treeList)
      })
      listRoleCverg(this.queryParams).then((response) => {
        response.rows.forEach((val) => {
          val.checked = false
          let config1 = {
            service: 'WMS',
            version: '1.1.1',
            request: 'GetMap',
            format: 'image/png',
            transparent: true,
            styles: '',
            layers: val.workspace + ':' + val.layerName,
            // exceptions: 'application/vnd.ogc.se_inimage',
            srs: 'EPSG:4326'
            // width: 616,
            // height: 768
            // bbox: '112.65655517578125,22.1923828125,114.34844970703125,24.3017578125'
            // zIndex: 100
          }
          // 设置地址
          val.wmsLayer = new T.TileLayer.WMS(
            `${process.env.VUE_APP_GIS_API}/${val.workspace}/wms`,
            config1
          )
          if (this.$route.query.id == val.id) {
            this.map.addLayer(val.wmsLayer)
            val.checked = true
          } else {
            val.checked = false
          }
        })
        this.roleList = response.rows
      })
    },
    handle() {
      this.flag = !this.flag
      this.flag
        ? this.map.addLayer(this.wmsLayer)
        : this.map.removeLayer(this.wmsLayer)
    },
    initChart1() {
      //初始化地图对象
      this.map = new T.Map('world-chart')
      //设置显示地图的中心点和级别
      this.map.centerAndZoom(
        new T.LngLat(this.center.lnt, this.center.lat),
        10
      )
      //创建对象
      var ctrl = new T.Control.MapType([])
      //添加控件
      this.map.addControl(ctrl)
    },

    addWmsLayer(item) {
      if (item.wmsLayer) {
        item.wmsLayer.setOpacity(1)
        return
      }
      var config = {
        version: '1.1.1', //请求服务的版本
        layers: item.layer,
        transparent: true, //输出图像背景是否透明
        styles: '', //每个请求图层的用","分隔的描述样式
        format: 'image/png', //输出图像的类型
        zIndex: 100
      }
      var wmsLayer = new T.TileLayer.WMS(item.url, config)
      item.wmsLayer = wmsLayer
      this.Map.addLayer(wmsLayer)
    },
    clickMmsLayer(e) {
      let arr = []
      var lat = e.lnglat.lat //点击事件返回的经纬度坐标
      var lon = e.lnglat.lng
      var zoom = this.Map.getZoom()
      //bbox数据根据不同层级自动调整大小
      var step = 0.001
      if (zoom < 14) {
        step = (70 - 4 * zoom) * 0.01
      }

      let item = {
        url: 'http://localhost:8080/geoserver/workspace/wms',
        layer: 'test'
      }
      //构造访问geoserver的获取基础数据的GetFeatureInfo请求
      var url =
        item.url +
        '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=application/json&TRANSPARENT=true' +
        '&QUERY_LAYERS=' +
        item.layer +
        '&LAYERS=' +
        item.layer +
        '&exceptions=application/json&SRS=EPSG:4326&INFO_FORMAT=application/json&STYLES=&x=50&y=50&WIDTH=101&HEIGHT=101&BBOX=' +
        (lon - step).toFixed(6) +
        ',' +
        (lat - step).toFixed(6) +
        ',' +
        (lon + step).toFixed(6) +
        ',' +
        (lat + step).toFixed(6)

      axios
        .get(url)
        .then((res) => {
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
    },

    // this.Map.addEventListener("click", function (e) {
    //   //调用处理函数
    //   that.clickMmsLayer(e)
    // });
    //
    //

    goTarget(href) {
      window.open(href, '_blank')
    },
    /** 任务数据详情 */
    dataDetail(id, type) {
      const obj = { path: '/sysdata/data-detail/index' }
      this.$tab.closePage(obj)
      this.$router.push({
        path: '/sysdata/data-detail/index',
        query: { rid: id, type: type }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.category {
  display: flex;
  width: 100%;
  height: calc(100vh - 90px);
  position: relative;

  #world-chart {
    width: 100%;
    height: 100%;
  }

  .fi {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    display: flex;
    height: 100%;

    .code_arrow {
      display: inline-block;
      text-align: center;
      width: 30px;
      height: 50px;
      line-height: 50px;
      background: #fff;
      margin-top: 40vh;
      font-size: 25px;
    }

    .right {
      padding: 20px;
      width: 400px;
      height: 100%;
      background: #fff;

      .main {
        margin-top: 10px;
        height: calc(100vh - 245px);
        overflow: hidden;
        overflow-y: scroll;

        &::-webkit-scrollbar {
          width: 8px;
          background-color: #f1f1f1;
        }

        .disp {
          display: flex;
          align-items: center;
          padding: 10px 0;

          div {
            font-size: 14px;
            margin-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>

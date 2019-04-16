<template>
  <div class="index-wrapper">
    <section class="link">
      <div class="link-button" @click="toRoute('/warn')">
        <div class="link-icon">
          <svg class="icon link-font" aria-hidden="true">
            <use xlink:href="#icon-yujing"></use>
          </svg>
        </div>
        <p class="link-text">预警</p>
      </div>
      <div class="link-button" @click="toRoute('/rain')">
        <div class="link-icon link-rain">
          <svg class="icon link-font" aria-hidden="true">
            <use xlink:href="#icon-yuqingchaxun"></use>
          </svg>
        </div>
        <p class="link-text">雨情</p>
      </div>
      <div class="link-button" @click="toRoute('/water')">
        <div class="link-icon link-water">
          <svg class="icon link-font" aria-hidden="true">
            <use xlink:href="#icon-shuiqingchaxun"></use>
          </svg>
        </div>
        <p class="link-text">水情</p>
      </div>
    </section>
    <section class="warn">
      <div class="warn-wrapper" @click="toRoute('/wrandetail')">
        <p class="warn-title">最新预警</p>
        <p class="warn-content">{{warnContent}}</p>
      </div>
    </section>
    <div class="index-wrapper-box">
      <section-title  class="tab-wrapper"
                      :title="ennm"
                      subTitle="未来7日"></section-title>
      <tab :line-width="2" custom-bar-width="60px">
        <tab-item @on-item-click="onTab" selected>降水</tab-item>
        <tab-item @on-item-click="onTab">水位</tab-item>
        <tab-item @on-item-click="onTab">流量</tab-item>
      </tab>
      <section class="chart" ref="chart"></section>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem } from 'vux'
import echarts from "echarts"
import "echarts/theme/macarons"
import { warninfo, floodrain, forecastz, waterlevel } from '@/api'
import sectionTitle from '@/components/common/sectionTitle'
import { mapMutations } from 'vuex'

let ennmcd = sessionStorage.getItem('ennmcd')
let nowDate = new Date()
let startDate = nowDate.formatDate("yyyy-MM-dd 08:00:00")
// let startDate = "2018-09-01 08:00:00"
let endDate = nowDate.datePro("{%d+7}").formatDate("yyyy-MM-dd 08:00:00")
// let endDate = "2018-09-08 08:00:00"
export default {
  components: {
    Tab,
    TabItem,
    sectionTitle
  },
  data () {
    return {
      chart: null,
      ennm: sessionStorage.getItem('ennm'),
      floodRainData: null,
      waterData: null,
      warn: null,
      warnContent: ''
    }
  },
  created() {
    this.getWarn()
  },
  mounted() {
    this.initChart()
    this.$vux.loading.hide()
  },
  methods: {
    ...mapMutations('warnmsg', ['CHANGE_ITEM']),
    toRoute(path) {
      this.$router.push(path)
    },
    async getWarn() {
      let res = await warninfo(ennmcd)
      let data = res.data.result
      if (data.length !== 0) {
        let item = data[0]
        item.name = item.stnm
        this.CHANGE_ITEM(item)
        this.warnContent = item.msgcontent
      }
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons")
      this.onTab(0)
    },
    async onTab(index) {
      let { floodRainData, waterData, warn } = this
      if (index === 0) { // 降水
        let data
        let arrX = []
        let arrY = []
        if (floodRainData) {
          data = floodRainData
        } else {
          let res = await floodrain({
            ennmcd,
            startDate,
            endDate
          })
          data = res.data.result
          this.floodRainData = data
        }
        data.forEach(value => {
          arrX.push(value.ftm)
          arrY.push(value.fpp)
        })
        this.setOptions({
          arrX,
          yAxis: {
            name: "降雨量(mm)",
            type: "value"
          },
          series: [{
            name: "降雨量",
            smooth: true,
            type: "bar",
            data: arrY
          }]
        })
      } else if (index === 1) { // 水位
        let data
        let arrX = []
        let arrY = []
        let lineData = 0
        if (waterData && warn) {
          data = waterData
          lineData = warn
        } else {
          let res = await Promise.all([
            forecastz({
              ennmcd,
              startDate,
              endDate
            }),
            waterlevel({
              ennmcd,
              startDate,
              endDate
            })
          ])
          data = res[0].data.result
          lineData = res[1].data.result.warnz
          this.waterData = data
          this.warn = lineData
        }
        data.forEach(value => {
          arrX.push(value.ftm)
          arrY.push(value.fz)
        })
        this.setOptions({
          arrX,
          yAxis: {
            name: "水位(m)",
            type: "value",
            max({ max }) {
              return lineData > max ? lineData : max
            }
          },
          series: [{
            name: "水位",
            smooth: true,
            type: "line",
            data: arrY,
            markLine: {
              symbolSize: 0,
              label: {
                position: "middle",
                formatter(value) {
                  return value.name
                }
              },
              data: [{
                name: `汛限水位:${lineData}`,
                yAxis: lineData,
                lineStyle: {
                  color: "red",
                  width: 1.5,
                  type: "solid",
                  opacity: lineData === 0 ? 0 : 1
                },
                label: {
                  show: lineData === 0 ? false : true
                }
              }]
            }
          }]
        })
      } else if (index === 2) { // 流量
        let data
        let arrX = []
        let arrY = []
        if (floodRainData) {
          data = floodRainData
        } else {
          let res = await floodrain({
            ennmcd,
            startDate,
            endDate
          })
          data = res.data.result
          this.floodRainData = data
        }
        data.forEach(value => {
          arrX.push(value.ftm)
          arrY.push(value.q)
        })
        this.setOptions({
          arrX,
          yAxis: {
            name: "流量(m³/s)",
            type: "value"
          },
          series: [{
            name: "流量",
            smooth: true,
            type: "line",
            data: arrY
          }]
        })
      }
    },
    setOptions({ arrX, yAxis, series }) {
      this.chart.setOption({
        xAxis: {
          data: arrX,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 30,
          right: 30,
          bottom: 10,
          top: 35,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis,
        series
      }, true)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/theme.scss";
.index-wrapper-box {
  padding: 0 .1rem
}
// 按钮
.link {
  display: flex;
  justify-content: space-around;
  padding-top: .2rem
}
.link-button {
  width: .8rem;
  &:active {
    opacity: .3;
  }
}
.link-icon {
  width: 100%;
  height: .8rem;
  border-radius: .15rem;
  background-color: #FF4500;
  display: flex;
  justify-content: center;
  align-items: center;
}
.link-text {
  text-align: center;
  font-size: .14rem;
  padding: .05rem 0;
}
.link-font {
  width: 65%;
  height: 65%;
  color: white;
}
.link-rain {
  background-color: #63B8FF
}
.link-water {
  background-color: #436EEE
}

// 预警
.warn {
  padding: .1rem .1rem;
}
.warn-wrapper {
  background: url('~@/assets/index/resImage.jpg') no-repeat 0 0;
  background-size: 100% 100%;
  border-radius: .1rem;
  height: 1rem;
  &:active{
    opacity: .3;
  }
}
.warn-title {
  font-weight: bold;
  font-style: italic;
  color: #FFD700;
  font-size: .18rem;
  height: .6rem;
  text-indent: .2rem;
  line-height: .4rem;
}
.warn-content {
  padding: 0 .1rem;
  color: white;
  text-align: center;
  line-height: .4rem;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

// tab部分
.tab-wrapper {
  color: $themeColor;
}
.chart {
  height: 2.3rem;
  background-color: white;
}
</style>
<style lang="scss">
// 重置tab组件样式
.index-wrapper {
  @import "@/styles/resetTab.scss";
}
</style>

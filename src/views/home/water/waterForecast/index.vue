<template>
	<div class="water-forecast">
		<map-con  class="map"
              :itemData="item"></map-con>
    <section-title  class="tab-wrapper"
                    :title="item.stnm"></section-title>
    <tab :line-width="2" custom-bar-width="60px">
      <tab-item @on-item-click="onTab" selected>雨洪</tab-item>
      <tab-item @on-item-click="onTab">水位</tab-item>
      <tab-item @on-item-click="onTab">流量</tab-item>
    </tab>
    <section class="chart" ref="chart"></section>
    <Table :columns="columns" :data="dataList"></Table>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Tab, TabItem } from 'vux'
import { Table } from "iview";
import mapCon from '@/components/map'
import sectionTitle from '@/components/common/sectionTitle'
import echarts from "echarts"
import "echarts/theme/macarons"
import { siteforecastdetails, waterlevel } from '@/api/water'

let ennmcd = sessionStorage.getItem('ennmcd')
export default {
  components: {
		mapCon,
    Table,
    sectionTitle,
    Tab,
    TabItem
  },
  data() {
    return {
      isFinish: false,
      warnz: 0,
      dataList: [],
      columns: [
        {
          title: "时间",
          key: "ftm",
          align:'center',
          // width: 110
        },
        {
          title: "降雨量",
          key: "fpp",
          align:'center'
        },
        {
          title: "水位",
          key: "z",
          align:'center'
        },
        {
          title: "流量",
          key: "q",
          align:'center'
        }
      ]
    };
  },
  computed: mapGetters('waterForecast', ['item', 'startDate', 'endDate']),
  mounted() {
    this.initChart()
  },
  methods: {
    async onTab(index) {
      let { startDate, endDate, isFinish, dataList, warnz, item } = this
      let res
      let data
      let lineData
      let arrX = []
      if (isFinish) {
        data = dataList
        lineData = warnz
      } else {
        res = await Promise.all([
          siteforecastdetails({
            stcd: item.stcd,
            startDate: `${startDate} 08:00:00`,
            endDate: `${endDate} 08:00:00`
          }),
          waterlevel({
            ennmcd,
            startDate: `${startDate} 08:00:00`,
            endDate: `${endDate} 08:00:00`
          })
        ])
        data = res[0].data.result
        lineData = res[1].data.result.warnz
        this.isFinish = true
        this.dataList = data
        this.warnz = lineData
      }
      if (index === 0) {
        let arrFpp = []
        let arrQ = []
        data.forEach(({ftm, q, fpp}) => {
          arrX.push(ftm)
          arrFpp.push(fpp)
          arrQ.push(q)
        })
        this.setOptions({
          arrX,
          yAxis:[
            {
              name: "流量(m³/s)",
              type: "value",
              max: function (value) {
                return value.max * 2;
              }
            },
            {
              name: "降雨量(mm)",
              type: "value",
              inverse: true,
              nameLocation: "start",
              max: function (value) {
                return value.max * 2;
              }
            }
          ],
          series: [{
              name: "降雨量",
              smooth: true,
              type: "bar",
              data: arrFpp
            },
            {
              name: "流量",
              smooth: true,
              type: "line",
              data: arrQ
            }
          ]
        })
      } else if (index === 1) {
        let arrZ = []
        data.forEach(({ftm, z}) => {
          arrX.push(ftm)
          arrZ.push(z)
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
            data: arrZ,
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
      } else {
        let arrQ = []
        data.forEach(({ftm, q}) => {
          arrX.push(ftm)
          arrQ.push(q)
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
            data: arrQ
          }]
        })
      }
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons")
      this.onTab(0)
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
          right: 40,
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
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";

.map {
  height: 2.3rem;
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
.water-forecast {
  @import "@/styles/resetTab.scss";
}
</style>

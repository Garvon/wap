<template>
	<div class="water-forecast">
		<map-con  class="map"
              :itemData="item"></map-con>
    <section-title  class="tab-wrapper"
                    :title="item.stnm"
                    subTitle="近来7日"></section-title>
    <tab :line-width="2" custom-bar-width="60px">
      <tab-item @on-item-click="onTab" selected>水位</tab-item>
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
import { stcdrealrain } from '@/api/water'

let ennmcd = sessionStorage.getItem('ennmcd')
let now = new Date()
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
      dataList: [],
      columns: [
        {
          title: "时间",
          key: "tm",
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
  computed: mapGetters('waterReal', ['item']),
  mounted() {
    this.initChart()
  },
  methods: {
    async onTab(index) {
      let { startDate, endDate, isFinish, dataList, item:{ stcd } } = this
      let res
      let data
      let arrX = []
      let arrY = []
      if (isFinish) {
        data = dataList
      } else {
        res = await stcdrealrain({
          stcd,
          startDate: new Date(now).datePro('{%d-7}').formatDate('yyyy-MM-dd 08:00:00'),
          endDate: now.formatDate('yyyy-MM-dd 08:00:00')
        })
        data = res.data.result
        this.dataList = data
        this.isFinish = true
      }

      if (index === 0) {
        data.forEach(value => {
          arrX.push(value.tm)
          arrY.push(value.z)
        })
        this.setOptions({
          arrX,
          yAxis: {
            name: "水位(m)",
            type: "value"
          },
          series: [{
            name: "水位",
            smooth: true,
            type: "line",
            data: arrY
          }]
        })
      } else {
        data.forEach(value => {
          arrX.push(value.tm)
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
      })
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

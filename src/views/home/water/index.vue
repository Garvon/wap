<template>
  <div class="water-wrapper" >
    <tab :line-width=2 v-model="index">
      <tab-item v-for="(item, index) in list3"
                @on-item-click="showbtn"
                :key="`rainTab${index}`">{{item.title}}</tab-item>
    </tab>
    <swiper
      v-model="index"
      :show-dots="false"
      height="100%"
      @on-index-change='showbtn'>
      <swiper-item>
        <section class="water-search">
          <p @click="changeStart">{{startDate}}</p>
          <span class="water-search-magin">至</span>
          <p @click="changeEnd" class="water-search-magin">{{endDate}}</p>
          <x-button mini 
                    class="water-search-btn"
                    type="primary"
                    @click.native="doSearch">
            <x-icon class="water-search-icon" type="ios-search-strong" size="20"></x-icon>
          </x-button>
        </section>
        <section class="water-list">
          <ul>
            <li class="water-list-item"
                v-for="(item, index) in forecastData"
                :key="`waterFore${index}`"
                @click="toWaterForecast(item)">
              <p class="water-list-row">{{item.stnm}}</p>
              <div class="water-list-row">
                <span>洪峰流量：</span>
                <p>{{item.q}}m³/s <span class="water-list-date">{{item.maxqtm | formatHour}}</span></p>
              </div>
              <div class="water-list-row">
                <span>最高水位：</span>
                <p>{{item.z}}m <span class="water-list-date">{{item.maxztm | formatHour}}</span></p>
              </div>
              <div class="water-list-row">
                <span>总洪量：</span>
                <p>{{item.sumq}}百万m³</p>
              </div>
            </li>
          </ul>
        </section>
      </swiper-item>
      <swiper-item>
        <Table  stripe
                :columns="columns1"
                :data="swiperdata"
                @on-row-click="toWaterReal"></Table>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tab, TabItem, Swiper, SwiperItem, XButton } from 'vux'
import { Table } from 'iview'
import { apprainflow, realflood, stcdrealrain } from '@/api/water'
import { mapGetters, mapMutations } from 'vuex'

let now = new Date()
let ennmcd = sessionStorage.getItem('ennmcd')
export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Table,
    XButton
  },
  data () {
    return {
      isTableData: false,
      index: 0,
      list3:[
        {
          type:"Y",
          title:"预报水情"
        },
        {
          type:"S",
          title:"实时水情"
        } 
      ],
      columns1: [
        {
          title: '站名',
          key: 'stnm',
          align:'center'
        },
        {
          title: '区域',
          key: 'dsnm',
          align:'center'
        },
        {
          title: '水位',
          key: 'z',
          align:'center'
        },
        {
          title: '流量',
          key: 'q',
          align:'center'
        }
      ],
      swiperdata: [],
      forecastData: []
    }
  },
  created() {
    this.doSearch()
  },
  computed: mapGetters('waterForecast', ['startDate', 'endDate']),
  filters: {
    formatHour(value) {
      return value ? value.substring(0, 16) : ''
    }
  },
  methods: {
    ...mapMutations('waterForecast', ['CHANGE_ITEM', 'CHANGE_STARTDATE', 'CHANGE_ENDDATE']),
    tolink(path){
      this.$router.push(path)
    },
    async showbtn(index) {
      if (index === 0) {
        return
      }

      if (!this.isTableData) {
        let res = await realflood(ennmcd)
        this.swiperdata = res.data.result
        this.isTableData = true
      }
    },
    setDate(config) {
      this.$vux.datetime.show(Object.assign({
        cancelText: '取消',
        confirmText: '确定',
        yearRow: '{value}年',
        monthRow: '{value}月',
        dayRow: '{value}日',
        format: 'YYYY-MM-DD'
      }, config))
    },
    changeStart() {
      this.setDate({
        value: this.startDate,
        onConfirm: val => {
          this.CHANGE_STARTDATE(val)
          this.CHANGE_ENDDATE(val.toDate().datePro('{%d+7}').formatDate('yyyy-MM-dd'))
        }
      })
    },
    changeEnd() {
      let { startDate, endDate } = this
      this.setDate({
        value: endDate,
        startDate,
        endDate: startDate.toDate().datePro('{%d+7}').formatDate('yyyy-MM-dd').toString(),
        onConfirm: val => {
          this.CHANGE_ENDDATE(val)
        }
      })
    },
    async doSearch() {
      let { startDate, endDate } = this
      let arr = []
      let res = await apprainflow({
        startDate: `${startDate} 08:00:00`,
        endDate: `${endDate} 08:00:00`,
        ennmcd
      })
      let data = res.data.result
      for (let key in data) {
        arr = [...arr, ...data[key]]
      }
      arr.forEach(value => {
        value.sumq = (value.sumq / 1e6).toFixed(2)
      })
      this.forecastData = arr
    },
    toWaterForecast(value) {
      value.name = value.stnm
      this.CHANGE_ITEM(value)
      this.tolink('/waterForecast')
    },
    toWaterReal(value) {
      let { tolink, $store } = this
      value.name = value.stnm
      $store.commit('waterReal/CHANGE_ITEM', value)
      tolink('/waterReal')
    }
  }
}
</script>

<style lang="less" scoped>
.water-wrapper{
  height:100%;
}
.btntab{
  width:100%;
  height:.4rem;
  position: absolute;
  bottom:50px;
}

// 查询条件
.water-search {
  display: flex;
  align-items: center;
  padding: 0 .1rem;
  height: 40px;
  p {
    color: #03A9F4;
    font-weight: bold;
    font-style: italic;
  }
}
.water-search-magin {
  margin-left: 10px;
}
.water-search-btn {
  margin: 0 0 0 15px;
  height: 22px;
  line-height: 22px;
}
.water-search-icon {
  fill: white;
}

// 预报列表
.water-list {
  padding: 0 .1rem;
}
.water-list-item {
  // background-color: #A0DAF4;
  background-color: white;
  border-radius: .05rem;
  padding: .05rem .1rem;
  margin-bottom: .1rem;
}
.water-list-row {
  height: 30px;
  display: flex;
  align-items: center;
  >span {
    width: 70px;
  }
}
.water-list-date {
  font-size: 12px;
  display: inline-block;
  text-indent: 1em;
  color: #777;
}
</style>
<style lang="scss">
@import "@/styles/theme.scss";
.water-wrapper {
  width:100%;
  height:100%;
  .ivu-table-header {
    height: 40px;
  }
  .ivu-table-wrapper {
    width:100%;
  }
  .ivu-table-stripe 
  .ivu-table-body tr:nth-child(2n) td,
  .ivu-table-stripe
  .ivu-table-fixed-body tr:nth-child(2n) td {
    background-color: rgba(0, 162, 255, 0.164);
  }
  .ivu-table td {
    height: 30px;
    padding: 0;
    border-bottom: none;
  }
  .ivu-table:after {
    width: 0px;
  }
  .ivu-table:before {
    width: 0px;
  }
  .ivu-table-wrapper {
    border: none;
  }
  
  // 重置tab颜色
  .vux-tab .vux-tab-item.vux-tab-selected {
    color: $themeColor;
  }
  .vux-tab-ink-bar {
    background-color: $themeColor;
  }
  .vux-slider {
    height: calc(100% - 44px);
    .vux-swiper-item {
      overflow-y: scroll;
    }
  }

  .weui-btn_primary {
    background-color: $themeColor;
  }
  .weui-btn_primary:not(.weui-btn_disabled):active {
    background-color: $themeColor;
    opacity: .3;
  }
}
.dp-header .dp-item.dp-right {
  color: $themeColor;
}
</style>

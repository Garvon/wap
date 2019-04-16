<template>
  <div class="index-rain">
    <div class="raintab">
      <tab :line-width=2 active-color='#03A9F4' v-model="index">
        <tab-item class="vux-center" :selected="demo3 === item" v-for="(item, index) in list3" @click="demo3 = item"
          @on-item-click="showbtn(item)" :key="index">{{item.title}}</tab-item>
      </tab>
      <swiper 
        v-model="index"
        ref="swiperheight"
        :show-dots="false"
        @on-index-change="swiper"
        height="100%">
        <!--实时降雨-->
        <swiper-item>
          <div class="tab-swiper vux-center">
            <div class="tablebox" ref="tablebox">
              <Table stripe :columns="columns" :data="swiperdataS" @on-row-click="toRainReal"></Table>
            </div>
          </div>
        </swiper-item>
        <!-- 预报降雨 -->
        <swiper-item>
          <div class="tab-swiper vux-center">
            <div class="tablebox" ref="tablebox">
              <Table stripe :columns="columns" :data="swiperdataS" @on-row-click="toRainReal"></Table>
            </div>
          </div>
        </swiper-item>

      </swiper>
    </div>
    <div class="btntab" v-if="show">
      <button-tab v-model="demo01">
        <button-tab-item @on-item-click="consoleIndex(item)" v-for="(item,index) in tablist" :key="index">{{item}}</button-tab-item>
      </button-tab>
    </div>
  </div>
</template>

<script>
  import {
    Tab,TabItem,Sticky,Divider, XButton,
    Swiper,
    SwiperItem,
    ButtonTab,
    ButtonTabItem
  } from 'vux'
  import {
    Table
  } from 'iview'
  import {
    rainList
  } from '@/api/rain'
  import { mapGetters, mapMutations } from 'vuex'
import { debug } from 'util';
  export default {
    components: {Tab,TabItem,Sticky,Divider,XButton,Swiper,SwiperItem,ButtonTab,ButtonTabItem,Table},
    data() {
      return {
        show: false,
        demo01: 0, //时间tab
        demo3: '预报降雨',
        index: 0,
        list3: [{
            type: "S",
            title: "实时降雨"
          },
          {
            type: "Y",
            title: "预报降雨"
          }
        ],
        tablist: ["1h", "3h", "6h", "24h", "3天", "7天"],
        columns: [{
            title: '站名',
            key: 'stnm',
            align: 'center'
          },
          {
            title: '区域',
            key: 'dsnm',
            align: 'center'
          },
          {
            title: '雨量(mm)',
            key: 'drp',
            align: 'center'
          }
        ],
        swiperdataS: [],
        raintype: "S"
      }
    },
    mounted() {
      this.apirainlist();
    },
    computed: {
       ...mapGetters('rainReal', [ 'startDate','endDate'])
    },
    methods: {
      ...mapMutations('rainReal', ['CHANGE_STARTDATE', 'CHANGE_ENDDATE']),
      tolink(path) {
        this.$router.push(path);
      },
      toRainReal(value){
        let {$store, tolink } = this;
        value.name = value.stnm
        $store.commit('rainReal/CHANGE_ITEM', value)
        $store.commit('rainReal/CHANGE_TYPE', this.raintype)
         tolink('/raindetail')
      },
      // 1h 3h 6h 24h 3天 7天
      consoleIndex (val) {
        let endtime = '';
        switch (val){
            case '1h':
            endtime = this.startDate.toDate().datePro("{%H+1}").formatDate('yyyy-MM-dd HH:mm:ss');
          break;
            case '3h':
            endtime = this.startDate.toDate().datePro("{%H+3}").formatDate('yyyy-MM-dd HH:mm:ss');
          break;
            case '6h':
            endtime = this.startDate.toDate().datePro("{%H+6}").formatDate('yyyy-MM-dd HH:mm:ss');
          break;
            case '24h':
            endtime = this.startDate.toDate().datePro("{%H+24}").formatDate('yyyy-MM-dd HH:mm:ss');
          break;
            case '3天':
            endtime = this.startDate.toDate().datePro("{%d+3}").formatDate('yyyy-MM-dd HH:mm:ss');
          break;
            case '7天':
            endtime = this.startDate.toDate().datePro("{%d+7}").formatDate('yyyy-MM-dd HH:mm:ss');
          break;
        };
        this.CHANGE_ENDDATE(endtime);
        this.rainlistdata(this.startDate, this.endDate);
      },
       //时间tab的显示隐藏控制
      swiper(index) {
        if (index == 1) {
          this.show = true;
          this.raintype = "Y";
        } else {
          this.show = false;
          this.raintype = "S";
        }
        this.apirainlist();
        
      },
      showbtn(item) {
        this.raintype = item.type
        this.apirainlist();
      },
      // 预报雨情
      apirainlist() {
        let { startDate, endDate } = this
        if (this.raintype == "Y") {
          this.rainlistdata(startDate, endDate);
        } else {
          let endDate = new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00');
          this.rainlistdata(startDate, endDate);
        }
      },
      // 雨情list接口
      rainlistdata(startDate, endDate) {
        let param = {
          ennmcd: sessionStorage.getItem("ennmcd"),
          startDate: startDate,
          endDate: endDate,
          flagRealOrPred: this.raintype,
        };
        rainList(param).then((res) => {
          this.swiperdataS = res.data.result;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';

  .index-rain {
    width: 100%;
    height: 100%;
    .raintab {
      height: 100%;
      padding-bottom: 44px;
      .box {
        padding: 15px;
      }
      .tab-swiper {
        width: 100%;
        background-color: #fff;
      }
    }
  }

  .btntab {
    width: 90%;
    margin-left: 5%;
    height: .4rem;
    position: absolute;
    bottom: 50px;
  }
  .tablebox {
    width: 100%;
    height: 100%;
  }
</style>
<style lang="scss">
  .index-rain {
    width: 100%;
    height: 100%;

    .ivu-table-header {
      height: 40px;
    }

    .ivu-table-wrapper {
      width: 100%;
    }

    .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td,
    .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td {
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

    .vux-slider {
      height: calc(100% - 44px);
      .vux-swiper-item {
        overflow-y: scroll;
      }
    }
  }
</style>
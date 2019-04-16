<template>
    <div class="raindetail">
       
        <map-con  class="map"
              :itemData="item"></map-con>
        <div class="chart">
            <div class="charttitle">
                <Icon class="icon" size="20" color="#03A9F4" type="logo-buffer" />
                <div class="charttitledetail">{{item.stnm}} - 近7日降雨过程</div>
            </div>
            <div class="chart" id="echarts"></div>
        </div>
        <div class="tablelist">
            <Table :columns="columns1" :data="datalist"></Table>
        </div>
    </div>
</template>
<script>
    import {VChart,VLine,VArea,VTooltip,VLegend,VBar,XButton} from 'vux'
    import { Table, Icon } from 'iview'
    import { mapGetters } from 'vuex'
    import { rainDetailRealSite,rainDetailForecastSite,rainDetailRealRainfall,rainDetailForecastRainfall } from '@/api/rain'
    import echarts from "echarts"
    import mapCon from '@/components/map'
    export default {
        components: {VChart,VLine,VArea,VTooltip,VLegend,VBar,XButton,Table,Icon,mapCon,},
        data() {
            return {
                columns1: [{
                        title: '时间',
                        key: 'tm',
                        align:"center"
                    },
                    {
                        title: '日雨量(mm)',
                        key: 'drp',
                        align:"center"
                    },
                    {
                        title: '24h最大降雨',
                        key: 'maxdrp',
                        align:"center"
                    }
                ],
                datalist:[],
            }
        },
        computed: {
            ...mapGetters('rainReal', ['type', 'item', 'startDate', 'endDate'])
        },
        mounted(){
            this.handleRaindata();
        },
        methods:{
            async handleRaindata(){
                let _this=this;
                let { type, item, startDate, endDate } = this;
                let res
                let data
                let tableHoursData
                let Ydata = [];
                let Xdata = [];
                let array = [];
                if(type == "Y"){
                    let starttime = new Date().formatDate('yyyy-MM-dd 08:00:00');
                    res = await Promise.all([
                        rainDetailForecastSite({//(详情)预报降雨过程-单个站点未来七日降雨过程
                            stcd:item.stcd,
                            startDate:starttime,
                            endDate:new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00')
                        }),
                        rainDetailForecastRainfall({//(详情)预报-24小时最大降雨
                            stcd:item.stcd,
                            startDate:starttime,
                            endDate:new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00')
                        })
                    ])

                    let nowDay  =res[0].data.result;
                    let hours = res[1].data.result;
                    
                    nowDay.forEach((x)=>{
                        Ydata.push(x.drp)
                        Xdata.push(x.tm)
                        hours.forEach(k=>{
                            if(x.tm == k.tm){
                                array.push({
                                  drp:x.drp,
                                  maxdrp:k.maxdrp,
                                  tm:k.tm
                                })
                            }
                        }) 
                    });
                    this.datalist=array;
                    _this.initEcharts(Ydata,Xdata)
                }else{
                    // let starttime = new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00')
                    let starttime = new Date().datePro("{%d-7}").formatDate('yyyy-MM-dd 08:00:00')
                    let endtime = new Date().formatDate('yyyy-MM-dd 08:00:00');
                    res = await Promise.all([
                        rainDetailRealSite({//(详情)实时降雨过程-单个站点近七日降雨过程
                            stcd:item.stcd,
                            startDate:starttime,
                            endDate:endtime
                        }),
                        rainDetailRealRainfall({//(详情)实时-24小时最大降雨
                            stcd:item.stcd,
                            startDate:starttime,
                            endDate:endtime
                        })
                    ])
                    data = res[0].data.result
                    tableHoursData = res[1].data.result
                    data.forEach(x=>{
                        Ydata.push(value.drp)
                        Xdata.push(value.tm)
                        tableHoursData.forEach(k=>{
                            if(x.tm == k.tm){
                                array.push({
                                    drp:xdrp,
                                    maxdrp:k.maxdrp,
                                    tm:k.tm
                                })
                            }
                        })
                    })
                    this.datalist=array;
                    _this.initEcharts(Ydata,Xdata)
                }
                
            },
            initEcharts(Ydata,Xdata) {
                let self = this;
                this.chart = echarts.init(document.getElementById('echarts'));
                let option = {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: 30,
                        right: 30,
                        bottom: 10,
                        top: 35,
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data :Xdata,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name:'降雨量(mm)'
                        }
                    ],
                    series : [
                        {
                            name:'日雨量',
                            type:'bar',
                            barWidth: '10%',
                            data:Ydata
                        }
                    ]
             };
            this.chart.setOption(option);
            },
        }
    }
</script>
<style lang="scss" scoped>
    .raindetail {
        width: 100%;
        height: 100%;

        .map {
            width: 100%;
            height: 2.3rem;
        }

        .chart {
            width: 100%;
            height: 3rem;

            .charttitle {
                height: .3rem;

                .icon {
                    height: .3rem;
                    // margin-top:.05rem;
                    float: left;
                    line-height: .3rem;
                }

                .charttitledetail {
                    float: left;
                    line-height: .3rem;
                }
            }

            .chart {
                width: 100%;
                height: 2.7rem;
                background: #fff;
            }
        }

        .tablelist {
            width: 100%;
            // height: 2rem;
        }
    }
</style>
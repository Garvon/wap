<template>
    <div class="index-warndetail">
        <map-con  class="map"
              :itemData="item"></map-con>
        <div class="tabledescribetitle">
                <div class="describetitleleft">{{item.creattm}}</div>
                <div class="describetitleright">{{item.stnm}}</div>
            </div>
        <div class="warndetailtable">
            <div class="tabledescribe">
                <div class="describeinfo">{{item.msgcontent}}</div>
            </div>
            <div class="chart" id="echarts"></div>
        </div>
        <!-- <div>阅读：76</div> -->
    </div>
</template>
<script>
import { VChart, VTooltip, VLine, VScale } from 'vux'
import { warnaddwaterlevel,warnaddprocess } from '@/api/warn'
import { mapGetters, mapMutations } from 'vuex'
import mapCon from '@/components/map'
import echarts from "echarts"

export default {
    name:"warndetail",
    components: {
        mapCon,
        VChart,
        VTooltip,
        VLine,
        VScale
    },
    data () {
        return {
            ywarn:"",
            linetitle:""
        }
    },
    computed:mapGetters('warnmsg', ['item']),
    mounted(){
        this.init();
    },
    methods:{
        init(){
            this.warndetaildata();// 警戒水位、警戒流量
            this.waterprocess();// 水位流量过程
        },
        // 警戒水位、警戒流量
        warndetaildata(){
            let detaildata = this.item
            let param ={
                stcd:detaildata.stcd,
                warntypeid:detaildata.warntypeid,
            }
            warnaddwaterlevel(param).then((res)=>{
                let linedata = res.data.result;
                if(detaildata.warntypeid == "1"){
                    this.ywarn = linedata[0].stthreshold 
                    this.linetitle = "警戒水位"
                }else{
                    this.ywarn = linedata[0].stindexunit 
                    this.linetitle = "警戒流量"
                }
            })
        },
        // 水位流量过程
        waterprocess(){
            let detaildata = this.item;
            let _this = this;
            let starttime = new Date().formatDate('yyyy-MM-dd 08:00:00');
            let endtime = new Date().datePro("{%d+7}").formatDate('yyyy-MM-dd 08:00:00');
            let processparam = {
                ennmcd:sessionStorage.getItem('ennmcd'),
                startDate:starttime,
                endDate:endtime,
            }
            warnaddprocess(processparam).then((res)=>{
                let data = res.data.result;
                let fzdata = [];
                let fqdata = [];
                let ftmdata = [];
                let chartdata = [];
                data.forEach((val,index)=>{
                    fzdata.push(val.fz)//水位
                    fqdata.push(val.fq)//流量
                    ftmdata.push(val.ftm)
                })
                if(detaildata.warntypeid == "1"){
                    fzdata.forEach((val)=>{
                        chartdata.push(val)
                    })
                }else{
                    fqdata.forEach((val)=>{
                        chartdata.push(val)
                    })
                }
                _this.initEcharts(chartdata,ftmdata)
            })
        },
        initEcharts(chartdata,ftmdata) {
            let self = this;
            let maxwarnline = this.ywarn;
            let maxchartdata = Math.max.apply(null,chartdata);
            let maxline = '';
            if( maxchartdata < maxwarnline ){
                maxline=maxwarnline
            }else{
                maxline=maxchartdata
            }
            this.chart = echarts.init(document.getElementById('echarts'));
            let option = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                    },
                },
                grid: {
                    left: 30,
                    right: 30,
                    bottom: 10,
                    top: 35,
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ftmdata
                },
                yAxis: {
                    type: 'value',
                    max:maxline
                },
                series: [{
                    data: chartdata,
                    type: 'line',
                    smooth: true,
                    markLine: {
                    symbolSize: 0,
                    label: {
                        position: "middle",
                        formatter(value) {
                        return value.name
                        }
                    },
                    data: [{
                        name: `${this.linetitle}:${this.ywarn}`,
                        yAxis: this.ywarn,
                        lineStyle: {
                            color: "red",
                            width: 1.5,
                            type: "solid",
                              opacity: this.ywarn === 0 ? 0 : 1
                            },
                            label: {
                              show: this.ywarn === 0 ? false : true
                            }
                        }]
                    }
                }],
            };
            this.chart.setOption(option);
        },
    }
}
</script>
<style lang="scss" scoped>
    .index-warndetail{
        width:100%;
        height:100%;
        .map{
            height:2.3rem;
        }
        .tabledescribetitle{
            height:.2rem;
            background:#fff;
            .describetitleleft{
                float:left;
            }
            .describetitleright{
                float:right;
                padding-right:.05rem;
            }
        }
        .warndetailtable{
            height:3.1rem;
            background: rgb(92, 199, 241);
            padding:.03rem;
            font-size:14px;
            .tabledescribe{
                height:0.7rem;
                .describeinfo{
                    text-indent: 0.3rem;
                    height:.6rem;
                }
            }
            .chart{
                height:2.3rem;
                background:#fff;
            }
        }
    }
</style>


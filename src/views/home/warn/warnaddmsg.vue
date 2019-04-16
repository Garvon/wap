<template>
    <div class="index-warnaddmsg">
        <div class="warnsite">
            <group>
                <popup-picker :title="title1" :data="siteoption" :columns="1" v-model="siteoptionval" ref="picker3" show-name @on-change="handlePickersitechange"></popup-picker>
            </group>
        </div>
        <div class="warnsite">
            <group>
                <popup-picker :title="title2" :data="warntype"  :columns="1" v-model="warntypeval" ref="picker3" show-name @on-change="handlePickerChange"></popup-picker>
            </group>
        </div>
        <div class="warncontant">
            <group title="预警内容">
                <x-textarea v-model="msgcontent"></x-textarea>
            </group>
        </div>
        <div class="warnflexbox">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="add">提交</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="warn"  @click.native="clear">重置</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>
<script>
import { XButton, Box, GroupTitle, Group, Flexbox, FlexboxItem, Divider, XTextarea, XInput, PopupPicker,Picker } from 'vux'
import { warnList, warnaddsite, warnaddtype, warnadd } from '@/api/warn'
export default {
    components: {
        XTextarea,
        Group,
        XInput,
        XButton,
        Box,
        GroupTitle,
        Flexbox,
        FlexboxItem,
        Divider,
        PopupPicker,  
        Picker,
        
    },
    name:"warnaddmsg",
    data(){
        return{
            msgcontent:"",
            siteoptionval:[],
            siteoption:[],
            warntype:[],
            warntypeval: [],
            title1: '预警站点',
            title2: '预警类型',
        }
    },
    mounted(){
        this.init()
    },
    methods:{
        init() {
            this.handleGetData();// 添加里的 预警站点
        },
        // 提交
        add(){
            let addparam = {
                stcd:this.siteoptionval[0],
                warntypeid:this.warntypeval[0],
                msgcontent:this.msgcontent,
                sendtype:"S",
                sendtm:new Date().formatDate('yyyy-MM-dd HH:mm:ss'),
                creatnm:sessionStorage.getItem('username'),
                creattype:"APP"
            }
            warnadd(addparam).then((res)=>{})
        },
        // 重置
        clear(){
            this.siteoptionval=[],
            this.warntypeval=[],
            this.msgcontent=""
        },
        handleGetData() {
            let _this = this;
            warnaddsite().then((res)=>{
                let data = res.data.result;
                _this.handleWarnaddSiteData(data)
                let stcd = res.data.result[0].stcd;
               this.apiwarntype(stcd);// 添加 里的预警类型
            })
        },
        handleWarnaddSiteData(data) {
            if(data.length) {
                data.map((val, index) => {
                    val["name"] = val["stnm"]
                    val["value"] = val["stcd"]
                })
                this.siteoption = data;
                this.siteoptionval.push(this.siteoption[0].value)
            }
        }, 
        handlePickersitechange(val){
            this.siteoptionval = [];
            this.siteoptionval.push(String(val))
        },
        // 添加 里的预警类型
        apiwarntype(stcd){
            let par = {
                stcd:stcd
            }
            let _this = this;
            warnaddtype(par).then((res)=>{
                let typedata= res.data.result;
                 _this.handlewarnaddtype(typedata);
            })
        },
        handlewarnaddtype(typedata){
            if(typedata.length) {
                typedata.map((val, index) => {
                    val["name"] = val["warntypenm"]
                    val["value"] = val["warntypeid"]
                })
                this.warntype = typedata;
                this.warntypeval.push(this.warntype[0].value)
            }
        },
        handlePickerChange(val) {
            this.warntypeval = [];
            this.warntypeval.push(Number(val[0]))
        }
        
    }
}
</script>
<style lang="scss" scoped>
.index-warnaddmsg{
    // width:100%;
    // height:100%;
    .warnsite{
        height:.5rem;
        font-size: 14px;
    }
     .warncontant{
        height:1.5rem;
        font-size: 14px;
    }
    .warnflexbox{
        width: 90%;
        margin:0 auto;
    }
}
</style>

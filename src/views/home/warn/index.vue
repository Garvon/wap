<template>
    <div class="index-warn">
        <div class="warnheader" @click="toaddwarn('./warnaddmsg')">
            <div class="warnicon">
                <span class="warnadd">+</span>
                <div class="link-icon warnfont">
                    <svg class="icon link-font" aria-hidden="true">
                        <use xlink:href="#icon-yujing"></use>
                    </svg>
                </div>
            </div>
        </div>
        <div class="warnlist">
            <div class="warnlistbox" v-for="(item,index) in listdata" :key="index"  @click="towarndetail(item)">
                <div class="warnlisticon"></div>
                <div class="warnlistdetail">
                    <div class="wdetailtitle">{{item.warntypenm}}</div>
                    <div class="wdetailtime">{{item.creattm}}</div>
                    <p class="wdetailp">{{item.msgcontent}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {warnList} from '@/api/warn'
import { mapGetters, mapMutations } from 'vuex'

export default {
   data(){
       return{
           listdata:[],
       }
   },
   mounted(){
       this.warn();
   },
   methods:{
       ...mapMutations('warnmsg', ['CHANGE_ITEM']),
        towarndetail(item){
            item.name=item.stnm;
            this.tolink('./wrandetail');
            this.CHANGE_ITEM(item);
        },
        tolink(path){
            this.$router.push(path);
        },
        warn(){
            let param = {
                ennmcd:sessionStorage.getItem("ennmcd"),
            }
            warnList(param).then((res)=>{
                this.listdata = res.data.result;
            })
        },
        toaddwarn(path){
            this.$router.push(path);
        },
       
    }
}
</script>
<style lang="scss" scoped>
    .index-warn {
        width: 100%;
        height: 100%;

        .warnheader {
            height: 1rem;
            background: url('~@/assets/warn/u4167.png') no-repeat 0 0;
            background-size: 100% 100%;
            margin: 0 auto;
            position: relative;

            .warnicon {
                width: .5rem;
                height: .5rem;
                background: red;
                border-radius: .25rem;
                position: absolute;
                right: .1rem;
                bottom: .1rem;

                .warnadd {
                    font-size: 14px;
                    font-weight: 900;
                    color: #fff;
                    position: absolute;
                    top: .06rem;
                    left: .06rem;
                }

                .warnfont {
                    font-size: 20px;
                    color: #fff;
                    position: absolute;
                    // top:-.02rem;
                    right: .12rem;
                    bottom: .12rem;
                }
            }
        }
    }
    .warnlist{
        width:100%;
        // height:100%;
        .warnlistbox{
            height:.7rem;
            .warnlisticon{
                width:.5rem;
                height:.5rem;
                background: rgb(255, 196, 0);
                border-radius: .1rem;
                float:left;
                margin:.1rem 0 0 .1rem;
            }
            .warnlistdetail {
                width: 2.8rem;
                height: .7rem;
                float: left;
                font-size: 12px;
                margin-left: .2rem;
                border-bottom: 1px solid #ccc;
                padding-top: .1rem;
                .wdetailtitle {
                    height: .3rem;
                    float: left;
                    line-height: .2rem;
                }
                .wdetailtime {
                    height: .3rem;
                    float: right;
                    line-height: .2rem;
                }
                .wdetailp {
                    width: 2.8rem;
                    float: left;
                    line-height: .2rem;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
</style>
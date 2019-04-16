<template>
  <div class="wrapper">
    <view-box body-padding-top="46px"
              body-padding-bottom="50px">
      <x-header :left-options="leftOptions"
                slot="header"
                class="title"
                :title="$route.name"></x-header>
      <section 
        class="content"
        :class="{ 'content-bg': $route.path === '/my' }">
        <router-view/>
      </section>
      <tabbar slot="bottom">
        <tabbar-item link="/index" :selected="$route.path === '/index'">
          <svg class="icon tab-item-color" aria-hidden="true" slot="icon">
            <use xlink:href="#icon-shouye"></use>
          </svg>
          <span class="tab-item-color" slot="label">首页</span>
        </tabbar-item>
        <tabbar-item link="/rain" :selected="$route.path === '/rain'">
          <svg class="icon tab-item-color" aria-hidden="true" slot="icon">
            <use xlink:href="#icon-yuqingchaxun"></use>
          </svg>
          <span class="tab-item-color" slot="label">雨情</span>
        </tabbar-item>
        <tabbar-item link="/water" :selected="$route.path === '/water'">
          <svg class="icon tab-item-color" aria-hidden="true" slot="icon">
            <use xlink:href="#icon-shuiqingchaxun"></use>
          </svg>
          <span class="tab-item-color" slot="label">水情</span>
        </tabbar-item>
        <tabbar-item link="/warn" :selected="$route.path === '/warn'">
          <svg class="icon tab-item-color" aria-hidden="true" slot="icon">
            <use xlink:href="#icon-yujing"></use>
          </svg>
          <span class="tab-item-color" slot="label">预警</span>
        </tabbar-item>
        <tabbar-item link="/my" :selected="$route.path === '/my'">
          <svg class="icon tab-item-color" style="font-size: 20px;" aria-hidden="true" slot="icon">
            <use xlink:href="#icon-wode"></use>
          </svg>
          <span class="tab-item-color" slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
import { XHeader, Tabbar, TabbarItem, ViewBox } from 'vux'
import '@/assets/iconfont/iconfont.js'

export default {
  components: {
    XHeader,
    Tabbar,
    TabbarItem,
    ViewBox
  },
  computed: {
    leftOptions () {
      return {
        showBack: this.$route.meta.showBack,
        backText: ''
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/theme.scss";
.tab-item-color {
  color: #999999;
}
.wrapper .weui-bar__item_on .tab-item-color {
  color: $themeColor;
}
.title {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 2;
}
.wrapper {
  height: 100%;
}
.content {
  height: 100%;
  overflow-y: scroll;
}
.content-bg {
  background: linear-gradient(to bottom right, #68C9B7 , #3677CE);
}
.icon {
  font-size: 22px;
}
</style>

<template>
  <div class="tab-wrapper">
    <Icon class="tab-title-icon" type="logo-buffer"/>
    <p>{{title}}<span v-if="subTitle" class="tab-title">{{subTitle}}</span></p>
  </div>
</template>

<script>
import { Icon } from 'iview'

export default {
  name: 'sectionTitle',
  components: {
    Icon
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    subTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-wrapper {
  display: flex;
  align-items: center;
  height: .3rem;
  line-height: .3rem;
  >p {
    margin-left: .05rem;
    font-size: .14rem;
    color: #515a6e;
  }
}
.tab-title-icon {
  font-size: .2rem;
}
.tab-title {
  display: inline-block;
  font-size: .12rem;
  color: #999;
  text-indent: .08rem;
}
</style>

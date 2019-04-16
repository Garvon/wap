<template>
  <div class="login-wrapper">
    <div
      class="login"
      :style="{ height: height }">
      <div class="login-con">
        <Card
          icon="log-in"
          title="欢迎登录"
          :bordered="false">
          <div class="form-con">
            <login-form @on-success-valid="handleSubmit"></login-form>
            <p class="login-tip">{{prompt}}</p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/login-form'
import { Card } from 'iview'
import { login, getRsvrid } from '@/api/login'
import { debug } from 'util';

export default {
  components: {
    LoginForm,
    Card
  },
  data() {
    return {
      height: `${document.documentElement.clientHeight}px`,
      prompt: ''
    }
  },
  methods: {
    async handleSubmit ({ username, password }) {
      let res
      let Authorization
      let resRes
      let resResData

      this.$vux.loading.show({
        text: '加载中'
      })
      // 登录
      res = await login({
        username,
        password
      })
      if (res.data !== '') {
        this.prompt = res.data.message
        this.$vux.loading.hide()
      } else {
        this.prompt = ''
        Authorization = res.headers.authorization
        if (Authorization) {
          sessionStorage.setItem("authorization", Authorization)
          sessionStorage.setItem("username", username)
          // 获取水库信息
          resRes = await getRsvrid({
            userName: username
          })
          resResData = resRes.data.result[0]
          sessionStorage.setItem('ennmcd', resResData.ennmcd)
          sessionStorage.setItem('ennm', resResData.ennm)
          this.$router.replace('/index')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  height: 100%;
  overflow-y: scroll;
}
.login {
  background: linear-gradient(to bottom right, #68C9B7 , #3677CE);
  position: relative;
  &-con{
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 300px;
    .ivu-card {
      background: rgba(255, 255, 255, .65);
    }
    &-header{
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con{
      padding: 10px 0 0;
    }
    .login-tip{
      font-size: 12px;
      text-align: center;
      color: red;
    }
  }
}
</style>

import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: () =>
        import('./views/home'),
      redirect: '/login',
      children: [
        //首页
        {
          name: '首页',
          path: '/index',
          meta: {
            showBack: false
          },
          component: () =>
            import('./views/home/index/')
        },
        // 我的
        {
          name: '我的',
          path: '/my',
          meta: {
            showBack: false
          },
          component: () =>
            import('./views/home/my')
        },
        // 雨情
        {
          name: '雨情',
          path: '/rain',
          meta: {
            showBack: false
          },
          component: () =>
            import('./views/home/rain')
        },
        // 水情
        {
          name: '水情',
          path: '/water',
          meta: {
            showBack: false
          },
          component: () =>
            import('./views/home/water')
        },
        // 预警
        {
          name: '预警',
          path: '/warn',
          meta: {
            showBack: false
          },
          component: () =>
            import('./views/home/warn')
        },
        // 实时雨情单站
        {
          name: '实时水情过程',
          path: '/waterReal',
          meta: {
            showBack: true
          },
          component: () =>
            import('./views/home/water/waterReal')
        },
        // 预报雨情单站
        {
          name: '预报水情过程',
          path: '/waterForecast',
          meta: {
            showBack: true
          },
          component: () =>
            import('./views/home/water/waterForecast')
        },
        // 雨情详情
        {
          name: '降雨过程',
          path: '/raindetail',
          meta: {
            showBack: true
          },
          component: () =>
            import('./views/home/rain/raindetail.vue')
        },
        // 增加预警信息
        {
          name: '我要预警',
          path: '/warnaddmsg',
          meta: {
            showBack: true
          },
          component: () =>
            import('./views/home/warn/warnaddmsg.vue')
        },
        // 增加预警详情
        {
          name: '预警详情',
          path: '/wrandetail',
          meta: {
            showBack: true
          },
          component: () =>
            import('./views/home/warn/wrandetail.vue')
        }
      ]
    }
  ]
})
import axios from '@/utils/axios'
import qs from 'qs'

// 登录
export function login(param) {
  return axios.post('/system/user/v1/login', qs.stringify(param))
}

// 获取水库相关信息
export function getRsvrid(param) {
  return axios.post('water/rsvr/rainfall/meta/v1/rsvrid', param)
}


// 修改登录
export function confirmlogin(param) {
  return axios.put('/system/user/v1/pwd', param)
}
import axios from '@/utils/axios'

// 获取水库相关信息
export function warninfo(ennmcd) {
  return axios.get(`water/rsvr/rainfall/v1/warninfo/${ennmcd}`)
}

// 未来七日-降水-流量
export function floodrain({ ennmcd, startDate, endDate }) {
  return axios.get(`water/rsvr/flood/v1/basin/floodrain/${ennmcd}/${startDate}/${endDate}`)
}

// 未来七日-预报水位
export function forecastz({ ennmcd, startDate, endDate }) {
  return axios.get(`water/rsvr/rainfall/v1/forecastz/${ennmcd}/${startDate}/${endDate}`)
}

// 溃坝水位 起调水位 警戒水位
export function waterlevel({ ennmcd, startDate, endDate }) {
  return axios.get(`water/rsvr/rainfall/v1/waterlevel/${ennmcd}/${startDate}/${endDate}`)
}
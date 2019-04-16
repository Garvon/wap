import axios from '@/utils/axios'

// 预报水情
export function apprainflow ({ ennmcd, startDate, endDate }) {
  return axios.get(`water/rsvr/flood/v1/basin/apprainflow/${ennmcd}/${startDate}/${endDate}`)
}

// 预报单站详情-雨洪
export function siteforecastdetails ({ stcd, startDate, endDate }) {
  return axios.get(`water/rsvr/flood/v1/basin/siteforecastdetails/${stcd}/${startDate}/${endDate}`)
}

// 溃坝水位 起调水位 警戒水位
export function waterlevel ({ ennmcd, startDate, endDate }) {
  return axios.get(`water/rsvr/rainfall/v1/waterlevel/${ennmcd}/${startDate}/${endDate}`)
}

// 实时水情
export function realflood (ennmcd) {
  return axios.get(`water/rsvr/flood/v1/basin/realfloodstcd/${ennmcd}`)
}

// 实时单站详情
export function stcdrealrain ({ stcd, startDate, endDate }) {
  return axios.get(`water/rsvr/flood/v1/basin/realqz/${stcd}/${startDate}/${endDate}`)
}

import axios from '@/utils/axios'
import qs from 'qs'

//最新预警
export function warnList({ennmcd}) {
    return axios.get(`water/rsvr/rainfall/v1/warninfo/${ennmcd}`)
}

//添加里的 预警站点 
export function warnaddsite() {
    return axios.get(`water/rsvr/warn/meta/v1/warnstcd`)
}

// 添加 里的预警类型
export function warnaddtype({stcd}) {
    return axios.get(`water/rsvr/warn/meta/v1/warntype/${stcd}`)
}

// 添加 
export function warnadd(param) {
    return axios.post(`water/rsvr/warn/meta/v1/increasewarn`, param)
}

// 警戒水位、警戒流量
export function warnaddwaterlevel({stcd,warntypeid}) {
    return axios.get(`water/rsvr/warn/meta/v1/latelywarntype/${stcd}/${warntypeid}`)
}

// 水位流量过程
export function warnaddprocess({ennmcd, startDate, endDate}) {
    return axios.get(`water/rsvr/rainfall/v1/zq/${ennmcd}/${startDate}/${endDate}`)
}
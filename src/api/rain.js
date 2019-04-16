import axios from '@/utils/axios'
import qs from 'qs'

//单站降雨实测+预报
export function rainList({ennmcd,startDate,endDate,flagRealOrPred}) {
    return axios.get(`water/rsvr/rainfall/v1/stcd/${ennmcd}/${startDate}/${endDate}/${flagRealOrPred}`)
}

//(详情)实时降雨过程-单个站点近七日降雨过程
export function rainDetailRealSite({stcd,startDate,endDate}) {
    return axios.get(`water/rsvr/rainfall/v1/siterealrain/${stcd}/${startDate}/${endDate}`)
}

//(详情)预报降雨过程-单个站点未来七日降雨过程
export function rainDetailForecastSite({stcd,startDate,endDate}) {
    return axios.get(`water/rsvr/rainfall/v1/siteforecastweektrain/${stcd}/${startDate}/${endDate}`)
}

//(详情)实时-24小时最大降雨
export function rainDetailRealRainfall({stcd,startDate,endDate}) {
    return axios.get(`water/rsvr/rainfall/v1/siterealeverydaymaxrain/${stcd}/${startDate}/${endDate}`)
}

//(详情)预报-24小时最大降雨
export function rainDetailForecastRainfall({stcd,startDate,endDate}) {
    return axios.get(`water/rsvr/rainfall/v1/siteforecasteverydaymaxrain/${stcd}/${startDate}/${endDate}`)
}


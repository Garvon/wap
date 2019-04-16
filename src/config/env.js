// 后端api
let apiUrl = 'http://192.168.100.106:8081/reservoir.web'
// 天地图服务
let baseUrl = 'http://t3.tianditu.com/DataServer'
// 地图服务
let mapUrl = 'http://222.128.60.210:9093/geoserver/kytx/ows'

// 生产模式
if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://svn1.kunyuantx.com:9112/api'
  mapUrl = 'https://svn1.kunyuantx.com:9112/map/'
}

// 上游边界
let upstreamUrl = `${mapUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=kytx:pjk_bound&maxFeatures=50&outputFormat=application%2Fjson`
// 河流
let waterBoundary = `${mapUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=kytx:pjk_rivers&maxFeatures=500&outputFormat=application%2Fjson`

export {
  apiUrl,
  baseUrl,
  upstreamUrl,
  waterBoundary
}
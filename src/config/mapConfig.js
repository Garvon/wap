import { transform } from 'ol/proj'

export default {
  mapCfg: {
    projection: 'EPSG:3857', //地图投影
    center: transform([117.33, 41.50], 'EPSG:4326', 'EPSG:3857'), //[12961280.558913283, 4852644.500221988],//默认中心点
    zoom: 8, //默认缩放等级
    maxZoom: 14, //最大等级
    minZoom: 4 //最小等级
  },
  mapInteractionCfg: { //地图交互配置 可参考ol.interaction.defaults参数配置
    doubleClickZoom: false
  }
}
<template>
  <div></div>
</template>

<script>
import 'ol/ol.css'
import { baseUrl, upstreamUrl, waterBoundary } from '@/config/env'
import mapConfig from "@/config/mapConfig"
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile, Vector as VectorLayer } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Stroke, Circle, Fill, Text } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'

export default {
  props: {
    itemData: {
      type: Object,
      default() {
        return {
          lgtd: 117.33,
          lttd: 41.50,
          name: '水库'
        }
      }
    }
  },
  mounted() {
    let { lgtd, lttd } = this.itemData
    let pointFlag = true
    let map
    let coor
    if (!lgtd || !lttd) {
      lgtd = 117.33
      lttd = 41.50
      pointFlag = false
    }
    coor = transform([lgtd, lttd], 'EPSG:4326', 'EPSG:3857')
    mapConfig.mapCfg.center = coor
    map = new Map({
      view: new View(mapConfig.mapCfg),
      target: this.$el,
      layers: [
        // 底图
        new Tile({
          source: new XYZ({
            url: `${baseUrl}?T=img_w&x={x}&y={y}&l={z}`
          })
        }),
        // 上游边界
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: upstreamUrl
          }),
          style() {
            return new Style({
              stroke: new Stroke({
                color: 'gold',
                width: 4
              })
            })
          },
          title: '上游边界'
        }),
        // 河流
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: waterBoundary
          }),
          style() {
            return new Style({
              stroke: new Stroke({
                color: 'blue',
                width: 2
              })
            })
          },
          title: '河流'
        })
      ]
    })
    // 所在位置
    pointFlag && map.addLayer(new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point(coor),
            attribute: this.itemData
          })
        ]
      }),
      style(feature) {
        return new Style({
          text: new Text({
            text: feature.getProperties().attribute.name,
            offsetY: 12,
            offsetX: 0,
            fill: new Fill({
              color: 'white'
            })
          }),
          image: new Circle({
            radius: 4,
            stroke: new Stroke({
              color: '#fff'
            }),
            fill: new Fill({
              color: 'red'
            })
          })
        })
      }
    }))
  }
}
</script>

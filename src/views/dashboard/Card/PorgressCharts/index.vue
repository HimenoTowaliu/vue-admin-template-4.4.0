<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'PorgressCharts',
  mounted() {
    //初始化实例
    let myecharts = echarts.init(this.$refs.charts)
    myecharts.setOption({
      xAxis: {
        show: false,
        //最大值最小值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [

        {
          smooth: true,
          type: 'bar',
          data: [78],
          //柱状图宽度
          barWidth: 10,
          //背景颜色
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          //文本
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }

        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    //初始化实例
    let myecharts = echarts.init(this.$refs.charts)
    myecharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      //提示信息
      toolTip: {},
      series: [

        {
          smooth: true,
          type: 'bar',
          data: [10, 8, 66, 23, 50, 44, 45, 12, 65, 32, 45, 1],
          color: 'skyblue'


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
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count='￥ 12656'>
            <template v-slot:charts>
              <span>周同比&nbsp;
                56.67%
                <svg t="1658369193935" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4906" width="16" height="16">
                  <path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3c-3.8 5.3-0.1 12.7 6.5 12.7h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z" p-id="4907" fill="#1afa29"></path>
                </svg>
              </span>&nbsp;
              <span>
                日同比 &nbsp; 96%
                <svg t="1658369309697" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6120" width="16" height="16">
                  <path d="M830.24 340.688l11.328 11.312a16 16 0 0 1 0 22.624L530.448 685.76a16 16 0 0 1-22.64 0L196.688 374.624a16 16 0 0 1 0-22.624l11.312-11.312a16 16 0 0 1 22.624 0l288.496 288.496 288.512-288.496a16 16 0 0 1 22.624 0z" p-id="6121" fill="#d81e06"></path>
                </svg>
              </span>
            </template>
            <template v-slot:footer>
              <span> 日销售额￥12555</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count='99460'>
            <template v-slot:charts>
              <LineChart></LineChart>
            </template>
            <template v-slot:footer>
              <span> 日访问量 &nbsp;12456</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count='88460'>
            <template v-slot:charts>
              <BarChart></BarChart>
            </template>
            <template v-slot:footer>
              <span> 转换率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count='78%'>
            <template v-slot:charts>
              <PorgressCharts></PorgressCharts>
            </template>
            <template v-slot:footer>
              <span>周同比&nbsp;
                56.67%
                <svg t="1658369193935" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4906" width="16" height="16">
                  <path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3c-3.8 5.3-0.1 12.7 6.5 12.7h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z" p-id="4907" fill="#1afa29"></path>
                </svg>
              </span>&nbsp;
              <span>
                日同比 &nbsp; 96%
                <svg t="1658369309697" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6120" width="16" height="16">
                  <path d="M830.24 340.688l11.328 11.312a16 16 0 0 1 0 22.624L530.448 685.76a16 16 0 0 1-22.64 0L196.688 374.624a16 16 0 0 1 0-22.624l11.312-11.312a16 16 0 0 1 22.624 0l288.496 288.496 288.512-288.496a16 16 0 0 1 22.624 0z" p-id="6121" fill="#d81e06"></path>
                </svg>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail/index.vue'
import LineChart from './LineChart/index.vue'
import BarChart from './BarChart/index.vue'
import PorgressCharts from './PorgressCharts/index.vue'
export default {
  name: 'Card',
  components: {
    Detail,
    LineChart,
    BarChart,
    PorgressCharts
  }
}
</script>

<style>
</style>
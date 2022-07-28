<template>
  <div>
    <el-card class="box-card" style="margin:20px 0">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs class="tabs " v-model="activeName">
          <!-- v-model="activeName" @tab-click="handleClick" -->
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <a href="javascript:void(0)"><span @click="setday">今日</span></a>
          <span @click="setweek">本周</span>
          <span @click="setmonth">本月</span>
          <span @click="setyear">本年</span>
          <!-- v-model="value1" -->
          <el-date-picker value-format="yyyy-MM-dd" v-model="date" size="mini" class="date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="8">
            <div class="right2">
              <h3>门店{{title}}排名</h3>
              <ul>
                <li><span class="rindex">1</span><span>肯德基</span> <span class="rvalue">123456</span></li>
                <li><span class="rindex">2</span><span>肯德基</span> <span class="rvalue">123456</span></li>
                <li><span class="rindex">3</span><span>肯德基</span> <span class="rvalue">123456</span></li>
                <li><span>4</span><span>肯德基</span> <span class="rvalue">123456</span></li>
                <li><span>5</span><span>肯德基</span> <span class="rvalue">123456</span></li>
                <li><span>6</span><span>肯德基</span> <span class="rvalue">123456</span></li>
                <li><span>7</span><span>肯德基</span> <span class="rvalue">123456</span></li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import echarts from 'echarts'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      //收集日历
      date: []
    }
  },
  computed: {
    //标题
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch: {
    listState() {
      this.mycharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        xAxis: {
          data: this.listState.orderFullYearAxis
        },
        series: [
          {
            color: '#99a9bf',
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listState.orderFullYear //10, 52, 200, 334, 390, 330, 10, 52, 200, 334, 390, 330
          }
        ]
      })
    },
    title: {
      // immediate: true,
      handler() {
        //   alert('22')
        // console.log(this.mycharts)
        this.mycharts.setOption({
          title: {
            text: this.title + '趋势'
          },
          xAxis: {
            data: this.title == '销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
          },
          series: [
            {
              color: '#99a9bf',
              name: 'Direct',
              type: 'bar',
              barWidth: '60%',
              data: this.title == '销售额' ? this.listState.orderFullYear : this.listState.userFullYear   //10, 52, 200, 334, 390, 330, 10, 52, 200, 334, 390, 330
            }
          ]
        })
      }

    }
  },
  mounted() {
    //初始化实例
    this.mycharts = echarts.init(this.$refs.charts)
    this.mycharts.setOption({
      title: {
        text: this.title + '趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],//"一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          color: '#99a9bf',
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: []//10, 52, 200, 334, 390, 330, 10, 52, 200, 334, 390, 330
        }
      ]

    })
  },
  methods: {
    setday() {
      const day = dayjs().format('YYYY-MM-DD')

      this.date = [day, day]
    },
    setweek() {
      let day = dayjs().day(1).format('YYYY-MM-DD')
      let day2 = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [day, day2]

    },
    setmonth() {
      let day = dayjs().startOf('month').format('YYYY-MM-DD')
      let day2 = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [day, day2]
    },
    setyear() {
      let day = dayjs().startOf('year').format('YYYY-MM-DD')
      let day2 = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [day, day2]
    }
  }
}
</script>

<style scoped>
.rvalue {
  float: right;
}
.rindex {
  width: 20px;
  height: 20px;
  float: left;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  margin-right: 20px;
}
ul {
  list-style: none;
  width: 100%;
  height: 250px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
.right2 {
  margin: 0;
  padding: 0;
}
.charts {
  width: 100%;
  height: 300px;
}
.date {
  width: 250px;
}
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
</style>
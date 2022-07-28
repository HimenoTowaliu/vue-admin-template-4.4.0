<template>
  <div>
    <el-table :data="records" style="width: 100%" border>
      <el-table-column prop="prop" label="序号" align="center" width="80" type="index">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="scope">
          <img :src="scope.row.skuDefaultImg" alt="" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="200">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-if="scope.row.isSale==0" @click="sale(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="cancel(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination style="text-align:center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout=" prev, pager, next, jumper,->,total, sizes" :total="total">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :direction="direction" :show-close='false' size='40%'>
      <el-row>
        <el-col :span="5">
          名称
        </el-col>
        <el-col :span="16">
          {{skuInfo.skuName}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          描述
        </el-col>
        <el-col :span="16">
          {{skuInfo.skuDesc}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          价格
        </el-col>
        <el-col :span="16">
          {{skuInfo.price}}元
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          平台属性
        </el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" style="margin-right:10px" :key="index">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          商品属性
        </el-col>
        <el-col :span="16">
          <el-carousel height="350px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id" height="350px">
              <img :src="item.imgUrl" alt="" style="height:350px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: 'Sku', data() {
    return {
      page: 1,
      limit: 10,
      records: [],  //存储sku列表的数据
      total: 0,    //总共多少条数据
      skuInfo: {},  //存储sku信息
      drawer: false,
      direction: 'rtl',
    }
  },
  methods: {
    //获取sku列表的方法
    async getSkuList() {
      let { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      // console.log(result)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    //分页改变
    handleCurrentChange(page) {
      this.page = page
      this.getSkuList()
    },
    //size改变
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    async sale(row) {
      //上架
      let result = await this.$API.sku.reqSale(row.id)
      if (result.code == 200) {
        this.getSkuList()
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    //下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id)
      if (result.code == 200) {
        this.getSkuList()
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    //获取sku详情
    async getSkuInfo(sku) {
      //展示数据
      // console.log(this.drawer)
      this.drawer = true
      // console.log(this.drawer)
      //获取sku数据
      let result = await this.$API.sku.reqSkuById(sku.id)
      // console.log(result)
      if (result.code == 200) {
        this.skuInfo = result.data
      }
    }


  },
  mounted() {
    this.getSkuList()
  }
}
</script>

<style >
.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>


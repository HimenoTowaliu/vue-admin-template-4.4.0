<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scence!=0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 三部分进行切换 -->
      <!-- 展示spu列表结构 -->
      <div v-show="scence==0">
        <el-button type="primary" icon="el-icon-plus" :disabled='!category3Id' @click="addSpu"> 添加SPU</el-button>
        <el-table style="width: 100%" :data="records">
          <el-table-column label="序号" width="80px" type="index" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里按钮用hintbutton替换 -->
              <HintButton type="success" icon="el-icon-plus" size="mini" :title1="`添加sku`" @click="addSku(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" :title1="`修改spu`" @click="updateSpu(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" :title1="`查看当前spu全部sku列表`" @click="handler(row)"></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm='deleteSpu(row)'>
                <HintButton type="danger" slot="reference" icon="el-icon-delete" size="mini" :title1="`删除spu`"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align:center" @size-change="handleSizeChange" @current-change="handlecurrentChange" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, ->,sizes, total" :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scence==1" @changeScene='changeScene' ref="spu"></SpuForm>
      <SkuForm v-show="scence==2" ref="sku" @changeScenes='changeScenes'></SkuForm>
    </el-card>
    <!-- //展示spu的sku列表 -->
    <el-dialog :title="`${spu.spuName}`" :visible.sync="dialogTableVisible" :before-close='close'>
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="address" label="默认图片">
          <template slot-scope="scope">
            <img :src="scope.row.skuDefaultImg" style="height:100px;width:100px" alt="">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { reqAddOrUpdateTradeMark } from '@/api/product/tradeMark'
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name: 'Spu',
  components: {
    SkuForm, SpuForm
  },
  data() {
    return {
      loading: true,
      spu: {},  //存储  展示spu实例sku列表时的spu信息
      skuList: [],  //存储要展示的某一spu的sku
      dialogTableVisible: false,  //控制对话框显示与隐藏
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,   //分页器当前第几页
      limit: 3,   //每一页展示多少条数据
      records: [],//存储spu列表数据
      total: 0, //分页器一共多少条数据
      scence: 0,   //0代表展示spu列表  1展示添加或修改spu  2 展示添加sku
    }
  },
  methods: {
    //自定义事件回调 自给父传数据 三个id
    getCategoryId(cForm) {
      const { category1Id, category2Id, category3Id } = cForm;
      // console.log(category1Id,category2Id,category3Id)   没有的会显示undefined
      if (category1Id) {
        this.category1Id = category1Id;
        this.category2Id = "";
        this.category3Id = "";

      }
      if (category2Id) {
        this.category2Id = category2Id;
        this.category3Id = "";
      }
      if (category3Id) {
        this.category3Id = category3Id;
        //发请求获取属性
        this.getAttrList();
      }
    },
    //获取spu列表数据的方法
    async getAttrList() {
      const { page, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      // console.log(result)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    //分页器第几页按钮的回调
    handlecurrentChange(page) {
      // console.log(page)
      this.page = page
      this.getAttrList()
    },
    handleSizeChange(size) {
      this.limit = size
      this.getAttrList()
    },
    //添加spu按钮的回调
    addSpu() {
      this.scence = 1
      //通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    //修改spu按钮的回调
    updateSpu(row) {
      this.scence = 1
      //获取子组件spuform
      //在父组件中可以通过ref获取子组件
      this.$refs.spu.initSpuData(row)
    },
    //删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      // console.log(result)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '删除成功' })
      }
      if (this.records.length > 1) this.getAttrList()
      else {
        this.page -= 1
        this.getAttrList()
      }

    },
    //添加sku
    addSku(row) {
      this.scence = 2
      //子组件发请求 3个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    //查看某一个spu的sku列表
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      let result = await this.$API.spu.reqSkuList(spu.id)
      // console.log(result)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    //自定义是事件回调  spuForm 传入一个scence值
    changeScene({ scence, flag }) {
      this.scence = scence
      //flag是为了区分保存按钮是添加还是修改
      //停留在当前页
      if (flag == '修改') { this.getAttrList() }
      else {
        this.page = 1
        this.getAttrList()
      }
      //再次获取spu列表的数据进行展示
      this.getAttrList()
    },
    //skuform通知父组件修改场景
    changeScenes(scene) {
      this.scence = scene
    },
    //关闭对话框的回调
    close(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>

<style>
</style>


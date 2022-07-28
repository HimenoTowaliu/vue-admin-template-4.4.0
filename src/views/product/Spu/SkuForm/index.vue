<template>
  <div>
    <el-form ref="form" :model="skuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元）">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(kg)">
        <el-input v-model="skuInfo.weight" placeholder="重量(kg)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="index">
            <el-select v-model="attr.attrIdAndValue" placeholder="请选择">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="index">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValue">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- :data="data" -->
        <el-table :data="spuImageList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" width="80px" type="selection">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="height:100px;width:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefalut(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],  //存储图片信息
      spuSaleAttrList: [],//存储销售属性
      attrInfoList: [],  //存储平台属性
      spu: {},
      skuInfo: {     //sku字段的信息
        category3Id: 0,
        spuId: 0,
        tmId: 0,    //这三条父组件给的

        //第二类数据 v-model收集
        price: 0,
        weight: "",
        skuName: "",
        skuDesc: "",



        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],


        //第三类自己书写代码收集
        //默认图片
        skuDefaultImg: "",
        //收集图片字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
      },
      imageList: []            //收集图片的字段
    }
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      //手机父组件给予的数据
      // console.log(arguments)
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // console.log(spu)
      this.spu = spu
      //获取图片的数据
      let result = await this.$API.spu.reqSpuImageList(spu.id)
      // console.log(result)
      if (result.code == 200) {
        let list = result.data
        list.forEach(element => {
          element.isDefault = 0
        });
        this.spuImageList = list

      }
      //获取销售属性
      let result1 = await this.$API.spu.reqSaleAttrList(spu.id)
      // console.log(result1)
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }
      //获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      // console.log(result2)
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      }
    },

    //获取用户勾选的元素
    handleSelectionChange(selection) {
      // console.log(selection)
      //获取图片数组信息 但是缺少isDefault
      this.imageList = selection
    },
    //修改默认
    changeDefalut(row) {
      //图片列表的defalt变为0
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    //切换场景
    cancel() {
      this.$emit('changeScenes', 0)
      Object.assign(this._data, this.$options.data())
    },
    //保存按钮的回答
    async save() {
      //整理数据
      // console.log('dd')
      const { attrInfoList } = this
      let arr = []
      attrInfoList.forEach(item => {
        // console.log(item.attrIdAndValue)
        // console.log(!!item.attrIdAndValue)
        if (!!item.attrIdAndValue) {   //代表用户已经进行选择

          let [attrId, ValueId] = item.attrIdAndValue.split(':')
          //携带的应该是对象
          let obj = { attrId, ValueId }
          // console.log(obj)
          arr.push(obj)
          // console.log(arr)
        }
      })
      // //整理好的给spuinfo
      this.skuInfo.skuAttrValueList = arr
      let arr2 = []
      //整理销售属性
      this.spuSaleAttrList.forEach(item => {
        if (item.attrIdAndValue) {
          let [saleAttrId, saleAttrValueId] = item.attrIdAndValue.split(':')
          let obj = { saleAttrId, saleAttrValueId }
          arr2.push(obj)
        }
      })
      // console.log(arr2)
      this.skuInfo.skuSaleAttrValueList = arr2

      //整理图片的数据
      let { imageList } = this
      this.skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      let result = await this.$API.spu.reqAddSku(this.skuInfo)
      //  console.log(result)
      // console.log(this.$API.spu.reqAddSku(this.skuInfo))
      if (result.code == 200) {
        this.$emit('changeScenes', 0)
        this.$message({ type: 'success', message: '添加sku成功' })
        Object.assign(this._data, this.$options.data())
      }
    }
  }
}
</script>

<style>
</style>
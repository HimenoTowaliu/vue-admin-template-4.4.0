<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName||'当前tmName为空'" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows='4' placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片  list-type  照片像 on-preview 照片预览的时候触发
        file-list 显示照片墙-->
        <el-upload :on-success="handleAvatarSuccess" :file-list="spuImageList" action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSeletedSaleAttr.length}个未选择`" v-model="attrIdAndattrName">
          <el-option v-for="(unselet,index) in  unSeletedSaleAttr" :key="index" :label="unselet.name" :value="`${unselet.id}:${unselet.name}`"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndattrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <!-- :data="data"  saleAttrList   spu.spuSaleAttrList-->
          <el-table-column type="index" label="序号" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="240px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <!-- @close="handleClose(tag)" -->
              <el-tag :key="index" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- 这连个结构相互切换 v-if -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)">
                <!-- @keyup.enter.native="handleInputConfirm(row)" -->
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>

            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="120px">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      //spu属性初始化是空对象，在修改spu的时候回向服务器发氢气 返回spu信息 在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //spu的添加 并没有向服务器发请求 数据收集到spu 收集数据的时候的字段要看文档
      spu: {
        category3Id: 0,   //三级分类id
        //描述
        description: "",
        spuName: "",
        //品牌的id
        tmId: '',
        //spu图片的信息
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0
          }
        ],
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
            {
                 baseSaleAttrId: 0,
                 id: 0,
                 isChecked: "",
                 saleAttrName: "",
                 saleAttrValueName: "",
                 spuId: 0
               } 
            ]
          } */
        ],
      },  //存储spu信息属性
      tradeMarkList: [],  //存储品牌信息
      spuImageList: [],  //存储spu图片的数据
      saleAttrList: [],  //销售属性数据
      attrIdAndattrName: '',//手收集未选择的销售属性的id和name
    }
  },
  computed: {
    //还未选择的销售属性
    unSeletedSaleAttr() {
      //整个平台的销售属性在saleAttrList 数组有三项 颜色 尺寸 版本
      //当前spu自己的销售属性 spu.spuSaleAttrList
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName
        })
      })

    }
  },
  methods: {
    //照片墙删除图片的时候触发
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      //对于已有的图片有name和url
      //对于服务器不需要name 和url字段 对于已有的图片的数据在提交给服务器的时候需要处理
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化spu的数据
    async initSpuData(row) {
      //获取初始化信息的数组
      let spuResult = await this.$API.spu.reqSpu(row.id)
      //   console.log(spuResult)
      if (spuResult.code == 200) {
        this.spu = spuResult.data
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      //   console.log(tradeMarkResult)
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id)
      //   console.log(spuImageResult)
      if (spuImageResult.code == 200) {
        let listAttr = spuImageResult.data
        //照片墙显示数组 需要有name 和url 字段  对服务器返回的数组修改
        listAttr.forEach(element => {
          element.name = element.imgName
          element.url = element.imgUrl
        });
        this.spuImageList = listAttr
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log(saleResult)
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //添加spu时初始化数据
    async addSpuData(category3Id) {
      //收集三级分类的id
      this.spu.category3Id = category3Id
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      //   console.log(tradeMarkResult)
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }

      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log(saleResult)
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    //照片上传回调成功的回调
    handleAvatarSuccess(response, file, fileList) {
      //s收集图片信息
      this.spuImageList = fileList
    },
    //添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndattrName.split(":")
      //向spu中的spuSaleAttrList添加一个新的对象
      let newsale = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [

        ]
      }
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newsale)
      this.attrIdAndattrName = ''
    },
    //添加销售属性属性值 tag
    addSaleAttrValue(row) {
      //从button变为input
      this.$set(row, 'inputVisible', true)
      //添加收集到的销售属性值
      this.$set(row, 'inputValue', '')
    },
    //失去焦点 将input的值添加到数组中
    handleInputConfirm(row) {
      //显示button
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() == '') {
        this.$message('属性值不能为空')
        return
      }
      //属性值不能重复  没重复是true   重复是false
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      if (!result) return
      let newSaleAttrValue = {
        baseSaleAttrId, saleAttrValueName: inputValue
      }

      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理照片墙参数   imgName: "", imgUrl: "",
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // console.log('发的参数', this.spu)
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      // console.log(result)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '保存成功' })
        //回到场景0
        this.$emit('changeScene', { scence: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      //清除数据
      Object.assign(this._data, this.$options.data)
    },
    //取消按钮
    cancel() {
      this.$emit('changeScene', { scence: 0, flag: '' })
      Object.assign(this._data, this.$options.data())
    }
  },
  mounted() {
    // console.log(this)
    // console.log(this.$data)
    // console.log(this.$options.data)
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
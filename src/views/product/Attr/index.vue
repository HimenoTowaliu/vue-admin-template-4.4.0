<template>
  <div>
    <el-card style="margin: 30px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格 -->
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" align="center" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot="{ row }">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="index" style="margin: 0 20px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <!-- 修改属性的结构 -->
        <div v-show="!isShowTable">
          <el-form :inline="true" ref="form" label-width="80px" :model='attrInfo'>
            <el-form-item label="属性名">
              <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
            </el-form-item>
            <br>
            <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
            <el-button @click="isShowTable=true">取消</el-button>
            <el-table border style="width: 100%;margin:20px 0" :data="attrInfo.attrValueList">
              <el-table-column type="index" label="序号" width="80px" align="center">
              </el-table-column>
              <el-table-column align="left" prop="prop" label="属性值名称">
                <template slot-scope="{row,$index}">
                  <!-- 这里的结构需要span与input切换 -->
                  <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
                  <span v-else @click="toDeit(row,$index)" style="display:block">{{row.valueName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" prop="prop" label="操作">
                <template slot-scope="{row,$index}">
                  <!-- <el-button type="danger" icon="el-icon-delete" size="mini"></el-button> -->
                  <el-popconfirm @onConfirm="deleteAttrValue($index)" :title="`确定删除${row.valueName}吗？`">
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="addOrUpdateAttr" :disabled='attrInfo.attrValueList.length<1'>保存</el-button>
            <el-button type="primary" @click="isShowTable=true">取消</el-button>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [], //平台属性
      isShowTable: true,  //控制table表格的显示与隐藏
      attrInfo: {     //新增修改属性的时候使用
        attrName: '',   //属性名
        attrValueList: [   //属性值 多个用数组  每个属性值都是对象
          /*  {
             attrId: 0,   //相应属性名的id
             valueName: '',
           }, */

        ],
        categoryId: 0,    //三级分类的eid
        categoryLevel: 3
      },
    };
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
    //获取平台属性的数据
    //用户确定三个id之后 可以发请求获取平台属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      // console.log(result)
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,   //相应属性名的id    可以在已有属性值的基础上新增属性值
        valueName: '',    //相应属性值的名称
        flag: true,    //当前为input模式 不是鉴赏模式
      })
      //新增的input也应该聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    //添加属性  按钮的回调
    addAttr() {
      this.isShowTable = false
      //清除数据
      //手机三级分类的id
      this.attrInfo = {
        attrName: '',   //属性名
        attrValueList: [   //属性值 多个用数组  每个属性值都是对象
        ],
        categoryId: this.category3Id,    //三级分类的eid
        categoryLevel: 3
      }
    },
    //修改属性
    updateAttr(row) {
      // console.log(row)
      this.isShowTable = false
      //将选中的属性赋值给attrInfo   需要深拷贝
      this.attrInfo = JSON.parse(JSON.stringify(row))
      //添加flag标记
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },
    //失去焦点的事件 切换为查看模式
    toLook(row) {
      //如果属性值为空 不能作为新的属性值 让他输入新的属性值
      if (row.valueName.trim() == '') {
        this.$message('请输入正常属性值')
        return
      }
      //新增属性值不能和已有属性值重复
      let isRepat = this.attrInfo.attrValueList.some(item => {
        //row从数组里面判断的时候去除
        if (row !== item) {
          return row.valueName == item.valueName
        }
      })
      if (isRepat) return
      row.flag = false
    },
    //点击span的回调变为编辑模式
    toDeit(row, $index) {
      row.flag = true
      //点击span变为编辑模式 但是 对于浏览器而言 页面重绘与重拍消耗时间不能获取到input
      // console.log(this.$refs[$index])
      //nextTick  当节点渲染完毕后再执行一次
      this.$nextTick(() => {
        // console.log(this.$refs[$index])
        //实现聚焦
        this.$refs[$index].focus()
      })
    },
    //确定删除的回调  在cart里面 点击修改按钮之后  里面的删除按钮
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    //保存按钮进行添加属性或者修改属性
    async addOrUpdateAttr() {
      //如果添加了很多属性值 且属性值值为空 那么不应该提交给服务器
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName != '') {
          //删除flag
          delete item.flag
          return true
        }

      })
      //发请求
      try {
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.$message({ type: 'success', message: '保存成功' })
        //保存成功再次获得平台信息显示
        this.getAttrList()
      } catch (error) {
        // this.$message({type:''})
      }


    }
  },
};
</script>

<style>
</style>


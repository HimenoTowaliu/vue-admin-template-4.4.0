<template>
  <div>
    <!-- 行内表单 一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">

      <el-form-item label="一级分类">
        <el-select :disabled="show" placeholder="请选择" v-model="cForm.category1Id" @change="handler1">
          <el-option v-for="(c1,index) in list1" :key="index" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="show" placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="index"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="show" placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="index"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      //收集1 2 3 的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }
    }
  },
  props: ['show'],
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqGategory1()
      // console.log(result)
      if (result.code == 200) {
        this.list1 = result.data
      }
    },
    //一级分类的select的回调 当一级分类的option发生变化的时候获取相应数据
    async handler1(value) {
      const { category1Id } = this.cForm
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.list2 = []
      this.list3 = []
      //通过一级分类的id 获取二级分类
      this.$emit('getCategoryId', { category1Id: value })
      let result = await this.$API.attr.reqGategory2(category1Id)
      // console.log(result)
      if (result.code == 200) {
        this.list2 = result.data
      }
    },
    //二级分类的回调value变化的时候获取相应的数据
    async handler2(value) {
      // const {category2Id}=this.cForm
      this.list3 = []
      this.cForm.category3Id = ''
      this.$emit('getCategoryId', { category2Id: value })
      //通过一级分类的id 获取二级分类
      let result = await this.$API.attr.reqGategory3(value)
      // console.log(result)
      if (result.code == 200) {
        this.list3 = result.data
      }
    },
    //三级分类的回调
    handler3(value) {
      // const {category2Id}=this.cForm
      //传递三个id给父组件
      this.$emit('getCategoryId', { category3Id: value })

    },
  },
  mounted() {
    this.getCategory1List()
  }
};
</script>

<style>
</style>
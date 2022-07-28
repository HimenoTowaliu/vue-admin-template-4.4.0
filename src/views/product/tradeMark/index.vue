<template>
  <div>
    <!-- 按钮 -->
    <el-button
      @click="showdialog"
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <!-- laber 显示的标题
          border  是给表格添加边框
          column属性
          laberl标题
          width 对应列的宽度
          align 标题的对齐方式
           :data="data"
           注意 elementui 的table的数据是以列的形式进行展示数据
           prop  属性  ：对应列内容的字段名
           -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        prop="prop"
        type="index"
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            alt="图片未找到"
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="min"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="min" @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 当前第几页 数据条数总数  每一页展示的条数  连续页码数 -->
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <!-- pagesize 每一页展示多少数据 pagesizes代表设置每一页展示多少条数据 进行切换
      layout 可以实现分页器的布局 -->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="margin-top: 20px; text-align: center"
      :current-page="1"
      :pager-count="9"
      :page-sizes="[3, 5, 10]"
      :page-size="3"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框  visible.sync控制对话框显示与隐藏用的 -->
    <!-- 
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
      并将 Form-Item 的 prop 属性设置为需校验的字段名即可
     -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- model这个属性 作用是把表单的数据收集到哪个对象身上  将来进行表单验证，也需要这个model -->
      <el-form  ref="refForm" style="width: 80%" :model='tmForm' :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 手机数据不能使用v-model 因为不是表单元素
            action属性 设置图片上传的地址
             :on-success v 上传成功会执行一次
              :before-upload上传之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
           
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1, //分页器的第几页
      limit: 3, //当前页面展示数据的条数
      total: 0, //总共数据的条数
      list: [], //列表展示的数据
      dialogFormVisible: false, //对话框显示与隐藏控制
    
      tmForm:{   //收集品牌的信息
        tmName:'',
        logoUrl:'',
        //表单验证
       
      },
       rules:{
        //自定义校验是重点要看 这个是elementui提供的校验
          tmName: [
            //required  必须要校验的字段  和*有关  message 提示信息   trigger:  blur失去焦点  change文本发生变化
            { required: true, message: '请输入活动名称', trigger: 'change' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          ],
          logoUrl: [
            { required: true, message: '请选择图片' }
          ],
        }
    };
  },
  methods: {
    //获取品牌列表的数据
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      // console.log(result)
      if (result.code == 200) {
        //数据总条数 与当前页面的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleCurrentChange(pager) {
      // console.log(pager)
      this.page = pager;
      this.getPageList();
      
    },
    //分页器某一页需要展示数据的条数发生变化的时候触发
    handleSizeChange(limiter) {
      // console.log(limiter)
      this.limit = limiter;
      this.getPageList();
    },
    showdialog() {
      //清除数据
      this.tmForm={tmName:'',logoUrl:''}
      //展示对话框
      this.dialogFormVisible = true;
    },
    //修改某一个品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //将服务器返回的品牌的信息 直接赋值给了tmForm进行展示
      this.tmForm={...row}
    },
    //上传图片的回调
      handleAvatarSuccess(res, file) {
        //res 是上唇成功之后返回给前端的数据 
        //file 也是上传成功之后服务器返回给前端的数据
        // this.imageUrl = URL.createObjectURL(file.raw);
        //收集品牌图片的数据 因为将来要带给服务器
        this.tmForm.logoUrl=res.data
        
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //上传新的品牌修改品牌的确定按钮  
     addOrUpdateTradeMark(){
        this.$refs.refForm.validate(async (success) => {
          if (success) {
           this.dialogFormVisible = false;
           //发请求
          let result= await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if(result=200){
            // this.getPageList()
            this.$message({
              type:'success',
              message:this.tmForm.id? '修改品牌成功':'添加品牌成功'
            })
            //如果添加品牌 应该停留在第一页 修改品牌停留在当前页
            this.getPageList()
            // this.getPageList(this.tmForm>id? this.page:1)
          }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
     },
     //删除品牌的信息
     deleteTradeMark(row){
      // console.log(row)
      this.$confirm(`确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //确定按钮
          let result=await this.$API.trademark.reqDeleteTrademark(row.id)
          if(result.code==200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //再次获取品牌数据
           if(this.list.length==1) {console.log('当前list',this.list) 
          this.page=this.page-1}
          this.getPageList()
          }
          //取消按钮
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     }
  },
  mounted() {
    //组件挂载完毕 发请求
    // console.log(this.$API)
    this.getPageList();
  },
}
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


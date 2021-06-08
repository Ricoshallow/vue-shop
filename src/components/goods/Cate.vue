<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑卡片 -->
        <el-card>
          <!-- 添加分类栏 -->
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          <!-- 商品分类列表展示 -->
          <tree-table :data="goodsCateList" :columns="columns" 
          :selection-type="false" :expand-type="false" show-index index-text="#" border
          :show-row-hover="false">
            <!-- 是否有效列插槽 -->
            <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" style="color: lightgreen" v-if="!scope.row.cat_deleted"></i>
              <i class="el-icon-error" style="color: red" v-if="scope.row.cat_deleted"></i>
            </template>
            <!-- 排序列插槽 -->
            <template slot="order" slot-scope="scope">             
              <el-tag size="mini"  type="success" round v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag size="mini"  type="warning" round v-else-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag size="mini"  type="danger" round v-else-if="scope.row.cat_level===2">三级</el-tag>
            </template>
            <!-- 操作列插槽 -->
            <template slot="setting" slot-scope="">
              <el-button type="primary" icon="el-icon-edit" size="mini" >编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
            </template>
          </tree-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 8, 12]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
          <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close = "addCateDialogClose"
            >
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="cateFormRule" ref="cateFormRef" label-width="100px" >
              <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
              </el-form-item>
              <el-form-item label="父级分类" >
                <el-cascader
                  v-model="selectedKeys"
                  :options="goodsParentCateList"
                  expand-trigger= 'hover'
                  :props="{ 
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                   }"
                   clearable
                   @change="selectCateChanged"
                   change-on-select
                  ></el-cascader>
              </el-form-item>
              
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addCateDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
          </el-dialog>
    </div>
</template>

<script>
export default {
  data(){
    return {
      //商品分类列表
      goodsCateList: [],
      // 请求默认传递到参数
      queryInfo: {
        type: 3,
        //当前页数
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 5
      },
      //父级商品分类列表
      goodsParentCateList: [],
      // 请求前两级分类列表传递参数
      queryParent: {
        type: 2
      },
      //数据总条数
      total: 0,
      // table-tree列定义对象
      columns:[{
        label: '分类名称',
        prop: 'cat_name',
        width: '200px'
      },{
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },{
        label: '排序',
        type: 'template',
        template: 'order'
      },{
        label: '操作',
        type: 'template',
        template: 'setting',
        width: '200px'
      }],
      //控制分类对话框显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name:'',
        //  父级分类 ID
        cat_pid: 0,
        // 分类层级默认一级分类
        cat_level: 0
      },
      //选中父级分类的id数据
      selectedKeys: [],
      //分类验证规则
      cateFormRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' } 
        ],
        
      },
      
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 获取分类列表
    async getCateList(){
      const { data: res } = await this.$http.get('categories',{ params: this.queryInfo})
      if (res.meta.status !== 200){
        return this.$message.error('获取商品分类列表失败！')
      }
      this.goodsCateList = res.data.result
      this.total = res.data.total
      // console.log(this.goodsCateList);
    },
    // 获取前两级分类列表
    async getParentCateList(){
      const { data: res } = await this.$http.get('categories',{ params: this.queryParent})
      if (res.meta.status !== 200){
        return this.$message.error('获取父级商品分类列表失败！')
      }
      // console.log(res);
      this.goodsParentCateList = res.data
      // console.log(this.goodsParentCateList);
    },
     // 监听pagesize改变的事件
    handleSizeChange(newpagesize){
      // console.log(newpagesize)
      this.queryInfo.pagesize = newpagesize
      this.getCateList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newpagenum){
      // console.log(newpagenum)
      this.queryInfo.pagenum = newpagenum
      this.getCateList()
    },
    //点击按钮弹出添加分类对话框
    showAddCateDialog(){
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //监听添加分类对话框的关闭事件
    addCateDialogClose(){
      this.$refs.cateFormRef.resetFields()
      //还需要清空父级分类级联选择框
      this.selectedKeys = []
      //还需要将addCateForm的数据重置
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    },
    //监听父级分类选择发生变化的事件
    selectCateChanged(){
      // console.log(this.selectedKeys);
      // 级联选择器中的数据发生变化是要改变addCateForm数据中对应的pid和level
      if(this.selectedKeys.length>0){
        this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level=this.selectedKeys.length
      }else{
        this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0
      }
    },
    // 点击确认按钮提交表单，添加分类到数据库
    addCate(){
      // 先进行表单预验证
      this.$refs.cateFormRef.validate(async (valid)=>{
        // console.log(valid);
        if (!valid){
          return this.$message.error('添加分类失败')
        }
        const {data: res} = await this.$http.post('categories',this.addCateForm)
        if (res.meta.status !== 201){
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功')
        //关闭对话框，刷新用户列表
        this.addCateDialogVisible = false
        this.getCateList()
      })
      
    }

  }
}
</script>
<style lang="less" scoped>
  .zk-table{
    margin-top: 20px;
  }
</style>
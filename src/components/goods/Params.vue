<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑卡片 -->
        <el-card>
          <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
          <!-- 级联选择器 -->
          <el-form >
            <el-form-item label="选择商品分类：" class="selectCate">
                <el-cascader
                  v-model="selectedKeys"
                  :options="goodsCateList"
                  expand-trigger= 'hover'
                  :props="{ 
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                   }"
                   clearable
                   @change="selectCateChanged"
                  ></el-cascader>
            </el-form-item>
          </el-form>    
          <!-- 表格 -->
          <!-- tabs标签页 -->
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!-- 添加动态参数面板 -->
            <el-tab-pane label="动态参数" name="many">
              <el-button type="primary" :disabled="isdisabled"  @click="showAddParamDialog">添加参数</el-button>
              <!-- 动态参数表格展示 -->
                <el-table :data = "manyTabData" stripe style="width: 100%">
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag
                        class="tag"
                        v-for="(tag,index) in scope.row.attr_vals"
                        :key="index"
                        closable
                        @close="handleCloseTag(index,scope.row)">
                        {{tag}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)" type="primary">+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index"></el-table-column>
                  <!-- 数据列 -->
                  <el-table-column
                    prop="attr_name"
                    label="参数名称">
                  </el-table-column>
                  <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditParamDialog(scope.row)" >编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeParam(scope.row.attr_id)" >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
            </el-tab-pane>
            
            <!-- 添加静态属性面板 -->
            <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" :disabled="isdisabled" @click="showAddParamDialog">添加属性</el-button>
              <!-- 静参数表格展示 -->
              <el-table :data = "onlyTabData" stripe style="width: 100%">
                <!-- 展开行 -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag
                        class="tag"
                        v-for="(tag,index) in scope.row.attr_vals"
                        :key="index"
                        closable
                        @close="handleCloseTag(index,scope.row)">
                        {{tag}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)" type="primary">+ New Tag</el-button>
                    </template>
                  </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <!-- 数据列 -->
                <el-table-column
                    prop="attr_name"
                    label="参数名称">
                </el-table-column>  
                <el-table-column label="操作" width="180px">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditParamDialog(scope.row)" >编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParam(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <!-- 添加参数/属性对话框 -->
        <el-dialog
          :title="'添加'+ titleText"
          :visible.sync="addParamDialogVisible"
          width="50%"
          @close = "addParamDialogClose"
          >
          <el-form :model="addParamForm" :rules="addParamRule" ref="addParamRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="addParamForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addParamDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParam">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改参数/属性对话框 -->
        <el-dialog
          :title="'修改'+ titleText"
          :visible.sync="editParamDialogVisible"
          width="50%"
          @close = "editParamDialogClose"
          >
          <el-form :model="editParamForm" :rules="addParamRule" ref="editParamRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="editParamForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editParamDialogClose = false">取 消</el-button>
            <el-button type="primary" @click="editParam">确 定</el-button>
          </span>
        </el-dialog>
        
        
    </div>
</template>

<script>
export default {
  data(){
    return {
      goodsCateList:[],
      selectedKeys: [],
      activeName:'many',
      isdisabled: true,
      manyTabData:[],
      onlyTabData:[],
      addParamDialogVisible:false,
      editParamDialogVisible:false,
      attrId:'',
      //表单验证规则
      addParamRule: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' } 
        ],
      },
      // 添加表单输入双向绑定值
      addParamForm:{
        attr_name: '',
        attr_sel: '',
      },
      // 修改表单输入双向绑定值
      editParamForm:{
        attr_name: '',
        attr_sel: '',
      }
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 获取分类列表
    async getCateList(){
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200){
        return this.$message.error('获取商品分类列表失败！')
      }
      // console.log(res);
      this.goodsCateList = res.data
      // console.log(this.goodsCateList);
    },
    //级联选择框值变化时触发
    selectCateChanged(){
      //保证只能选中三级分类
      if(this.selectedKeys.length!==3){
        this.selectedKeys=[]
        this.manyTabData=[]
        this.onlyTabData=[]
        this.isdisabled = true
        return 
      }
      this.isdisabled = false
      this.getParamsList()
    },
    // 标签页切换
    handleTabClick(){
      if(this.selectedKeys.length===3){
        this.getParamsList()
        
      } 
    },
    //获取参数列表
    async getParamsList(){
      const { data: res } = await this.$http.get('categories/'+this.selectedKeys[2]+'/attributes',{ params: { sel: this.activeName }})
      // console.log(res);
      if (res.meta.status !== 200){
        return this.$message.error('获取参数分类列表失败！')
      }
      //将返回的数据中的attr_vals参数变成一个数组供后续的tag使用
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals? item.attr_vals.split(' ') : []
        // 给每一个参数添加其对应的inputVisible和inputValue
        item.inputVisible = false
        item.inputValue = ''
      })

      //将动态或静态参数数据挂载到相应的列表中
      if(this.activeName==='many'){
        this.manyTabData = res.data
        console.log(this.manyTabData);
      }else if (this.activeName==='only'){
        this.onlyTabData = res.data
      }
    },
    //点击按钮弹出添加动态参数/静态属性对话框
    showAddParamDialog(){
      this.addParamDialogVisible=true
      // console.log(this.activeName);
      this.addParamForm.attr_sel = this.activeName
    },
    //点击按钮弹出编辑动态参数/静态属性对话框
    showEditParamDialog(cate){
      this.editParamDialogVisible=true
      // console.log(this.activeName);
      this.editParamForm.attr_sel = this.activeName
      this.attrId = cate.attr_id
      // console.log(cate);
      this.editParamForm.attr_name = cate.attr_name
    },
    //监听添加动态参数/静态属性对话框的关闭事件
    addParamDialogClose(){
      this.$refs.addParamRef.resetFields()
    },
    //监听修改动态参数/静态属性对话框的关闭事件
    editParamDialogClose(){
      this.$refs.editParamRef.resetFields()
    },
    // 点击确定按钮提交添加参数表单数据
    addParam(){
      // 先进行表单预验证
      this.$refs.addParamRef.validate(async (valid)=>{
        // console.log(valid);
        if (!valid){
          return this.$message.error('添加参数失败')
        }
        const {data: res} = await this.$http.post('categories/'+this.selectedKeys[2]+'/attributes',this.addParamForm)
        // console.log(res);
        // console.log(this.addParamForm);
        // console.log(this.activeName);
        if (res.meta.status !== 201){
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功')
        //关闭对话框，刷新参数列表
        this.addParamDialogVisible = false
        this.getParamsList()
      })
    },
    // 点击确定按钮提交修改参数表单数据
    editParam(){
      // 先进行表单预验证
      this.$refs.editParamRef.validate(async (valid)=>{
        // console.log(valid);
        if (!valid){
          return this.$message.error('修改参数失败')
        }
        const {data: res} = await this.$http.put('categories/'+this.selectedKeys[2]+'/attributes/'+ this.attrId,this.editParamForm)
        if (res.meta.status !== 200){
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功')
        //关闭对话框，刷新参数列表
        this.editParamDialogVisible = false
        this.getParamsList()
      })
    },
    //点击删除按钮删除对象参数
    async removeParam(attr_id){
      // 询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认 返回字符串confirm
      //如果用户取消 返回字符串cancel
      if (confirmResult === 'cancel'){
        return this.$message.info('你已取消操作')
      }
      const { data: res } = await this.$http.delete('categories/'+this.selectedKeys[2]+'/attributes/'+ attr_id)
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error('参数删除失败')
      this.$message.success('参数删除成功')
      this.getParamsList()
    },
    // tag文本框失去焦点或enter键按下触发
    async handleInputConfirm(curRow){
      if(curRow.inputValue.trim().length===0){
        curRow.inputValue=''
        curRow.inputVisible = false
        return 
      }
      //输入不为空则将新tag添加到attr_vals中并更新数据库
      curRow.attr_vals.push(curRow.inputValue)
      curRow.inputValue = ''
      curRow.inputVisible=false
      const {data: res} = await this.$http.put('categories/'+this.selectedKeys[2]+'/attributes/'+ curRow.attr_id,
      {
        attr_name: curRow.attr_name,
        attr_sel: curRow.attr_sel,
        attr_vals: curRow.attr_vals.join(' ')
      })
      if (res.meta.status !== 200){
        return this.$message.error('添加标签失败！')
      }
      this.$message.success('添加标签成功')

    },
    //点击按钮显示文本输入框
    showInput(curRow){
      curRow.inputVisible=true 
      // 让文本框自动获得焦点
      // $nextTick当页面上的元素被重新渲染后触发回调函数
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 监听关闭标签触发事件
    async handleCloseTag(index,curRow){
      // 询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认 返回字符串confirm
      //如果用户取消 返回字符串cancel
      if (confirmResult === 'cancel'){
        return this.$message.info('你已取消操作')
      }
      curRow.attr_vals.splice(index,1)
      //更新数据库
      const {data: res} = await this.$http.put('categories/'+this.selectedKeys[2]+'/attributes/'+ curRow.attr_id,
      {
        attr_name: curRow.attr_name,
        attr_sel: curRow.attr_sel,
        attr_vals: curRow.attr_vals.join(' ')
      })
      if (res.meta.status !== 200){
        return this.$message.error('删除标签失败！')
      }
      this.$message.success('删除标签成功')

    }
  },


  computed: {
    //动态计算文本标题
    titleText(){
      if(this.activeName==='many'){
        return "动态参数"
      }else {
        return "静态属性"
      }
    },
    
    
  }

}
</script>

<style lang="less" scoped>
  .selectCate{
    margin-top: 20px;
  }
  .tag {
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .input-new-tag {
    width: 100px;
  }
</style>
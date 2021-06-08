<template>
    <div>
      <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑卡片 -->
        <el-card class="box-card">
          <!-- 搜索栏 -->
          <div style="margin-top: 15px;" class="search">
            <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getUserList">
              <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </div>
          <!-- 数据展示表格 -->
          <el-table
            :data = "userList"
            stripe
            style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="username"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="180">
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="联系方式">
            </el-table-column>
            <el-table-column
              prop="role_name"
              label="权限">
            </el-table-column>
            <el-table-column
              label="状态">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  active-color="#67C23A"
                  @change="userStateChanged(scope.row)"
                  >
                </el-switch>    
              </template>
            </el-table-column>
            <el-table-column
              label="操作" width="180px">
              <!-- 作用域插槽 -->
              <!-- 不访问该行的值是不需要指定slot-scope的值 -->
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                  <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                  <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeUserById(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="配置" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <!-- 添加用户对话框 -->
          <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close = "addDialogClose"
            >
            <!-- 内容主体区域 -->
            <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 修改用户对话框 -->
          <el-dialog
            title="修改用户"
            :visible.sync = "editDialogVisible"
            width="50%"
            @close = "editDialogClose"
            >
            <!-- 内容主体区域 -->
            <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="100px">
              <el-form-item label="用户名" prop="username" >
                <el-input v-model="editForm.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 分配角色对话框 -->
          <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="editRoleDialogClosed"
            >
            <p>当前用户：{{userInfo.username}}</p>
            <p>当前角色：{{userInfo.role_name}}</p>
            <p>分配角色：
              <el-select v-model="checkedRole" placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setRoleDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
          </el-dialog>
        </el-card>  
    </div>
</template>

<script>
export default {
  data(){
    // 自定义邮箱校验规则
    var checkEmail = (rule, value, callback)=>{
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      //返回一个错误提示
      callback(new Error('请输入合法的邮箱'))
    }
    // 自定义手机号校验规则
    var checkMobile = (rule, value, callback)=>{
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      //返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        // 查询参数
        query:'',  
        //当前页数
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 2
      },
      //用户列表
      userList: [],
      total: 0,
      //控制添加对话框的显示隐藏
      addDialogVisible: false,
      //控制修改对话框的显示隐藏
      editDialogVisible: false,
      //添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //修改用户表单数据
      editForm: {},
      // 添加用户的表单验证
      addFormRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 8, message: '用户名长度在3到8个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6到15 个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail, trigger: 'blur'}
          
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator: checkMobile, trigger: 'blur'}
        ],
      },
      // 修改用户的表单验证，只需要邮箱和手机
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail, trigger: 'blur'}
          
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator: checkMobile, trigger: 'blur'}
        ],
      },
      //控制分配角色对话框的显示隐藏
      setRoleDialogVisible: false,
      //需要被分配角色的信息
      userInfo:{},
      //角色列表
      roleList: [],
      //被选中的角色
      checkedRole: ''
    }
  },
  created(){
    this.getUserList()
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users',{ params: this.queryInfo })
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newpagesize){
      // console.log(newpagesize)
      this.queryInfo.pagesize = newpagesize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newpagenum){
      // console.log(newpagenum)
      this.queryInfo.pagenum = newpagenum
      this.getUserList()
    },
    //监听用户状态改变
    async userStateChanged(userinfo){
      //调用put请求修改用户在数据库中的状态值
      console.log(userinfo);
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res);
      if (res.meta.status !==200) {
        //如果请求失败，不对用户状态进行更改
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      return this.$message.success('用户状态更新成功')
    },
    //监听用户添加对话框的关闭事件
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    //监听用户修改对话框的关闭事件
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定按钮添加新用户
    addUser(){
      this.$refs.addFormRef.validate(async (valid)=>{
        // console.log(valid);
        if (!valid){
          return this.$message.error('添加用户失败')
        }
        // 预验证通过则添加新用户到数据库
        const { data: res } = await this.$http.post('users',this.addForm)
        // console.log(res);
        if (res.meta.status !== 201){
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        //关闭对话框，刷新用户列表
        this.addDialogVisible = false
        this.getUserList()

      })
    },
    // 点击确定按钮修改用户
    editUser(){
      // 预校验
      this.$refs.editFormRef.validate(async (valid)=>{
        // console.log(valid);
        if (!valid){
          return this.$message.error('修改用户信息失败')
        }
        // 预验证通过则更新用户到数据库
        const { data: res } = await this.$http.put('users/'+ this.editForm.id,{ email: this.editForm.email, mobile: this.editForm.mobile })
        console.log(res);
        if (res.meta.status !== 200){
          return this.$message.error('修改用户信息失败')
        }
        
        //关闭对话框，刷新用户列表
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功')
      })
    },
    //点击修改按钮弹出修改对话框
    async showEditDialog(id){
      //发起查询id请求
      const { data: res } = await this.$http.get('users/'+ id)
      // console.log(res);
      if (res.meta.status!==200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //点击删除按钮删除对应用户
    async removeUserById(id){
      // 询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认 返回字符串confirm
      //如果用户取消 返回字符串cancel
      if (confirmResult === 'cancel'){
        return this.$message.info('你已取消操作')
      }
      const { data: res } = await this.$http.delete('users/'+ id)
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('用户删除失败')
      this.$message.success('用户删除成功')
      this.getUserList()
    },
    //点击配置按钮弹出分配角色对话框
    async showRoleDialog(userInfo){
      this.userInfo = userInfo
      //获取角色列表
      const {data: res} = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.roleList = res.data
      //显示对话框
      this.setRoleDialogVisible = true
    },
    // 点击确定按钮为用户分配角色
    async editRole(){
      if (!this.checkedRole){
        return this.$message.error('请选择要分配的角色！')
      }
      const {data: res} = await this.$http.put('users/'+this.userInfo.id+'/role',{rid: this.checkedRole} )
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.getUserList()
      //关闭对话框
      this.setRoleDialogVisible = false
      this.$message.success('分配角色成功！')
    },
     //监听角色分配对话框的关闭事件 
    editRoleDialogClosed(){
      this.userInfo={}
      this.checkedRole=''
    }
      
  }
}
</script>

<style lang="less" scoped>
  .box-card {
    
    .search {
      width: 40%;
      display: flex;
      .input-with-select {
        margin-right: 20px;
      }
    }

    .el-table {
      i {
        margin-right: 20px;
      }
    }
  }
</style>
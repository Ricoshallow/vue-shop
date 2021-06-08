<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑卡片 -->
        <el-card>
            <!-- 添加用户栏 -->
            <el-button type="primary">添加角色</el-button>
            <!-- 角色列表展示 -->
            <el-table
              :data = "roleList"
              stripe
              style="width: 100%">
              <!-- 权限展开行 -->
              <el-table-column type="expand" width="80">
                <template slot-scope="scope">
                  <!-- 渲染一级权限 -->
                  <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['vcenter','bdbottom',index1===0? 'bdtop': '']" >
                    <el-col :span="5">
                      <el-tag type="success" closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col> 
                    <!-- 渲染二级权限 -->
                    <el-col :span="19">
                      <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="['vcenter',index2===0? '': 'bdtop']" >
                        <el-col :span="6">
                          <el-tag type="warning" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染三级权限 -->
                        <el-col :span="18">
                          <el-tag type="danger" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                            {{item3.authName}}
                          </el-tag>                         
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <!-- <pre>{{scope.row}}</pre> -->
                </template>
              </el-table-column>
              <!-- index行 -->
              <el-table-column type="index" width="80" label="#"></el-table-column>
              <!-- 角色名称行 -->
              <el-table-column
              prop="roleName"
              label="角色名称"
              >
              </el-table-column>
              <!-- 角色描述行 -->
              <el-table-column
              prop="roleDesc"
              label="角色描述"
              >
              </el-table-column>
              <!-- 角色操作行 -->
              <el-table-column
              label="操作" width="300px">
              <!-- 作用域插槽 -->
              <!-- 不访问该行的值是不需要指定slot-scope的值 -->
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
                  </el-tooltip>
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightSettingDialog(scope.row)">权限分配</el-button>                  
                </template>
              </el-table-column>
            </el-table>
        </el-card>
        <!-- 配置权限对话框 -->
        <el-dialog
          title="用户权限配置"
          :visible.sync="rightSettingDialogVisible"
          width="50%"
          >
          <!-- 权限数据的树形展示 -->
          <el-tree :data="rightList" :props="rightListProps" show-checkbox default-expand-all 
           node-key="id" :default-checked-keys="defaultKeys" ref="treeRef"></el-tree>
          
          <span slot="footer" class="dialog-footer">
            <el-button @click="rightSettingDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data(){
    return {
      //角色列表
      roleList: [],
      //权限列表
      rightList: [],
      // 树形控件属性绑定对象
      rightListProps : {
        label: 'authName',
        children: 'children'
      },
      //默认选中节点的id值数组
      defaultKeys: [],
      rightSettingDialogVisible: false,
      //即将分配权限的角色ID
      roleId: ''
    }
  },
  created(){
    this.getRoleList()
  },
  methods: {
    //渲染角色列表
    async getRoleList(){
      const { data:res } = await this.$http.get('roles')
      if (res.meta.status!==200){
        return this.$message.error('角色列表获取失败！')
      }
      this.roleList = res.data
      // console.log(this.roleList);
    },
    //根据id删除用户权限
    async removeRightById(role,rightId){
      //弹框提示是否删除权限
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认 返回字符串confirm
      //如果用户取消 返回字符串cancel
      if (confirmResult === 'cancel'){
        return this.$message.info('你已取消该操作')
      }
      const { data: res } = await this.$http.delete('roles/'+ role.id + '/rights/'+ rightId)
      if (res.meta.status !==200){
        return this.$message.error('取消该权限失败！')
      }
      this.$message.success('取消该权限成功！')
      // this.getRoleList()
      // 为当前角色重新赋值一下权限信息，避免全局渲染角色列表
      role.children = res.data
    },
    // 展示权限分配对话框
    async showRightSettingDialog(role){
      this.roleId = role.id
      // 获取权限列表的数据
      const { data:res } = await this.$http.get('/rights/tree')
      if (res.meta.status!==200){
        return this.$message.error('权限列表获取失败！')
      }
      this.rightList = res.data
      // console.log(this.rightList);

      //获取该用户拥有的所有三级权限，渲染到页面中,注意先清空defaultKeys
      this.defaultKeys = []
      this.getLeafKeys(role,this.defaultKeys)
      console.log(this.defaultKeys);
      this.rightSettingDialogVisible = true
    },
    //获取所有三级权限保存在数组中
    getLeafKeys(node,arr){
      if (!node.children){
        return arr.push(node.id)
      }else{
        node.children.forEach(item => 
        this.getLeafKeys(item,arr));
      }
    },
    //确定配置权限
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys);
      
      const idStr = keys.join(',')
      //发送Ajax请求
      const {data: res} = await this.$http.post('roles/'+ this.roleId +'/rights',{rids:idStr})
      console.log(res);
      if (res.meta.status!==200){
        return this.$message.error('角色权限配置失败！')
      }
      this.getRoleList()
      this.$message.success('角色权限配置成功！')
      this.rightSettingDialogVisible = false
    }
    
  }
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
 
</style>
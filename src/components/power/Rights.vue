<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 数据展示表格 -->
            <el-table
            :data = "rightsList"
            stripe
            border
            style="width: 100%">
              <el-table-column type="index" label="#" width="80"></el-table-column>
              <el-table-column
                prop="authName"
                label="权限名称"
                >
              </el-table-column>
              <el-table-column
                prop="path"
                label="路径"
               >
              </el-table-column>
              <el-table-column
                
                label="权限等级"
                >
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                  <el-button :type="rightsLevel[scope.row.level][1]" plain>{{rightsLevel[scope.row.level][0]}}</el-button>  
                </template>
              </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  data(){
    return {
      //权限列表
      rightsList: [],
      rightsLevel: {
        '0': ['一级','success'],
        '1': ['二级','warning'],
        '2': ['三级','danger']
      } 
    }
  },

  created(){
    this.getRightsList()
  },
  methods: {
    async getRightsList(){
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res);
      if (res.meta.status !==200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rightsList = res.data
    },
    
  }
}
</script>

<style lang="less" scoped>

</style>
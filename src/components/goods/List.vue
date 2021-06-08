<template>
    <div>
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑卡片 -->
      <el-card class="box-card">
        <!-- 搜索栏 -->
        <div style="margin-top: 15px;" class="search">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getGoodsList">
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </div>
        <!-- 数据展示表格 -->
        <el-table
          :data = "goodsList"
          stripe
          border
          style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
            width="780">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格">
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量">
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="180">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
            
          </el-table-column>
          <el-table-column
            label="操作" width="120px">
            <!-- 作用域插槽 -->
            <!-- 不访问该行的值是不需要指定slot-scope的值 -->
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditGoodsDialog(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeGoodsById(scope.row.goods_id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 55, 100]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  data(){
    return {
      
      //获取商品列表的参数对象
      queryInfo: {
        // 查询参数
        query:'',  
        //当前页数
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 10
      },
      total: 0,
      
      goodsList: [],

    }
  },
  created(){
    this.getGoodsList()
  },
  methods:  {
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
      console.log(res);
      if (res.meta.status!==200){
        return this.$message.error('获取商品列表失败！')
      }
      this.goodsList = res.data.goods
      
      this.total = res.data.total
      console.log(this.goodsList);
    },
    //点击添加跳转到添加商品路由
    goAddPage(){
      this.$router.push('/goods/add')
    },
    async removeGoodsById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果用户确认 返回字符串confirm
      //如果用户取消 返回字符串cancel
      if (confirmResult === 'cancel'){
        return this.$message.info('你已取消操作')
      }
      const { data: res } = await this.$http.delete('goods/'+ id)
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('商品删除失败')
      this.$message.success('商品删除成功')
      this.getGoodsList()
    },
    // 监听pagesize改变的事件
    handleSizeChange(newpagesize){
      this.queryInfo.pagesize = newpagesize
      this.getGoodsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newpagenum){
      this.queryInfo.pagenum = newpagenum
      this.getGoodsList()
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
    }
</style>
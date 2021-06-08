<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑卡片 -->
    <el-card class="box-card">
      <!-- 搜索栏 -->
      <div style="margin-top: 15px;" class="search">
        <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getOrderList">
          <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- 数据展示表格 -->
      <el-table
        :data="orderList"
        style="width: 100%"
        border
        stripe>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="380"
          >
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          >
        </el-table-column>
        <el-table-column
          label="是否付款"
          width="100"
          >
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.pay_status==='0'" plain type="warning">未付款</el-button>
            <el-button size="mini" v-else plain type="success">已付款</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货">
        </el-table-column>
        <el-table-column
          label="下单时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度查询" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-truck" size="mini" @click="showProgressDialog(scope.row)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[8, 15, 25, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editLocationDialogVisible"
      width="50%"
      @close="addressDialogClosed"
      >
      <!-- 表单区域 -->
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editLocationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editLocationDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度查询对话框 -->
    <el-dialog
      title="物流进度查询"
      :visible.sync="progressDialogVisible"
      width="50%"
      @close="progressDialogClosed"
      >
      <el-timeline >
        <el-timeline-item
          v-for="(progress, index) in progressInfo"
          :key="index"
          :timestamp="progress.time">
          {{progress.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data(){
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:8,

      },
      orderList:[],
      total:0,
      editLocationDialogVisible:false,
      progressDialogVisible:false,
      addressForm:{
        address1:'',
        address2:'',
      },
      
      addressFormRules:{
        address1: [
          { required: true, message: '请选择地址', trigger: 'blur' },  
        ],
        address2: [
          { required: true, message: '请输入地址', trigger: 'blur' },  
        ],
      },
      cityData:cityData,
      //物流信息，由于后台无法拿到，这里将其写入data中
      progressInfo:[
        {
          time: '2019-03-19 13:07:40',
          ftime: '2019-03-19 13:07:40',
          context: '快件已签收 签收人: 家人 感谢使用圆通速递，期待再次为您服务',
          location: null
        },
        {
          time: '2019-03-19 07:49:12',
          ftime: '2019-03-19 07:49:12',
          context: '北京市顺义区顺义机场公司派件人: 侯国宝（155****5526） 正在派件',
          location: null
        },
        {
          time: '2019-03-19 06:38:38',
          ftime: '2019-03-19 06:38:38',
          context: '快件已到达 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 21:45:46',
          ftime: '2019-03-18 21:45:46',
          context: '快件已发往 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 19:32:10',
          ftime: '2019-03-18 19:32:10',
          context: '快件已到达 北京转运中心',
          location: null
        },
        {
          time: '2019-03-18 00:21:50',
          ftime: '2019-03-18 00:21:50',
          context: '快件已发往 北京转运中心',
          location: null
        },
        {
          time: '2019-03-17 21:25:35',
          ftime: '2019-03-17 21:25:35',
          context: '快件已到达 淮安转运中心',
          location: null
        },
        {
          time: '2019-03-17 19:16:06',
          ftime: '2019-03-17 19:16:06',
          context: '快件已发往 江苏省宿迁市沭阳县公司',
          location: null
        },
        {
          time: '2019-03-17 19:04:21',
          ftime: '2019-03-17 19:04:21',
          context: '江苏省宿迁市沭阳县公司取件人: 李红雨（15751571351） 已收件',
          location: null
        }
      ]

    }
  },
  created(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      const {data:res} = await this.$http.get('/orders',{params:this.queryInfo})
      // console.log(res);
      if(res.meta.status !==200){
        return this.$message.error('订单列表获取失败！')
      }     
      this.total = res.data.total 
      this.orderList = res.data.goods
      console.log(this.orderList);
    },
    showEditDialog(){
      this.editLocationDialogVisible = true
    },
    handleSizeChange(newpagesize){
      this.queryInfo.pagesize = newpagesize
      this.getOrderList()
    },
    handleCurrentChange(newpagenum){
      this.queryInfo.pagenum = newpagenum
      this.getOrderList()
    },
    addressDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressDialog(){
      // const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
      // console.log(res);
      // if(res.meta.status!==200){
      //   return this.$message.error('获取物流进度失败！')
      // }
      // this.progressInfo = res.data
      // console.log(this.progressInfo);
      this.progressDialogVisible = true
    },
    progressDialogClosed(){

    },


  }
}
</script>

<style lang="less" scoped>
  .input-with-select{
    width:50%;
    min-width: 300px;
  }
</style>
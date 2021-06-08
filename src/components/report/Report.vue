<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 面包屑卡片 -->
    <el-card class="box-card">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 1000px;height:500px;margin: 0 auto"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data(){
    return {
    }
  },
  created(){
  },
  //此时dom元素已经被渲染完毕
  async mounted(){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    const {data:res} = await this.$http.get('reports/type/1')
    if(res.meta.status!==200){
      return this.$message.error('获取数据报表失败！')
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(res.data);
  },
  methods:{
    
  }
}
</script>

<style lang="less" scoped>

</style>
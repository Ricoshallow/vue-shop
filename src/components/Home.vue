<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="name">
        <img src="../assets/profile-pic.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button class="logout" type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width= "toggleFlags? '60px' : '200px'">
        <!-- 菜单栏折叠按钮 -->
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="toggleFlags"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item,index) in menulist" :key="item.id">
            <!-- 模板 -->
            <template slot="title">
              <i :class="icons[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item  :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="savaNavState('/' + subitem.path)">
              <i class="el-icon-s-grid"></i>
              <span slot="title" >{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>  
</template>

<script>
export default {
  data (){
    return {
      //左侧菜单数据（通过后台接口获取到）
      menulist: [],
      //左侧菜单栏icon对象
      icons: ["el-icon-s-custom","el-icon-s-cooperation","el-icon-s-goods","el-icon-s-order","el-icon-s-marketing"],
      toggleFlags: false,
      activePath:''
    }
  },
  //生命周期创建阶段
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout(){
      //清除token
      window.sessionStorage.clear()
      //重定向
      this.$router.push('/login')
    },
    //获取所有菜单
    async getMenuList(){
      const {data: res} = await this.$http.get('menus')
      // console.log(res);
      if (res.meta.status !==200) return this.$message.error(res.meta.message)
      this.menulist = res.data
      // console.log(this.menulist);
    },
    //显示隐藏菜单栏
    toggle(){
      this.toggleFlags = !this.toggleFlags
    },
    //保存链接激活状态
    savaNavState(path){ 
      //将点击的子列表路径存储到sessionStorage
      window.sessionStorage.setItem('activePath',path)
      this.activePath = path
    }
  }
}
</script>

<style lang="less" scoped>
  .home_container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      img {
        width: 58px;
        height: 58px;
        margin-right: 20px; 
      }
    }
  }
  .el-aside {
    margin-left: -5px;
    background-color: #333744;
    .el-menu {
      // 去除菜单栏的小边框
      border-right: none;
      span {
        margin-left: 10px;
      }
      
    }
    .toggle-button {
      color: #fff;
      // letter-spacing: 0.2em;
      text-align: center;
      cursor: pointer;
      margin-left: 5px;
    }
    .toggle-button:hover {
      background-color: #4a5064;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
</style>
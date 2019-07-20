<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggleMenu" @click="isCollapse=!isCollapse">|||</div>
        <el-menu 
        :collapse="isCollapse" 
        :collapse-transition="false" 
        :default-active="activeIndex"
        unique-opened 
        router
        class="el-menu-vertical-demo" 
        background-color="#373d41" 
        text-color="#fff" 
        active-text-color="rgba(64,158,255)">
          <!-- 列表一 -->
          <!-- 一级标题 -->
          <el-submenu :index="item.id.toString()" :key="item.id" v-for="item in listMenu">
            <template slot="title">
              <i :class="iconsList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级标题 -->
            <el-menu-item @click="setActiveIndex('/'+item.path)" :index="'/'+item.path" :key="item.id" v-for="item in item.children">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧主题内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      listMenu:[],
      iconsList:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activeIndex:''
    };
  },

  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
      this.$message.success("退出成功");
    },
    async getListMenu(){
      const res = await this.axios.get('menus')
      this.listMenu = res.data
    },
    setActiveIndex(index){  
      this.activeIndex = index  
      sessionStorage.setItem('activeIndex',this.activeIndex)
    }
  },

  created() {
    this.getListMenu()
    const index = sessionStorage.getItem('activeIndex')
    this.activeIndex = index
  }
};
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    div {
      display: flex;
      color: #fff;
      align-items: center;
      span {
        padding-left: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggleMenu{
      color:#fff;
      text-align: center;
      height:30px;
      line-height: 30px;
      user-select: none;
      cursor: pointer;
      background-color: #337442;
    }
    .el-menu{
      border-right:none;
      .iconfont{
      margin-right: 10px;
      }
    }
  }
  .el-main {
    background-color: #eee;
  }
}
</style>

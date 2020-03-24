<template>
  <el-container class="home-init">
    <el-header>
      <div>
        <i class="el-icon-delete"></i>
        <span>我的博客</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu text-color="#fff" active-text-color="#ffd04b" background-color="#333744" :default-active="activePath" unique-opened router>
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="setActivePath('/'+subItem.path)">{{subItem.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

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
        menuList : [],
        activePath: ''
      };
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push("/login");
      },
      async getMenuList() {
        const {data:res} = await this.axios.get('menus');
        if(res.meta.status != 200) return this.$message.error(res.meta.message);
        this.menuList = res.data;
      },
      setActivePath(activePath) {
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = activePath;
      }
    },
  };
</script>

<style lang='less' scoped>
  .home-init {
    height: 100%;
  }

  .el-header {
    background-color: #373d4e;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-aside {
    background-color: #333744;
  }
</style>

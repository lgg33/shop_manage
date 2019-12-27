<template>
  <el-container>
    <!--头部区域-->
    <el-header>
      <div>
        <img id="header_img" src="~assets/logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出</el-button>
    </el-header>
    <!--页面主体-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="this.isCollapsed ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744" text-color="#fff" active-text-color="#409EFF"
          unique-opened :collapse="isCollapsed" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[0]"/>
              <!-- 文本 -->
              <span>分类管理</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item index="/categoryList" @click="saveNavState('/categoryList')">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"/>
                <!-- 文本 -->
                <span>分类列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <!-- 一级菜单 -->
          <el-submenu index="2">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[0]"/>
              <!-- 文本 -->
              <span>商品管理</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item index="/productList" @click="saveNavState('/productList')">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"/>
                <!-- 文本 -->
                <span>商品列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <!-- 一级菜单 -->
          <el-submenu index="3">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[0]"/>
              <!-- 文本 -->
              <span>订单管理</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item index="/orderList" @click="saveNavState('/orderList')">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"/>
                <!-- 文本 -->
                <span>订单列表</span>
              </template>
            </el-menu-item>

<!--            &lt;!&ndash; 二级子菜单 &ndash;&gt;-->
<!--            <el-menu-item index="/baoBiao" @click="saveNavState('/baoBiao')">-->
<!--              &lt;!&ndash; 二级菜单模板 &ndash;&gt;-->
<!--              <template slot="title">-->
<!--                &lt;!&ndash; 图标 &ndash;&gt;-->
<!--                <i class="el-icon-menu"/>-->
<!--                &lt;!&ndash; 文本 &ndash;&gt;-->
<!--                <span>销量统计</span>-->
<!--              </template>-->
<!--            </el-menu-item>-->
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--主体内容-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        menuList: [],
        iconsObj: {
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
        },
        isCollapsed: false,
        activePath: ''
      }
    },
    created() {
      // this.getMenuList();

    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      async getMenuList() {
        const {data} = await this.$http.get('menus');
        // console.log(data);
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
        this.menuList = data.data;
      },
      toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
      },
      saveNavState(activePath) {
        this.activePath = activePath;
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .iconfont{
    margin-right: 10px;
  }
  .el-main {
    background-color: #eaedf1;
  }
  #header_img {
    height: 56px;
    width: 61px;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>

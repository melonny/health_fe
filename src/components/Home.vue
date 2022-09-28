<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo_cat.jpg" alt />
                <span>个人运动平台</span>
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse? '64px': '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff"
                unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" 
                :default-active="activePath">
                    <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObject[item.id]"></i>
                            <span>{{item.title}}</span>
                        </template>
                        <el-menu-item :index="it.path" v-for="it in item.subMenuList" :key="it.id" @click="saveNavState(it.path)">
                            <template slot="title">
                                <i :class="iconsObject[it.id]"></i>
                                <span>{{it.title}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data(){
        return{
            menuList:[],
            isCollapse:false,
            //图像可以改成从数据库里读出来
            iconsObject:{
                '100':'icon icon-tiantianquan',
                '200':'icon icon-xuegao',
                '101':'icon icon-denglu',
                '102':'icon iconmima',
                '103':'icon iconsport',
                '104':'icon iconshangpin',
                '201':'icon iconshu',
                '202':'icon iconkaluli',
                '203':'icon iconshiwu',
                '204':'icon icon-denglu'
            },
            activePath:'/welcome',
        }
    },
    created(){
        this.getMenuList();
        this.activePath=window.sessionStorage.getItem('activePath');
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login");
        },
        async getMenuList(){
            const {data:res} = await this.$http.get("/menus");
            console.log(res);
            if(res.flag != 200) return this.$message.error("获取列表失败啦");
            this.menuList = res.menus;
        },
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath=activePath;
        }
    }
}
</script>
<style lang='less' scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0%;
    align-items: center;
    color: #fff;
    font-size: 20px;

    div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
    .el-menu{
        border-right: null;
    }
}

.el-main {
    background-color: #eaedf1;
}

img {
    width: 55px;
    height: 55px;
}
.toggle-button{
    background-color: #4A5064;
    font-size:10px;
    line-height:24px;
    color:#fff;
    text-align:center;
    letter-spacing:0.2em;
    cursor: pointer;
}
</style>
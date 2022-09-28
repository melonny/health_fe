import Vue from 'vue'
import VueRouter from 'vue-router'
//引入Login组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect:"/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path:"/home",
    component:Home,
    redirect:"/welcome",
    children:[
      {
        path:"/welcome",
        component:Welcome
      },
      {
        path:"/user",
        component:UserList
      }
    ]
  },
  
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next();
  const userFlag=window.sessionStorage.getItem("user");
  if(!userFlag) return next('/login');
  next();
})

export default router

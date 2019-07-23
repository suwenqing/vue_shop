import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/user/User.vue'
import Rights from './components/right/Rights.vue'
import Roles from './components/right/Roles.vue'
import Cate from './components/goods/Categories.vue'
import Params from './components/goods/Params.vue'

Vue.use(Router)

const router =  new Router({
  routes: [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',redirect:'/welcome',component:Home,children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:User},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params}
    ]},
  ]
})

router.beforeEach((to,from,next)=>{
  // console.log(to)
  if(to.path=='/login'){
    next()
  }else{
    if(sessionStorage.getItem('token')){
      next()
    }else {
      next('/login')
    }
  }
})

export default router

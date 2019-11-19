import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'

import index from '@/pages/index'                //首页
import research from '@/pages/research/research'  //研发处
import dutyhome from '@/pages/duty/dutyhome'      //值班
//配置管理
import config_monitoring from '@/pages/config/config_monitoring'
import config_temp from '@/pages/config/config_temp'

import http_details from '@/pages/research/http_details'
import system_details from '@/pages/research/system_details'
import alarmlist from "@/pages/research/alarmlist"
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      redirect:"/index",
      children:[
        {
          path:'/index',
          name:'index',
          component:index,
       
        },
        {
          path:'/system_details',
          name:'system_details',
          component:system_details,
        },
        {
          path:'/http_details',
          name:'http_details',
          component:http_details,
        
        },
        {
          path:'/research',
          name:'research',
          component:research,
        },

        //配置管理-监控管理
        {
          path:"/config_monitoring",
          name:"config_monitoring",
          component:config_monitoring,
        },
        //配置管理-值班模板
        {
          path:"/config_temp",
          name:"config_temp",
          component:config_temp,
        },
        {
          path:"alarmlist",
          name:"alarmlist",
          component:alarmlist,
        }
      ],
    },
    //值班 新开窗口
    {
      path: '/dutyhome',
      name: 'dutyhome',
      component: dutyhome,
    }
  ]
})

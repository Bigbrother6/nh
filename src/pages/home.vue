<template>
  <div id="home">
    <div class="header">
          <div class="logo"></div>
          <ul class="menu">  
              <li v-for="(item,index) in Menu">
                  <a @click="jump(item,index)" :class="{actives:index+1==active}" ref="menu">{{item.label}}</a>
                  <div class="Sub_menu">
                    <div class="menu_children" @click="jumpChild(item,items.label,items.id,)" v-for="(items,indexs) in item.children">{{items.label}}</div>   
                  </div>
              </li>
          </ul>
          <div class="right">
              <span>{{time}}</span>
              <img src="../image/touxiang.png" alt="">
              <span>{{user}}</span>
              <!-- <span class="quit"></span> -->
          </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import store from '../store/index.js';
  export default {
    name:'',
    props:[''],
    data () {
      return {
          time:"", //时间
          Menu:[],//菜单
          active:"",
          
          operate:"",
          user:"",
      };
    },

    components: {},

    computed: {
  
    },
    watch: {
      '$route' (to, from) {
        this.$router.go(0);
      }
    },
    created() {
      this.getDate();
      this.getUser();
      this.getNav_fn();
    },
    mounted(){
      
    },
    updated() {
      
    },
    methods: {
        //获取当前时间 并格式化
        getDate(){
            var today,hour,second,minute,year,month,date;
            var strDate ;
            today=new Date();
            var n_day = today.getDay();
            switch (n_day)
            {
                case 0:{
                  strDate = "星期日";
                }break;
                case 1:{
                  strDate = "星期一";
                }break;
                case 2:{
                  strDate ="星期二";
                }break;
                case 3:{
                  strDate = "星期三";
                }break;
                case 4:{
                  strDate = "星期四";
                }break;
                case 5:{
                  strDate = "星期五";
                }break;
                case 6:{
                  strDate = "星期六";
                }break;
                case 7:{
                  strDate = "星期日";
                }break;
            }
            year = today.getYear()+1900;
            month = today.getMonth()+1;
            date = today.getDate();
            hour = today.getHours();
            minute =today.getMinutes();
            if(minute<10){
              minute=0+""+minute;;
            }
            second = today.getSeconds();
            if(second<10){
              second=0+""+second;;
            }
            let time=year + "年" + month + "月" + date + "日  " + strDate;
            this.time=time
          },
        
        //点击一级导航
        jump(item,index){
          if(index+1>2){
            return false;
          }
          this.active=index+1;
          if(item.label=="首页"){
            sessionStorage['active']=1;
            sessionStorage["operate"]=JSON.stringify(item.operate);
            this.$router.push({path:'/',query:{}});    
          }else if(item.label=="研发处"){
              sessionStorage['active']=2;
              sessionStorage["SysId"]=0;
              sessionStorage["SysName"]=0;
              sessionStorage["operate"]=JSON.stringify(item.operate);

            this.$router.push({path:'/research',query:{name:item.label}});
          }else if(item.label=="值班"){
          
          }else if(item.label=="配置管理"){
          
          }
        },
        ////点击二级级导航
        jumpChild(item,name,id){
            console.log(item.label);
            if(item.label=="研发处"){
              sessionStorage["SysId"]=id;
              sessionStorage["SysName"]=name;
              this.active=2
              sessionStorage['active']=2;
              sessionStorage["operate"]=JSON.stringify(item.operate);
              this.$router.push({path:'/research',query:{name:name}}) 
            }else if(item.label=="值班"){
              this.active=3
              sessionStorage['active']=3;
              sessionStorage["operate"]=JSON.stringify(item.operate);
              sessionStorage["TempId"]=id;
              const { href } = this.$router.resolve({
                  path: "/dutyhome",
                  query:{name:name}
              });
              window.open(href, '_blank');
            }else if(item.label=="配置管理" && name=="监控管理"){
              this.active=4
              sessionStorage['active']=4;
              sessionStorage["operate"]=JSON.stringify(item.operate);
              this.$router.push({path:'/config_monitoring',query:{}}) 
            }else if(item.label=="配置管理" && name=="模板管理"){
              this.active=4
              sessionStorage['active']=4;
              sessionStorage["operate"]=JSON.stringify(item.operate);
              this.$router.push({path:'/config_temp',query:{}}) 
            }else{
              console.log("菜单错误")
            }
        },
      
        getNav_fn(){
          let param={};
          this.$http.get("/home/getNavData",param).then((res)=>{  
              this.Menu=res.data;
              //一级排序
              this.Menu.sort((a, b) => {
                  return (a.order + '') > (b.order + '')? 1 : -1;
              })
              //二级排序
              for(var i=0;i<this.Menu.length;i++){
                if(this.Menu[i].children.length!=0){
                    this.Menu[i].children.sort((a,b)=>{
                    return (a.id + '') > (b.id + '')? 1 : -1;
                  })
                }

              }
                //默认首页权限
                this.active=sessionStorage['active'];
                this.operate=sessionStorage["operate"];
                if(this.active==undefined){
                  this.active=1;
                  sessionStorage["active"]=1;
                }
                if(this.operate==undefined){
                  this.operate=this.Menu[0].operate
                  sessionStorage["operate"]=JSON.stringify(this.Menu[0].operate)
                }

          })
        }, 
        
        getUser(){
          let param={};
          this.$http.get("/home/getCurrentUser",param).then((res)=>{  
              this.user=res.msg;
          })
        }
        
        },
  }

</script>
<style lang='css' scoped>
  #home{
    width: 100%;
    height: 100%;
  }
  .header{
    height: 75px;
    background:#2E354F; 
    
  }
  .logo{
    float: left;
    width: 280px;
    height: 75px;
    background: url("../image/logo.png") no-repeat 20px 10px;
  }

  .header>ul{
    height: 70px;
    float: left;
   
  }
  .header>ul>li{
    float: left;
    height: 70px;
    line-height: 70px;
    /* margin: 0 20px; */
  }
  .header>ul>li:hover .Sub_menu{
      display: block
  }
  .menu a{
    display: inline-block;
    text-decoration: none;
    cursor: pointer;
    width: 120px;
    text-align: center;
   
  }
 .actives{
    color:#14a9ff;
    background: #3D4866;
    border-bottom:2px solid #1f74f1;
 }
  .menu a:hover{
    color:#14a9ff;
    background: #3D4866;
  }

.Sub_menu{
  display: none;
  position: absolute;
  background:#3D4866;
  z-index: 5;
  max-width: 500px;
}


.menu_children{
  width: 122px;
  height: 70px;
  text-align: center;
  cursor:pointer;
  float: left;
}
.menu_children:hover{
  color:#14a9ff;
    background: #3D4866;
    border-bottom:2px solid #1f74f1;
}
.right{
  /* display:flex;
  flex-direction:row; */
  float:right;
  color:#eeeeee;
  margin-right:100px;
  margin-top:15px;
}
.right>span{
  margin-left:10px;
}
.right>img{
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin: 0 10px 0 20px;
  border-radius: 50%;
}
.right>.quit{
    display:inline-block;
    width: 21px;height:26px;
    background: url("../image/quit.png") no-repeat 0px 0px;
    position: relative;
    top: 13px;
}
</style>
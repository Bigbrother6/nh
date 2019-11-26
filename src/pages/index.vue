<template>
    <div id="index">
      <div class="row1">
        <div class="row1_left">
          <p class="title"><i></i><span>系统数量概览</span></p>
          <div class="system_box">
            <div class="system_item1">
              <p>{{SysNum.sysNum}}</p>
              <p>系统总数量</p>
            </div>
            <div class="system_item2"></div>
            <div class="system_item3">系统情况</div>
            <div class="system_item4">
                <h4><i class="red"></i><b>{{SysNum.alarmNum}}</b></h4>
                <h4><i class="yellow"></i><b>{{SysNum.majorNum}}</b> </h4>
                <h4><i class="green"></i><b>{{SysNum.sysOkNum}}</b> </h4>
            </div>
          </div>
        </div>
        <div class="row1_right">
            <div class="col1">
              <p class="title"><i></i><span>当前告警情况分析</span></p>
              <p class="alarm_title">当前共有<em>{{alarmLength}}</em>套系统存告警，告警数量<em>{{alarmNum}}</em> 条</p>
              <!-- 主要 -->
              <div class="main">
                 <div class="main_left">
                  <div class="alarm_red"></div>
                  <span>{{alarmNum}}条</span>
                 </div>
                 <div class="main_right">
                    <p v-for="(item,index) in alarmdata">
                      <span>{{item.sysName}}</span><span><em class="c_red">{{item.alarmNum}}</em>条</span>
                    </p>
                    <p class="no_alarm" v-if="alarmdata.length==0">暂无告警</p>
                 </div> 
              </div>
              <!-- 次要 -->
              <div class="main">
                <div class="main_left">
                 <div class="alarm_blue"></div>
                 <span>0条</span>
                </div>
                <div class="main_right">
                   <!-- <p v-for="(item,index) in alarmdata">
                     <span>{{item.sysName}}</span><span>{{item.alarmNum}}条</span>
                   </p> -->
                   <p class="no_alarm">暂无告警</p>
                </div> 
             </div>
            </div>
            <div class="col2">
              <div id="chart1" style="width:100%;height: 100%"></div>
              <div class="no_pie" v-if=nodata>暂无告警信息</div>
            </div>
        </div>
      </div>
      <div class="row2">
          <p class="title"><i></i><span>数据中心情况</span></p>
          <div class="datacenter" v-for="item in datas" :key="item.deptId">
              <p>{{item.dept}}</p>
              <div class="data_item">
                <div class="item1">
                  <i class="icon1" @click="jump(item.deptId,item.dept)"></i>
                  <span @click="jump(item.deptId,item.dept)">监控系统数</span>
                  <em @click="jump(item.deptId,item.dept)">{{item.sysNum}}</em>
                </div>
                <div>
                  <i class="icon2"></i>
                  <span>当前发生告警系统数</span>
                  <em>{{item.alarmSysNum}}</em>
                </div>
                <div>
                  <i class="icon3"></i>
                  <span>当前总告警</span>
                  <em>{{item.sysAlarmNum}}</em>
              </div>
              <div>
                  <span class="add" @click="details_fn(item.deptId)"><i class="icon4"></i>查看详情</span>
              </div>
          </div>
      </div>
       
          
        </div>
      <!-- 模套框-->
      <div class="" id="model" ref="model">
          <div class="model_content">
              <p>
                 <span>系统告警详情</span>
                <i @click="close_model()"></i>
              </p>
              <div class="content">
                <table class="table">
                  <tr>
                    <th>序号</th>
                    <th>系统名称</th>
                    <th>运行状态</th>
                  </tr>
                  <tr v-for="(item,index) in details" :key="item.sysName">
                    <td>{{index+1}}</td>
                    <td>{{item.sysName}}</td>
                    <td>告警数量<i class="alarmnum">{{item.alarmNum}}</i>条，其中红色<i class="color_red">&nbsp;{{item.alarmNum}}&nbsp;</i>条，黄色<i class="color_yellow">&nbsp;0&nbsp;</i>条</td>
                  </tr>
                </table>
              </div>
          </div>
      </div>
    </div>
  </template>

  <script>
    import echarts from 'echarts';
    import store from '../store/index.js'
    export default {
      name:'',
      props:[''],
      data () {
        return {
            SysNum:{}, //系统数量
            
            alarmdata:[],
            alarmNum:"", //告警数量 和
            alarmLength:"",   //系统个数 个数

            datas:[], //数据中心列表
            details:[], //数据中心详情
            nodata:false,
    
        };
      },
  
      components: {
        
      },
  
      computed: {

      },
  
      created() {
      
        
        this.getdata_fn();
        this.piedata_fn();
        this.datacenter_fn();
      },
      mounted() {
         
      },
  
      methods: {
        draw(pie){
          var myChart = echarts.init(document.getElementById('chart1'));
          var option={
            color: ['#d14200','#ff8844','#1fa8f1',],
            tooltip:{
              trigger: 'item',
              formatter: " {b}<br/>{c} ({d}%)"
            },
            label:{
              fontSize: 15,
              formatter:"{b}:\n{d}%"
			      },
            series:{
              name:'面积模式',
              type:'pie',
              radius : [30, 80],
              roseType : 'area',
              data:pie
            }
          }
          myChart.setOption(option);
          //4随窗口改变自适应图表，能适应多个图
         window.addEventListener("resize",function(){
                myChart.resize();
              });
        },

    
        //获取数据左上角
        getdata_fn(){
					  let param={}
						this.$http.get("/home/getSysAllMsg",param).then(res=>{
              this.SysNum=res.data;
					  }).catch((e)=>{
              console.log(e)
					})
        },
        //右边数据
        piedata_fn(){
          let param={};
          this.$http.get("/home/getSysPieMsg",param).then(res=>{
            if(res.data.length!=0){
              this.nodata=false;
              let array=res.data;
              //[{"alarmNum": 76,"sysName": "测试系统"},{"alarmNum": 36,"sysName": "测试系统2"}]
              //[{"value:76",name:"测试系统"}]
              //改key值
              let result = array.map(data=>{return{value:data.alarmNum, name:data.sysName}});
              this.draw(result); //画图
              //计算
              this.alarmdata=res.data;
              let num=new Number;
              this.alarmdata.forEach(item => {num+=item.alarmNum});
              this.alarmNum=num;
              this.alarmLength=this.alarmdata.length
            }else{
              this.nodata=true;
              this.alarmNum=0;
              this.alarmLength=0;
            }

              
          })
        },
        //数据中心列表
        datacenter_fn(){
            let param={}; 
            this.$http.get("/home/getDepartmentSysMsg",param).then(res=>{
                this.datas=res.data;
            })
        },
        //数据详情
        details_fn(id){
         // this.$refs.model.style="display:block";
          this.$refs.model.style.display="block";
            let param={deptId:id}
            this.$http.axiospost("/home/getSysAlarmMsgByDeptId",param).then(res=>{
                  this.details=res.data;
            })
        },
        //调转
        jump(id,name){
          sessionStorage["SysId"]=id;
          sessionStorage["SysName"]=name;
          sessionStorage["active"]=2;
      
          this.$router.push({
            path:"/research",
            //query:{id:id,name:name}
          })
        },
        
        close_model(){
          this.$refs.model.style.display="none";
        }
      },
  
      watch: {}
  
    }
  
  </script>
  <style>

  </style>
  <style lang='scss' scoped>
      @import url("../css/indextop.css");
      #index{
        background: #1D2437;
        padding: 25px;
        color:#ffffff;
      }

      .datacenter{
        margin:15px;
      }
      .datacenter>p{
        background:#262d43;
        padding: 6px 15px;
        font-size: 18px;
      }
      .data_item{
        display: flex;
        flex-direction: row;
        width:100%;
        background: #1d2437;
        height: 75px;
        line-height: 75px;
      }
      .data_item>div{
        width: 25%;
        margin-left:30px;
      }
      .data_item>div i{
        margin: 0 10px;
       
      }
      .data_item>div em{
        margin: 0 10px;
       
      }
      .item1>i,.item1>span,.item1>em{
        cursor: pointer;
      }

      .alarmnum{
        color: #48c1ff;
        margin:0 4px;
      }
    .icon1{
      display:inline-block;
      width:33px;
      height: 28px;
      background:url("../image/jiankong.png");
      position: relative;
      top:8px;
    }
    .icon2{
      display:inline-block;
      width:25px;
      height: 22px;
      background:url("../image/gaojing1.png");
      position: relative;
      top:3px;
    }
    .icon3{
      display:inline-block;
      width:25px;
      height: 25px;
      background:url("../image/time.png");
      position: relative;
      top:5px;
    }
    .add{
      background: #245392;
      padding: 8px 23px;
      cursor: pointer;
    }
    .icon4{
        width: 18px;
        height: 20px;
        display: inline-block;
        background: url("../image/add.png") no-repeat 0px 1px;
        position: relative;
        top:4px;
        left: -7px;
    }
    mar10{
      margin: 0 10px;
    }

    
    /*编辑模态框阴影*/
    #model{
      display: none;
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      background-color: rgba(0,0,0,0.7);
    }
    .model_content{
      width: 700px;
      margin: 10% auto;
      padding: 10px;
      background:#1b2032;
      -webkit-animation: zoom 0.6s;
      animation: zoom 0.6s;
    }
    .model_content>p{
        background: #1b2032;
        height: 40px;
        line-height: 40px;
    }
    .model_content>p>span{
      font-size:17px;
      margin-left:15px;
    }
    .model_content>p>i{
        cursor: pointer;
        width:20px;
        height: 20px;
        background: url("../image/close2.png");
        float:right;
        margin-top: 10px;
        margin-right: 20px;
    }
    .content{
        height: 300px;
        overflow: auto;
    }
    .table{
      width: 100%;
      border-collapse: collapse;
      background:#1b2032;
      th{
        text-align: center;
        height: 40px;
        line-height:40px
      }
      td{
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-top:1px solid #3c404e;
      }
    }

    @-webkit-keyframes zoom{
      from {
        -webkit-transform: scale(0);
        -moz-transform: scale(0);     /* for Firefox */
        -ms-transform:scale(0);        /* for IE */
        -o-transform: scale(0);         /* for Opera */
      }
      to {
        -webkit-transform: scale(1);
        -moz-transform: scale(1);     /* for Firefox */
        -ms-transform:scale(1);        /* for IE */
        -o-transform: scale(1);         /* for Opera */
      }
    }
    @keyframes zoom{
      from {
        -webkit-transform: scale(0);
        -moz-transform: scale(0);     /* for Firefox */
        -ms-transform:scale(0);        /* for IE */
        -o-transform: scale(0);         /* for Opera */
      }
      to {
        -webkit-transform: scale(1);
        -moz-transform: scale(1);     /* for Firefox */
        -ms-transform:scale(1);        /* for IE */
        -o-transform: scale(1);         /* for Opera */
      }
    }






  </style>
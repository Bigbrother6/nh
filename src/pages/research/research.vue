<template>
  <div id="research">
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
              <h4><i class="red"></i><b>{{SysNum.alarmNum}}</b> </h4>
              <h4><i class="yellow"></i><b>{{SysNum.majorNum}}</b> </h4>
              <h4><i class="green"></i><b>{{SysNum.sysOkNum}}</b> </h4>
          </div>
        </div>
      </div>
      <div class="row1_right">
        <!-- <p class="title"><i></i><span>当前告警情况分析</span></p>
        <p class="alarm_title">当前共有{{alarmLength}}套系统存告警，告警数量{{alarmNum}}条</p>
        <div class="alarm_box clearfix">
            <div class="alarm_item1">
                <div class="alarm_red"></div>
                <h3>{{alarmNum}}条</h3>
            </div>
            <div class="alarm_item2">
                <div v-for="(item,index) in alarmdata" v-if="index<2">
                    <p>{{item.sysName}}</p>
                    <p>{{item.alarmNum}}条</p>
                </div>
            </div>
            <div class="alarm_item1">
              <div class="alarm_blue"></div>
              <h3>0条</h3>
            </div>
            <div class="alarm_item2">
              <div>
                <p>无告警</p>
                <p>0条</p>
            </div>
            </div>
        </div>
        <div id="chart">
          <div id="chart1" style="width:100%;height: 100%"></div>
        </div>
        <div id="nodata" v-if="nodata">
          <p>暂无告警信息</p>
        </div> -->
            <div class="col1">
              <p class="title"><i></i><span>当前告警情况分析</span></p>
              <p class="alarm_title">当前共有<em>{{alarmLength}}</em> 套系统存告警，告警数量<em>{{alarmNum}}</em> 条</p>
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
      <div id="researchindex">
        <p class="title"><i></i><span>{{name}}</span></p>
        <div class="system">
          <div v-for="item in sys" @click="jump(item.id)" class="tip">
              <div :class="{gao:item.sysAlarmNum>0}" class="box2">
                <p class="sysname">{{item.abbreviation}}</p>
                <h5 class="sysnum">{{item.sysAlarmNum}}</h5>
              </div>
              <p class="zsysname">{{item.sysName}}</p>
              <!-- <h4 class="sysname">{{item.abbreviation}}</h4>
                  <h4 class="sysname" v-if="item.abbreviation=='' || item.abbreviation==undefined">{{item.sysName}}</h4>
                  <h5 class="sysnum">{{item.sysAlarmNum}}</h5>
                  <p>{{item.sysName}}</p> -->
                  <!-- <div class="tipbox">
                    <div class="tipbox2"></div>
                    <span>{{item.sysName}}</span>
                  </div> -->
          </div>
        </div>
      </div>
    </div>   
  </div>
</template>

<script>
  import echarts from 'echarts';
  import store from '../../store/index.js';
  export default {
    name:'',
    props:[''],
    data () {
      return {
         
          SysNum:{}, //系统数量    
          
          alarmdata:[],
          alarmNum:"", //告警数量 和
          alarmLength:"",   //系统个数 个数
          
          name:"",
          sys:"", //各个系统列表
          nodata:false,
      };
    },
    watch: {
       '$route' (to, from) {
           this.$router.go(0);
       }
},
    
    components:{
   
    },
    computed: {

    },
    created() {
        let id = sessionStorage["SysId"];
        let name = sessionStorage["SysName"];
        if(id==0){
          id=null
        }
        this.name=name;
        console.log(id);
        console.log(name)
        this.getdata_fn(id);
        this.piedata_fn(id);
        this.sysdata_fn(id);
    },
    mounted() {
     
    },

    methods: {
        //获取数据左上角
        getdata_fn(id){
          let param={deptId:id};
						this.$http.get("/department/getDepartmentSysMsg",param).then(res=>{
              this.SysNum=res.data;
					  }).catch((e)=>{
              console.log(e)
					})
        },
        //右边数据
        piedata_fn(id){
          let param={deptId:id};
          this.$http.get("/department/getDepartmentPieMsg",param).then(res=>{
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
                this.alarmLength=this.alarmdata.length;
              }else{
                this.nodata=true;
                this.alarmNum=0;
                this.alarmLength=0;
              }
  
          })
        },
        //各大系统
        sysdata_fn(id){
          let param={deptId:id};
          this.$http.get("/department/getDepartmentSysAlarmMsg",param).then(res=>{
            this.sys=res.data;
            this.sys.sort((a,b)=>{
              return (a.sysAlarmNum + '') < (b.sysAlarmNum + '')? 1 : -1;
            })
            console.log(this.sys)

            
          })
        },
        jump(id){
          let param = {sysId:id};
          this.$http.get("/department/getTaskBySysId",param).then((res)=>{
              if(res.data.taskNum>0){
                sessionStorage["DepId"]=id;
                sessionStorage["active"]=2;
                sessionStorage['showlist']=1;
                this.$router.push({
                  path:"/system_details",
                })
              }else{
                this.$message.error('该系统没有加入到监控,请到监控管理进行配置');
              }
          })
        },
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
              radius :[30,80],
              roseType : 'area',
             // roseType: 'radius',
              data:pie
            }
          }
          myChart.setOption(option);
         //4随窗口改变自适应图表，能适应多个图
         window.addEventListener("resize",function(){
                myChart.resize();
              });
        },

    },


  }

</script>

<style lang='scss' scoped>
@import url("../../css/indextop.css");
#research{
  background: #1D2437;
  padding:25px;
  color:#ffffff;
}
#nodata{
  position:absolute;
  right: 20%;
  top: 50%;
}
  .system{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin:10px;
  }
  .tip{
    width: 120px;
    height: 120px;
    margin:5px;
    cursor: pointer;
  }
  .box2{
    width: 120px;
    height: 90px;
    background:green;
    padding-top: 13px;
    border-radius: 5px;
    position: relative;
  }
  .sysname{
    text-align: center;
    font-size:15px;
    font-weight: 600;
    word-wrap: break-word;
  }
  .sysnum{
    font-weight: 600;
    font-size: 17px;
    margin-top: 5px;
    position: absolute;
    bottom: 10px;
    left: 55px;
  }
  .zsysname{
    text-align: center;
    font-size:17px;
  }
  .system .gao{
    background:#ef3a32;
  }
 /* .tip{
   position: relative
 }
 .tip:hover .tipbox{
    display: block;
 } */
 /* .tipbox{
    position: absolute;
    display:none;
    top: 100px;
    right:10px;
    padding: 5px;
    min-width: 100px;
    border-radius: 5px;
    text-align: left;
    vertical-align: top;
    background-color:#352425;
 }
 .tipbox2{
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #352425;
    box-sizing: border-box;
    position: absolute;
    top: -9px;
    left: 26px;
 } */
</style>
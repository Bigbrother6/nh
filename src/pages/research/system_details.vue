<template>
  <div id="system_details">
    <div class="row1">
        <div class="info">
            <p class="title"><i></i><span>系统信息</span></p>
            <span>{{SysMsg.sysName}}</span>
            <h5>管理部门：{{SysMsg.dept}}</h5>
            <h5>负责人：{{SysMsg.abbreviation}}</h5>
            <!-- <h5>系统分类：{{SysMsg.appType}}</h5> -->
            <h5>系统级别：{{SysMsg.appType}}</h5>
        </div>
        <div class="state">
            <p class="title"><i></i><span>运行状态</span></p>
            <p class="alarmnum">当前告警数量{{Total}}条，其中异常{{Total}}，正常0</p>
            <div v-for="item in TimeAlarm">
              <span>0</span>
              <i class="huang"></i>
              <span>{{item.flag}}分钟</span>
              <i class="hong"></i>
              <span>{{item.count}}</span>
            </div>
        </div>
        <div class="alarm">
            <p class="title"><i></i><span>告警列表</span> <span class="btn more" @click="jump()">更多信息</span></p>
            <div class="tablelist">
                <table id="table">
                  <tr>
                    <th width="100px">标题</th>
                    <th width="100px">次数</th>
                    <th width="100px">告警级别</th>
                    <th width="100px">应用系统</th>
                  </tr>
                  <tr v-for="(item,index) in AlarmList">
                      <td>{{item.title}}</td>
                      <td>{{item.total}}</td>
                      <td>
                        <span v-if="item.severity==1">严重告警</span>
                        <span v-if="item.severity==2">主要告警</span>
                        <span v-if="item.severity==3">次要告警</span>
                      </td>
                      <td>{{item.sysName}}</td>
                  </tr>     
              </table>
            </div>

        </div>
    </div>
    <div class="row2">
        <p class="title"><i></i><span>应用系统拓扑</span><em class="btn add" @click="jumpAlarm()" v-if="operate.monitor==1">添加监控</em></p>
        <div v-for="item in TopSys">
          <i  :class="item.alarmNum>0 ? red1:blue1" @click="jumpTop(item)"></i>
          <p>{{item.ip}}</p>
        </div>
    </div>
    <div class="row3" v-if="showlist==1">
      <p class="title"><i></i><span>监控项列表</span></p>
      <table id="tables">
        <tr>
          <th>监控名称</th>
          <th>监控类型</th>
          <th>服务器ip</th>
          <th>监控地址</th>
          <th>监控频率(分钟)</th>
          <th>是否确认</th>
          <th>运行状态</th>
          <th>责任人</th>
          <th>备注</th>
        </tr>
        <tr v-for="item in Monitor">
            <td>{{item.name}}</td>
            <td>{{item.type}}</td>
            <td>{{item.ip}}</td>
            <td>{{item.url}}</td>
            <td>{{item.rate}}</td>
            <td>
              <span v-if="item.repeatflag=='Y'">是</span><span v-if="item.repeatflag=='N'">否</span>
            </td>
            <td>
                <span v-if="item.state=='Y'">运行</span><span v-if="item.state=='N'">停止</span>
            </td>
            <td>{{item.linkperson}}</td>
            <td>{{item.name}}</td>
        </tr>
    </table>
    </div>
  </div>
</template>

<script>

  export default {
    name:'',
    props:[''],
    data () {
      return {
        SysMsg:"",
        TimeAlarm:[],
        AlarmList:"",
        TopSys:"",
        Monitor:"",
        Total:"",//总计
        
        red1:"red1",
        blue1:"blue1",
        operate:"",

        showlist:1,
      };
    },

    components: {},
    computed: {},
    created() {
      this.operate=JSON.parse(sessionStorage["operate"]);
      this.show=sessionStorage['showlist'];
      if(this.showlist==undefined){
          this.showlist=1;
      }
      let id=sessionStorage["DepId"];
      this.SysMsg_fn(id);
      this.TimeAlarm_fn(id);
      this.AlarmList_fn(id);
      this.TopSys_fn(id);
      this.Monitor_fn(id);
      this.Total_fn(id);
    },
    mounted() {
      setInterval(()=>{
        this.TimeAlarm_fn(sessionStorage["DepId"])
        this.Total_fn(sessionStorage["DepId"])
      },300000)
    },
    methods: {
      //系统信息
      SysMsg_fn(id){
					let param={sysId:id}
					this.$http.get("/duty/getSystemDetail",param).then(res=>{
              this.SysMsg=res.data;
					}).catch((e)=>{
              console.log(e)
					})
      },
     //告警列表
      AlarmList_fn(id){
					let param={
            id:id,
            title:null,
            sysName:null
          }
					this.$http.axiospost("/duty/queryAlertListBySysId",param).then(res=>{
            this.AlarmList=res.data;
          }).catch((e)=>{
              console.log(e)
					})
      },
      TopSys_fn(id){
					let param={id:id}
					this.$http.get("/duty/queryTopoBySysId",param).then(res=>{
            this.TopSys=res.data;
					}).catch((e)=>{
              console.log(e)
					})
      },
      Monitor_fn(id){
					let param={id:id}
					this.$http.get("/duty/queryTaskListBySysId",param).then(res=>{
            this.Monitor=res.data;
					}).catch((e)=>{
              console.log(e)
					})
      },
      TimeAlarm_fn(id){
        let param={sysid:id}
					this.$http.get("/duty/queryAlertNumDiffTime",param).then(res=>{
            this.TimeAlarm=res.data;
            // let num=new Number();
            // this.TimeAlarm.forEach(item => {num+=item.count});
            // console.log(num)
            // this.Total=num;  //和
					}).catch((e)=>{
              console.log(e)
					})
      },
      Total_fn(id){
        let param={sysId:id}
					this.$http.get("/duty/getCurrentAlarm",param).then(res=>{
              this.Total=res.data.currentAlarm;
					}).catch((e)=>{
              console.log(e);
              this.Total=res.data.currentAlarm;
					})
      },
      jump(){
        this.$router.push({
          path:"/alarmlist",
          query:{}
        })
      },
      jumpTop(item){
          sessionStorage["TopIp"]=item.ip;
          sessionStorage["TopId"]=item.sysId;
          this.$router.push({
            path:"/http_details"})
        
      },
      jumpAlarm(){
        this.$router.push({
          path:"/config_monitoring",
          query:{}
        })
      }

      
    },

    watch: {}

  }

</script>
<style lang='scss' scoped>
    #system_details{
      color:#ffffff;
      padding: 20px;
    }
  .row1{
    display: flex;
    justify-content: space-between;
  }
  .info,.state,.alarm{
    padding:10px;
    border-radius: 5px;
    background:#101526;
  } 
  .info{
      /* width: 340px; */
      width: 19%;
      height: 305px;

  }
  .state{
    /* width: 750px; */
    width: 39%;
    height: 305px;
  }
  .state>.alarmnum{
    text-align: center;
    padding: 40px 0px 30px 0px;
  }
  .state>div{
    text-align: center;
    margin: 10px 0px;
  }
  .huang{
    display: inline-block;
    width: 200px;
    height: 10px;
    background: green;
  }
  .hong{
    display: inline-block;
    width: 200px;
    height: 10px;
    background: red;
  }

  .alarm{
    /* width: 750px; */
   width: 39%;
    height: 305px;
    overflow: hidden;
  }
  .more{
    float: right;
    margin-right: 7px;
    cursor: pointer;
  }
  .tablelist{
    width: 100%;
    height: 237px;
    overflow: auto;
    margin-top: 20px;
  }
  .alarm table{
      width: 100%;
      color:#fff;
      border-collapse: collapse;
  }
  .alarm th{
	  height: 40px;
    line-height: 40px;
    background:#262d43;
  }
  .alarm td{
    height: 40px;
    line-height: 40px;
    text-align: center;
    white-space: nowrap;
    background:#1d2437;
    }
  
  .title{
    font-size: 20px;
    padding-left: 10px;
  }
  .title i{
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url("../../image/plane.png");
      position: relative;
      top:10px;
  }
  .title span{
    position: relative;
    top: 4px;
    margin-left: 10px;
  }
  .info>span{
    font-size: 25px;
    padding: 5px 21px;
    background: #0093fd;
    display: inline-block;
    margin-top: 50px;
    margin-left: 50px;
  }
  .info>h5{
    margin-top: 10px;
    margin-left: 50px;
  }

  .row2{
    width: 100%;
    border-radius: 5px;
    min-height: 200px;
    background:#101526;
    margin-top:10px;
    padding: 10px;
  }
  .row2>div{
    float: left;
    width: 150px;
    height: 125px;
    text-align: center;
    margin: 20px 35px;
  }
  .add{
    float:right;
  }
  .row2>div i{
    display: inline-block;
    width: 86px;
    height: 94px;
  }
  .red1{
    background: url("../../image/red2.png") no-repeat;
  }
  .blue1{
    background: url("../../image/blue2.png") no-repeat;
  }
  .row3{
    margin-top:10px;
    padding: 20px;
    width: 100%;
    border-radius: 5px;
    background:#101526;
    table{
      width: 100%;
      margin-top:20px;
      border-collapse: collapse;
      th{
        height: 40px;
        line-height: 40px;
        background:#262d43;
      }
      td{
        height: 60px;
        line-height: 60px;
        text-align: center;
      }
     tr:nth-child(odd) > td {
	      background:#1d2437;
	    } 
    }
  }
</style>
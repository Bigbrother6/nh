<template>
    <div id="alarmlist">
        <div class="row1">
            <span class="title">标题</span><el-input v-model="title" placeholder="请输入名称" @keyup.enter.native="Search_fn()"></el-input>
            <!-- <span class="title">业务系统</span><el-input v-model="sysName" placeholder="请输业务系统"></el-input> -->
            <!-- <span class="title">告警类型</span> -->
            <!-- <el-select v-model="Svalue" placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select> -->
            <span class="btn search" @click="Search_fn()">搜索</span>
        </div>
        <div class="row2">
            <table id="tables">
                <tr>
                    <th width="10%">监控项名称</th>
                    <th width="50%">内容</th>
                    <th width="10%">级别</th>
                    <th width="5%">次数</th>
                    <th width="15%">最后发生时间</th>
                    <th width="10%">业务系统</th>
                </tr>
                <tr v-for="item in ShowData">
                    <td width="10%">{{item.NAME}}</td>
                    <td width="50%" class="pointer">
                            <span>{{item.text}}</span>
                    </td>
                    <td width="10%">
                      <span v-if="item.severity==1">严重告警</span>
                      <span v-if="item.severity==2">主要告警</span>
                      <span v-if="item.severity==3">次要告警</span>
                    </td>
                    <td width="5%">{{item.total}}</td>
                    <td width="15%">{{item.lastoccurtime}}</td>
                    <td width="10%">{{item.sysName}}</td>
                </tr>
                <tr v-if="ShowData.length==0" class="nodata">
                  <td colspan=6>没有数据</td>
                </tr>
            </table>
            <div class="page" v-if="pageShow">
                <page :page-total="count" @pagefn="page_fn"></page>
            </div>
        </div>
        <!-- 模态框 -->
        <el-dialog title="" :visible.sync="dialogVisible"
          custom-class="modeltext"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          >
          <div class="model_content">
            <iframe src="https://www.baidu.com" frameborder="0" width="100%" height="100%"></iframe>
          </div>
        </el-dialog>
    </div>
  </template>
  
  <script>
    import page from '../../components/page.vue'
    export default {
      name:'',
      props:[''],
      data () {
        return {
            title:null,  //标题
            sysName:null,    //业务系统
            id:null,
            Svalue:"",
            // types:[{label:"主要告警",id:1},{label:"次要告警",id:2}],
          pageShow:true, //显示分页
          AllData:[],
          ShowData:[],//显示的数据10条
          count:0,    //总条数
          pageNum:1, //当前页
          list:[],
          dialogVisible: false,

          ww:"",
        };
      },
  
      components: {
          page
      },
  
      computed: {
        
      },
  
      created(){
        this.id = sessionStorage["DepId"];
        this.AlarmList_fn(this.id);
      },
      mounted() {
        let ww =$("#tables").width();
        this.ww=ww;
        console.log(ww); //1286
      
      },
      updated() {
     
      },
      methods: {
        page_fn(val){
            this.pageNum=val.pageNum;
            if(this.pageNum==1){
              this.ShowData=this.AllData.slice(0,10);//1
            }else if(this.pageNum==2){
              this.ShowData=this.AllData.slice(10,20);//2
    
            }else{//3  20/30
              this.ShowData=this.AllData.slice((this.pageNum-1)*10,this.pageNum*10);
    
            }   
        },
        //获取数所有 slice() 
        AlarmList_fn(id){
          // this.pageShow=true;
					let param={
            id:id,
            title:this.title,
            sysName:this.sysName
          }
					this.$http.axiospost("/duty/queryAlertListBySysId",param).then(res=>{
            this.pageShow=true;
            this.AllData=res.data;
            this.count=this.AllData.length;
    
            this.ShowData=this.AllData.slice(0,10)     
					}).catch((e)=>{
              console.log(e)
				})
      },
        //搜索
        Search_fn(){
          this.pageNum=1;
          this.pageShow=false;
          if(this.title=="" ||　this.title==null){
            this.title==null
          }
         
          this.AlarmList_fn(this.id);
        },
        open(){
          this.dialogVisible=true
        }

  
      },
  
      watch: {}
  
    }
  
  </script>
  <style lang='scss' scoped>
      #alarmlist{
        width:100% ;
        color:#ffffff;
        padding:20px;
      }

    .row1{
      height: 80px;
    line-height: 80px;
    background: #101526;
    text-align: center;
      .title{
        margin: 0 30px 0 0px;
      }

       .search{
        position: relative;
        top: 1px;
        font-size: 14px;
        cursor: pointer;
        margin: 0 100px 0 17px;
      }
    }
    .search:hover{
        color:#ffffff;
      }
    .row2{

      margin-top:10px;
      padding: 20px;
      width: 100%;
      background:#101526;
      font-size: 13px;
      table{
        width: 100%;
        margin-top:20px;
        border-collapse: collapse;
        th{
          height: 40px;
          line-height: 40px;
          background:#262d43;
          /* padding:15px 5px 5px 10px; */
        }
        td{
          padding: 15px 0px;
          text-align: center;
  
        }
       tr:nth-child(odd) > td {
            background:#1d2437;
          } 
      }
      .nodata{
        background: #1d2437;
        height: 50px;
        line-height: 50px;
      }
      .page{
          margin-top:20px;
      }
      .tab_content{
        cursor: pointer;  
        overflow:hidden;
        text-overflow:ellipsis; 
        white-space:nowrap;
        display:inline-block;
        width: 500px;      
      }
      .tab_width{
        overflow:hidden;
        text-overflow:ellipsis; 
        white-space:nowrap; 
      }
    }
    .model_content{
      width: 100%;
      height: 500px;
    }
  </style>
  <style>
    /* 外框 */
   #alarmlist .el-input{  
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 290px;
   }
    #alarmlist .el-input__inner{
      height: 35px;
      width: 290px;
      line-height: 35px;
      background: #0b1126;
      border-color: #3b4661;
      color:#ffffff;
    }
    
    #alarmlist .modeltext{
      background:#101526;
      color: #ffffff
    }
    #alarmlist .el-dialog__title{
      color:#ffffff;
    }

    
  </style>
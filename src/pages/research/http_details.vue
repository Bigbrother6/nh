<template>
    <div id="system_details">
        <!-- 正常 -->
        <div class="httpdetails" v-if="normal" v-for="item in AbnormalData">
                    <p class="title"><i></i><span>{{item.type}}监控</span></p>
                    <table>
                        <tr class="row1">
                            <th colspan="6">监控详情</th>
                        </tr>
                        <tr class="row2">
                            <td>监控名称</td>
                            <td>{{item.NAME}}</td>
                            <td>业务系统</td>
                            <td>{{item.sysName}}</td>
                            <td>服务器ip</td>
                            <td>{{item.ip}}</td>
                        </tr>
                        <tr class="row2">
                                <td>监控地址</td>
                                <td>{{item.url}}</td>
                                <td>监控频率</td>
                                <td colspan="3">{{item.rate}}</td>               
                        </tr>
                        <tr class="row2">
                            <td>监控类别</td>
                            <td>{{item.type}}</td>
                            <td>运行状态</td>
                            <td colspan="3" style="background: green">正常</td>
                        </tr>
                        <tr class="row2">
                            <td>故障影响</td>
                            <td colspan="5">{{item.plan}}</td>  
                        </tr> 
                        <tr class="row2">
                            <td>故障处理</td>
                            <td colspan="5">{{item.remark}}</td> 
                        </tr>                             
                    </table>  
        </div> 
        <!-- 异常  -->
        <div class="httpdetails" v-if="!normal" v-for="item in AbnormalData">
            <p class="title"><i></i><span>{{item.type}}监控</span></p>
            <table>
                <tr class="row1">
                    <th colspan="6">监控详情</th>
                </tr>
                <tr class="row2">
                    <td>监控名称</td>
                    <td>{{item.NAME}}</td>
                    <td>业务系统</td>
                    <td>{{item.sysName}}</td>
                    <td>服务器IP</td>
                    <td>{{item.ip}}</td>
                </tr>
                 <tr class="row2">
                        <td>监控地址</td>
                        <td>{{item.url}}</td>
                        <td>监控频率(分钟)</td>
                        <td>{{item.rate}}</td>
                        <td>告警次数</td>
                        <td>{{item.total}}</td>
                </tr>
                <tr class="row2">
                    <td>最后发生时间</td>
                    <td>{{item.lastoccurtime}}</td>
                    <td>监控类别</td>
                    <td>{{item.type}}</td>
                    <td>运行状态</td>
                    <td style="background: red">严重</td>
                </tr>
                <tr class="row2">
                    <td>故障影响</td>
                    <td colspan="5">{{item.plan}}</td> 
                </tr>
                <tr class="row2">
                    <td>故障处理</td> 
                    <td colspan="5">{{item.remark}}</td> 
                </tr>                              
            </table>
            <h4 class="buttons"><span v-if="operate.alarm==1" @click="confirm_fn(item.sysId,item.EVENTID)">告警确认</span><span v-if="operate.order==1">分派工单</span></h4>
        </div>
        <!--分派 -->
            <div class="model" id="model" ref="model">
                    <div class="model_content">
                        <p><span>添加系统</span><i  @click="close_fn"></i></p>
                        <div class="content">
                            <input placeholder="输入关键字进行过滤" v-model="filterText" class="input1"></input>
                                <el-tree
                                class="filter-tree"
                                ref="tree"
                                :data="data"
                                :show-checkbox="true"
                                node-key="id"
                                :default-expanded-keys="['root01']"
                                :props="defaultProps"
                                :check-on-click-node="true"
                                :filter-node-method="filterNode"
                                >
                            </el-tree>
                        </div>
                        <p>
                        <span @click="addtree_fn()" class="btn">确定</span>
                        <span @click="close_fn" class="btn">取消</span>
                        </p>
                    </div>
        </div>
        <!-- 分派 -->
    </div>
</template>
      
      <script>
      
        export default {
          name:'',
          props:[''],
          data () {
            return {
                normal:true,
                AbnormalData:[],
                operate:{},

                dialogTableVisible:false,

                data:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                filterText:"",
                checkbox:[],
            };
          },
          watch:{
            filterText(val) {
                this.$refs.tree.filter(val);        
            },
          },
          components: {},
      
          computed:{

          },
      

        created() {
            this.operate=JSON.parse(sessionStorage["operate"]);
            console.log(this.operate)
            let ip = sessionStorage["TopIp"];
            let id = sessionStorage["TopId"];
            this.getData(ip,id);
        },
        methods:{
            //获取页面数据
            getData(ip,id){
                let param = {ip:ip,sysId:id};
                this.$http.axiospost("/duty/queryTaskListByIp",param).then((res)=>{
                    if(res.data.length!=0){
                        if(res.data[0].monitorStatus=="yes"){
                            this.normal=true;
                            this.AbnormalData=res.data;
                        }else{
                            this.normal=false;
                            this.AbnormalData=res.data;
                        }
                    }else{
                        console.log("无数据")
                    }
                })
            },
            //确认告警
            confirm_fn(id,eventid){
              let  param={id:id,eventId:eventid}
              this.$http.axiospost("/duty/ackAlert",param).then((res)=>{
                  if(res.data){
                      this.$message({massage:"确认告警成功",type:"success"});
                  }else{
                    this.$message.error({massage:"确认告警成失败"});
                  }
              }) 
            },
            addtree_fn(){

            },
            close_fn(){

            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
        },
      
      
        }
      
      </script>
      <style lang='scss' scoped>
        #system_details{
            color:#ffffff;
            margin:25px;
        }
        .httpdetails{
            padding: 20px 30px;
            margin: 10px 0px;
            background: #101526;
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
          left: 15px;
        }
        table{
            width: 100%;
            margin-top:20px;
            border-collapse: collapse;
            th{
                height: 35px;
              line-height: 35px;
              padding: 0 15px;
              border:1px solid #3c4567;
              text-align:left;
            }
            td{
              height: 45px;
              line-height: 45px;
              padding: 0 15px;
              border:1px solid #3c4567;
            }
      
        }
        .row1{
            background: #272e48
        }
        /* //偶数 */
        .row2 :nth-child(even){    
            color:#abbae4;
        }
        /* //奇数 */
        .row2 :nth-child(odd){
            background: #1d2437;
            text-align: right;
            width: 185px;;
        }
        .buttons{
            text-align: center;
            span{
                padding: 10px 20px;
                display: inline-block;
                background: #272e48;
                margin: 10px 20px;
                border-radius:5px;
                cursor: pointer;
                color:#9eaacb;
            }

        }
        .buttons span:hover{
            color:#ffffff;
        }
        /*编辑模态框阴影*/
        .model{
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

          .model_content>p>i{
              cursor: pointer;
              width:20px;
              height: 20px;
              background: url("../../image/close2.png"); 
              float:right;
              margin-top: 10px;
              margin-right: 20px;
          }
          .content{
              height: 300px;
              overflow: auto;
          }
          .delitem{
            background: #101526;
            padding:10px;
          }
          @-webkit-keyframes zoom{
            from {-webkit-transform: scale(0)}
            to {-webkit-transform: scale(1)}
          }
          @keyframes zoom{
            from {transform: scale(0)}
            to {transform: scale(1)}
          }

       
        
      </style>
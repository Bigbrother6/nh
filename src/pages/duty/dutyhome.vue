<template>
  <div id="dutyhome">
    <header>
        <div class="logo"></div>
        <div class="dutyname">值班监控</div>
        <div class="topright">
            <span class="role">欢迎你：{{user}}</span>
            <span class="time">{{date}}</span>
        </div>
    </header>
    <div v-for="item in dutylist" 
        class="d1 clearfix" 
        :style="{width:item.width+'px',height:item.height+'px'}">
        <p class="title"><i></i><span>{{item.name}}</span>
          <!-- 删除 -->
          <em  @click="deltree(item.id)"></em>
          <!-- 添加 -->
          <b @click="open_fn(item.id)"></b>
         <!-- 保存 -->
          <b @click="Save_fn(item,$event)" class="save"></b>
        </p>
        <div class="temp1" v-for="items in item.data">
            <i @click="jump(items)" class="zhiban1"></i>
            <p>{{items.abbreviation}}</p>
        </div>
    </div>
    <!-- 模套框1-->
    <div class="model" id="model" ref="model">
              <div class="model_content">
                  <p><span>添加系统</span><i  @click="CloseAdd_fn"></i></p>
                  <input placeholder="输入关键字进行过滤" v-model="filterText" class="input1"></input>
                  <div class="content">
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
                          @check-change="AddChange"
                          >
                        </el-tree>
                   </div>
                   <p class="model_bottom">
                     <span @click="SaveAdd_fn()" class="btn">确定</span>
                     <span @click="CloseAdd_fn" class="btn">取消</span>
                    </p>
              </div>
    </div>

    <!-- <div class="model" id="model2" ref="model2">
        <div class="model_content">
            <p><span>删除系统</span><i  @click="CloseDel_fn"></i></p>
            <div class="content">
                <el-checkbox-group v-model="Deldata_Id" @change="DelChange">
                    <p v-for="item in Deldata" class="delitem"><el-checkbox :label="item.systemId" :key="item.systemId">{{item.sysName}}</el-checkbox></p>
                </el-checkbox-group>
            </div>
             <p class="model_bottom">
               <span @click="SaveDel_fn()" class="btn">确定</span>
               <span @click="CloseDel_fn" class="btn">取消</span>
              </p>
        </div> -->
     <!-- 模套框1-->
      <div class="model" id="mode2" ref="model2">
          <div class="model_content">
                <p><span>删除系统</span><i  @click="CloseDel_fn"></i></p>
                <input placeholder="输入关键字进行过滤" v-model="filterText2" class="input1"></input>
                <div class="content">
                        <el-tree
                        class="filter-tree"
                        ref="tree2"
                        :data="Deldata"
                        :show-checkbox="true"
                        node-key="id"
                        :default-expanded-keys="['root01']"
                        :props="defaultProps2"
                        :check-on-click-node="true"
                        :filter-node-method="filterNode2"
                        @check-change="DelChange"
                        >
                      </el-tree>
                </div>
                <p class="model_bottom">
                  <span @click="SaveDel_fn()" class="btn">确定</span>
                  <span @click="CloseDel_fn" class="btn">取消</span>
                  </p>
          </div>
        </div>       
    </div>    
  </div>
</template>
  
  <script>
  import $ from 'jquery'
  import 'jquery-ui/ui/widgets/resizable'
    export default {
      name:'',
      data () {
        return {
          date:"",   //日期
          user:"",   //
          queryid:"",
          dutylist:[],
          
          //添加
          data: [],
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          filterText:"",
          itemid:"",
          checkbox:[],
    
    
          //新删除
          defaultProps2: {children: 'children',label: 'label'},
          Deldata:[],//展示数据
          chenkbox2:[],//选中要删除的
          Deldata_Fid:"",//要删除的子模板id
          filterText2:"",

        };
      },
      watch:{
        filterText(val) {
          this.$refs.tree.filter(val);        
        },
        filterText2(val) {
          this.$refs.tree2.filter(val);        
        },
        '$route' (to, from){
          this.$router.go(0);
        },
      },
      components: {
        
      },
  
      computed: {},
  
      created() {
        
          let id = sessionStorage["TempId"];
          this.queryid=id;
          console.log(this.queryid)
          this.getUser();
          this.getTemp_fn(id);
          this.getDate();

      },
      mounted() {  
          this.down();	
      },
      updated() {
        this.down();
      },
      methods: {
          getUser(){
            let param={};
            this.$http.get("/home/getCurrentUser",param).then((res)=>{  
                this.user=res.msg;
            })
          },
          down(){
              $( ".d1").resizable();
          },
          //打开添加框
          open_fn(id){
              this.itemid=id;
              this.filterText="";
              this.getTree_fn(this.itemid)
              this.$refs.model.style="display:block";    
          },
          CloseAdd_fn(){
              this.$refs.model.style="display:none";
          },
          AddChange(data){
            this.checkbox =this.$refs.tree.getCheckedKeys();
            console.log(this.checkbox)
          },

        // 获取模板
        getTemp_fn(id){
          let param={id:id};
          this.$http.get("/duty/getDutyTemplateModuleModel",param).then((res)=>{
              this.dutylist=res.data;
          })
        },
        //获取树形数据
        getTree_fn(id){
          let param={moduleId:id};
          this.$http.get("/duty/getSystemTree",param).then((res)=>{
              this.data=res.data;
          })
        },
        //添加
        SaveAdd_fn(){
          let param = {itemId:this.itemid,sysIds:this.checkbox};
          console.log(param)
          this.$http.axiospost("/duty/addSysToTemplateItem",param).then((res)=>{
              if(res.data){
                this.$message({message: '恭喜你，添加成功',type: 'success'});
                this.getTemp_fn(this.queryid);
                this.CloseAdd_fn();
              }else{
                this.$message.error('错了哦，添加失败');
              }
          })
        },
        jump(val){
          let param = {sysId:val.systemId};
          console.log(param)
          this.$http.get("/department/getTaskBySysId",param).then((res)=>{
              if(res.data.taskNum>0){
                sessionStorage["DepId"]=val.systemId;
                sessionStorage['showlist']=0;
                this.$router.push({
                  path:"/system_details",
                })
              }else{
                this.$message.error('还未添加系统');
              }
          })
        },

        //过滤
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },

        //打开删除框
        deltree(id){
          this.filterText2="";
          this.$refs.model2.style="display:block";
          console.log(id);
          this.Deldata_Fid=id; 
          let param={moduleId:id};
          this.$http.get("/duty/getSystemTreeDelete",param).then((res)=>{
              this.Deldata=res.data;
          })
        },
        filterNode2(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },

        //选择删除
        DelChange(){
          this.chenkbox2 = this.$refs.tree2.getCheckedKeys();
          console.log(this.chenkbox2);
        },
        //确认删除
        SaveDel_fn(){
          let param = {itemId:this.Deldata_Fid,sysIds:this.chenkbox2};
          console.log(param)
          this.$http.axiospost("/duty/removeSystemFromMoudle",param).then((res)=>{
              if(res.data){
                this.$message({message: '恭喜你，删除成功',type: 'success'});
                this.getTemp_fn(this.queryid);
                this.CloseDel_fn();
              }else{
                this.$message.error('错了哦，删除失败');
              }
          })            
        },

        //取消删除
        CloseDel_fn(){
          this.$refs.model2.style="display:none";
        },
        Save_fn(item,event){
            console.log(item);
            let w=$(event.target).parents(".d1").width();
            let h=$(event.target).parents(".d1").height();
            let param = {
                height:h,
                width:w,
                name:item.name,
                id:item.id,
                templateId:item.templateId
            };
            console.log(param)
            this.$http.axiospost("/configure/updateTemplateModuleModel",param).then((res)=>{
                if(res.data){
                  this.$message({message: '保存成功',type: 'success'});
                }else{
                  this.$message.error('保存错误');
                }
            })
        },
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
            this.date=time
            console.log(this.Date)
          },
      },
  
  
    }
  
  </script>
  <style lang='scss' scoped>
      #dutyhome{
          color:#ffffff;
          overflow: auto;
         
          header{
            text-align:center;
            height: 75px;
            background:#2E354F;
            .logo{
              float: left;
              width: 280px;
              height: 75px;
              background: url("../../image/logo.png") no-repeat 20px 10px;
           }
           .dutyname{
              width: 100px;
              height: 75px;
              display: inline-block;
              margin: 0 auto;
              font-size: 23px;
              line-height: 75px;
           }
           .topright{
              float: right;
              font-size: 18px;
              margin-right: 50px;
              height: 75px;
              line-height: 75px;
           }
           .role{
             margin-right:100px;
           }
          }

          .d1{
              overflow-y: auto;
              overflow-x: hidden;
              background: #101526;
              margin:10px;
              float: left;
              width: 900px;
              height: 420px;
              min-width: 310px;
              .temp1{
                  text-align: center;
                  float: left;
                  padding: 20px;
                  margin: 20px;
                  .zhiban1{
                      display: inline-block;
                     width: 68px;height: 73px;
                     background:url("../../image/zhiban1.png") 
                  }
              }
          }
          .title{
              font-size: 20px;
              padding-left: 10px;
              height: 55px;
              b{
                 float: right;
                  width: 38px;
                  height: 38px;
                  cursor: pointer;
                  background: url("../../image/new.png");
                  position: relative;
                  top:10px;
                  right: 22px;
              }
              em{
                  float:right;
                  height: 38px;
                  width: 38px;
                  cursor: pointer;
                  background: url("../../image/close.png");
                  position: relative;
                  top:10px;
                  right: 10px;
              }
              .save{
                  float:right;
                  height: 38px;
                  width: 38px;
                  cursor: pointer;
                  background: url("../../image/save.png");
                  position: relative;
                  top:10px;
                  right: 35px;
              }
              i{
                display: inline-block;
                width: 24px;
                height: 24px;
                background: url("../../image/plane.png");
                position: relative;
                top:10px;
              }
              span{
                position: relative;
                top: 4px;
                margin-left: 10px;
              }
          }

  
          .input1{
            background: #0b0715;
            height: 30px;
            width: 97%;
            padding: 0 10px;
            border: #0c2a4c;
            color: #ffffff;
            margin: 10px 0;
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
          width: 680px;
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
          .model_bottom{
            text-align: right;
            margin: 10px 20px;
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
              background: #101526;
              overflow: auto;
          }
          .delitem{
           
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
      }    
  </style>
  <style>
    #dutyhome .el-tree{
      background: #101526;
    }
    #dutyhone .el-input{
        width: 300px;
    }

 .el-tree-node:focus>.el-tree-node__content {
        background-color: #101526;
    }
 .el-tree-node__content:hover {
        background-color:#101526;
    }

  </style>
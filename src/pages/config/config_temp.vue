<template>
  <div id="temp">
      <div class="left">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="right" v-if="show">
          <p><span @click="addTemp_fn()">添加</span><span @click="getTemp_fn()">刷新</span></p>
          <table>
            <tr>
           
              <th width="40%">模版名称</th>
              <th width="40%">模版描述</th>
              <th width="20%">操作</th>
            </tr>
            <tr v-for="(item,index) in tempdata">
          
              <td>{{item.name}}</td>
              <td>{{item.desc}}</td>
              <td>
                <span @click="UpdataTemp_fn(item)" class="update">更新</span>
                <span @click="delTemp_fn(item.id)" class="delete">删除</span>
              </td>
            </tr>
            <tr v-if="tempdata.length==0">
              <td colspan="4">没有数据</td>
            </tr>
          </table>
      </div>
      <div class="right" v-else>
          <p><span @click="addTempChild_fn()">添加</span><span @click="getTempChild_fn(TempId)">刷新</span></p>
          <table>
            <tr>
   
              <th width="30%">模块名称</th>
              <th width="20%">模块宽度</th>
              <th width="20%">模块高度</th>
              <th width="30%">操作</th>
            </tr>
            <tr v-for="item in templist">
      
              <td>{{item.name}}</td>
              <td>{{item.width}}</td>
              <td>{{item.height}}</td>
              <td>
                <span @click="UpdataTempChild_fn(item)" class="update">更新</span>
                <span @click="delChildTemp_fn(item.id)" class="delete">删除</span>
              </td>
            </tr>
            <tr v-if="templist.length==0">
              <td colspan="5">没有数据</td>
            </tr>
          </table>
      </div>
    

    <el-dialog title="添加模板分类" 
      :visible.sync="dialogTableVisible" 
      width="400px" 
      :close-on-click-modal="false" 
      >
      <div class="tempmodal">
        <div><span>模板名称</span><input type="text" v-model="tempName"></div>
        <div><span class="desc">模板描述</span><textarea name="" id="" cols="30" rows="4" v-model="tempDesc"></textarea></div>
        <div class="tcenter">
          <span class="btn" @click="confirmAdd_fn()">提交</span>
          <span class="btn" @click="quxiaoAdd_fn()">取消</span>
        </div>

      </div>
    </el-dialog>
    <el-dialog title="添加子模板" 
    :visible.sync="dialogTableVisible2" 
    width="400px" 
    :close-on-click-modal="false" 
    >
    <div class="tempmodal">
      <div><span>模板名称</span><input type="text" v-model="ChildName"></div>
      <div>
        <span class="desc2">宽度</span><input type="text" v-model="ChildW" style="width:85px" oninput = "value=value.replace(/[^\d]/g,'')">px
        <span class="desc2">高度</span><input type="text" v-model="ChildH" style="width:85px" oninput = "value=value.replace(/[^\d]/g,'')">px
      </div>
      <div class="tcenter">
        <span class="btn"  @click="confirmAddChild_fn()">提交</span>
        <span class="btn" @click="quxiaoChildAdd_fn()">取消</span>
      </div>
    </div>
  </el-dialog>
  </div>
</template>

<script>

  export default {
    name:'',
    props:[''],
    data () {
      return {
        show:true,
        data: [{name: '模板分类',id:0,children:[]}],
        defaultProps: {children: 'children',label: 'name'},
        tempdata:"",
        dialogTableVisible:false,
        tempName:"",
        tempDesc:"",
        tempState:"",  //0是add 1是updata
        tree:"",

        templist:[],   //子模板列表
        dialogTableVisible2:false,
        ChildName:"",
        ChildH:"",
        ChildW:"",
        ChildId:"",
        ChildState:"", //0是add 1是updata
        TempId:"",   //当前模板id  更新子模板时 和父模板

      };
    },

    components: {},

    computed: {},

    beforeMount() {},
    created(){
      this.getTemp_fn();
    },
    mounted() {
      let w =window.innerWidth+"px";
      let h = window.innerHeight+"px";
      console.log(w);
      console.log(h)
    },
    watch:{
        tempdata:{
          handler(newValue,oldValue){
            console.log(666)
              console.log(news);
                console.log(old);
          },
          deep:true 
        },
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
        if(data.id==0){
         this.show=true;
        }else{
          this.show=false;
          this.tree=data;
          this.TempId=data.id;
          this.getTempChild_fn(data.id);
        }
      },
      // 获取模板
      getTemp_fn(){
        
        let param={};
        let url="/configure/getTemplateModel?time="+new Date().getTime();
        this.$http.get(url).then((res)=>{
            this.data[0].children=res.data;
            this.tempdata=res.data;

            console.log(this.tempdata);
        })
      },
      //获取子模板
      getTempChild_fn(id){
        let param={id:id};
        this.$http.get("/configure/getTemplateModuleModel?time="+new Date().getTime(),param).then((res)=>{
            if(res.data.length!=0){
              this.templist=res.data;
            }else{
              this.templist=res.data;
              console.log("无数据")
            }
          
        })
      },
      addTemp_fn(){
        this.dialogTableVisible = true; 
        this.tempState=0;
        this.tempDesc="";
        this.tempName="";
      },
      addTempChild_fn(){
        this.dialogTableVisible2 = true; 
        this.ChildName=null;
        this.ChildH=null;
        this.ChildW=null;
      },
      // 确认添加模板分类
      confirmAdd_fn(){
        if(this.tempState==0){ //添加
          let param = {};
          param.id = null;
          param.name=this.tempName;
          param.desc = this.tempDesc;
          if(this.tempName==""){
            this.$message.error('请填写模板名称');
            return false;
          }
          this.$http.axiospost("/configure/addTemplateModel",param).then((res)=>{
              if(res.data){
                // this.tempdata=[];
                console.log(this.tempdata)
                this.$message({message: '恭喜你，操作成功',type: 'success'});
                this.getTemp_fn();
                
                this.dialogTableVisible = false;
              }else{
                this.$message.error('错了哦，添加失败');
              }
          })          
        }else{ //更新
          let param = {
            desc:this.tempDesc,
            id:this.tempId,
            name:this.tempName
          };
          if(this.tempName==""){
            this.$message.error('请填写模板名称');
            return false;
          }
          this.$http.axiospost("/configure/updateTemplateModel",param).then((res)=>{
              if(res.data){
                this.$message({message: '恭喜你，更新成功',type: 'success'});
                this.getTemp_fn()
                this.dialogTableVisible = false;
              }else{
                this.$message.error('错了哦，添加失败');
              }
          })          
        }

      },
     //确认添加子模版、
     confirmAddChild_fn(){  
       
       if(this.ChildState==0){  //添加
          let param = {
            height:this.ChildH,
            width:this.ChildW,
            templateId:this.tree.id,
            name:this.ChildName
          };
          if(this.ChildName=="" || this.ChildName==null){
            this.$message.error('请填写模板名称');
              return false
          }
          if(this.ChildH=="" || this.ChildH==null){
            this.$message.error('请填写模板高度');
              return false
          }
          if(this.ChildW=="" || this.ChildW==null){
            this.$message.error('请填写模板宽度');
              return false
          }

          console.log(param)
          this.$http.axiospost("/configure/addTemplateModuleModel",param).then((res)=>{
              if(res.data){
                this.$message({message: '恭喜你，添加成功',type: 'success'});
                this.getTempChild_fn(this.tree.id)
                this.dialogTableVisible2 = false;
              }else{
                this.$message.error('错了哦，添加失败');
              }
          })
       }else{  //更新
        let param = {
            height:this.ChildH,
            width:this.ChildW,
            name:this.ChildName,
            id:this.ChildId,
            templateId:this.TempId
          };
          console.log(param)
          this.$http.axiospost("/configure/updateTemplateModuleModel",param).then((res)=>{
              if(res.data){
                this.$message({message: '恭喜你，添加成功',type: 'success'});
                this.getTempChild_fn(this.tree.id)
                this.dialogTableVisible2 = false;
              }else{
                this.$message.error('错了哦，添加失败');
              }
          })
       }

     },
      //删除当前模板
      delTemp_fn(id){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids =[];
          ids.push(id)
          let param=JSON.stringify(ids);
          console.log(param)
          this.$http.axiospost("/configure/deleteTemplateModel",param).then((res)=>{
              if(res.data){
                this.$message({message: '恭喜你，删除成功',type: 'success'});
                this.getTemp_fn()
              }else{
                this.$message.error('错了哦，删除失败');
              }
          }).catch(e=>{
            this.$message.error('接口报错');
          });
        }).catch(() => {

        });

      },
      ////删除当前子模板
      delChildTemp_fn(id){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids =[];
          ids.push(id)
          let param=JSON.stringify(ids);
          this.$http.axiospost("/configure/deleteTemplateModuleModel",param).then((res)=>{
              if(res.data){
                this.$message({message: '恭喜你，删除成功',type: 'success'});  
                this.getTempChild_fn(this.tree.id)
                this.dialogTableVisible2 = false;
              }else{
                this.$message.error('错了哦，删除失败');
              }
          }).catch(e=>{
            this.$message.error('接口报错');
          });
        }).catch(() => {
         
        });

      },
      quxiaoAdd_fn(){
        this.tempDesc="";
        this.tempName="";
        this.dialogTableVisible=false;
      },
      quxiaoChildAdd_fn(){
        this.ChildName=null;
        this.ChildH=null;
        this.ChildW=null;
        this.dialogTableVisible2=false;
      },
      //更新模板分类
      UpdataTemp_fn(item){
        this.dialogTableVisible = true; 
        this.tempState=1;
        this.tempName=item.name;
        this.tempDesc=item.desc;
        this.tempId=item.id;
        

      },
      //更新子模板
      UpdataTempChild_fn(item){
        console.log(item)
        this.dialogTableVisible2 = true;
        this.ChildState=1;
        this.ChildH=item.height;
        this.ChildW=item.width;
        this.ChildName=item.name;
        this.ChildId=item.id;       
      },

  
    },

    watch: {}

  }

</script>
<style lang='scss' scoped>
  $bg-color: #101526;
  #temp{
    padding: 20px;
    /* min-height: 540px; */
    height: calc(100% - 80px);
    display:flex;
    flex-direction:row;
  }
  .left{
    width: 250px;
    padding: 10px 5px;
    background:$bg-color;
    overflow: hidden;
  }
  .right{
    width:100%;
    overflow: auto;
    background:$bg-color;
    margin-left:20px;
    >p{
        height: 60px;
        line-height: 60px;
        margin-left:20px;
        span{
          padding:5px 20px;
          background:#1d2437;
          margin-left:20px;
          cursor: pointer;
          color: #9eaacb;
          &:hover{
            color:#ffffff;
          }
        }

      }
   
  }

  .tempmodal{
   .desc{
     position: relative;
     top:-22px;
   }
   .desc2{
     margin-left:25px;
   }
   .btn{
     background: #101526;
   }
    >div{
      margin-top:15px;
    }
    span{
      margin-right:10px;
    }
    input{
      height: 35px;
      background: #0b1126;
      border: 1px solid #3b4661;
      width: 250px;
      box-sizing: border-box;
      color: #fff;
      padding-left: 5px;
      margin-right: 3px;
      outline:none;
    }
    textarea{
      background: #0b1126;
      border: 1px solid #3b4661;
      width: 250px;
      box-sizing: border-box;
      color: #fff;
      padding-left: 5px;
      font-size: 14px;
      outline:none;
      resize:none;
      overflow: auto;
    }
    input:focus
      { 
        
      }
  }
  table{
      color: #ffffff;
      width: 100%;
      border-collapse: collapse;
      background: #101526;
      border:1px solid #262d43;
      th{
        height: 40px;
        line-height: 40px;
        background:#262d43;
      }
      td{
       padding:15px 0px;
        text-align: center;
      }
      tr:nth-child(odd) > td {
	      background:#1d2437;
      }
  
  }
  .update{
      color: green;
      margin:0 10px;
      cursor: pointer;
  }
  .delete{
    color: red;
    margin:0 10px;
    cursor: pointer;
  }
</style>
<style>
    #temp .el-tree-node__label{
      white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    }
    #temp .el-dialog{
      background:#1b2032;
    }
    #temp .el-dialog__title{
      color: #9eaacb;
      font-size:16px;
    }

    #temp .el-dialog__body{
      padding:15px;
      color: #9eaacb;
    }

    #temp .el-tree{
        background: #101526;
        color:#ffffff;
        font-size: 15px;
      }
    #temp .el-tree-node:focus>.el-tree-node__content {
        background-color: #101526;
    }
    #temp .el-tree-node__content:hover {
        background-color:#101526;
    }


    #temp .el-tree-node__content:hover{
      background: #111d30;
    }
    #temp .el-tree-node is-current is-focusable{
      background: #111d30;
    }
    #temp .el-tree-node__content{
      background: #111d30;
    }

    .el-message-box{
      /* background: #111d30;
      border:none; */
    }
</style>
<template>
  <div id="duty">
    <div id="d1" v-for="item in dutylist" class="d1">
        <p class="title"><i></i><span>{{item.name}}</span><em></em><b @click="open_fn(item.id)"></b></p>
        <div class="temp1" v-for="items in item.data">
            <i class="zhiban1"></i>
            <p>{{items.sysName}}</p>
        </div>
    </div>
 

    <!-- 模套框-->
    <div class="" id="model" ref="model">
        <div class="model_content">
            <p><span>告警详情</span><i  @click="close_fn"></i></p>
            <div class="content">
                    <el-tree
                    ref="tree"
                    :data="datas"
                    :show-checkbox="true"
                    node-key="id"
                    :props="defaultProps"
                    :check-on-click-node="true"
                    @check-change="ff"
                    >
                  </el-tree>
             </div>
             <p><span @click="add()">确定</span></p>
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
        dutylist:[],
        datas: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        itemid:"",
        checkbox:[],
      };
    },
    watch:{
      '$route' (to, from){
        this.$router.go(0);
      }
    },
    components: {
      
    },

    computed: {},

    beforeMount() {},
    created() {
        let id = this.$route.query.id;
        let name = this.$route.query.name;
        this.getTemp_fn(id);
    },
    mounted() {  
	    this.down();	
    },
    updated() {
      this.down();
    },
    methods: {
        down(){
            $( ".d1").resizable();
        },
        open_fn(id){
            this.itemid=id;
            this.getTree_fn(this.itemid)
            this.$refs.model.style="display:block";    
        },
        close_fn(){
            this.$refs.model.style="display:none";
        },
        ff(data){
          console.log(data);
          this.checkbox =this.$refs.tree.getCheckedKeys();
          console.log(this.checkbox);
        },
      // 获取模板
      getTemp_fn(id){
        let param={id:id};
        this.$http.get("/duty/getDutyTemplateModuleModel",param).then((res)=>{
            this.dutylist=res.data;
        })
      },
      //
      getTree_fn(id){
        let param={itemId:id};
        this.$http.get("/duty/getSystemTree",param).then((res)=>{
            this.datas=res.data;
        })
      },
      //添加
      add(){
      //  JSON.stringify()
        let param = {
          itemId:this.itemid,
          sysIds:this.checkbox
        // sysIds:JSON.stringify(this.checkbox)
        };

        // var formdata=new FormData();
        // formdata.append("itemid",this.itemid);
        // formdata.append(this.checkbox)
      
        console.log(param)
        this.$http.axiospost("/duty/addSysToTemplateItem",param).then((res)=>{
            if(res.data){
              this.$message({message: '恭喜你，添加成功',type: 'success'});
             
            }else{
              this.$message.error('错了哦，添加失败');
            }
        })
     
      }

    },

    watch: {}

  }

</script>
<style lang='scss' scoped>
    #duty{
        color:#ffffff;
        overflow: auto;
        border: 1px solid #ddd;
        >div{
            overflow: hidden;
            border:1px solid #ddd;
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
                background: url("../../image/new.png");
                position: relative;
                top:10px;
                right: 22px;
            }
            em{
                float:right;
                height: 38px;
                width: 38px;
                background: url("../../image/close.png");
                position: relative;
                top:10px;
                right: 10px;
            }
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
            background: url("../../image/close2.png"); 
            float:right;
            margin-top: 10px;
            margin-right: 20px;
        }
        .content{
            height: 300px;
            overflow: auto;
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
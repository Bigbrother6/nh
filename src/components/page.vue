<template>
  <div id="page">
    <el-pagination
      background
      layout="prev, pager, next,total"
      @current-change="page_fn"
      :current-page="pageNum"
      :total="pageTotal"
      :page-size="10"
      >
    
    </el-pagination>
  </div>

</template>

<script>
    export default {
      props:{
        pageTotal:{}
      },
      name: "page",
      components: {

      },
      data(){
          return {
            pageNum:1,
            aa:"总数"
          }
      },
      methods:{
          page_fn(val){
            this.$emit("pagefn",{pageNum:val});
          }

      }
    }
</script>

<style scoped lang="scss">
    #page{
      text-align: center;
    }

</style>
<style>
  #page .el-pagination{font-weight:normal !important;}
  #page .el-pagination.is-background .el-pager li:not(.disabled).active{
    color: #48ffff!important;
    background: #103050!important;
  }
  #page .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, 
  #page .el-pagination.is-background .el-pager li{
    background: #0a183c !important;
    border: 1px solid #ddd!important;
    color: #ddd!important;
  }
  #page .el-pagination__total{
    color: #ddd;
    margin-left:10px;
  }
  #page .el-pagination__total:after{
    content:"数据"
  }
</style>
<template>
  <div id="monit">
      <iframe :src="path" id="ifrname" :style={height:screenHeight,width:screenWidth}></iframe>
  </div>
</template>

<script>

  export default {
    name:'',
    props:[''],
    data () {
      return {
          path:"",
          screenWidth:"",
          screenHeight:"",
        
      };
    },

    components: {},

    computed: {

    },

    beforeMount(){},
    created() {
     this.path=window.g.MonitorDev_url;
     console.log(this.path)
    },  
    mounted(){
      this.screenWidth =window.innerWidth+"px";
      this.screenHeight = window.innerHeight-100+"px";
      window.onresize = () => {
        return (() => {
          this.screenWidth =  window.innerWidth+"px";
          this.screenHeight = window.innerHeight-100+"px";
          console.log(this.screenWidth)
          console.log(this.screenHeight)
        })();
      };
    },

    methods:{

    },

  }

</script>
<style lang='scss' scoped>
 
   #ifrname{
    width: 100%;
     height: 100%;
   }
</style>

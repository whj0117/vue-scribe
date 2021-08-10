<template>
  <div id="app">
    <div class="scribe-wrap">
      <scribe :options="options"></scribe>
    </div>
  </div>
</template>

<script>

import scribe from "./components/scribe";
export default {
  name: 'App',
  components: {scribe},
  data(){
    return{
      options:{
        text:'这是一段文本',
        lineColor:'#000',
        lineWidth:1,
        btnBgColor:'rgba(0,0,0,.6)',
        btnColor:'#fff',
        btnSize:16
      }
    }
  }
}
</script>
<style scoped>
.scribe-wrap{
  width: 500px;
  margin: 100px auto;
}
</style>

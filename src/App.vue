<template>
  <div id="app">
    <scribe :options="options"></scribe>
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
        btnTextColor:'#fff',
        btnTextSize:16
      }
    }
  }
}
</script>
<style>
</style>

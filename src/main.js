// import Vue from 'vue'
// import App from './App.vue'
import scribe from './components/scribe'

// Vue.config.productionTip = false

scribe.install = Vue => Vue.component(scribe.name,scribe)

if(typeof window !== 'undefined' && window.Vue){
  install(window.Vue)
}

export default scribe
//
// new Vue({
//   render: h => h(App),
// }).$mount('#app')

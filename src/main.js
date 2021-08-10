import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

App.install = (vue) => vue.component(App.name,App)

new Vue({
  render: h => h(App),
}).$mount('#app')

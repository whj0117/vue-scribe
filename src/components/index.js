import scribe from "./scribe.vue";
import _Vue from 'vue'

scribe.install = Vue => {
    if (!Vue) {
        window.Vue = Vue = _Vue
    }
    Vue.component(scribe.name,scribe)
}

export default scribe

import scribe from "./scribe.vue";

scribe.install = Vue => Vue.component(scribe.name,scribe)

if(typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
}

export default scribe

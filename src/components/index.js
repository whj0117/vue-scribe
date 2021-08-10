import scribe from "./scribe";

scribe.install = Vue => Vue.component(scribe.name,scribe)

if(typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
}

export default scribe

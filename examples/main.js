import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import TagTextarea from '../packages/index'
Vue.use(TagTextarea)

new Vue({
  render: h => h(App),
}).$mount('#app')

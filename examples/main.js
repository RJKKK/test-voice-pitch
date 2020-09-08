import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import TestVoicePitch from './packages/index'
Vue.use(TestVoicePitch)

new Vue({
  render: h => h(App),
}).$mount('#app')

// packages/textarea/index.js

// 导入组件，组件必须声明 name
import TestVoicePitch from './main.vue'

// 为组件添加 install 方法，用于按需引入
TestVoicePitch.install = function (Vue) {
    Vue.component(TestVoicePitch.name, TestVoicePitch)
}

export default TestVoicePitch

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/base.css';
import 'assets/fonts/iconfont.css';
import Axios from "axios";
import echarts from "echarts";

Vue.config.productionTip = false;
Vue.use(Element);
// Axios.defaults.baseURL = 'http://127.0.0.1:9000/';
Vue.prototype.$http = Axios;
Vue.prototype.$echarts = echarts;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

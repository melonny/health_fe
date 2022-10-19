import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = "http://localhost:9000"
axios.interceptors.request.use(
  config=>{
    if(sessionStorage.getItem("token")){
      config.headers.Authorization = sessionStorage.getItem("token");
    }
    return config;
  },
  err=>{
    return Promise.reject(err);
  }
)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

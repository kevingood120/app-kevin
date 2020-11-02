import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import LoginView from '@/views/LoginView.vue'

import "@babel/polyfill";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import '@/plugins/veevalidate'

import CustomTextField from './components/CustomTextField.vue'
import MoneyTextField from './components/MoneyTextField.vue'
import VueTheMask from 'vue-the-mask'

Vue.filter('format-date',(value: string) => {
  return new Date(value).toLocaleString()
})

Vue.filter('currency', (value: string) => {
  return parseFloat(value).toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL' });
})

Vue.use(VueTheMask)
Vue.component('custom-text-field', CustomTextField)
Vue.component('money-text-field',MoneyTextField)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

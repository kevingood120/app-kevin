import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import "@babel/polyfill";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import '@/plugins/veevalidate'

import CustomTextField from './components/CustomTextField.vue'
import VueTheMask from 'vue-the-mask'

Vue.directive('money', {
  inserted(el: any, binding, vnode, oldNode) {
    el.addEventListener('input', (ev: any) => {
      const newValue = ev.target.value
                .replace(/\D/g, "")
                .replace(/(\d)(\d{2})$/, '$1,$2')
                .replace(/(?=(\d{3})+(\D))\B/g, '.')
      ev.target.value = newValue
    })
  }
})


Vue.use(VueTheMask)
Vue.component('custom-text-field', CustomTextField)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

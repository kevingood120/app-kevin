import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import CustomerView from '@/views/CustomerView.vue'
import ProductView from '@/views/ProductView.vue'
import AddressView from '@/views/AddressView.vue'
import TaskView from '@/views/TaskView.vue'

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/customer',
    component: CustomerView
  },
  {
    path: '/product',
    component: ProductView
  },
  {
    path: '/address',
    component: AddressView
  },
  {
    component: TaskView,
    path: '/task'
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

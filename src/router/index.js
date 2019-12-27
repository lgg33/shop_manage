import Vue from 'vue'
import VueRouter from 'vue-router';
import Login from "components/Login";
import Home from "components/Home";
import CategoryList from "components/CategoryList";
import Welcome from 'components/Welcome'
import ProductList from "components/ProductList";
import OrderList from "components/OrderList";
import BaoBiao from "components/BaoBiao";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        redirect: 'welcome'
      },
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: '/categoryList',
        component: CategoryList
      },
      {
        path: '/productList',
        component: ProductList
      },
      {
        path: '/orderList',
        component: OrderList
      },
      {
        path: '/baobiao',
        component: BaoBiao
      }
    ]
  },
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from , next) => {
  if (to.path === '/login') {
    next();
  }
  const tokenStr = window.sessionStorage.getItem('name');
  if(!tokenStr){
    return next('/login');
  }
  next();
});

export default router

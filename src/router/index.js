import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    component: () => import('../views/LoginMenu.vue')
  },
  {
    path: '/dashboard',
    component: () => import('../views/DashBoard.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/ProductsItem.vue')
      },
      {
        path: 'order',
        component: () => import('../views/OrderList.vue')
      },
      {
        path: 'coupon',
        component: () => import('../views/CouponsList')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('../views/UserBoard'),
    children: [
      {
        path: 'cart',
        component: () => import('../views/UserCart')
      },
      {
        path: 'product/:productId',
        component: () => import('../views/UserProduct')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

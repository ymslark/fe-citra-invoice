import { h } from 'vue'

// 👉 Redirects
const redirects = [
  {
    path: '/',
    name: 'index',
    meta: {
      middleware: () => ({ name: 'admin-login' }),
    },
    component: h('div'),
  },
  {
    path: '/admin/CF',
    name: 'admin-CF',
    redirect: () => ({ name: 'admin-CF' }),
  },
  {
    path: '/pages/user-profile',
    name: 'pages-user-profile',
    redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
  },
  {
    path: '/pages/account-settings',
    name: 'pages-account-settings',
    redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    redirect: () => ({name: '404'}),
  },
]

// 👉 Routes
const routes = [
  // {
  //   path: '/admin/CF/',
  //   name: 'admin-CF',
  //   component: () => import('@/pages/admin/CF/index.vue'),
  //   meta: { requiresAuth: true },
  // },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/pages/admin/login.vue'),
    meta: { public: true },
  },
  {
    path: '/apps/ecommerce/dashboard',
    name: 'apps-ecommerce-dashboard',
    component: () => import('@/pages/dashboards/ecommerce.vue'),
  },
  {
    path: '/dashboards/academy',
    name: 'dashboards-academy',
    component: () => import('@/pages/apps/academy/dashboard.vue'),
  },
  {
    path: '/dashboards/logistics',
    name: 'dashboards-logistics',
    component: () => import('@/pages/apps/logistics/dashboard.vue'),
  },
  //  {"name":"apps-ecommerce-dashboard","params":{}}

]

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default {
  routes: scannedRoutes => [
    ...redirects,
    ...routes,
    ...scannedRoutes,
  ],
}

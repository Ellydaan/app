import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/components/auth/LoginScreen.vue'
import Register from '@/components/auth/RegisterScreen.vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
import ChartManager from '@/components/ChartManager/ChartManager.vue'
import ProfileLayout from '@/components/User/ProfileLayout.vue'
import TeamsList from '@/components/GeneralManager/TeamsList.vue';

// Store that holds the JWT token
import store from '@/stores/index';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
    {
      path: '/',
      name: 'root',
      redirect: { name: 'login' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/dashboard/:userId',
      component: DashboardLayout,
      meta: { requiresAuth: true, },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: ChartManager,
        },
        {
          path: '/profile',
          name: 'profile',
          component: ProfileLayout
        },
        {
          path: '/teams',
          name: 'teams',
          component: TeamsList
        },
        {
          path: '/user/',
          name: 'user',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/UserView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Authentication
  const isAuthenticated = store.getters.isAuthenticated;
  // Authorization
  const userRole = store.getters.userRole; 

  const isUser =  userRole === 'user';
  const isManager = userRole === 'manager';
  const isAdmin = userRole === 'admin';
  const isSuperAdmin = userRole === 'super_admin';

  const routeRequiresAuth = to.meta.requiresAuth;
  const routeRequiresAdmin = to.meta.requiresAdmin;

  if (routeRequiresAuth && !isAuthenticated) {
    next({ name: 'login' }); 
  } else if (routeRequiresAdmin && !isAdmin) {
    next({ name: 'home' });
  } else {
    next();   
  }
});

export default router;

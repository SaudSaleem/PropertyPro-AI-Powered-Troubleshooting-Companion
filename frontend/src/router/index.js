import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/Chat.vue';
import LoginView from '../views/Login.vue';
import SignUpView from '../views/SignUp.vue';
import NotFound from '../views/NotFound.vue'; // Import the NotFound component

const routes = [
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'SignUpView',
    component: SignUpView
  },
  {
    path: '/',
    name: 'ChatView',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  // Add a wildcard route for unmatched routes
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  try {
    const isAuthenticated = localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } catch (error) {
    console.error('Navigation error:', error);
    next('/login');
  }
});

// Error handler
router.onError((error) => {
  console.error('Router error:', error);
  router.push('/login');
});

export default router;

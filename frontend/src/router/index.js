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
    path: '/chat',
    name: 'ChatView',
    component: ChatView
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

export default router;

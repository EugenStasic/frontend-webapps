import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '@/views/WelcomePage.vue';
import UserLogin from '@/views/UserLogin.vue';
import UserRegistration from '@/views/UserRegistration.vue';
import HomeLoggedIn from '@/views/HomeLoggedIn.vue'; 

const routes = [
    {
      path: '/',
      name: 'welcome',
      component: WelcomePage
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/register',
      name: 'register',
      component: UserRegistration
    },
    {
      path: '/home',
      name: 'home',
      component: HomeLoggedIn
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '@/views/WelcomePage.vue';
import UserLogin from '@/views/UserLogin.vue';
import UserRegistration from '@/views/UserRegistration.vue';
import HomeLoggedIn from '@/views/HomeLoggedIn.vue'; 
import MyBoats from '@/views/MyBoats.vue'
import BoatRegistration from '@/views/BoatRegistration.vue'
import BoatEdit from '@/views/BoatEdit.vue'
import SearchResults from '@/views/SearchResults.vue'

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
    },
    {
      path: '/register-boat',
      name: 'register-boat',
      component: BoatRegistration
    },
    {
      path: '/my-boats',
      name: 'my-boats',
      component: MyBoats
    },
    {
      path: '/edit-boat/:id',
      component: BoatEdit,
      props: true
    },
    {
      path: '/search',
      name: 'search-results',
      component: SearchResults
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

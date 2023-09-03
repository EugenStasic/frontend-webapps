import { createRouter, createWebHistory } from 'vue-router';
import { checkAuth } from '@/services/authService';
import WelcomePage from '@/views/WelcomePage.vue';
import UserLogin from '@/views/UserLogin.vue';
import UserRegistration from '@/views/UserRegistration.vue';
import HomeLoggedIn from '@/views/HomeLoggedIn.vue'; 
import MyBoats from '@/views/MyBoats.vue'
import BoatRegistration from '@/views/BoatRegistration.vue'
import BoatEdit from '@/views/BoatEdit.vue'
import SearchResults from '@/views/SearchResults.vue'
import BoatAd from '@/views/BoatAd.vue';
import MyBookings from '@/views/MyBookings.vue';

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
    },
    {
      path: '/boat-ad/:id',
      name: 'BoatAd',
      component: BoatAd,
      props: true 
    },
    {
      path: "/my-bookings",
      name: "my-bookings",
      component: MyBookings
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, _, next) => {
  const unprotectedRoutes = ['welcome', 'search-results', 'BoatAd', 'register', 'login'];
  const isUnprotected = unprotectedRoutes.includes(to.name);

  if (isUnprotected) {
    next();
    return;
  }

  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    next({ name: 'login' });
    return;
  }

  next();
});

export default router;

<template>
  <div class="nav-bar">
    <router-link :to="loggedIn ? '/home' : '/'">HOME</router-link>
    | <SearchBar />
    <div v-if="loggedIn">
      | <DropdownMenu />
      | <a @click="logout">Odjava</a>
    </div>
    <span v-else>
      | <router-link to="/login">PRIJAVA</router-link>
      | <router-link to="/register">REGISTRACIJA</router-link>
    </span>
  </div>
</template>

<script>
import DropdownMenu from './DropdownMenu.vue';
import SearchBar from './SearchBar.vue';
import { checkAuth, logout } from '@/services/authService';

export default {
  components: {
    DropdownMenu,
    SearchBar
  },
  data() {
    return {
      loggedIn: false,
      firstLoad: true
    };
  },
  watch: {
    '$route': async function(to) {
      const unprotectedRoutes = ['welcome', 'search-results', 'BoatAd', 'register', 'login'];
      const isUnprotected = unprotectedRoutes.includes(to.name);
      if (to.name === 'home' || (!this.firstLoad && !isUnprotected)) {
        await this.checkLoginStatus();
      }
    }
  },
  mounted() {
    this.firstLoad = false;
  },
  methods: {
    async checkLoginStatus() {
      try {
        this.loggedIn = await checkAuth();
        if (this.loggedIn && (this.$route.path === '/login' || this.$route.path === '/register')) {
          this.$router.push("/home");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    },
    async logout() {
      try {
        await logout();
        this.loggedIn = false;
        this.$router.push("/");
      } catch (error) {
        console.error("Error logging out!", error);
      }
    }
  }
}
</script>

<style scoped>
.nav-bar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #eee;
}
.nav-bar a, .nav-bar span {
  margin: 0 5px;  
}
.dropdown:hover .dropdown-content {
  display: block;
}
</style>

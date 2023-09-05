<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="nav-section">
      <div class="left-nav-items">
        <router-link :to="loggedIn ? '/home' : '/'" class="navbar-brand">Rent a Boat Adriatic</router-link>
        <SearchBar />
      </div>
      <div v-if="loggedIn" class="right-nav-items">
        <DropdownMenu />
        <a @click="logout" class="nav-link">Odjava</a>
      </div>
      <div v-else class="right-nav-items">
        <router-link to="/login" class="nav-link">Prijava</router-link>
        <router-link to="/register" class="nav-link">Registracija</router-link>
      </div>
    </div>
  </nav>
</template>



<style scoped>
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.navbar-nav {
  display: flex;
  gap: 1rem;
}
/* your existing styles */
</style>

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
.navbar {
  display: flex;
  justify-content: space-between;
}
.nav-section {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.left-nav-items, .right-nav-items {
  display: flex;
  align-items: center;
}
.nav-link {
  margin: 0 15px;  /* This adds space to the left and right of each nav link */
  font-size: 1.2em;  /* This increases the font size */
}
</style>

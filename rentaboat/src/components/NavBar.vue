<template>
  <div class="nav-bar">
    <router-link to="/">HOME</router-link>
    <div v-if="loggedIn">
      | <router-link to="/home">PROFIL</router-link>
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

import DropdownMenu from './DropdownMenu.vue'

export default {
  components: {
    DropdownMenu
  },
  data() {
    return {
      loggedIn: false
    };
  },
  watch: {
    '$route': 'checkLoginStatus'
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    async checkLoginStatus() {
      try {
        const response = await fetch("http://localhost:3000/users/checkAuth", {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        this.loggedIn = data.isAuthenticated;
        if (this.loggedIn && (this.$route.path === '/login' || this.$route.path === '/register')) {
          this.$router.push("/home");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    },
    async logout() {
      try {
        await fetch("http://localhost:3000/users/logout", {
          method: "GET",
          credentials: "include"
        });
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
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  z-index: 1;
}
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
<template>
  <div class="nav-bar">
    <router-link to="/">HOME</router-link>
    <span v-if="loggedIn">
      | <router-link to="/home">PROFIL</router-link>
      | <a @click="logout">Odjava</a>
    </span>
    <span v-else>
      | <router-link to="/login">PRIJAVA</router-link>
      | <router-link to="/register">REGISTRACIJA</router-link>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggedIn: false
    };
  },
  watch: {
    // Provjerava status prijave kada se ruta promijeni
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
        if (this.loggedIn) {
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
</style>

<template>
  <div class="nav-item dropdown" ref="dropdownMenu"
        @mouseenter="openDropdown"
        @mouseleave="closeDropdown">
    <a class="nav-link dropdown-toggle"
       id="navbarDropdown"
       role="button"
       aria-haspopup="true"
       :aria-expanded="dropdownOpen">PROFIL</a>
    <div class="dropdown-menu" :class="{ show: dropdownOpen }" aria-labelledby="navbarDropdown">
      <router-link to="/register-boat" class="dropdown-item">Prijavi plovilo</router-link>
      <router-link to="/my-boats" class="dropdown-item">Moja Plovila</router-link>
      <router-link to="/my-bookings" class="dropdown-item">Moje Rezervacije</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownMenu',
  data() {
    return {
      dropdownOpen: false
    };
  },
  methods: {
    openDropdown() {
      this.dropdownOpen = true;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    }
  }
}
</script>

<style scoped>
.dropdown-menu.show {
  display: block;
}
</style>
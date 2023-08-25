<template>
    <div class="dropdown">
      <span>Moje Opcije</span>
      <div class="dropdown-content">
        <router-link to="/register-boat">Prijavi plovilo</router-link> |
        <router-link to="/my-boats">Moja Plovila</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DropdownMenu'
  }
  </script>
  
  <style scoped>
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
  
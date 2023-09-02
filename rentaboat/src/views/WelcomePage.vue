<template>
  <div>
    <h1>Dobrodošli u Rent A Boat Adriatic</h1>
    <p>
      Uplovite u svijet jedinstvenih doživljaja i otkrijte ljepote Jadranske obale. 
      Naša flota brodova nudi vam neograničene mogućnosti za istraživanje i uživanje.
    </p>
    <p>
      Da biste započeli svoju pustolovinu, <router-link to="/register">kreirajte račun</router-link> ili se
      <router-link to="/login">prijavite</router-link> kako biste pronašli savršen brod i započeli svoju avanturu.
    </p>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage'
}
</script>
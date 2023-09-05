<template>
  <div class="welcome-container">
    <div class="heading">
      <h1>Rent A Boat Adriatic</h1>
    </div>
    <div class="catchphrase-block">
      <p>
        Uplovite u svijet jedinstvenih doživljaja i otkrijte ljepote Jadranske obale.
      </p>
       <p>
        Naša flota brodova nudi vam neograničene mogućnosti za istraživanje i uživanje
      </p>
    </div>
    <div class="prompt-block">
      <p>
        Da biste započeli svoju pustolovinu,
        <router-link to="/register"><strong>kreirajte račun</strong></router-link> ili se
        <router-link to="/login"><strong>prijavite</strong></router-link> kako biste pronašli savršen brod i započeli svoju avanturu.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage'
}
</script>

<style scoped>
  .welcome-container {
    background: url('@/assets/homebackground2.jpg') no-repeat center center fixed;
    background-size: cover;
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-top: 50px;
  }

  .heading {
    text-align: left;
    font-size: 72px !important;
    font-family: 'Georgia, serif';
    color: #ffffff;
    margin-left: 5%;
  }

  .catchphrase-block {
    text-align: left;
    font-family: 'Georgia, serif';
    color: #ffffff;
    font-size: 28px;
    margin-top: 20px;
    margin-left: 50%;
  }

  .prompt-block {
    background-color: rgba(173, 216, 230, 0.7);
    color: #000000;
    font-family: 'Georgia, serif';
    font-size: 22px;
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    margin: auto;
    width: 30%;
  }

  p {
    margin: 0;
    padding: 0;
  }

  router-link {
    font-weight: bold;
    color: #007bff;
  }
</style>

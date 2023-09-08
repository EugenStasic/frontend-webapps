<template>
  <div class="welcome-container">
    <section class="heading">
      <h1>Rent A Boat Adriatic</h1>
    </section>
    <section class="catchphrase-block">
      <p>Uplovite u svijet jedinstvenih doživljaja i otkrijte ljepote Jadranske obale.</p>
      <p>Naša flota brodova nudi vam neograničene mogućnosti za istraživanje i uživanje</p>
    </section>
    <section class="prompt-block">
      <p>
        Da biste započeli svoju pustolovinu,
        <router-link to="/register"><strong>kreirajte račun</strong></router-link> ili se
        <router-link to="/login"><strong>prijavite</strong></router-link> kako biste pronašli savršen brod i započeli svoju avanturu.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage'
}
</script>

<style scoped>
  .welcome-container {
    height: 90vh;
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: url('@/assets/homebackground2.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  .heading {
    font-family: 'Georgia, serif';
    font-size: 72px;
    color: #ffffff;
    text-align: left;
    margin-left: 5%;
  }

  .catchphrase-block {
    font-family: 'Georgia, serif';
    font-size: 28px;
    color: #ffffff;
    text-align: left;
    margin-top: 20px;
    margin-left: 50%;
  }

  .prompt-block {
    width: 30%;
    padding: 20px;
    margin: auto;
    font-family: 'Georgia, serif';
    font-size: 22px;
    color: #000000;
    text-align: center;
    background-color: rgba(173, 216, 230, 0.7);
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  p {
    margin: 0;
    padding: 0;
  }

  router-link {
    color: #007bff;
    font-weight: bold;
  }
</style>
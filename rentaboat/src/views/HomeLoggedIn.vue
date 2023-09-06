<template>
  <div class="welcome-container">
    <div class="heading">
      <h1>Dobrodošli u Rent A Boat Adriatic, {{ userName }}!</h1>
    </div>
    <div class="paragraph-block catchphrase-block">
      <p>
        Zadovoljstvo nam je što ste se odlučili za našu platformu za najam brodova.
      </p>
      <p>
        Ako ste zainteresirani za pronalaženje savršenog broda za svoju sljedeću pustolovinu,
        koristite našu <router-link to="/search"><strong>tražilicu</strong></router-link>.
      </p>
      <p>
        Ako želite zaraditi dodatno i podijeliti ljepote Jadrana s drugima,
        <router-link to="/register-boat"><strong>registirajte svoj brod</strong></router-link>.
      </p>
    </div>
  </div>
</template>

<script>
import config from '../config.js';
export default {
  data() {
    return {
      userName: 'Guest'
    };
  },
  async mounted() {
    try {
      const response = await fetch(config.baseUrl + '/users/me', {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      if (data && data.ime) {
        this.userName = data.ime;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
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
    font-size: 72px;
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

  .prompt-block, .paragraph-block {
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
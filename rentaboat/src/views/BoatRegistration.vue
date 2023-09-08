<template>
  <div class="container">
    <h1 class="header-login">Prijavi plovilo</h1>
    <form @submit.prevent="registerBoat" enctype="multipart/form-data" class="border-form">
      <div class="form-group">
        <label for="ime">Ime plovila:</label>
        <input type="text" class="form-control" id="ime" v-model="ime" placeholder="Ime plovila" required>
      </div>

      <div class="form-group">
        <label for="tip">Tip plovila:</label>
        <select class="form-control" id="tip" v-model="tip" required>
          <option value="" disabled>Izaberite tip plovila</option>
          <option value="Gliser">Gliser</option>
          <option value="Gumenjak">Gumenjak</option>
          <option value="Jedrilica">Jedrilica</option>
          <option value="Katamaran">Katamaran</option>
          <option value="Luksuzna Jahta">Luksuzna Jahta</option>
        </select>
      </div>

      <div class="form-group">
        <label for="snagaMotora">Snaga motora:</label>
        <input type="text" class="form-control" id="snagaMotora" v-model="snagaMotora" placeholder="Snaga motora" required>
      </div>

      <div class="form-group">
        <label for="duljinaPlovila">Duljina plovila:</label>
        <input type="text" class="form-control" id="duljinaPlovila" v-model="duljinaPlovila" placeholder="Duljina plovila" required>
      </div>

      <div class="form-group">
        <label for="cijenaPlovila">Cijena plovila:</label>
        <input type="text" class="form-control" id="cijenaPlovila" v-model="cijenaPlovila" placeholder="Cijena plovila" required>
      </div>

      <div class="form-group">
        <label for="lokacijaPlovila">Lokacija plovila:</label>
        <input type="text" class="form-control" id="lokacijaPlovila" v-model="lokacijaPlovila" placeholder="Lokacija plovila" required>
      </div>

      
      <div class="form-group">
        <label for="lokacijaPlovila">Kontakt:</label>
        <input type="text" class="form-control" id="lokacijaPlovila" v-model="ownerContact" placeholder="Email/Broj" required>
      </div>

      <div class="form-group">
        <label for="opis">Opis plovila:</label>
        <textarea class="form-control" id="opis" v-model="opis" placeholder="Opis plovila" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label for="slikePlovila" class="custom-label">Učitajte slike plovila:</label>
        <input id="slikePlovila" type="file" class="form-control" ref="slikePlovila" multiple accept=".jpg, .jpeg, .png" />
      </div>

      <button type="submit" class="btn btn-primary">Registriraj Plovilo</button>
    </form>
    <p v-if="message" class="mt-3">{{ message }}</p>
    <div class="empty"></div>
  </div>
</template>

  
  <script>
  import config from '../config.js';
  
  export default {
  data() {
    return {
      ime: "",
      tip: "",
      snagaMotora: "",
      duljinaPlovila: "",
      cijenaPlovila: "",
      lokacijaPlovila: "",
      ownerContact: "",
      opis: "",
      message: ""
    };
    },
    methods: {
      async registerBoat() {
        try {
        const formData = new FormData();
        formData.append('ime', this.ime);
        formData.append('tip', this.tip);
        formData.append('snagaMotora', this.snagaMotora);
        formData.append('duljinaPlovila', this.duljinaPlovila);
        formData.append('cijenaPlovila', this.cijenaPlovila);
        formData.append('lokacijaPlovila', this.lokacijaPlovila);
        formData.append('ownerContact', this.ownerContact);
        formData.append('opis', this.opis);
        const files = this.$refs.slikePlovila.files;
        for(let i = 0; i < files.length; i++) {
            formData.append('slikePlovila', files[i]);
        }
          const response = await fetch(config.baseUrl + '/boats/create', {
            method: "POST",
            body: formData,
            credentials: "include"
          });
          const data = await response.json();
          this.message = data.message;
          if (data._id) {
            this.$router.push("/my-boats");
          }
        } catch (error) {
          this.message = "Error registering boat!";
        }
      }
    }
  };
  </script>

<style scoped>
.container {
    max-width: 600px;
    margin: auto;
  }
.empty{
  margin-bottom: 1em;
}
.header-login {
  margin-top: 1em;
  font-family: 'Arial', sans-serif;
  font-size: 2em;
  margin-bottom: 1em;
}
.form-control{
  text-align: center;
  width: 80%;
  margin: auto;
    margin-bottom: 1rem;
}
.border-form {
    border-radius: 5px;
    width: 100%;
    margin: auto;
    background-color: #ffffff;
  }

  button {
    margin-bottom: 5%;
  }

</style>
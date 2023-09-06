<template>
  <div class="container mt-3">
    <h1 class="header-login">Prijavi plovilo</h1>
    <form @submit.prevent="registerBoat" enctype="multipart/form-data" class="border-form">
      <div class="form-group mb-3">
        <label for="ime" class="custom-label">Ime plovila:</label>
        <input id="ime" type="text" class="form-control" v-model="ime" placeholder="Ime plovila" required />
      </div>
      <div class="form-group mb-3">
        <label for="tip" class="custom-label">Tip plovila:</label>
        <select id="tip" class="form-control" v-model="tip" required>
          <option value="" disabled>Izaberite tip plovila</option>
          <option value="Gliser">Gliser</option>
          <option value="Gumenjak">Gumenjak</option>
          <option value="Jedrilica">Jedrilica</option>
          <option value="Katamaran">Katamaran</option>
          <option value="Luksuzna Jahta">Luksuzna Jahta</option>
        </select>
      </div>
      <div class="form-group mb-3">
        <label for="snagaMotora" class="custom-label">Snaga motora:</label>
        <input id="snagaMotora" type="number" class="form-control" v-model="snagaMotora" placeholder="Snaga motora" required />
      </div>
      <div class="form-group mb-3">
        <label for="duljinaPlovila" class="custom-label">Duljina plovila:</label>
        <input id="duljinaPlovila" type="number" class="form-control" v-model="duljinaPlovila" placeholder="Duljina plovila" required />
      </div>
      <div class="form-group mb-3">
        <label for="cijenaPlovila" class="custom-label">Cijena plovila:</label>
        <input id="cijenaPlovila" type="number" class="form-control" v-model="cijenaPlovila" placeholder="Cijena plovila" required />
      </div>
      <div class="form-group mb-3">
        <label for="lokacijaPlovila" class="custom-label">Lokacija plovila:</label>
        <input id="lokacijaPlovila" type="text" class="form-control" v-model="lokacijaPlovila" placeholder="Lokacija plovila" required />
      </div>
      <div class="form-group mb-3">
        <label for="ownerContact" class="custom-label">Kontakt vlasnika:</label>
        <input id="ownerContact" type="text" class="form-control" v-model="ownerContact" placeholder="Email/Broj mobitela" required />
      </div>
      <div class="form-group mb-3">
        <label for="opis" class="custom-label">Opis plovila:</label>
        <textarea id="opis" class="form-control" v-model="opis" placeholder="Opis plovila" required></textarea>
      </div>
      <div class="form-group mb-3">
        <label for="slikePlovila" class="custom-label">Učitajte slike plovila:</label>
        <input id="slikePlovila" type="file" class="form-control-file" ref="slikePlovila" multiple accept=".jpg, .jpeg, .png" />
      </div>
      <button type="submit" class="btn btn-primary">Registriraj Plovilo</button>
    </form>
    <p v-if="message" class="mt-3">{{ message }}</p>
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
.header-login {
  font-family: 'Arial', sans-serif;
  font-size: 2em;
}
.form-control{
  width: 50%;
  margin: auto;
  text-align: center;
}
.custom-label {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
}
.border-form {
    border-radius: 5px;
    width: 60%;
    margin: auto;
  }

</style>
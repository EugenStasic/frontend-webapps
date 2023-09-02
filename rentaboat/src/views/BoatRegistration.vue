<template>
  <div>
    <h1>Prijavi plovilo</h1>
    <form @submit.prevent="registerBoat" enctype="multipart/form-data">
      <input type="text" v-model="ime" placeholder="Ime plovila" required />
        <select v-model="tip" required>
          <option value="" disabled>Izaberite tip plovila</option>
          <option value="Gliser">Gliser</option>
          <option value="Gumenjak">Gumenjak</option>
          <option value="Jedrilica">Jedrilica</option>
          <option value="Katamaran">Katamaran</option>
          <option value="Luksuzna Jahta">Luksuzna Jahta</option>
        </select>
      <input type="number" v-model="snagaMotora" placeholder="Snaga motora" required />
      <input type="float" v-model="duljinaPlovila" placeholder="Duljina plovila" required />
      <input type="number" v-model="cijenaPlovila" placeholder="Cijena plovila" required />
      <input type="text" v-model="lokacijaPlovila" placeholder="Lokacija plovila" required />
      <input type="text" v-model="ownerContact" placeholder="Kontakt vlasnika" required />
      <textarea v-model="opis" placeholder="Opis plovila" required></textarea>
      <input type="file" ref="slikePlovila" multiple accept=".jpg, .jpeg, .png" />
      <button type="submit">Registriraj Plovilo</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>
  
  <script>
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
          const response = await fetch("http://localhost:3000/boats/create", {
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
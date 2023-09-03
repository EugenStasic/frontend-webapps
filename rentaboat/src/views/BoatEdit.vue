<template>
  <div>
    <h2>Uredi podatke o plovilu:</h2>
    <form @submit.prevent="updateBoat">
      <label for="ime">Ime plovila:</label>
      <input id="ime" v-model="boat.ime" placeholder="Ime plovila" />

      <label for="tip">Tip plovila:</label>
        <select id="tip" v-model="boat.tip" required>
          <option value="" disabled>Izaberite tip plovila</option>
          <option value="Gliser">Gliser</option>
          <option value="Gumenjak">Gumenjak</option>
          <option value="Jedrilica">Jedrilica</option>
          <option value="Katamaran">Katamaran</option>
          <option value="Luksuzna Jahta">Luksuzna Jahta</option>
        </select>

      <label for="snagaMotora">Snaga motora:</label>
      <input id="snagaMotora" v-model="boat.snagaMotora" placeholder="Snaga motora" />

      <label for="duljinaPlovila">Duljina plovila:</label>
      <input id="duljinaPlovila" v-model="boat.duljinaPlovila" placeholder="Duljina plovila" />

      <label for="lokacijaPlovila">Lokacija plovila:</label>
      <input id="lokacijaPlovila" v-model="boat.lokacijaPlovila" placeholder="Lokacija plovila" />

      <label for="opis">Opis plovila:</label>
      <textarea id="opis" v-model="boat.opis" placeholder="Opis plovila" rows="4" cols="50"></textarea>

      <label for="cijenaPlovila">Cijena plovila:</label>
      <input id="cijenaPlovila" v-model="boat.cijenaPlovila" placeholder="Cijena plovila" />

      <button type="submit">Pohrani promjene</button>
    </form>

    <div>
      <h3>Dodaj slike</h3>
      <input type="file" ref="fileInput" multiple @change="addImages"/>
      <button @click="uploadImages">Pohrani</button>
    </div>

    <div>
      <h3>Učitane slike:</h3>
      <div v-for="(image, index) in boat.slikePlovila" :key="index">
        <img :src="getBoatImageUrl(image)" alt="" width="100" height="100"/>
        <button @click="removeImage(index)">Izbriši</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boat: {}
    };
  },
  methods: {
    async updateBoat(shouldRedirect = true) {
      try {
        const response = await fetch(`http://localhost:3000/boats/${this.$route.params.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.boat)
        });

        if (!response.ok) {
          throw new Error('Error updating the boat');
        }

        if (shouldRedirect) {
          this.$router.push('/my-boats');
        }
      } catch (error) {
        console.error('There was an error updating the boat:', error);
      }
    },
    getBoatImageUrl(imageName) {
      const adjustedName = imageName.substring(8);
      return `http://localhost:3000/boats/slike/${adjustedName}`;
    },
    async addImages() {
      const files = this.$refs.fileInput.files;
      let formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("slikePlovila", files[i]);
      }

      const response = await fetch(`http://localhost:3000/boats/${this.$route.params.id}/upload`, {
        method: "PATCH",
        credentials: "include",
        body: formData
      });

      const data = await response.json();
      this.boat = data;
    },
    async removeImage(index) {
      this.boat.slikePlovila.splice(index, 1);
      await this.updateBoat(false);
    }
  },
  async mounted() {
    try {
      const response = await fetch(`http://localhost:3000/boats/${this.$route.params.id}`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();
      this.boat = data;
    } catch (error) {
      console.error('There was an error fetching the boat details:', error);
    }
  }
}
</script>

<style scoped>
  h2, h3 {
    margin-bottom: 1em;
  }

  form {
    margin: 1em 0;
    max-width: 400px;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  label {
    font-weight: bold;
    margin-right: 0.5em;
    display: block;
    margin-bottom: 0.5em;
  }

  input, textarea {
    display: block;
    width: 100%;
    padding: 0.5em;
    margin-bottom: 1em;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  button {
    background-color: #007BFF;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  div {
    margin-bottom: 1em;
  }

  img {
    margin-right: 0.5em;
  }
</style>

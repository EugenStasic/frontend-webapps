<template>
  <div class="container">
    <h1 class="text-center">Uredi podatke o plovilu:</h1>
    <form @submit.prevent="updateBoat" class="border p-4 rounded">
      <div class="form-group">
        <label for="ime">Ime plovila:</label>
        <input type="text" class="form-control" id="ime" v-model="boat.ime" placeholder="Ime plovila" required>
      </div>

      <div class="form-group">
        <label for="tip">Tip plovila:</label>
        <select class="form-control" id="tip" v-model="boat.tip" required>
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
        <input type="text" class="form-control" id="snagaMotora" v-model="boat.snagaMotora" placeholder="Snaga motora" required>
      </div>

      <div class="form-group">
        <label for="duljinaPlovila">Duljina plovila:</label>
        <input type="text" class="form-control" id="duljinaPlovila" v-model="boat.duljinaPlovila" placeholder="Duljina plovila" required>
      </div>

      <div class="form-group">
        <label for="lokacijaPlovila">Lokacija plovila:</label>
        <input type="text" class="form-control" id="lokacijaPlovila" v-model="boat.lokacijaPlovila" placeholder="Lokacija plovila" required>
      </div>

      <div class="form-group">
        <label for="opis">Opis plovila:</label>
        <textarea class="form-control" id="opis" v-model="boat.opis" placeholder="Opis plovila" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label for="cijenaPlovila">Cijena plovila:</label>
        <input type="text" class="form-control" id="cijenaPlovila" v-model="boat.cijenaPlovila" placeholder="Cijena plovila" required>
      </div>

      <button type="submit" class="btn btn-primary">Pohrani promjene</button>
    </form>

    <div class="mt-4">
      <h3>Dodaj slike</h3>
      <input type="file" class="form-control-file" ref="fileInput" multiple @change="addImages"/>
      <button class="btn btn-secondary mt-2" @click="uploadImages">Pohrani</button>
    </div>

    <div class="mt-4">
      <h3>Učitane slike:</h3>
      <div v-for="(image, index) in boat.slikePlovila" :key="index">
        <img :src="getBoatImageUrl(image)" alt="" width="100" height="100"/>
        <button class="btn btn-danger" @click="removeImage(index)">Izbriši</button>
      </div>
    </div>

  </div>
</template>

<script>
import config from '../config.js';

export default {
  data() {
    return {
      boat: {}
    };
  },
  methods: {
    async updateBoat(shouldRedirect = true) {
      try {
        const response = await fetch(config.baseUrl + `/boats/${this.$route.params.id}`, {
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
      return config.baseUrl + `/boats/slike/${adjustedName}`;
    },
    async addImages() {
      const files = this.$refs.fileInput.files;
      let formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("slikePlovila", files[i]);
      }

      const response = await fetch(config.baseUrl + `/boats/${this.$route.params.id}/upload`, {
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
      const response = await fetch(config.baseUrl + `/boats/${this.$route.params.id}`, {
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
  h1 {
    margin-bottom: 1em;
  }

  .container {
    max-width: 600px;
    margin: auto;
  }

  form {
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    margin-top: 1em;
  }
</style>

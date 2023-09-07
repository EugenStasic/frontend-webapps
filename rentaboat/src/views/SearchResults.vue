<template>
  <div>
    <h1>Rezultati Pretrage</h1>
    <div class="layout-container">
      <div id="filter-bar" class="card">
        <div class="card-body">
          <h5 class="card-title">Filtriraj Plovila</h5>
          <input class="form-control" v-model="ime" placeholder="Ime plovila...">
          <select class="form-control" v-model="tip">
            <option value="">Svi tipovi</option>
            <option value="Gliser">Gliser</option>
            <option value="Gumenjak">Gumenjak</option>
            <option value="Jedrilica">Jedrilica</option>
            <option value="Katamaran">Katamaran</option>
            <option value="Luksuzna Jahta">Luksuzna Jahta</option>
          </select>
          <select class="form-control" v-model="lokacijaPlovila">
            <option value="">Sve Lokacije</option>
            <option v-for="location in uniqueLocations" :key="location">{{ location }}</option>
          </select>
          <label>Snaga motora:</label>
          <input type="range" class="form-control-range" v-model.number="snagaMotoraMax" :max="maxMotorPower" step="1">
          <p>{{ snagaMotoraMax }} HP</p>
          <label>Duljina plovila:</label>
          <input type="range" class="form-control-range" v-model.number="duljinaPlovilaMax" :max="maxBoatLength" step="0.1">
          <p>{{ duljinaPlovilaMax }} m</p>
          <button class="btn btn-primary" @click="getAllBoats">Filtriraj</button>
        </div>
      </div>

      <div class="boat-cards-container row">
        <div v-for="boat in boats" :key="boat._id" class="col-md-2 mb-3">
          <div class="card" :class="{ 'owner-card': boat.isOwner }">
            <router-link :to="`/boat-ad/${boat._id}`" class="boat-card-link">
              <div v-if="boat.isOwner" class="owner-label">Vaše Plovilo</div>
              <div v-if="!boat.isOwner" class="owner-label-placeholder"></div>
              <div class="image-container">
                <img v-if="boat.slikePlovila && boat.slikePlovila.length" :src="getBoatImageUrl(boat._id, 0)" alt="Slika plovila" class="card-img-top"/>
              </div>
              <div class="star-container">
                <span v-for="n in 5" :key="n">
                  <i :class="['fas fa-star', getStarClass(n, boat.averageRating)]"></i>
                </span>
              </div>
              <div class="card-body">
                <h5 class="card-title boat-name">{{ boat.ime }}</h5>
                <p class="card-text"><strong>Tip:</strong> {{ boat.tip }}</p>
                <p class="card-text"><strong>Duljina:</strong> {{ boat.duljinaPlovila }} m</p>
                <p class="card-text"><strong>Snaga:</strong> {{ boat.snagaMotora }} HP</p>
                <p class="card-text"><strong>Cijena:</strong> {{ boat.cijenaPlovila }},00€</p>
                <p class="card-text"><strong>Lokacija:</strong> {{ boat.lokacijaPlovila }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import config from '../config.js';

export default {
  data() {
    return {
      boats: [],
      ime: '',
      tip: '',
      lokacijaPlovila: '',
      uniqueLocations: [],
      snagaMotoraMax: 600,
      duljinaPlovilaMax: 50,
      maxMotorPower: 600,
      maxBoatLength: 50,
      userId: null,
    }
  },
  async mounted() {
    try {
    const currentUserResponse = await fetch(config.baseUrl+'/users/me', { credentials: "include" });
    const currentUser = await currentUserResponse.json();
    this.userId = currentUser._id;
  } catch(error) {
    this.userId = null;
  }
    await this.getAllBoats();
    await this.fetchUniqueLocations();
    await this.fetchMaxMotorPower();
    await this.fetchMaxBoatLength();
  },
  methods: {
    async getAllBoats() {
  try {
    let url = new URL(config.baseUrl+"/search/boats");

    if (this.ime) url.searchParams.append('ime', this.ime);
    if (this.tip) url.searchParams.append('tip', this.tip);
    if (this.lokacijaPlovila) url.searchParams.append('lokacijaPlovila', this.lokacijaPlovila);
    if (this.snagaMotoraMax) url.searchParams.append('snagaMotoraMax', this.snagaMotoraMax);
    if (this.duljinaPlovilaMax) url.searchParams.append('duljinaPlovilaMax', this.duljinaPlovilaMax);

    const response = await fetch(url);
    if (response.status === 200) {
      const boatsData = await response.json();
      this.boats = boatsData.map(boat => {
        let avg = 0;
        if (boat.ocjene && boat.ocjene.length > 0) {
          const sum = boat.ocjene.reduce((a, b) => a + b, 0);
          avg = sum / boat.ocjene.length;
        }
        
        const isOwner = this.userId ? (boat.owner === this.userId) : false;
          return { ...boat, averageRating: avg, isOwner };
          });
        } else {
          console.error("Error retrieving boats:", await response.text());
            }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    getBoatImageUrl(boatId, imageIndex) {
      return this.boats.find(boat => boat._id === boatId).slikePlovila[imageIndex];
      },
    async fetchUniqueLocations() {
      try {
        const response = await fetch(config.baseUrl+"/search/unique-locations");
        this.uniqueLocations = await response.json();
      } catch (error) {
        console.error("Error fetching unique locations:", error);
      }
    },
    async fetchMaxMotorPower() {
      try {
        const response = await fetch(config.baseUrl+"/search/max-motor-power");
        const result = await response.json();
        this.maxMotorPower = result.snagaMotora;
      } catch (error) {
        console.error("Error fetching max motor power:", error);
      }
    },
    async fetchMaxBoatLength() {
      try {
        const response = await fetch(config.baseUrl+"/search/max-boat-length");
        const result = await response.json();
        this.maxBoatLength = result.duljinaPlovila;
      } catch (error) {
        console.error("Error fetching max boat length:", error);
      }
    },
    getStarClass(n, averageRating) {
      if (n <= Math.floor(averageRating)) {
        return 'text-warning';
      } else if (n === Math.ceil(averageRating) && averageRating % 1 !== 0) {
        return 'text-warning';
      } else {
        return 'text-secondary'; 
      }
    }
  }
}
</script>

<style scoped>
  .layout-container {
    display: flex;
    padding-top: 60px;
  }

  #filter-bar {
    position: fixed;
    left: 0;
    top: 60px;
    width: 200px;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 20px;
    border-right: 1px solid #ccc;
    overflow-y: auto;
  }

  .boat-cards-container {
    margin-left: 280px;
    display: flex;
    flex-wrap: wrap;
    flex: 0 0 auto;
    width: 90%;
    min-width: 80%;
    gap: 20px;
  }
  .boat-cards-container .col-md-2 {
  flex: 0 0 auto;
  width: 360px;
}
.owner-label-placeholder{
  height: 30px;
}


  .image-container {
    width: 100%;
    height: 200px;
    background-color: #f3f3f3;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .boat-card-link {
    text-decoration: none;
    color: black;
  }

  .owner-card {
  border: 4px solid gold;
}

.owner-label {
  color: gold;
  font-weight: bold;
}

  .boat-name,
  .card-text > strong {
    font-weight: bold;
  }
</style>

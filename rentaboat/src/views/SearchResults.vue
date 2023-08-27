<template>
  <div>
    <h1>Rezultati Pretrage</h1>
    <div class="layout-container">
      <div id="filter-bar">

        <input v-model="ime" placeholder="Ime plovila...">
  
        <select v-model="tip">
          <option value="">Svi tipovi</option>
          <option value="Gliser">Gliser</option>
          <option value="Gumenjak">Gumenjak</option>
          <option value="Jedrilica">Jedrilica</option>
        </select>
  

        <select v-model="lokacijaPlovila">
          <option value="">Sve Lokacije</option>
          <option v-for="location in uniqueLocations" :key="location">{{ location }}</option>
        </select>
  

        Snaga motora: <input type="range" v-model.number="snagaMotoraMax" :max="maxMotorPower" step="1">
        <p>{{ snagaMotoraMax }} HP</p>
  
   
        Duljina plovila: <input type="range" v-model.number="duljinaPlovilaMax" :max="maxBoatLength" step="0.1">
        <p>{{ duljinaPlovilaMax }} m</p>
  
        <button @click="getAllBoats">Filtriraj</button>
      </div>
  
      <div class="boat-cards-container">
        <div v-for="boat in boats" :key="boat._id" class="boat-card">
          <h3>{{ boat.ime }}</h3>
          <p>Duljina: {{ boat.duljinaPlovila }}</p>
          <p>Snaga: {{ boat.snagaMotora }}</p>
          <p>Lokacija: {{ boat.lokacijaPlovila }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        boats: [],
        ime: '',
        tip: '',
        lokacijaPlovila: '',
        uniqueLocations: [],
        snagaMotoraMax: 600, // početna vrijednost za slider
        duljinaPlovilaMax: 20, // početna vrijednost za slider
        maxMotorPower: 600, // max vrijednost za slider
        maxBoatLength: 20 // max vrijednost za slider
      }
    },
    async mounted() {
      await this.getAllBoats();
      await this.fetchUniqueLocations();
      await this.fetchMaxMotorPower();
      await this.fetchMaxBoatLength();
    },
    methods: {
    async getAllBoats() {
      try {
        let url = new URL("http://localhost:3000/search/boats");
        
        // Pass the filters to the URL as query parameters
        if (this.ime) url.searchParams.append('ime', this.ime);
        if (this.tip) url.searchParams.append('tip', this.tip);
        if (this.lokacijaPlovila) url.searchParams.append('lokacijaPlovila', this.lokacijaPlovila);
        if (this.snagaMotoraMax) url.searchParams.append('snagaMotoraMax', this.snagaMotoraMax);
        if (this.duljinaPlovilaMax) url.searchParams.append('duljinaPlovilaMax', this.duljinaPlovilaMax);
        
        const response = await fetch(url);
        if (response.status === 200) {
          this.boats = await response.json();
        } else {
          console.error("Error retrieving boats:", await response.text());
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async fetchUniqueLocations() {
      try {
        const response = await fetch("http://localhost:3000/search/unique-locations");
        this.uniqueLocations = await response.json();
      } catch (error) {
        console.error("Error fetching unique locations:", error);
      }
    },
    async fetchMaxMotorPower() {
      try {
        const response = await fetch("http://localhost:3000/search/max-motor-power");
        const result = await response.json();
        this.maxMotorPower = result.snagaMotora;
      } catch (error) {
        console.error("Error fetching max motor power:", error);
      }
    },
    async fetchMaxBoatLength() {
      try {
        const response = await fetch("http://localhost:3000/search/max-boat-length");
        const result = await response.json();
        this.maxBoatLength = result.duljinaPlovila;
      } catch (error) {
        console.error("Error fetching max boat length:", error);
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
  gap: 20px;
}

.boat-card {
  flex-basis: calc(25% - 20px); 
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 20px;
  min-width: 220px; 
}

</style>
  
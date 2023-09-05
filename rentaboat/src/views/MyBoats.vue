<template>
  <div class="container"></div>
  <div>
    <h1>Moja Plovila</h1>
    <div class="layout-container">
      
        

      <div class="boat-cards-container row">
        <div v-for="boat in boats" :key="boat._id" class="col-md-2 mb-3">
          <div class="card">
            <router-link :to="`/boat-ad/${boat._id}`" class="boat-card-link">
              <div class="image-container">
                <img v-if="boat.slikePlovila && boat.slikePlovila.length" :src="getBoatImageUrl(boat.slikePlovila[0])" alt="Slika plovila" class="card-img-top"/>
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
            <div class="card-footer">
              <button @click="editBoat(boat._id)" class="btn btn-warning mr-2">Uredi Oglas</button>
              <button @click="deleteBoat(boat._id)" class="btn btn-danger">Izbriši oglas</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script>
export default {
    data() {
        return {
            boats: []
        };
    },
    methods: {
      async deleteBoat(id) {
      if (window.confirm("Jeste li sigurni da želite izbrisati plovilo?")) {
        try {
          const response = await fetch(`http://localhost:3000/boats/${id}`, {
            method: "DELETE",
            credentials: "include"
          });
          if (!response.ok) {
            throw new Error('Error deleting the boat');
          }
          this.boats = this.boats.filter(boat => boat._id !== id);
        } catch (error) {
          console.error('There was an error deleting the boat:', error);
        }
      }
        },
        
        editBoat(id) {
        this.$router.push(`/edit-boat/${id}`);
        },

        getBoatImageUrl(imageName) {
    const adjustedName = imageName.substring(8);
    return `http://localhost:3000/boats/slike/${adjustedName}`;
}
    },
    async mounted() {
        try {
            const response = await fetch("http://localhost:3000/boats/me", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            this.boats = data;
        } catch (error) {
            console.error('There was an error fetching the boats:', error);
        }
    }
}
</script>
  

<style scoped>

.layout-container {
    display: flex;
    align-items: center; 
    padding-top: 60px;
    justify-content: center;
  }

  .boat-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    
  }
  .card {
  margin: 30px;
  min-width: 260px;
  max-width: 350px;
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

  .boat-name,
  .card-text > strong {
    font-weight: bold;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

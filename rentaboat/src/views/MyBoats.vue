<template>
    <div>
      <h1>Moja Plovila</h1>
      <div class="boat-cards-container">
        <div v-for="boat in boats" :key="boat._id" class="boat-card">
          <router-link :to="`/boat-ad/${boat._id}`" class="boat-card-link">
            <div class="image-container">
                <img v-if="boat.slikePlovila && boat.slikePlovila.length" :src="getBoatImageUrl(boat.slikePlovila[0])" alt="Slika plovila" class="boat-image"/>
            </div>
            <h3>{{ boat.ime }}</h3>
            <p>Tip: {{ boat.tip }}</p>
            <p>Duljina: {{ boat.duljinaPlovila }} m</p>
            <p>Snaga: {{ boat.snagaMotora }} kW</p>
            <p>Cijena: {{ boat.cijenaPlovila }} €</p>
            <p>Lokacija: {{ boat.lokacijaPlovila }}</p>
          </router-link>
          <button @click="editBoat(boat._id)" class="edit-button">Uredi Oglas</button>
          <button @click="deleteBoat(boat._id)" class="delete-button">Izbriši oglas</button>
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
.image-container {
  width: 100%;
  height: 200px;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.boat-image {
  max-width: 100%;
  max-height: 100%;
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

.edit-button {
    background-color: orange;
    border: none;
    padding: 5px 15px;
    margin-right: 5px;
    cursor: pointer;
}

.delete-button {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 15px;
    cursor: pointer;
}
</style>

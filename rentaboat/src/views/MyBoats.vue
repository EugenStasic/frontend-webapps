<template>
    <div>
      <h1>Moja Plovila</h1>
      <div v-for="boat in boats" :key="boat._id" class="boat-card">
        <h3>{{ boat.ime }}</h3>
        <p>Duljina: {{ boat.duljinaPlovila }}</p>
        <p>Snaga: {{ boat.snagaMotora }}</p>
        <p>Lokacija: {{ boat.lokacijaPlovila }}</p>
        <button @click="editBoat(boat._id)" class="edit-button">Uredi Oglas</button>
        <button @click="deleteBoat(boat._id)" class="delete-button">Izbriši oglas</button>
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
.boat-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
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

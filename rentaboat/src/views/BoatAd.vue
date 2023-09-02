<template>
  <div class="container">
    <div v-if="boat && Object.keys(boat).length > 0" class="boat-ad-container">
      <div class="image-container">
        <button @click="prevPhoto" :disabled="currentPhotoIndex === 0">←</button>
        <img 
          v-if="boat.slikePlovila && boat.slikePlovila.length"
          :src="getBoatImageUrl(boat.slikePlovila[currentPhotoIndex])" 
          alt="Slika plovila" 
          class="boat-image"
        />
        <div v-else>Nema slika za prikaz</div>
        <button @click="nextPhoto" :disabled="currentPhotoIndex === boat.slikePlovila.length - 1">→</button>
      </div>
      <h1>{{ boat.ime }}</h1>
      <div class="boat-specs">
        <h2>Specifikacije Plovila:</h2>
        <p><strong>Tip:</strong> {{ boat.tip }}</p>
        <p><strong>Snaga Motora:</strong> {{ boat.snagaMotora }} HP</p>
        <p><strong>Duljina Plovila:</strong> {{ boat.duljinaPlovila }} m</p>
        <p><strong>Cijena Plovila:</strong> {{ boat.cijenaPlovila }} €</p>
      </div>
      <div class="boat-description">
        <h2>Opis:</h2>
        <p>{{ boat.opis }}</p>
      </div>
    </div>
    <div v-else>...</div>
    <div v-if="userId !== boat.owner && boat && Object.keys(boat).length > 0" class="booking-form">
      <h2>Iznajmi Plovilo</h2>
      <label for="startDate">Početak:</label>
      <input 
        id="startDate" 
        type="date" 
        v-model="startDate" 
        :min="today" 
        :disabled="isDateUnavailable(startDate)"
      />
      <label for="endDate">Kraj:</label>
      <input 
        id="endDate" 
        type="date" 
        v-model="endDate" 
        :min="startDate || today" 
        :disabled="isDateUnavailable(startDate)"
      />
      <p>Cijena: {{ boatPrice }},00€</p>
      <textarea v-model="note" placeholder="Napomena"></textarea>
      <button @click="submitBooking">Potvrdi Booking</button>
      <p class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boat: {},
      currentPhotoIndex: 0,
      userId: null,
      startDate: null,
      endDate: null,
      note: "",
      unavailableDates: [],
      errorMessage: "",
      today: new Date().toISOString().split('T')[0]
    };
  },
  computed: {
    boatPrice() {
      if (!this.startDate || !this.endDate || !this.boat.cijenaPlovila) {
        return 0;
      }
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays * this.boat.cijenaPlovila;
    }
  },
  async mounted() {
    try {
      const id = this.$route.params.id;
      const response = await fetch(`http://localhost:3000/boats/${id}`);
      this.boat = await response.json();

      const currentUserResponse = await fetch('http://localhost:3000/users/me', {credentials: "include"});
      const currentUser = await currentUserResponse.json();
      this.userId = currentUser._id;

      const unavailableDatesResponse = await fetch(`http://localhost:3000/boats/${this.boat._id}/unavailable-dates`);
      this.unavailableDates = await unavailableDatesResponse.json();
      
      if (!this.boat || !this.boat.slikePlovila) {
        throw new Error("Boat data is not available");
      }
    } catch (error) {
      console.error("Error mounted:", error.message);
    }
  },
  methods: {
    getBoatImageUrl(imageName) {
      const adjustedName = imageName.substring(8);
      return `http://localhost:3000/boats/slike/${adjustedName}`;
    },
    nextPhoto() {
      if (this.currentPhotoIndex < this.boat.slikePlovila.length - 1) {
        this.currentPhotoIndex++;
      }
    },
    prevPhoto() {
      if (this.currentPhotoIndex > 0) {
        this.currentPhotoIndex--;
      }
    },
    async submitBooking() {
      const sendData = {
        boatId: this.boat._id,
        startDate: this.startDate,
        endDate: this.endDate,
        totalCost: this.boatPrice,
        note: this.note
      };
      const response = await fetch('http://localhost:3000/bookings/create', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sendData),
        credentials: 'include'
      });
      if (response.ok) {
        await response.json();
      } else if (response.status === 401) {
        this.errorMessage = "Da bi ste rezervirali plovilo morate imati korisnički račun";
      }
    },
    isDateUnavailable(date) {
      return this.unavailableDates.some(range =>
        new Date(range.startDate) <= new Date(date) && new Date(range.endDate) >= new Date(date)
      );
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
}
.boat-ad-container, .booking-form {
  padding: 20px;
  width: 45%;
}
.image-container {
  width: 100%;
  height: 300px;
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
.boat-specs, .boat-description {
  margin-top: 20px;
}
.boat-specs h2, .boat-description h2 {
  margin-bottom: 10px;
}
.booking-form {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
}
</style>

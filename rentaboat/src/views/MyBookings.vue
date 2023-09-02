<template>
  <div class="layout-container">
    <div id="selection-menu">
      <div class="menu-item">
        <button @click="showSection = 'mojeRezervacije'; filterStatus = 'upcoming'">Moje Rezervacije</button>
        <div v-if="showSection === 'mojeRezervacije'" class="submenu">
          <button @click="filterStatus = 'upcoming'">Nadolazeće rezervacije</button>
          <button @click="filterStatus = 'ongoing'">Rezervacije u tijeku</button>
          <button @click="filterStatus = 'past'">Završeni Charter</button>
        </div>
      </div>
      <div class="menu-item">
        <button @click="showSection = 'rezervacijeMojihPlovila'; filterStatus = 'upcoming'">Rezervacije mojih plovila</button>
        <div v-if="showSection === 'rezervacijeMojihPlovila'" class="submenu">
          <button @click="filterStatus = 'upcoming'">Nadolazeće rezervacije</button>
          <button @click="filterStatus = 'ongoing'">Rezervacije u tijeku</button>
          <button @click="filterStatus = 'past'">Završeni Charter</button>
        </div>
      </div>
    </div>

    <div class="content-container">
      <h1>Moje Rezervacije</h1>

      <div v-if="filteredMyBookings.length === 0 && filteredMyBoatsBookings.length === 0">
        Nemate rezervacija. Pretražite ponudu i izaberite plovilo.
      </div>

      <div v-if="showSection === 'rezervacijeMojihPlovila' && filteredMyBoatsBookings.length > 0">
        <h2>Rezervacije mojih plovila</h2>
        <div class="booking-card" v-for="booking in filteredMyBoatsBookings" :key="booking._id">
          <div class="image-container">
            <img v-if="booking.boat.slikePlovila && booking.boat.slikePlovila.length" :src="getBoatImageUrl(booking.boat.slikePlovila[0])" alt="Boat Image" class="boat-image"/>
          </div>
          <div class="booking-info">
            <h2>{{ booking.boat.ime }}</h2>
            <p><strong>Početak:</strong> {{ formatDate(booking.startDate) }}</p>
            <p><strong>Kraj:</strong> {{ formatDate(booking.endDate) }}</p>
            <p><strong>Ukupna cijena:</strong> {{ booking.totalCost }},00€</p>
            <p><strong>Kontakt:</strong> {{ booking.renterContact }}</p>
            <button v-if="booking.status === 'upcoming'" @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
          </div>
        </div>
      </div>

      <div v-if="showSection === 'mojeRezervacije' && filteredMyBookings.length > 0">
        <h2>Moje rezervacije</h2>
        <div class="booking-card" v-for="booking in filteredMyBookings" :key="booking._id">
          <div class="image-container">
            <img v-if="booking.boat.slikePlovila && booking.boat.slikePlovila.length" :src="getBoatImageUrl(booking.boat.slikePlovila[0])" alt="Boat Image" class="boat-image"/>
          </div>
          <div class="booking-info">
            <h2>{{ booking.boat.ime }}</h2>
            <p><strong>Start Date:</strong> {{ formatDate(booking.startDate) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(booking.endDate) }}</p>
            <p><strong>Total Price:</strong> {{ booking.totalCost }} €</p>
            <p><strong>Contact:</strong> {{ booking.boat.ownerContact }}</p>
            <button v-if="booking.status === 'upcoming'" @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
            <button v-if="booking.status === 'past' && !booking.isRated" @click="rateBoat(booking._id)">OCIJENI PLOVILO</button>
            <p v-if="booking.status === 'past' && booking.isRated">Ocijenjeno!</p>
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
      filterStatus: 'upcoming',
      showSection: 'mojeRezervacije',
      myBookings: [],
      myBoatsBookings: [],
      userId: null,
    };
  },
  computed: {
    filteredMyBookings() {
      return this.myBookings.filter(booking => booking.status === this.filterStatus);
    },
    filteredMyBoatsBookings() {
      return this.myBoatsBookings.filter(booking => booking.status === this.filterStatus);
    },
  },
  async mounted() {
    const userResponse = await fetch('http://localhost:3000/users/me', {credentials: "include"});
    const user = await userResponse.json();
    this.userId = user._id;

    const bookingsResponse = await fetch('http://localhost:3000/bookings/me', {credentials: "include"});
    const allBookings = await bookingsResponse.json();

    this.myBookings = allBookings.filter(booking => booking.renter === this.userId);
    this.myBoatsBookings = allBookings.filter(booking => booking.owner === this.userId);
  },
  methods: {
    getBoatImageUrl(imageName) {
      return `http://localhost:3000/boats/slike/${imageName.substring(8)}`;
    },
    formatDate(value) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    },
    async cancelBooking(id) {
      try {
        const response = await fetch(`http://localhost:3000/bookings/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          this.myBookings = this.myBookings.filter(booking => booking._id !== id);
          this.myBoatsBookings = this.myBoatsBookings.filter(booking => booking._id !== id);
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    },
    async rateBoat(bookingId) {
      const booking = this.myBookings.find(b => b._id === bookingId);
      if (!booking || !booking.boat) {
        alert("Booking or Boat not found");
        return;
      }
      if (booking.isRated) {
        alert("This booking has already been rated.");
        return;
      }
      const rating = prompt("Ocijeni plovilo 1 - 5");
      if (rating >= 1 && rating <= 5) {
        try {
          const response = await fetch(`http://localhost:3000/boats/${booking.boat._id}/rate`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating, bookingId })
          });
          if (response.ok) {
            alert("Plovilo ocijenjeno!");
            booking.isRated = true;
          } else {
            const data = await response.json();
            alert(`Failed to rate boat: ${data.error}`);
          }
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      } else {
        alert("Krivi unos");
      }
    },
  },
};
</script>

<style scoped>
  .menu-item {
    margin-bottom: 1rem;
  }
  .submenu {
    margin-left: 20px;
  }
  .layout-container {
    display: flex;
    padding-top: 60px;
  }

  #selection-menu {
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

  .content-container {
    margin-left: 220px;
  }

  .my-bookings {
    text-align: center;
  }

  .booking-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .booking-card {
    border: 1px solid #ccc;
    padding: 1rem;
    margin: 1rem;
    width: 300px;
    text-align: left;
  }

  .boat-image {
    max-width: 100%;
    height: auto;
  }
</style>
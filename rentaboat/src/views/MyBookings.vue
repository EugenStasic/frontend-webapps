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
      <h1>My Bookings</h1>

      <div v-if="filteredMyBookings.length === 0 && filteredMyBoatsBookings.length === 0">
        You have no bookings yet.
      </div>

      <div v-if="showSection === 'rezervacijeMojihPlovila' && filteredMyBoatsBookings.length > 0">
        <h2>Rezervacije mojih plovila</h2>
        <div class="booking-card" v-for="booking in filteredMyBoatsBookings" :key="booking._id">
          <div class="image-container">
            <img v-if="booking.boat.slikePlovila && booking.boat.slikePlovila.length" :src="getBoatImageUrl(booking.boat.slikePlovila[0])" alt="Boat Image" class="boat-image"/>
          </div>
          <div class="booking-info">
            <h2>{{ booking.boat.ime }}</h2>
            <p><strong>Start Date:</strong> {{ formatDate(booking.startDate) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(booking.endDate) }}</p>
            <p><strong>Total Price:</strong> {{ booking.totalCost }},00€</p>
            <p><strong>Email:</strong> {{ booking.renter.email }}</p>
            <button @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
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
            <p><strong>Email:</strong> {{ booking.owner.email }}</p>
            <button @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
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
      subSection: 'upcoming',
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
      const adjustedName = imageName.substring(8);
      return `http://localhost:3000/boats/slike/${adjustedName}`;
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
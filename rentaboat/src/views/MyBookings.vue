<template>
  <div class="layout-container container">

      <div id="selection-menu" class="mb-4">
          
          <div class="menu-item">
              <button class="btn btn-primary" @click="showSection = 'mojeRezervacije'; filterStatus = 'upcoming'">Moje Rezervacije</button>
              
              <div v-if="showSection === 'mojeRezervacije'" class="submenu">
                  <button class="btn btn-secondary" @click="filterStatus = 'upcoming'">Nadolazeće rezervacije</button>
                  <button class="btn btn-secondary" @click="filterStatus = 'ongoing'">Charter u tijeku</button>
                  <button class="btn btn-secondary" @click="filterStatus = 'past'">Završeni Charter</button>
              </div>
          </div>

          <div class="menu-item mt-2">
              <button class="btn btn-primary" @click="showSection = 'rezervacijeMojihPlovila'; filterStatus = 'upcoming'">Rezervacije mojih plovila</button>
              
              <div v-if="showSection === 'rezervacijeMojihPlovila'" class="submenu">
                  <button class="btn btn-secondary" @click="filterStatus = 'upcoming'">Nadolazeće rezervacije</button>
                  <button class="btn btn-secondary" @click="filterStatus = 'ongoing'">Charter u tijeku</button>
                  <button class="btn btn-secondary" @click="filterStatus = 'past'">Završeni Charter</button>
              </div>
          </div>
      </div>

      <div class="content-container">

          <h1 v-if="showSection === 'mojeRezervacije'">Moje Rezervacije</h1>
          <h1 v-if="showSection === 'rezervacijeMojihPlovila'">Rezervacije mojih plovila</h1>

          <div v-if="showSection === 'mojeRezervacije'">
              <div v-if="filterStatus === 'upcoming'">
                  <h2>Nadolazeće Rezervacije</h2>
                  <div class="empty-booking-card">
                  <p v-if="filteredMyBookings.length === 0">Nemate nadolazećih rezervacija. Da biste rezervirali plovilo uputite se na <router-link to="/search">pretragu plovila</router-link>.</p>
                  </div>
              </div>
              <div v-if="filterStatus === 'ongoing'">
                  <h2>Charter u tijeku</h2>
                  <div class="empty-booking-card">
                  <p v-if="filteredMyBookings.length === 0">Nemate charter za ovaj period.</p>
                  </div>
              </div>
              <div v-if="filterStatus === 'past'">
                  <h2>Završeni Charter</h2>
                  <div class="empty-booking-card">
                  <p v-if="filteredMyBookings.length === 0">Nema charter-a za prikaz.</p>
                  </div>
              </div>
          </div>

          <div v-if="showSection === 'rezervacijeMojihPlovila'">
              <div v-if="filterStatus === 'upcoming'">
                  <h2>Nadolazeće Rezervacije</h2>
                  <div class="empty-booking-card">
                  <p v-if="filteredMyBoatsBookings.length === 0">Nemate nadolazećih rezervacija za vaše plovilo. Ako nemate registrirano plovilo možete ga registrirati <router-link to="/register-boat">ovdje</router-link>.</p>
                  </div>
              </div>
              <div v-if="filterStatus === 'ongoing'">
                  <h2>Charter u tijeku</h2>
                  <div class="empty-booking-card">
                  <p v-if="filteredMyBoatsBookings.length === 0">Nemate charter za ovaj period.</p>
                  </div>
              </div>
              <div v-if="filterStatus === 'past'">
                  <h2>Završeni Charter</h2>
                  <div class="empty-booking-card">
                  <p v-if="filteredMyBoatsBookings.length === 0">Nema charter-a za prikaz.</p>
                  </div>
              </div>
          </div>

          <div v-if="showSection === 'rezervacijeMojihPlovila' && filteredMyBoatsBookings.length > 0">
              <div class="booking-card" style="border: 1px solid #ccc; padding: 16px; margin-bottom: 16px;" v-for="booking in filteredMyBoatsBookings" :key="booking._id">
                  <div class="row">
                      <div class="col-md-2" image-container>
                          <img v-if="booking.boat.slikePlovila && booking.boat.slikePlovila.length" :src="getBoatImageUrl(booking.boat.slikePlovila[0])" alt="Boat Image" style="width: 100%;" />
                      </div>
                      <div class="col-md-10">
                          <div class="row">
                              <div class="col-md-3"><strong>Model: </strong>{{ booking.boat.ime }}</div>
                              <div class="col-md-3"><strong>Početak: </strong>{{ formatDate(booking.startDate) }}</div>
                              <div class="col-md-3"><strong>Kontakt: </strong>{{ booking.renterContact }}</div>
                              <div class="col-md-3">
                                  <button class="btn btn-danger" v-if="booking.status === 'upcoming'" @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
                              </div>
                          </div>
                          <div class="row">
                              <div class="col-md-3"><strong>Ukupna cijena: </strong>{{ booking.totalCost }},00€</div>
                              <div class="col-md-3"><strong>Kraj: </strong>{{ formatDate(booking.endDate) }}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div v-if="showSection === 'mojeRezervacije' && filteredMyBookings.length > 0">
              <div class="booking-card" style="border: 1px solid #ccc; padding: 16px; margin-bottom: 16px;" v-for="booking in filteredMyBookings" :key="booking._id">
                  <div class="row">
                      <div class="col-md-2" image-container>
                          <img v-if="booking.boat.slikePlovila && booking.boat.slikePlovila.length" :src="getBoatImageUrl(booking.boat.slikePlovila[0])" alt="Boat Image" style="width: 100%;" />
                      </div>
                      <div class="col-md-10">
                          <div class="row">
                              <div class="col-md-3"><strong>Model: </strong>{{ booking.boat.ime }}</div>
                              <div class="col-md-3"><strong>Početak: </strong>{{ formatDate(booking.startDate) }}</div>
                              <div class="col-md-3"><strong>Kontakt: </strong>{{ booking.boat.ownerContact }}</div>
                              <div class="col-md-3">
                                  <button class="btn btn-danger" v-if="booking.status === 'upcoming'" @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
                                  <button class="btn btn-primary" v-if="booking.status === 'past' && !booking.isRated" @click="rateBoat(booking._id)">OCIJENI PLOVILO</button>
                                  <span v-if="booking.status === 'past' && booking.isRated">Ocijenjeno!</span>
                              </div>
                          </div>
                          <div class="row">
                              <div class="col-md-3"><strong>Ukupna cijena: </strong>{{ booking.totalCost }},00€</div>
                              <div class="col-md-3"><strong>Kraj: </strong>{{ formatDate(booking.endDate) }}</div>
                          </div>
                      </div>
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
    }
  },
  async mounted() {
    const userResponse = await fetch(config.baseUrl + '/users/me', {credentials: "include"});
    const user = await userResponse.json();
    this.userId = user._id;

    const bookingsResponse = await fetch(config.baseUrl + '/bookings/me', {credentials: "include"});
    const allBookings = await bookingsResponse.json();

    this.myBookings = allBookings.filter(booking => booking.renter === this.userId);
    this.myBoatsBookings = allBookings.filter(booking => booking.owner === this.userId);
  },
  methods: {
    getBoatImageUrl(imageUrl) {
  return imageUrl ? imageUrl : null;
},
    formatDate(value) {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    },
    async cancelBooking(id) {
      if( window.confirm("Jeste li sigurni da želite otkazati rezervaciju?")){
      try {
        const response = await fetch(config.baseUrl + `/bookings/${id}`, {
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
          const response = await fetch(config.baseUrl + `/boats/${booking.boat._id}/rate`, {
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
.btn-secondary {
  background: linear-gradient(to left, #14b5f5, #0d6efd);
  color: #fff;
  padding: 8px 12px;
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
    background-color: #ffffff;
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
    text-align: center;
  }

  .booking-card {
    background-color: #ffffff;
    width: 1076px;
    border-radius: 8px;
    border: 1px solid #a6a6a6;
    margin-bottom: 20px;
    padding: 10px;
  }
  .empty-booking-card{
    width: 1076px;
    padding: 30px;
  }

  .col-md-2 img {
  height: 120px;
  width: 120px;
  object-fit: fill;
  }

</style>
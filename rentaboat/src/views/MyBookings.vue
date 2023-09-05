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
      <h1>Moje Rezervacije</h1>
      
      <div v-if="filteredMyBookings.length === 0 && filteredMyBoatsBookings.length === 0">
        <p>Nemate rezervacija. Pretražite ponudu i izaberite plovilo.</p>
      </div>

      <div v-if="showSection === 'rezervacijeMojihPlovila' && filteredMyBoatsBookings.length > 0">
  <h2>Rezervacije mojih plovila</h2>
  <div class="booking-card" style="border: 1px solid #ccc; padding: 16px; margin-bottom: 16px;" v-for="booking in filteredMyBoatsBookings" :key="booking._id">
    <div class="row">
      <div class="col-md-2" image-container>
        <img v-if="booking.boat.slikePlovila && booking.boat.slikePlovila.length" :src="getBoatImageUrl(booking.boat.slikePlovila[0])" alt="Boat Image" style="width: 100%;" />
      </div>
      <div class="col-md-10">
        <div class="row">
          <div class="col-md-3">
            <strong>Model: </strong>{{ booking.boat.ime }}
          </div>
          <div class="col-md-3">
            <strong>Početak: </strong>{{ formatDate(booking.startDate) }}
          </div>
          <div class="col-md-3">
            <strong>Kontakt: </strong>{{ booking.renterContact }}
          </div>
          <div class="col-md-3">
            <button class="btn btn-danger" v-if="booking.status === 'upcoming'" @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <strong>Ukupna cijena: </strong>{{ booking.totalCost }} €
          </div>
          <div class="col-md-3">
            <strong>Kraj: </strong>{{ formatDate(booking.endDate) }}
          </div>

          <div class="col-md-6"></div>
        </div>
      </div>
    </div>
  </div>
</div>

      <div v-if="showSection === 'mojeRezervacije' && filteredMyBookings.length > 0">
        <h2>Moje rezervacije</h2>
        <div class="booking-card" style="border: 1px solid #ccc; padding: 16px; margin-bottom: 16px;" v-for="booking in filteredMyBookings" :key="booking._id">
          <div class="row">
            <div class="col-md-2" image-container>
              <img v-if="booking.boat.slikePlovila && booking.boat.slikePlovila.length" :src="getBoatImageUrl(booking.boat.slikePlovila[0])" alt="Boat Image" style="width: 100%;" />
            </div>
            <div class="col-md-10">
              <div class="row">
                <div class="col-md-3">
                  <strong>Model: </strong>{{ booking.boat.ime }}
                </div>
                <div class="col-md-3">
                  <strong>Početak: </strong>{{ formatDate(booking.startDate) }}
                </div>
                <div class="col-md-3">
                  <strong>Kontakt: </strong>{{ booking.boat.ownerContact }}
                </div>
                <div class="col-md-3">
                  <button class="btn btn-danger" v-if="booking.status === 'upcoming'" @click="cancelBooking(booking._id)">OTKAŽI REZERVACIJU</button>
                  <button class="btn btn-primary" v-if="booking.status === 'past' && !booking.isRated" @click="rateBoat(booking._id)">OCIJENI PLOVILO</button>
                  <span v-if="booking.status === 'past' && booking.isRated">Ocijenjeno!</span>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <strong>Ukupna cijena: </strong>{{ booking.totalCost }} €
                </div>
                <div class="col-md-3">
                  <strong>Kraj: </strong>{{ formatDate(booking.endDate) }}
                </div>

                <div class="col-md-6"></div>
              </div>
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
      if( window.confirm("Jeste li sigurni da želite otkazati rezervaciju?")){
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
  }

  .booking-card {
    background-color: #ffffff;
    width: 1076px;
    border-radius: 8px;
    border: 1px solid #a6a6a6;
    margin-bottom: 20px;
    padding: 10px;
  }

  .image-container {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .col-md-2 img {
  height: 120px;
  width: 120px;
  object-fit: fill;
  }

</style>

<template>
  <div class="container">
    <div class="boat-section">
      <div v-if="boat && Object.keys(boat).length > 0" class="boat-ad-container">
        <div class="image-container">
          <img 
            v-if="boat.slikePlovila && boat.slikePlovila.length"
            :src="getBoatImageUrl(boat._id, currentPhotoIndex)"
            alt="Slika plovila" 
            class="boat-image"
          />
          <div v-else>Nema slika za prikaz</div>
        </div>
        <div class="arrow-container">
          <button @click="prevPhoto" :disabled="currentPhotoIndex === 0" class="arrow-button">←</button>
          <button @click="nextPhoto" :disabled="currentPhotoIndex === boat.slikePlovila.length - 1" class="arrow-button">→</button>
        </div>
      </div>
      <div class="jumbotron">
        <h1 class="display-4">{{ boat.ime }}</h1>
        <hr class="my-4">
        <div class="boat-specs">
          <p><strong>Tip:</strong> {{ boat.tip }}</p>
          <p><strong>Snaga Motora:</strong> {{ boat.snagaMotora }} HP</p>
          <p><strong>Duljina Plovila:</strong> {{ boat.duljinaPlovila }} m</p>
          <p><strong>Cijena Plovila:</strong> {{ boat.cijenaPlovila }},00€</p>
          <hr class="my-4">
            <div class="boat-description">
              <p>{{ boat.opis }}</p>
            </div>
          </div>
        </div>
      </div>
    <div v-if="userId !== boat.owner && boat && Object.keys(boat).length > 0" class="booking-form card">
      <div class="card-body">
        <h2 class="card-title">Iznajmi Plovilo</h2>
        <div class="form-group md-form md-outline input-with-post-icon datepicker">
          <label for="startDate">Početak:</label>
          <input 
            id="startDate" 
            type="date" 
            class="form-control" 
            :class="{'unavailable-date': isDateUnavailable(startDate)}"
            v-model="startDate" 
            :min="today"
          >
          <i class="fas fa-calendar input-prefix"></i>
          <div v-if="isDateUnavailable(startDate)" class="warning-message">
            Ovaj datum nije dostupan.
          </div>
        </div>
        <div class="form-group">
          <label for="endDate">Kraj:</label>
          <input 
            id="endDate" 
            type="date" 
            class="form-control"
            :class="{'unavailable-date': isDateUnavailable(endDate)}"
            v-model="endDate" 
            :min="startDate || today"
          >
          <i class="fas fa-calendar input-prefix"></i>
          <div v-if="isDateUnavailable(endDate)" class="warning-message">
            Ovaj datum nije dostupan.
          </div>
        </div>
        <p>Cijena: {{ boatPrice }},00€</p>
        <div class="form-group">
          <label for="renterContact">Kontakt:</label>
          <input 
            id="renterContact" 
            type="text" 
            class="form-control"
            v-model="renterContact"
            placeholder="Unesite vaš kontakt"
            required
          >
        </div>
        <div class="dostupnost-container">
          <button @click="toggleDropdown = !toggleDropdown" class="btn btn-info d">Dostupnost</button>
          <ul v-if="toggleDropdown" class="dropdown-list">
            <li><strong>Nedostupni datumi:</strong></li>
            <li v-for="(date, index) in filteredBoatDates" :key="'boat-' + index">
              {{ formatDate(date.startDate) }} - {{ formatDate(date.endDate) }}
            </li>
            <li><strong>Datumi vaših postojećih rezervacija:</strong></li>
            <li v-for="(date, index) in filteredUserDates" :key="'user-' + index">
              {{ formatDate(date.startDate) }} - {{ formatDate(date.endDate) }}
            </li>
          </ul>
        </div>
        <button @click="submitBooking" class="btn btn-primary">Potvrdi Booking</button>
        <p class="error-message">{{ errorMessage }}</p>
      </div>
      <div v-if="bookingSuccess" class="card-footer success-message">
        <p>Uspješno ste rezervirali plovilo!Uspješno ste rezervirali plovilo! Detalje možete pronaći na <router-link to="/my-bookings">My Bookings stranici</router-link>.</p>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../config.js';

export default {
  data() {
    return {
      boat: {},
      currentPhotoIndex: 0,
      userId: null,
      startDate: null,
      endDate: null,
      renterContact: "",
      userBookings: [],
      note: "",
      unavailableDates: [],
      errorMessage: "",
      bookingSuccess: false,
      today: new Date().toISOString().split('T')[0],
      toggleDropdown: false,
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
    },
    filteredAndSortedDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allDates = [...this.unavailableDates, ...this.userBookings.map(b => ({ startDate: b.startDate, endDate: b.endDate, isUserBooking: true }))];

    return allDates
      .filter(date => new Date(date.endDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  },
    filteredBoatDates() {
    return this.filteredAndSortedDates.filter(date => !date.isUserBooking);
  },
  filteredUserDates() {
    return this.filteredAndSortedDates.filter(date => date.isUserBooking);
  },


  
  },
  
  
  async mounted() {
    try {
      this.unavailableDates = [];

      const id = this.$route.params.id;
      const response = await fetch(config.baseUrl + `/boats/${id}`);
      this.boat = await response.json();

      const userBookingsResponse = await fetch(config.baseUrl + '/bookings/renter', { credentials: 'include' });
      this.userBookings = await userBookingsResponse.json();
      this.calculateUnavailableForUser();

      const currentUserResponse = await fetch(config.baseUrl + '/users/me', { credentials: "include" });
      const currentUser = await currentUserResponse.json();
      this.userId = currentUser._id;

      const unavailableDatesResponse = await fetch(config.baseUrl + `/boats/${this.boat._id}/unavailable-dates`);
      this.unavailableDates = await unavailableDatesResponse.json();

    } catch (error) {
      this.userBookings = [];
      console.error("Error mounted:", error.message);
    }
  },
  methods: {
    getBoatImageUrl(boatId, imageIndex) {
      return `${config.baseUrl}/boats/images/${boatId}/${imageIndex}`;
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
      const isOverlapping = this.unavailableDates.some(range => {
        const newStart = new Date(this.startDate).getTime();
        const newEnd = new Date(this.endDate).getTime();
        const existingStart = new Date(range.startDate).getTime();
        const existingEnd = new Date(range.endDate).getTime();
        return (existingStart < newEnd && existingEnd > newStart);
      });

      if (isOverlapping) {
        this.errorMessage = "Već imate rezervaciju za ovaj period.";
        return;
      }

      const sendData = {
        boatId: this.boat._id,
        startDate: this.startDate,
        endDate: this.endDate,
        totalCost: this.boatPrice,
        note: this.note,
        renterContact: this.renterContact
      };

      const response = await fetch(config.baseUrl + '/bookings/create', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData),
        credentials: 'include'
      });

      if (response.ok) {
        await response.json();
        this.bookingSuccess = true;
      } else if (response.status === 401) {
        this.errorMessage = "Da bi ste rezervirali plovilo, morate biti ulogirani.";
      } else {
        this.errorMessage = "Rezervacija plovila nije uspjela. Molimo vas pokušajte ponovno.";
      }
    },
      isDateUnavailable(date) {
    const isBoatUnavailable = this.unavailableDates.some(range =>
      new Date(range.startDate) <= new Date(date) && new Date(range.endDate) >= new Date(date)
    );
    
    const isUserUnavailable = this.userBookings.some(booking =>
      new Date(booking.startDate) <= new Date(date) && new Date(booking.endDate) >= new Date(date)
    );
    
    return isBoatUnavailable || isUserUnavailable;
    },
    calculateUnavailableForUser() {
      this.userBookings.forEach(booking => {
        const newRange = {
          startDate: booking.startDate,
          endDate: booking.endDate
        };
        this.unavailableDates.push(newRange);
      });
    },
    formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
  }
}
</script>


<style scoped>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }

  .booking-form, .boat-section {
    flex: 1;
  }

  .boat-ad-container, .booking-form, .boat-section {
    padding: 20px;
  }
  .boat-section{
    background-color: #ffffff; 
    border-radius: 8px;
  }

  .boat-specs, .boat-description {
    margin-top: 20px;
  }

  .boat-specs h2, .boat-description h2 {
    margin-bottom: 10px;
  }

  .booking-form {
  background-color: #ffffff; 
  border: 1px solid #ccc;
  padding: 20px;
  max-width: 400px;
  border-radius: 8px;
}

  .success-message {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    padding: 20px;
    margin-top: 20px;
  }

  .btn-primary{
    margin-top: 10px;
  }
  .image-container {
  width: 100%;
  height: 300px;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  flex-direction: column; 
  align-items: center;
  overflow: hidden;
}
.boat-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: fill;
}
.arrow-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.arrow-button {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin: 0 5px;
  color: #000000;  
}
  .jumbotron {
    padding: 2rem;
    margin: 0;
  }

  .dostupnost-container {
    margin-top: 10px;
  }
  .btn-info.d {
    background-color: orange;
  }
  .boat-description {
  max-width: 650px;
  word-wrap: break-word;
  white-space: pre-line; 
  margin: auto; 
}


  .dropdown-list {
    background: #fff;
    border: 1px solid #ccc;
    list-style: none;
    margin-top: 5px;
    padding: 10px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1;
  }

  .unavailable-date {
    border-color: red;
  }

  .warning-message, .error-message {
    color: red;
  }
</style>
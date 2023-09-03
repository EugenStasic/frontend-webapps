<template>
  <div>
    <h1>Dobrodošli u Rent A Boat Adriatic, {{ userName }}!</h1>
    <p>
      Zadovoljstvo nam je što ste se odlučili za našu platformu za najam brodova. 
      Iskoristite mogućnosti koje vam nudimo i kreirajte nezaboravno iskustvo na Jadranskom moru.
    </p>
    <p>
      Ako ste zainteresirani za pronalaženje savršenog broda za svoju sljedeću pustolovinu,
      koristite našu <router-link to="/search">tražilicu</router-link> da biste pronašli i rezervirali brod po svojoj želji.
    </p>
    <p>
      Ako želite zaraditi dodatno i podijeliti ljepote Jadrana s drugima, 
      <router-link to="/register-boat">registirajte svoj brod</router-link> i postanite dio naše mreže iznajmljivača.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: 'Guest'
    };
  },
  async mounted() {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      if (data && data.ime) {
        this.userName = data.ime;
      }
    } catch (error) {
      console.error('Error fetching the user data:', error);
    }
  }
}
</script>
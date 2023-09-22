<template>
  <CCardBody>
    <div class="center-image">
      <img v-bind:src="image.home" alt="Your Image" />
    </div>
  </CCardBody>
</template>

<style>
/* CSS untuk menengahkan gambar */
.center-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh; /* Atur tinggi div agar gambar berada di tengah halaman vertikal */
}

.center-image img {
  max-width: 75%; /* Pastikan gambar tidak melebihi lebar div */
  max-height: 75%; /* Pastikan gambar tidak melebihi tinggi div */
}
</style>
<script>
import { getHomeLogo } from '../utils';
export default {
  name: 'Home',
  data() {
    return {
      image: {
        home: getHomeLogo(),
      },
    };
  },
  mounted() {},
  methods: {},
  computed: {},
};
</script>

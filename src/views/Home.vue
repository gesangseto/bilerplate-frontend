<template>
  <div class="center-image">
    <img v-bind:src="image.home" alt="Your Image" />
  </div>
</template>

<style>
/* CSS untuk menengahkan gambar */

.center-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.center-image img {
  max-width: 55; /* Pastikan gambar tidak melebihi lebar div */
  max-height: 55%; /* Pastikan gambar tidak melebihi tinggi div */
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

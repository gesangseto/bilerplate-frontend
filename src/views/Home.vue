<template>
  <CCardBody>
    <CRow>
      <CCol class="md-4">
        <img v-bind:src="image.mertrack" style="width: 100px; heigth: auto" />
      </CCol>
      <CCol class="md-4">
        <table style="width: 100%">
          <tr>
            <td colspan="3"><strong>System Version</strong></td>
          </tr>
          <tr>
            <td>Core</td>
            <td>:</td>
            <td>3.0.0</td>
          </tr>
          <tr>
            <td>DB</td>
            <td>:</td>
            <td>3.0.0</td>
          </tr>
        </table>
      </CCol>
      <CCol class="md-4">
        <table style="width: 100%">
          <tr>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr>
            <td>BPOM Report</td>
            <td>:</td>
            <td>3.0</td>
          </tr>
          <tr>
            <td>Web</td>
            <td>:</td>
            <td>3.0.0</td>
          </tr>
          <tr>
            <td>Mobile</td>
            <td>:</td>
            <td>3.0.0</td>
          </tr>
        </table>
      </CCol>
    </CRow>
    <hr />
    <div class="center-image">
      <img v-bind:src="image.app" alt="Your Image" />
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
import { logoMerindo, logoMertrack } from "../constants";
import { getLogo } from "../utils";
export default {
  name: "Home",
  data() {
    return {
      image: {
        app: getLogo(),
        mertrack: logoMertrack,
        merindo: logoMerindo,
      },
    };
  },
  mounted() {},
  methods: {},
  computed: {},
};
</script>

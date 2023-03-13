<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="clearfix">
          <h1 class="float-left display-3 mr-4">Invalid Access !</h1>
          <h5 class="pt-3">
            Sepertinya anda tidak diizinkan masuk ke halaman Ini
          </h5>
          <p class="text-muted">
            Silahkan hubungi admin, untuk meminta mengaktifkan halaman yang anda
            maksud untuk akun anda.
          </p>
        </div>
        <CButton color="danger" size="sm" @click="logOut"> Login </CButton>
        <!-- &nbsp; &nbsp;
        <CButton color="danger" size="sm" @click="goBack">
          Back
        </CButton> -->
        &nbsp; &nbsp;
        <CButton color="info" size="sm" @click="dashboard"> Dashboard </CButton>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import { getProfile } from "../../utils";
export default {
  name: "Oops",
  beforeCreate() {
    if (!getProfile()) {
      localStorage.clear();
      this.$router.push({ path: `/login` });
    }
  },
  methods: {
    logOut() {
      localStorage.clear();
      window.location.reload();
    },
    dashboard() {
      this.$router.push({ path: `/dashboard` });
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>

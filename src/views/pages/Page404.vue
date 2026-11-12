<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6" lg="5">
        <CCard class="p-4 text-center">
          <CCardBody>
            <img
              :src="logo"
              class="mb-4"
              style="width: auto; height: 72px"
            />
            <h1 class="display-3 font-weight-bold text-primary mb-1">404</h1>
            <h4 class="mb-2">Halaman Tidak Ditemukan</h4>
            <p class="text-muted mb-4">
              Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
            </p>
            <div class="d-flex justify-content-center">
              <CButton
                v-if="!isLoggedIn"
                color="primary"
                @click="goLogin"
              >
                Ke Login
              </CButton>
              <CButton v-else color="primary" @click="goHome">
                Ke Home
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import { getProfile } from '../../utils';
import { logoMertrack } from '../../constants';

export default {
  name: 'Page404',
  data() {
    return {
      logo: logoMertrack,
      isLoggedIn: !!getProfile(),
    };
  },
  methods: {
    goLogin() {
      this.$router.push({ path: '/login' });
    },
    goHome() {
      this.$router.push({ path: '/home' });
    },
  },
};
</script>

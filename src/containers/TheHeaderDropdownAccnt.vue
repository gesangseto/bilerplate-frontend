<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink style="border: 1px">
        <div style="padding-right: 10px">{{ full_name || '' }} {{ ' ' }}</div>
        <div class="c-avatar">
          <img
            v-bind:src="avatar_path"
            class="c-avatar-img"
            style="width: auto; height: 40px"
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{ email || '' }}</strong>
    </CDropdownHeader>
    <!-- <CDropdownItem @click="toProfile">
      <CIcon name="cil-user" /> Profile
    </CDropdownItem> -->
    <CDropdownItem @click="toSetting">
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem @click="toApplicationSetting">
      <CIcon name="cil-applications-settings" /> Pengaturan Aplikasi
    </CDropdownItem>
    <CDropdownDivider />
    <CDropdownItem @click="logOut">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { authLogout } from '../resource/SysAuth';
import { clearStorage, getLogo, getProfile } from '../utils';

export default {
  name: 'TheHeaderDropdownAccnt',
  data() {
    return {
      itemsCount: 0,
      full_name: '',
      avatar_path: '',
      email: '',
    };
  },
  mounted() {
    this.profile = getProfile();
    this.full_name = this.profile ? this.profile.full_name : '-';
    this.email = this.profile ? this.profile.email : '';
    this.avatar_path =
      this.profile && this.profile.mst_avatar_id
        ? `img/avatars/${this.profile.mst_avatar_id}.png`
        : getLogo();
  },
  methods: {
    async logOut() {
      let message = `Are you sure you want to logout?`;
      if (!confirm(message)) {
        return;
      }
      // PENTING: pembersihan sesi lokal + redirect HARUS selalu terjadi,
      // terlepas dari jawaban server. Kalau API logout gagal (mis. cache
      // tenant nyangkut -> TENANT_SUBDOMAIN_MISSING), user tetap bisa keluar
      // dan tidak terjebak di halaman yang sama.
      let _res = await authLogout();
      let apiError = _res && _res.error;
      let apiMessage = _res && _res.message;

      // Selalu bersihkan sesi lokal.
      clearStorage();

      this.$toast.open({
        message: apiError
          ? `Logged out locally. Server: ${apiMessage || 'logout gagal'}`
          : 'You have been logged out successfully',
        type: apiError ? 'warning' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });

      // Selalu arahkan ke halaman login (replace agar tombol back tidak
      // mengembalikan user ke halaman ber-sesi).
      try {
        this.$router.replace({ path: '/login' });
      } catch (e) {
        window.location.href = '/login';
      }
    },
    // toProfile() {
    //   this.$router.push({ path: "/setting/user-profile" });
    // },
    toSetting() {
      this.profile = getProfile();
      // let section = this.profile.mst_section_id;
      // if (section == 0) {
      // this.$router.push({ path: "/setting/configuration" });
      // } else {
      this.$router.push({ path: '/setting/user-setting' });
      // }
    },
    toApplicationSetting() {
      this.$router.push({ path: '/setting/application' });
    },
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>

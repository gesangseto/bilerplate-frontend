<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink style="border: 1px">
        <div style="padding-right: 10px">{{ full_name }} {{ ' ' }}</div>
        <div class="c-avatar">
          <img
            v-bind:src="avatar_path"
            class="c-avatar-img"
            style="width: 35px; heigth: auto"
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{ email }}</strong>
    </CDropdownHeader>
    <!-- <CDropdownItem @click="toProfile">
      <CIcon name="cil-user" /> Profile
    </CDropdownItem> -->
    <CDropdownItem @click="toSetting">
      <CIcon name="cil-settings" /> Settings
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
    this.full_name = this.profile.full_name;
    this.email = this.profile.email;
    this.avatar_path = this.profile.path
      ? `img/avatars/${this.profile.path}`
      : getLogo();
  },
  methods: {
    async logOut() {
      let message = `Are you sure you want to logout?`;
      if (!confirm(message)) {
        return;
      }
      let _res = await authLogout();
      if (_res) {
        this.$toast.open({
          message: _res.error
            ? _res.message
            : 'You have been logged out successfully',
          type: _res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!_res.error) {
          clearStorage();
          this.$router.go({ path: '/login' });
        }
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
  },
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>

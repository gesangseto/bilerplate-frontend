<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink style="border: 1px">
        <div style="padding-right: 10px">{{ full_name }} {{ " " }}</div>
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
import $axiosMertrack from "../apiMertrack";

export default {
  name: "TheHeaderDropdownAccnt",
  data() {
    return {
      itemsCount: 0,
      full_name: "",
      avatar_path: "",
      email: "",
    };
  },
  mounted() {
    this.profile = JSON.parse(localStorage.getItem("profile"));
    this.full_name = this.profile.full_name;
    this.email = this.profile.email;
    this.avatar_path = this.profile.path
      ? `img/avatars/${this.profile.path}`
      : localStorage.getItem("app_image");
  },
  methods: {
    logOut() {
      $axiosMertrack.get(`general/web?ApiName=UserLogout`).then((res) => {
        this.$toast.open({
          message: res.data.error
            ? res.data.message
            : "You have been logged out successfully",
          type: res.data.error ? "error" : "success",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        if (!res.data.error) {
          localStorage.clear();
          this.$router.push({ path: "/login" });
          // window.location.reload();
        }
      });
    },
    // toProfile() {
    //   this.$router.push({ path: "/setting/user-profile" });
    // },
    toSetting() {
      this.profile = JSON.parse(localStorage.getItem("profile"));
      // let section = this.profile.mst_section_id;
      // if (section == 0) {
      // this.$router.push({ path: "/setting/configuration" });
      // } else {
      this.$router.push({ path: "/setting/user-setting" });
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

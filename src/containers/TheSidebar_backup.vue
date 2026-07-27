<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon
        class="c-sidebar-brand-full"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 556 134"
      />
      <CIcon
        class="c-sidebar-brand-minimized text-center"
        name="logo"
        size="custom-size"
        :height="35"
        viewBox="0 0 110 134"
      />
      <div class="col-sm-3"></div>
      <div class="col-sm-6" style="padding: 10px">
        <img v-bind:src="entityLogo" style="width: 80px; height: auto" />
      </div>
      <div class="col-sm-3"></div>
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="nav" />
  </CSidebar>
</template>

<script>
import { getLogo } from '../utils';
import nav from './_nav';

export default {
  data() {
    return {
      userPermission: [],
      nav: nav,
      entityLogo: null,
    };
  },
  name: 'TheSidebar',
  mounted() {
    this.entityLogo = getLogo();
  },
  computed: {
    show() {
      return this.$store.state.sidebarShow;
    },
    minimize() {
      return this.$store.state.sidebarMinimize;
    },
  },
};
</script>
<style scoped></style>

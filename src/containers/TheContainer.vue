<template>
  <div class="c-app">
    <TheSidebar />
    <CWrapper>
      <TheHeader />
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade">
              <router-view></router-view>
            </transition>
          </CContainer>
        </main>
        <TheFooter />
      </div>
    </CWrapper>
    <!-- <vue-fab
      size="small"
      :mainBtnColor="'#ff9900'"
      :icon="useKeyboard ? 'keyboard_hide' : 'keyboard'"
      @clickMainBtn="clickMainBtn"
      :menu="[]"
      style="right: 99%; top: 95%"
    >
    </vue-fab>
    Ini adalah floating button untuk menampilkan virtual keyboard
     -->
  </div>
</template>

<script>
import TheSidebar from './TheSidebar';
import TheHeader from './TheHeader';
import TheFooter from './TheFooter';

export default {
  name: 'TheContainer',
  components: {
    TheSidebar,
    TheHeader,
    TheFooter,
  },
  data() {
    return {
      useKeyboard: false,
    };
  },
  methods: {
    clickMainBtn() {
      this.useKeyboard = !this.useKeyboard;
      localStorage.setItem('use_keyboard', this.useKeyboard.toString());
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

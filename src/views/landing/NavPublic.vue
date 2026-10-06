<template>
  <nav class="pn">
    <div class="pn-inner">
      <router-link class="pn-brand" to="/landing">
        <span class="pn-dot"></span>
        <span>Jastip</span>
      </router-link>
      <div class="pn-links">
        <router-link to="/landing" exact>Home</router-link>
        <router-link to="/tracking" exact>Tracking</router-link>
        <router-link class="pn-btn" to="/login">Login</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavPublic',
};
</script>

<style scoped>
.pn {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e2e8f0;
}
.pn-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.pn-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
  text-decoration: none;
}
.pn-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  display: inline-block;
}
.pn-links {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pn-links a {
  color: #475569;
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 500;
  padding: 7px 12px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}
.pn-links a:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.pn-links a.router-link-active:not(.pn-btn) {
  color: #4f46e5;
}
.pn-links a.pn-btn {
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
  padding: 8px 18px;
  font-weight: 600;
}
.pn-links a.pn-btn:hover {
  opacity: 0.9;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #fff;
}
</style>

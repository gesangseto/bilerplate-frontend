<template>
  <a :href="href">
    <CButton
      type="reset"
      size="sm"
      color="danger"
      class="m-1"
      @click="cancel()"
    >
      <CIcon :name="icon" /> {{ judul }}
    </CButton>
  </a>
</template>

<script>
export default {
  name: "ButtonBack",
  props: ["type", "title"],

  watch: {},
  mounted() {
    if (this.type === "back") {
      this.icon = "cil-arrow-left";
    } else {
      this.icon = "cil-ban";
    }
    if (this.title) {
      this.judul = this.title;
    }
  },
  data() {
    return {
      judul: "Cancel",
      icon: "cil-ban",
    };
  },
  methods: {
    cancel() {
      const path = this.$route.path;
      const params = this.$route.params;
      const { type, id } = params;
      let updatedPath = path;
      if (type) updatedPath = updatedPath.replace(`/${type}`, "");
      if (id) updatedPath = updatedPath.replace(`/${id}`, "");
      this.$router.replace({ path: updatedPath });
    },
  },
};
</script>

<template>
  <CRow>
    <CSwitch class="mr-1" color="success" :checked.sync="status" />
    &nbsp;&nbsp;{{ show_label ? status_text : "" }}
  </CRow>
</template>

<script>
export default {
  name: "SwithStatusMaster",
  props: ["show_label", "default_value"],
  mounted() {},
  data() {
    return {
      status_text: "Inactive",
      status: false,
    };
  },
  watch: {
    default_value: {
      handler(n, o) {
        this.status = n == "Active" ? true : false;
      },
      deep: true,
    },
    status: {
      handler(n, o) {
        this.status_text = this.status ? "Active" : "Inactive";
        this.handleChange();
      },
      deep: true,
    },
  },
  methods: {
    handleChange() {
      this.$emit("onChange", this.status_text);
    },
  },
};
</script>

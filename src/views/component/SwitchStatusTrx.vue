<template>
  <div style="justify-content: center; align-items: center">
    <CSwitch
      color="success"
      :checked.sync="status"
      :disabled="disabled"
      style="margin-left: 5px"
    />
    <p style="margin-top: -5px; font-size: 12px; text-align: center">
      {{ show_label ? (status_text ? "Active" : "Inactive") : "" }}
    </p>
  </div>
</template>

<script>
export default {
  name: "SwitchStatusTrx",
  props: ["show_label", "default_value", "disabled"],
  mounted() {},
  data() {
    return {
      status_text: "1",
      status: true,
    };
  },
  watch: {
    default_value: {
      handler(n, o) {
        this.status = n == "1" ? true : false;
      },
      deep: true,
    },
    status: {
      handler(n, o) {
        this.status_text = this.status ? "1" : "0";
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

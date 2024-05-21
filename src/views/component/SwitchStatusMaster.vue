<template>
  <div style="justify-content: center; align-items: center">
    <CSwitch
      color="success"
      :checked.sync="status"
      :disabled="disabled"
      style="margin-left: 5px"
    />
    <p style="margin-top: -5px; font-size: 12px; text-align: center">
      {{ show_label ? status_text : '' }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SwitchStatusMaster',
  props: ['show_label', 'default_value', 'disabled'],
  mounted() {},
  data() {
    return {
      status_text: 'Active',
      status: true,
    };
  },
  watch: {
    default_value: {
      handler(n, o) {
        this.status = n == 'Active' ? true : false;
      },
      deep: true,
    },
    status: {
      handler(n, o) {
        this.status_text = this.status ? 'Active' : 'Inactive';
        this.handleChange();
      },
      deep: true,
    },
  },
  methods: {
    handleChange() {
      this.$emit('onChange', this.status_text);
    },
  },
};
</script>

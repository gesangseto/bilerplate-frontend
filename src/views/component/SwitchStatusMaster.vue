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
      status: true,
    };
  },
  computed: {
    status_text() {
      return this.status ? 'Active' : 'Inactive';
    },
  },
  watch: {
    default_value: {
      immediate: true,
      handler(n) {
        this.status = String(n).toLowerCase() == 'active';
      },
      deep: true,
    },
    status: {
      handler() {
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

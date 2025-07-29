<template>
  <div style="justify-content: center; align-items: center">
    <CSwitch
      color="success"
      :checked.sync="status"
      :disabled="disabled"
      style="margin-left: 5px"
      description="TEST"
    />
    <p
      style="margin-top: -5px; font-size: 12px; text-align: center"
      v-if="show_label"
    >
      {{ show_label ? (this.status ? 'Yes' : 'No') : '' }}
    </p>
    <p style="font-size: smaller; color: rgb(143, 143, 143)">
      {{ description || '' }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SwitchDefault',
  props: {
    show_label: { type: Boolean, default: false },
    default_value: { type: [Boolean, Number], default: false },
    disabled: { type: Boolean, default: false },
    description: { type: String, default: null },
  },
  mounted() {},
  data() {
    return {
      status: this.default_value ? true : false, // Pastikan selalu boolean
    };
  },
  watch: {
    default_value: {
      immediate: true,
      handler(newVal) {
        this.status = !!newVal;
      },
    },
    status: {
      handler(newVal) {
        this.handleChange(newVal);
      },
      deep: true,
    },
  },
  methods: {
    handleChange(value) {
      let res = typeof this.default_value === 'boolean' ? value : value ? 1 : 0;
      this.$emit('onChange', res);
    },
  },
};
</script>

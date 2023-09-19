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
      {{ show_label ? status_text : '' }}
    </p>
    <p v-if="description" style="font-size: smaller; color: rgb(143, 143, 143)">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SwitchDefault',
  props: ['show_label', 'default_value', 'disabled', 'description'],
  mounted() {},
  data() {
    return {
      status_text: 'Yes',
      status: true,
    };
  },
  watch: {
    default_value: {
      handler(n) {
        this.status = n;
      },
      deep: true,
    },
    status: {
      handler() {
        this.status_text = this.status ? 'Yes' : 'No';
        this.handleChange();
      },
      deep: true,
    },
  },
  methods: {
    handleChange() {
      this.$emit('onChange', this.status);
    },
  },
};
</script>

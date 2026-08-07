<template>
  <a :href="href ? href : null">
    <CButton
      type="reset"
      size="sm"
      color="primary"
      class="m-1"
      @click="handleSubmit"
    >
      <CIcon name="cil-check-circle" />
      {{ judul }}
    </CButton>
  </a>
</template>

<script>
export default {
  name: 'ButtonSubmit',
  props: ['type', 'title', 'href'],

  watch: {},
  mounted() {
    if (this.title) {
      this.judul = this.title;
    }
  },
  data() {
    return {
      judul: 'Submit',
      icon: 'cil-check-circle',
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('handleSubmit');
    },
  },
};
</script>

<template>
  <a :href="href ? href : null">
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
import { handleBack } from '../../utils';

export default {
  name: 'ButtonBack',
  props: ['type', 'title', 'href'],

  watch: {},
  mounted() {
    if (this.type === 'back') {
      this.icon = 'cil-arrow-left';
    } else {
      this.icon = 'cil-ban';
    }
    if (this.title) {
      this.judul = this.title;
    }
  },
  data() {
    return {
      judul: 'Cancel',
      icon: 'cil-ban',
    };
  },
  methods: {
    cancel() {
      handleBack(this.$router, this.$route);
      return;
      const path = this.$route.path;
      const params = this.$route.params;
      const { type, id } = params;
      let updatedPath = path;
      if (type) updatedPath = updatedPath.replace(`/${type}`, '');
      if (id) updatedPath = updatedPath.replace(`/${id}`, '');
      this.$router.replace({ path: updatedPath });
    },
  },
};
</script>

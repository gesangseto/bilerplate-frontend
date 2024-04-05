<template>
  <!-- Bacth No -->
  <div class="form-group row">
    <label for="product-name" class="col-sm-4 col-md-4 col-lg-4 form-label">
      {{ title }}
      <strong v-if="required" class="text-danger">*</strong>
    </label>
    <div class="col-sm-8 col-md-8 col-lg-8">
      <v-select
        placeholder="--Select--"
        :options="options"
        :reduce="(opt) => opt.value"
        v-model="formData"
        @input="handleChange()"
        required="is_valid"
      >
        <template #no-options="{ search, searching, loading }">
          Sorry, no matching item.
        </template>
        <template #footer v-if="is_valid === false ? true : false">
          <div style="color: red; font-size: x-small">
            {{ title }} is required
          </div>
        </template>
      </v-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectOption',
  props: ['options', 'title', 'required', 'is_valid'],

  watch: {
    id: {
      deep: true,
      handler(n) {},
    },
  },
  mounted() {},
  data() {
    return {
      formData: null,
    };
  },
  methods: {
    handleChange() {
      this.$emit('onchange', this.formData);
      console.log(this.formData);
    },
  },
};
</script>

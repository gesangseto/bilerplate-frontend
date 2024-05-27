<template>
  <!-- Bacth No -->
  <div class="form-group row">
    <label for="product-name" :class="class_title">
      {{ title }}
      <strong v-if="required" class="text-danger">*</strong>
    </label>
    <div :class="class_option">
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
        <template #footer v-if="description">
          <div style="color: gray; font-size: x-small">
            {{ description }}
          </div>
        </template>
      </v-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectOption',
  props: [
    'options',
    'title',
    'required',
    'is_valid',
    'col_title',
    'col_option',
    'description',
    'defaultValue',
  ],

  watch: {
    id: {
      deep: true,
      handler(n) {},
    },
  },
  mounted() {
    if (this.col_title) {
      this.class_title = `col-sm-${this.col_title} col-md-${this.col_title} col-lg-${this.col_title} form-label`;
    }
    if (this.col_option) {
      this.class_option = `col-sm-${this.col_option} col-md-${this.col_option} col-lg-${this.col_option}`;
    }
    if (this.defaultValue) this.formData = this.defaultValue;
  },
  data() {
    return {
      formData: null,
      class_title: 'col-sm-4 col-md-4 col-lg-4 form-label',
      class_option: 'col-sm-8 col-md-8 col-lg-8',
    };
  },
  methods: {
    handleChange() {
      this.$emit('onchange', this.formData);
    },
  },
};
</script>

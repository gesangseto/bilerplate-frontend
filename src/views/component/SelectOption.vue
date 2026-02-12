<template>
  <!-- Batch No -->
  <div>
    <CRow>
      <CCol v-if="title" :md="col[0]">
        <label for="product-name">
          {{ title }}
          <strong v-if="required" class="text-danger">*</strong>
        </label>
      </CCol>
      <CCol :md="title ? col[1] : '12'">
        <v-select
          :disabled="disabled"
          :placeholder="placeholder"
          :options="options"
          :reduce="(opt) => opt.value"
          v-model="localValue"
          @input="handleChange($event)"
          :required="required"
          :class="{
            'style-invalid': isValid === false,
            'style-valid': isValid === true,
          }"
        >
          <template #no-options="{ search, searching, loading }">
            Sorry, no matching item.
          </template>
        </v-select>
        <div
          style="color: red; font-size: x-small"
          v-if="invalid_feedback && isValid === false ? true : false"
        >
          {{ invalid_feedback }}
        </div>
        <div v-if="description" style="color: grey; font-size: x-small">
          {{ description }}
        </div>
      </CCol>
    </CRow>
    <br />
  </div>
</template>

<style>
.style-invalid {
  border: 1px solid red;
  border-radius: 5px;
}
.style-valid {
  border: 0.5px solid #0be30f;
  border-radius: 5px;
}
</style>
<script>
export default {
  name: 'SelectOption',
  props: {
    value: { type: [String, Number], default: '' }, // Menerima tipe String atau Number
    options: { type: Array, default: () => [] },
    validasi: { type: String, default: null },
    max: { type: Number, default: null },
    title: { type: String, default: null },
    description: { type: String, default: '' },
    placeholder: { type: String, default: '--Select--' },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
    invalid_feedback: { type: String, default: null },
    disabled: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
    col: { type: Array, default: () => [3, 9] }, // Properti isValid untuk menentukan validasi input
  },
  watch: {
    // Memperbarui data lokal jika prop value berubah
    value(newValue) {
      this.localValue = newValue;
    },
    // Emit event jika nilai data lokal berubah
    localValue(newValue) {
      this.$emit('update:value', newValue); // Gunakan 'update:value' untuk v-model
    },
  },
  mounted() {},
  data() {
    return {
      // value: null,
      localValue: this.value, // Salin nilai prop ke data lokal
    };
  },
  methods: {
    handleChange($event) {
      this.$emit('onchange', $event);
    },
  },
};
</script>

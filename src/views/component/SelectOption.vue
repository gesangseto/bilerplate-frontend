<template>
  <!-- Bacth No -->
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
          placeholder="--Select--"
          :options="options"
          :reduce="(opt) => opt.value"
          v-model="localValue"
          @input="handleChange($event)"
          :required="required"
        >
          <template #no-options="{ search, searching, loading }">
            Sorry, no matching item.
          </template>
          <template #footer>
            <div
              style="color: red; font-size: x-small"
              v-if="!description && isValid === false ? true : false"
            >
              {{ title }} is required
            </div>
            <div
              :style="`color: ${
                isValid === false ? 'red' : 'grey'
              }; font-size: x-small`"
            >
              {{ description }}
            </div>
          </template>
        </v-select>
      </CCol>
    </CRow>
    <br />
  </div>
</template>

<script>
import { CCol } from '@coreui/vue';

export default {
  name: 'SelectOption',
  props: {
    value: { type: [String, Number], default: '' }, // Menerima tipe String atau Number
    options: { type: Array, default: () => [] },
    validasi: { type: String, default: null },
    max: { type: Number, default: null },
    title: { type: String, default: null },
    description: { type: String, default: '' },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
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

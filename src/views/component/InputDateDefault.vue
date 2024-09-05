<template>
  <div>
    <CRow>
      <CCol v-if="title" md="3">
        {{ title }}
        <span v-if="required" class="text-danger">
          <strong>*</strong>
        </span>
      </CCol>
      <CCol md="9">
        <div class="input-wrapper">
          <input
            type="date"
            :disabled="disabled"
            class="form-control"
            v-model="internalValue"
            @input="handleInput"
            :placeholder="required ? `Please input ${title}` : ''"
            :class="{
              'is-valid': isValid === true,
              'is-invalid': isValid === false,
            }"
          />
          <!-- Slot untuk append -->
          <slot name="append"></slot>
        </div>
      </CCol>
    </CRow>
    <br v-if="!this.$slots.append" />
  </div>
</template>

<script>
export default {
  name: 'InputDateDefault',
  props: {
    value: { type: [String, Number], default: '' },
    title: { type: String, default: 'No Title' },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: null },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      internalValue: '', // Nilai internal untuk v-model
    };
  },
  mounted() {
    this.convertValueToString(); // Mengonversi nilai value ke string saat komponen dimuat
  },
  watch: {
    value(newValue) {
      this.convertValueToString(); // Memantau perubahan nilai value
    },
    internalValue(newInput) {
      this.$emit('change', newInput); // Emit event change untuk v-model
    },
  },
  methods: {
    handleInput(event) {
      this.internalValue = event.target.value; // Mengubah nilai internal saat input berubah
      this.$emit('input', this.internalValue); // Emit event input untuk v-model
    },
    convertValueToString() {
      if (this.value || this.value === 0) {
        this.internalValue = String(this.value); // Mengonversi nilai value ke string
      } else {
        this.internalValue = ''; // Mengosongkan internalValue jika value kosong
      }
    },
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: red; /* Warna merah untuk input tidak valid */
}
.is-valid {
  border-color: green; /* Warna hijau untuk input valid */
}
.input-wrapper {
  display: flex;
}
</style>

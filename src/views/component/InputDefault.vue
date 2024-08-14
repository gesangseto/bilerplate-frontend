<template>
  <div>
    <CRow>
      <CCol :md="col[0]">
        {{ title }}
        <span v-if="required" class="text-danger">
          <strong>*</strong>
        </span>
      </CCol>
      <CCol :md="col[1]">
        <input
          :disabled="disabled"
          class="form-control"
          v-model="internalValue"
          @keypress="validateInput"
          @input="cleanInput"
          :placeholder="required ? `Please input ${title}` : ''"
          :class="isValid === null ? null : isValid ? 'is-valid' : 'is-invalid'"
        />
      </CCol>
    </CRow>
    <br />
  </div>
</template>

<script>
export default {
  name: 'InputDefault',
  props: {
    value: { type: [String, Number], default: '' }, // Menerima tipe String atau Number
    options: {
      type: Object,
      default: () => ({ uppercase: false, nospace: false }),
    },
    validasi: { type: String, default: null },
    max: { type: Number, default: null },
    title: { type: String, default: 'No Title' },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
    disabled: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
    col: { type: Array, default: () => [3, 9] }, // Properti isValid untuk menentukan validasi input
  },
  data() {
    return {
      internalValue: '', // Memulai dengan nilai string kosong
      regex: null,
      regexValidation: null,
    };
  },
  mounted() {
    this.convertValueToString(); // Panggil method untuk mengonversi nilai value ke string
    this.initializeRegex(); // Inisialisasi regex berdasarkan validasi yang diberikan
  },
  watch: {
    value(newValue) {
      this.convertValueToString(); // Panggil method saat nilai value berubah
    },
    internalValue(newInput) {
      this.$emit('input', newInput); // Emit input event untuk v-model
    },
  },
  methods: {
    validateInput(event) {
      const char = String.fromCharCode(event.keyCode || event.which);
      const isValid = this.validasi ? this.regexValidation.test(char) : true;
      if (!isValid || (this.max && this.internalValue.length >= this.max)) {
        event.preventDefault();
      }
    },
    cleanInput(event) {
      let cleanedValue = event.target.value;
      if (this.validasi) {
        cleanedValue = cleanedValue.replace(this.regex, '');
      }
      if (this.max && cleanedValue.length > this.max) {
        cleanedValue = cleanedValue.substring(0, this.max);
      }
      if (this.options.uppercase) {
        cleanedValue = cleanedValue.toUpperCase();
      }
      if (this.options.nospace) {
        cleanedValue = cleanedValue.trim();
      }
      if (this.validasi == 'numeric') {
        cleanedValue = cleanedValue.replace(/^0+/, '');
      }

      this.internalValue = cleanedValue;
    },
    convertValueToString() {
      if (this.value || this.value == 0) {
        // Mengonversi nilai value ke string
        this.internalValue = String(this.value);
      } else {
        this.internalValue = '';
      }
    },
    initializeRegex() {
      // Inisialisasi regex berdasarkan validasi yang diberikan
      if (this.validasi === 'alphanumeric') {
        this.regex = /[^a-zA-Z0-9]/g;
        this.regexValidation = /^[a-zA-Z0-9]*$/;
      } else if (this.validasi === 'numeric') {
        this.regex = /[^0-9]/g;
        this.regexValidation = /^[0-9]$/;
      }
    },
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: red; /* Menjadikan input merah jika tidak valid */
}
.is-valid {
  border-color: green; /* Menjadikan input hijau jika valid */
}
</style>

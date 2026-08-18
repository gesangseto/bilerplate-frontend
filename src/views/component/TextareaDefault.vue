<template>
  <div>
    <CRow>
      <CCol v-if="title" :md="col[0]" style="color: #3c4b64">
        {{ title }}
        <span v-if="required" class="text-danger">
          <strong>*</strong>
        </span>
      </CCol>
      <CCol :md="title ? col[1] : '12'">
        <div class="input-wrapper">
          <!-- Slot untuk prepend -->
          <slot name="prepend"></slot>
          <textarea
            :rows="rows.toString()"
            :disabled="disabled"
            class="form-control"
            :type="type"
            v-model="internalValue"
            @keypress="validateInput"
            @input="handleInput"
            @blur="handleBlur"
            :placeholder="
              placeholder
                ? placeholder
                : required
                ? `Please input ${title}`
                : ''
            "
            :class="
              isValid === null ? null : isValid ? 'is-valid' : 'is-invalid'
            "
          />
          <!-- Slot untuk append -->
          <slot name="append"></slot>
        </div>
        <div
          v-if="
            isValid === null
              ? false
              : !isValid && invalid_feedback
              ? true
              : false
          "
          class="mb-0 mt-0"
          style="font-size: x-small; color: red"
          v-html="formattedInvalidFeedback"
        ></div>

        <p
          class="mb-0 mt-0"
          style="font-size: smaller; color: rgb(143, 143, 143)"
          v-if="description"
        >
          {{ description }}
        </p>
      </CCol>
    </CRow>
    <br />
  </div>
</template>

<script>
export default {
  name: 'TextareaDefault',
  props: {
    value: { type: [String, Number], default: '' }, // Menerima tipe String atau Number
    options: {
      type: Object,
      default: () => ({ uppercase: false, nospace: false }),
    },
    invalid_feedback: { type: String, default: null },
    type: { type: String, default: 'text' },
    validasi: { type: String, default: null },
    max: { type: Number, default: null },
    title: { type: String, default: null },
    description: { type: String, default: '' },
    placeholder: { type: String },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
    disabled: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
    col: { type: Array, default: () => [3, 9] }, // Properti isValid untuk menentukan validasi input
    rows: { type: [String, Number], default: '2' }, // Properti isValid untuk menentukan validasi input
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
      this.$emit('change', newInput); // Emit input event untuk v-model
    },
  },
  methods: {
    validateInput(event) {
      const char = String.fromCharCode(event.keyCode || event.which);
      let isValid = true;
      if (this.validasi && this.regexValidation) {
        isValid = this.regexValidation.test(char);
      }
      if (!isValid || (this.max && this.internalValue.length >= this.max)) {
        event.preventDefault();
      }
    },
    handleInput(event) {
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
      if (this.options.nodoublespace) {
        cleanedValue = cleanedValue.replace(/\s\s+/g, ' ');
      }
      if (this.validasi == 'numeric') {
        cleanedValue = cleanedValue.replace(/^0+/, '');
      }
      this.internalValue = cleanedValue;
      this.$emit('input', this.internalValue); // Emit event input untuk v-model
    },
    handleBlur() {
      this.internalValue = this.internalValue.trim(); // hilangkan spasi di awal & akhir
      this.$emit('input', this.internalValue);
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
      } else if (this.validasi === 'float') {
        this.regex = /[^-?\d*.\d+]/g;
        this.regexValidation = /^-?\d*\.?\d*$/; // Menerima float dengan atau tanpa angka di depan titik
      }
    },
  },
  computed: {
    formattedInvalidFeedback() {
      // Mengganti karakter newline (\n) dengan <br>
      return this.invalid_feedback
        ? this.invalid_feedback.replace(/\n/g, '<br>')
        : '';
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
.input-wrapper {
  display: flex;
}
.invalid-feedback {
  font-size: x-small;
  color: red;
}
</style>

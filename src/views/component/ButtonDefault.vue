<template>
  <div>
    <CRow>
      <CCol v-if="title" :md="col[0]">
        {{ title }}
        <span v-if="required" class="text-danger">
          <strong>*</strong>
        </span>
        <span v-if="optional" class="text-danger">
          <strong>***</strong>
        </span>
      </CCol>
      <CCol :md="title ? col[1] : '12'">
        <div class="input-wrapper">
          <!-- Slot untuk prepend -->
          <slot name="prepend"></slot>

          <a :href="href ? href : null">
            <CButton
              :class="property.class"
              v-c-tooltip="property.tooltip"
              style="margin: 2px; text-align: center"
              size="sm"
              :color="property.color"
              v-on:click="!useHref ? $emit('click', $event.target.value) : null"
            >
              <v-icon
                style="vertical-align: -0.175em"
                v-if="property.icon"
                :name="property.icon"
              />
              {{ property.text ? `&nbsp;${property.text}&nbsp;` : null }}
            </CButton>
          </a>

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

        <!-- Slot untuk description -->
        <slot name="description"></slot>
        <p
          class="mb-0 mt-0"
          style="
            font-size: smaller;
            color: rgb(143, 143, 143);
            white-space: pre-line;
          "
          v-if="description"
        >
          {{ description }}
        </p>
      </CCol>
    </CRow>
  </div>
</template>

<script>
export default {
  name: 'ButtonDefault',

  props: {
    value: { type: [String, Number], default: '' }, // Menerima tipe String atau Number
    options: {
      type: Object,
      default: () => ({ uppercase: false, nospace: false }),
    },
    type: { default: null },
    buttonProperty: { default: null },
    useHref: { default: null },
    id: { default: null },
    invalid_feedback: { type: String, default: null },
    type: { type: String, default: 'text' },
    validasi: { type: String, default: null },
    max: { type: Number, default: null },
    title: { type: String, default: null },
    description: { type: String, default: '' },
    placeholder: { type: String },
    optional: { type: Boolean, default: null },
    useBr: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: null }, // Properti isValid untuk menentukan validasi input
    disabled: { default: null }, // Properti isValid untuk menentukan validasi input
    col: { type: Array, default: () => [3, 9] }, // Properti isValid untuk menentukan validasi input
  },
  watch: {
    id: {
      deep: true,
      handler(n) {
        if (this.useHref) {
          this.href = `#${this.$route.path}/${this.type}`;
          if (n) this.href += `/${n}`;
        }
      },
    },
    buttonProperty: {
      handler(n, o) {},
      deep: true,
    },
  },
  mounted() {
    if (this.useHref) {
      this.href = `#${this.$route.path}/${this.type}`;
      if (this.id) this.href += `/${this.id}`;
    }
    if (this.type == 'create') {
      this.property.color = 'success';
      this.property.icon = 'plus';
      this.property.text = ' Add';
    } else if (this.type == 'read') {
      this.property.icon = 'eye';
      this.property.color = 'info';
      this.property.tooltip = 'View';
    } else if (this.type == 'update') {
      this.property.color = 'warning';
      this.property.icon = 'pencil-alt';
      this.property.tooltip = 'Edit';
    } else if (this.type == 'delete') {
      this.property.color = 'danger';
      this.property.icon = 'trash-alt';
      this.property.tooltip = 'Delete';
    } else if (this.type == 'print') {
      this.property.color = 'secondary';
      this.property.icon = 'print';
    } else if (this.type == 'approve') {
      this.property.icon = 'clipboard-check';
      this.property.color = 'success';
      this.property.tooltip = 'Approve / Reject';
    } else if (this.type == 'barcode') {
      this.property.icon = 'barcode';
      this.property.color = 'success';
      this.property.tooltip = 'Show Barcode';
    }
    if (this.buttonProperty) {
      this.property = this.buttonProperty;
    }
  },
  data() {
    return {
      is_visible: false,
      property: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: '',
        text: '',
        tooltip: '',
      },
      href: null,
    };
  },
  methods: {},
};
</script>

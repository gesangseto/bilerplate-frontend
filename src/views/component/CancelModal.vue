<template>
  <div>
    <CModal
      centered="centered"
      :show.sync="property.modal"
      :title="`${capitalFirst(type)} ${property.title} (ID: ${property.id})`"
      color="danger"
    >
      <CRow>
        <CCol sm="12" md="12" lg="12">
          <CRow>
            <p style="margin-left: 20px; margin-right: 20px">
              You are about to {{ type }} this
              {{ is_master ? 'data' : 'transaction' }}. This operation cannot be
              undone. If you wish to continue, please input the Reason and click
              Submit button.
            </p>
            <CCol sm="2" md="2" lg="2">
              <label for="reason">Reason</label>
            </CCol>
            <CCol sm="10" md="10" lg="10">
              <CTextarea
                rows="5"
                placeholder="Enter The Reason"
                id="reject-reason"
                invalid-feedback="Reason is required"
                v-model="property.reason"
                :is-valid="
                  initial_load ? null : !property.reason ? false : true
                "
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton @click="handleSubmit()" color="primary">
          <CIcon name="cil-check-circle" /> Submit</CButton
        >
        <CButton @click="closeModal()" color="danger">
          <CIcon name="cil-ban" /> Cancel</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import { capitalizeFirstLetter } from '../../utils';

export default {
  name: 'CancelModal',
  props: {
    type: { type: String },
    skip_confirmation: { type: Boolean, default: false },
    is_master: { type: Boolean, default: false },
    property: {
      type: Object,
      default: () => ({ modal: false, reason: '', remark: '', id: null }),
    },
  },
  data() {
    return {
      initial_load: true,
    };
  },
  watch: {
    // Reset otomatis kapanpun modal tertutup,
    // baik lewat Cancel, Submit, tombol X, ESC, atau klik backdrop
    'property.modal'(isOpen) {
      if (!isOpen) {
        this.resetForm();
      } else {
        // pastikan status validasi bersih setiap kali modal dibuka
        this.initial_load = true;
      }
    },
  },
  methods: {
    resetForm() {
      this.property.reason = '';
      if ('remark' in this.property) this.property.remark = '';
      this.initial_load = true;
    },
    closeModal() {
      this.property.modal = false;
      // watcher di atas akan otomatis memanggil resetForm()
    },
    is_valid() {
      return !!this.property.reason?.trim();
    },
    handleSubmit() {
      this.initial_load = false;

      if (!this.is_valid()) return;

      let msg = `You are about to ${this.type} this ${
        this.is_master ? 'data' : 'transaction'
      }. This operation cannot be undone. Would you like to continue?`;
      if (this.skip_confirmation) {
        this.$emit('handleSubmit', this.property);
        this.closeModal();
      } else if (confirm(msg)) {
        this.$emit('handleSubmit', this.property);
        this.closeModal();
      }
    },
    capitalFirst(item) {
      return capitalizeFirstLetter(item);
    },
  },
};
</script>

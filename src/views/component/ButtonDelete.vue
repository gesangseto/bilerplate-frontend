<template>
  <div>
    <a :href="href ? href : null">
      <CButton
        type="reset"
        size="sm"
        color="primary"
        class="m-1"
        @click="openModal"
      >
        <CIcon name="cil-check-circle" /> {{ judul }}
      </CButton>
    </a>
    <CModal
      centered="centered"
      :show.sync="showModal"
      title="Reason"
      color="danger"
      @show="onModalShow"
      @hidden="onModalHidden"
    >
      <CRow>
        <CCol sm="12" md="12" lg="12">
          <CRow>
            <p style="margin-left: 20px; margin-right: 20px">
              You are about to {{ type }} this data. This operation cannot be
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
                :value="localReason"
                @input="handleReasonChange"
                :is-valid="initial_load ? null : !localReason ? false : true"
                invalid-feedback="Reason is required"
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton @click="handleSubmit" color="primary">
          <CIcon name="cil-check-circle" size="sm" /> Submit
        </CButton>
        <CButton @click="closeModal" color="danger">
          <CIcon name="cil-ban" size="sm" /> Cancel
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { capitalizeFirstLetter } from '../../utils';

export default {
  name: 'ButtonDelete',

  props: {
    property: Object,
    type: {
      type: String,
      default: 'update',
    },
    title: String,
    href: String,
    reason: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      initial_load: true,
      judul: 'Submit',
      showModal: false,
      localReason: '',
    };
  },

  watch: {
    reason: {
      immediate: true,
      handler(val) {
        // Hanya update jika modal tidak sedang terbuka
        if (!this.showModal) {
          this.localReason = val || '';
        }
      },
    },
  },

  mounted() {
    this.icon = 'cil-ban';

    if (this.title) {
      this.judul = this.title;
    }
  },

  methods: {
    /**
     * Buka modal dan reset reason
     */
    openModal() {
      // Reset reason sebelum modal terbuka
      this.localReason = '';
      this.showModal = true;
    },

    /**
     * Tutup modal
     */
    closeModal() {
      this.showModal = false;
      // Reset reason setelah modal ditutup
      this.localReason = '';
    },

    /**
     * Event saat modal selesai ditampilkan
     */
    onModalShow() {
      // Fokus ke textarea (opsional)
      this.$nextTick(() => {
        const textarea = document.getElementById('reject-reason');
        if (textarea) {
          textarea.focus();
        }
      });
    },

    /**
     * Event saat modal ditutup
     */
    onModalHidden() {
      // Reset semua state
      this.localReason = '';
      // Emit event ke parent bahwa modal ditutup
      this.$emit('modal-closed');
    },

    /**
     * Handle perubahan textarea
     */
    handleReasonChange(value) {
      this.localReason = value;
      // Emit event ke parent agar data.reason berubah
      this.$emit('update:reason', value);
      this.$emit('reason-change', value);

      // Jika ada validasi, emit status
      if (this.required) {
        this.$emit('reason-valid', !!value && value.trim().length > 0);
      }
    },

    /**
     * Handle submit
     */
    handleSubmit() {
      this.initial_load = false;
      // Validasi jika reason required
      if (this.required && !this.localReason) {
        return;
      }

      // Kirim property dan reason ke parent
      this.$emit('handleSubmit', {
        ...this.property,
        reason: this.localReason,
      });

      // Tutup modal
      this.showModal = false;

      // Reset reason setelah submit
      this.localReason = '';
    },

    capitalFirst(item) {
      return capitalizeFirstLetter(item);
    },

    /**
     * Reset reason ke nilai awal (dipanggil dari parent)
     */
    resetReason() {
      this.localReason = this.reason || '';
      this.$emit('update:reason', this.localReason);
    },
  },
};
</script>

<template>
  <div>
    <a @click="openModal">
      <CIcon name="cil-info" size="xl" style="cursor: pointer" />
    </a>

    <transition name="fade">
      <div
        v-if="showModal"
        class="custom-modal-overlay"
        @click.self="closeModal"
      >
        <div class="custom-modal">
          <!-- Header -->
          <div class="custom-modal-header">
            <div class="header-title">
              <CIcon name="cil-info" size="xl" />
              <span>Information</span>
            </div>

            <button class="close-btn" @click="closeModal">×</button>
          </div>

          <!-- Body -->
          <div class="custom-modal-body">
            <CRow>
              <CCol sm="6">
                <InputDefault
                  :col="[4, 8]"
                  title="Created Date"
                  :value="localData.created_date"
                  disabled
                />

                <InputDefault
                  :col="[4, 8]"
                  title="Created By"
                  :value="localData.created_full_name"
                  disabled
                />
              </CCol>

              <CCol sm="6">
                <InputDefault
                  :col="[4, 8]"
                  title="Last Update Date"
                  :value="localData.modified_date"
                  disabled
                />

                <InputDefault
                  :col="[4, 8]"
                  title="Last Update By"
                  :value="localData.modified_full_name"
                  disabled
                />

                <TextareaDefault
                  v-if="localData.reason"
                  rows="3"
                  :col="[4, 8]"
                  title="Last Update Reason"
                  v-model="localData.reason"
                  disabled
                />
              </CCol>
            </CRow>
          </div>

          <!-- Footer -->
          <div class="custom-modal-footer">
            <CButton size="sm" color="danger" type="button" @click="closeModal">
              <CIcon name="cil-x-circle" /> Close
            </CButton>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.custom-modal {
  width: 900px;
  max-width: 95%;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.custom-modal-header {
  background: #000060;
  color: #fff;
  padding: 14px 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  border: none;
  background: transparent;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  opacity: 0.8;
}

.custom-modal-body {
  padding: 25px;
  max-height: 70vh;
  overflow: auto;
}

.custom-modal-footer {
  border-top: 1px solid #ddd;
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
<

<script>
export default {
  name: 'ButtonInfo',

  props: {
    formData: {
      type: Object,
      default: () => ({
        created_date: '',
        created_by: '',
        modified_date: '',
        modified_by: '',
        reason: '',
      }),
    },
  },

  data() {
    return {
      initialLoad: true,
      showModal: false,
      localData: {
        created_date: '',
        created_by: '',
        modified_date: '',
        modified_by: '',
        reason: '',
      },
    };
  },
  watch: {
    formData: {
      immediate: true,
      handler(val) {
        if (val?.id && this.initialLoad) {
          this.localData = { ...this.formData };
        }
      },
    },
  },
  mounted() {
    this.localData = { ...this.formData };
  },

  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    onModalHidden() {
      this.$emit('modal-closed');
    },
  },
};
</script>

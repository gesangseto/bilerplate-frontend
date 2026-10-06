<template>
  <div class="app-modal">
    <CModal
      centered="centered"
      :show.sync="property.modal"
      :title="modalTitle"
      :color="modalColor"
    >
      <div
        class="app-modal-alert"
        :class="
          action === 'finish'
            ? 'app-modal-alert--success'
            : 'app-modal-alert--danger'
        "
      >
        <CIcon
          :name="action === 'finish' ? 'cil-check-circle' : 'cil-warning'"
        />
        <span>{{ modalMessage }}</span>
      </div>

      <div v-if="item" class="app-modal-info">
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">ID</span>
          <span class="app-modal-info__value">{{ item.id }}</span>
        </div>
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">Status</span>
          <span class="app-modal-info__value">{{
            item.status_name || '-'
          }}</span>
        </div>
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">Customer</span>
          <span class="app-modal-info__value">{{
            item.customer_name || '-'
          }}</span>
        </div>
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">Qty</span>
          <span class="app-modal-info__value">{{ item.quantity || '-' }}</span>
        </div>
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">Courier</span>
          <span class="app-modal-info__value">{{
            item.courier_name || '-'
          }}</span>
        </div>
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">Weight</span>
          <span class="app-modal-info__value">{{ item.weight || '-' }}</span>
        </div>
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">Resi No</span>
          <span class="app-modal-info__value">{{
            item.courier_number || '-'
          }}</span>
        </div>
        <div class="app-modal-info__item">
          <span class="app-modal-info__label">Courier Price</span>
          <span class="app-modal-info__value">{{
            item.courier_price || '-'
          }}</span>
        </div>
      </div>

      <div v-if="needReason">
        <div class="app-modal-section-title">
          Reason <span class="text-danger">*</span>
        </div>
        <CTextarea
          rows="4"
          placeholder="Enter the reason..."
          id="reject-reason"
          invalid-feedback="Reason is required"
          v-model="property.reason"
        />
      </div>

      <template #footer>
        <CButton color="secondary" outline @click="property.modal = false">
          <CIcon name="cil-ban" /> Cancel
        </CButton>
        <CButton :color="modalColor" @click="handleSubmit()">
          <CIcon name="cil-check-circle" />
          {{ action === 'finish' ? 'Finish' : 'Submit' }}
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
export default {
  name: 'PickingActionModal',
  props: {
    property: { type: Object, default: () => ({}) },
    item: { type: Object, default: null },
  },
  computed: {
    action() {
      return this.property.action || 'cancel';
    },
    needReason() {
      return this.action !== 'finish';
    },
    modalTitle() {
      let label = {
        finish: 'Finish Picking',
        not_delivery: 'Not Delivery',
        cancel: 'Cancel Picking',
      };
      return label[this.action] || 'Confirm';
    },
    modalColor() {
      return this.action === 'finish' ? 'success' : 'danger';
    },
    modalMessage() {
      if (this.action === 'finish') {
        return 'You are about to finish this picking. This operation cannot be undone. Would you like to continue?';
      }
      return 'You are about to mark this picking as not delivered / canceled. This operation cannot be undone. If you wish to continue, please input the Reason and click Submit button.';
    },
  },
  methods: {
    handleSubmit() {
      if (this.needReason && !(this.property.reason || '').trim()) {
        this.$toast.open({
          message: 'Please input the reason.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let msg = `You are about to ${this.action} this transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(msg)) {
        this.$emit('handleSubmit', this.property);
        this.property.modal = false;
      }
    },
  },
};
</script>
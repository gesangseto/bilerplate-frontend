<template>
  <div>
    <CModal
      centered="centered"
      :show.sync="property.modal"
      :title="modalTitle"
      :color="modalColor"
    >
      <CRow>
        <CCol sm="12" md="12" lg="12">
          <CRow>
            <p style="margin-left: 20px; margin-right: 20px">
              {{ modalMessage }}
            </p>
          </CRow>
          <CRow v-if="item">
            <CCol sm="12" md="12" lg="12">
              <table
                class="table table-sm table-bordered"
                style="font-size: 12px"
              >
                <tbody>
                  <tr>
                    <th style="width: 40%">ID</th>
                    <td>{{ item.id }}</td>
                  </tr>
                  <tr>
                    <th>Customer</th>
                    <td>{{ item.customer_name || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Courier</th>
                    <td>{{ item.courier_name || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Resi No</th>
                    <td>{{ item.courier_number || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Courier Price</th>
                    <td>{{ item.courier_price || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Weight</th>
                    <td>{{ item.weight || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Qty</th>
                    <td>{{ item.quantity || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{{ item.status_name || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </CCol>
          </CRow>
          <CRow v-if="needReason">
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
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton @click="handleSubmit()" color="primary">
          <CIcon name="cil-check-circle" /> Submit</CButton
        >
        <CButton @click="property.modal = false" color="danger">
          <CIcon name="cil-ban" /> Cancel</CButton
        >
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
      return `${label[this.action] || 'Confirm'} (ID: ${this.property.id})`;
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
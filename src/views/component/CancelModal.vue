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
              You are about to {{ type }} this transaction. This operation
              cannot be undone. If you wish to continue, please input the Reason
              and click Submit button.
            </p>
            <CCol sm="2" md="2" lg="2">
              <label for="reason">Reason</label>
            </CCol>
            <CCol sm="10" md="10" lg="10">
              <CTextarea
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
import { capitalizeFirstLetter } from "../../utils";
export default {
  name: "CancelModal",
  props: { property: Object, type: String },
  mounted() {},
  data() {
    return {
      result: this.resetForm(),
    };
  },
  methods: {
    resetForm() {
      return {
        id: null,
        modal: false,
        reason: "",
      };
    },
    handleSubmit() {
      let msg = ` You are about to ${this.type} this transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(msg)) {
        this.$emit("handleSubmit", this.property);
        this.property.modal = false;
      }
    },
    capitalFirst(item) {
      return capitalizeFirstLetter(item);
    },
  },
};
</script>

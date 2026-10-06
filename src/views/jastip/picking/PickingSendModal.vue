<template>
  <div class="app-modal">
    <CModal
      centered="centered"
      :show.sync="property.modal"
      title="Send Picking"
      color="success"
    >
      <div class="app-modal-alert app-modal-alert--info">
        <CIcon name="cil-truck" />
        <span>
          Input courier and shipping details below. Submit will dispatch
          this picking to the customer (status becomes In Courier).
        </span>
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
      </div>

      <div class="app-modal-section-title">Shipping Details</div>

      <CRow>
        <CCol sm="12">
          <SelectOption
            title="Courier"
            placeholder="--Select Active Courier--"
            required
            :options="listCourier"
            :value="property.courier_id"
            :col="['12', '12']"
            v-on:onchange="property.courier_id = $event"
            :is-valid="
              showValidation ? (property.courier_id ? true : false) : null
            "
          />
        </CCol>
        <CCol sm="6">
          <InputDefault
            title="Weight (kg)"
            placeholder="0"
            :col="['12', '12']"
            validasi="float"
            v-model="property.weight"
          />
        </CCol>
        <CCol sm="6">
          <InputDefault
            title="Courier Number (Resi No)"
            placeholder="Nomor resi"
            required
            :col="['12', '12']"
            v-model="property.courier_number"
            :is-valid="
              showValidation
                ? (property.courier_number || '').trim()
                  ? true
                  : false
                : null
            "
            invalid-feedback="Courier number (resi no) is required"
          />
        </CCol>
        <CCol sm="6">
          <InputDefault
            title="Courier Price"
            placeholder="0"
            validasi="float"
            required
            :col="['12', '12']"
            v-model="property.courier_price"
            :is-valid="
              showValidation
                ? property.courier_price === null ||
                  property.courier_price === undefined ||
                  property.courier_price === ''
                  ? false
                  : true
                : null
            "
            invalid-feedback="Courier price is required"
          />
        </CCol>
        <CCol sm="6">
          <InputDefault
            title="Courier Currency"
            placeholder="IDR"
            required
            :col="['12', '12']"
            v-model="property.courier_currency"
            :is-valid="
              showValidation
                ? property.courier_currency
                  ? true
                  : false
                : null
            "
            invalid-feedback="Courier currency is required"
          />
        </CCol>
      </CRow>

      <template #footer>
        <CButton color="secondary" outline @click="property.modal = false">
          <CIcon name="cil-ban" /> Cancel
        </CButton>
        <CButton color="success" @click="handleSubmit()">
          <CIcon name="cil-truck" /> Send
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import $axios from '../../../api';

export default {
  name: 'PickingSendModal',
  props: {
    property: { type: Object, default: () => ({}) },
    item: { type: Object, default: null },
  },
  data() {
    return {
      listCourier: [],
      courierLoaded: false,
      showValidation: false,
    };
  },
  watch: {
    'property.modal'(n) {
      if (n) {
        this.showValidation = false;
        if (!this.courierLoaded) this.loadListCourier();
      }
    },
  },
  methods: {
    loadListCourier() {
      const param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/courier?${param}`).then((result) => {
        const data = (result.data && result.data.data) || [];
        this.listCourier = data.map((it) => ({
          value: it.id,
          label: `${it.name} (${it.code})`,
        }));
        this.courierLoaded = true;
      });
    },
    validate() {
      if (!this.property.courier_id) {
        return 'Please select courier.';
      }
      if (!(this.property.courier_number || '').trim()) {
        return 'Please input courier number (resi no).';
      }
      if (
        this.property.courier_price === null ||
        this.property.courier_price === undefined ||
        this.property.courier_price === ''
      ) {
        return 'Please input courier price.';
      }
      if (!this.property.courier_currency) {
        return 'Please input courier currency.';
      }
      return null;
    },
    handleSubmit() {
      this.showValidation = true;
      const error = this.validate();
      if (error) {
        this.$toast.open({
          message: error,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      const msg =
        'You are about to dispatch this picking to customer. This operation cannot be undone. Would you like to continue?';
      if (confirm(msg)) {
        this.$emit('handleSubmit', { ...this.property });
      }
    },
  },
};
</script>

<template>
  <CRow>
    <CCol col="12" xl="12" sm="12">
      <CCard>
        <CCardHeader>
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ $activeMenu.name }} [{{ actionLabel }}]</h5>
            <CBadge v-if="pickingStatus !== null" :color="statusColor">
              {{ statusLabel }}
            </CBadge>
          </div>
        </CCardHeader>
        <CCardBody class="mb-5 mt-2">
          <CForm novalidate>
            <!-- Card 1: Customer & Receiver -->
            <CCard class="mb-3" color="light">
              <CCardHeader class="py-2">
                <strong>Customer & Receiver Information</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12" md="6">
                    <SelectOption
                      :disabled="!isEditable"
                      title="Customer"
                      placeholder="--Select Customer--"
                      required
                      :options="listCustomer"
                      :value="formData.customer_id"
                      v-on:onchange="onCustomerChange($event)"
                      :is-valid="initialLoad ? null : !formData.customer_id ? false : true"
                    />
                    <InputDefault
                      :disabled="!isEditable"
                      title="Receiver Name"
                      placeholder="Nama penerima"
                      required
                      v-model="formData.receiver_name"
                      :is-valid="initialLoad ? null : !formData.receiver_name ? false : true"
                    />
                    <InputDefault
                      :disabled="!isEditable"
                      title="Receiver Phone"
                      placeholder="No. telpon penerima"
                      required
                      v-model="formData.receiver_phone"
                      :is-valid="initialLoad ? null : !formData.receiver_phone ? false : true"
                    />
                    <TextareaDefault
                      :disabled="!isEditable"
                      title="Receiver Address"
                      placeholder="Alamat penerima"
                      required
                      v-model="formData.receiver_address"
                      :is-valid="initialLoad ? null : !formData.receiver_address ? false : true"
                    />
                  </CCol>
                  <CCol sm="12" md="6">
                    <SelectOption
                      :disabled="!isEditable"
                      title="Courier"
                      placeholder="--Select Active Courier--"
                      required
                      :options="listCourier"
                      :value="formData.courier_id"
                      v-on:onchange="formData.courier_id = $event"
                      :is-valid="initialLoad ? null : !formData.courier_id ? false : true"
                    />
                    <InputDefault
                      :disabled="!isEditable"
                      title="Weight (kg)"
                      placeholder="0"
                      validasi="float"
                      v-model="formData.weight"
                    />
                    <template v-if="showCourierFields">
                      <InputDefault
                        :disabled="!isEditable"
                        title="Courier Number (Resi No)"
                        placeholder="Nomor resi"
                        required
                        v-model="formData.courier_number"
                        :is-valid="initialLoad ? null : !formData.courier_number ? false : true"
                      />
                      <InputDefault
                        :disabled="!isEditable"
                        title="Courier Price"
                        placeholder="0"
                        validasi="float"
                        required
                        v-model="formData.courier_price"
                        :is-valid="initialLoad ? null : !formData.courier_price ? false : true"
                      />
                      <InputDefault
                        :disabled="!isEditable"
                        title="Courier Currency"
                        placeholder="IDR"
                        required
                        v-model="formData.courier_currency"
                        :is-valid="initialLoad ? null : !formData.courier_currency ? false : true"
                      />
                    </template>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            <!-- Card 2: Items -->
            <CCard class="mb-3" color="light">
              <CCardHeader class="py-2 d-flex justify-content-between align-items-center">
                <strong>Items ({{ items.length }})</strong>
                <CButton
                  v-if="isEditable"
                  size="sm"
                  color="primary"
                  @click="openModalAdd()"
                >
                  <CIcon name="cil-plus" /> Add Item
                </CButton>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12" md="12" lg="12">
                    <CDataTable
                      tableFilter
                      class="text-left"
                      hover
                      striped
                      border
                      :items="renderItems"
                      :fields="fields"
                      style="font-size: 12px"
                    >
                      <template #action="{ item, index }">
                        <td>
                          <Button
                            v-if="isEditable"
                            v-c-tooltip="'Delete'"
                            :type="'delete'"
                            @click="deleteRow(item, index)"
                          />
                        </td>
                      </template>
                    </CDataTable>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <div class="float-left">
            <ButtonPermission
              v-if="action === 'Create' || (action === 'Update' && pickingStatus === 0)"
              :permission="action === 'Create' ? 'create' : 'update'"
              :buttonProperty="btnSubmit"
              :useHref="false"
              @click="save()"
            />
            <ButtonPermission
              v-if="action === 'Approve' && pickingStatus === 0"
              :permission="'approve'"
              :buttonProperty="btnDispatch"
              :useHref="false"
              @click="save()"
            />
            <ButtonBack />
          </div>
          <div class="float-right">
            <ExportButtons
              v-if="action !== 'ADD'"
              @export="handleClickExport"
            />
          </div>
        </CCardFooter>
      </CCard>
    </CCol>

    <!-- Modal Pilih Item GRN -->
    <CModal
      title="Select Paid GRN Items"
      centered="centered"
      color="info"
      :show.sync="modalAdd"
      size="xl"
    >
      <CDataTable
        :items="renderGrnItems"
        :fields="grnFields"
        hover
        striped
        border
        style="font-size: 12px"
        :items-per-page="10"
        :column-filter="true"
        :items-per-page-select="true"
        :pagination="true"
        @row-clicked="toggleSelect"
      >
        <template #selected-header>
          <input
            ref="selectAllCheckbox"
            type="checkbox"
            :checked="allSelected"
            @click.stop="toggleSelectAll"
          />
        </template>
        <template #selected="{ item }">
          <td>
            <input type="checkbox" :checked="isSelected(item.id)" />
          </td>
        </template>
      </CDataTable>
      <template #footer>
        <CButton type="button" size="sm" color="primary" @click="setData()">
          <CIcon name="cil-plus" /> Set Data
        </CButton>
        <CButton
          type="button"
          size="sm"
          color="danger"
          @click="modalAdd = false"
        >
          <CIcon name="cil-ban" /> Cancel
        </CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import $axios from '../../../api';
import {
  dispatchPicking,
  insertPicking,
  updatePicking,
} from '../../../resource/TrxPicking';
import {
  exportDataV3,
  handleBack,
  generateIdempotencyKey,
  capitalizeFirstLetter,
  formatNumber,
} from '../../../utils';

export default {
  name: 'FormPicking',
  data() {
    return {
      initialLoad: true,
      action: 'ADD',
      pickingStatus: null,
      formData: {
        customer_id: null,
        courier_id: null,
        receiver_name: null,
        receiver_phone: null,
        receiver_address: null,
        weight: null,
        courier_number: null,
        courier_price: null,
        courier_currency: null,
      },
      listCustomer: [],
      customerMap: {},
      listCourier: [],
      items: [],
      grnItems: [],
      selectedIds: [],
      modalAdd: false,
      btnSubmit: {
        size: 'sm',
        class: 'float-right',
        color: 'primary',
        icon: 'check-circle',
        text: ' Submit',
        tooltip: 'Submit',
      },
      btnDispatch: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'paper-plane',
        text: ' Dispatch',
        tooltip: 'Dispatch to Customer',
      },
      fields: [
        { key: 'product_name', label: 'Product' },
        { key: 'foreign_currency', label: 'Foreign Curr.' },
        { key: 'foreign_cost', label: '(F) Cost' },
        { key: 'foreign_price', label: '(F) Price' },
        { key: 'local_currency', label: 'Local Curr.' },
        { key: 'local_cost', label: '(L) Cost' },
        { key: 'local_price', label: '(L) Price' },
        { key: 'local_shipping', label: '(L) Shipping' },
        { key: 'local_profit', label: '(L) Profit' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
      grnFields: [
        { key: 'selected', label: 'Check', sorter: false },
        { key: 'product_name', label: 'Product' },
        { key: 'local_cost', label: 'Local Cost' },
        { key: 'local_price', label: 'Local Price' },
        { key: 'foreign_cost', label: 'Foreign Cost' },
        { key: 'foreign_price', label: 'Foreign Price' },
      ],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.loadListCustomer();
    this.loadListCourier();

    if (this.$route.params.id) {
      this.loadData();
    }
  },
  methods: {
    handleClickExport(type) {
      exportDataV3({
        param: { id: this.$route.params.id },
        exportType: type,
        url: '/v1/jastip/picking',
      });
    },
    loadListCustomer() {
      let param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/customer?${param}`).then((result) => {
        let data = result.data.data;
        this.customerMap = {};
        this.listCustomer = [];
        for (const it of data) {
          this.customerMap[it.id] = it;
          this.listCustomer.push({ value: it.id, label: it.name });
        }
      });
    },
    onCustomerChange(id) {
      this.formData.customer_id = id;
      const c = this.customerMap[id];
      if (c) {
        this.formData.receiver_address = c.address || '';
        this.formData.receiver_name = c.pic || c.name || '';
        this.formData.receiver_phone = c.phone || '';
      }
    },
    loadListCourier() {
      const param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/courier?${param}`).then((result) => {
        const data = result.data.data || [];
        this.listCourier = data.map((it) => ({
          value: it.id,
          label: `${it.name} (${it.code})`,
        }));
      });
    },
    loadData() {
      let id = this.$route.params.id;
      $axios.get(`/v1/jastip/picking?id=${id}`).then((res) => {
        let item = res.data.data[0];
        if (item) {
          this.formData = {
            customer_id: item.customer_id,
            courier_id: item.courier_id,
            receiver_name: item.receiver_name,
            receiver_phone: item.receiver_phone,
            receiver_address: item.receiver_address,
            weight: item.weight,
            courier_number: item.courier_number,
            courier_price: item.courier_price,
            courier_currency: item.courier_currency,
          };
          this.items = item.items || [];
          this.pickingStatus = item.status;
        }
      });
    },
    openModalAdd() {
      if (!this.formData.customer_id) {
        this.$toast.open({
          message: 'Please select customer first.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.loadGrnItems();
      this.modalAdd = true;
    },
    loadGrnItems() {
      let param = new URLSearchParams({
        status: 203,
        payment_status: 1,
        customer_id: this.formData.customer_id,
      }).toString();
      $axios.get(`/v1/jastip/item-stock?${param}`).then((res) => {
        this.grnItems = (res.data.data || []).filter(
          (item) => Number(item.payment_status) === 1,
        );
      });
    },
    isSelected(id) {
      return this.selectedIds.includes(id);
    },
    toggleSelect(item) {
      let idx = this.selectedIds.indexOf(item.id);
      if (idx >= 0) {
        this.selectedIds.splice(idx, 1);
      } else {
        this.selectedIds.push(item.id);
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedIds = [];
      } else {
        this.selectedIds = this.grnItems.map((it) => it.id);
      }
    },
    setData() {
      let selected = this.grnItems.filter((it) =>
        this.selectedIds.includes(it.id),
      );
      for (const it of selected) {
        if (!this.items.find((o) => o.id === it.id)) {
          this.items.push(it);
        }
      }
      this.selectedIds = [];
      this.modalAdd = false;
    },
    deleteRow(item) {
      this.items = this.items.filter((x) => x.id !== item.id);
    },
    validateForm() {
      if (!this.formData.customer_id) {
        this.$toast.open({
          message: 'Please select customer.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      if (!this.formData.receiver_name) {
        this.$toast.open({
          message: 'Please input receiver name.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      if (!this.formData.receiver_phone) {
        this.$toast.open({
          message: 'Please input receiver phone.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      if (!this.formData.receiver_address) {
        this.$toast.open({
          message: 'Please input receiver address.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      if (this.items.length <= 0) {
        this.$toast.open({
          message: 'Please add at least 1 item to continue',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      if (this.action === 'Approve' && this.pickingStatus === 0) {
        if (!this.formData.courier_id) {
          this.$toast.open({
            message: 'Please select courier.',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return false;
        }
        if (!this.formData.courier_number) {
          this.$toast.open({
            message: 'Please input courier number (resi no).',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return false;
        }
        if (
          this.formData.courier_price === null ||
          this.formData.courier_price === undefined ||
          this.formData.courier_price === ''
        ) {
          this.$toast.open({
            message: 'Please input courier price.',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return false;
        }
        if (!this.formData.courier_currency) {
          this.$toast.open({
            message: 'Please input courier currency.',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return false;
        }
      }
      return true;
    },
    async save() {
      if (!this.validateForm()) return;

      let param = {
        customer_id: this.formData.customer_id,
        courier_id: this.formData.courier_id,
        receiver_name: this.formData.receiver_name,
        receiver_phone: this.formData.receiver_phone,
        receiver_address: this.formData.receiver_address,
        weight: this.formData.weight,
        items: this.items.map((it) => ({ id: it.id })),
        idempotency_key: generateIdempotencyKey(),
      };
      if (this.$route.params.id) {
        param.id = this.$route.params.id;
      }
      if (this.action === 'Approve' && this.pickingStatus === 0) {
        param.courier_number = this.formData.courier_number;
        param.courier_price = Number(this.formData.courier_price);
        param.courier_currency = this.formData.courier_currency;
      }

      let message =
        this.action === 'Approve'
          ? 'You are about to dispatch this picking to customer. This operation cannot be undone. Would you like to continue?'
          : 'You are about to finalize this transaction. This operation cannot be undone. Would you like to continue?';

      if (confirm(message)) {
        this.$isLoading(true);
        let res = null;
        try {
          if (this.action === 'Approve') {
            res = await dispatchPicking(param);
          } else if (this.action === 'Create') {
            res = await insertPicking(param);
          } else if (this.action === 'Update') {
            res = await updatePicking(param);
          } else {
            throw new Error(`Unknown action: ${this.action}`);
          }
        } catch (error) {
          res = { error: true, message: `${error}` };
        }
        this.$isLoading(false);
        this.$toast.open({
          message: !res
            ? 'Failed to save data. Please try again.'
            : res.error
            ? res.message
            : 'Data has been saved successfully ',
          type: !res || res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (res && !res.error) {
          handleBack(this.$router, this.$route);
        }
      }
    },
    formatCurrency(val, currency = 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(val);
    },
  },
  watch: {
    selectedIds() {
      this.$nextTick(() => {
        if (this.$refs.selectAllCheckbox) {
          this.$refs.selectAllCheckbox.indeterminate =
            this.someSelected && !this.allSelected;
        }
      });
    },
  },
  computed: {
    actionLabel() {
      if (this.action === 'Approve') return 'Dispatch';
      return this.action;
    },
    isEditable() {
      return this.action === 'Create' || this.action === 'Update';
    },
    showCourierFields() {
      return this.action === 'Approve' && this.pickingStatus === 0;
    },
    statusLabel() {
      const labels = {
        '-1': 'Canceled',
        0: 'In Progress',
        1: 'Done',
        2: 'In Courier',
        3: 'Returned',
      };
      return labels[this.pickingStatus] || 'Unknown';
    },
    statusColor() {
      const colors = {
        '-1': 'danger',
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'secondary',
      };
      return colors[this.pickingStatus] || 'light';
    },
    allSelected() {
      return (
        this.grnItems.length > 0 &&
        this.grnItems.every((it) => this.selectedIds.includes(it.id))
      );
    },
    someSelected() {
      return this.selectedIds.some((id) =>
        this.grnItems.some((it) => it.id === id),
      );
    },

    renderGrnItems() {
      return this.grnItems.map((item) => {
        return {
          ...item,
          customer_name: item.customer_name || '-',
          product_name: item.product_name || '-',
          foreign_cost: formatNumber(item.foreign_cost) || '-',
          foreign_price: formatNumber(item.foreign_price) || '-',
          local_cost: formatNumber(item.local_cost) || '-',
          local_price: formatNumber(item.local_price) || '-',
        };
      });
    },

    renderItems() {
      return this.items.map((item) => {
        return {
          ...item,
          barcode: item.barcode || '-',
          product_name: item.product_name || '-',
          warehouse_name: item.warehouse_name || '-',
          foreign_cost: formatNumber(item.foreign_cost) || '-',
          foreign_price: formatNumber(item.foreign_price) || '-',
          local_cost: formatNumber(item.local_cost) || '-',
          local_price: formatNumber(item.local_price) || '-',
          local_shipping: formatNumber(item.local_shipping) || '-',
          local_profit: formatNumber(item.local_profit) || '-',
        };
      });
    },
  },
};
</script>

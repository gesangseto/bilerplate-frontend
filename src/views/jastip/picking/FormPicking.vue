<template>
  <CRow>
    <CCol col="12" xl="12" sm="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody class="mb-5 mt-2">
          <CForm novalidate>
            <CRow>
              <CCol sm="12" md="6">
                <SelectOption
                  :disabled="!isEditable"
                  title="Customer"
                  placeholder="--Select--"
                  required
                  :options="listCustomer"
                  :value="formData.customer_id"
                  v-on:onchange="onCustomerChange($event)"
                  :is-valid="
                    initialLoad ? null : !formData.customer_id ? false : true
                  "
                />
                <InputDefault
                  :disabled="!isEditable"
                  title="Receiver Name"
                  placeholder="Nama penerima"
                  v-model="formData.receiver_name"
                />
                <InputDefault
                  :disabled="!isEditable"
                  title="Receiver Phone"
                  placeholder="No. telpon penerima"
                  v-model="formData.receiver_phone"
                />
                <TextareaDefault
                  :disabled="!isEditable"
                  title="Receiver Address"
                  placeholder="Address"
                  v-model="formData.receiver_address"
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
                  :is-valid="
                    initialLoad ? null : !formData.courier_id ? false : true
                  "
                />
                <InputDefault
                  :disabled="!isEditable"
                  title="Weight"
                  placeholder="0"
                  validasi="float"
                  v-model="formData.weight"
                />
                <template
                  v-if="
                    action === 'Update' ||
                    (action === 'Approve' && pickingStatus !== 2)
                  "
                >
                  <InputDefault
                    :disabled="!isEditable"
                    title="Courier Number (Resi No)"
                    placeholder="Nomor resi"
                    v-model="formData.courier_number"
                  />
                  <InputDefault
                    :disabled="!isEditable"
                    title="Courier Price"
                    placeholder="0"
                    validasi="float"
                    v-model="formData.courier_price"
                  />
                  <InputDefault
                    :disabled="!isEditable"
                    title="Courier Currency"
                    placeholder="IDR"
                    v-model="formData.courier_currency"
                  />
                </template>
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12" xl="12">
                <CButton
                  v-if="isEditable"
                  size="sm"
                  class="float-right m-1"
                  color="success"
                  @click="openModalAdd()"
                >
                  <CIcon name="cil-plus" /> Add Item
                </CButton>
              </CCol>
            </CRow>
          </CForm>
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
        <CCardFooter>
          <div class="float-left">
            <ButtonPermission
              v-if="
                action === 'Create' ||
                (action === 'Update' && pickingStatus === 0)
              "
              :permission="action === 'Create' ? 'create' : 'update'"
              :buttonProperty="btnSubmit"
              :useHref="false"
              @click="save()"
            />
            <ButtonPermission
              v-if="action === 'Approve' && pickingStatus === 0"
              :permission="'approve'"
              :buttonProperty="btnKirim"
              :useHref="false"
              @click="save()"
            />
            <ButtonBack />
          </div>
          <div class="float-right">
            <ExportButtons v-if="action !== 'ADD'" @export="handleClickExport" />
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
  finishPicking,
} from '../../../resource/TrxPicking';
import {
  exportDataV3,
  handleBack,
  generateIdempotencyKey,
  costFormating,
  capitalizeFirstLetter,
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
        customer_address: null,
        receiver_name: null,
        receiver_phone: null,
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
      btnKirim: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'paper-plane',
        text: ' Kirim',
        tooltip: 'Kirim',
      },
      fields: [
        { key: 'product_name', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'cost_price', label: 'Cost' },
        { key: 'selling_price', label: 'Selling' },
        { key: 'cost_format', label: 'Session' },
        { key: 'selling_format', label: 'Local' },
        { key: 'profit_currency', label: 'Currency' },
        { key: 'profit', label: 'Profit' },
        { key: 'action', label: 'Action', sorter: false },
      ],
      grnFields: [
        { key: 'selected', label: 'Check', sorter: false },
        { key: 'product_name', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'cost_format', label: 'Session' },
        { key: 'selling_format', label: 'Local' },
        { key: 'profit_currency', label: 'Currency' },
        { key: 'profit', label: 'Profit' },
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
            customer_address: item.customer_address,
            receiver_name: item.receiver_name,
            receiver_phone: item.receiver_phone,
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
    async save() {
      if (!this.formData.customer_id) {
        this.$toast.open({
          message: 'Please select customer.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (this.items.length <= 0) {
        this.$toast.open({
          message: 'Please add at least 1 item to continue',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (this.action === 'Approve' && this.pickingStatus !== 2) {
        if (!this.formData.courier_number) {
          this.$toast.open({
            message: 'Please input courier number (resi no).',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
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
          return;
        }
        if (!this.formData.courier_currency) {
          this.$toast.open({
            message: 'Please input courier currency.',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }
      }
      let param = {
        customer_id: this.formData.customer_id,
        courier_id: this.formData.courier_id,
        receiver_address: this.formData.receiver_address,
        receiver_name: this.formData.receiver_name,
        receiver_phone: this.formData.receiver_phone,
        weight: this.formData.weight,
        items: this.items.map((it) => ({ id: it.id })),
        idempotency_key: generateIdempotencyKey(),
      };
      if (this.$route.params.id) {
        param.id = this.$route.params.id;
      }
      if (this.action === 'Approve' && this.pickingStatus !== 2) {
        param.courier_number = this.formData.courier_number;
        param.courier_price = Number(this.formData.courier_price);
        param.courier_currency = this.formData.courier_currency;
      }
      let message =
        'You are about to finalize this transaction. This operation cannot be undone. Would you like to continue?';
      if (confirm(message)) {
        this.$isLoading(true);
        let res = null;
        try {
          if (this.action === 'Approve') {
            if (this.pickingStatus === 2) {
              res = await finishPicking(param);
            } else {
              res = await dispatchPicking(param);
            }
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
    formatCurrency(val) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
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
    isEditable() {
      return this.action === 'Create' || this.action === 'Update';
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
        };
      });
    },
    renderItems() {
      return this.items.map((item) => {
        return {
          ...item,
          customer_name: item.customer_name || '-',
          product_name: item.product_name || '-',
        };
      });
    },
  },
};
</script>

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
              <CCol sm="12">
                <CSelect
                  :disabled="items.length > 0 ? true : false"
                  label="Warehouse"
                  placeholder="--Select--"
                  horizontal
                  :options="listWarehouseFrom"
                  :value.sync="formData.from_warehouse"
                  :is-valid="
                    initialLoad ? null : !formData.from_warehouse ? false : true
                  "
                  :description="
                    items.length > 0
                      ? 'Cannot change source warehouse as long as there are still items in the list'
                      : ''
                  "
                >
                  >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Source Warehouse
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CSelect>
                <CSelect
                  :options="listWarehouseTo"
                  horizontal
                  placeholder="--Select--"
                  :value.sync="formData.to_warehouse"
                  :is-valid="
                    initialLoad ? null : !formData.to_warehouse ? false : true
                  "
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Destination Warehouse
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CSelect>
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12" xl="12">
                <CButton
                  size="sm"
                  class="float-right m-1"
                  color="success"
                  @click="Add()"
                >
                  <CIcon name="cil-plus" /> Add
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
                :key="item.no"
              >
                <template #action="{ item, index }">
                  <td>
                    <Button
                      v-c-tooltip="'Delete'"
                      :type="'delete'"
                      @click="deleteRow(item, index)"
                    />
                    <Button
                      v-c-tooltip="'View'"
                      v-if="item.packaging_level > 1"
                      :type="'read'"
                      @click="detailRow(item, index)"
                    />
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton @click="save()" color="primary" size="sm" type="submit">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>
    <CModal
      title="Add Item (Stock Transfer)"
      centered="centered"
      color="info"
      :show.sync="modalAdd"
      size="xl"
    >
      <FormAddItemV3
        :currentItem="items"
        :filter="formData"
        v-on:handleResult="handleResult($event)"
      />
      <template #footer>
        <CButton type="button" size="sm" color="primary" @click="setData()">
          <CIcon name="cil-plus" /> Set Data
        </CButton>
        <CButton
          type="button"
          size="sm"
          color="danger"
          @click="closeModalAdd()"
        >
          <CIcon name="cil-ban" /> Cancel
        </CButton>
      </template>
    </CModal>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="detailModal" size="xl">
      <DetailTransactionV3 v-if="detailModal == true" :item="detail_item" />
      <template #footer>
        <CButton
          size="sm"
          color="danger"
          type="button"
          @click="
            closeDetailModal();
            detailModal = false;
          "
        >
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import '../../../assets/js/jquery-ui';
import $axiosMertrack from '../../../apiMertrack';
import { handleBack } from '../../../utils';
// import vueSelect from 'vue-select';

export default {
  name: 'FormStockTransfer',
  watch: {
    formData: {
      deep: true,
      handler(data) {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
  },
  data() {
    return {
      initialLoad: true,
      initial_load: true,
      formData: {
        from_warehouse: null,
        to_warehouse: null,
        remark: null,
        items: [],
      },
      detail_item: {},
      disableWarehouse: false,
      listTempChecked: [],
      listChecked: [],
      itemsSerial: [],
      serialChecked: [],
      checked: [],
      batchExpiredDate: [],
      qty: 0,
      manyExpired: [],
      manyNie: [],
      manyGtin: [],
      datas: [],
      detailModal: false,
      detailSerialOrAggregation: {
        productId: '',
        productName: '',
        batch: '',
        serial: [],
        gtin: '',
        nie: '',
        expiredDate: '',
      },
      detailItemsFields: [
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'SN',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
        {
          key: 'action',
          label: 'Action',
        },
      ],
      item: [],
      modalAdd: false,
      action: 'Edit',
      close: false,
      items: [],
      temp_items: [],
      productId: [],
      productName: '',
      transfer: {
        fromWarehouse: '',
        toWarehouse: '',
        detailProduct: {
          product: {},
          batchNumber: {},
          packaging: '',
          serial: '',
          quantity: '',
        },
      },
      options: [],
      idArticles: [],
      BatchNo: [],
      listWarehouseFrom: [],
      listWarehouseTo: [],
      listProductName: [],
      listBatchNumber: [],
      listPackagingLevel: [],
      checkedBatch: [],
      warehouseError: false,
      fields: [
        {
          key: 'no',
          label: 'No',
          sorter: false,
        },
        {
          key: 'product_no',
          label: 'Item No',
          sorter: false,
        },
        {
          key: 'product_name',
          label: 'Product Name',
          sorter: false,
        },
        {
          key: 'batch_no',
          label: 'Batch No',
          sorter: false,
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
          sorter: false,
        },
        {
          key: 'product_nie',
          label: 'NIE',
          sorter: false,
        },
        {
          key: 'epc_key',
          label: 'EPC Key',
          sorter: false,
        },
        {
          key: 'serial',
          label: 'SN',
          sorter: false,
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
          sorter: false,
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
          sorter: false,
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
          sorter: false,
        },
        {
          key: 'action',
          label: 'Action',
          sorter: false,
        },
      ],
    };
  },
  mounted() {
    //ambil list warehouse
    this.loadListWarehouse();

    // aksi add dan edit
    this.action = this.$route.params.id === undefined ? 'ADD' : 'EDIT';
  },
  methods: {
    closeDetailModal() {
      this.datas = [];
      this.detailSerialOrAggregation = {};
    },
    Add() {
      if (!this.checkValidation()) {
        return;
      }
      this.modalAdd = true;
    },
    detailRow(item) {
      if (item.packaging_level == 1) {
        return false;
      }
      this.detail_item = item;
      this.detailModal = true;
    },
    removeDuplicateData(data) {
      data = data.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.gtin_sscc === value.gtin_sscc &&
              t.serial === value.serial &&
              t.batch_id === value.batch_id,
          ),
      );
      return data;
    },
    handleResult(data) {
      this.temp_items = this.removeDuplicateData(data);
      return;
    },
    setData() {
      if (this.temp_items.length == 0) {
        this.$toast.open({
          message: `No data to be set`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.items = this.items.concat(this.temp_items);
      this.items = this.removeDuplicateData(this.items);
      this.temp_items = [];
      this.modalAdd = false;
      return;
    },
    closeModalAdd() {
      this.temp_items = [];
      this.modalAdd = false;
    },
    loadListWarehouse() {
      var param = { status: 'Active', category_id: 1 };
      param = new URLSearchParams(param).toString();
      var _url = `/v3/master/warehouse?${param}`;
      $axiosMertrack.get(_url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listWarehouseFrom.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      param = { status: 'Active', category_id: 3 };
      param = new URLSearchParams(param).toString();
      _url = `/v3/master/warehouse?${param}`;
      $axiosMertrack.get(_url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listWarehouseTo.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      return;
    },
    updateData() {
      let index = this.editPicking.index;
      let editPicking = this.editPicking;
      this.items.splice(index, 1, editPicking);
    },
    deleteRow(item) {
      this.items = this.items.filter((x) => x.id !== item.id);
    },
    checkValidation() {
      this.initialLoad = false;
      if (!this.formData.from_warehouse || !this.formData.to_warehouse) {
        this.$toast.open({
          message: `Please input all the required data.`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      return true;
    },
    save() {
      if (!this.checkValidation()) {
        return;
      }
      if (this.items.length <= 0) {
        this.$toast.open({
          message: 'Please add at least 1 product item to continue',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }

      // Mapping data baru untuk di save
      let items = [];
      for (const it of this.items) {
        let field = {
          epc_key: it.epc_key,
          serial: it.serial,
          quantity: it.quantity,
        };
        items.push(field);
      }
      let param = this.formData;
      param.items = items;
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack
          .put('/v3/transaction/transfer', param)
          .then((result) => {
            this.$isLoading(false);
            let res = result.data;
            this.$toast.open({
              message: res.error
                ? res.message
                : 'Data has been saved successfully ',
              type: res.error ? 'error' : 'success',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            if (!res.error) {
              this.items = [];
              this.formData.items = [];
              handleBack(this.$router, this.$route);
            }
          })
          .catch((err) => {
            this.$isLoading(false);
            this.$toast.open({
              message: `Error : ${err}`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
          });
      }
      return;
    },
    cancel() {
      handleBack(this.$router, this.$route);
    },
  },
  computed: {
    renderItems() {
      let no = 0;
      return this.items.map((item) => {
        return {
          no: (no += 1),
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
        };
      });
    },
    detailItems() {
      return this.item.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

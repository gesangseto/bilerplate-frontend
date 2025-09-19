<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="md-5">
              <CInput
                label="SO No *"
                horizontal
                placeholder="Enter SO Number"
                v-model="formData.so_number"
                :is-valid="
                  initial_load ? null : !formData.so_number ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    SO No
                    <span class="text-danger"> * </span>
                  </p>
                </template>
              </CInput>
              <CInput
                label="SO Date *"
                horizontal
                type="date"
                placeholder="Enter SO Date"
                v-model="formData.so_date"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    SO Date
                    <span class="text-danger"> * </span>
                  </p>
                </template>
              </CInput>
              <CInput
                label="ERP Picking List No"
                horizontal
                placeholder="Enter ERP Picking List No"
                v-model="formData.erp_number"
              ></CInput>
              <CSelect
                label="Warehouse *"
                placeholder="Select Warehouse..."
                horizontal
                :options="warehouseOptions"
                :value.sync="formData.warehouse_id"
                :is-valid="
                  initial_load ? null : !formData.warehouse_id ? false : true
                "
                :disabled="items.length > 0 ? true : false"
                :description="
                  items.length > 0
                    ? 'Cannot change warehouse as long as there are still items in the list'
                    : ''
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Warehouse
                    <span class="text-danger"> * </span>
                  </p>
                </template>
              </CSelect>
              <CSelect
                label="Customer *"
                placeholder="Select Customer..."
                horizontal
                :options="customerOptions"
                :value.sync="formData.customer_id"
                :is-valid="
                  initial_load ? null : !formData.customer_id ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Customer
                    <span class="text-danger"> * </span>
                  </p>
                </template>
              </CSelect>
            </CCol>
            <CCol class="md-5">
              <CInputFile
                :placeholder="formData.file_1_name"
                horizontal
                custom
                class="input-form-upload"
                @change="uploadFile($event, 1)"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">SO Ref</p>
                </template>
              </CInputFile>
              <CInputFile
                :placeholder="formData.file_2_name"
                horizontal
                custom
                class="input-form-upload"
                @change="uploadFile($event, 2)"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">ERP PL Ref</p>
                </template>
              </CInputFile>
            </CCol>
          </CRow>
          <div class="clearfix">
            <CButton
              type="button"
              size="sm"
              class="float-right mb-4"
              color="success"
              @click="addProduct()"
            >
              <CIcon name="cil-plus" /> Add
            </CButton>
          </div>

          <CDataTable
            tableFilter
            hover
            striped
            sorter
            border
            :items="renderItems"
            :fields="fields"
            class="text-left"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td style="font-size: 12px">
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
        </CCardBody>
        <CCardFooter>
          <CButton type="button" size="sm" color="primary" @click="save()">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <ButtonBack />
        </CCardFooter>

        <CModal
          title="Add Item (Picking List)"
          color="info"
          :show.sync="modalAdd"
          size="xl"
        >
          <FormAddItemV3
            :useDeliveryDayLimit="true"
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
        <CModal
          title="Detail"
          color="warning"
          :show.sync="detailModal"
          size="xl"
        >
          <DetailTransactionV3 v-if="detailModal == true" :item="detail_item" />
          <template #footer>
            <CButton
              size="sm"
              color="danger"
              type="button"
              @click="
                closeModalDetail();
                detailModal = false;
              "
            >
              <CIcon name="cil-x-circle" /> Close
            </CButton>
          </template>
        </CModal>
      </CCard>
    </div>
  </div>
</template>

<script>
const ekstensiFileValid = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
import $axiosMertrack from '../../../apiMertrack';
import { handleBack } from '../../../utils';
const reader = new FileReader();
export default {
  name: 'FormPickingList',
  watch: {
    formData: {
      deep: true,
      handler() {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
  },
  data() {
    return {
      initial_load: true,
      maxFileSize: 500,
      chekcedBatch: [],
      errors: false,
      checkedSerials: [],
      checked: [],
      val: [],
      packingL1: '',
      packingL2: '',
      packingL3: '',
      packingL4: '',
      qty: 0,
      manyProductId: [],
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
          key: 'ecp_key',
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
      detail_item: {},
      item: [],
      customerOptions: [],
      warehouseError: false,
      productName: '',
      productOptions: [],
      batchNumberOptions: [],
      items: [],
      temp_items: [],
      fields: [
        {
          key: 'no',
          label: 'No',
        },
        {
          key: 'product_no',
          label: 'Item No',
        },
        {
          key: 'product_name',
          label: 'Product Name',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
          _classes: 'font-weight-bold',
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
        },
        {
          key: 'product_nie',
          label: 'NIE',
        },
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
          sorter: false,
          filter: false,
          _style: 'width:12%',
        },
      ],
      modalAdd: false,
      warehouseOptions: [],
      formData: {
        so_date: new Date().toISOString().slice(0, 10),
        so_number: '',
        erp_number: '',
        file_1_name: null,
        file_1_content: null,
        file_2_name: null,
        file_2_content: null,
        customer_id: null,
        warehouse_id: null,
        items: [],
      },
      detail: {
        product: {
          id: '',
          name: '',
        },
        batch: {
          id: '',
          name: '',
        },
        serial: '',
      },
      error: {
        soNumber: '',
        ref1: '',
        ref2: '',
        warehouseId: '',
        customerId: '',
      },
      inputError: false,
      file: {
        ref1: 'Choose file...',
        ref2: 'Choose file...',
      },
      action: '',
      newPickingData: {},
      required: {
        warehouse_id: { error: false, message: 'Warehouse is required' },
        customer_id: { error: false, message: 'Customer is required' },
        soNumber: { error: false, message: 'SO No is required' },
      },
    };
  },
  mounted() {
    //ambil list warehouse
    this.loadListWarehouse();
    this.loadListCustomer();
    // cek parameter url
    this.action = this.$route.params.id === undefined ? 'ADD' : 'Edit';
  },
  methods: {
    loadListWarehouse() {
      var param = { status: 'Active', category_id: 3 };
      param = new URLSearchParams(param).toString();
      var _url = `/v3/master/warehouse?${param}`;
      $axiosMertrack.get(_url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.warehouseOptions.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      return;
    },
    loadListCustomer() {
      var param = { status: 'Active' };
      param = new URLSearchParams(param).toString();
      var _url = `/v3/master/customer?${param}`;
      $axiosMertrack.get(_url).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.customerOptions.push({
            value: it.id,
            label: it.name,
          });
        }
      });
      return;
    },
    closeModalDetail() {
      this.datas = [];
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
              t.batch_id === value.batch_id
          )
      );
      return data;
    },

    handleResult(data) {
      // this.temp_items = this.temp_items.concat(data);
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
    },
    closeModalAdd() {
      this.checked = [];
      this.item = [];
      this.detail.batch.name = '';
      this.detail.product.name = '';
      this.modalAdd = false;
    },
    deleteRow(item, index) {
      this.items.splice(index, 1);
    },
    addProduct() {
      if (!this.checkValidation()) {
        this.$toast.open({
          message: `Please input all the required data.`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.modalAdd = true;
      return;
    },
    uploadFile(event, index) {
      let fileRef = event[0];
      let fileName = event[0].name;
      let fileExt = event[0].name.split('.').reverse()[0];
      let fileSize = event[0].size;
      this.formData[`file_${index}_name`] = 'Choose file...';
      if (fileRef) {
        if (!ekstensiFileValid.includes(fileExt)) {
          this.$toast.open({
            message: `You have selected an unsupported Ref 1 file type. Please select the following supported file types (pdf, doc, docx, xls, xlsx)`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return false;
        } else if (fileSize > this.maxFileSize * 1000) {
          this.$toast.open({
            message: `The Ref 2 file you have selected exceed the maximum supported file size of ${this.maxFileSize} KB`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return false;
        }
        this.convertBase64(fileRef, index);
        this.formData[`file_${index}_name`] = fileName;
        return;
      }
      return;
    },
    convertBase64(file, index) {
      reader.onload = (e) => {
        this.formData[`file_${index}_content`] = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    checkValidation() {
      this.initial_load = false;
      let data = this.formData;

      if (
        !data.warehouse_id ||
        !data.customer_id ||
        !data.so_number ||
        !data.so_date
      ) {
        return false;
      }
      return true;
    },
    save() {
      // // cek semua input yang mandatory
      if (!this.checkValidation()) {
        this.$toast.open({
          message: `Please input all the required data.`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (this.items.length == 0) {
        this.$toast.open({
          message: `Please add at least 1 product item to continue`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      let items = [];
      for (const it of this.items) {
        let field = {
          epc_key: it.epc_key,
          serial: it.serial,
        };
        if (it.serial == '0000000000') {
          field['epc_key'] = it.epc_key;
          field['product_id'] = it.product_id;
          field['batch_no'] = it.batch_no;
          field['expired_date'] = it.expired_date;
          field['quantity'] = it.quantity;
        }
        items.push(field);
      }
      let param = this.formData;
      param.items = items;
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack
          .put('/v3/transaction/picking', param)
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
              handleBack(this.$router, this.$route);
            }
          })
          .catch((err) => {
            this.$isLoading(false);
            this.$toast.open({
              message: `${err}`,
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
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          no: (no += 1),
          gtin_cp:
            item.epc_type == 'sscc' ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>

<style>
#label-ref1 {
  overflow: hidden;
}

#label-ref2 {
  overflow: hidden;
}
</style>

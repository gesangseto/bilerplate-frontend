<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>Process Order [{{ route_action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6" md="6" lg="6">
              <InputDefault
                :disabled="action != 'Create'"
                title="ERP PO No."
                v-model="formData.process_order_erp"
                :options="{ uppercase: true, nospace: true }"
                :required="true"
                :max="100"
                :is-valid="
                  initialLoad
                    ? null
                    : !formData.process_order_erp
                    ? false
                    : true
                "
              />

              <div class="form-group row mb-12">
                <label
                  for="product-name"
                  class="col-sm-3 col-md-3 col-lg-3 form-label"
                >
                  Product Name <strong class="text-danger">*</strong>
                </label>
                <div class="col-sm-9 col-md-9 col-lg-9">
                  <v-select
                    :disabled="action != 'Create'"
                    key="value"
                    placeholder="--Select--"
                    :options="productOptions"
                    :reduce="(opt) => opt.value"
                    v-model="formData.product_id"
                  >
                  </v-select>
                </div>
              </div>

              <InputDefault
                :disabled="true"
                title="GTIN"
                v-model="formData.gtin"
              />

              <InputDefault
                :disabled="true"
                title="NIE"
                v-model="formData.nie"
              />

              <InputDefault
                :disabled="action != 'Create' && action != 'Update'"
                title="HET"
                :validasi="'numeric'"
                v-model="formData.het"
                :options="{ uppercase: true }"
                :required="true"
                :max="20"
                :is-valid="initialLoad ? null : !formData.het ? false : true"
              />

              <InputDefault
                :disabled="action != 'Create' && action != 'Update'"
                title="Batch No"
                :validasi="'alphanumeric'"
                v-model="formData.batch_no"
                :options="{ uppercase: true }"
                :required="true"
                :max="20"
                :is-valid="
                  initialLoad ? null : !formData.batch_no ? false : true
                "
              />

              <InputDefault
                :disabled="action != 'Create' && action != 'Update'"
                title="Lot No"
                :validasi="'alphanumeric'"
                v-model="formData.lot_no"
                :options="{ uppercase: true }"
                :required="true"
                :max="20"
                :is-valid="initialLoad ? null : !formData.lot_no ? false : true"
              />

              <InputDateDefault
                :disabled="action != 'Create' && action != 'Update'"
                title="Mfg Date"
                v-model="formData.mfg_date"
                :options="{ format: 'dd/mm/yyyy' }"
                :required="true"
                :is-valid="
                  initialLoad ? null : !formData.mfg_date ? false : true
                "
              >
                <template #append>
                  <CInput
                    style="width: 400px"
                    :disabled="action != 'Create' && action != 'Update'"
                    type="number"
                    v-model="formData.shelf_life"
                    placeholder="Shelf Life"
                  >
                    <template #append>
                      <CButton color="secondary">Month</CButton>
                    </template>
                  </CInput>
                </template>
              </InputDateDefault>

              <InputDateDefault
                :disabled="action != 'Create' && action != 'Update'"
                title="Exp Date"
                v-model="formData.exp_date"
                :options="{ format: 'dd/mm/yyyy' }"
                :required="true"
                :is-valid="
                  initialLoad ? null : !formData.exp_date ? false : true
                "
              />

              <InputDefault
                v-if="action != 'Create'"
                :disabled="true"
                title="Status"
                v-model="formData.status_name"
              />

              <CTextarea
                disabled
                v-if="formData.reason"
                label="Reason"
                horizontal
                v-model="formData.reason"
              />

              <CTextarea
                disabled
                v-if="formData.system_remark"
                label="System Remark"
                horizontal
                v-model="formData.system_remark"
              />
            </CCol>
            <CCol sm="6" md="6" lg="6">
              <InputDefault
                :disabled="action != 'Create' && action != 'Update'"
                title="Total Production"
                :validasi="'numeric'"
                v-model="formData.generate_count_level_1"
                :options="{ uppercase: true }"
                :required="true"
                :max="7"
                :is-valid="
                  initialLoad
                    ? null
                    : !formData.generate_count_level_1
                    ? false
                    : true
                "
              />

              <InputDefault
                :disabled="action != 'Create' && action != 'Update'"
                title="Buff (%)"
                :validasi="'numeric'"
                v-model="formData.buff"
                :max="2"
                :is-valid="
                  initialLoad
                    ? null
                    : !formData.buff && formData.buff != 0
                    ? false
                    : true
                "
              />

              <InputDefault
                :disabled="true"
                title="Min Generated"
                v-model="formData.min_count_generated_serial"
              />

              <CDataTable
                hover
                striped
                sorter
                :items="itemGenerateCount"
                :fields="fieldGenerateCount"
                style="font-size: 12px"
              />
              <CButton
                v-if="formData.status == '4'"
                type="submit"
                size="sm"
                @click="requestSerial()"
                class="mr-2 mb-2"
                color="success"
                ><CIcon name="cil-check-circle" /> Generate Additional
                Serial</CButton
              >
              <CButton
                v-if="[1, 4, 5, 6].includes(formData.status)"
                type="submit"
                size="sm"
                @click="viewModalHistory = true"
                class="mr-2 mb-2"
                color="info"
              >
                <CIcon name="cil-check-circle" /> View History</CButton
              >
              <CButton
                v-if="[1, 3, 4, 10].includes(formData.status)"
                type="submit"
                size="sm"
                @click="handleViewSerial"
                class="mr-2 mb-2"
                color="primary"
              >
                <CIcon name="cil-check-circle" /> View Serial</CButton
              >
              <CButton
                v-if="[1, 3, 4, 10].includes(formData.status)"
                type="submit"
                size="sm"
                @click="viewModalWeight = true"
                class="mr-2 mb-2"
                color="warning"
              >
                <CIcon name="cil-check-circle" /> Weight Config</CButton
              >
            </CCol>
          </CRow>
          <!-- DATA TABLE untuk menampilkan semua HISTORY Station-->
          <CCard>
            <CCardHeader><Strong>Progress</Strong></CCardHeader>
            <CCardBody>
              <CDataTable
                hover
                striped
                sorter
                tableFilter
                :pagination="true"
                :items-per-page="50"
                :items="detailHistory"
                :fields="fieldStationHistory"
                style="font-size: 12px"
              >
              </CDataTable>
            </CCardBody>
          </CCard>
        </CCardBody>
        <CCardFooter>
          <!-- Simpan data saat create-->
          <CButton
            v-if="action == 'Create' || action == 'Update'"
            type="submit"
            size="sm"
            @click="save()"
            class="mr-2"
            color="primary"
          >
            <CIcon name="cil-check-circle" /> Submit</CButton
          >
          <!-- Generate Serial data saat update-->
          <CButton
            v-if="formData.status == 0 && action == 'Approve'"
            type="submit"
            size="sm"
            @click="generate_serial()"
            class="mr-2"
            color="primary"
          >
            <CIcon name="cil-check-circle" /> Generate Serial</CButton
          >
          <!-- Generate Serial data saat update-->

          <ButtonPermission
            v-if="formData.status == 4 && userInfo.id == 0"
            :buttonProperty="{
              color: 'warning',
              text: 'Reset Status',
            }"
            class="float-right"
            :permission="'approve'"
            @click="reset_status()"
          />
          <ButtonPopover
            v-if="formData.status == 4 && userInfo.id == 0"
            :buttonProperty="{
              color: 'warning',
              text: 'Close Batch',
            }"
            permission="approve"
            :popover_list="['Partial', 'Batch']"
            @handleClick="closeDevelopment($event)"
            mt="-11"
          />
          <!-- Buton Cancel-->
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </div>

    <!-- KUMPULAN MODAL DIDALAM FORMS PROCESS ORDER -->

    <!-- MODAL UNTUK MELIHAT WEIGHT -->
    <ProductWeight
      :readonly="true"
      :product="formData"
      :showModal="viewModalWeight"
      v-on:onCloseModal="viewModalWeight = false"
    />
    <!-- Modal untuk menambahkan data Request Additional Serial-->
    <CModal
      title="Request Additional Serial"
      color="warning"
      :show.sync="viewModalRequestSerial"
    >
      <CRow>
        <CCol sm="12" md="12" lg="12">
          <div v-for="(item, index) in itemGenerateCount" :key="index">
            <CInput
              v-if="product[`qty_packagingl${index + 1}`] || index == 0"
              :disabled="additionalSerial.all && index >= 1"
              horizontal
              :value.sync="
                additionalSerial[`generate_count_level_${index + 1}`]
              "
              type="number"
              @keypress="limitNumber({ event: $event, max: 7 })"
            >
              <template #label>
                <p class="col-form-label col-sm-3">
                  Pack Level {{ index + 1 }}
                  <span class="text-danger">
                    <strong>*</strong>
                  </span>
                </p>
              </template>
            </CInput>
          </div>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label"> All </CCol>
            <CCol sm="9">
              <CSwitch
                class="mr-1"
                color="success"
                :checked.sync="additionalSerial.all"
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <template #footer>
        <CButton
          size="sm"
          color="success"
          type="button"
          @click="submitAdditionSerial()"
        >
          <CIcon name="cil-check-circle" /> Request
        </CButton>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>

    <!-- Modal untuk melihat detail aggregasi item stock setelah berhasil di closed / partial closed-->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="xl">
      <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>

    <!-- Modal untuk melihat view history dari request additional serial-->
    <CModal
      title="History Request Serial"
      color="warning"
      :show.sync="viewModalHistory"
    >
      <CDataTable
        hover
        striped
        sorter
        tableFilter
        border
        :pagination="true"
        :items-per-page="10"
        :items="dataFieldHistory"
        :fields="fieldHistory"
        style="font-size: 12px"
      />

      <template #footer>
        <CButton
          size="sm"
          color="danger"
          type="button"
          @click="viewModalHistory = false"
        >
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>

    <!-- MODAL VIEW SERIAL -->
    <CModal
      title="View Serial"
      color="warning"
      :show.sync="viewModalSerial"
      size="lg"
    >
      <CRow>
        <CCol md="10">
          <CTabs :active-tab.sync="activeTab">
            <CTab title="Available" active> </CTab>
            <CTab title="Booking"> </CTab>
            <CTab title="Production"> </CTab>
          </CTabs>
        </CCol>
        <CCol md="2">
          <p class="float-right">
            Quantity L1: {{ tabData.quantity_l1 }}<br />
          </p>
        </CCol>
      </CRow>
      <CDataTable
        hover
        striped
        sorter
        tableFilter
        border
        :pagination="true"
        :items-per-page="10"
        :items="detailSerial"
        :fields="fieldSerial"
        style="font-size: 12px"
      />
      <template #footer>
        <CButton
          size="sm"
          color="danger"
          type="button"
          @click="viewModalSerial = false"
        >
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
let dataPost = [];
import 'vue-select/dist/vue-select.css';
import moment from 'moment';
import { getMstProduct } from '../../../resource/MstProduct';
import {
  generateProcessOrder,
  getAllSerials,
  getProcessOrder,
  insertProcessOrder,
  requestAdditionalSerial,
  resetProcessOrder,
  updateProcessOrder,
  closeDevelopmentPO,
} from '../../../resource/ProcessOrder';
import {
  capitalizeFirstLetter,
  getConfig,
  getProfile,
  onlyNumber,
} from '../../../utils';
export default {
  name: 'FormPacking',
  watch: {
    activeTab: {
      deep: true,
      handler(item) {
        this.filterSerials();
      },
    },
    'formData.shelf_life': {
      deep: true,
      handler(item) {
        this.reformatExp();
      },
    },
    'formData.mfg_date': {
      deep: true,
      handler(item) {
        this.reformatExp();
      },
    },
    additionalSerial: {
      deep: true,
      handler(item) {
        if (item.generate_count_level_1 && item.all) {
          let last_qty = item.generate_count_level_1;
          for (var i = 2; i <= 4; i++) {
            let pack_qty = this.product[`qty_packagingl${i}`];
            last_qty = last_qty / pack_qty;
            this.additionalSerial[`generate_count_level_${i}`] =
              Math.ceil(last_qty) || 0;
          }
        }
      },
    },
    formData: {
      deep: true,
      handler(item) {
        if (item.product_id) {
          let product = this.productOptions.find(
            (it) => it.value == item.product_id
          );
          if (product) {
            product = product.item;
            this.product = product;
            this.formData.gtin = product.gtin || '';
            this.formData.nie = product.nie;
            this.formData.no = product.no;
            this.updateGenerateCount(
              product,
              item.generate_count_level_1,
              item.buff
            );
          }
        }
      },
    },
  },
  data() {
    return {
      userInfo: getProfile(),
      activeTab: 0,
      initialLoad: true,
      additionalSerial: {
        id: this.$route.params.id,
        generate_count_level_1: null,
        generate_count_level_2: null,
        generate_count_level_3: null,
        generate_count_level_4: null,
        all: true,
      },
      formData: {
        items: [],
        product_id: null,
        batch_no: '',
        lot_no: '',
        exp_date: null,
        mfg_date: null,
        het: 0,
        process_order_erp: '',
        buff: 0,
        generate_count_level_1: null,
        generate_count_level_2: null,
        generate_count_level_3: null,
        generate_count_level_4: null,
        min_count_generated_serial: getConfig().min_count_generated_serial || 0,
        generate_count_additional: [],
        history: [],
      },
      initial_load: true,
      today: moment().format('DD-MMM-YYYY'),
      productOptions: [],
      product: {},
      action: '',
      route_action: '',
      fieldGenerateCount: [
        {
          key: 'packaging_name',
          label: 'Packaging Name',
        },
        {
          key: 'level',
          label: 'Level',
        },
        {
          key: 'quantity',
          label: 'Quantity',
        },
        {
          key: 'generate_count',
          label: 'Count',
        },
      ],
      fieldStationHistory: [
        {
          key: 'conf_station_name',
          label: 'Station Name',
        },
        {
          key: 'transaction',
          label: 'Transaction',
        },
        {
          key: 'created_date',
          label: 'Created Date',
        },
        {
          key: 'status_name',
          label: 'Status',
        },
      ],
      fieldSerial: [
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
          key: 'epc_type',
          label: 'Epc Type',
        },
        {
          key: 'status_name',
          label: 'Status',
        },
      ],
      fieldHistory: [
        {
          key: 'modified_date',
          label: 'Request Time',
        },
        {
          key: 'generate_count_level_1',
          label: 'Level 1',
        },
        {
          key: 'generate_count_level_2',
          label: 'Level 2',
        },
        {
          key: 'generate_count_level_3',
          label: 'Level 3',
        },
        {
          key: 'generate_count_level_4',
          label: 'Level 4',
        },
      ],
      serials: [],
      selectedSerials: [],
      tabData: {
        quantity_l1: 0,
        quantity_l2: 0,
        quantity_l3: 0,
        quantity_l4: 0,
        serials: [],
      },
      itemGenerateCount: [],
      detail_item: {},
      viewModal: false,
      viewModalRequestSerial: false,
      viewModalHistory: false,
      viewModalSerial: false,
      viewModalWeight: false,
    };
  },
  async mounted() {
    // cek parameter url
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create'
        ? 'ADD'
        : this.action == 'Read'
        ? 'VIEW'
        : this.action == 'Update'
        ? 'EDIT'
        : 'APPROVE';
    // get product
    let _product = await getMstProduct({ product_type: 0, show_status: true });
    if (_product) {
      for (const it of _product.data) {
        this.productOptions.push({
          value: it.id,
          name: it.name,
          label: `[${it.no}] ${it.name}`,
          item: it,
        });
      }
    }
    if (this.action !== 'Create') {
      this.loadData();
    }
  },
  methods: {
    async closeDevelopment(type) {
      this.$isLoading(true);
      function getRandomMinMax(n) {
        let result = { min: (Math.random() * 5).toFixed(2), max: null };
        result.max = (parseFloat(result.min) + parseFloat(n)).toFixed(2);
        return result;
      }
      let res = await closeDevelopmentPO({
        id: this.formData.id,
        type: type == 'Partial' ? 'partial' : 'batch',
        weight_l2: getRandomMinMax(2.1),
      });
      this.$isLoading(false);
      this.$toast.open({
        message: res['error']
          ? `${res['message']}`
          : 'Success close development',
        type: res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!res['error']) this.$router.back();
    },
    reformatExp() {
      let add = this.formData.shelf_life;
      if (add && this.formData.mfg_date) {
        let mfg = moment(this.formData.mfg_date);
        let date = mfg.date();
        if (date < 15) {
          add = add - 1;
        }
        this.formData.exp_date = mfg
          .add(add, 'months')
          .endOf('month')
          .format('YYYY-MM-DD');
      }
    },
    filterSerials() {
      let status = {
        active: 1,
        inactive: 5,
        in_progress: 6,
        disposal: 3,
        sampling: 15,
        destroy_number: 201,
        rework: 202,
        picking_done: 203,
        sold: 204,
        available: 25,
        reserved: 12,
        used: 205,
        destroy_return: 206,
        active_preinbound: 207,
        unused: 26,
      };
      this.tabData.serials = [];
      if (this.activeTab == 0) {
        // AVAILABLE
        this.tabData.serials = this.serials.filter(
          (it) => it.status == status.available
        );
      } else if (this.activeTab == 1) {
        // RESERVED
        this.tabData.serials = this.serials.filter(
          (it) => it.status == status.reserved
        );
      } else if (this.activeTab == 2) {
        this.tabData.serials = this.serials.filter(
          (it) => it.status != status.available && it.status != status.reserved
        );
      }
      this.tabData.quantity_l1 = this.tabData.serials.filter(
        (it) => it.packaging_level == 1
      ).length;
      this.tabData.quantity_l2 = this.tabData.serials.filter(
        (it) => it.packaging_level == 2
      ).length;
      this.tabData.quantity_l3 = this.tabData.serials.filter(
        (it) => it.packaging_level == 3
      ).length;
      this.tabData.quantity_l4 = this.tabData.serials.filter(
        (it) => it.packaging_level == 4
      ).length;
    },
    async handleViewSerial() {
      if (this.serials.length == 0) {
        let _serials = await getAllSerials({
          id: this.$route.params.id,
        });
        if (_serials && !_serials.error) {
          this.serials = _serials.data;
        }
        this.filterSerials();
      }
      this.viewModalSerial = true;
    },
    async loadData() {
      let _res = await getProcessOrder({ id: this.$route.params.id });
      if (_res && !_res.error) {
        this.formData = _res.data[0];
        this.formData.het = this.formData.het || 0;
        this.formData.buff = this.formData.buff || 0;
        this.formData.min_count_generated_serial =
          getConfig().min_count_generated_serial || 0;
      }
    },
    limitNumber({ event, data, max }) {
      onlyNumber({ event, data, max });
    },
    updateGenerateCount(product, count, buff) {
      this.formData.generate_count_level_1 = parseInt(count || 0);
      this.formData.buff = parseInt(buff);
      let _buff = buff / 100 || 0;
      this.itemGenerateCount = [];
      for (var i = 1; i <= 4; i++) {
        let last_qty = 1;
        let generate_count = Math.ceil((count + count * _buff) / last_qty);
        if (i == 1) {
          let item = {
            level: 1,
            quantity: 1,
            packaging_name: product[`packagingl${i}_name`],
            generate_count:
              generate_count < this.formData.min_count_generated_serial
                ? this.formData.min_count_generated_serial
                : generate_count,
          };
          this.itemGenerateCount.push(item);
          last_qty = 1 / last_qty;
        } else if (product[`qty_packagingl${i}`]) {
          last_qty = product[`qty_packagingl${i}`] / last_qty;
          generate_count = Math.ceil((count + count * _buff) / last_qty);
          let item = {
            level: i,
            quantity: product[`qty_packagingl${i}`],
            packaging_name: product[`packagingl${i}_name`],
            generate_count:
              generate_count < this.formData.min_count_generated_serial
                ? this.formData.min_count_generated_serial
                : generate_count,
          };
          this.itemGenerateCount.push(item);
        }
      }
    },
    deleteRow(item, index) {
      this.items.splice(index, 1);
      this.detailSerialOrAggregation.serial.splice(index, 1);
      dataPost.splice(index, 1);
      this.checkedSerials.splice(index, 1);
      this.chekcedBatch.splice(index, 1);
      if (this.items.length == 0) {
        this.can_process = false;
      }
    },
    async reset_status() {
      var message = `You are about to changes status to "Ready" to this data. This operation cannot be undone. Would you like to continue?`;

      if (confirm(message)) {
        this.$isLoading(true);
        let res = await resetProcessOrder({ id: this.formData.id });
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved succesfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) this.$router.back();
      }
    },
    async generate_serial() {
      this.$isLoading(true);
      let res = await generateProcessOrder({
        id: this.formData.id,
        approve: true,
        mfg_date: this.formData.mfg_date,
        exp_date: this.formData.exp_date,
        shelf_life: this.formData.shelf_life,
      });
      this.$isLoading(false);
      this.$toast.open({
        message: res['error']
          ? `${res['message']}`
          : 'Request is successful, we will immediately process the serial number for use',
        type: res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!res['error']) this.$router.back();
    },
    async submitAdditionSerial() {
      this.initialLoad = false;
      if (!this.additionalSerial.generate_count_level_1) {
        this.$toast.open({
          message: 'Please complete all required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      this.$isLoading(true);
      let res = await requestAdditionalSerial(this.additionalSerial);
      this.$isLoading(false);
      this.$toast.open({
        message: res['error']
          ? `${res['message']}`
          : 'Data has been saved succesfully ',
        type: res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!res['error']) {
        this.viewModalRequestSerial = false;
        this.loadData();
        this.additionalSerial.generate_count_level_1 = 0;
        this.additionalSerial.generate_count_level_2 = 0;
        this.additionalSerial.generate_count_level_3 = 0;
        this.additionalSerial.generate_count_level_4 = 0;
      }
    },
    isValid() {
      let required = [
        'process_order_erp',
        'generate_count_level_1',
        'lot_no',
        'batch_no',
        'product_id',
        // 'exp_date',
        // 'mfg_date',
      ];
      for (const key of required) {
        if (!this.formData[key]) {
          return false;
        }
      }
      if (!this.formData.het && this.formData.het != 0) {
        return false;
      }
      if (!this.formData.buff && this.formData.buff != 0) {
        return false;
      }
    },
    async save() {
      this.initialLoad = false;
      // // cek semua input yang mandatory
      if (!this.isValid) {
        return this.$toast.open({
          message: 'Please complete all required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = null;
        if (this.formData.id) {
          res = await updateProcessOrder(this.formData);
        } else {
          res = await insertProcessOrder(this.formData);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved succesfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) this.$router.back();
      }
      return;
    },
    rowClicked(item) {
      this.detail_item = item;
      this.detail_item.expired_date = item.exp_date;
      if (item.packaging_level == 1) {
        this.$toast.open({
          message: `No detail SN data to be viewed, SN [${item.serial_id}] is Packaging L1`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      this.viewModal = true;
      return;
    },
    requestSerial() {
      this.viewModalRequestSerial = true;
    },
    closeModal() {
      this.view = {};
      this.viewModal = false;
      this.viewModalRequestSerial = false;
    },
    cancel() {
      this.$router.back();
    },
  },
  computed: {
    dataFieldHistory() {
      return this.formData.generate_count_additional.map((item) => {
        return {
          ...item,
          generate_count_level_1: item.generate_count_level_1 || 0,
          generate_count_level_2: item.generate_count_level_2 || 0,
          generate_count_level_3: item.generate_count_level_3 || 0,
          generate_count_level_4: item.generate_count_level_4 || 0,
        };
      });
    },
    detailItems() {
      return this.formData.items.map((item) => {
        return {
          ...item,
          quantity: item.quantity || '-',
        };
      });
    },
    detailSerial() {
      return this.tabData.serials.map((item) => {
        return {
          ...item,
        };
      });
    },
    detailHistory() {
      return this.formData.history.map((item) => {
        return {
          ...item,
          created_date: moment
            .parseZone(item.created_date)
            .format('YYYY-MM-DD HH:mm'),
        };
      });
    },
  },
};
</script>

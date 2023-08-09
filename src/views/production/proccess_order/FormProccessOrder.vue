<template>
  <div class="row">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>Proccess Order [{{ route_action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6" md="6" lg="6">
              <CInput
                :disabled="action != 'Create'"
                horizontal
                :value.sync="formData.procces_order_erp"
                :is-valid="
                  initialLoad
                    ? null
                    : !formData.procces_order_erp
                    ? false
                    : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    ERP No.
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>

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

              <CInput horizontal :value.sync="formData.gtin" disabled>
                <template #label>
                  <p class="col-form-label col-sm-3">
                    GTIN
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput horizontal :value.sync="formData.nie" disabled>
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Nie
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action != 'Create'"
                horizontal
                :value.sync="formData.het"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Het</p>
                </template>
              </CInput>
              <CInput
                :disabled="action != 'Create'"
                horizontal
                :value.sync="formData.batch_no"
                :is-valid="
                  initialLoad ? null : !formData.batch_no ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Batch No.
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action != 'Create'"
                horizontal
                :value.sync="formData.lot_no"
                :is-valid="initialLoad ? null : !formData.lot_no ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Lot No.
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action != 'Create'"
                label="MFG Date *"
                horizontal
                type="date"
                placeholder="Enter MFG Date"
                v-model="formData.mfg_date"
                :is-valid="
                  initialLoad ? null : !formData.mfg_date ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    MFG Date
                    <span class="text-danger"> * </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action != 'Create'"
                label="EXP Date *"
                horizontal
                type="date"
                placeholder="Enter EXP Date"
                v-model="formData.exp_date"
                :is-valid="
                  initialLoad ? null : !formData.exp_date ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    EXP Date
                    <span class="text-danger"> * </span>
                  </p>
                </template>
              </CInput>
            </CCol>
            <CCol sm="6" md="6" lg="6">
              <CInput
                :disabled="action != 'Create'"
                horizontal
                :value.sync="formData.generate_count_level_1"
                type="number"
                @keypress="
                  limitNumber({
                    event: $event,
                    data: formData.generate_count_level_1,
                    max: 7,
                  })
                "
                :is-valid="
                  initialLoad
                    ? null
                    : !formData.generate_count_level_1
                    ? false
                    : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Total Production
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action != 'Create'"
                horizontal
                :value.sync="formData.buff"
                type="number"
                @keypress="
                  limitNumber({
                    event: $event,
                    data: formData.buff,
                    max: 2,
                  })
                "
                :is-valid="initialLoad ? null : !formData.buff ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Buff (%)
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="true"
                horizontal
                :value.sync="formData.min_count_generated_serial"
                type="number"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">Min Generated</p>
                </template>
              </CInput>
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
                class="mr-2"
                color="success"
                ><CIcon name="cil-check-circle" /> Request Additional
                Serial</CButton
              >
              <CButton
                v-if="[1, 4, 5, 6].includes(formData.status)"
                type="submit"
                size="sm"
                @click="viewModalHistory = true"
                class="mr-2"
                color="info"
                ><CIcon name="cil-check-circle" /> View History</CButton
              >
              <CButton
                v-if="[3, 4].includes(formData.status)"
                type="submit"
                size="sm"
                @click="viewModalSerial = true"
                class="mr-2"
                color="primary"
                ><CIcon name="cil-check-circle" /> View Serial</CButton
              >
            </CCol>
          </CRow>
          <!-- DATA TABLE untuk menampilkan semua data yang sudah berhasil di aggregatio oleh pihak ke 3 -->
          <CDataTable
            hover
            striped
            sorter
            tableFilter
            border
            :pagination="true"
            :items-per-page="50"
            :items="detailItems"
            :fields="fieldItems"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td>
                <CButton
                  v-if="item.packaging_level > 1"
                  size="sm"
                  color="info"
                  style="font-size: 12px"
                  class="px-2 my-2"
                  @click="rowClicked(item, index)"
                >
                  <v-icon name="eye" />
                </CButton>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
        <CCardFooter>
          <!-- Simpan data saat create-->
          <CButton
            v-if="action == 'Create'"
            type="submit"
            size="sm"
            @click="save()"
            class="mr-2"
            color="primary"
            ><CIcon name="cil-check-circle" /> Submit</CButton
          >
          <!-- Generate Serial data saat update-->
          <CButton
            v-if="formData.status == 0 && action == 'Update'"
            type="submit"
            size="sm"
            @click="generate_serial()"
            class="mr-2"
            color="primary"
            ><CIcon name="cil-check-circle" /> Generate Serial</CButton
          >
          <!-- Buton Cancel-->
          <ButtonBack />
        </CCardFooter>
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
            <CButton
              size="sm"
              color="danger"
              type="button"
              @click="closeModal()"
            >
              <CIcon name="cil-x-circle" /> Close
            </CButton>
          </template>
        </CModal>

        <!-- Modal untuk melihat detail aggregasi item stock setelah berhasil di closed / partial closed-->
        <CModal title="Detail" color="warning" :show.sync="viewModal" size="xl">
          <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
          <template #footer>
            <CButton
              size="sm"
              color="danger"
              type="button"
              @click="closeModal()"
            >
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
          <table style="width: 100%">
            <tr>
              <td><strong>Request Time</strong></td>
              <td><strong>Level 1</strong></td>
              <td><strong>Level 2</strong></td>
              <td><strong>Level 3</strong></td>
              <td><strong>Level 4</strong></td>
            </tr>
            <tr
              v-for="(item, index) in formData.generate_count_additional"
              :key="index"
            >
              <td>{{ item.modified_date }}</td>
              <td>{{ item.generate_count_level_1 }}</td>
              <td>{{ item.generate_count_level_2 }}</td>
              <td>{{ item.generate_count_level_3 }}</td>
              <td>{{ item.generate_count_level_4 }}</td>
            </tr>
          </table>
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
        <!-- Modal untuk melihat semua serial yang tersedia-->
        <CModal
          title="View Generated Serial"
          color="warning"
          :show.sync="viewModalSerial"
          size="lg"
        >
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
      </CCard>
    </div>
  </div>
</template>

<script>
let dataPost = [];
import 'vue-select/dist/vue-select.css';
import moment from 'moment';
import { getMstProduct } from '../../../resource/MstProduct';
import {
  generateProccessOrder,
  getAvalaibleSerial,
  getProccessOrder,
  insertProccessOrder,
  requestAdditionalSerial,
} from '../../../resource/ProccessOrder';
import { capitalizeFirstLetter, getConfig, onlyNumber } from '../../../utils';
export default {
  name: 'FormPacking',
  watch: {
    viewModalSerial: {
      deep: true,
      async handler(item) {
        if (item && this.serials.length == 0) {
          let _serials = await getAvalaibleSerial({
            id: this.$route.params.id,
          });
          if (_serials && !_serials.error) {
            this.serials = _serials.data[0].items;
          }
        }
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
            this.formData.gtin = product.gtin;
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
        het: null,
        procces_order_erp: '',
        buff: null,
        generate_count_level_1: null,
        generate_count_level_2: null,
        generate_count_level_3: null,
        generate_count_level_4: null,
        min_count_generated_serial: getConfig().min_count_generated_serial || 0,
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
      fieldItems: [
        {
          key: 'gtin_cp',
          label: 'GTIN / CP',
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
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
      fieldSerial: [
        {
          key: 'gtin_cp',
          label: 'GTIN / CP',
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
      ],
      serials: [],
      itemGenerateCount: [],
      detail_item: {},
      viewModal: false,
      viewModalRequestSerial: false,
      viewModalHistory: false,
      viewModalSerial: false,
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
    let _product = await getMstProduct({ product_type: 0 });
    if (_product) {
      for (const it of _product.data) {
        if (it.status == 'Active') {
          this.productOptions.push({
            value: it.id,
            name: it.name,
            label: `[${it.no}] ${it.name}`,
            item: it,
          });
        }
      }
    }
    if (this.action !== 'Create') {
      this.loadData();
    }
  },
  methods: {
    async loadData() {
      let _res = await getProccessOrder({ id: this.$route.params.id });
      if (_res && !_res.error) {
        this.formData = _res.data[0];
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
        this.can_proccess = false;
      }
    },
    async generate_serial() {
      this.$isLoading(true);
      let res = await generateProccessOrder({
        id: this.formData.id,
        approve: true,
      });
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
    async save() {
      this.initialLoad = false;
      // // cek semua input yang mandatory
      let required = [
        'procces_order_erp',
        'generate_count_level_1',
        'lot_no',
        'batch_no',
        'product_id',
        'exp_date',
        'mfg_date',
      ];
      for (const key of required) {
        if (!this.formData[key]) {
          this.$toast.open({
            message: 'Please complete all required data',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return false;
        }
      }

      this.$isLoading(true);
      let res = await insertProccessOrder(this.formData);
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
    detailItems() {
      return this.formData.items.map((item) => {
        return {
          ...item,
          quantity: item.quantity || '-',
        };
      });
    },
    detailSerial() {
      return this.serials.map((item) => {
        return {
          ...item,
          gtin_cp:
            item.epc_type == 'sscc' ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>

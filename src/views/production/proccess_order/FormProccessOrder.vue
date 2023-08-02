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
              <CSelect
                :disabled="action != 'Create'"
                placeholder="-Select-"
                :options="productOptions"
                horizontal
                :value.sync="formData.product_id"
                :is-valid="
                  initialLoad ? null : !formData.product_id ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Product Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>

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
              <CDataTable
                hover
                striped
                sorter
                border
                :items="itemGenerateCount"
                :fields="fieldGenerateCount"
                style="font-size: 12px"
              />
            </CCol>
          </CRow>
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
          <!-- <CButton type="button" size="sm" color="primary" @click="save()">
            <CIcon name="cil-check-circle" /> Submit
          </CButton> -->
          <CButton
            v-if="action == 'Create'"
            type="submit"
            size="sm"
            @click="save()"
            class="mr-2"
            color="primary"
            ><CIcon name="cil-check-circle" /> Submit</CButton
          >
          <CButton
            v-if="action == 'Approve'"
            type="submit"
            size="sm"
            @click="save()"
            class="mr-2"
            color="primary"
            ><CIcon name="cil-check-circle" /> Release</CButton
          >
          <CButton
            v-if="formData.status == 0"
            type="submit"
            size="sm"
            @click="generate_serial()"
            class="mr-2"
            color="primary"
            ><CIcon name="cil-check-circle" /> Generate Serial</CButton
          >
          <ButtonBack />
          <!-- <CButton
            v-if="can_print == true"
            type="button"
            size="sm"
            class="m-1"
            color="warning"
            @click="print_all()"
          >
            <CIcon name="cil-print" /> Print
          </CButton> -->
        </CCardFooter>
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
        <!-- Modal Detail Barang Dipilih  -->
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
  getProccessOrder,
  insertProccessOrder,
} from '../../../resource/ProccessOrder';
import { capitalizeFirstLetter, onlyNumber } from '../../../utils';
export default {
  name: 'FormPacking',
  watch: {
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
      itemGenerateCount: [],
      detail_item: {},
      viewModal: false,
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
    let _product = await getMstProduct({ product_type: 1, status: 'Active' });
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
    async loadData() {
      let _res = await getProccessOrder({ id: this.$route.params.id });
      if (_res && !_res.error) {
        this.formData = _res.data[0];
      }
      console.log(_res);
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
        if (i == 1) {
          let item = {
            level: 1,
            quantity: 1,
            generate_count: Math.ceil((count + count * _buff) / last_qty),
            packaging_name: product[`packagingl${i}_name`],
          };
          this.itemGenerateCount.push(item);
          last_qty = 1 / last_qty;
        } else if (product[`qty_packagingl${i}`]) {
          last_qty = product[`qty_packagingl${i}`] / last_qty;
          let item = {
            level: i,
            quantity: product[`qty_packagingl${i}`],
            generate_count: Math.ceil((count + count * _buff) / last_qty),
            packaging_name: product[`packagingl${i}_name`],
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
    closeModal() {
      this.view = {};
      this.viewModal = false;
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
  },
};
</script>

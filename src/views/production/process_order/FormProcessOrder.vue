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

              <SelectOption
                title="Product Name"
                :disabled="action == 'Create' ? false : true"
                required
                :options="productOptions"
                v-on:onchange="formData.product_id = $event"
                :value="formData.product_id"
                :isValid="
                  initialLoad ? null : !formData.product_id ? false : true
                "
                :col="[3, 9]"
              />

              <InputDefault
                :disabled="true"
                title="L1 GTIN"
                v-model="formData.gtin"
              />

              <InputDefault
                :disabled="true"
                title="NIE"
                v-model="formData.nie"
              />

              <InputDefault
                :disabled="action == 'Create' ? false : true"
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
                :disabled="action == 'Create' ? false : true"
                title="Lot No"
                :validasi="'alphanumeric'"
                v-model="formData.lot_no"
                :options="{ uppercase: true }"
                :required="true"
                :max="20"
                :is-valid="initialLoad ? null : !formData.lot_no ? false : true"
              />

              <InputDateDefault
                :disabled="
                  action != 'Create' &&
                  (action != 'Update' || formData.status == '4')
                "
                title="Mfg Date"
                v-model="formData.mfg_date"
                :options="{ format: 'dd/mm/yyyy' }"
                :required="true"
                :is-valid="
                  initialLoad ? null : !formData.mfg_date ? false : true
                "
              >
                <template #append>
                  <InputDefault
                    :title="null"
                    style="width: 400px"
                    :disabled="
                      action != 'Create' &&
                      (action != 'Update' || formData.status == '4')
                    "
                    :validasi="'integer'"
                    v-model="formData.shelf_life"
                    :description="formData.shelf_life ? 'Shelf Life' : null"
                    placeholder="Shelf Life"
                  >
                    <template #append>
                      <CButton disabled color="secondary">Month</CButton>
                    </template>
                  </InputDefault>
                </template>
              </InputDateDefault>

              <InputDateDefault
                :disabled="
                  action != 'Create' &&
                  (action != 'Update' || formData.status == '4')
                "
                title="Exp Date"
                v-model="formData.exp_date"
                :options="{ format: 'dd/mm/yyyy' }"
                :required="true"
                @input="handleInputEXP($event)"
                :is-valid="
                  initialLoad ? null : !formData.exp_date ? false : true
                "
              />

              <InputDefault
                :disabled="
                  action != 'Create' &&
                  (action != 'Update' || formData.status == '4')
                "
                title="HET"
                v-model="formData.het"
                :max="25"
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
                :disabled="action == 'Create' ? false : true"
                title="Target L1 Qty"
                :validasi="'integer'"
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
                :disabled="
                  action != 'Create' &&
                  (action != 'Update' || formData.status == '4')
                "
                title="Buff (%)"
                :validasi="'integer'"
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
                title="Additional EPC for Sample"
                v-model="formData.additional_serial_for_sample"
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
                v-if="formData.status == '4' && action == 'Update'"
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
                v-if="[1, 3, 4, 10].includes(formData.status) && !is_copy"
                type="submit"
                size="sm"
                @click="handleViewSerial"
                class="mr-2 mb-2"
                color="primary"
              >
                <CIcon name="cil-check-circle" /> View Serial</CButton
              >
              <CButton
                v-if="[1, 3, 4, 10].includes(formData.status) && !is_copy"
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
            v-if="
              action == 'Create' || (formData.status == 0 && action == 'Update')
            "
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

          <ButtonPermission
            v-if="formData.status == 4 && userInfo.id == 0"
            :buttonProperty="buttonReset"
            class="float-right"
            :permission="'approve'"
            @click="reset_status()"
          />
          <!-- Generate Serial data saat update-->
          <!-- Status 3 berarti belum dimulai batch -->
          <div v-if="formData.status == 3 && userInfo.id == 0 && !is_copy">
            <ButtonPopover
              :buttonProperty="buttonStart"
              :popover_list="['Online', 'Serialization']"
              class="float-right"
              :permission="'approve'"
              @handleClick="start_batch($event)"
              mt="-8"
            />
          </div>

          <!-- Status 4 berarti proses sudah dimulai -->
          <!-- Khusus station OFFLINE -->
          <div
            v-if="
              formData.status == 4 &&
              userInfo.id == 0 &&
              !is_copy &&
              station_type != 'online'
            "
          >
            <ButtonPopover
              :buttonProperty="buttonClose"
              :popover_list="['End Serialization', 'Partial', 'Final']"
              class="float-right"
              :permission="'approve'"
              @handleClick="closeDevelopment($event)"
              mt="-11"
            />
            <ButtonPopover
              :buttonProperty="buttonPause"
              :popover_list="['Serialization', 'Aggregation']"
              class="float-right"
              :permission="'approve'"
              @handleClick="pauseProgressDevelopment($event)"
              mt="-8"
            />
            <ButtonPopover
              :buttonProperty="buttonResume"
              :popover_list="['Serialization', 'Aggregation']"
              class="float-right"
              :permission="'approve'"
              @handleClick="resumeProgressDevelopment($event)"
              mt="-8"
            />
            <ButtonPopover
              :buttonProperty="buttonStart"
              :popover_list="['Serialization', 'Aggregation']"
              class="float-right"
              :permission="'approve'"
              @handleClick="start_batch($event)"
              mt="-8"
            />
          </div>
          <!-- Status 4 berarti proses sudah dimulai -->
          <!-- Khusus station ONLINE -->
          <div
            v-if="
              formData.status == 4 &&
              userInfo.id == 0 &&
              !is_copy &&
              station_type == 'online'
            "
          >
            <ButtonPopover
              :buttonProperty="buttonClose"
              :popover_list="['Partial', 'Final']"
              class="float-right"
              :permission="'approve'"
              @handleClick="closeDevelopment($event)"
              mt="-8"
            />
            <Button
              :buttonProperty="buttonPause"
              class="float-right"
              :permission="'approve'"
              @click="pauseProgressDevelopment('online')"
            />
            <Button
              :buttonProperty="buttonResume"
              class="float-right"
              :permission="'approve'"
              @click="resumeProgressDevelopment('online')"
              mt="-8"
            />
            <Button
              :buttonProperty="buttonStart"
              class="float-right"
              :permission="'approve'"
              @click="start_batch('online')"
            />
          </div>

          <!-- Buton Cancel-->
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </div>

    <!-- KUMPULAN MODAL DIDALAM FORMS PROCESS ORDER -->

    <!-- MODAL UNTUK MELIHAT WEIGHT -->
    <CModal
      title="Weight Configuration"
      color="warning"
      size="lg"
      :show.sync="viewModalWeight"
    >
      <table style="width: 100%">
        <tr style="border-bottom: 2px solid rgb(101, 101, 101)">
          <td style="width: 5%; text-align: center"><strong>Level</strong></td>
          <td style="width: 20%; text-align: center"><strong>Type</strong></td>
          <td style="width: 75%; text-align: center">
            <strong>Config</strong>
          </td>
        </tr>
        <tr
          v-for="level in formData.current_pack ? formData.current_pack : 4"
          :key="level"
        >
          <td style="text-align: center">
            {{ level }}
          </td>
          <td style="text-align: center">
            <label>
              {{
                formData[`weight_l${level}`].type
                  ? formData[`weight_l${level}`].type
                  : '-'
              }}
            </label>
          </td>
          <td>
            <CRow style="align-items: center">
              <CCol md="2">
                <label>Required: </label>
              </CCol>
              <CCol md="1">
                <label>
                  {{ formData[`weight_l${level}`].required ? 'Yes' : 'No' }}
                </label>
              </CCol>
              <!-- JIKA TYPE = PREDEFINED -->
              <CCol md="9">
                <CRow style="align-items: center">
                  <CCol md="3">
                    <label>Min (Kg): </label>
                  </CCol>
                  <CCol md="3">
                    <CInput
                      :disabled="true"
                      class="mb-0"
                      size="sm"
                      v-model="formData[`weight_l${level}`].min"
                    />
                  </CCol>
                  <CCol md="3">
                    <label>Max (Kg): </label>
                  </CCol>
                  <CCol md="3">
                    <CInput
                      :disabled="true"
                      class="mb-0"
                      size="sm"
                      v-model="formData[`weight_l${level}`].max"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </td>
        </tr>
      </table>
      <template #footer>
        <CButton
          size="sm"
          color="danger"
          type="button"
          @click="viewModalWeight = false"
        >
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>

    <!-- Modal untuk menambahkan data Request Additional Serial-->
    <CModal
      title="Request Additional Serial"
      color="success"
      :show.sync="viewModalRequestSerial"
    >
      <CRow>
        <CCol sm="12" md="12" lg="12">
          <div v-for="(item, index) in itemGenerateCount" :key="index">
            <InputDefault
              v-if="product[`qty_packagingl${index + 1}`] || index == 0"
              :disabled="additionalSerial.all && index >= 1"
              :title="`Pack Level ${index + 1}`"
              :validasi="'integer'"
              v-model="additionalSerial[`generate_count_level_${index + 1}`]"
              :max="7"
            />
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
      color="info"
      :show.sync="viewModalHistory"
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
      color="primary"
      :show.sync="viewModalSerial"
      size="lg"
    >
      <CRow>
        <CCol md="10">
          <CTabs :active-tab.sync="activeTab">
            <CTab title="Available" active> </CTab>
            <CTab title="Reserved"> </CTab>
            <CTab title="Production Outcome"> </CTab>
          </CTabs>
        </CCol>
        <CCol md="2">
          <p class="float-right">
            L1 Quantity: {{ tabData.quantity_l1 }}<br />
          </p>
        </CCol>
      </CRow>
      <CRow>
        <CCol md="6">
          <CInput
            placeholder="Filter data..."
            v-model="filterKeyword"
            @keyup.enter="applyFilter"
            class="mb-2 mt-2"
            size="sm"
          />
        </CCol>
      </CRow>
      <CDataTable
        :items="filteredItems"
        :fields="fieldSerial"
        hover
        striped
        border
        sorter
        :pagination="true"
        :items-per-page="10"
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
  startBatchProcessOrder,
  updateProcessOrder,
  closeBatchPO,
  changeProgressPO,
} from '../../../resource/ProcessOrder';
import {
  capitalizeFirstLetter,
  expFromShelfLife,
  getConfig,
  getProfile,
  handleBack,
  isJsonString,
  onlyNumber,
} from '../../../utils';
import { getConfStation } from '../../../resource/ConfStation';

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
        this.formData.exp_date = expFromShelfLife({
          mfg_date: this.formData.mfg_date,
          shelf_life: this.formData.shelf_life,
          type: getConfig()?.expiry_type,
        });
      },
    },
    'formData.mfg_date': {
      deep: true,
      handler(item) {
        this.formData.exp_date = expFromShelfLife({
          mfg_date: this.formData.mfg_date,
          shelf_life: this.formData.shelf_life,
          type: getConfig()?.expiry_type,
        });
      },
    },

    additionalSerial: {
      deep: true,
      handler(item) {
        if (item.all) {
          if (item.generate_count_level_1) {
            let qty = item.generate_count_level_1;
            for (var i = 2; i <= 4; i++) {
              let pack_qty = qty / this.product[`qty_packagingl${i}`];
              this.additionalSerial[`generate_count_level_${i}`] =
                Math.ceil(pack_qty) || 0;
            }
          } else {
            this.additionalSerial.generate_count_level_2 = '';
            this.additionalSerial.generate_count_level_3 = '';
            this.additionalSerial.generate_count_level_4 = '';
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
      is_copy: false,
      userInfo: getProfile(),
      activeTab: 0,
      initialLoad: true,
      buttonStart: {
        color: 'success',
        text: 'Start Batch',
        tooltip: '',
        icon: 'clipboard-check',
      },
      buttonClose: {
        color: 'danger',
        text: 'Close Batch',
        tooltip: '',
        icon: 'stop',
      },
      buttonPause: {
        color: 'warning',
        text: 'Pause Batch',
        tooltip: '',
        icon: 'pause',
      },
      buttonResume: {
        color: 'warning',
        text: 'Resume Batch',
        tooltip: '',
        icon: 'play',
      },
      buttonReset: {
        color: 'danger',
        text: 'Reset Batch',
        tooltip: '',
        icon: 'redo',
      },
      additionalSerial: {
        id: this.$route.params.id,
        generate_count_level_1: null,
        generate_count_level_2: null,
        generate_count_level_3: null,
        generate_count_level_4: null,
        all: true,
      },
      formData: {
        current_pack: 0,
        items: [],
        product_id: null,
        batch_no: '',
        lot_no: '',
        exp_date: null,
        mfg_date: null,
        het: '',
        process_order_erp: '',
        buff: 0,
        generate_count_level_1: null,
        generate_count_level_2: null,
        generate_count_level_3: null,
        generate_count_level_4: null,
        min_count_generated_serial: getConfig().min_count_generated_serial || 0,
        additional_serial_for_sample:
          getConfig().additional_serial_for_sample || 0,
        generate_count_additional: [],
        history: [],
        weight_l1: {},
        weight_l2: {},
        weight_l3: {},
        weight_l4: {},
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
          label: 'Full L1 Qty',
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
          key: 'finish_date',
          label: 'Finish Time',
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
      station_type: null,
      filterKeyword: '', // Input user
      filteredItems: [], // Data hasil filter
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
    await this.loadProduct();
    this.action = capitalizeFirstLetter(this.$route.params.type);
    // if (this.action != "Create") this.loadData();
    if (this.$route.params.id !== undefined) this.loadData();

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

    this.page = 1;
    if (this.action == 'Create' && this.$route.params.id) {
      this.is_copy = true;
    }
  },
  methods: {
    async loadProduct() {
      let param = {
        product_type: 0,
        show_status: true,
        status: 'Active',
      };
      let _product = await getMstProduct(param);
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
    },
    applyFilter() {
      const keyword = this.filterKeyword.toLowerCase();
      this.filteredItems = this.tabData.serials.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(keyword)
        )
      );
    },
    handleInputEXP($event) {
      if ($event) this.formData.shelf_life = null;
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
          (it) => it.status_sync == 'available'
        );
      } else if (this.activeTab == 1) {
        // RESERVED
        this.tabData.serials = this.serials.filter(
          (it) =>
            it.status_sync != 'available' && it.status_sync != 'preinbound'
        );
      } else if (this.activeTab == 2) {
        this.tabData.serials = this.serials.filter(
          (it) => it.status_sync == 'preinbound'
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
      this.applyFilter();
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
      this.station_type = null;
      if (_res && !_res.error) {
        this.formData = _res.data[0];
        this.formData.het = this.formData.het || '';
        this.formData.buff = this.formData.buff || 0;
        this.formData.min_count_generated_serial =
          getConfig().min_count_generated_serial || 0;
        this.formData.additional_serial_for_sample =
          this.formData.additional_serial_for_sample || 0;
        for (var level = 1; level <= 4; level++) {
          // Merubah String weight menjadi JSON
          let weight = { min: '-', max: '-', required: false };
          if (isJsonString(this.formData[`weight_l${level}`])) {
            weight = {
              ...weight,
              ...JSON.parse(this.formData[`weight_l${level}`]),
            };
          }
          this.formData[`weight_l${level}`] = weight;

          // Mencari packaging yang digunakan
          if (this.formData.product[`packagingl${level}_id`]) {
            this.formData.current_pack = level;
          }
        }
        if (this.formData.history) {
          for (const it of this.formData.history) {
            if (it.station_type == 'online') this.station_type = 'online';
          }
        }
        if (this.is_copy) {
          this.formData.history = [];
          this.formData.reason = null;
          this.formData.system_remark = null;
        }
      }
    },
    limitNumber({ event, data, max }) {
      onlyNumber({ event, data, max });
    },
    updateGenerateCount(product, count, buff) {
      let additional_sample = parseInt(
        this.formData.additional_serial_for_sample
      );
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
          if (additional_sample)
            item.generate_count = `${item.generate_count} + ${additional_sample}`;
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
          if (additional_sample)
            item.generate_count = `${item.generate_count} + ${additional_sample}`;
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
      if (!res['error']) handleBack(this.$router, this.$route);
    },
    async submitAdditionSerial() {
      this.initialLoad = false;
      if (
        !this.additionalSerial.generate_count_level_1 &&
        !this.additionalSerial.generate_count_level_2 &&
        !this.additionalSerial.generate_count_level_3 &&
        !this.additionalSerial.generate_count_level_4
      ) {
        this.$toast.open({
          message: 'Additional Serial cannot be empty',
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
          : 'Data has been saved successfully ',
        type: res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!res['error']) {
        this.viewModalRequestSerial = false;
        this.loadData();
        this.additionalSerial.generate_count_level_1 = '';
        this.additionalSerial.generate_count_level_2 = '';
        this.additionalSerial.generate_count_level_3 = '';
        this.additionalSerial.generate_count_level_4 = '';
      }
    },
    isValid() {
      if (!this.formData.process_order_erp) return false;
      if (!this.formData.product_id) return false;
      if (!this.formData.batch_no) return false;
      if (!this.formData.lot_no) return false;
      if (!this.formData.mfg_date) return false;
      if (!this.formData.exp_date) return false;
      if (!this.formData.generate_count_level_1) return false;
      return true;
    },
    async save() {
      this.initialLoad = false;
      // // cek semua input yang mandatory
      if (!this.isValid()) {
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
        let param = JSON.parse(JSON.stringify(this.formData));
        delete param.weight_l1;
        delete param.weight_l2;
        delete param.weight_l3;
        delete param.weight_l4;
        if (this.action === 'Create' && param.id) {
          delete param.id;
        }
        if (param.id) {
          res = await updateProcessOrder(param);
        } else {
          res = await insertProcessOrder(param);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) handleBack(this.$router, this.$route);
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
      handleBack(this.$router, this.$route);
    },

    async closeDevelopment(type) {
      this.$isLoading(true);
      function getRandomMinMax(n) {
        let result = { min: (Math.random() * 5).toFixed(2), max: null };
        result.max = (parseFloat(result.min) + parseFloat(n)).toFixed(2);
        return result;
      }
      if (type.toLowerCase().includes('serialization')) type = 'serialization';
      let res = await closeBatchPO({
        id: this.formData.id,
        type: type.toLowerCase(),
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
      if (!res['error']) this.loadData();
    },
    async start_batch($event) {
      let station_type = $event.toLowerCase();
      var message = `You are about to Start Batch to this data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = {
          station_type: station_type,
          id: this.formData.id,
          serial_ids: { type: 'all' },
        };
        let res = await startBatchProcessOrder(param);
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) this.$router.go();
      }
    },

    async pauseProgressDevelopment($event) {
      console.log('Pause Batch => ', $event);

      let station_type = $event.toLowerCase();
      this.$isLoading(true);
      let res = await changeProgressPO({
        id: this.formData.id,
        status: '2',
        station_type: station_type,
      });
      this.$isLoading(false);
      this.$toast.open({
        message: res['error']
          ? `${res['message']}`
          : 'Success change progress development',
        type: res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!res['error']) this.loadData();
    },

    async resumeProgressDevelopment($event) {
      let station_type = $event.toLowerCase();
      console.log('Resume Batch => ', $event);
      this.$isLoading(true);
      let res = await changeProgressPO({
        id: this.formData.id,
        status: '1',
        station_type: station_type,
      });
      this.$isLoading(false);
      this.$toast.open({
        message: res['error']
          ? `${res['message']}`
          : 'Success change progress development',
        type: res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!res['error']) this.loadData();
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
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) this.$router.go();
      }
    },
  },
  computed: {
    dataFieldHistory() {
      return this.formData.generate_count_additional.map((item) => {
        return {
          ...item,
          finish_date: item.finish_date
            ? moment(item.finish_date).format('YYYY-MM-DD HH:mm:ss')
            : '-',
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

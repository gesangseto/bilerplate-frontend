<template>
  <CRow>
    <CCol sm="12" md="12" lg="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Product [{{ route_action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Item No *"
                  placeholder="Enter item no"
                  horizontal
                  v-model="product.no"
                  @keyup="validationData()"
                  :add-input-classes="{
                    'is-invalid': error.no,
                  }"
                />
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Product Name *"
                  placeholder="Enter product name"
                  horizontal
                  @keyup="validationData()"
                  v-model="product.name"
                  :add-input-classes="{
                    'is-invalid': error.name,
                  }"
                />
              </CCol>
              <CCol sm="12">
                <CTextarea
                  :disabled="action == 'Read'"
                  label="Description"
                  placeholder="Enter product description"
                  @keyup="validationData()"
                  horizontal
                  v-model="product.description"
                />
              </CCol>
              <CCol sm="12">
                <CSelect
                  :disabled="action == 'Read'"
                  label="Category *"
                  horizontal
                  @change="validationData()"
                  placeholder="--Select--"
                  :options="listCategory"
                  :value.sync="product.mst_product_category_id"
                  :add-input-classes="{
                    'is-invalid': error.mst_product_category_id,
                  }"
                />
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="true"
                  label="L1 GTIN *"
                  description="Can only be changed by changing PID Level 1 and make sure there has been no transaction for this product."
                  horizontal
                  v-model="product.gtin"
                  @keyup="validateGtin()"
                  @keypress="
                    limitNumber({ event: $event, data: product.gtin, max: 14 })
                  "
                  :add-input-classes="{
                    'is-invalid': error.gtin,
                  }"
                  :invalid-feedback="error.gtin ? error.gtin : ''"
                />
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="NIE *"
                  placeholder="Enter product NIE"
                  @keyup="validationData()"
                  horizontal
                  v-model="product.nie"
                  :add-input-classes="{
                    'is-invalid': error.nie,
                  }"
                />
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="NIE Packaging (Kemasan NIE) *"
                  placeholder="Enter packaging description registered at BPOM"
                  horizontal
                  @keyup="validationData()"
                  v-model="product.kemasan_nie"
                  invalid-feedback="NIE packaging (kemasan NIE) is required"
                  :add-input-classes="{
                    'is-invalid': error.kemasan_nie,
                  }"
                />
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Min Stock"
                  placeholder="Enter minimum L1 stock threshold"
                  @keyup="validationData()"
                  horizontal
                  v-model="product.minimum"
                />
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Max Stock"
                  placeholder="Enter maximum L1 stock threshold"
                  @keyup="validationData()"
                  horizontal
                  v-model="product.maximum"
                />
              </CCol>

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Product Type
                  </CCol>
                  <CCol sm="9">
                    <CInputRadioGroup
                      v-if="action != 'Read'"
                      :options="productTypeOption"
                      :inline="true"
                      :checked.sync="product.product_type"
                    />
                    <p class="col-form-label col-sm-3" v-if="action == 'Read'">
                      {{
                        product.product_type == '0' ? 'Serial' : 'Non-Serial'
                      }}
                    </p>
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Show </CCol>
                  <SwitchDefault
                    :disabled="action == 'Read'"
                    :show_label="true"
                    :default_value="product.show_status"
                    v-on:onChange="product.show_status = $event"
                  />
                </CRow>
              </CCol>
              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="action == 'Read'"
                    :show_label="true"
                    :default_value="product.status"
                    v-on:onChange="product.status = $event"
                  />
                </CRow>
              </CCol>
            </CRow>
            <hr />
            <h4>Print Detail</h4>
            <br />
            <CRow>
              <CCol md="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Product Name *"
                  @keyup="validationData()"
                  horizontal
                  v-model="product.print_name"
                  invalid-feedback="Product name (print) is required"
                  placeholder="Enter product name for label printing"
                  :add-input-classes="{
                    'is-invalid': error.print_name,
                  }"
                />
              </CCol>
              <CCol md="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Description 1"
                  placeholder="Enter product description 1 for label printing"
                  horizontal
                  v-model="product.print_desc1"
                />
              </CCol>
              <CCol md="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Description 2"
                  placeholder="Enter product description 2 for label printing"
                  horizontal
                  v-model="product.print_desc2"
                />
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read'"
                  label="Storage Termperature *"
                  placeholder="Enter product storage temperature for label printing"
                  @keyup="validationData()"
                  horizontal
                  v-model="product.suhu"
                  invalid-feedback="Storage temperature is required"
                  :add-input-classes="{
                    'is-invalid': error.suhu,
                  }"
                />
              </CCol>
            </CRow>
            <hr />
            <h4 class="float-left">Packaging Detail</h4>
            <div style="background-color: red">
              <CButton
                class="float-right"
                v-on:click="showModalWeight()"
                v-c-tooltip="'Weight Config'"
              >
                <v-icon name="cog" :color="'black'" />
              </CButton>
              <p class="float-right">TEST</p>
            </div>

            <br />
            <br />
            <!-- Packaging LEVEL 1 -->
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol sm="7">
                    <CSelect
                      :disabled="action == 'Read'"
                      label="Packaging Level 1 *"
                      description="Packaging Level 1 of Product."
                      placeholder="--Select--"
                      horizontal
                      @change="validationData()"
                      :options="listPackaging"
                      :value.sync="product.packagingl1_id"
                      :add-input-classes="{
                        'is-invalid': error.packagingl1_id,
                      }"
                    />
                  </CCol>
                  <CCol sm="5">
                    <CButton
                      class="float-right"
                      v-on:click="ExpandPid.level_1 = !ExpandPid.level_1"
                    >
                      <v-icon v-if="!ExpandPid.level_1" name="angle-right" />
                      <v-icon v-if="ExpandPid.level_1" name="angle-down" />
                    </CButton>
                  </CCol>
                  <!-- CONFIG PID -->
                  <CCol sm="12">
                    <MasterPid
                      v-if="ExpandPid.level_1"
                      :readonly="
                        action == 'Read' ||
                        (product.flag_upd_del == 0 && action != 'Create')
                      "
                      :item="product"
                      :packaging_level="1"
                      v-on:handleResultPid="
                        handleResultPid({ result: $event, level: 1 })
                      "
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <!-- Packaging LEVEL 2 -->
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol sm="7">
                    <CSelect
                      :disabled="action == 'Read'"
                      label="Packaging Level 2 *"
                      description="Packaging Level 2 of Product."
                      placeholder="--Select L2 Packaging--"
                      horizontal
                      @change="validationData()"
                      :options="listPackaging"
                      :value.sync="product.packagingl2_id"
                      :add-input-classes="{
                        'is-invalid': error.packagingl2_id,
                      }"
                    />
                  </CCol>
                  <CCol sm="4">
                    <CInput
                      :disabled="
                        action == 'Read' ||
                        (product.flag_upd_del == 0 && action != 'Create')
                      "
                      label="Quantity *"
                      description="L1 Qty inside Pkg L2."
                      horizontal
                      v-model="product.qty_packagingl2"
                      @keypress="
                        limitNumber({
                          event: $event,
                          data: product.qty_packagingl2,
                          max: 3,
                        })
                      "
                      :add-input-classes="{
                        'is-invalid': error.qty_packagingl2,
                      }"
                      :invalid-feedback="error.qty_packagingl2"
                    />
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      class="float-right"
                      v-on:click="ExpandPid.level_2 = !ExpandPid.level_2"
                    >
                      <v-icon v-if="!ExpandPid.level_2" name="angle-right" />
                      <v-icon v-if="ExpandPid.level_2" name="angle-down" />
                    </CButton>
                  </CCol>
                  <CCol sm="12">
                    <MasterPid
                      v-if="ExpandPid.level_2"
                      :readonly="
                        action == 'Read' ||
                        (product.flag_upd_del == 0 && action != 'Create')
                      "
                      :item="product"
                      :packaging_level="2"
                      v-on:handleResultPid="
                        handleResultPid({ result: $event, level: 2 })
                      "
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <!-- Packaging LEVEL 3 -->
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol sm="7">
                    <CSelect
                      :disabled="action == 'Read'"
                      label="Packaging Level 3"
                      description="Packaging Level 3 of Product."
                      placeholder="--Select L3 Packaging--"
                      horizontal
                      @change="validationData()"
                      :options="listPackaging"
                      :value.sync="product.packagingl3_id"
                      :add-input-classes="{
                        'is-invalid': error.packagingl3_id,
                      }"
                    />
                  </CCol>
                  <CCol sm="4">
                    <CInput
                      :disabled="
                        action == 'Read' ||
                        (product.flag_upd_del == 0 && action != 'Create')
                      "
                      label="Quantity *"
                      description="L1 Qty inside Pkg L3."
                      horizontal
                      v-model="product.qty_packagingl3"
                      @keypress="
                        limitNumber({
                          event: $event,
                          data: product.qty_packagingl3,
                          max: 4,
                        })
                      "
                      :add-input-classes="{
                        'is-invalid': error.qty_packagingl3,
                      }"
                      :invalid-feedback="error.qty_packagingl3"
                    />
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      class="float-right"
                      v-on:click="ExpandPid.level_3 = !ExpandPid.level_3"
                    >
                      <v-icon v-if="!ExpandPid.level_3" name="angle-right" />
                      <v-icon v-if="ExpandPid.level_3" name="angle-down" />
                    </CButton>
                  </CCol>
                  <CCol sm="12">
                    <MasterPid
                      v-if="ExpandPid.level_3"
                      :readonly="
                        action == 'Read' ||
                        (product.flag_upd_del == 0 && action != 'Create')
                      "
                      :item="product"
                      :packaging_level="3"
                      v-on:handleResultPid="
                        handleResultPid({ result: $event, level: 3 })
                      "
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
            <!-- Packaging LEVEL 4 -->
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol sm="7">
                    <CSelect
                      :disabled="action == 'Read'"
                      label="Packaging Level 4"
                      description="Packaging Level 4 of Product."
                      placeholder="--Select L4 Packaging--"
                      horizontal
                      @change="validationData()"
                      :options="listPackaging"
                      :value.sync="product.packagingl4_id"
                      :add-input-classes="{
                        'is-invalid': error.packagingl4_id,
                      }"
                    />
                  </CCol>
                  <CCol sm="4">
                    <CInput
                      :disabled="
                        action == 'Read' ||
                        (product.flag_upd_del == 0 && action != 'Create')
                      "
                      label="Quantity *"
                      description="L1 Qty inside Pkg L4."
                      horizontal
                      v-model="product.qty_packagingl4"
                      @keypress="
                        limitNumber({
                          event: $event,
                          data: product.qty_packagingl4,
                          max: 5,
                        })
                      "
                      :add-input-classes="{
                        'is-invalid': error.qty_packagingl4,
                      }"
                      :invalid-feedback="error.qty_packagingl4"
                    />
                  </CCol>
                  <CCol sm="1">
                    <CButton
                      class="float-right"
                      v-on:click="ExpandPid.level_4 = !ExpandPid.level_4"
                    >
                      <v-icon v-if="!ExpandPid.level_4" name="angle-right" />
                      <v-icon v-if="ExpandPid.level_4" name="angle-down" />
                    </CButton>
                  </CCol>
                  <CCol sm="12">
                    <MasterPid
                      v-if="ExpandPid.level_4"
                      :readonly="
                        action == 'Read' ||
                        (product.flag_upd_del == 0 && action != 'Create')
                      "
                      :item="product"
                      :packaging_level="4"
                      v-on:handleResultPid="
                        handleResultPid({ result: $event, level: 4 })
                      "
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CForm>
        </CCardBody>
        <CModal
          title="Weight Configuration"
          color="warning"
          :show.sync="viewModalWeight"
          size="lg"
        >
          <table style="width: 100%">
            <tr>
              <td><strong>Level</strong></td>
              <td><strong>Min Weight (Kg)</strong></td>
              <td><strong>Max Weight (Kg)</strong></td>
              <td><strong>Required</strong></td>
            </tr>
            <tr v-for="(item, index) in [1, 2, 3, 4]" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <CInput
                  :disabled="action == 'Read'"
                  :placeholder="`Enter weight minimum L${index + 1}`"
                  horizontal
                  v-model="product_weight[`weight_min_l${index + 1}`]"
                  type="number"
                  :invalid-feedback="'Weight minimum must smaller than maximum'"
                  :add-input-classes="{
                    'is-invalid':
                      product_weight[`weight_min_l${index + 1}`] &&
                      product_weight[`weight_max_l${index + 1}`] &&
                      product_weight[`weight_min_l${index + 1}`] >=
                        product_weight[`weight_max_l${index + 1}`],
                  }"
                />
              </td>
              <td>
                <CInput
                  :disabled="action == 'Read'"
                  :placeholder="`Enter weight maximum L${index + 1}`"
                  horizontal
                  v-model="product_weight[`weight_max_l${index + 1}`]"
                  type="number"
                  :invalid-feedback="'Weight maximum must biger than minimum'"
                  :add-input-classes="{
                    'is-invalid':
                      product_weight[`weight_min_l${index + 1}`] &&
                      product_weight[`weight_max_l${index + 1}`] &&
                      product_weight[`weight_max_l${index + 1}`] <=
                        product_weight[`weight_min_l${index + 1}`],
                  }"
                />
              </td>
              <td>
                <SwitchDefault
                  :disabled="action == 'Read'"
                  :default_value="
                    product_weight[`weight_required_l${index + 1}`]
                  "
                  v-on:onChange="
                    product_weight[`weight_required_l${index + 1}`] = $event
                  "
                />
              </td>
            </tr>
          </table>
          <template #footer>
            <CButton
              :disabled="!allowSetWeight"
              size="sm"
              color="success"
              type="button"
              @click="setWeight()"
            >
              <CIcon name="cil-check-circle" /> Set
            </CButton>
          </template>
        </CModal>
        <CCardFooter>
          <CButton
            v-if="action == 'Read' ? false : true"
            @click="save()"
            color="primary"
            size="sm"
            type="submit"
          >
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { getMstPackaging } from '../../../resource/MstPackaging';
import {
  getMstProduct,
  insertMstProduct,
  updateMstProduct,
} from '../../../resource/MstProduct';
import { getMstProductCategory } from '../../../resource/MstProductCategory';
import { capitalizeFirstLetter, onlyNumber } from '../../../utils';

export default {
  watch: {
    product_weight: {
      handler(item) {
        this.allowSetWeight = true;
        for (var i = 1; i <= 4; i++) {
          let min = parseFloat(item[`weight_min_l${i}`]);
          let max = parseFloat(item[`weight_max_l${i}`]);
          if (min >= max) {
            this.allowSetWeight = false;
          }
        }
      },
      deep: true,
    },
    'product.mst_pid': {
      handler(val) {
        for (const it of val) {
          if (it.packaging_level == 1) {
            let id1 = it.id1 ?? '';
            let id2 = it.id2 ?? '';
            let id3 = it.id3 ?? '';
            let concat_gtin = '' + id1 + id2 + id3;
            if (concat_gtin.length == 13) {
              concat_gtin = '' + concat_gtin + this.gtinCheckDigit(concat_gtin);
            }
            this.product.gtin = concat_gtin;
          }
        }
      },
      deep: true,
    },
    'product.qty_packagingl2': {
      handler(val) {
        if (this.product.packagingl2_id) {
          if (this.product.packagingl3_id) {
            this.error.qty_packagingl3 = `Please re-enter this quantity`;
          }
          if (this.product.packagingl4_id) {
            this.error.qty_packagingl4 = `Please re-enter this quantity`;
          }
          val = parseInt(val);
          if (!val) {
            this.error.qty_packagingl2 = `Quantity must be greater than 0`;
          } else {
            this.error.qty_packagingl2 = ``;
          }
        }
      },
      deep: true,
    },
    'product.qty_packagingl3': {
      handler(val) {
        if (this.product.packagingl3_id) {
          if (this.product.packagingl4_id) {
            this.error.qty_packagingl4 = `Please re-enter this quantity`;
          }
          val = parseInt(val);
          let qty_child = parseInt(this.product.qty_packagingl2);
          if (val < qty_child) {
            this.error.qty_packagingl3 = `Quantity must be greater than ${qty_child}`;
          } else if (val % qty_child != 0) {
            this.error.qty_packagingl3 = `Quantity must be a multiple ${qty_child}`;
          } else {
            this.error.qty_packagingl3 = ``;
          }
        }
      },
      deep: true,
    },
    'product.qty_packagingl4': {
      handler(val) {
        if (this.product.packagingl4_id) {
          val = parseInt(val);
          let qty_child = parseInt(this.product.qty_packagingl3);
          if (val < qty_child) {
            this.error.qty_packagingl4 = `Quantity must be greater than ${qty_child}`;
          } else if (val % qty_child != 0) {
            this.error.qty_packagingl4 = `Quantity must be a multiple ${qty_child}`;
          } else {
            this.error.qty_packagingl4 = ``;
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    // Mengecek ada parameter yg dikiri di URL atau tidak
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id) {
      this.loadData();
      this.readOnly = true;
    }
    // memanggil metod untuk memanggil isi dropdown
    this.loadPackaging();
    this.loadProductCategory();
  },
  data() {
    return {
      allowSetWeight: true,
      viewModalWeight: false,
      route_action: '',
      action: null,
      initial_load: true,
      product_weight: {
        weight_required_l1: false,
        weight_min_l1: null,
        weight_max_l1: null,
        weight_required_l2: false,
        weight_min_l2: null,
        weight_max_l2: null,
        weight_required_l3: false,
        weight_min_l3: null,
        weight_max_l3: null,
        weight_required_l4: false,
        weight_min_l4: null,
        weight_max_l4: null,
      },
      product: {
        gtin: '',
        product_type: '0',
        status: 'Active',
        show_status: true,
        mst_pid: [],
        weight_required_l1: false,
        weight_min_l1: null,
        weight_max_l1: null,
        weight_required_l2: false,
        weight_min_l2: null,
        weight_max_l2: null,
        weight_required_l3: false,
        weight_min_l3: null,
        weight_max_l3: null,
        weight_required_l4: false,
        weight_min_l4: null,
        weight_max_l4: null,
      },
      error: this.initial_error(),
      listPackaging: [],
      listCategory: [],
      ExpandPid: {
        level_1: false,
        level_2: false,
        level_3: false,
        level_4: false,
      },
      pid_level_1: {},
      ResultPid: {
        level_1: [],
        level_2: [],
        level_3: [],
        level_4: [],
      },
      quantity_detail: {
        max_qty_level_1: null,
        max_qty_level_2: null,
        max_qty_level_3: null,
      },
      statusOptions: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' },
      ],
      productTypeOption: [
        { value: '0', label: 'Serial' },
        { value: '1', label: 'Non-Serial' },
      ],
    };
  },

  methods: {
    initial_error() {
      let tmp = {
        no: false,
        name: false,
        print_name: false,
        gtin: false,
        nie: false,
        kemasan_nie: false,
        mst_product_category_id: false,
        suhu: false,
        product_type: false,
        packagingl1_id: false,
        packagingl2_id: false,
        qty_packagingl2: '',
        qty_packagingl3: '',
      };
      return tmp;
    },
    async loadData() {
      let _res = await getMstProduct({ id: this.$route.params.id });
      let data = _res.data[0];
      this.product = data;
      this.product.product_type = `${this.product.product_type}`;
      for (let it of data.mst_pid) {
        this.ResultPid[`level_${it.packaging_level}`].push(it);
      }
      this.compressQuantity();
    },
    compressQuantity() {
      for (var i = 1; i <= 3; i++) {
        let lvl = i + 1;
        let current = i - 1;
        var this_qty = 0;
        if (this.quantity_detail[`max_qty_level_${current}`]) {
          this_qty =
            this.product[`qty_packagingl${lvl}`] /
            this.quantity_detail[`max_qty_level_${current}`];
        } else {
          this_qty = this.product[`qty_packagingl${lvl}`];
        }
        this.quantity_detail[`max_qty_level_${i}`] = parseInt(this_qty);
      }
    },
    extractQuantity() {
      for (var i = 3; i >= 1; i--) {
        // this.product[`qty_packagingl${i}`];
      }
    },
    handleResultPid({ result, level }) {
      if (level == 1) {
        this.pid_level_1 = result[0];
      }
      this.ResultPid[`level_${level}`] = result;
    },
    limitGtin({ event, data, max }) {
      onlyNumber({ event, data, max });
    },
    limitNumber({ event, data, max }) {
      onlyNumber({ event, data, max });
    },
    validationQuantity({ level }) {
      let this_packaging = this.product[`packagingl${level}_id`];
      // let this_qty = this.product[`qty_packagingl${level}`].replace(/\D/g, "");
      let this_qty = this.product[`qty_packagingl${level}`];
      this.product[`qty_packagingl${level}`] = this_qty;
      let qty = 0;
      let err_msg = '';
      let is_error = false;
      if (this_packaging && this_qty) {
        // CHEK PACK LEVEL DIBAWAHNYA
        if (this.product[`packagingl${level - 1}_id`]) {
          qty = this.product[`qty_packagingl${level - 1}`];
          if (this_qty % qty != 0) {
            err_msg = `Qty must be a multiple of ${qty}`;
            this.error[`qty_packagingl${level}`] = err_msg;
            is_error = true;
          } else {
            this.error[`qty_packagingl${level}`] = false;
          }
        }

        // CHEK PACK LEVEL DIATASNYA
        if (level < 4) {
          if (this.product[`packagingl${level + 1}_id`]) {
            qty = this.product[`qty_packagingl${level + 1}`];
            if (qty % this_qty != 0) {
              err_msg = 'Please re-enter this qty';
              this.error[`qty_packagingl${level + 1}`] = err_msg;
              is_error = true;
            } else {
              this.error[`qty_packagingl${level + 1}`] = false;
            }
          }
        }
      } else if (this_packaging && !this_qty) {
        err_msg = `Qty cannot be empty`;
        this.error[`qty_packagingl${level}`] = err_msg;
        is_error = true;
      }
      if (level === 2) {
        is_error = false;
      }
      if (is_error) {
        return false;
      }
      this.error[`qty_packagingl${level}`] = '';
      return true;
    },
    gtinCheckDigit(s) {
      let result = 0,
        i = 1;
      for (let counter = s.length - 1; counter >= 0; counter--) {
        result = result + parseInt(s.charAt(counter)) * (1 + 2 * (i % 2));
        i++;
      }
      return (10 - (result % 10)) % 10;
    },
    validateGtin() {
      let value = this.product.gtin;
      if (value) {
        if (value.length != 14) {
          this.error.gtin = 'GTIN must be 14 digits numeric';
          return false;
        }
        var barcode = value.substring(0, value.length - 1);
        var checksum = parseInt(value.substring(value.length - 1), 10);
        var calcSum = 0;
        var calcChecksum = 0;

        barcode.split('').map(function (number, index) {
          number = parseInt(number, 10);
          if (value.length % 2 === 0) {
            index += 1;
          }
          if (index % 2 === 0) {
            calcSum += number;
          } else {
            calcSum += number * 3;
          }
        });

        calcSum %= 10;
        calcChecksum = calcSum === 0 ? 0 : 10 - calcSum;

        if (calcChecksum !== checksum) {
          this.error.gtin = 'GTIN number is not valid';
          return false;
        }
        this.error.gtin = false;
        return true;
      } else {
        this.error.gtin = 'L1 GTIN is required';
        return false;
      }
    },
    async loadProductCategory() {
      let _res = await getMstProductCategory({ status: 'Active' });
      for (const it of _res['data']) {
        this.listCategory.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
    },
    async loadPackaging() {
      let _res = await getMstPackaging({ status: 'Active' });
      for (const it of _res['data']) {
        this.listPackaging.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
    },
    validationData() {
      if (this.initial_load) {
        return false;
      }
      let required = [];
      this.error = this.initial_error();
      let is_error = false;
      // CHECK GTIN
      if (!this.validateGtin()) {
        is_error = true;
      }
      // Check QTY
      if (
        !this.validationQuantity({ level: 3 })
        // !this.validationQuantity({ level: 4 })
      ) {
        is_error = true;
      }
      // CHECK PRODUCT
      for (var key in this.error) {
        if (!this.product[key] && this.product[key] != '0') {
          this.error[key] = `Product ${key} is required`;
          is_error = true;
          required.push(capitalizeFirstLetter(key));
        }
      }
      // CHECK PACKAGING
      for (var i = 1; i <= 4; i++) {
        let key = `level_${i}`;
        if (Array.isArray(this.ResultPid[key])) {
          for (const it of this.ResultPid[key]) {
            if (it.error) {
              this.ExpandPid[key] = true;
              is_error = true;
            }
          }
        }
        if (i == 1 && this.ResultPid[key].length === 0) {
          this.ExpandPid[key] = true;
          is_error = true;
        } else if (
          this.product[`packagingl${i}_id`] &&
          this.ResultPid[key].length === 0
        ) {
          this.ExpandPid[key] = true;
          is_error = true;
        }
      }
      // for (const key in this.ResultPid) {
      //   if (key == "level_3" && !this.product.packagingl3_id) {
      //     break;
      //   } else if (key == "level_4" && !this.product.packagingl4_id) {
      //     break;
      //   }
      //   if (this.ResultPid[key].length == 0) {
      //     this.ExpandPid[key] = true;
      //     is_error = true;
      //   } else {
      //     for (const it of this.ResultPid[key]) {
      //       if (it.error) {
      //         this.ExpandPid[key] = true;
      //         is_error = true;
      //       }
      //     }
      //   }
      // }
      // if have error
      if (is_error) {
        return false;
      }
      return true;
    },
    showModalWeight() {
      for (var i = 1; i <= 4; i++) {
        let min = this.product[`weight_min_l${i}`];
        let max = this.product[`weight_max_l${i}`];
        let required = this.product[`weight_required_l${i}`];
        this.product_weight[`weight_required_l${i}`] = required;
        this.product_weight[`weight_min_l${i}`] = min;
        this.product_weight[`weight_max_l${i}`] = max;
      }
      this.viewModalWeight = true;
    },
    setWeight() {
      this.viewModalWeight = false;
      this.product = { ...this.product, ...this.product_weight };
    },
    async save() {
      this.initial_load = false;
      if (!this.validationData()) {
        this.$toast.open({
          message: 'Please input all the required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let body = JSON.parse(JSON.stringify(this.product));
      let is_serial = body.product_type == '1' ? 0 : 1;
      let master_pid = [];
      for (const key in this.ResultPid) {
        if (key == 'level_4' && !this.product.packagingl4_id) {
          break;
        }
        for (let it of this.ResultPid[key]) {
          it.flag_serial = is_serial;
          it.product_id = this.$route.params.id;
          master_pid.push(it);
        }
      }
      body.mst_pid = master_pid;
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let dataPost = body;
        let res = {};
        if (this.action === 'Create' && dataPost.id) {
          delete dataPost.id;
        }
        if (dataPost.id) {
          res = await updateMstProduct(dataPost);
        } else {
          res = await insertMstProduct(dataPost);
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
    cancel() {
      this.$router.back();
    },
  },
};
</script>
>

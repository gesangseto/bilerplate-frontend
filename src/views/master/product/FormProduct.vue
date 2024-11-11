<template>
  <CRow>
    <CCol sm="12" md="12" lg="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm="12">
                <InputDefault
                  :disabled="true"
                  :col="[3, 9]"
                  title="ID"
                  v-model="product.id"
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  title="Item No ERP"
                  placeholder="Enter item no erp"
                  v-model="product.no"
                  :options="{ nospace: true }"
                  :required="true"
                  :isValid="initial_load ? null : !product.no ? false : true"
                  :col="[3, 9]"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  title="Product Name"
                  placeholder="Enter product name"
                  v-model="product.name"
                  :required="true"
                  :isValid="initial_load ? null : !product.name ? false : true"
                  :col="[3, 9]"
                />
              </CCol>
              <CCol sm="12">
                <TextareaDefault
                  :disabled="action == 'Read'"
                  title="Description"
                  placeholder="Enter product description"
                  v-model="product.description"
                  :col="[3, 9]"
                />
              </CCol>

              <CCol sm="12">
                <SelectOption
                  :disabled="action == 'Read'"
                  :required="true"
                  title="Category "
                  :options="listCategory"
                  v-on:onchange="product.mst_product_category_id = $event"
                  :value="product.mst_product_category_id"
                  :col="[3, 9]"
                  :isValid="
                    initial_load
                      ? null
                      : !product.mst_product_category_id
                      ? false
                      : true
                  "
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :col="[3, 9]"
                  title="Min Stock"
                  placeholder="Enter minimum L1 stock treshold"
                  v-model="product.minimum"
                  :validasi="'integer'"
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :col="[3, 9]"
                  title="Max Stock"
                  placeholder="Enter maximum L1 stock treshold"
                  v-model="product.maximum"
                  :validasi="'integer'"
                />
              </CCol>

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label">
                    Product Type
                  </CCol>
                  <CCol sm="9">
                    <CInputRadioGroup
                      v-if="product.flag_upd_del"
                      :options="productTypeOption"
                      :inline="true"
                      :checked.sync="product.product_type"
                    />
                    <p
                      class="col-form-label col-sm-3"
                      v-if="!product.flag_upd_del"
                    >
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
            <h4>Product Registration</h4>
            <br />
            <CRow>
              <CCol sm="12">
                <InputDefault
                  required
                  :disabled="
                    action == 'Read' ||
                    (product.flag_upd_del == 0 && action != 'Create')
                  "
                  validasi="alphanumeric"
                  title="NIE"
                  placeholder="NIE (Nomor Izin Edar)"
                  v-model="product.nie"
                  :isValid="initial_load ? null : isValidNIE()"
                  :col="[3, 9]"
                  :options="{ uppercase: true, nospace: true }"
                  :max="16"
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  required
                  :disabled="
                    action == 'Read' ||
                    (product.flag_upd_del == 0 && action != 'Create')
                  "
                  title="NIE Packaging (Kemasan NIE) "
                  placeholder="Enter packaging description registered at BPOM"
                  v-model="product.kemasan_nie"
                  :isValid="
                    initial_load ? null : product.kemasan_nie ? true : false
                  "
                  :col="[3, 9]"
                  :options="{ nodoublespace: true }"
                  :max="50"
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :disabled="true"
                  validasi="alphanumeric"
                  title="L1 GTIN"
                  description="Can only be changed by modifying Company Prefix and Item Reference and make sure there has been no transaction for this product."
                  v-model="product.gtin"
                  :isValid="initial_load ? null : isValidGTIN()"
                  :col="[3, 9]"
                  :options="{ uppercase: true, nospace: true }"
                  :max="16"
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :disabled="!product.flag_upd_del"
                  :col="[3, 9]"
                  title="Company Prefix"
                  v-model="product.company_prefix"
                  validasi="numeric"
                  :max="9"
                  :is-valid="
                    initial_load ? null : validasiCPIR() ? true : false
                  "
                  invalid_feedback="Company prefix and Item Reference must be 12 digits"
                >
                  <template #append>
                    <InputDefault
                      :disabled="!product.flag_upd_del"
                      :useBr="false"
                      :title="null"
                      style="width: 400px; margin-left: 10px"
                      validasi="numeric"
                      :max="5"
                      v-model="product.item_reference"
                      placeholder="Company prefix"
                      :is-valid="
                        initial_load ? null : validasiCPIR() ? true : false
                      "
                    >
                      <template #prepend>
                        <InputDefault
                          :useBr="false"
                          disabled
                          style="min-width: 120px"
                          placeholder="Item Reference"
                        />
                      </template>
                    </InputDefault>
                  </template>
                </InputDefault>
              </CCol>

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Generate BPOM Report </CCol>
                  <CCol sm="9">
                    <SwitchDefault
                      :disabled="!product.flag_upd_del"
                      :default_value="product.generate_bpom_report"
                      v-on:onChange="product.generate_bpom_report = $event"
                      description="
                    This value affects the product report that will be generated for BPOM
                    reporting. This value cannot change if there is already a
                    transaction in the BPOM Queue"
                    />
                  </CCol>
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
                  label="Storage Temperature *"
                  placeholder="Enter product storage temperature for label printing"
                  @keyup="validationData()"
                  horizontal
                  v-model="product.suhu"
                  :add-input-classes="{
                    'is-invalid': error.suhu,
                  }"
                />
              </CCol>
            </CRow>
            <hr />
            <h4 class="float-left">Packaging Detail</h4>
            <Button
              :buttonProperty="{
                size: 'sm',
                class: 'float-right',
                color: 'warning',
                icon: 'cog',
                text: 'Weight Config',
                tooltip: '',
              }"
              @click="showModalWeight()"
            />
            <br />
            <br />
            <div>
              <MasterPid :product="product" :packaging_level="'1'" />
            </div>
          </CForm>
          <br /><br /><br />
          <Metadata
            :defaultMetadata="product.metadata"
            v-on:handleChange="
              (product.metadata = $event.result),
                (product.error_metadata = $event.error_metadata)
            "
            model="mst_product"
          />
        </CCardBody>
        <ProductWeight
          :readonly="action == 'Read'"
          :product="product"
          :showModal="viewModalWeight"
          v-on:onCloseModal="viewModalWeight = false"
          v-on:onSubmit="handleChangeWeight($event)"
        />

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
import {
  getMstProduct,
  insertMstProduct,
  updateMstProduct,
} from '../../../resource/MstProduct';
import { getMstProductCategory } from '../../../resource/MstProductCategory';
import { capitalizeFirstLetter, checkDigit, onlyNumber } from '../../../utils';

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
      handler(item = Array) {
        let pid = item.find(
          (it) => it.packaging_level == 1 && it.epc_type == 'sgtin'
        );
        let id1 = null;
        if (this.product.gtin) id1 = Array.from(this.product.gtin)[0];
        if (pid && pid.id1 != id1) this.handleChangeGtin();
        else if (!pid) {
          this.product.gtin = null;
        }
      },
      deep: true,
    },
    'product.company_prefix': {
      handler(item) {
        this.handleChangeGtin();
      },
      deep: true,
    },
    'product.item_reference': {
      handler(item) {
        this.handleChangeGtin();
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
    if (this.action == 'Read') {
      this.disabled = true;
      this.product.flag_upd_del = 0;
    }
    // memanggil metod untuk memanggil isi dropdown
    this.loadProductCategory();
  },
  data() {
    return {
      disabled: false,
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
        id: null,
        nie: '',
        company_prefix: '',
        item_reference: '',
        gtin: '',
        product_type: '0',
        status: 'Active',
        show_status: true,
        flag_upd_del: 1,
        current_pack: 1,
        mst_product_category_id: null,
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
    validasiCPIR() {
      if (!this.product.company_prefix && !this.product.item_reference) {
        return true;
      }
      let lenght_cp = this.product.company_prefix.length;
      let lenght_ir = this.product.item_reference.length;
      if (lenght_cp + lenght_ir !== 12) {
        return false;
      } else {
        return `${this.product.company_prefix}${this.product.item_reference}`;
      }
    },
    handleChangeWeight(item) {
      this.product = { ...this.product, ...item };
    },
    initial_error() {
      // Inisialisasi error untuk PRODUCT
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
      };
      return tmp;
    },
    async loadData() {
      let _res = await getMstProduct({ id: this.$route.params.id });
      let data = _res.data[0];
      this.product = data;
      this.product.product_type = `${this.product.product_type}`;
      if (this.action === 'Create') {
        this.product.flag_upd_del = 1;
        this.product.id = null;
      } else if (this.action == 'Read') {
        this.product.flag_upd_del = 0;
      }
    },
    handleChangeGtin() {
      // Jika terjadi perubahan yang mempengaruhi gtin
      let pid_l1 = this.product.mst_pid.find(
        (it) => it.packaging_level == 1 && it.epc_type == 'sgtin'
      );
      let id1 = null;
      if (pid_l1) id1 = pid_l1.id1;
      let item_reference = this.product.item_reference;
      let company_prefix = this.product.company_prefix;
      if (item_reference && company_prefix) {
        let gtin = `${id1}${company_prefix}${item_reference}`;
        gtin = `${gtin}${checkDigit(gtin)}`;
        this.product.gtin = gtin;
      } else if (item_reference && company_prefix && id1) {
        let gtin = `${id1}${company_prefix}${item_reference}`;
        gtin = `${gtin}${checkDigit(gtin)}`;
        this.product.gtin = gtin;
      } else {
        this.product.gtin = null;
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
    limitString({ event, data, max }) {
      event = event ? event : window.event;
      if (data && max && data.toString().length >= max) {
        event.preventDefault();
      }
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
    isValidNIE() {
      if (!this.product.nie && this.product.gtin) {
        return true;
      } else {
        const regex = /^.{15,16}$/;
        return regex.test(this.product.nie);
      }
    },
    isValidGTIN() {
      if (this.product.gtin) {
        if (this.product.gtin.length == 14) return true;
      } else if (!this.product.gtin) {
        return null;
      }
      return false;
    },
    validationNieOrGtin(type = 'all') {
      if (type == 'all' && !this.product.gtin && !this.product.nie) {
        return false;
      }
      let company_prefix = this.product.company_prefix;
      let item_reference = this.product.item_reference;

      let mst_pid = JSON.parse(JSON.stringify(this.product.mst_pid));
      let have_nie = mst_pid.find((it) => it.epc_type == 'nie');
      let have_gtin_sscc = mst_pid.find(
        (it) => it.epc_type == 'sgtin' || it.epc_type == 'sscc'
      );
      if ((type == 'all' || type == 'nie') && have_nie && !this.product.nie) {
        return false;
      } else if (
        (type == 'all' || type == 'gtin' || type == 'sscc') &&
        have_gtin_sscc
      ) {
        if (!item_reference || !company_prefix) {
          return false;
        } else if (`${company_prefix}${item_reference}`.length != 12) {
          return false;
        }
      }
      return true;
    },

    validationData() {
      if (this.initial_load) {
        return false;
      }
      if (this.product.error_metadata) {
        return false;
      }
      if (!this.validasiCPIR()) {
        return false;
      }
      if (!this.isValidNIE()) {
        return false;
      }
      let required = [];
      this.error = this.initial_error();
      let is_error = false;
      // CHeck Company prefix and item reference / NIE
      if (!this.validationNieOrGtin()) {
        is_error = true;
      }

      // CHECK PRODUCT
      for (var key in this.error) {
        if (!this.product[key] && this.product[key] != '0') {
          this.error[key] = `Product ${key} is required`;
          is_error = true;
          if (key == 'gtin' || key == 'nie' || key == 'company_prefix') {
            is_error = false;
          }
          required.push(capitalizeFirstLetter(key));
        }
      }
      // Check Error PID
      for (const it of this.product.mst_pid) {
        if (it.error) {
          is_error = true;
          break;
        }
      }

      // CHECK PACKAGING
      for (var i = 1; lvl <= this.product.current_pack; lvl++) {
        if (!this.product[`packagingl${i}_id`]) {
          is_error = true;
          break;
        }
      }
      // Check Quantity
      for (var lvl = 2; lvl <= this.product.current_pack; lvl++) {
        let thisQty = this.product[`qty_packagingl${lvl}`];
        let childQty = 1;
        if (this.product[`qty_packagingl${lvl - 1}`]) {
          childQty = this.product[`qty_packagingl${lvl - 1}`];
        }
        if (thisQty % childQty != 0 || !thisQty) {
          is_error = true;
          break;
        }
      }
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
      body.mst_pid = body.mst_pid.map((it) => {
        return {
          ...it,
          flag_serial: is_serial,
          product_id: this.$route.params.id,
        };
      });
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

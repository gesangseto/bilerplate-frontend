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
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid': !$v.product.no.$error && $v.product.no.required,
                    'is-invalid':
                      $v.product.no.$error && !$v.product.no.required,
                  }"
                  horizontal
                  invalid-feedback="Item No is required"
                  placeholder="Enter item number"
                  v-model="product.no"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Item No
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.name.$error && $v.product.name.required,
                    'is-invalid':
                      $v.product.name.$error && !$v.product.name.required,
                  }"
                  autocomplete="name"
                  horizontal
                  invalid-feedback="Product name is required"
                  placeholder="Enter product name"
                  v-model="product.name"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Product Name
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CTextarea
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.description.$error &&
                      $v.product.description.required,
                    'is-invalid':
                      $v.product.description.$error &&
                      !$v.product.description.required,
                  }"
                  horizontal
                  invalid-feedback="Description is required"
                  placeholder="Enter product description"
                  v-model="product.description"
                  rows="5"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Description
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CTextarea>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CSelect
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.mst_product_category_id.$error &&
                      $v.product.mst_product_category_id.required,
                    'is-invalid':
                      $v.product.mst_product_category_id.$error &&
                      !$v.product.mst_product_category_id.required,
                  }"
                  :options="listCategory"
                  :value.sync="product.mst_product_category_id"
                  horizontal
                  invalid-feedback="Category is required"
                  label="Category"
                  placeholder="--Select--"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Category
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CSelect>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  :disabled="
                    action == 'Read' || product.flag_upd_del == 0 ? true : false
                  "
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.gtin.$error &&
                      $v.product.gtin.required &&
                      validateGtin(product.gtin),
                    'is-invalid':
                      ($v.product.gtin.$error && !$v.product.gtin.required) ||
                      (product.gtin && !validateGtin(product.gtin)),
                  }"
                  horizontal
                  :invalid-feedback="error_message.gtin"
                  placeholder="Enter GTIN for L1 Packaging"
                  :maxlength="14"
                  id="gtin"
                  v-model="product.gtin"
                  @keypress="limitGtin()"
                  @change="validateGtin(product.gtin)"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      L1 GTIN
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.nie.$error && $v.product.nie.required,
                    'is-invalid':
                      $v.product.nie.$error && !$v.product.nie.required,
                  }"
                  horizontal
                  invalid-feedback="NIE is required"
                  label="NIE *"
                  :maxlength="15"
                  @keypress="limitNie()"
                  placeholder="Enter product NIE"
                  v-model="product.nie"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      NIE
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.size.$error && $v.product.size.required,
                    'is-invalid':
                      $v.product.size.$error && !$v.product.size.required,
                  }"
                  horizontal
                  invalid-feedback="NIE packaging (kemasan NIE) is required"
                  placeholder="Enter packaging description registered at BPOM"
                  v-model="product.size"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      NIE Packaging (Kemasan NIE)
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.print_name.$error &&
                      $v.product.print_name.required,
                    'is-invalid':
                      $v.product.print_name.$error &&
                      !$v.product.print_name.required,
                  }"
                  horizontal
                  invalid-feedback="Product name (print) is required"
                  placeholder="Enter product name for label printing"
                  v-model="product.print_name"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Product Name (Print)
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <!-- Temperature -->
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.suhu.$error && $v.product.suhu.required,
                    'is-invalid':
                      $v.product.suhu.$error && !$v.product.suhu.required,
                  }"
                  type="text"
                  horizontal
                  placeholder="Enter product storage temperature for label printing"
                  v-model="product.suhu"
                  invalid-feedback="Storage temperature is required"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Storage Temperature
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CSelect
                  :disabled="action == 'Read' ? true : false"
                  :add-input-classes="{
                    'is-valid':
                      !$v.product.packagingl1_id.$error &&
                      $v.product.packagingl1_id.required,
                    'is-invalid':
                      $v.product.packagingl1_id.$error &&
                      !$v.product.packagingl1_id.required,
                  }"
                  invalid-feedback="Packaging L1 is required"
                  :horizontal="{ label: 'col-sm-6', input: 'col-sm-6' }"
                  :options="listPackaging"
                  v-model="product.packagingl1_id"
                  placeholder="--Select--"
                >
                  <template #label>
                    <p
                      class="col-form-label col-sm-3 col-md-3 col-lg-3 col-xl-3"
                    >
                      Packaging L1
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </p>
                  </template>
                </CSelect>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CRow>
                  <CCol sm="6" md="6" lg="6">
                    <CSelect
                      :disabled="action == 'Read' ? true : false"
                      :add-input-classes="{
                        'is-valid':
                          !$v.product.packagingl2_id.$error &&
                          $v.product.packagingl2_id.required,
                        'is-invalid':
                          $v.product.packagingl2_id.$error &&
                          !$v.product.packagingl2_id.required,
                      }"
                      invalid-feedback="Packaging L2 is required"
                      :horizontal="{ label: 'col-sm-6', input: 'col-sm-6' }"
                      :options="listPackaging"
                      @change="packagingL2Change()"
                      :value.sync="product.packagingl2_id"
                      placeholder="Select L2 packaging"
                    >
                      <template #label>
                        <p
                          class="
                            col-form-label col-sm-6 col-md-6 col-lg-6 col-xl-6
                          "
                        >
                          Packaging L2
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </p>
                      </template>
                    </CSelect>
                  </CCol>
                  <CCol sm="3" md="3" lg="3">
                    <CInput
                      :disabled="action == 'Read' ? true : false"
                      :readonly="
                        !product.packagingl2_id || product.flag_upd_del == 0
                          ? true
                          : false
                      "
                      :add-input-classes="{
                        'is-invalid':
                          product.packagingl2_id && error_message.qty_l2 != '',
                      }"
                      :invalid-feedback="error_message.qty_l2"
                      @change="qtyPackagingL2Change()"
                      @keyup="qtyPackagingL2Change()"
                      v-model="product.qty_packagingl2"
                      id="qty_l2"
                      horizontal
                      label="L1 Qty"
                      placeholder="L1 Qty inside Pkg L2"
                    />
                  </CCol>
                  <CCol sm="3" md="3" lg="3" id="only-number">
                    <CInput
                      :disabled="
                        action == 'Read' || product.flag_upd_del == 0
                          ? true
                          : false
                      "
                      :readonly="product.packagingl2_id ? false : true"
                      :add-input-classes="{
                        'is-invalid':
                          product.packagingl2_id && !product.prefix_packagingl2,
                      }"
                      :invalid-feedback="error_message.prefix_l2"
                      horizontal
                      type="text"
                      min="0"
                      max="999"
                      :maxlength="1"
                      v-model="product.prefix_packagingl2"
                      label="SN Prefix"
                      id="prefix2"
                    >
                    </CInput>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CRow>
                  <CCol sm="6" md="6" lg="6">
                    <CSelect
                      :disabled="action == 'Read' ? true : false"
                      :add-input-classes="{
                        'is-valid':
                          !$v.product.packagingl3_id.$error &&
                          $v.product.packagingl3_id.required,
                        'is-invalid':
                          $v.product.packagingl3_id.$error &&
                          !$v.product.packagingl3_id.required,
                      }"
                      invalid-feedback="Packaging L3 is required"
                      :horizontal="{ label: 'col-sm-6', input: 'col-sm-6' }"
                      :options="listPackaging"
                      :value.sync="product.packagingl3_id"
                      @change="packagingL3Change()"
                      placeholder="Select L3 Packaging"
                    >
                      <template #label>
                        <p
                          class="
                            col-form-label col-sm-6 col-md-6 col-lg-6 col-xl-6
                          "
                        >
                          Packaging L3
                          <span class="text-danger">
                            <strong>*</strong>
                          </span>
                        </p>
                      </template>
                    </CSelect>
                  </CCol>
                  <CCol sm="3" md="3" lg="3">
                    <CInput
                      :disabled="
                        action == 'Read' || product.flag_upd_del == 0
                          ? true
                          : false
                      "
                      :readonly="!product.packagingl3_id ? true : false"
                      :add-input-classes="{
                        'is-invalid':
                          product.packagingl3_id && error_message.qty_l3 != '',
                      }"
                      :invalid-feedback="error_message.qty_l3"
                      @change="qtyPackagingL3Change()"
                      @keyup="qtyPackagingL3Change()"
                      v-model="product.qty_packagingl3"
                      id="qty_l3"
                      horizontal
                      label="L1 Qty"
                      placeholder="L1 Qty inside Pkg L3"
                    />
                  </CCol>
                  <CCol sm="3" md="3" lg="3" id="only">
                    <CInput
                      :disabled="true"
                      :readonly="product.packagingl3_id ? false : true"
                      horizontal
                      type="text"
                      v-model="product.prefix_packagingl3"
                      label="SN Prefix"
                      id="prefix3"
                      min="0"
                      max="999"
                      :maxlength="1"
                    >
                    </CInput>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <!-- 
              <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CRow>
                  <CCol sm="6" md="6" lg="6">
                    <CSelect
                      :disabled="action == 'Read' ? true : false"
                      :horizontal="{ label: 'col-sm-6', input: 'col-sm-6' }"
                      :options="listPackagingL4"
                      @change="packagingL4Change()"
                      :value.sync="product.packagingl4_id"
                      label="Packaging L4"
                      placeholder="Select packaging L4"
                    />
                  </CCol>
                  <CCol sm="3" md="3" lg="3">
                    <CInput
                      :disabled="
                        action == 'Read' || product.flag_upd_del == 0
                          ? true
                          : false
                      "
                      :readonly="!product.packagingl4_id ? true : false"
                      :add-input-classes="{
                        'is-invalid':
                          product.packagingl4_id && error_message.qty_l4 != '',
                      }"
                      @change="qtyPackagingL4Change()"
                      :invalid-feedback="error_message.qty_l4"
                      id="qty_l4"
                      :value.sync="product.qty_packagingl4"
                      horizontal
                      label="L1 Qty"
                      placeholder="Qty Packaging L4 inner L3"
                    />
                  </CCol>
                  <CCol sm="3" md="3" lg="3" id="number">
                    <CInput
                      :disabled="
                        action == 'Read' || product.flag_upd_del == 0
                          ? true
                          : false
                      "
                      :readonly="product.packagingl4_id ? false : true"
                      :add-input-classes="{
                        'is-invalid':
                          product.packagingl4_id && !product.prefix_packagingl4,
                      }"
                      :invalid-feedback="error_message.prefix_l4"
                      horizontal
                      type="text"
                      min="0"
                      max="999"
                      :maxlength="1"
                      pattern="^[0-9]$"
                      v-model="product.prefix_packagingl4"
                      label="SN Prefix"
                      id="prefix4"
                    >
                    </CInput>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
             -->

            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  placeholder="Enter minimum L1 stock threshold"
                  :disabled="action == 'Read' ? true : false"
                  :horizontal="{ label: 'col-sm-6', input: 'col-sm-6' }"
                  invalid-feedback="Maximum Stock product is required"
                  v-model="product.minimum"
                  type="number"
                  min="0"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Minimum Stock
                      <span class="text-danger">
                        <strong></strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CInput
                  placeholder="Enter maximum L1 stock threshold"
                  :disabled="action == 'Read' ? true : false"
                  :horizontal="{ label: 'col-sm-6', input: 'col-sm-6' }"
                  invalid-feedback="Maximum Stock product is required"
                  v-model="product.maximum"
                  type="number"
                  min="0"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Maximum Stock
                      <span class="text-danger">
                        <strong></strong>
                      </span>
                    </p>
                  </template>
                </CInput>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CRow form class="form-group">
                  <CCol sm="3"> Product Type</CCol>
                  <CInputRadioGroup
                    v-if="action != 'Read'"
                    class="col-sm-9"
                    :options="productTypeOption"
                    :inline="true"
                    :checked.sync="product.product_type"
                  />
                  <p class="col-form-label col-sm-3" v-if="action == 'Read'">
                    {{ product.product_type == 0 ? 'Serial' : 'Non-Serial' }}
                  </p>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
                <CRow form class="form-group">
                  <CCol sm="3"> Show </CCol>
                  <CInputCheckbox
                    v-if="action != 'Read'"
                    class="col-sm-9"
                    :checked.sync="product.show_status"
                    @change="showStatusChange()"
                  />
                  <p class="col-form-label col-sm-3" v-if="action == 'Read'">
                    {{ product.show_status == 1 ? 'Yes' : 'No' }}
                  </p>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="11" md="11" lg="11" xl="11">
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
          </CForm>
        </CCardBody>
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
import $axiosMertrack from '../../../apiMertrack';
import { capitalizeFirstLetter } from '../../../utils';
import $ from 'jquery';
import { required } from 'vuelidate/lib/validators';
import { getMstPackaging } from '../../../resource/MstPackaging';
import { getMstProductCategory } from '../../../resource/MstProductCategory';
import {
  insertMstProductV1,
  updateMstProductV1,
} from '../../../resource/MstProduct';
export default {
  mounted() {
    // Mengecek ada parameter yg dikiri di URL atau tidak
    // return;
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
      this.readOnly = true;
    }

    // memanggil metod untuk memanggil isi dropdown
    this.loadPackaging();
    this.loadProductCategory();

    // input only angka
    $(function () {
      $('#qty_l2').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) ||
          (/65|67|86|88/.test(e.keyCode) &&
            (!0 === e.ctrlKey || !0 === e.metaKey)) ||
          (35 <= e.keyCode && 40 >= e.keyCode) ||
          ((e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) &&
            (96 > e.keyCode || 105 < e.keyCode) &&
            e.preventDefault());
      });
      $('#qty_l3').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) ||
          (/65|67|86|88/.test(e.keyCode) &&
            (!0 === e.ctrlKey || !0 === e.metaKey)) ||
          (35 <= e.keyCode && 40 >= e.keyCode) ||
          ((e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) &&
            (96 > e.keyCode || 105 < e.keyCode) &&
            e.preventDefault());
      });
      $('#qty_l4').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) ||
          (/65|67|86|88/.test(e.keyCode) &&
            (!0 === e.ctrlKey || !0 === e.metaKey)) ||
          (35 <= e.keyCode && 40 >= e.keyCode) ||
          ((e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) &&
            (96 > e.keyCode || 105 < e.keyCode) &&
            e.preventDefault());
      });
    });

    $(function () {
      $('#prefix2').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) ||
          (/65|67|86|88/.test(e.keyCode) &&
            (!0 === e.ctrlKey || !0 === e.metaKey)) ||
          (35 <= e.keyCode && 40 >= e.keyCode) ||
          ((e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) &&
            (96 > e.keyCode || 105 < e.keyCode) &&
            e.preventDefault());
      });
      $('#prefix3').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) ||
          (/65|67|86|88/.test(e.keyCode) &&
            (!0 === e.ctrlKey || !0 === e.metaKey)) ||
          (35 <= e.keyCode && 40 >= e.keyCode) ||
          ((e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) &&
            (96 > e.keyCode || 105 < e.keyCode) &&
            e.preventDefault());
      });
      $('#prefix4').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) ||
          (/65|67|86|88/.test(e.keyCode) &&
            (!0 === e.ctrlKey || !0 === e.metaKey)) ||
          (35 <= e.keyCode && 40 >= e.keyCode) ||
          ((e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) &&
            (96 > e.keyCode || 105 < e.keyCode) &&
            e.preventDefault());
      });
    });

    $(function () {
      $('#gtin').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) ||
          (/65|67|86|88/.test(e.keyCode) &&
            (!0 === e.ctrlKey || !0 === e.metaKey)) ||
          (35 <= e.keyCode && 40 >= e.keyCode) ||
          ((e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) &&
            (96 > e.keyCode || 105 < e.keyCode) &&
            e.preventDefault());
      });
    });
  },
  data() {
    return {
      route_action: '',
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
      productTypeOption: [
        { value: '0', label: 'Serial' },
        { value: '1', label: 'Non-Serial' },
      ],
      // minimumQty: 0,
      // maximumQty: 0,
      laravelTemperature: '',
      product: { status: 'Active', product_type: 0, show_status: true },
      error_message: {
        gtin: 'L1 GTIN is required',
        prefix_l2: 'SN Prefix is required',
        prefix_l3: 'SN Prefix is required',
        prefix_l4: 'SN Prefix is required',
        qty_l2: '',
        qty_l3: '',
        qty_l4: '',
      },
      can_add: false,
      can_edit: false,
      can_view: false,
      selected: [], // Must be an array reference!
      show: true,
      action: 'Edit',
      horizontal: { label: 'col-3', input: 'col-9' },
      packagings: {},
      qtyPack: {},
      listCategory: [],
      listPackaging: [],
      listPackagingL4: [],
      listStatus: [],
      listQtyPackaging2: [],
      listQtyPackaging3: ['1', '2'],
      listQtyPackaging4: ['1', '2'],
      selectedOption: ['some value', 'another value'],
      readOnly: false,
    };
  },
  validations: {
    product: {
      no: { required },
      print_name: { required },
      name: { required },
      gtin: { required, maxlength: 14 },
      nie: { required, maxlength: 15 },
      description: { required },
      size: { required },
      packagingl1_id: { required },
      packagingl2_id: { required },
      packagingl3_id: { required },
      mst_product_category_id: { required },
      suhu: { required },
      status: { required },
    },
  },
  methods: {
    loadData() {
      let param = `id=${this.$route.params.id}`;
      $axiosMertrack.get(`v3/master/product?${param}`).then((response) => {
        let data = response.data.data[0];
        this.product = data;
        let gtin_lvl_2 = data.mst_pid.find(
          (it) => it.packaging_level == 2 && it.flag_full == 1
        );
        if (gtin_lvl_2) {
          if (gtin_lvl_2.epc_type == 'sgtin') {
            this.product.prefix_packagingl2 = gtin_lvl_2.sn_prefix;
          } else {
            this.product.prefix_packagingl2 = gtin_lvl_2.id1;
          }
        } else {
          this.product.prefix_packagingl2 = '-';
        }
        this.product.prefix_packagingl3 = '-';
        this.product.product_type = `${data.product_type}`;
      });
      return;
    },
    showStatusChange() {},
    packagingL2Change() {
      if (
        parseInt(this.product.qty_packagingl2) == 0 ||
        !this.product.qty_packagingl2
      ) {
        this.error_message.qty_l2 = 'Qty must be grater than 0';
        this.error_message.prefix_l2 = 'SN Prefix is required';
        return;
      }
    },
    packagingL3Change() {
      if (
        parseInt(this.product.qty_packagingl3) == 0 ||
        !this.product.qty_packagingl3
      ) {
        this.error_message.qty_l3 = 'Qty must be grater than 0';
        // this.error_message.prefix_l3 = "SN Prefix is required";
        return;
      }
    },
    packagingL4Change() {
      if (
        parseInt(this.product.qty_packagingl4) == 0 ||
        !this.product.qty_packagingl4
      ) {
        this.error_message.qty_l4 = 'Qty must be grater than 0';
        this.error_message.prefix_l4 = 'SN Prefix is required';
        return;
      }
    },
    qtyPackagingL2Change() {
      // if (!this.product.packagingl1_id) {
      //   return (this.error_message.qty_l2 =
      //     "Must Select Packaging Level 1 First");
      // } else
      if (
        parseInt(this.product.qty_packagingl2) == 0 ||
        !this.product.qty_packagingl2
      ) {
        return (this.error_message.qty_l2 = 'Qty must be grater than 0');
      }
      this.error_message.qty_l2 = '';
      if (this.product.packagingl3_id) {
        this.error_message.qty_l3 = 'Please re-enter this qty';
      }
      if (this.product.packagingl4_id) {
        this.error_message.qty_l4 = 'Please re-enter this qty';
      }
    },
    qtyPackagingL3Change() {
      var sisa = this.product.qty_packagingl3 % this.product.qty_packagingl2;
      if (isNaN(sisa)) {
        this.error_message.qty_l3 = `Qty of Packaging L2 must be filled in first.`;
        return;
      }
      if (
        parseInt(this.product.qty_packagingl3) <
          parseInt(this.product.qty_packagingl2) ||
        !this.product.qty_packagingl3
      ) {
        this.error_message.qty_l3 = `Qty must be greater than or equal to ${this.product.qty_packagingl2}`;
        return;
      }
      if (sisa != 0) {
        this.error_message.qty_l3 = `Qty must be a multiple of ${this.product.qty_packagingl2}`;
        return;
      }
      if (this.product.packagingl4_id) {
        this.error_message.qty_l4 = 'Please re-enter this qty';
      }
      this.error_message.qty_l3 = '';
    },
    qtyPackagingL4Change() {
      var sisa = this.product.qty_packagingl4 % this.product.qty_packagingl3;
      if (isNaN(sisa)) {
        this.error_message.qty_l4 = `Qty of Packaging L3 must be filled in first.`;
        return;
      }
      if (
        parseInt(this.product.qty_packagingl4) <
          parseInt(this.product.qty_packagingl3) ||
        !this.product.qty_packagingl4
      ) {
        this.error_message.qty_l4 = `Qty must be greater than or equal to ${this.product.qty_packagingl3}`;
        return;
      }
      if (sisa != 0) {
        this.error_message.qty_l4 = `Qty must be a multiple of ${this.product.qty_packagingl3}`;
        return;
      }
      this.error_message.qty_l4 = '';
    },
    validateGtin(value) {
      if (value) {
        if (value.length != 14) {
          this.error_message.gtin = 'GTIN must be 14 digits numeric';
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
          this.error_message.gtin = 'GTIN number is not valid';
          return false;
        }
        this.error_message.gtin = '';
        return true;
      } else {
        this.error_message.gtin = 'L1 GTIN is required';
        return false;
      }
    },
    limitGtin() {
      if (this.product.gtin) {
        if (this.product.gtin.length >= 14) {
          this.$toast.open({
            message: `Maximum length of GTIN allowed is 14 digits numeric`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 3000,
          });
        }
      } else {
      }
    },
    limitNie() {
      if (this.product.nie != '' || this.product.nie != null) {
        if (this.product.nie.length >= 15) {
          this.$toast.open({
            message: `Maximum length of NIE allowed is 15 characters`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 3000,
          });
        }
      } else {
      }
    },
    async loadProductCategory() {
      let res = await getMstProductCategory({ status: 'Active' });
      if (res) {
        let data = res.data;
        for (const it of data) {
          this.listCategory.push({
            value: `${it.id}`,
            label: it.name,
          });
        }
      }
    },
    async loadPackaging() {
      let res = await getMstPackaging({ status: 'Active' });
      if (res) {
        let data = res.data;
        this.listPackagingL4.push({
          value: null,
          label: '--Select--',
        });
        for (const it of data) {
          this.listPackaging.push({
            value: `${it.id}`,
            label: it.name,
          });
          this.listPackagingL4.push({
            value: `${it.id}`,
            label: it.name,
          });
        }
      }
    },

    async save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return true;
      }
      if (this.product.packagingl2_id) {
        if (
          this.error_message.qty_l2 != '' ||
          !this.product.prefix_packagingl2
        ) {
          return;
        }
      }
      if (this.product.packagingl3_id) {
        if (this.error_message.qty_l3 != '') {
          return;
        }
      }
      if (this.product.packagingl4_id) {
        if (this.error_message.qty_l4 != '') {
          return;
        }
      }
      if (this.error_message.gtin != '') {
        return;
      }
      let dataPost = this.product;
      dataPost.show_status = dataPost.show_status ? 1 : 0;
      if (!dataPost.packagingl4_id) {
        dataPost.packagingl4_id = null;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = {};
        if (dataPost.id) {
          res = await updateMstProductV1(dataPost);
        } else {
          res = await insertMstProductV1(dataPost);
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

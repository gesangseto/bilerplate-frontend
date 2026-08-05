<template>
  <div>
    <CRow style="margin-bottom: -10px">
      <CCol md="12">
        <table style="margin: 5px; width: 100%">
          <tr>
            <td style="width: 25%"><label>EPC Type *</label></td>
            <td>
              <CSelect
                :options="listEpcType"
                :value.sync="result.epc_type"
                @update:value="handleChangeEpc()"
                placeholder="--Select--"
                :is-valid="required.epc_type.valid"
                :invalid-feedback="required.epc_type.message"
              />
            </td>
          </tr>
          <tbody v-if="result.epc_type">
            <tr>
              <td style="width: 25%"><label>EPC Key *</label></td>
              <td>
                <CInput
                  v-model="result.epc_key"
                  @keypress="
                    validateCharSet({
                      event: $event,
                      type: 'epc_key',
                    })
                  "
                  :is-valid="required.epc_key.valid"
                  :invalid-feedback="required.epc_key.message"
                />
              </td>
            </tr>
            <tr v-if="result.epc_type != 'sscc'">
              <td style="width: 25%"><label>SN *</label></td>
              <td>
                <CInput
                  v-model="result.serial"
                  @keypress="
                    validateCharSet({
                      event: $event,
                      type: 'serial',
                    })
                  "
                  @keyup="uppercase"
                  :is-valid="required.serial.valid"
                  :invalid-feedback="required.serial.message"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </CCol>
      <CCol md="12">
        <!-- <table style="margin: 5px; width: 100%">
          <tr>
            <td style="width: 25%"><label>Batch No *</label></td>
            <td>
              <CInput
                v-model="result.batch_no"
                :is-valid="required.batch_no.valid"
                :invalid-feedback="required.batch_no.message"
              />
            </td>
          </tr>
          <tr>
            <td style="width: 25%"><label>Exp Date *</label></td>
            <td>
              <datepicker
                :format="formatDate"
                v-model="result.exp"
                :is-valid="valid.exp"
                invalid-feedback="Exp date No is required"
              >
              </datepicker>
              <small v-if="required.exp.valid === false" style="color: #ff5c57">
                {{ required.exp.message }}
              </small>
            </td>
          </tr>
        </table> -->
      </CCol>
    </CRow>
    <CRow>
      <CCol md="12" class="float-right">
        <br />
        <div class="float-right">
          <CButton size="sm" v-on:click="handleClickGenerate()" color="primary">
            <v-icon name="qrcode" /> Generate
          </CButton>
          &nbsp;
          <CButton size="sm" v-on:click="handleReset()" color="secondary">
            <v-icon name="broom" /> Reset
          </CButton>
        </div>
      </CCol>
    </CRow>

    <CModal
      centered="centered"
      :show.sync="barcode_property.modal"
      title="Show Barcode"
      color="warning"
    >
      <CRow>
        <CCol md="12">
          <div style="text-align: center">
            <canvas
              class="float-rigth"
              id="canvasBarcode"
              ref="canvasBarcode"
            ></canvas>
            <p style="font-size: 6pt">{{ barcode_property.data.barcode_hr }}</p>
          </div>
        </CCol>
      </CRow>
      <template #footer>
        <CButton @click="barcode_property.modal = false" color="danger">
          <CIcon name="cil-ban" /> Close</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import bwipjs from 'bwip-js';
import { parsingDataToBarcode, isValidEpcKey, isValidNie } from '../../utils';
import invalid_barcode from '../../assets/invalid_barcode.png';
import moment from 'moment';
// import $axios from "../../api";

export default {
  name: 'HeaderManualBarcodeGenerator',
  props: [],
  watch: {
    result: {
      deep: true,
      handler(data) {
        this.handleValidation();
      },
    },
  },
  mounted() {},
  data() {
    return {
      barcode_property: {
        modal: false,
        data: {
          barcode: null,
          barcode_2d: null,
          barcode_hr: null,
        },
      },
      inputTypeOption: [
        { value: 'sscc', label: 'SSCC' },
        { value: 'non_sscc', label: 'Partial SSCC' },
      ],
      required: this.initial_required(),
      is_error: false,
      valid: this.initial_valid(),
      role: this.initial_role(),
      initial_load: true,
      result: this.initial_result(),
      listEpcType: [
        {
          value: 'sscc',
          label: 'SSCC',
        },
        {
          value: 'sgtin',
          label: 'SGTIN',
        },
        {
          value: 'nie',
          label: 'NIE',
        },
      ],
    };
  },
  methods: {
    initial_valid() {
      let initial = {
        sscc: null,
        gtin: null,
        serial: null,
        epc_type: null,
        exp: null,
        batch_no: null,
      };
      return initial;
    },
    initial_required() {
      let data = {
        epc_type: { valid: null, message: 'EPC type is invalid' },
        epc_key: { valid: null, message: 'EPC Key is invalid' },
        serial: { valid: null, message: 'SN is required' },
        batch_no: { valid: null, message: 'Batch No is required' },
        exp: { valid: null, message: 'Exp date is required' },
      };
      return data;
    },
    initial_role() {
      let initial = {
        disabled_serial: true,
        length_com_prefix: 9,
        length_serial: 20,
        length_sscc: 18,
        length_gtin: 14,
      };
      return initial;
    },
    initial_result() {
      let initial = {
        epc_key: null,
        batch_no: null,
        exp: null,
        serial: null,
        epc_type: null,
      };
      return initial;
    },
    handleChangeEpc() {
      this.required = this.initial_required();
      this.role = this.initial_role();
      this.result.epc_key = null;
      this.result.serial = null;
      if (this.result.epc_type == 'sgtin') {
        this.title = 'GTIN (14 digits)';
        this.role.disabled_serial = false;
      } else if (this.result.epc_type == 'sscc') {
        this.role.disabled_serial = true;
        this.title = 'SSCC (18 digits)';
      } else if (this.result.epc_type == 'nie') {
        this.role.disabled_serial = false;
        this.title = 'NIE (Max 15 characters)';
      } else {
        this.title = '*';
      }
    },
    validateCharSet: function ({ event, type }) {
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      if (type == 'serial') {
        if (this.result.serial && this.result.serial.length == 21) {
          event.preventDefault();
        }
      } else {
        if (this.result.epc_type == 'sscc') {
          if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
          } else if (this.result.epc_key && this.result.epc_key.length == 18) {
            event.preventDefault();
          }
        } else if (this.result.epc_type == 'sgtin') {
          if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
          } else if (this.result.epc_key && this.result.epc_key.length == 14) {
            event.preventDefault();
          }
        } else if (this.result.epc_type == 'nie') {
          if (this.result.epc_key && this.result.epc_key.length == 15) {
            event.preventDefault();
          }
        }
      }
    },
    uppercase: function () {
      this.result.serial = this.result.serial.toUpperCase();
    },
    handleValidation() {
      this.required = this.initial_required();
      this.is_error = false;

      if (!this.result.epc_key) {
        this.is_error = true;
        this.required.epc_key.valid = false;
      } else if (this.result.epc_type == 'sscc') {
        if (
          !isValidEpcKey(this.result.epc_key) ||
          this.result.epc_key.length != 18
        ) {
          this.is_error = true;
          this.required.epc_key.valid = false;
        }
      } else if (this.result.epc_type == 'sgtin') {
        if (
          !isValidEpcKey(this.result.epc_key) ||
          this.result.epc_key.length != 14
        ) {
          this.is_error = true;
          this.required.epc_key.valid = false;
        }
      } else if (this.result.epc_type == 'nie') {
        if (
          !isValidNie(this.result.epc_key) ||
          this.result.epc_key.length > 15
        ) {
          this.is_error = true;
          this.required.epc_key.valid = false;
        }
      }

      if (this.result.epc_type != 'sscc' && !this.result.serial) {
        this.is_error = true;
        this.required.serial.valid = false;
      }
      if (this.initial_load) {
        return true;
      }
      if (!this.result.epc_type) {
        this.required.epc_type.valid = false;
        this.is_error = true;
      }
      if (this.is_error) {
        return false;
      }
      return true;
    },

    handleClickGenerate() {
      this.initial_load = false;
      if (!this.handleValidation()) {
        return;
      }
      this.generateBarcode();
      this.barcode_property.modal = true;
      this.$emit('handleClickGenerate', this.result);
      return;
    },
    handleReset() {
      this.initial_load = true;
      this.role = this.initial_role();
      this.result = this.initial_result();
      this.valid = this.initial_valid();
      this.$emit('handleReset', this.result);
    },
    generateBarcode() {
      let obj_result = JSON.parse(JSON.stringify(this.result));
      this.barcode_property.data.barcode = parsingDataToBarcode({
        data_object: obj_result,
      });
      if (!this.barcode_property.data.barcode) {
        this.invalidBarcode();
        this.barcode_property.data.barcode_hr = 'Invalid Barcode';
        return;
      }
      this.barcode_property.data.barcode_hr =
        this.renderEpcHr(this.barcode_property.data.barcode) ?? ' ';
      bwipjs.toCanvas('canvasBarcode', {
        bcid: `gs1datamatrix`, // Barcode type
        text: this.barcode_property.data.barcode, // Text to encode
        scaleX: 3, // 3x scaling factor
        scaleY: 3, // 3x scaling factor
        // height: 3, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: 'center', // Always good to set this
      });
      return;
    },
    invalidBarcode() {
      let cvn = this.$refs.canvasBarcode;
      let ctx = cvn.getContext('2d');
      cvn.width = 140;
      cvn.height = 140;
      let bg = new Image();
      bg.src = invalid_barcode;
      bg.onload = function () {
        ctx.drawImage(bg, 0, 0, 140, 140);
      };
      return;
    },
    renderEpcHr(item) {
      item = item.replace(/\(/g, ' (');
      item = item.trim();
      return item;
    },
    formatDate(date) {
      return moment(date).format('DD-MMM-YYYY');
    },
  },
};
</script>

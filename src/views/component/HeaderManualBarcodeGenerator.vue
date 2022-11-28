<template>
  <div>
    <CRow style="margin-bottom: -10px">
      <CCol md="6">
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

          <tr v-if="result.epc_type == 'sscc'">
            <td style="width: 25%"><label>Input Type</label></td>
            <td>
              <CInputRadioGroup
                :options="inputTypeOption"
                :inline="true"
                :checked.sync="result.input_type"
              />
            </td>
          </tr>
          <tr v-if="result.epc_type == 'sscc' && result.input_type == 'sscc'">
            <td style="width: 25%"><label>SSCC *</label></td>
            <td>
              <CInput
                v-model="result.sscc"
                @keypress="
                  validateCharSet({
                    event: $event,
                    max: role.length_sscc,
                    name: 'sscc',
                    type: 'number',
                  })
                "
                :is-valid="required.sscc.valid"
                :invalid-feedback="required.sscc.message"
              />
            </td>
          </tr>
          <tr
            v-if="result.epc_type == 'sscc' && result.input_type == 'non_sscc'"
          >
            <td style="width: 25%"><label>Comp. Prefix - SN *</label></td>
            <td>
              <CRow>
                <CCol md="6">
                  <CInput
                    v-c-tooltip="
                      'Company prefix with a minimum length of 6 digits and a maximum length of 9 digits.'
                    "
                    placeholder="Company Prefix"
                    v-model="result.company_prefix"
                    @keypress="
                      validateCharSet({
                        event: $event,
                        max: role.length_com_prefix,
                        name: 'company_prefix',
                        type: 'alphanumeric',
                      })
                    "
                    :is-valid="required.company_prefix.valid"
                    :invalid-feedback="required.company_prefix.message"
                  />
                </CCol>
                <CCol md="6">
                  <CInput
                    v-c-tooltip="
                      `The length of the SN is the remainder of subtracting 17 by the total length Company Prefix.`
                    "
                    placeholder="SN"
                    v-model="result.serial"
                    @keypress="
                      validateCharSet({
                        event: $event,
                        max: role.length_serial,
                        name: 'serial',
                        type: 'alphanumeric',
                      })
                    "
                    :is-valid="required.serial.valid"
                    :invalid-feedback="required.serial.message"
                  />
                </CCol>
              </CRow>
            </td>
          </tr>
          <tr v-if="result.epc_type == 'sgtin'">
            <td style="width: 25%"><label>GTIN *</label></td>
            <td>
              <CInput
                v-model="result.gtin"
                @keypress="
                  validateCharSet({
                    event: $event,
                    max: role.length_gtin,
                    name: 'gtin',
                    type: 'number',
                  })
                "
                :is-valid="required.gtin.valid"
                :invalid-feedback="required.gtin.message"
              />
            </td>
          </tr>
          <tr v-if="result.epc_type == 'sgtin'">
            <td style="width: 25%"><label>SN *</label></td>
            <td>
              <CInput
                v-model="result.serial"
                @keypress="
                  validateCharSet({
                    event: $event,
                    max: role.length_serial,
                    name: 'serial',
                    type: 'alphanumeric',
                  })
                "
                :is-valid="required.serial.valid"
                :invalid-feedback="required.serial.message"
              />
            </td>
          </tr>
        </table>
      </CCol>
      <CCol md="6">
        <table style="margin: 5px; width: 100%">
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
        </table>
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
import bwipjs from "bwip-js";
import Datepicker from "vuejs-datepicker";
import { parsingDataToBarcode, checkDigit } from "../../utils";
import invalid_barcode from "../../assets/invalid_barcode.png";
import moment from "moment";
// import $axiosMertrack from "../../apiMertrack";

export default {
  name: "HeaderManualBarcodeGenerator",
  components: {
    Datepicker,
  },
  props: [],
  watch: {
    result: {
      deep: true,
      handler(n, o) {
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
        { value: "sscc", label: "SSCC" },
        { value: "non_sscc", label: "Partial SSCC" },
      ],
      required: this.initial_required(),
      is_error: false,
      valid: this.initial_valid(),
      role: this.initial_role(),
      initial_load: true,
      result: this.initial_result(),
      listEpcType: [
        {
          value: "sscc",
          label: "SSCC",
        },
        {
          value: "sgtin",
          label: "SGTIN",
        },
      ],
    };
  },
  methods: {
    initial_valid() {
      let initial = {
        sscc: null,
        gtin: null,
        company_prefix: null,
        serial: null,
        epc_type: null,
        exp: null,
        batch_no: null,
      };
      return initial;
    },
    initial_required() {
      let data = {
        epc_type: { valid: null, message: "EPC type is invalid" },
        sscc: { valid: null, message: "SSCC number is invalid" },
        gtin: { valid: null, message: "GTIN number is invalid" },
        serial: { valid: null, message: "SN is required" },
        company_prefix: { valid: null, message: "Company Prefix is required" },
        batch_no: { valid: null, message: "Batch No is required" },
        exp: { valid: null, message: "Exp date is required" },
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
        sscc: null,
        gtin: null,
        batch_no: null,
        exp: null,
        company_prefix: null,
        serial: null,
        epc_type: null,
        input_type: "sscc",
      };
      return initial;
    },
    handleChangeEpc() {
      this.required = this.initial_required();
      this.role = this.initial_role();
      if (this.result.epc_type == "sgtin") {
        this.title = "GTIN (14 digits)";
        this.role.disabled_serial = false;
      } else if (this.result.epc_type == "sscc") {
        this.role.disabled_serial = true;
        this.title = "SSCC (18 digits)";
      } else {
        this.title = "*";
      }
    },
    validateCharSet: function ({ event, name, max, type }) {
      let data = this.result[name];
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      if (data && data.toString().length > max - 1) {
        event.preventDefault();
      } else if (!type || type == "number") {
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          event.preventDefault();
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    validateEpcNumber({ type }) {
      let limit = this.role.length_gtin;
      let value = this.result.gtin;
      if (type == "gtin" && !this.result.serial) {
        this.required.serial.valid = false;
        this.is_error = true;
      } else if (type == "sscc") {
        limit = this.role.length_sscc;
        value = this.result.sscc;
      }
      if (value) {
        if (value.length != limit) {
          this.required[`${type}`].valid = false;
          this.is_error = true;
          return false;
        }
        var barcode = value.substring(0, value.length - 1);
        var checksum = parseInt(value.substring(value.length - 1), 10);
        var calcSum = 0;
        var calcChecksum = 0;
        barcode.split("").map(function (number, index) {
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
          this.required[`${type}`].valid = false;
          this.is_error = true;
          return false;
        }
        this.required[`${type}`].valid = true;
        return true;
      } else {
        this.required[`${type}`].valid = false;
        this.is_error = true;
        return false;
      }
    },

    validateNonSsccNumber() {
      let max_digit = 17;
      let com_pref = this.result.company_prefix ?? 0;
      let serial = this.result.serial ?? 0;
      let len_com_pref = com_pref.toString().length;
      let len_serial = serial.toString().length;
      if (len_serial + len_com_pref !== max_digit) {
        this.required.serial.message = `SN length must be ${
          max_digit - len_com_pref
        } digits`;
        this.required.serial.valid = false;
        this.is_error = true;
      }
      if (!com_pref || len_com_pref < 6) {
        this.required.company_prefix.message =
          "Company Prefix length must be greater than 6";
        this.required.company_prefix.valid = false;
        this.is_error = true;
      }
      this.role.length_serial = max_digit - len_com_pref;
      if (!serial) {
        this.valid.serial = false;
        this.is_error = true;
      }
    },

    handleValidation() {
      this.required = this.initial_required();
      this.is_error = false;
      if (this.result.epc_type == "sscc") {
        if (this.result.input_type == "sscc") {
          this.result.gtin = "";
          this.validateEpcNumber({ type: "sscc" });
        } else {
          this.result.gtin = "";
          this.validateNonSsccNumber();
        }
      } else if (this.result.epc_type == "sgtin") {
        this.result.sscc = "";
        this.validateEpcNumber({ type: "gtin" });
        if (!this.result.serial) {
          this.valid.serial = false;
          this.is_error = true;
        }
      }
      if (this.initial_load) {
        return true;
      }
      if (!this.result.batch_no) {
        this.required.batch_no.valid = false;
        this.is_error = true;
      }
      if (!this.result.exp || this.result.exp === "Invalid date") {
        this.required.exp.valid = false;
        this.is_error = true;
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
      this.$emit("handleClickGenerate", this.result);
      return;
    },
    handleReset() {
      this.initial_load = true;
      this.role = this.initial_role();
      this.result = this.initial_result();
      this.valid = this.initial_valid();
      this.$emit("handleReset", this.result);
    },
    generateBarcode() {
      let obj_result = JSON.parse(JSON.stringify(this.result));
      obj_result.exp = this.formatDate(obj_result.exp);

      if (obj_result.input_type === "non_sscc") {
        let prefix = obj_result.serial.substring(0, 1);
        let non_prefix = obj_result.serial.substring(1);
        let comp_prefix = obj_result.company_prefix;
        obj_result.sscc = `${prefix}${comp_prefix}${non_prefix}`;
        obj_result.sscc = `${obj_result.sscc}${checkDigit(obj_result.sscc)}`;
        delete obj_result.serial;
        delete obj_result.company_prefix;
      }
      if (obj_result.exp === "Invalid date") {
        this.invalidBarcode();
        this.barcode_property.data.barcode_hr = "Invalid Barcode";
        return;
      }
      this.barcode_property.data.barcode = parsingDataToBarcode({
        data_object: obj_result,
      });
      if (!this.barcode_property.data.barcode) {
        this.invalidBarcode();
        this.barcode_property.data.barcode_hr = "Invalid Barcode";
        return;
      }
      this.barcode_property.data.barcode_hr =
        this.renderEpcHr(this.barcode_property.data.barcode) ?? " ";
      bwipjs.toCanvas("canvasBarcode", {
        bcid: `gs1datamatrix`, // Barcode type
        text: this.barcode_property.data.barcode, // Text to encode
        scaleX: 3, // 3x scaling factor
        scaleY: 3, // 3x scaling factor
        // height: 3, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center", // Always good to set this
      });
      return;
    },
    invalidBarcode() {
      let cvn = this.$refs.canvasBarcode;
      let ctx = cvn.getContext("2d");
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
      item = item.replace(/\(/g, " (");
      item = item.trim();
      return item;
    },
    formatDate(date) {
      return moment(date).format("DD-MMM-YYYY");
    },
  },
};
</script>

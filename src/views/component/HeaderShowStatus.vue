<template>
  <div>
    <CRow style="margin-bottom: -10px">
      <CCol md="4">
        <CSelect
          label="EPC type"
          :options="listEpcType"
          :value.sync="result.epc_type"
          @update:value="handleChangeEpc()"
          placeholder="--Select--"
          :is-valid="valid.epc_type"
        />
      </CCol>
      <CCol md="4">
        <CInput v-if="!result.epc_type" label="*" :disabled="true" />
        <CInput
          v-if="result.epc_type == 'sscc'"
          :label="title"
          v-model="result.sscc"
          @keyup="validateEpcNumber({ type: 'sscc' })"
          @keypress="
            validateCharSet({
              event: $event,
              max: role.length_sscc,
              name: 'sscc',
              type: 'number',
            })
          "
          :is-valid="valid.sscc"
          invalid-feedback="SSCC number is not valid"
        />
        <CInput
          v-if="result.epc_type == 'sgtin'"
          :label="title"
          v-model="result.gtin"
          @keyup="validateEpcNumber({ type: 'gtin' })"
          @keypress="
            validateCharSet({
              event: $event,
              max: role.length_gtin,
              name: 'gtin',
              type: 'number',
            })
          "
          :is-valid="valid.gtin"
          invalid-feedback="GTIN number is not valid"
        />
      </CCol>
      <CCol md="4">
        <CInput
          v-if="role.disabled_serial == false"
          label="SN"
          v-on:keyup="handleInput()"
          v-model="result.serial"
          @keypress="
            validateCharSet({
              event: $event,
              max: role.length_serial,
              name: 'serial',
              type: 'alphanumeric',
            })
          "
          :is-valid="valid.serial"
        />
      </CCol>
    </CRow>
    <CRow>
      <CCol md="12" class="float-right">
        <br />
        <div class="float-right">
          <CButton size="sm" v-on:click="handleClickSearch()" color="primary">
            <v-icon name="search" /> Search
          </CButton>
          &nbsp;
          <CButton size="sm" v-on:click="handleReset()" color="secondary">
            <v-icon name="broom" /> Reset
          </CButton>
        </div>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { parsingBarcode } from '../../utils';
// import $axios from "../../api";

export default {
  name: 'HeaderShowStatus',
  props: ['filter', 'status_code', 'costume_filter'],
  mounted() {
    if (this.costume_filter && this.costume_filter.constructor === Array) {
      for (const it of this.costume_filter) {
        if (it.data && it.data.constructor === Array) {
          this.listFilter.push(it);
        }
      }
    }
    if (!this.title) {
      this.title = 'Report';
    }
  },
  data() {
    return {
      is_error: false,
      valid: this.initial_valid(),
      role: this.initial_role(),
      title: '*',
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
      };
      return initial;
    },
    initial_role() {
      let initial = {
        disabled_serial: true,
        length_serial: 20,
        length_sscc: 18,
        length_gtin: 14,
      };
      return initial;
    },
    initial_result() {
      let initial = {
        batch_no: null,
        exp: null,
        serial: null,
        epc_type: null,
        sscc: null,
        gtin: null,
      };
      return initial;
    },
    handleChangeEpc() {
      this.valid = this.initial_valid();
      if (this.result.epc_type == 'sgtin') {
        this.title = 'GTIN (14 digits)';
        this.role.disabled_serial = false;
      } else if (this.result.epc_type == 'sscc') {
        this.role.disabled_serial = true;
        this.title = 'SSCC (18 digits)';
      } else {
        this.title = '*';
      }
    },
    handleInput() {},
    validateCharSet: function ({ event, name, max, type }) {
      let data = this.result[name];
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      if (data && data.toString().length > max - 1) {
        event.preventDefault();
      } else if (!type || type == 'number') {
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
      if (type == 'sscc') {
        limit = this.role.length_sscc;
        value = this.result.sscc;
      }
      if (value) {
        if (value.length != limit) {
          this.valid[`${type}`] = false;
          this.is_error = true;
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
          this.valid[`${type}`] = false;
          this.is_error = true;
          return false;
        }
        this.valid[`${type}`] = true;
        return true;
      } else {
        this.valid[`${type}`] = false;
        this.is_error = true;
        return false;
      }
    },
    handleClickSearch() {
      this.valid = this.initial_valid();
      this.is_error = false;
      if (!this.result.epc_type) {
        this.valid.epc_type = false;
        this.is_error = true;
      } else {
        if (this.result.epc_type == 'sscc') {
          this.validateEpcNumber({ type: 'sscc' });
        } else if (this.result.epc_type == 'sgtin') {
          this.validateEpcNumber({ type: 'gtin' });
          if (!this.result.serial) {
            this.valid.serial = false;
            this.is_error = true;
          }
        }
      }
      if (this.is_error) {
        return;
      }
      let barcode_2d = '';

      if (this.result.epc_type == 'sgtin') {
        barcode_2d = `01${this.result.gtin}u001d21${this.result.serial}`;
      } else {
        barcode_2d = `00${this.result.sscc}`;
      }
      let parse = parsingBarcode(barcode_2d);
      delete parse.barcode_2d;
      this.$emit('handleClickSearch', parse);
      return;
    },
    handleReset() {
      this.role = this.initial_role();
      this.result = this.initial_result();
      this.valid = this.initial_valid();
      this.$emit('handleReset', this.result);
    },
  },
};
</script>

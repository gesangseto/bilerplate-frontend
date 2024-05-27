<template>
  <div>
    <CRow>
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
          v-if="result.epc_type"
          :label="title"
          v-model="result.epc_key"
          @keypress="validateCharSet({ event: $event })"
          :is-valid="valid.epc_key"
          invalid-feedback="EPC Key is not valid"
        />
      </CCol>
      <CCol md="4">
        <CInput
          v-if="result.epc_type && result.epc_type !== 'sscc'"
          label="SN"
          v-model="result.serial"
          @keypress="validateCharSet({ event: $event, type: 'serial' })"
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
import { isValidEpcKey } from '../../utils';

export default {
  name: 'HeaderShowStatusV3',
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
        {
          value: 'nie',
          label: 'NIE',
        },
      ],
    };
  },
  watch: {
    result: {
      deep: true,
      handler() {
        this.handleValidation();
      },
    },
  },
  methods: {
    initial_valid() {
      let initial = {
        epc_type: null,
        epc_key: null,
        serial: null,
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
        epc_key: null,
        serial: null,
        epc_type: null,
      };
      return initial;
    },
    handleChangeEpc() {
      this.valid = this.initial_valid();
      if (this.result.epc_type == 'sgtin') {
        this.title = 'GTIN (14 digits)';
        this.role.disabled_serial = false;
      } else if (this.result.epc_type == 'nie') {
        this.title = 'NIE (Max 15 character)';
        this.role.disabled_serial = false;
      } else if (this.result.epc_type == 'sscc') {
        this.role.disabled_serial = true;
        this.title = 'SSCC (18 digits)';
      } else {
        this.title = '*';
      }
    },
    handleValidation() {
      this.is_error = false;
      this.valid.epc_key = true;
      this.valid.serial = true;
      if (!this.result.epc_key) {
        this.is_error = true;
        this.valid.epc_key = false;
      } else if (this.result.epc_type == 'sscc') {
        if (
          !isValidEpcKey(this.result.epc_key) ||
          this.result.epc_key.length != 18
        ) {
          this.is_error = true;
          this.valid.epc_key = false;
        }
      } else if (this.result.epc_type == 'sgtin') {
        if (
          !isValidEpcKey(this.result.epc_key) ||
          this.result.epc_key.length != 14
        ) {
          this.is_error = true;
          this.valid.epc_key = false;
        }
      } else if (this.result.epc_type == 'nie') {
        if (
          !isValidEpcKey(this.result.epc_key) ||
          this.result.epc_key.length > 15
        ) {
          this.is_error = true;
          this.valid.epc_key = false;
        }
      }
      if (this.result.epc_type != 'sscc' && !this.result.serial) {
        this.is_error = true;
        this.valid.serial = false;
      }
      if (!this.result.epc_type) {
        this.is_error = true;
      }
      if (this.is_error) {
        return false;
      }
      return true;
    },

    validateCharSet: function ({ event, type }) {
      let data = this.result.epc_key;
      let epc_type = this.result.epc_type;
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      if (type && type == 'serial') {
        if (data && data.length === 21) event.preventDefault();
      } else {
        if (epc_type === 'sscc') {
          if (charCode > 31 && (charCode < 48 || charCode > 57))
            event.preventDefault();
          if (data && data.length === 18) event.preventDefault();
        } else if (epc_type === 'sgtin') {
          if (charCode > 31 && (charCode < 48 || charCode > 57))
            event.preventDefault();
          if (data && data.length === 14) event.preventDefault();
        } else if (epc_type === 'nie') {
          if (data && data.length === 15) event.preventDefault();
        }
      }
      return true;
    },
    handleClickSearch() {
      this.valid = this.initial_valid();
      this.is_error = false;
      if (!this.handleValidation()) {
        return;
      }
      this.$emit('handleClickSearch', this.result);
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

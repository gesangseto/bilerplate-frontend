<template>
  <div>
    <CCard v-for="level in product.current_pack" :key="level">
      <CCardHeader class="mb-10">
        <CRow>
          <CCol md="6">
            <CSelect
              :disabled="!product.flag_upd_del"
              size="sm"
              horizontal
              placeholder="-Select-"
              :options="list_packaging"
              :value.sync="product[`packagingl${level}_id`]"
              :is-valid="product[`packagingl${level}_id`] ? true : false"
              :label="`Packaging Level ${level} *`"
            >
            </CSelect>
          </CCol>
          <CCol md="4">
            <CInput
              v-if="level > 1"
              :disabled="!product.flag_upd_del"
              horizontal
              size="sm"
              label="Full L1 Qty *"
              v-model="product[`qty_packagingl${level}`]"
              @keypress="
                validateNumber({
                  data: product[`qty_packagingl${level}`],
                  event: $event,
                })
              "
              :is-valid="
                !product[`qty_packagingl${level}`]
                  ? false
                  : level > 2 &&
                    product[`qty_packagingl${level}`] %
                      product[`qty_packagingl${level - 1}`] !==
                      0
                  ? false
                  : true
              "
              :description="
                !product[`qty_packagingl${level}`]
                  ? 'Quantity is required'
                  : level > 2 &&
                    product[`qty_packagingl${level}`] %
                      product[`qty_packagingl${level - 1}`] !==
                      0
                  ? `Quantity must be a multiple ${
                      product[`qty_packagingl${level - 1}`]
                    }`
                  : ''
              "
            >
            </CInput>
          </CCol>
          <CCol md="2">
            <CButton
              class="float-right ml-5"
              v-on:click="expand[`lvl_${level}`] = !expand[`lvl_${level}`]"
            >
              <v-icon v-if="!expand[`lvl_${level}`]" name="angle-right" />
              <v-icon
                v-if="expand[`lvl_${level}`]"
                name="angle-down"
              /> </CButton
          ></CCol>
        </CRow>
      </CCardHeader>
      <CCardBody v-if="expand[`lvl_${level}`]">
        <CRow>
          <CCol md="12">
            <table>
              <thead>
                <tr style="font-size: 3mm; font-weight: bold">
                  <td style="width: 5%"></td>
                  <td style="width: 10%">Type</td>
                  <td style="width: 13%">ID1</td>
                  <td style="width: 11%">ID2</td>
                  <td style="width: 7%">ID3</td>
                  <td style="width: 7%">SN Prefix (static)</td>
                  <td style="width: 5%">SN Length (dynamic)</td>
                  <td style="width: 12%">Generate Type</td>
                  <td style="width: 12%">Charset</td>
                  <td style="width: 20%">Layout</td>
                </tr>
              </thead>
              <tbody v-for="index in product.mst_pid.length" :key="index">
                <tr v-if="product.mst_pid[index - 1].packaging_level == level">
                  <td>
                    <label>
                      {{
                        product.mst_pid[index - 1].flag_full
                          ? 'Full'
                          : 'Partial'
                      }}
                    </label>
                  </td>
                  <td>
                    <CSelect
                      :disabled="!product.flag_upd_del"
                      size="sm"
                      placeholder="-Select-"
                      :options="
                        level === 1
                          ? list_epc_type.filter((it) => it.value != 'sscc')
                          : !product.mst_pid[index - 1].flag_full
                          ? list_epc_type.filter((it) => it.value != 'sgtin')
                          : list_epc_type
                      "
                      :value.sync="product.mst_pid[index - 1].epc_type"
                      :is-valid="
                        product.mst_pid[index - 1].epc_type ? true : false
                      "
                    />
                  </td>
                  <td>
                    <CInput
                      size="sm"
                      :readonly="
                        product.mst_pid[index - 1].epc_type === 'nie' ||
                        !product.flag_upd_del
                      "
                      v-model="product.mst_pid[index - 1].id1"
                      :is-valid="product.mst_pid[index - 1].id1 ? true : false"
                      @keypress="
                        validateNumber({
                          data: product.mst_pid[index - 1].id1,
                          event: $event,
                          max: 1,
                        })
                      "
                    />
                  </td>
                  <td>
                    <CInput
                      size="sm"
                      :readonly="true"
                      v-model="product.mst_pid[index - 1].id2"
                      :is-valid="
                        product.mst_pid[index - 1].epc_type === 'nie'
                          ? true
                          : product.mst_pid[index - 1].id2
                          ? true
                          : false
                      "
                    />
                  </td>
                  <td>
                    <CInput
                      size="sm"
                      :readonly="true"
                      v-model="product.mst_pid[index - 1].id3"
                      :is-valid="
                        product.mst_pid[index - 1].epc_type === 'nie' ||
                        product.mst_pid[index - 1].epc_type === 'sscc'
                          ? true
                          : product.mst_pid[index - 1].id3
                          ? true
                          : false
                      "
                    />
                  </td>
                  <td>
                    <CInput
                      size="sm"
                      :readonly="!product.flag_upd_del"
                      v-model="product.mst_pid[index - 1].sn_prefix"
                      :is-valid="
                        product.mst_pid[index - 1].sn_prefix &&
                        product.mst_pid[index - 1].sn_charset === 'numeric' &&
                        !isNum(product.mst_pid[index - 1].sn_prefix)
                          ? false
                          : true
                      "
                      @keypress="
                        validateCharSet({
                          event: $event,
                          num: index - 1,
                          max: 3,
                          name: 'sn_prefix',
                          type:
                            product.mst_pid[index - 1].sn_charset ==
                            'alphanumeric'
                              ? 'string'
                              : 'number',
                        })
                      "
                    />
                  </td>
                  <td>
                    <CInput
                      size="sm"
                      :readonly="
                        product.mst_pid[index - 1].epc_type === 'sscc' ||
                        !product.flag_upd_del
                      "
                      v-model="product.mst_pid[index - 1].generated_sn_len"
                      :is-valid="
                        product.mst_pid[index - 1].generated_sn_len
                          ? true
                          : false
                      "
                      @keypress="
                        validateNumber({
                          data: product.mst_pid[index - 1].generated_sn_len,
                          event: $event,
                          max: 2,
                        })
                      "
                    />
                  </td>
                  <td>
                    <CSelect
                      size="sm"
                      :disabled="!product.flag_upd_del"
                      placeholder="-Select-"
                      :options="list_generate_type"
                      :value.sync="product.mst_pid[index - 1].sn_generate_type"
                      :is-valid="
                        product.mst_pid[index - 1].sn_generate_type
                          ? true
                          : false
                      "
                    />
                  </td>
                  <td>
                    <CSelect
                      size="sm"
                      :disabled="
                        product.mst_pid[index - 1].epc_type === 'sscc' ||
                        !product.flag_upd_del
                      "
                      placeholder="-Select-"
                      :options="list_charset"
                      :value.sync="product.mst_pid[index - 1].sn_charset"
                      :is-valid="
                        product.mst_pid[index - 1].sn_charset ? true : false
                      "
                    />
                  </td>
                  <td>
                    <CSelect
                      size="sm"
                      :disabled="
                        !product.flag_upd_del &&
                        product.mst_pid[index - 1].conf_layout_id
                      "
                      placeholder="-Select-"
                      :options="
                        !product.mst_pid[index - 1].epc_type
                          ? []
                          : list_layout[
                              product.mst_pid[index - 1].epc_type
                            ].filter((it) => it.packaging_level == level)
                      "
                      :value.sync="product.mst_pid[index - 1].conf_layout_id"
                      :is-valid="
                        product.mst_pid[index - 1].conf_layout_id ? true : false
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <Button
      v-if="action != 'Read'"
      :disabled="product.mst_pid.length == 7 || !product.flag_upd_del"
      :buttonProperty="{
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'plus',
        text: 'Add Packaging',
        tooltip: '',
      }"
      @click="addPackaging()"
    />
    <Button
      v-if="action != 'Read'"
      :disabled="product.mst_pid.length == 1 || !product.flag_upd_del"
      :buttonProperty="{
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'trash',
        text: 'Remove Packaging',
        tooltip: '',
      }"
      @click="removePackaging()"
    />
  </div>
</template>

<script>
import { getConfLayout } from '../../resource/ConfLayout';
import { getMstPackaging } from '../../resource/MstPackaging';
export default {
  name: 'MasterPid',
  props: {
    item: Object,
    product: Object,
    packaging_level: String,
    action: String,
  },
  beforeMount() {
    if (this.product.mst_pid.length === 0) {
      this.product.mst_pid.push({
        ...this.initial_pid,
        id1: '',
        id2: '',
        id3: '',
        packaging_level: 1,
        flag_full: 1,
      });
    }
  },
  watch: {
    'product.mst_pid': {
      handler() {
        this.product.current_pack = Math.max(
          ...this.product.mst_pid.map((o) => o.packaging_level)
        );
        for (var i = 0; i < this.product.mst_pid.length; i++) {
          let thisData = this.product.mst_pid[i];
          if (thisData.epc_type === 'nie') {
            this.syncNIE(i);
          } else if (thisData.epc_type === 'sgtin') {
            this.syncSGTIN(i);
          } else if (thisData.epc_type === 'sscc') {
            this.syncSSCC(i);
          } else {
            this.product.mst_pid[i].error = true;
          }
        }
      },
      deep: true,
    },
    'product.nie': {
      handler(data) {
        for (var i = 0; i < this.product.mst_pid.length; i++) {
          let thisData = this.product.mst_pid[i];
          if (thisData.epc_type === 'nie') {
            this.product.mst_pid[i].id1 = data;
          }
        }
      },
      deep: true,
    },
    'product.company_prefix': {
      handler(data) {
        for (var i = 0; i < this.product.mst_pid.length; i++) {
          let thisData = this.product.mst_pid[i];
          if (thisData.epc_type === 'sscc' || thisData.epc_type === 'sgtin') {
            this.product.mst_pid[i].id2 = data;
          }
        }
      },
      deep: true,
    },
    'product.item_reference': {
      handler(data) {
        for (var i = 0; i < this.product.mst_pid.length; i++) {
          let thisData = this.product.mst_pid[i];
          if (thisData.epc_type === 'sgtin') {
            this.product.mst_pid[i].id3 = data;
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.loadPackaging();
    this.loadEpcType();
    this.loadLayout();
  },
  data() {
    return {
      expand: { lvl_1: false, lvl_2: false, lvl_3: false, lvl_4: false },
      backup_list_layout: [],
      list_layout: {
        nie: [],
        sgtin: [],
        sscc: [],
      },

      list_epc_type: [],
      list_packaging: [],
      list_generate_type: [
        { value: 'random', label: 'Random' },
        { value: 'sequential', label: 'Sequential' },
      ],
      list_charset: [
        { value: 'alphanumeric', label: 'Alphanumeric' },
        { value: 'numeric', label: 'Numeric' },
      ],
      total_packaging: 1,
    };
  },
  computed: {},
  methods: {
    addPackaging() {
      this.product.current_pack = Math.max(
        ...this.product.mst_pid.map((o) => o.packaging_level)
      );
      if (this.product.current_pack == 4) {
        return;
      } else {
        this.product.current_pack += 1;
        this.product.mst_pid.push({
          ...this.initial_pid,
          id1: '',
          id2: '',
          id3: '',
          packaging_level: this.product.current_pack,
          flag_full: 1,
        });
        this.product.mst_pid.push({
          ...this.initial_pid,
          id1: '',
          id2: '',
          id3: '',
          packaging_level: this.product.current_pack,
          flag_full: 0,
        });
      }
    },
    removePackaging() {
      this.product.current_pack = Math.max(
        ...this.product.mst_pid.map((o) => o.packaging_level)
      );
      if (this.product.current_pack == 1) {
        return;
      } else {
        let filteredPid = this.product.mst_pid.filter(
          (it) => it.packaging_level != this.product.current_pack
        );
        this.product.mst_pid = filteredPid;
        this.product.current_pack -= 1;
      }
    },
    syncNIE(index) {
      // Menentukan Layout yang memiliki AI 90-21
      // this.list_layout = this.backup_list_layout.filter((it) =>
      //   this.checkBpomBarcodeFormat(it.bpom_barcode_format, ['90', '21'])
      // );

      this.product.mst_pid[index].error = false;
      this.product.mst_pid[index].id1 = this.product.nie;
      this.product.mst_pid[index].id2 = '';
      this.product.mst_pid[index].id3 = '';

      // Menentukan panjang SN Length NIE
      let sn_prefix = this.product.mst_pid[index].sn_prefix;
      let generated_sn_len = this.product.mst_pid[index].generated_sn_len;
      let maxSerial = 21;
      let currentSerial = 0;
      if (sn_prefix && generated_sn_len) {
        currentSerial =
          parseInt(generated_sn_len) + sn_prefix.toString().length;
      }
      if (currentSerial > maxSerial) {
        this.product.mst_pid[index].generated_sn_len =
          maxSerial - sn_prefix.toString().length;
      }
      // Check jika ada form kosong atau tidak sesuai dengan ketentuan
      if (!this.product.mst_pid[index].id1) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].generated_sn_len) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].sn_generate_type) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].sn_charset) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].conf_layout_id) {
        this.product.mst_pid[index].error = true;
      }
      // Check charset type dengan SN Prefix
      this.checkCharset(index);
    },

    syncSGTIN(index) {
      // Menentukan Layout yang memiliki AI 90-21
      // this.list_layout = this.backup_list_layout.filter((it) =>
      //   this.checkBpomBarcodeFormat(it.bpom_barcode_format, ['01', '21'])
      // );

      this.product.mst_pid[index].error = false;
      if (!this.isNum(this.product.mst_pid[index].id1)) {
        this.product.mst_pid[index].id1 = '';
      } else if (this.product.mst_pid[index].id1.toString().length > 1) {
        this.product.mst_pid[index].id1 = this.product.mst_pid[index].id1[0];
      }
      this.product.mst_pid[index].id2 = this.product.company_prefix;
      this.product.mst_pid[index].id3 = this.product.item_reference;

      // Menentukan panjang SN Length SGTIN
      let sn_prefix = this.product.mst_pid[index].sn_prefix;
      let generated_sn_len = this.product.mst_pid[index].generated_sn_len;
      let maxSerial = 21;
      let currentSerial = 0;
      if (sn_prefix && generated_sn_len) {
        currentSerial =
          parseInt(generated_sn_len) + sn_prefix.toString().length;
      }
      if (currentSerial > maxSerial) {
        this.product.mst_pid[index].generated_sn_len =
          maxSerial - sn_prefix.toString().length;
      }
      // Check jika ada form kosong atau tidak sesuai dengan ketentuan
      if (!this.product.mst_pid[index].id1) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].id2) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].id3) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].generated_sn_len) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].sn_generate_type) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].sn_charset) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].conf_layout_id) {
        this.product.mst_pid[index].error = true;
      }
      this.checkCharset(index);
    },
    syncSSCC(index) {
      // Menentukan Layout yang memiliki AI 90-21
      // this.list_layout = this.backup_list_layout.filter((it) =>
      //   this.checkBpomBarcodeFormat(it.bpom_barcode_format, ['00'])
      // );

      this.product.mst_pid[index].error = false;
      if (!this.isNum(this.product.mst_pid[index].id1)) {
        this.product.mst_pid[index].id1 = '';
      } else if (this.product.mst_pid[index].id1.toString().length > 1) {
        this.product.mst_pid[index].id1 = this.product.mst_pid[index].id1[0];
      }
      this.product.mst_pid[index].id2 = this.product.company_prefix;
      this.product.mst_pid[index].id3 = '';
      // Menentukan panjang SN Length SSCC

      let id1 = this.product.mst_pid[index].id1;
      let id2 = this.product.mst_pid[index].id2;
      let sn_prefix = this.product.mst_pid[index].sn_prefix;
      let currentSerial = 0;
      if (id1) {
        currentSerial += id1.toString().length;
      }
      if (id2) {
        currentSerial += id2.toString().length;
      }
      if (sn_prefix) {
        currentSerial += sn_prefix.toString().length;
      }
      this.product.mst_pid[index].generated_sn_len = 17 - currentSerial;
      // Menentukan Charset Type SSCC
      this.product.mst_pid[index].sn_charset = 'numeric';

      // Check jika ada form kosong atau tidak sesuai dengan ketentuan
      if (!this.product.mst_pid[index].id1) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].id2) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].generated_sn_len) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].sn_generate_type) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].sn_charset) {
        this.product.mst_pid[index].error = true;
      } else if (!this.product.mst_pid[index].conf_layout_id) {
        this.product.mst_pid[index].error = true;
      }
      this.checkCharset(index);
    },
    checkCharset(index) {
      // Check charset type dengan SN Prefix
      if (
        this.product.mst_pid[index].sn_prefix &&
        this.product.mst_pid[index].sn_charset === 'numeric'
      ) {
        if (!this.isNum(this.product.mst_pid[index].sn_prefix)) {
          this.product.mst_pid[index].error = true;
        }
      }
    },
    checkBpomBarcodeFormat(inputString, targetArray) {
      // Memisahkan string menjadi array berdasarkan tanda hubung (-)
      const elements = inputString.split('-');
      // Memeriksa apakah semua elemen dalam targetArray ada dalam elements
      return targetArray.every((item) => elements.includes(item.toString()));
    },

    loadEpcType() {
      try {
        let data = [];
        for (const it of process.env.VUE_APP_EPC_TYPE.split(',')) {
          data.push({
            value: it,
            label: it.toLocaleUpperCase(),
          });
        }
        this.list_epc_type = data;
      } catch (e) {
        console.log('ERROR => ', e);
      }
    },

    async loadLayout() {
      let _res = await getConfLayout({
        status: 'Active',
        // packaging_level: this.packaging_level,
      });
      if (_res) {
        this.backup_list_layout = [];
        for (const it of _res.data) {
          it.value = it.id;
          it.label = it.name;
          this.backup_list_layout.push(it);
        }
        this.list_layout.nie = this.backup_list_layout.filter((it) =>
          this.checkBpomBarcodeFormat(it.bpom_barcode_format, ['90', '21'])
        );
        this.list_layout.sgtin = this.backup_list_layout.filter((it) =>
          this.checkBpomBarcodeFormat(it.bpom_barcode_format, ['01', '21'])
        );
        this.list_layout.sscc = this.backup_list_layout.filter((it) =>
          this.checkBpomBarcodeFormat(it.bpom_barcode_format, ['00'])
        );
      }
    },
    async loadPackaging() {
      let _res = await getMstPackaging({ status: 'Active' });
      for (const it of _res['data']) {
        this.list_packaging.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
    },
    swapPositions(array, a, b) {
      [array[a], array[b]] = [array[b], array[a]];
    },

    validateNumber: function ({ event, data, max }) {
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      if (data && data.toString().length > max - 1) {
        event.preventDefault();
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      } else {
        return true;
      }
    },

    validateCharSet: function ({ event, num, name, max, type }) {
      let data = this.product.mst_pid[num][name];
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

    isNum(num) {
      const pattern = /^\d+$/;
      if (pattern.test(num)) return true;
      else return false;
    },

    isInt(value) {
      return (
        !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 20))
      );
    },
    initial_pid() {
      let it = {
        name: '',
        product_id: '',
        packaging_level: '',
        flag_full: '',
        flag_serial: '',
        epc_type: '',
        id1: 4,
        id2: '',
        id3: '',
        id4: null,
        sn_charset: '',
        sn_generate_type: '',
        sn_prefix: '',
        generated_sn_len: '',
        conf_layout_id: '',
        error: false,
      };
      return it;
    },
  },
};
</script>
<style>
.is-valid .custom-select-icon,
.is-invalid .custom-select-icon {
  width: 1px;
}
.tableElement {
  margin: 0px auto;
  width: 100%;
}

.tableCell {
  width: 50%;
}

.tableWrapper {
  border: 1px solid red;
  margin: 0px;
  padding: 0 0px;
}
</style>

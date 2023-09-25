<template>
  <div>
    <CModal
      centered="centered"
      size="xl"
      :show.sync="property.modal"
      title="Barcode Generator"
      color="warning"
    >
      <CRow>
        <CCol md="2">
          <div style="text-align: center">
            <canvas
              class="float-rigth"
              id="canvasBarcode"
              ref="canvasBarcode"
            ></canvas>
            <p style="font-size: 6pt">{{ barcode }}</p>
          </div>
        </CCol>
        <CCol md="5">
          <CInput
            horizontal
            v-model="item.product_detail"
            label="Product"
            readonly
          />
          <CInput
            horizontal
            v-model="item.batch_no"
            label="Batch No"
            readonly
          />
          <CInput
            horizontal
            v-model="item.exp_mfg"
            label="Exp / Mfg"
            readonly
          />
        </CCol>
        <CCol md="5">
          <CRow> <CCol md="5"> </CCol></CRow>
          <CInput
            horizontal
            v-model="item.full_serial"
            label="[GTIN / CP] SN"
            readonly
          >
            <template #append-content>
              <CButton
                style="font-size: 10pt; margin: -10pt"
                :color="barcode === item.epc_hr ? 'success' : 'info'"
                :disabled="barcode === item.epc_hr"
                @click="handleClickRow(item, -1)"
              >
                <v-icon name="qrcode" /></CButton
            ></template>
          </CInput>
          <CInput
            horizontal
            v-model="item.pkg_detail"
            label="Pkg Level"
            readonly
          />
          <CInput
            horizontal
            v-model="item.status_last"
            label="Status - Last"
            readonly
          />
        </CCol>
      </CRow>
      <hr />
      <CRow>
        <CCol :md="12 / total_child" v-for="idx in total_child" :key="idx">
          <p style="margin-left: 5px">
            Level {{ total_child + 1 - idx }}
            <CBadge
              color="primary"
              shape="pill"
              class="float-right"
              style="margin-right: 50px"
            >
              {{
                list_data[`level_${total_child + 1 - idx}`].length === 1
                  ? list_data[`level_${total_child + 1 - idx}`][0].quantity
                  : list_data[`level_${total_child + 1 - idx}`].length
              }}
            </CBadge>
          </p>

          <div class="table-scroll">
            <CDataTable
              hover
              sorter
              striped
              tableFilter
              border
              :items="reformatData(list_data[`level_${total_child + 1 - idx}`])"
              :fields="fields"
              class="text-left"
              style="font-size: 12px; cursor: pointer"
            >
              <template #action="{ item, index }">
                <td class="text-danger">
                  <CButton
                    type="button"
                    size="sm"
                    class="float-left"
                    style="font-size: 1px; margin: -8px"
                    :color="barcode === item.epc_hr ? 'success' : 'info'"
                    :disabled="barcode === item.epc_hr"
                    @click="handleClickRow(item, index)"
                  >
                    <v-icon style="margin-bottom: -1px" name="qrcode" />
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </div>
        </CCol>
      </CRow>
      <template #footer>
        <v-icon v-if="is_loading" name="sync" spin />
        <CButton @click="handleClose()" color="danger">
          <CIcon name="cil-ban" /> Close</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<style>
.table-scroll {
  height: 40vh;
  overflow-y: scroll;
  overflow-x: scroll;
}
.table-scroll tr {
  line-height: 1px;
  padding: -10px;
}
</style>
<script>
import bwipjs from 'bwip-js';
import $axiosMertrack from '../../apiMertrack';
import invalid_barcode from '../../assets/invalid_barcode.png';
export default {
  components: {},
  name: 'DetailBarcodeGenerator',
  props: { property: Object },
  watch: {
    property: {
      deep: true,
      handler() {
        if (this.property.modal) {
          this.list_data = this.resetList();
          this.item = JSON.parse(JSON.stringify(this.property.item));
          this.item.product_detail = `(${this.item['product_no']}) ${this.item['product_name']}`;
          this.item.exp_mfg = `${this.item['expired_date']} / ${this.item['mfg_date']}`;
          this.item.full_serial = `[${this.item['gtin_cp']}] ${this.item['serial']}`;
          this.item.pkg_detail = `(${this.item['packaging_level']}) ${this.item['packaging_name']}`;
          let last_location = !this.item['warehouse_name']
            ? this.item['customer_name']
            : this.item['warehouse_name'];
          this.item.status_last = `${this.item['status_desc']} - ${last_location}`;
          this.getDetailItem(this.property.item, true);
          this.barcode = this.item.epc_hr;
        }
      },
    },
    barcode: {
      deep: true,
      handler() {
        this.generateBarcode();
      },
    },
  },
  mounted() {},
  data() {
    return {
      is_loading: false,
      item: {},
      total_child: 0,
      list_data: this.resetList(),
      selected_item: {},
      barcode: null,
      barcode_hr: null,
      fields: [
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'Serial',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
        {
          key: 'action',
          label: 'View',
        },
      ],
    };
  },
  methods: {
    resetList() {
      let data = {
        level_1: [],
        level_2: [],
        level_3: [],
        level_4: [],
        level_5: [],
      };
      return data;
    },
    handleClose() {
      this.property.modal = false;
      this.list_data = this.resetList();
      this.total_child = 0;
    },
    getDetailItem(item, initial_load = false) {
      this.is_loading = true;
      if (initial_load) {
        this.total_child = item.packaging_level - 1;
      }
      let id = item.stock_serial_id ?? item.id ?? 0;
      let param = JSON.parse(JSON.stringify(item));
      param.packaging_level = item.packaging_level - 1;
      param.from_stock = 1;
      let url = `/v3/transaction/stock?show_barcode=true&parent=${id}`;
      $axiosMertrack.get(url).then((result) => {
        this.is_loading = false;
        let data = result.data.data;
        this.list_data[`level_${param.packaging_level}`] = data;
      });
    },
    reformatData(item_array = Array) {
      return item_array.map((item) => {
        return {
          ...item,
        };
      });
    },
    handleClickRow(item) {
      this.barcode = item.epc_hr;
      this.getDetailItem(item);
    },
    generateBarcode() {
      if (!this.barcode) {
        this.invalidBarcode();
        this.barcode_hr = ' ';
        return;
      }
      let barcode = this.barcode.replaceAll(' ', '') || ' ';
      bwipjs.toCanvas('canvasBarcode', {
        bcid: `gs1datamatrix`, // Barcode type
        text: barcode, // Text to encode
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
  },
};
</script>

<template>
  <div>
    <CModal
      centered="centered"
      size="sm"
      :show.sync="showModal"
      title="Barcode Generator"
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
            <p style="font-size: 6pt">{{ barcode_hr }}</p>
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
import invalid_barcode from '../../assets/invalid_barcode.png';
export default {
  name: 'ModalBarcodeGenerator',
  props: { property: Object },
  watch: {
    property: {
      deep: true,
      handler(n) {
        if (Object.keys(n).length > 0) {
          if (n.epc_hr) {
            this.showModal = true;
            // // let barcode = `(${n.trx_pack_epc_type == 'sscc' ? '00' : '01'})`;
            // // barcode += `${n.trx_pack_epc_key}`;
            // // if (n.trx_pack_epc_type == 'sgtin')
            // //   barcode += `(21)${n.trx_pack_serial}`;
            // // this.generateBarcode(barcode);
            // let barcode = `(${
            //   n.trx_pack_epc_type == 'sscc'
            //     ? '00'
            //     : n.epc_type == 'nie'
            //     ? '90'
            //     : '01'
            // })`;
            // barcode += `${n.trx_pack_epc_key}`;
            // if (n.trx_pack_epc_type == 'sgtin' || n.trx_pack_epc_type == 'nie')
            //   barcode += `(21)${n.trx_pack_serial}`;
            this.generateBarcode(n.epc_hr.replaceAll(' ', ''));
          } else {
            this.showModal = true;
            let barcode = `(${
              n.epc_type == 'sscc' ? '00' : n.epc_type == 'nie' ? '90' : '01'
            })`;
            barcode += `${n.epc_key}`;
            if (n.epc_type == 'sgtin' || n.epc_type == 'nie')
              barcode += `(21)${n.serial}`;
            this.generateBarcode(barcode);
          }
        }
      },
    },
  },
  mounted() {},
  data() {
    return {
      is_loading: false,
      barcode_hr: null,
      showModal: false,
    };
  },
  methods: {
    handleClose() {
      this.showModal = false;
    },
    generateBarcode(barcode) {
      if (!barcode) {
        this.invalidBarcode();
        return;
      }
      let parse = barcode;
      this.barcode_hr = this.renderEpcHr(parse) ?? ' ';
      console.log(parse);
      bwipjs.toCanvas('canvasBarcode', {
        bcid: `gs1datamatrix`, // Barcode type
        text: parse, // Text to encode
        scaleX: 4, // 3x scaling factor
        scaleY: 4, // 3x scaling factor
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

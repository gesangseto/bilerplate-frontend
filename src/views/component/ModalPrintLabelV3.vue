<template>
  <CModal title="Detail" color="warning" :show.sync="isOpenModal">
    <template #header>
      <h5 class="modal-title">Print</h5>
    </template>

    <div id="installedPrinters">
      <CSelect
        label="Select Printer (ZPL)"
        size="sm"
        horizontal
        :value.sync="selected_printer"
        :options="printers"
        placeholder="Please select"
      />
      <CInput horizontal v-model="formData.reason" label="Reson" />
      <!-- <label for="installedPrinterName">Select an installed Printer: </label>
      <select name="printer" id="printer" v-model="selected_printer">
        <option disabled n-bind:key="undefined">Select printer</option>
        <option v-for="printer in printers" v-bind:key="printer">
          {{ printer }}
        </option>
      </select> -->
    </div>
    <p>Visit : <CLink>https://www.neodynamic.com/downloads/jspm/</CLink></p>

    <template #footer>
      <CButton
        size="sm"
        color="success"
        type="button"
        @click="handleClickPrint()"
      >
        Print [{{ formData.print_count ? formData.print_count : '-' }}]
      </CButton>
      <CButton
        size="sm"
        color="danger"
        type="button"
        @click="isOpenModal = false"
      >
        <!-- <v-icon name="close" />  -->
        Close
      </CButton>
    </template>
  </CModal>
</template>

<script>
import $axiosMertrack from '../../apiMertrack';
import * as JSPM from 'jsprintmanager';
export default {
  name: 'ModalPrintLabelV3',
  props: ['item'],
  watch: {
    selected_printer(value) {
      this.$emit('change', value);
    },
    isOpenModal() {
      if (!this.isOpenModal) {
        this.printData = '';
        this.$emit('onClose');
      }
    },
    item: {
      handler(n) {
        if (Object.keys(n).length > 0) {
          this.loadData(n);
        }
      },
      deep: true,
    },
    // item() {
    //   if (Object.keys(this.item).length > 0) {
    //     this.isOpenModal = true;
    //   }
    // },
  },
  data() {
    return {
      isOpenModal: false,
      printData: '',
      print2default: false,
      printers: [],
      selected_printer: '',
      formData: {
        id: '',
        serial: '',
        epc_key: '',
        reason: '',
        update_count: true,
        print_count: 1,
        items: [],
      },
    };
  },
  mounted() {
    this.onInit();
  },
  methods: {
    onInit() {
      var _this = this;
      JSPM.JSPrintManager.auto_reconnect = true;
      JSPM.JSPrintManager.start();
      JSPM.JSPrintManager.WS.onStatusChanged = function () {
        _this.getPrinters().then((p) => {
          _this.printers = p;
          _this.$nextTick();
        });
      };
    },

    loadData(itm) {
      let _body = { items: [] };
      if (itm.items) {
        for (const it of itm.items) {
          _body.items.push(it);
        }
        $axiosMertrack.post(`/v3/helper/print-layout`, _body).then((result) => {
          let _data = result.data;
          if (_data.error) {
            return this.$toast.open({
              message: `${_data.message}`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 3000,
            });
          } else {
            this.formData.items = _data.data;
            this.formData.print_count = null;
            this.isOpenModal = true;
          }
        });
      } else if (!itm.items) {
        let serial = itm.trx_pack_serial || itm.serial;
        let epc_key = itm.trx_pack_epc_key || itm.epc_key;
        _body = {
          serial: serial,
          epc_key: epc_key,
        };
        var _url = new URLSearchParams(_body).toString();
        $axiosMertrack.get(`/v3/helper/print-layout?${_url}`).then((result) => {
          let _data = result.data;
          if (_data.error) {
            this.isOpenModal = false;
            return this.$toast.open({
              message: `${_data.message}`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 3000,
            });
          } else {
            this.formData = _data.data[0];
            this.isOpenModal = true;
          }
        });
      }
      return;
    },
    postAndPrint() {
      let _body = {
        reason: this.formData?.reason || '-',
      };
      if (this.formData?.items && this.formData?.items.length > 0) {
        _body.update_count = false;
        _body.items = this.formData?.items;
      } else {
        let serial = this.formData?.trx_pack_serial || this.formData?.serial;
        let epc_key = this.formData?.trx_pack_epc_key || this.formData?.epc_key;
        _body.update_count = true;
        _body.serial = serial;
        _body.epc_key = epc_key;
      }
      $axiosMertrack.post(`/v3/helper/print-layout`, _body).then((result) => {
        let _data = result.data;
        if (_data.error) {
          this.isOpenModal = false;
          return this.$toast.open({
            message: `${_data.message}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 3000,
          });
        }
        let content_itf = '';
        for (const it of _data.data) {
          content_itf += it._layout;
        }
        this.printData = content_itf;
        this.doPrintZPL();
      });
      return;
    },

    handleClickPrint() {
      if (this.selected_printer === '' && !this.print2default) {
        alert('You must select a printer');
        return;
      }
      let message = `You are about to print this data.\nThis operation will be update the count of print.\nWould you like to continue?`;
      if (confirm(message)) {
        this.postAndPrint();
        return;
      }
    },
    doPrintZPL() {
      if (this.selected_printer === '' && !this.print2default) {
        alert('You must select a printer');
        return;
      }
      let cpj = new JSPM.ClientPrintJob();
      if (this.print2default) {
        cpj.clientPrinter = new JSPM.DefaultPrinter();
      } else {
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.selected_printer);
      }
      cpj.printerCommands = this.printData;
      cpj.sendToClient();
    },
    onPrinterChange(value) {
      this.selected_printer = value;
      console.info('Selected printer:', value);
    },
    getPrinters() {
      return new Promise((ok, err) => {
        let printers = [];
        if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open) {
          JSPM.JSPrintManager.getPrinters()
            .then(function (myPrinters) {
              printers = myPrinters;
              ok(printers);
            })
            .catch((e) => err(e));
        } else {
          console.warn('JSPM WS not open');
          ok(printers);
        }
      });
    },
  },
  computed: {},
};
</script>

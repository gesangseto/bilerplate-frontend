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
    </div>

    <template #footer>
      <CButton
        size="sm"
        color="success"
        type="button"
        @click="handleClickPrint()"
      >
        Print Now
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
  name: 'ModalPrintLabelDummy',
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
      if (itm.id) {
        $axiosMertrack
          .get(`/v3/helper/print-layout-dummy?id=${itm.id}`)
          .then((result) => {
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
              this.formData = _data.data[0];
              this.isOpenModal = true;
            }
          });
      }
      return;
    },
    postAndPrint() {
      // console.log(this.formData._layout);

      this.printData = this.formData._layout;
      this.doPrintZPL();
      return;
    },

    handleClickPrint() {
      if (this.selected_printer === '' && !this.print2default) {
        alert('You must select a printer');
        return;
      }
      this.postAndPrint();
      return;
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

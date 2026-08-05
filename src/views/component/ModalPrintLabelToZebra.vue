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
        v-model="selectedPrinterUid"
        :options="printerOptions"
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
        Print [{{ formData.print_count ? formData.print_count : '-' }}]
      </CButton>
      <CButton
        size="sm"
        color="danger"
        type="button"
        @click="isOpenModal = false"
      >
        Close
      </CButton>
    </template>
  </CModal>
</template>

<script>
import $axios from '../../api';

export default {
  name: 'ModalPrintLabelToZebra',
  props: ['item', 'type'],
  watch: {
    isOpenModal(val) {
      if (!val) {
        this.printData = '';
        this.$emit('onClose');
      }
    },
    item: {
      handler(n) {
        if (n && Object.keys(n).length > 0) {
          this.loadData(n);
        }
      },
      deep: true,
    },
    selectedPrinterUid(newUid) {
      const found = this.devices.find((d) => d.uid === newUid);
      this.selectedDevice = found || null;
    },
  },
  data() {
    return {
      isOpenModal: false,
      printData: '',
      print2default: false,
      devices: [],
      selectedDevice: null,
      selectedPrinterUid: '',
      formData: { id: '' },
    };
  },
  computed: {
    printerOptions() {
      return this.devices.map((d) => ({
        value: d.uid,
        label: d.name,
      }));
    },
  },
  mounted() {
    this.initBrowserPrint();
  },
  methods: {
    initBrowserPrint() {
      if (typeof BrowserPrint === 'undefined') {
        alert('BrowserPrint library not loaded. Please include the script.');
        return;
      }

      BrowserPrint.getDefaultDevice(
        'printer',
        (defaultDevice) => {
          this.devices = [];
          if (defaultDevice && defaultDevice.uid) {
            this.devices.push(defaultDevice);
            this.selectedDevice = defaultDevice;
            this.selectedPrinterUid = defaultDevice.uid;
          }

          BrowserPrint.getLocalDevices(
            (deviceList) => {
              for (let i = 0; i < deviceList.length; i++) {
                const dev = deviceList[i];
                if (!this.devices.some((d) => d.uid === dev.uid)) {
                  this.devices.push(dev);
                }
              }
              if (!this.selectedDevice && this.devices.length > 0) {
                this.selectedDevice = this.devices[0];
                this.selectedPrinterUid = this.selectedDevice.uid;
              }
            },
            (error) => {
              alert('Failed to get printer list: ' + error);
            },
            'printer',
          );
        },
        (error) => {
          const errorMessage =
            'Unable to get printer list. Please install and run BrowserPrint from Zebra official website.';
          if (confirm(errorMessage)) {
            window.open(
              'https://www.zebra.com/ap/en/support-downloads/software/printer-software/browser-print.html',
              '_blank',
            );
            return;
          }
        },
      );
    },

    loadData(itm) {
      if (this.type === 'dummy') {
        $axios
          .get(`/v1/helper/print-layout-dummy?id=${itm.id}`)
          .then((result) => {
            const _data = result.data;
            if (_data.error) {
              this.$toast.open({
                message: `${_data.message}`,
                type: 'error',
                dissmissible: true,
                position: 'top-right',
                duration: 3000,
              });
            } else {
              this.formData = _data.data[0];
              // this.formData.print_count = null;
              this.isOpenModal = true;
            }
          })
          .catch((err) => {
            this.$toast.open({
              message: 'Failed to load print layout',
              type: 'error',
              duration: 3000,
            });
          });
      } else {
        let _body = { items: [] };
        if (itm.items) {
          for (const it of itm.items) {
            _body.items.push(it);
          }
          $axios.post(`/v1/helper/print-layout`, _body).then((result) => {
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
          $axios.get(`/v1/helper/print-layout?${_url}`).then((result) => {
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
      }
    },

    handleClickPrint() {
      if (!this.selectedDevice) {
        alert('Please select a printer.');
        return;
      }
      this.postAndPrint();
    },

    postAndPrint() {
      let _body = {
        reason: this.formData?.reason || '-',
      };
      if (this.formData?.items && this.formData?.items.length > 0) {
        _body.update_count = true;
        _body.items = this.formData?.items;
      } else {
        let serial = this.formData?.trx_pack_serial || this.formData?.serial;
        let epc_key = this.formData?.trx_pack_epc_key || this.formData?.epc_key;
        _body.update_count = true;
        _body.serial = serial;
        _body.epc_key = epc_key;
      }
      // Dummy tidak perlu laporan update COUNT
      if (this.type === 'dummy') {
        this.printData = this.formData._layout || '';
        this.doPrintZPL();
      } else {
        console.log('postAndPrint _body:', _body);
        $axios.post(`/v1/helper/print-layout`, _body).then((result) => {
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
      }
      return;
    },

    doPrintZPL() {
      console.log('doPrintZPL printData:', this.printData);
      if (!this.selectedDevice) {
        alert('No printer selected.');
        return;
      }

      this.selectedDevice.send(
        this.printData,
        // Success callback
        () => {
          this.$toast.open({
            message: 'Print job sent successfully!',
            type: 'success',
            duration: 2000,
          });
        },
        // Error callback
        (error) => {
          let errorMessage = 'Failed to print. ';
          if (error && typeof error === 'string') {
            errorMessage += error;
          } else if (error && error.message) {
            errorMessage += error.message;
          } else {
            errorMessage += 'Printer offline or unreachable.';
          }
          this.$toast.open({
            message: errorMessage,
            type: 'error',
            duration: 5000,
          });
        },
      );
    },
  },
};
</script>

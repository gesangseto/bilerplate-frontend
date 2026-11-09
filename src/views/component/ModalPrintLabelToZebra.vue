<template>
  <div>
    <CModal
      title="Detail"
      color="warning"
      :show.sync="isOpenModal"
      :onKey="handleModalKey"
    >
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
          color="info"
          type="button"
          :disabled="previewLoading"
          @click="openPreview()"
        >
          Preview
        </CButton>
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

    <div v-if="previewOpen" class="zpl-preview-overlay">
      <div class="zpl-preview-toolbar">
        <strong>Label Preview</strong>
        <span v-if="previewCount > 1" class="zpl-preview-note">
          label 1 of {{ previewCount }}
        </span>
        <span class="zpl-preview-hint">Scroll to zoom &middot; drag to move</span>
        <span class="zpl-preview-spacer"></span>
        <CButton size="sm" color="secondary" @click="zoomBy(1 / 1.25)">
          &minus;
        </CButton>
        <span class="zpl-preview-zoom">{{ Math.round(previewScale * 100) }}%</span>
        <CButton size="sm" color="secondary" @click="zoomBy(1.25)">
          +
        </CButton>
        <CButton size="sm" color="secondary" @click="fitPreview()">Fit</CButton>
        <CButton
          size="sm"
          color="secondary"
          title="Rotate label -90 degrees"
          @click="rotatePreview(-90)"
        >
          &minus;90&deg;
        </CButton>
        <CButton
          size="sm"
          color="secondary"
          title="Rotate label +90 degrees"
          @click="rotatePreview(90)"
        >
          +90&deg;
        </CButton>
        <CButton size="sm" color="danger" @click="closePreview()">Close</CButton>
      </div>
      <div
        ref="previewViewport"
        class="zpl-preview-viewport"
        :class="{ dragging: previewPanning }"
        @wheel.prevent="onPreviewWheel"
        @mousedown.prevent="startPreviewPan"
        @dblclick="fitPreview()"
      >
        <div v-if="previewLoading" class="zpl-preview-loading">
          Loading preview...
        </div>
        <img
          v-else-if="previewUrl"
          ref="previewImage"
          :src="previewUrl"
          class="zpl-preview-image"
          :style="previewImageStyle"
          draggable="false"
          alt="Label preview"
          @load="onPreviewImageLoad()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import $axiosMertrack from '../../apiMertrack';

export default {
  name: 'ModalPrintLabelToZebra',
  props: ['item', 'type'],
  watch: {
    isOpenModal(val) {
      if (!val) {
        this.printData = '';
        this.closePreview();
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
      previewOpen: false,
      previewLoading: false,
      previewUrl: '',
      previewCount: 1,
      previewScale: 1,
      previewX: 0,
      previewY: 0,
      previewRotation: 0,
      previewNaturalWidth: 0,
      previewNaturalHeight: 0,
      previewPanning: false,
      previewDrag: null,
      previewRequestId: 0,
    };
  },
  computed: {
    printerOptions() {
      return this.devices.map((d) => ({
        value: d.uid,
        label: d.name,
      }));
    },
    // Ukuran bounding box setelah rotasi 90/270: lebar dan tinggi bertukar
    previewRotatedSize() {
      const swap = Math.abs(this.previewRotation) % 180 === 90;
      return {
        width: swap ? this.previewNaturalHeight : this.previewNaturalWidth,
        height: swap ? this.previewNaturalWidth : this.previewNaturalHeight,
      };
    },
    previewImageStyle() {
      const size = this.previewRotatedSize;
      const scale = this.previewScale;
      // transform-origin di tengah gambar, sedangkan previewX/Y adalah pojok
      // kiri-atas bounding box, jadi translate dikoreksi setengah selisihnya.
      const translateX =
        this.previewX + (size.width * scale - this.previewNaturalWidth) / 2;
      const translateY =
        this.previewY + (size.height * scale - this.previewNaturalHeight) / 2;
      return {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${this.previewRotation}deg)`,
      };
    },
  },
  mounted() {
    this.initBrowserPrint();
  },
  beforeDestroy() {
    this.closePreview();
  },
  methods: {
    // Preview tidak butuh printer terpilih; ESC hanya menutup viewer, bukan modal
    handleModalKey(key, keyCode) {
      if (!this.previewOpen) return true;
      if (keyCode === 27) this.closePreview();
      return false;
    },

    buildPreviewZpl() {
      const items = this.formData && this.formData.items;
      if (Array.isArray(items) && items.length > 0) {
        return items
          .map((it) => (it && typeof it._layout === 'string' ? it._layout : ''))
          .join('');
      }
      if (this.formData && typeof this.formData._layout === 'string') {
        return this.formData._layout;
      }
      return '';
    },

    async openPreview() {
      const zpl = this.buildPreviewZpl();
      if (!zpl.trim()) {
        this.$toast.open({
          message: 'No label layout to preview',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 3000,
        });
        return;
      }
      this.setPreviewUrl('');
      this.previewScale = 1;
      this.previewX = 0;
      this.previewY = 0;
      this.previewRotation = 0;
      this.previewNaturalWidth = 0;
      this.previewNaturalHeight = 0;
      this.previewCount = 1;
      this.previewOpen = true;
      this.previewLoading = true;
      const requestId = ++this.previewRequestId;
      try {
        const response = await $axiosMertrack.post(
          '/v3/helper/zpl-to-image',
          { zpl: zpl },
          { responseType: 'blob' },
        );
        const contentType = response.headers['content-type'] || '';
        // Backend membalas JSON (HTTP 200) saat render gagal
        if (contentType.includes('application/json')) {
          const text = await response.data.text();
          let message = 'Failed to render preview';
          try {
            message = JSON.parse(text).message || message;
          } catch (error) {
            // isi respons bukan JSON yang valid, pakai pesan default
          }
          throw new Error(message);
        }
        const url = window.URL.createObjectURL(response.data);
        if (requestId !== this.previewRequestId || !this.previewOpen) {
          window.URL.revokeObjectURL(url);
          return;
        }
        this.previewCount = Number(response.headers['x-label-count']) || 1;
        this.setPreviewUrl(url);
      } catch (error) {
        if (requestId !== this.previewRequestId) return;
        this.closePreview();
        this.$toast.open({
          message: `${(error && error.message) || 'Failed to render preview'}`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      } finally {
        if (requestId === this.previewRequestId) this.previewLoading = false;
      }
    },

    closePreview() {
      this.previewRequestId++;
      this.endPreviewPan();
      this.setPreviewUrl('');
      this.previewOpen = false;
      this.previewLoading = false;
      this.previewCount = 1;
      this.previewScale = 1;
      this.previewX = 0;
      this.previewY = 0;
      this.previewRotation = 0;
      this.previewNaturalWidth = 0;
      this.previewNaturalHeight = 0;
    },

    setPreviewUrl(url) {
      if (this.previewUrl && this.previewUrl !== url) {
        window.URL.revokeObjectURL(this.previewUrl);
      }
      this.previewUrl = url;
    },

    onPreviewWheel(event) {
      if (!this.previewUrl) return;
      const viewport = this.$refs.previewViewport;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
      this.zoomAt(
        event.clientX - rect.left,
        event.clientY - rect.top,
        this.previewScale * factor,
      );
    },

    zoomBy(factor) {
      const viewport = this.$refs.previewViewport;
      if (!viewport) return;
      this.zoomAt(
        viewport.clientWidth / 2,
        viewport.clientHeight / 2,
        this.previewScale * factor,
      );
    },

    // Titik di bawah kursor tetap diam saat skala berubah
    zoomAt(centerX, centerY, nextScale) {
      const scale = Math.min(8, Math.max(0.1, nextScale));
      const ratio = scale / this.previewScale;
      this.previewX = centerX - (centerX - this.previewX) * ratio;
      this.previewY = centerY - (centerY - this.previewY) * ratio;
      this.previewScale = scale;
    },

    onPreviewImageLoad() {
      const image = this.$refs.previewImage;
      if (image) {
        this.previewNaturalWidth = image.naturalWidth;
        this.previewNaturalHeight = image.naturalHeight;
      }
      this.fitPreview();
    },

    // Putar label 90 derajat dengan pusat tampilan tetap di tempatnya
    rotatePreview(delta) {
      if (!this.previewUrl) return;
      const before = this.previewRotatedSize;
      const centerX = this.previewX + (before.width * this.previewScale) / 2;
      const centerY = this.previewY + (before.height * this.previewScale) / 2;
      this.previewRotation = (((this.previewRotation + delta) % 360) + 360) % 360;
      const after = this.previewRotatedSize;
      this.previewX = centerX - (after.width * this.previewScale) / 2;
      this.previewY = centerY - (after.height * this.previewScale) / 2;
    },

    fitPreview() {
      const viewport = this.$refs.previewViewport;
      const image = this.$refs.previewImage;
      const size = this.previewRotatedSize;
      if (!viewport || !image || !size.width || !size.height) return;
      const fit = Math.min(
        viewport.clientWidth / size.width,
        viewport.clientHeight / size.height,
      );
      this.previewScale = Math.min(1, Math.max(0.1, fit));
      this.previewX = (viewport.clientWidth - size.width * this.previewScale) / 2;
      this.previewY =
        (viewport.clientHeight - size.height * this.previewScale) / 2;
    },

    startPreviewPan(event) {
      if (!this.previewUrl || event.button !== 0) return;
      this.previewPanning = true;
      this.previewDrag = {
        startX: event.clientX,
        startY: event.clientY,
        originX: this.previewX,
        originY: this.previewY,
      };
      window.addEventListener('mousemove', this.onPreviewPanMove);
      window.addEventListener('mouseup', this.endPreviewPan);
    },

    onPreviewPanMove(event) {
      if (!this.previewDrag) return;
      this.previewX =
        this.previewDrag.originX + event.clientX - this.previewDrag.startX;
      this.previewY =
        this.previewDrag.originY + event.clientY - this.previewDrag.startY;
    },

    endPreviewPan() {
      this.previewPanning = false;
      this.previewDrag = null;
      window.removeEventListener('mousemove', this.onPreviewPanMove);
      window.removeEventListener('mouseup', this.endPreviewPan);
    },

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
        $axiosMertrack
          .get(`/v3/helper/print-layout-dummy?id=${itm.id}`)
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
          $axiosMertrack
            .post(`/v3/helper/print-layout`, _body)
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
          $axiosMertrack
            .get(`/v3/helper/print-layout?${_url}`)
            .then((result) => {
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

<style scoped>
.zpl-preview-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  background: rgba(20, 20, 20, 0.94);
}
.zpl-preview-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #2c2c34;
  color: #fff;
}
.zpl-preview-note {
  padding: 2px 8px;
  border-radius: 10px;
  background: #ffc107;
  color: #1f1f1f;
  font-size: 12px;
  font-weight: 600;
}
.zpl-preview-hint {
  margin-left: 8px;
  font-size: 12px;
  opacity: 0.65;
}
.zpl-preview-spacer {
  flex: 1;
}
.zpl-preview-zoom {
  min-width: 48px;
  text-align: center;
  font-size: 13px;
}
.zpl-preview-viewport {
  position: relative;
  flex: 1;
  overflow: hidden;
  cursor: grab;
  user-select: none;
}
.zpl-preview-viewport.dragging {
  cursor: grabbing;
}
.zpl-preview-image {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  transform-origin: 50% 50%;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.6);
}
.zpl-preview-loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}
</style>

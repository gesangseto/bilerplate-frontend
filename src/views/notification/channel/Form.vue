<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm novalidate>
              <CCol sm="12">
                <InputDefault
                  :disabled="true"
                  required
                  :col="[3, 9]"
                  title="Code"
                  placeholder="Channel code (e.g. default)"
                  v-model="formData.code"
                />
                <small
                  class="text-muted d-block mt-n2 mb-2"
                  style="margin-left: 25%"
                >
                  Code adalah kunci integrasi dan tidak dapat diubah.
                </small>
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read'"
                  required
                  :col="[3, 9]"
                  title="Name"
                  placeholder="Enter channel name"
                  v-model="formData.name"
                  :is-valid="initialLoad ? null : !formData.name ? false : true"
                />
              </CCol>
              <CCol sm="12">
                <TextareaDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Description"
                  placeholder="Enter description"
                  v-model="formData.description"
                />
              </CCol>
              <CCol sm="12">
                <TextareaDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="API Key"
                  placeholder="Kredensial API (untuk channel berbasis API)"
                  v-model="formData.api_key"
                />
              </CCol>
              <CCol sm="12" v-if="formData.code && formData.code !== 'default'">
                <InputDefault
                  :disabled="action == 'Read'"
                  :col="[3, 9]"
                  title="Sender (Nomor Device)"
                  placeholder="Nomor device terdaftar di provider, mis 62812xxxx"
                  v-model="formData.sender"
                  :is-valid="initialLoad ? null : !formData.sender ? false : true"
                />
                <small
                  class="text-muted d-block mt-n2 mb-2"
                  style="margin-left: 25%"
                >
                  Nomor device WhatsApp yang terdaftar/terhubung di provider
                  channel ini (mis. device pada sendwapi.com).
                </small>
              </CCol>
              <CCol md="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="action == 'Read'"
                    :default_value="formData.status"
                    :show_label="true"
                    v-on:onChange="formData.status = $event"
                  />
                </CRow>
              </CCol>

              <!-- Koneksi WhatsApp (Baileys) — hanya untuk channel code='default' -->
              <template v-if="formData.code === 'default'">
                <hr />
                <p style="font-weight: bold">Koneksi WhatsApp (Baileys)</p>
                <CCol sm="6">
                  <CRow form class="form-group">
                    <CCol tag="label" sm="6" class="col-form-label">
                      Enabling Notification
                    </CCol>
                    <CCol sm="4">
                      <CSwitch
                        class="mr-1"
                        color="success"
                        :checked.sync="data.notification_whatsapp"
                        :disabled="whatsappLoading"
                        @update:checked="onWhatsappToggle"
                      />
                    </CCol>
                  </CRow>
                </CCol>
                <div v-if="data.notification_whatsapp">
                  <small>{{ whatsappStatus.message }}</small>
                  <hr />
                  <CForm
                    v-if="whatsappStatus.qr_base64 && !whatsappQrExpired"
                  >
                    <CCol class="md-4">
                      <img
                        v-bind:src="whatsappStatus.qr_base64"
                        style="width: 150px; height: auto"
                      />
                    </CCol>
                  </CForm>
                  <div
                    v-if="whatsappQrExpired && !whatsappStatus.connected"
                    class="mb-2"
                  >
                    <p class="text-warning mb-2">
                      QR sudah kedaluwarsa. Silakan muat ulang QR untuk
                      menampilkan kode baru.
                    </p>
                    <CButton
                      size="sm"
                      color="primary"
                      @click="reloadWhatsappQr"
                    >
                      Muat Ulang QR
                    </CButton>
                  </div>
                  <small
                    v-if="whatsappStatus.error && !whatsappStatus.qr_base64"
                    class="text-danger"
                  >
                    {{ whatsappStatus.message }}
                  </small>
                  <CForm v-if="whatsappStatus.connected">
                    <InputDefault
                      :col="[3, 7]"
                      :title="'To'"
                      :validasi="'integer'"
                      v-model="whatsappMessage.to"
                      :max="14"
                    />
                    <InputDefault
                      :col="[3, 7]"
                      :title="'Message'"
                      v-model="whatsappMessage.message"
                      :max="200"
                    />
                    <div class="d-flex align-items-center" style="gap: 12px">
                      <CButton
                        size="sm"
                        color="success"
                        @click="sendWhatsapp()"
                      >
                        Send Test Message
                      </CButton>
                      <CButton
                        v-if="whatsappStatus.connected"
                        size="sm"
                        color="danger"
                        :disabled="whatsappDestroying"
                        @click="deleteWhatsapp()"
                      >
                        {{
                          whatsappDestroying
                            ? 'Deleting session...'
                            : 'Hapus Session WhatsApp'
                        }}
                      </CButton>
                    </div>
                    <small
                      v-if="whatsappMessage.response && whatsappMessage.error"
                      class="text-danger"
                    >
                      {{ whatsappMessage.response }}
                    </small>
                  </CForm>
                </div>
              </template>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div class="float-left">
              <CButton
                v-if="action == 'Read' ? false : true"
                type="submit"
                size="sm"
                color="primary"
                @click="save()"
              >
                <CIcon name="cil-check-circle" /> Submit
              </CButton>
              <ButtonBack />
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { capitalizeFirstLetter, handleBack } from '../../../utils';
import {
  getNotificationChannel,
  updateNotificationChannel,
} from '../../../resource/NotificationChannel';
import {
  getSysConfig,
  updateSysConfig,
} from '../../../resource/SysConfig';
import {
  getWhatsappQr,
  getWhatsappStatus,
  sendWhatsappMessage,
  deleteWhatsappSession,
} from '../../../resource/Whatsapp';

export default {
  name: 'FormNotificationChannel',
  data() {
    return {
      initialLoad: true,
      route_action: '',
      action: 'Edit',
      formData: {},
      data: {
        users_name: null,
        notification_whatsapp: false,
      },
      whatsappStatus: { error: false, message: null, qr_base64: null },
      whatsappLoading: false,
      whatsappDestroying: false,
      whatsappQrExpired: false,
      whatsappQrIssuedAt: null,
      whatsappPolling: null,
      whatsappMessage: {
        to: null,
        message: null,
        response: null,
        error: false,
      },
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  beforeDestroy() {
    this.stopWhatsappPolling();
  },
  methods: {
    async loadData() {
      let _res = await getNotificationChannel({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
        if (this.formData.code === 'default') {
          await this.loadConfig();
        }
      }
    },
    validation() {
      if (!this.formData.name) {
        return false;
      }
      // Channel API (non-default) wajib punya api_key + sender (nomor device)
      if (
        this.formData.code &&
        this.formData.code !== 'default' &&
        (!this.formData.sender || !this.formData.api_key)
      ) {
        return false;
      }
      return true;
    },
    async save() {
      this.initialLoad = false;
      if (!this.validation()) {
        this.$toast.open({
          message: 'Please input all the required data.',
          type: 'error',
          dismissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (confirm('You are about to save changes to this data. This operation cannot be undone. Would you like to continue?')) {
        let dataPost = { ...this.formData };
        delete dataPost.code; // code adalah kunci integrasi — tidak boleh diubah
        this.$isLoading(true);
        let res = await updateNotificationChannel(dataPost);
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dismissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) handleBack(this.$router, this.$route);
      }
      return;
    },
    cancel() {
      handleBack(this.$router, this.$route);
    },
    // ===== Toggle enable WhatsApp (sys_config.notification_whatsapp) =====
    async loadConfig() {
      let _res = await getSysConfig();
      if (_res) {
        let config = _res.data[0];
        this.data = {
          users_name: config.users_name,
          notification_whatsapp: !!config.notification_whatsapp,
        };
        if (this.data.notification_whatsapp) {
          await this.loadWhatsapp();
        }
      }
      return;
    },
    async onWhatsappToggle(enabled) {
      const previous = !enabled;
      this.data.notification_whatsapp = enabled;
      this.whatsappLoading = true;
      try {
        const result = await updateSysConfig({
          users_name: this.data.users_name,
          notification_whatsapp: enabled,
        });
        if (!result || result.error) {
          this.data.notification_whatsapp = previous;
          this.whatsappStatus = {
            error: true,
            connected: false,
            qr_base64: null,
            message: result?.message || 'Gagal menyimpan pengaturan WhatsApp.',
          };
          return;
        }

        if (enabled) {
          await this.loadWhatsapp();
        } else {
          this.stopWhatsappPolling();
          this.whatsappQrExpired = false;
          this.whatsappQrIssuedAt = null;
          this.whatsappStatus = {
            error: false,
            connected: false,
            qr_base64: null,
            message: 'Notifikasi WhatsApp dinonaktifkan.',
          };
        }
      } finally {
        this.whatsappLoading = false;
      }
    },
    // ===== Koneksi WhatsApp (Baileys) =====
    async sendWhatsapp() {
      let _res = await sendWhatsappMessage(this.whatsappMessage);
      if (_res) {
        this.whatsappMessage.error = _res.error;
        this.whatsappMessage.response = _res.error ? _res.message : null;
        if (!_res.error) {
          this.$toast.open({
            message: _res.message || 'Pesan berhasil dikirim',
            type: 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        } else {
          this.$toast.open({
            message: _res.message || 'Pesan gagal dikirim',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        }
      } else {
        this.$toast.open({
          message: 'Gagal mengirim pesan WhatsApp',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      }
    },
    async deleteWhatsapp() {
      if (
        !window.confirm(
          'Hapus session WhatsApp? Anda perlu scan QR lagi untuk menghubungkannya.',
        )
      ) {
        return;
      }
      this.whatsappDestroying = true;
      let _res = await deleteWhatsappSession();
      this.whatsappDestroying = false;
      if (!_res || _res.error) {
        return;
      }
      this.stopWhatsappPolling();
      this.whatsappQrExpired = false;
      this.whatsappQrIssuedAt = null;
      this.whatsappStatus = {
        error: false,
        message: 'Session WhatsApp berhasil dihapus.',
        qr_base64: null,
      };
      this.whatsappMessage = {
        to: null,
        message: null,
        response: null,
        error: false,
      };
      if (this.data.notification_whatsapp) {
        await this.loadWhatsapp();
      }
    },
    async loadWhatsapp() {
      let _res = await getWhatsappQr();
      if (_res && _res.error) {
        this.stopWhatsappPolling();
        this.whatsappStatus = {
          ...this.whatsappStatus,
          qr_base64: null,
          connected: false,
          error: true,
          message: _res.message,
        };
      } else if (_res && !_res.error) {
        const status = _res.data?.[0] || {};
        const qrBase64 = status.qr_base64 || null;
        const expired = !!status.qr_expired;
        this.whatsappQrExpired = expired;
        if (qrBase64) {
          // QR baru ditampilkan → mulai hitung masa berlakunya.
          this.whatsappQrIssuedAt = Date.now();
        }
        this.whatsappStatus = {
          ...this.whatsappStatus,
          qr_base64: qrBase64,
          connected: !!status.connected,
          error: false,
          message: status.connected
            ? 'WhatsApp terhubung.'
            : _res.message || 'Menunggu QR WhatsApp...',
        };
        if (status.connected) {
          this.stopWhatsappPolling();
        } else if (qrBase64 || expired) {
          this.startWhatsappPolling();
        }
      }
    },
    // QR Baileys hanya berlaku 60 detik (qrTimeout backend). Selama QR tampil
    // kita hanya memantau status koneksi — gambar QR TIDAK diganti otomatis.
    // Setelah lewat masa berlaku, tampilkan pesan agar user memuat ulang.
    startWhatsappPolling() {
      if (this.whatsappPolling) {
        return;
      }
      this.whatsappPolling = setInterval(async () => {
        if (
          this.whatsappQrIssuedAt &&
          Date.now() - this.whatsappQrIssuedAt > 55000
        ) {
          this.whatsappQrExpired = true;
          this.stopWhatsappPolling();
          return;
        }
        const _res = await getWhatsappStatus();
        const status = (_res && !_res.error && _res.data?.[0]) || null;
        if (status && status.connected) {
          this.whatsappQrExpired = false;
          this.whatsappStatus = {
            ...this.whatsappStatus,
            connected: true,
            qr_base64: null,
            error: false,
            message: 'WhatsApp terhubung.',
          };
          this.stopWhatsappPolling();
        } else if (status && status.qr_expired) {
          this.whatsappQrExpired = true;
          this.stopWhatsappPolling();
        }
      }, 5000);
    },
    stopWhatsappPolling() {
      if (this.whatsappPolling) {
        clearInterval(this.whatsappPolling);
        this.whatsappPolling = null;
      }
    },
    async reloadWhatsappQr() {
      this.stopWhatsappPolling();
      this.whatsappQrExpired = false;
      this.whatsappStatus = {
        ...this.whatsappStatus,
        qr_base64: null,
        message: 'Memuat QR baru...',
      };
      await this.loadWhatsapp();
    },
  },
};
</script>

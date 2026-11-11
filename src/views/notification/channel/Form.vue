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
              <!-- Panduan pengisian per channel — dikirim Backend (read only) -->
              <CCol sm="12" v-if="formData.documentation">
                <CRow form class="form-group">
                  <CCol tag="label" sm="3" class="col-form-label font-weight-bold">
                    Petunjuk Pengisian
                  </CCol>
                  <CCol sm="9">
                    <div class="border rounded bg-light p-3 text-muted" style="white-space: pre-line; line-height: 1.6">
                      {{ formData.documentation }}
                    </div>
                  </CCol>
                </CRow>
              </CCol>
              <!-- Kirimi: kredensial disimpan sebagai JSON di kolom api_key -->
              <template v-if="formData.code === 'kirimi'">
                <CCol sm="12">
                  <CRow form class="form-group mb-0">
                    <CCol sm="3" class="col-form-label font-weight-bold">Kredensial Kirimi</CCol>
                  </CRow>
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read'"
                    required
                    :col="[3, 9]"
                    title="User Code"
                    placeholder="User code dari dashboard Kirimi"
                    v-model="kirimi.user_code"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read'"
                    required
                    :col="[3, 9]"
                    title="Secret Key"
                    placeholder="Secret key API Kirimi"
                    v-model="kirimi.secret"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read'"
                    required
                    :col="[3, 9]"
                    title="Device ID"
                    placeholder="ID device WhatsApp di dashboard Kirimi"
                    v-model="kirimi.device_id"
                  />
                </CCol>
                <CCol sm="12">
                  <InputDefault
                    :disabled="action == 'Read'"
                    :col="[3, 9]"
                    title="Public Base URL"
                    placeholder="https://domain-aplikasi — opsional"
                    v-model="kirimi.public_base_url"
                  />
                </CCol>
              </template>
              <template v-else>
                <CCol sm="12">
                  <TextareaDefault
                    :disabled="action == 'Read'"
                    :col="[3, 9]"
                    title="API Key"
                    placeholder="Kredensial API channel (mis. swk_live_… untuk SendWia)"
                    v-model="formData.api_key"
                  />
                </CCol>
                <CCol sm="12" v-if="formData.code && formData.code !== 'default'">
                  <InputDefault
                    :disabled="action == 'Read'"
                    :col="[3, 9]"
                    title="Sender (Account ID)"
                    placeholder="ID akun pengirim acc_xxx — opsional"
                    v-model="formData.sender"
                  />
                </CCol>
              </template>
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

              <!-- Test channel — berlaku untuk SEMUA channel (default / API) -->
              <template v-if="formData.code">
                <hr />
                <p style="font-weight: bold">Test Channel</p>
                <CCol sm="12">
                  <CRow form class="form-group mb-2">
                    <CCol tag="label" sm="3" class="col-form-label">
                      Koneksi
                    </CCol>
                    <CCol sm="9">
                      <CButton
                        size="sm"
                        color="info"
                        :disabled="testLoading"
                        @click="testConnection()"
                      >
                        {{
                          testLoading ? 'Checking...' : 'Test Koneksi'
                        }}
                      </CButton>
                      <small
                        v-if="connectionResult.message"
                        class="d-block mt-2"
                        :class="
                          connectionResult.error ? 'text-danger' : 'text-success'
                        "
                      >
                        {{ connectionResult.message }}
                      </small>
                    </CCol>
                  </CRow>
                </CCol>
                <InputDefault
                  :col="[3, 7]"
                  :title="'To'"
                  :validasi="'integer'"
                  v-model="testMessage.to"
                  :max="14"
                />
                <InputDefault
                  :col="[3, 7]"
                  :title="'Message'"
                  v-model="testMessage.message"
                  :max="200"
                />
                <CCol sm="12">
                  <CRow form class="form-group mb-0">
                    <CCol sm="3"></CCol>
                    <CCol sm="9">
                      <CButton
                        size="sm"
                        color="success"
                        :disabled="testSending"
                        @click="sendTestMessage()"
                      >
                        {{
                          testSending ? 'Sending...' : 'Send Test Message'
                        }}
                      </CButton>
                      <small
                        v-if="testResult.message"
                        class="d-block mt-2"
                        :class="testResult.error ? 'text-danger' : 'text-success'"
                      >
                        {{ testResult.message }}
                      </small>
                    </CCol>
                  </CRow>
                </CCol>
              </template>

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
                    <CButton
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
  testNotificationChannelConnection,
  sendTestNotificationChannel,
} from '../../../resource/NotificationChannel';
import {
  getSysConfig,
  updateSysConfig,
} from '../../../resource/SysConfig';
import {
  getWhatsappQr,
  getWhatsappStatus,
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
      kirimi: {
        user_code: '',
        secret: '',
        device_id: '',
        public_base_url: '',
      },
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
      // Test channel (berlaku semua channel — default & API)
      testLoading: false,
      testSending: false,
      testMessage: {
        to: null,
        message: null,
      },
      testResult: { message: null, error: false },
      connectionResult: { message: null, error: false },
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
        if (this.formData.code === 'kirimi') {
          this.parseKirimiCredentials();
        }
        if (this.formData.code === 'default') {
          await this.loadConfig();
        }
      }
    },
    // api_key channel Kirimi = JSON { user_code, secret, device_id, public_base_url }
    parseKirimiCredentials() {
      try {
        const parsed = JSON.parse(this.formData.api_key || '{}');
        this.kirimi = {
          user_code: parsed.user_code || '',
          secret: parsed.secret || '',
          device_id: parsed.device_id || '',
          public_base_url: parsed.public_base_url || '',
        };
      } catch (_) {
        this.kirimi = {
          user_code: '',
          secret: '',
          device_id: '',
          public_base_url: '',
        };
      }
    },
    applyKirimiCredentials() {
      if (this.formData.code !== 'kirimi') return;
      const payload = {
        user_code: (this.kirimi.user_code || '').trim(),
        secret: (this.kirimi.secret || '').trim(),
        device_id: (this.kirimi.device_id || '').trim(),
      };
      const publicBaseUrl = (this.kirimi.public_base_url || '').trim();
      if (publicBaseUrl) payload.public_base_url = publicBaseUrl;
      this.formData.api_key = JSON.stringify(payload);
    },
    validation() {
      if (!this.formData.name) {
        return false;
      }
      // Kirimi butuh tiga kredensial sekaligus (disimpan sebagai JSON).
      if (this.formData.code === 'kirimi') {
        return !!(
          (this.kirimi.user_code || '').trim() &&
          (this.kirimi.secret || '').trim() &&
          (this.kirimi.device_id || '').trim()
        );
      }
      // Channel API lain wajib punya api_key; sender (account id,
      // mis. acc_xxx) opsional — API key bisa sudah terikat satu device.
      if (
        this.formData.code &&
        this.formData.code !== 'default' &&
        !this.formData.api_key
      ) {
        return false;
      }
      return true;
    },
    async save() {
      this.initialLoad = false;
      this.applyKirimiCredentials();
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
        delete dataPost.documentation; // panduan pengisian milik Backend (seeder)
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
    // ===== Test channel — dipakai semua channel (default & API) =====
    async testConnection() {
      if (!this.formData.code) return;
      this.testLoading = true;
      this.connectionResult = { message: null, error: false };
      let _res = await testNotificationChannelConnection(this.formData.code);
      this.testLoading = false;
      if (!_res) {
        this.connectionResult = {
          message: 'Gagal menghubungi server.',
          error: true,
        };
        return;
      }
      this.connectionResult = {
        message:
          _res.message ||
          (_res.error ? 'Channel belum siap digunakan.' : 'Channel siap digunakan.'),
        error: !!_res.error,
      };
    },
    async sendTestMessage() {
      if (!this.formData.code) return;
      const to = String(this.testMessage.to || '').trim();
      if (!to) {
        this.$toast.open({
          message: 'Nomor tujuan wajib diisi.',
          type: 'error',
          dismissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.testSending = true;
      this.testResult = { message: null, error: false };
      let _res = await sendTestNotificationChannel({
        code: this.formData.code,
        to,
        message: String(this.testMessage.message || '').trim() || undefined,
      });
      this.testSending = false;
      if (!_res) {
        this.testResult = {
          message: 'Gagal mengirim pesan uji. Periksa koneksi server.',
          error: true,
        };
        return;
      }
      this.testResult = {
        message: _res.message || (_res.error ? 'Pesan uji gagal dikirim.' : 'Pesan uji terkirim.'),
        error: !!_res.error,
      };
      this.$toast.open({
        message: this.testResult.message,
        type: this.testResult.error ? 'error' : 'success',
        dismissible: true,
        position: 'top-right',
        duration: 5000,
      });
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

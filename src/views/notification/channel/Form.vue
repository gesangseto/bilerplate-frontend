<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader
            class="d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">{{ $activeMenu.name }} [{{ route_action }}]</h5>
            <ButtonInfo :formData="formData" v-if="action !== 'Create'" />
          </CCardHeader>

          <CCardBody>
            <CForm>
              <CCol sm="12">
                <InputDefault
                  :disabled="true"
                  :col="[3, 9]"
                  title="ID"
                  v-model="formData.id"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="isRead"
                  :col="[3, 9]"
                  required
                  title="Name"
                  placeholder="Enter channel name"
                  v-model="formData.name"
                  :is-valid="initial_load ? null : formData.name ? true : false"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="isRead || !!formData.id"
                  :col="[3, 9]"
                  required
                  title="Code"
                  placeholder="WHATSAPP / EMAIL / TELEGRAM / SLACK"
                  :options="{ uppercase: true, nospace: true }"
                  v-model="formData.code"
                  :is-valid="initial_load ? null : formData.code ? true : false"
                />
              </CCol>
              <CCol sm="12">
                <TextareaDefault
                  :disabled="isRead"
                  :col="[3, 9]"
                  :rows="3"
                  title="Description"
                  placeholder="Enter channel description"
                  v-model="formData.description"
                />
              </CCol>

              <template v-if="configFields.length">
                <CCol sm="12">
                  <p style="font-weight: bold" class="mb-0">Configuration</p>
                  <hr />
                </CCol>
                <CCol sm="12" v-for="field in configFields" :key="field.key">
                  <InputDefault
                    :disabled="isRead"
                    :col="[3, 9]"
                    :type="field.type || 'text'"
                    :title="field.label"
                    :placeholder="field.placeholder"
                    v-model="formData.config[field.key]"
                  />
                </CCol>
              </template>
              <CCol sm="12" v-else-if="!isKnownCode">
                <TextareaDefault
                  :disabled="isRead"
                  :col="[3, 9]"
                  :rows="6"
                  title="Config (JSON)"
                  placeholder='{ "key": "value" }'
                  v-model="configText"
                  :is-valid="configValid"
                />
              </CCol>

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="isRead"
                    :show_label="true"
                    :default_value="formData.status"
                    v-on:onChange="formData.status = $event"
                  />
                </CRow>
              </CCol>
            </CForm>

            <!-- WhatsApp session (dipindah dari Application Settings) -->
            <div v-if="isWhatsapp && formData.id">
              <hr />
              <p style="font-weight: bold">
                <CIcon name="cib-whatsapp" /> &nbsp; WhatsApp Connection
              </p>
              <template v-if="formData.status === 'Active'">
                <template v-if="!whatsappPanelOpen">
                  <small class="text-muted">
                    The QR panel is closed. Open it only when you need to
                    connect or re-scan WhatsApp.
                  </small>
                  <div class="mt-2">
                    <CButton
                      size="sm"
                      color="primary"
                      :disabled="whatsappLoading"
                      @click="openWhatsappPanel"
                    >
                      Connect / Show QR
                    </CButton>
                  </div>
                </template>
                <template v-else>
                  <div class="d-flex flex-wrap align-items-center mb-2">
                    <CButton
                      size="sm"
                      color="secondary"
                      @click="closeWhatsappPanel"
                    >
                      Hide QR
                    </CButton>
                  </div>
                  <small>{{ whatsappStatus.message }}</small>
                  <hr />
                  <CForm v-if="whatsappStatus.qr_base64 && !whatsappQrExpired">
                    <CCol md="4">
                      <img
                        v-bind:src="whatsappStatus.qr_base64"
                        style="width: 220px; height: auto"
                      />
                    </CCol>
                  </CForm>
                  <div
                    v-if="whatsappQrExpired && !whatsappStatus.connected"
                    class="mb-2"
                  >
                    <p class="text-warning mb-2">
                      QR code has expired. Please reload the QR to display a new
                      code.
                    </p>
                    <CButton size="sm" color="primary" @click="reloadWhatsappQr">
                      Reload QR
                    </CButton>
                  </div>
                  <div
                    v-else-if="
                      !whatsappStatus.qr_base64 &&
                      !whatsappStatus.connected &&
                      !whatsappStatus.error
                    "
                    class="mb-2"
                  >
                    <CButton size="sm" color="primary" @click="reloadWhatsappQr">
                      Show QR
                    </CButton>
                  </div>
                  <div v-if="!whatsappStatus.connected" class="mt-2 mb-2">
                    <CButton
                      size="sm"
                      color="danger"
                      :disabled="whatsappDestroying"
                      @click="deleteWhatsapp()"
                    >
                      {{
                        whatsappDestroying
                          ? 'Deleting session...'
                          : 'Reset Session'
                      }}
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
                      :col="[4, 8]"
                      :title="'To'"
                      :validasi="'integer'"
                      v-model="whatsappMessage.to"
                      :max="14"
                    />
                    <InputDefault
                      :col="[4, 8]"
                      :title="'Message'"
                      v-model="whatsappMessage.message"
                      :max="200"
                    />
                    <div
                      class="d-flex flex-wrap align-items-center"
                      style="gap: 12px"
                    >
                      <CButton
                        size="sm"
                        color="success"
                        @click="sendWhatsapp()"
                      >
                        Send Test Message
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        :disabled="whatsappDestroying"
                        @click="deleteWhatsapp()"
                      >
                        {{
                          whatsappDestroying
                            ? 'Deleting session...'
                            : 'Delete Session'
                        }}
                      </CButton>
                    </div>
                    <small
                      v-if="
                        whatsappMessage.response && whatsappMessage.error
                      "
                      class="text-danger"
                    >
                      {{ whatsappMessage.response }}
                    </small>
                  </CForm>
                </template>
              </template>
              <small v-else class="text-muted">
                Activate this channel to connect or re-scan WhatsApp.
              </small>
            </div>
          </CCardBody>

          <CCardFooter class="d-flex justify-content-start gap-2">
            <ButtonReason
              v-if="action == 'Update'"
              :property="formData"
              type="update"
              :reason.sync="formData.reason"
              :reason-required="true"
              @handleSubmit="save()"
            />
            <ButtonSubmit v-if="action == 'Create'" @handleSubmit="save()" />
            <ButtonBack />
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
  insertNotificationChannel,
  updateNotificationChannel,
} from '../../../resource/NotificationChannel';
import {
  getWhatsappQr,
  getWhatsappStatus,
  sendWhatsappMessage,
  deleteWhatsappSession,
} from '../../../resource/Whatsapp';

const CONFIG_FIELDS = {
  WHATSAPP: [],
  EMAIL: [
    { key: 'host', label: 'SMTP Host', placeholder: 'smtp.example.com' },
    { key: 'port', label: 'SMTP Port', type: 'number', placeholder: '587' },
    { key: 'username', label: 'Username' },
    { key: 'password', label: 'Password', type: 'password' },
    {
      key: 'from_address',
      label: 'From Address',
      placeholder: 'no-reply@example.com',
    },
    { key: 'from_name', label: 'From Name' },
  ],
  TELEGRAM: [
    { key: 'bot_token', label: 'Bot Token' },
    { key: 'chat_id', label: 'Chat ID' },
  ],
  SLACK: [{ key: 'webhook_url', label: 'Webhook URL' }],
};

export default {
  name: 'FormNotificationChannel',
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: { status: 'Inactive', code: '', config: {} },
      configText: '{}',
      configValid: null,
      // Endpoint WhatsApp (termasuk /status) hanya dipanggil saat panel QR
      // dibuka user, agar tidak membebani backend di setiap page load.
      whatsappStatus: { error: false, message: null, qr_base64: null },
      whatsappLoading: false,
      whatsappDestroying: false,
      whatsappPanelOpen: false,
      // QR hanya valid 60 detik. Masa berlaku dihitung dari qr_issued_at
      // backend (bukan dari waktu fetch) supaya gambar yang sudah berumur
      // tidak ikut ditampilkan dan ditolak WhatsApp.
      whatsappQrExpired: false,
      whatsappQrIssuedAt: null,
      whatsappQrTtl: 60000,
      whatsappQrRequesting: false,
      whatsappLastQrRefreshAt: 0,
      whatsappPolling: null,
      whatsappMessage: {
        to: null,
        message: null,
        response: null,
        error: false,
      },
    };
  },
  computed: {
    isRead() {
      return this.action === 'Read';
    },
    isWhatsapp() {
      return String(this.formData.code || '').toUpperCase() === 'WHATSAPP';
    },
    isKnownCode() {
      return Object.prototype.hasOwnProperty.call(
        CONFIG_FIELDS,
        String(this.formData.code || '').toUpperCase(),
      );
    },
    configFields() {
      return CONFIG_FIELDS[String(this.formData.code || '').toUpperCase()] || [];
    },
  },
  watch: {
    'formData.code'() {
      this.syncConfig();
    },
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
      let res = await getNotificationChannel({ id: this.$route.params.id });
      if (res && !res.error && res.data && res.data.length > 0) {
        this.formData = res.data[0];
        this.formData.config = res.data[0].config || {};
        this.configText = JSON.stringify(this.formData.config, null, 2);
        this.syncConfig();
      }
    },
    // Pastikan key konfigurasi channel selalu ada supaya v-model reaktif
    syncConfig() {
      const config = { ...(this.formData.config || {}) };
      for (const field of this.configFields) {
        if (config[field.key] === undefined) config[field.key] = '';
      }
      this.$set(this.formData, 'config', config);
      if (!this.isKnownCode) {
        this.configText = JSON.stringify(config, null, 2);
      }
    },
    validation() {
      if (!this.formData.name) return false;
      if (!this.formData.code) return false;
      if (!this.isKnownCode) {
        try {
          JSON.parse(this.configText || '{}');
        } catch {
          this.configValid = false;
          return false;
        }
      }
      return true;
    },
    buildConfig() {
      if (this.isKnownCode) return this.formData.config || {};
      return JSON.parse(this.configText || '{}');
    },
    async save() {
      this.initial_load = false;
      if (!this.validation()) {
        this.$toast.open({
          message: 'Please input all the required data.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let formData = { ...this.formData, config: this.buildConfig() };
        this.$isLoading(true);
        let res = {};
        if (formData.id) {
          res = await updateNotificationChannel(formData);
        } else {
          res = await insertNotificationChannel(formData);
        }
        this.$isLoading(false);
        this.$toast.open({
          message:
            res && !res.error
              ? 'Data has been saved successfully '
              : `${res?.message || 'Failed to save data'}`,
          type: res && !res.error ? 'success' : 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (res && !res.error) handleBack(this.$router, this.$route);
      }
    },
    async sendWhatsapp() {
      let _res = await sendWhatsappMessage(this.whatsappMessage);
      if (_res) {
        this.whatsappMessage.error = _res.error;
        this.whatsappMessage.response = _res.error ? _res.message : null;
        this.$toast.open({
          message: _res.error
            ? _res.message || 'Failed to send message'
            : _res.message || 'Message sent successfully',
          type: _res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      }
    },
    async deleteWhatsapp() {
      if (
        !window.confirm(
          'Delete WhatsApp session? You will need to scan the QR again to reconnect.',
        )
      ) {
        return;
      }
      this.whatsappDestroying = true;
      let _res = await deleteWhatsappSession();
      this.whatsappDestroying = false;
      if (!_res || _res.error) {
        this.$toast.open({
          message: _res?.message || 'Failed to delete WhatsApp session',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.stopWhatsappPolling();
      this.whatsappQrExpired = false;
      this.whatsappQrIssuedAt = null;
      this.whatsappStatus = {
        error: false,
        connected: false,
        message: 'WhatsApp session deleted successfully.',
        qr_base64: null,
      };
      this.whatsappMessage = {
        to: null,
        message: null,
        response: null,
        error: false,
      };
    },
    async openWhatsappPanel() {
      this.whatsappPanelOpen = true;
      this.whatsappQrExpired = false;
      this.whatsappStatus = {
        ...this.whatsappStatus,
        error: false,
        message: 'Loading WhatsApp status...',
      };
      // Cek status dulu: jika sudah terhubung atau session ada (registered),
      // jangan buat socket pairing baru (hancurkan sesi lama).
      const statusRes = await getWhatsappStatus();
      const status =
        (statusRes && !statusRes.error && statusRes.data?.[0]) || null;
      if (status && status.connected) {
        this.whatsappQrExpired = false;
        this.whatsappQrIssuedAt = null;
        this.whatsappStatus = {
          ...this.whatsappStatus,
          qr_base64: null,
          connected: true,
          error: false,
          message: 'WhatsApp terhubung.',
        };
        return;
      }
      // Session exists (pairing sudah pernah dilakukan, registered:true) tapi
      // belum connected → jangan refresh QR, polling saja menunggu reconnect.
      if (status && status.session_exists && status.paired) {
        this.whatsappStatus = {
          ...this.whatsappStatus,
          qr_base64: null,
          connected: false,
          error: false,
          message: 'Menunggu kembali keterangan WhatsApp...',
        };
        this.startWhatsappPolling();
        return;
      }
      // Baru buat socket pairing jika belum ada session atau registered:false.
      await this.loadWhatsapp(true);
    },
    closeWhatsappPanel() {
      this.stopWhatsappPolling();
      this.whatsappPanelOpen = false;
      this.whatsappQrExpired = false;
      this.whatsappQrIssuedAt = null;
      this.whatsappStatus = {
        ...this.whatsappStatus,
        error: false,
        qr_base64: null,
        connected: false,
        message: null,
      };
    },
    async loadWhatsapp(refresh = false) {
      if (this.whatsappQrRequesting) {
        return;
      }
      this.whatsappQrRequesting = true;
      try {
        let _res = await getWhatsappQr(refresh);
        if (_res && _res.error) {
          this.stopWhatsappPolling();
          // Endpoint /qr pada core mengembalikan error saat sesi sudah terhubung
          // atau QR kedaluwarsa, jadi status dipakai untuk membedakan keduanya.
          const statusRes = await getWhatsappStatus();
          const status =
            (statusRes && !statusRes.error && statusRes.data?.[0]) || null;
          if (status && status.connected) {
            this.whatsappQrExpired = false;
            this.whatsappQrIssuedAt = null;
            this.whatsappStatus = {
              ...this.whatsappStatus,
              qr_base64: null,
              connected: true,
              error: false,
              message: 'WhatsApp terhubung.',
            };
            return;
          }
          const expired = !!(status && status.qr_expired);
          this.whatsappQrExpired = expired;
          this.whatsappStatus = {
            ...this.whatsappStatus,
            qr_base64: null,
            connected: false,
            error: !expired,
            message: _res.message,
          };
          // Session bisa tetap hidup walau QR tidak tersedia (mis. pairing
          // baru diterima). Terus pantau sampai connected/expired.
          if (!expired && this.whatsappPanelOpen) {
            this.startWhatsappPolling();
          }
        } else if (_res && !_res.error) {
          const row = _res.data?.[0] || {};
          const qrBase64 = row.qr_base64 || null;
          const issuedAt = Number(row.qr_issued_at) || null;
          if (row.qr_ttl) {
            this.whatsappQrTtl = Number(row.qr_ttl) || 60000;
          }
          this.whatsappQrExpired = false;
          if (qrBase64) {
            // Masa berlaku dihitung dari waktu QR diterbitkan backend, bukan
            // dari waktu gambar diterima frontend.
            this.whatsappQrIssuedAt = issuedAt || Date.now();
          }
          this.whatsappStatus = {
            ...this.whatsappStatus,
            qr_base64: qrBase64,
            connected: !!row.connected,
            error: !qrBase64,
            message: qrBase64
              ? 'Scan the QR code with WhatsApp to connect.'
              : _res.message || 'Waiting for WhatsApp QR...',
          };
          if (row.connected) {
            this.stopWhatsappPolling();
          } else if (qrBase64) {
            this.startWhatsappPolling();
          }
        }
      } finally {
        this.whatsappQrRequesting = false;
      }
    },
    // QR Baileys dirotasi backend setiap qr_ttl. Polling ini memantau koneksi
    // sekaligus mengambil gambar QR terbaru saat backend merotasi kode, supaya
    // user tidak memindai QR yang sudah mati ("Couldn't link devices").
    startWhatsappPolling() {
      if (this.whatsappPolling) {
        return;
      }
      this.whatsappPolling = setInterval(async () => {
        if (!this.whatsappPanelOpen) {
          this.stopWhatsappPolling();
          return;
        }
        const _res = await getWhatsappStatus();
        const status = (_res && !_res.error && _res.data?.[0]) || null;
        if (!status) {
          return;
        }
        if (status.connected) {
          this.whatsappQrExpired = false;
          this.whatsappQrIssuedAt = null;
          this.whatsappStatus = {
            ...this.whatsappStatus,
            connected: true,
            qr_base64: null,
            error: false,
            message: 'WhatsApp terhubung.',
          };
          this.stopWhatsappPolling();
          return;
        }
        if (status.qr_expired) {
          this.whatsappQrExpired = true;
          this.whatsappQrIssuedAt = null;
          this.stopWhatsappPolling();
          return;
        }
        if (status.qr_ttl) {
          this.whatsappQrTtl = Number(status.qr_ttl) || 60000;
        }
        const issuedAt = Number(status.qr_issued_at) || null;
        const needsNewQr = issuedAt
          ? issuedAt !== this.whatsappQrIssuedAt
          : !!this.whatsappQrIssuedAt;
        if (
          needsNewQr &&
          Date.now() - this.whatsappLastQrRefreshAt > 10000
        ) {
          this.whatsappLastQrRefreshAt = Date.now();
          await this.loadWhatsapp();
          if (this.whatsappQrExpired) {
            return;
          }
        }
        if (
          this.whatsappQrIssuedAt &&
          Date.now() - this.whatsappQrIssuedAt > this.whatsappQrTtl - 5000
        ) {
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
      if (!this.whatsappPanelOpen) {
        return;
      }
      this.stopWhatsappPolling();
      this.whatsappQrExpired = false;
      this.whatsappQrIssuedAt = null;
      this.whatsappStatus = {
        ...this.whatsappStatus,
        qr_base64: null,
        message: 'Loading new QR...',
      };
      // refresh=true membuang socket pairing lama supaya ref QR benar-benar
      // baru; ref lama yang sudah dipakai/kedaluwarsa ditolak WhatsApp.
      await this.loadWhatsapp(true);
    },
  },
};
</script>

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
              <template v-else-if="formData.code !== 'default'">
                <!-- Channel API — default (Baileys) tidak memakai API Key -->
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

                <!-- Pemanasan nomor: kuota naik bertahap sejak nomor terhubung -->
                <div v-if="warmupVisible" class="warmup-panel">
                  <div class="warmup-head">
                    <div class="warmup-icon" :class="{ done: channelStatus.warmup_complete }">
                      <svg
                        v-if="channelStatus.warmup_complete"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="3 17 9 11 13 15 21 7" />
                        <polyline points="15 7 21 7 21 13" />
                      </svg>
                    </div>
                    <div class="warmup-heading">
                      <div class="warmup-title">Pemanasan Nomor WhatsApp</div>
                      <div class="warmup-sub">
                        <template v-if="channelStatus.warmup_complete">
                          Kuota maksimal {{ channelStatus.daily_limit || 0 }} pesan/hari sudah aktif
                        </template>
                        <template v-else>
                          Kuota harian naik bertahap sejak nomor terhubung
                        </template>
                      </div>
                    </div>
                    <div class="warmup-chip" :class="{ done: channelStatus.warmup_complete }">
                      <template v-if="channelStatus.warmup_complete">Selesai</template>
                      <template v-else>Hari {{ channelStatus.warmup_day }}/{{ warmupTotal }}</template>
                    </div>
                  </div>
                  <div class="warmup-track">
                    <div
                      class="warmup-fill"
                      :class="{ done: channelStatus.warmup_complete }"
                      :style="{ width: warmupPercent + '%' }"
                    ></div>
                  </div>
                  <div class="warmup-meta">
                    <span>
                      Kuota hari ini
                      <strong>{{ channelStatus.daily_used || 0 }}/{{ channelStatus.daily_limit || 0 }}</strong>
                      pesan
                    </span>
                    <span v-if="!channelStatus.warmup_complete">
                      Sisa <strong>{{ channelStatus.warmup_days_remaining || 0 }}</strong> hari
                    </span>
                    <span v-else class="warmup-done-text">Pemanasan selesai</span>
                  </div>
                </div>

                <div v-if="formData.status === 'Active'">
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
                <small v-else class="text-muted">
                  Channel Inactive — aktifkan Status lalu simpan untuk
                  menghubungkan WhatsApp.
                </small>
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
  getNotificationChannelStatus,
  updateNotificationChannel,
  testNotificationChannelConnection,
  sendTestNotificationChannel,
} from '../../../resource/NotificationChannel';
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
      whatsappStatus: { error: false, message: null, qr_base64: null },
      // Status channel default: kuota anti-ban + pemanasan nomor.
      channelStatus: null,
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
  computed: {
    // Panel pemanasan hanya muncul kalau backend sudah mencatat nomor aktif.
    warmupVisible() {
      return !!(this.channelStatus && this.channelStatus.warmup_started_on);
    },
    // Hari berjalan + sisa hari = total hari pemanasan (mis. 3 + 16 = 19).
    warmupTotal() {
      if (!this.channelStatus) return 0;
      return (
        Number(this.channelStatus.warmup_day || 0) +
        Number(this.channelStatus.warmup_days_remaining || 0)
      );
    },
    warmupPercent() {
      if (!this.channelStatus) return 0;
      if (this.channelStatus.warmup_complete) return 100;
      if (!this.warmupTotal) return 0;
      return Math.min(
        100,
        Math.round(
          (Number(this.channelStatus.warmup_day || 0) / this.warmupTotal) * 100,
        ),
      );
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
      let _res = await getNotificationChannel({ id: this.$route.params.id });
      if (_res) {
        this.formData = _res.data[0];
        if (this.formData.code === 'kirimi') {
          this.parseKirimiCredentials();
        }
        if (this.formData.code === 'default' && this.formData.status === 'Active') {
          this.loadChannelStatus();
          await this.loadWhatsapp();
        }
      }
    },
    async loadChannelStatus() {
      if (this.formData.code !== 'default') return;
      const _res = await getNotificationChannelStatus('default');
      if (!_res || _res.error) return;
      this.channelStatus = (_res.data && _res.data[0]) || null;
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
      // Kuota/pemanasan bisa berubah setelah pengecekan (nomor baru terhubung).
      if (this.formData.code === 'default') this.loadChannelStatus();
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
      // Pesan yang benar-benar terkirim ikut memakai kuota hari ini.
      if (this.formData.code === 'default') this.loadChannelStatus();
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
      if (this.formData.status === 'Active') {
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
          // Nomor baru terhubung → pemanasan mulai; ambil state terbarunya.
          this.loadChannelStatus();
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

<style scoped>
.warmup-panel {
  background: linear-gradient(135deg, #fbf9ff 0%, #f2ecfb 100%);
  border: 1px solid #e9e1f8;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.warmup-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.warmup-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, #7c5cd6 0%, #553b9c 100%);
  box-shadow: 0 4px 10px rgba(85, 59, 156, 0.28);
}
.warmup-icon svg {
  width: 18px;
  height: 18px;
}
.warmup-icon.done {
  background: linear-gradient(135deg, #4ac98c 0%, #2f9e69 100%);
  box-shadow: 0 4px 10px rgba(47, 158, 105, 0.26);
}
.warmup-heading {
  flex: 1;
  min-width: 0;
}
.warmup-title {
  font-weight: 700;
  color: #3d2d63;
  font-size: 0.92rem;
}
.warmup-sub {
  color: #8b83a3;
  font-size: 0.76rem;
  margin-top: 1px;
}
.warmup-chip {
  flex: 0 0 auto;
  font-size: 0.74rem;
  font-weight: 700;
  color: #553b9c;
  background: #ede7fb;
  border-radius: 999px;
  padding: 5px 10px;
  white-space: nowrap;
}
.warmup-chip.done {
  color: #2f9e69;
  background: #e3f7ec;
}
.warmup-track {
  height: 10px;
  border-radius: 999px;
  background: #e8e2f5;
  margin-top: 12px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(61, 45, 99, 0.14);
}
.warmup-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #8b6fd8 0%, #553b9c 100%);
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.warmup-fill.done {
  background: linear-gradient(90deg, #6ee7a8 0%, #2f9e69 100%);
}
.warmup-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  color: #7d7594;
  font-size: 0.76rem;
}
.warmup-meta strong {
  color: #3d2d63;
}
.warmup-done-text {
  color: #2f9e69;
  font-weight: 600;
}
@media (max-width: 576px) {
  .warmup-head {
    align-items: flex-start;
  }
  .warmup-chip {
    margin-top: 2px;
  }
}
</style>

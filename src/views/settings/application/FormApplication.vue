<template>
  <div>
    <CRow>
      <CCol col="12">
        <CCard>
          <CCardHeader>
            <strong>Pengaturan Aplikasi</strong>
            <small class="text-muted ml-2">
              Konfigurasi khusus tenant
              <span v-if="subdomain">({{ subdomain }})</span>
            </small>
          </CCardHeader>
          <CCardBody>
            <CForm v-if="!loading">
              <CRow class="mt-2">
                <CCol md="3"> Logo Aplikasi </CCol>
                <CCol md="6">
                  <div class="d-flex align-items-center">
                    <div class="mr-3" style="width: 80px; height: 80px; border: 1px solid #dee2e6; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
                      <img v-if="form.logo_path" :src="form.logo_path" alt="Logo" style="max-width: 100%; max-height: 100%;" />
                      <span v-else class="text-muted small">Belum ada logo</span>
                    </div>
                    <div>
                      <CInput type="file" @change="onLogoChange" accept="image/*" />
                      <small class="form-text text-muted d-block mt-1">PNG/JPG, max 500KB. Disimpan sebagai base64.</small>
                    </div>
                  </div>
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Nama Identitas </CCol>
                <CCol md="6">
                  <CInput v-model="form.identity_name" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> NPWP / Nomor Identitas </CCol>
                <CCol md="6">
                  <CInput v-model="form.identity_number" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Telepon </CCol>
                <CCol md="6">
                  <CInput v-model="form.identity_phone" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Alamat </CCol>
                <CCol md="6">
                  <CTextarea v-model="form.identity_address" rows="3" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Kode Telepon Negara </CCol>
                <CCol md="6">
                  <CInput v-model="form.country_code" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Negara </CCol>
                <CCol md="6">
                  <CInput v-model="form.country" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Mata Uang </CCol>
                <CCol md="6">
                  <CInput v-model="form.currency" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Satuan Harga </CCol>
                <CCol md="6">
                  <CInput v-model="form.price_unit_code" />
                </CCol>
              </CRow>
              <CRow class="mt-2">
                <CCol md="3"> Notifikasi WhatsApp </CCol>
                <CCol md="6">
                  <CSwitch
                    :checked="form.notification_whatsapp"
                    @update:checked="form.notification_whatsapp = $event"
                    shape="pill"
                    color="success"
                  />
                </CCol>
              </CRow>
            </CForm>
            <div v-else class="text-center p-4">Memuat...</div>
          </CCardBody>
          <CCardFooter>
            <CButton
              size="sm"
              color="success"
              class="float-right ml-2"
              :disabled="saving || loading"
              @click="save"
            >
              {{ saving ? 'Menyimpan...' : 'Save' }}
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  getTenantSelfConfig,
  updateTenantSelfConfig,
  uploadTenantLogo,
} from '../../../resource/TenantSelfConfig';
import { getTenantInfo } from '../../../utils';

export default {
  name: 'TenantApplicationSetting',
  data() {
    return {
      loading: true,
      saving: false,
      subdomain: '',
      logoFile: null,
      form: {
        identity_name: '',
        identity_number: '',
        identity_phone: '',
        identity_address: '',
        country: '',
        country_code: '',
        currency: '',
        price_unit_code: '',
        notification_whatsapp: false,
        logo_path: '',
      },
    };
  },
  mounted() {
    const info = getTenantInfo();
    this.subdomain = (info && info.subdomain) || '';
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      let res = await getTenantSelfConfig();
      this.loading = false;
      const row = res && res.data && res.data[0];
      if (res && res.error) {
        this.$toast.open({
          message: res.message || 'Gagal memuat pengaturan aplikasi',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      if (row) {
        this.form = {
          identity_name: row.identity_name || '',
          identity_number: row.identity_number || '',
          identity_phone: row.identity_phone || '',
          identity_address: row.identity_address || '',
          country: row.country || '',
          country_code: row.country_code || '',
          currency: row.currency || '',
          price_unit_code: row.price_unit_code || '',
          notification_whatsapp: !!row.notification_whatsapp,
          logo_path: row.logo_path || '',
        };
      }
    },
    onLogoChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      // Validasi ukuran (500KB) dan tipe
      if (file.size > 500 * 1024) {
        this.$toast.open({ message: 'File terlalu besar (max 500KB)', type: 'error', position: 'top-right', duration: 3000 });
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.$toast.open({ message: 'Hanya file gambar (PNG/JPG)', type: 'error', position: 'top-right', duration: 3000 });
        return;
      }
      this.logoFile = file;
      // Preview langsung
      const reader = new FileReader();
      reader.onload = (ev) => { this.form.logo_path = ev.target.result; };
      reader.readAsDataURL(file);
    },
    async save() {
      this.saving = true;
      // Upload logo dulu kalau ada file baru
      if (this.logoFile) {
        const up = await uploadTenantLogo(this.logoFile);
        if (up && up.error) {
          this.saving = false;
          this.$toast.open({ message: up.message || 'Gagal upload logo', type: 'error', position: 'top-right', duration: 5000 });
          return;
        }
        // Response BE should include updated logo_path; kalau tidak, preview sudah di form
      }
      let res = await updateTenantSelfConfig({ ...this.form });
      this.saving = false;
      if (res && !res.error && res.data && res.data[0]) {
        // Update logo_path dari response kalau dikembalikan
        this.form.logo_path = res.data[0].logo_path || this.form.logo_path;
      }
      this.$toast.open({
        message:
          res && !res.error
            ? 'Data berhasil disimpan'
            : (res && res.message) || 'Gagal menyimpan',
        type: res && !res.error ? 'success' : 'error',
        position: 'top-right',
        duration: 5000,
      });
      this.logoFile = null;
    },
  },
};
</script>

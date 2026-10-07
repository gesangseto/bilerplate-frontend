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
} from '../../../resource/TenantSelfConfig';
import { getTenantInfo } from '../../../utils';

export default {
  name: 'TenantApplicationSetting',
  data() {
    return {
      loading: true,
      saving: false,
      subdomain: '',
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
        };
      }
    },
    async save() {
      this.saving = true;
      let res = await updateTenantSelfConfig({ ...this.form });
      this.saving = false;
      this.$toast.open({
        message:
          res && !res.error
            ? 'Data berhasil disimpan'
            : (res && res.message) || 'Gagal menyimpan',
        type: res && !res.error ? 'success' : 'error',
        position: 'top-right',
        duration: 5000,
      });
    },
  },
};
</script>

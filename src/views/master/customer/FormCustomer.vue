<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>{{ $activeMenu.name }} [{{ route_action }}]</h5>
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
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  required
                  title="Name"
                  placeholder="Enter customer name"
                  v-model="formData.name"
                  :is-valid="initial_load ? null : formData.name ? true : false"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  required
                  title="PIC Name"
                  placeholder="Enter customer PIC name"
                  v-model="formData.pic"
                  :is-valid="initial_load ? null : formData.pic ? true : false"
                />
              </CCol>
              <CCol sm="12">
                <TextareaDefault
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  required
                  title="Address"
                  placeholder="Enter customer address"
                  v-model="formData.address"
                  :is-valid="
                    initial_load ? null : formData.address ? true : false
                  "
                />
              </CCol>

              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  required
                  title="Phone Number"
                  validasi="numeric"
                  v-model="formData.phone"
                  :max="12"
                  :is-valid="checkPrimaryPhone()"
                  :invalid_feedback="'Please provide valid phone number (7-12 digits)'"
                  placeholder="Enter phone number (Example : 81211223344)"
                >
                  <template #prepend>
                    <div style="width: 350px; margin-bottom: -50px">
                      <SelectOption
                        :disabled="action == 'Read' ? true : false"
                        required
                        :options="CountryCode"
                        v-on:onchange="handlePhoneCodeChange($event)"
                        :value="formData.phone_code"
                        :is-valid="
                          initial_load
                            ? null
                            : !formData.phone_code
                            ? false
                            : true
                        "
                      />
                    </div>
                  </template>
                </InputDefault>
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  validasi="email"
                  title="Email"
                  placeholder="email.address@email.com"
                  v-model="formData.email"
                  :is-valid="initial_load ? null : checkEmail(formData.email)"
                  :invalid_feedback="
                    formData.email ? 'Please provide valid email address' : null
                  "
                />
              </CCol>

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"> Status </CCol>
                  <SwitchStatusMaster
                    :disabled="action == 'Read'"
                    :show_label="true"
                    :default_value="formData.status"
                    v-on:onChange="formData.status = $event"
                  />
                </CRow>
              </CCol>
            </CForm>
            <Metadata
              :defaultMetadata="formData.metadata"
              v-on:handleChange="
                (formData.metadata = $event.result),
                  (formData.error_metadata = $event.error_metadata)
              "
              model="mst_customer"
            />
          </CCardBody>

          <CCardFooter>
            <div class="float-left">
              <CButton
                v-if="action != 'Read'"
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
import {
  capitalizeFirstLetter,
  isPhone,
  coutryCode,
  isEmail,
  handleBack,
} from '../../../utils';
import {
  getMstCustomer,
  insertMstCustomer,
  updateMstCustomer,
} from '../../../resource/MstCustomer';
// import { CheckPhone, SetPhone } from "../../../CustomJs";

export default {
  name: 'Forms',
  watch: {},
  mounted() {
    this.reformatCountryCode();
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: {
        status: 'Active',
        phone_code: null,
        phone: null,
      },
      CountryCode: coutryCode(),
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    };
  },
  validations: {},
  methods: {
    checkEmail(val) {
      return isEmail(val);
    },
    checkPhone(val) {
      return isPhone(val);
    },
    normalizePhoneDigits(val) {
      let digits = String(val || '').replace(/\D/g, '');
      if (!digits) return '';
      if (digits.startsWith('00')) digits = digits.replace(/^0+/, '');
      if (digits.startsWith('0')) return `62${digits.slice(1)}`;
      if (digits.startsWith('8')) return `62${digits}`;
      return digits;
    },
    reformatCountryCode() {
      let list = this.CountryCode;
      this.CountryCode = [];
      for (const it of list) {
        if (it.value) {
          this.CountryCode.push({
            value: it.value,
            label: `(${it.value}) ${it.label}`,
          });
        } else {
          this.CountryCode.push({
            value: it.value,
            label: `${it.label}`,
          });
        }
      }
    },
    // Pisah nomor tersimpan ('+62...' / '62-...') menjadi country code + lokal.
    splitPhone(value) {
      const raw = String(value).trim();
      const digits = raw.replace(/\D/g, '');
      const codes = (this.CountryCode || [])
        .map((c) => ({
          code: c.value,
          digits: String(c.value).replace(/\D/g, ''),
        }))
        .filter((c) => c.digits)
        .sort((a, b) => b.digits.length - a.digits.length);
      for (const c of codes) {
        if (digits.startsWith(c.digits)) {
          return { code: c.code, local: digits.slice(c.digits.length) };
        }
      }
      // Fallback: pakai '+62' bila tidak ada kode yang cocok.
      if (digits.startsWith('62')) {
        return { code: '+62', local: digits.slice(2) };
      }
      return { code: '+62', local: digits };
    },
    handlePhoneCodeChange($value) {
      this.formData.phone_code = $value;
      this.$forceUpdate();
    },
    async loadData() {
      let res = await getMstCustomer({ id: this.$route.params.id });
      if (res) {
        let data = res.data[0];
        this.formData = data;
        // API mengembalikan kolom `phone` (format '+62...').
        // Pisah kembali menjadi country code + nomor lokal untuk form.
        if (data.phone) {
          const parsed = this.splitPhone(data.phone);
          this.formData.phone_code = parsed.code;
          this.formData.phone = parsed.local;
        }
      }
    },
    checkPrimaryPhone() {
      if (this.initial_load) return null;
      if (!this.formData.phone_code) return false;
      return this.checkPhone(this.formData.phone);
    },
    valid() {
      if (!this.formData.name) {
        return false;
      } else if (!this.formData.pic) {
        return false;
      } else if (!this.formData.address) {
        return false;
      } else if (this.checkPrimaryPhone() === false) {
        return false;
      } else if (this.formData.error_metadata) {
        return false;
      }
      return true;
    },
    async save() {
      this.initial_load = false;
      if (!this.valid()) {
        this.$toast.open({
          message: 'Please input all the required data',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let dataPost = JSON.parse(JSON.stringify(this.formData));
      // Gabungkan country code + nomor lokal menjadi satu nilai, lalu buang
      // field bantu yang tidak dikenal backend. Awalan 0 pada nomor lokal
      // dibuang agar tidak menghasilkan '+620...'.
      if (dataPost.phone && dataPost.phone_code) {
        const local = String(dataPost.phone).replace(/^0+/, '');
        dataPost.phone = `${dataPost.phone_code}-${local}`;
      }
      delete dataPost.phone_code;
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = {};
        if (dataPost.id) {
          res = await updateMstCustomer(dataPost);
        } else {
          res = await insertMstCustomer(dataPost);
        }
        this.$isLoading(false);
        this.$toast.open({
          message: res['error']
            ? `${res['message']}`
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
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
  },
};
</script>

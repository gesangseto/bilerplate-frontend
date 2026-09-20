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
                  v-model="formData.phone"
                  :max="18"
                  :is-valid="checkPrimaryPhone()"
                  :invalid_feedback="'Please provide valid phone number (7-15 digits)'"
                  placeholder="Contoh: 08123456780 atau +628123456780"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  title="Alternative Phone Number"
                  v-model="formData.phone_alt"
                  :max="18"
                  :is-valid="checkAltPhone()"
                  :invalid_feedback="'Please provide valid phone number (7-15 digits)'"
                  placeholder="Contoh: 08123456780 atau +628123456780"
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  required
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
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { capitalizeFirstLetter, isEmail, handleBack } from '../../../utils';
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
        phone: null,
      },
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
    checkPhoneValid(val) {
      if (!val) return false;
      const digits = String(val).replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    },
    normalizePhoneDigits(val) {
      let digits = String(val || '').replace(/\D/g, '');
      if (!digits) return '';
      if (digits.startsWith('00')) digits = digits.replace(/^0+/, '');
      if (digits.startsWith('0')) return `62${digits.slice(1)}`;
      if (digits.startsWith('8')) return `62${digits}`;
      return digits;
    },
    async loadData() {
      let res = await getMstCustomer({ id: this.$route.params.id });
      if (res) {
        let data = res.data[0];
        this.formData = data;
      }
    },
    checkPrimaryPhone() {
      if (this.initial_load) return null;
      return this.checkPhoneValid(this.formData.phone);
    },
    checkAltPhone() {
      if (this.initial_load) return null;
      if (!this.formData.phone_alt) return null;
      return this.checkPhoneValid(this.formData.phone_alt);
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
      } else if (this.checkAltPhone() === false) {
        return false;
      } else if (!this.formData.email || !isEmail(this.formData.email)) {
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
      } else if (
        this.formData.phone &&
        this.formData.phone_alt &&
        this.normalizePhoneDigits(this.formData.phone) ===
          this.normalizePhoneDigits(this.formData.phone_alt)
      ) {
        this.$toast.open({
          message:
            ' Primary Phone Number and Alternative Phone Number must be different.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let dataPost = JSON.parse(JSON.stringify(this.formData));
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

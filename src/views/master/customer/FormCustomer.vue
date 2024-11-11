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
                  v-model="formData.tlp"
                  :max="12"
                  :is-valid="initial_load ? null : checkPhone(formData.tlp)"
                  :invalid_feedback="'Please provide 7-12 digits phone number'"
                  placeholder="Enter phone number (Example : 81211223344)"
                >
                  <template #prepend>
                    <div style="width: 350px; margin-bottom: -50px">
                      <SelectOption
                        :disabled="action == 'Read' ? true : false"
                        required
                        :options="CountryCode"
                        v-on:onchange="handleChangeInput($event)"
                        :value="formData.tlp_code"
                        :is-valid="
                          initial_load ? null : formData.tlp_code ? true : false
                        "
                        :invalid_feedback="
                          checkPhone(formData.tlp) ? null : '   '
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
                  title="Alternative Phone Number"
                  validasi="numeric"
                  v-model="formData.tlp_alt"
                  :max="12"
                  :is-valid="
                    initial_load
                      ? null
                      : formData.tlp_alt_code && !checkPhone(formData.tlp_alt)
                      ? false
                      : true
                  "
                  :invalid_feedback="
                    formData.tlp_alt_code
                      ? 'Please provide 7-12 digits phone number'
                      : null
                  "
                  placeholder="Enter phone number (Example : 81211223344)"
                >
                  <template #prepend>
                    <div style="width: 350px; margin-bottom: -50px">
                      <SelectOption
                        :disabled="action == 'Read' ? true : false"
                        :options="CountryCode"
                        v-on:onchange="handleChangeInput($event, 'alt_code')"
                        :value="formData.tlp_alt_code"
                      />
                    </div>
                  </template>
                </InputDefault>
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
                <InputDefault
                  :disabled="action == 'Read' ? true : false"
                  :col="[3, 9]"
                  optional
                  :validasi="'integer'"
                  title="ID Sarana (BPOM)"
                  placeholder="Enter ID sarana"
                  v-model="formData.id_sarana"
                  :is-valid="
                    initial_load ? null : formData.id_sarana ? true : null
                  "
                >
                  <template #description>
                    <p style="font-size: x-small">
                      <span>
                        <strong>WARNING: </strong>
                      </span>
                      If the ID Sarana (BPOM) is blank, system will not generate
                      distribution BPOM report (Queue BPOM) in both .xlsx file
                      format nor reporting to BPOM TTAC server via API for any
                      completed Picking List transaction involving this
                      customer.
                    </p>
                  </template>
                </InputDefault>
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
            <CButton type="submit" size="sm" color="primary" @click="save()">
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
import {
  coutryCode,
  isPhone,
  capitalizeFirstLetter,
  onlyNumber,
  isEmail,
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
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
    this.reformatCountryCode();
  },
  data() {
    return {
      initial_load: true,
      route_action: '',
      action: 'Edit',
      formData: {
        status: 'Active',
        tlp_code: null,
        tlp: null,
      },
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],

      CountryCode: coutryCode(),
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
    limitPhone({ event, data, max }) {
      onlyNumber({ event, data, max });
    },
    checkValidEmail(email) {
      return isEmail(email);
    },
    checkValidPhone(item) {
      return isPhone(item);
    },
    handleChangeInput($value, code) {
      if (code == 'alt_code') {
        this.formData.tlp_alt_code = $value;
      } else {
        this.formData.tlp_code = $value;
      }
      this.$forceUpdate(); // Memaksa update komponen
    },
    async loadData() {
      let res = await getMstCustomer({ id: this.$route.params.id });
      if (res) {
        let data = res.data[0];
        this.formData = data;
        let tlp = '';
        if (data.tlp) {
          tlp = data.tlp.split('-');
          this.formData.tlp_code = tlp[0];
          this.formData.tlp = tlp[1];
        }
        if (data.tlp_alt) {
          tlp = data.tlp_alt.split('-');
          this.formData.tlp_alt_code = tlp[0];
          this.formData.tlp_alt = tlp[1];
        }
      }
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
        }
      }
    },
    valid() {
      if (!this.formData.name) {
        return false;
      } else if (!this.formData.pic) {
        return false;
      } else if (!this.formData.address) {
        return false;
      } else if (!this.formData.tlp_code) {
        return false;
      } else if (!this.formData.tlp || !isPhone(this.formData.tlp)) {
        return false;
      } else if (
        this.formData.tlp_alt_code &&
        !isPhone(this.formData.tlp_alt)
      ) {
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
      }
      let _form_data = JSON.parse(JSON.stringify(this.formData));

      let dataPost = JSON.parse(JSON.stringify(this.formData));

      if (_form_data.tlp && _form_data.tlp_code) {
        dataPost.tlp = `${_form_data.tlp_code.toString()}-${_form_data.tlp.toString()}`;
      }
      if (_form_data.tlp_alt && _form_data.tlp_alt_code) {
        dataPost.tlp_alt = `${_form_data.tlp_alt_code.toString()}-${_form_data.tlp_alt.toString()}`;
      }
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
            : 'Data has been saved succesfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res['error']) this.$router.back();
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>

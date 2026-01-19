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
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
                  required
                  :col="[3, 9]"
                  title="Global ID"
                  placeholder="Enter Global ID"
                  v-model="formData.employee_id"
                  :is-valid="
                    initial_load ? null : formData.employee_id ? true : false
                  "
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
                  :col="[3, 9]"
                  required
                  title="Username"
                  placeholder="Enter username"
                  v-model="formData.username"
                  :is-valid="
                    initial_load ? null : formData.username ? true : false
                  "
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
                  :col="[3, 9]"
                  required
                  title="Full Name"
                  placeholder="Enter full name"
                  v-model="formData.full_name"
                  :is-valid="
                    initial_load ? null : formData.full_name ? true : false
                  "
                />
              </CCol>
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
                  :col="[3, 9]"
                  required
                  title="Phone Number"
                  validasi="numeric"
                  v-model="formData.tlp"
                  :max="12"
                  :is-valid="initial_load ? null : checkPhone(formData.tlp)"
                  :invalid_feedback="required.tlp.message"
                  placeholder="Enter phone number (Example : 81211223344)"
                >
                  <template #prepend>
                    <div style="width: 350px; margin-bottom: -50px">
                      <SelectOption
                        :disabled="
                          action == 'Read' || formData.is_sys ? true : false
                        "
                        required
                        :options="CountryCode"
                        v-on:onchange="handleChangeInput($event)"
                        :value="formData.tlp_code"
                        :is-valid="
                          initial_load
                            ? null
                            : !formData.tlp_code
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
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
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
              <!-- 
              <CCol sm="12">
                <InputDefault
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
                  :col="[3, 9]"
                  :required="action == 'Create' ? true : false"
                  :type="showPassword == false ? 'password' : 'text'"
                  title="Password"
                  v-model="formData.pwd"
                  :is-valid="
                    initial_load
                      ? null
                      : !formData.pwd && action !== 'Create'
                      ? null
                      : !needPassword && !required.pwd.error
                  "
                  :invalid_feedback="required.pwd.message"
                  :placeholder="
                    action === 'Update'
                      ? `Leave it blank if you don't want to change password.`
                      : action === 'Read'
                      ? '<hidden>'
                      : 'Enter password'
                  "
                >
                  <template #append>
                    <CButton @click="showPassword = !showPassword">
                      <v-icon v-if="!showPassword" name="eye-slash" />
                      <v-icon v-if="showPassword" name="eye" />
                    </CButton>
                  </template>
                </InputDefault>
              </CCol>
              <CCol sm="12" v-if="action != 'Read'">
                <InputDefault
                  :disabled="action == 'Read' || formData.is_sys"
                  :col="[3, 9]"
                  :type="showPassword == false ? 'password' : 'text'"
                  title="Confirm Password"
                  v-model="formData.re_pwd"
                  :is-valid="
                    formData.re_pwd || formData.pwd
                      ? formData.re_pwd == formData.pwd
                      : null
                  "
                  :invalid_feedback="'Confirmation password does not match'"
                  :placeholder="
                    action === 'Update'
                      ? `Re-enter the same new password. Leave it blank if you don't want to change password.`
                      : action === 'Read'
                      ? '<hidden>'
                      : 'Enter confirm password'
                  "
                />
              </CCol>
               -->

              <CCol sm="12">
                <SelectOption
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
                  :col="[3, 9]"
                  title="Department"
                  required
                  :options="departmentOptions"
                  v-on:onchange="formData.mst_department_id = $event"
                  :value="formData.mst_department_id"
                  :isValid="
                    initial_load
                      ? null
                      : formData.mst_department_id
                      ? true
                      : false
                  "
                />
              </CCol>
              <CCol sm="12">
                <SelectOption
                  :disabled="action == 'Read' || formData.is_sys ? true : false"
                  :col="[3, 9]"
                  title="Section"
                  required
                  :options="optionSections"
                  v-on:onchange="formData.mst_section_id = $event"
                  :value="formData.mst_section_id"
                  :isValid="
                    initial_load ? null : formData.mst_section_id ? true : false
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

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"
                    >Avatar
                    <span class="text-danger"><strong>*</strong></span></CCol
                  >
                  <CCol sm="9">
                    <CRow
                      class="form-group"
                      v-if="action == 'Read' || formData.is_sys"
                    >
                      <CCol sm="12">
                        <CRow class="justify-content-left">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              :src="
                                require(`../../../../public/img/avatars/${formData.mst_avatar_id}.png`)
                              "
                            />
                          </label>
                        </CRow>
                      </CCol>
                    </CRow>
                    <CRow class="form-group" v-if="action != 'Read'">
                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/1.png"
                            />
                            <CInputRadioGroup
                              id="avatar"
                              name="inlineRadioOptions"
                              style="margin-left: 18px"
                              :options="[{ value: '1' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>

                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/2.png"
                            />
                            <CInputRadioGroup
                              id="avatar"
                              style="margin-left: 18px"
                              :options="[{ value: '2' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>

                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/3.png" />
                            <CInputRadioGroup
                              id="avatar"
                              style="margin-left: 18px"
                              :options="[{ value: '3' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                          /></label>
                        </CRow>
                      </CCol>
                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/4.png"
                            />
                            <CInputRadioGroup
                              id="avatar"
                              style="margin-left: 18px"
                              :options="[{ value: '4' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow
                      class="form-group"
                      style="margin-top: 30px"
                      v-if="action != 'Read'"
                    >
                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/5.png"
                            />
                            <CInputRadioGroup
                              id="avatar"
                              style="margin-left: 18px"
                              :options="[{ value: '5' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>

                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/6.png"
                            />
                            <CInputRadioGroup
                              id="avatar"
                              style="margin-left: 18px"
                              :options="[{ value: '6' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>

                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/7.png"
                            />
                            <CInputRadioGroup
                              id="avatar"
                              style="margin-left: 18px"
                              :options="[{ value: '7' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>
                      <CCol sm="3">
                        <CRow class="justify-content-center">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              src="../../../../public/img/avatars/8.png"
                            />
                            <CInputRadioGroup
                              id="avatar"
                              style="margin-left: 18px"
                              :options="[{ value: '8' }]"
                              :inline="false"
                              :checked.sync="formData.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CCol>
            </CForm>
            <Metadata
              :defaultMetadata="formData.metadata"
              v-on:handleChange="
                (formData.metadata = $event.result),
                  (formData.error_metadata = $event.error_metadata)
              "
              model="mst_user"
            />
          </CCardBody>
          <CCardFooter>
            <CButton
              v-if="action == 'Read' || formData.is_sys ? false : true"
              type="submit"
              size="sm"
              color="primary"
              @click="save()"
            >
              <CIcon name="cil-check-circle" />
              Submit
            </CButton>
            <ButtonBack />
            <CButton
              type="submit"
              size="sm"
              class="float-right"
              color="warning"
              title="Reset Password "
              @click="resetPassword()"
            >
              <CIcon name="cil-sync" />
              Reset Password
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { notEmail } from '../../../validator';
import 'vue-select/dist/vue-select.css';
import {
  capitalizeFirstLetter,
  isPhone,
  coutryCode,
  isEmail,
  validationPassword,
  getUserId,
  getConfig,
  handleBack,
} from '../../../utils';
import {
  getMstUser,
  insertMstUser,
  updateMstUser,
} from '../../../resource/MstUser';
import { required } from 'vuelidate/lib/validators';
import { getMstDepartment } from '../../../resource/MstDepartment';
import { getMstSection } from '../../../resource/MstSection';
import { authChangePwd } from '../../../resource/SysAuth';

export default {
  name: 'FormUser',
  watch: {
    // formData: {
    //   deep: true,
    //   handler() {
    //     if (!this.initial_load) {
    //       this.checkValidation();
    //     }
    //   },
    // },
    'formData.pwd': {
      deep: true,
      handler(string) {
        this.required.pwd.error = false;
        this.needPassword = false;
        if (string) {
          let check = this.userValidationPassword(string);
          if (typeof check === 'string') {
            this.needPassword = true;
            this.required.pwd.error = true;
            this.required.pwd.message = check;
          }
        } else if (this.action == 'Create') {
          this.needPassword = true;
          this.required.pwd.error = true;
          this.required.pwd.message = check;
        }
      },
    },
    'formData.mst_department_id': {
      deep: true,
      handler(data) {
        this.onDepartmentChange();
      },
    },
  },
  mounted() {
    this.reformatCountryCode();
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == 'Create' ? 'ADD' : this.action == 'Read' ? 'VIEW' : 'EDIT';
    this.loadDepartment();
    if (this.$route.params.id !== undefined) {
      this.needPassword = false;
      this.needConfirmPassword = false;
      this.loadData();
    }
  },
  data() {
    return {
      configuration: getConfig(),
      initial_load: true,
      action: '',
      route_action: '',
      showPassword: false,
      departmentOptions: [],
      optionSections: [],
      needPassword: true,
      needConfirmPassword: true,
      positions: [
        { value: '0', label: '--Select--' },
        { value: 1, label: 'Level 1' },
        { value: 2, label: 'Level 2' },
        { value: 3, label: 'Level 3' },
        { value: 4, label: 'Level 4' },
      ],
      avatars: [],
      formData: {
        status: 'Active',
        tlp_code: null,
        tlp: '',
        have_error: false,
        mst_avatar_id: '1',
        pwd: getConfig().password_default || '',
        re_pwd: getConfig().password_default || '',
        email: '',
        error: null,
        mst_department_id: null,
        mst_section_id: null,
      },
      statusOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
      required: {
        username: { error: false, message: 'Username is required' },
        full_name: { error: false, message: 'Full name is required' },
        email: { error: false, message: 'Please provide valid email address' },
        pwd: { error: false, message: ' ' },
        mst_department_id: { error: false, message: 'Department is required' },
        mst_section_id: { error: false, message: 'Section is required' },
        tlp_code: { error: false, message: 'Country code is required' },
        tlp: {
          error: false,
          message: 'Please provide 7-12 digits phone number',
        },
      },
      avatarOptions: [{ value: '1', label: '1' }],
      isPhoneValid: true,
      CountryCode: coutryCode(),
    };
  },
  validations: {
    formData: {
      username: { required },
      full_name: { required },
      email: { required, notEmail },
      mst_department_id: { required },
      mst_section_id: { required },
      tlp: { required },
      tlp_code: { required },
      employee_id: null,
    },
  },
  methods: {
    userValidationPassword(string) {
      if (this.configuration.password_default && string) {
        if (this.configuration.password_default == string) {
          return null;
        }
      }
      return validationPassword(string);
    },
    handleChangeInput($value) {
      this.formData.tlp_code = $value;
      this.$forceUpdate(); // Memaksa update komponen
    },
    async loadDepartment() {
      this.departmentOptions = [];
      let _res = await getMstDepartment({ status: 'Active' });
      for (const it of _res.data) {
        this.departmentOptions.push({
          label: it.name,
          value: `${it.id}`,
        });
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
        } else {
          this.CountryCode.push({
            value: it.value,
            label: `${it.label}`,
          });
        }
      }
    },
    async loadData() {
      let _res = await getMstUser({ id: this.$route.params.id });
      if (_res) {
        let data = _res.data[0];
        this.formData = { ...data };
        this.formData.mst_department_id =
          this.formData.mst_department_id || this.formData.department_id;
        this.formData.mst_section_id =
          this.formData.mst_section_id || this.formData.mst_section_id;
        this.formData.mst_avatar_id = '' + data.mst_avatar_id;
        if (this.$route.params.id !== undefined) {
          delete this.formData.pwd;
        }
        if (getUserId() == 0) this.formData.is_sys = 0;
        let tlp = '';
        if (data.tlp) {
          tlp = data.tlp.split('-');
          if (tlp.length == 2) {
            this.formData.tlp_code = tlp[0];
            this.formData.tlp = tlp[1];
          } else {
            this.formData.tlp_code = '+62';
            this.formData.tlp = tlp[0];
          }
        }
        this.onDepartmentChange();
      }
    },
    async onDepartmentChange() {
      let _res = await getMstSection({
        mst_department_id: this.formData.mst_department_id,
        status: 'Active',
      });
      this.optionSections = [];
      for (const it of _res.data) {
        this.optionSections.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
      let findSection = this.optionSections.find(
        (it) => it.value == this.formData.mst_section_id
      );
      if (!findSection) {
        this.formData.mst_section_id = '';
      }
    },
    checkValidation() {
      let have_error = false;
      if (this.formData.error) {
        have_error = true;
      }
      for (const rq in this.required) {
        if (
          (!this.formData[rq] && rq != 'pwd') ||
          (!this.formData[rq] && this.needPassword && rq == 'pwd')
        ) {
          this.required[rq].error = true;
          have_error = true;
        } else {
          this.required[rq].error = false;
        }
      }
      // check validation regex
      let is_valid_pwd = this.userValidationPassword(this.formData.pwd);
      if (is_valid_pwd) {
        this.required.pwd.error = true;
        this.required.pwd.message = is_valid_pwd;
        have_error = true;
      }
      // Check Eployee ID
      if (!this.formData.employee_id) {
        have_error = true;
      }
      // Check Phone Number
      if (!isPhone(this.formData.tlp)) {
        have_error = true;
        this.required.tlp.error = true;
      }
      // Check Email
      if (!isEmail(this.formData.email)) {
        have_error = true;
        this.required.email.error = true;
      }
      // Check Password
      if (!this.formData.id) {
        if (!this.formData.pwd && !this.formData.re_pwd) {
          have_error = true;
          this.required['pwd'].error = true;
        } else if (this.formData.pwd !== this.formData.re_pwd) {
          have_error = true;
        }
      }
      // If any error
      if (have_error) {
        this.formData.have_error = true;
      } else {
        this.formData.have_error = false;
      }
      return;
    },
    checkPhone(val) {
      return isPhone(val);
    },
    checkEmail(val) {
      return isEmail(val);
    },
    isValid() {
      if (this.formData.error_metadata) return false;
      if (!this.formData.username) return false;
      if (!this.formData.employee_id) return false;
      if (!this.formData.full_name) return false;
      if (!this.formData.mst_department_id) return false;
      if (!this.formData.mst_section_id) return false;
      if (!this.formData.tlp_code) return false;
      if (!this.checkPhone(this.formData.tlp)) return false;
      if (!this.checkEmail(this.formData.email)) return false;
      if (this.formData.pwd || this.formData.re_pwd)
        if (this.formData.re_pwd != this.formData.pwd) return false;
      this.checkValidation();
      if (this.formData.have_error) return false;
      return true;
    },
    async resetPassword() {
      if (!this.configuration.password_default) {
        this.$toast.open({
          message:
            'Default password has not been set in the system configuration.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.initial_load = false;
      let param = {
        id: this.formData.id,
        new_password: this.configuration.password_default || '',
        new_password: this.configuration.password_default || '',
        password_must_change: true,
        reset_password: true,
      };

      var message = `You are about to reset password to this data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);

        let res = await authChangePwd(param);
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
      }
      return;
    },
    async save() {
      this.formData.mst_position_id = 1;
      this.initial_load = false;

      if (!this.isValid()) {
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

      let dataPost = _form_data;
      if (_form_data.tlp && _form_data.tlp_code) {
        dataPost.tlp = `${_form_data.tlp_code}-${_form_data.tlp}`;
      }

      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let res = {};
        if (dataPost.id) {
          res = await updateMstUser(dataPost);
        } else {
          res = await insertMstUser(dataPost);
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

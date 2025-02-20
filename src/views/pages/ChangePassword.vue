<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardHeader><h4>Change Password</h4></CCardHeader>
            <CCardBody class="p-4">
              <CForm>
                <CRow>
                  <CCol md="12">
                    <InputDefault
                      :col="[4, 8]"
                      :type="showPassword == false ? 'password' : 'text'"
                      title="New Password"
                      v-model="form_data.newPassword"
                      :is-valid="
                        !initial_load && !form_data.newPassword
                          ? false
                          : !form_data.newPassword
                          ? null
                          : !required.newPassword.error
                      "
                      :invalid_feedback="required.newPassword.message"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="12">
                    <InputDefault
                      :col="[4, 8]"
                      :type="showPassword == false ? 'password' : 'text'"
                      title="Confirm Password"
                      v-model="form_data.confirmPassword"
                      :is-valid="
                        !initial_load && !form_data.confirmPassword
                          ? false
                          : !form_data.newPassword
                          ? null
                          : form_data.newPassword === form_data.confirmPassword
                      "
                      :invalid_feedback="
                        !form_data.confirmPassword
                          ? 'Confirm password is required'
                          : 'Confirmation password does not match'
                      "
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CButton
                size="sm"
                class="float-right ml-2"
                color="success"
                @click="changePassword"
              >
                Save
              </CButton>

              <CButton
                size="sm"
                class="float-right"
                @click="showPassword = !showPassword"
              >
                <v-icon v-if="!showPassword" name="eye-slash" size="sm" />
                <v-icon v-if="showPassword" name="eye" size="sm" />
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { CCardHeader } from '@coreui/vue';
import { ChangePwdFirstTime } from '../../resource/SysAuth';
import {
  getConfUserApp,
  getProfile,
  getUserId,
  setProfile,
  validationPassword,
} from '../../utils';
export default {
  name: 'ChangePassword',
  components: {},
  watch: {
    form_data: {
      deep: true,
      handler(n, o) {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
    'form_data.newPassword': {
      deep: true,
      handler(data) {
        this.required.newPassword.message = 'New password is required';
        this.required.newPassword.error = false;
        let check = validationPassword(data);
        if (check) {
          this.required.newPassword.error = true;
          this.required.newPassword.message = check;
        }
      },
    },
  },
  data() {
    return {
      initial_load: true,
      form_data: {
        newPassword: '',
        confirmPassword: '',
      },
      showPassword: false,
      conf_user_app: {},
      profile: {},
      required: {
        newPassword: { error: false, message: 'New password is required' },
        confirmPassword: {
          error: false,
          message: 'Confirm new password required',
        },
      },
    };
  },
  mounted() {
    this.profile = getProfile();
    this.conf_user_app = getConfUserApp();
  },
  methods: {
    checkValidation() {
      let have_error = false;
      for (const rq in this.required) {
        if (!this.form_data[rq]) {
          this.required[rq].error = true;
          have_error = true;
        } else {
          this.required[rq].error = false;
        }
      }
      // If any error
      if (have_error) {
        this.form_data.have_error = true;
      } else {
        this.form_data.have_error = false;
      }
      return;
    },
    async changePassword() {
      this.initial_load = false;
      this.checkValidation();
      if (validationPassword(this.form_data.newPassword)) {
        this.required.newPassword.error = true;
        this.required.newPassword.message = validationPassword(
          this.form_data.newPassword
        );
        return;
      } else if (this.form_data.have_error) {
        return;
      } else if (
        this.form_data.newPassword !== this.form_data.confirmPassword
      ) {
        return;
      }

      this.$isLoading(true);
      var body = {
        new_password: this.form_data.newPassword,
        token: this.profile.token,
      };
      let res = await ChangePwdFirstTime(body);

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
      if (!res['error']) {
        this.profile.password_must_change = false;
        setProfile(this.profile);
        this.$router.push({ path: `/home` });
      }
    },
  },
};
</script>

<template>
  <div>
    <CRow>
      <CCol col="12" xl="12">
        <CCard>
          <CCardHeader>
            <strong>Profile</strong>
          </CCardHeader>
          <CCardBody>
            <CRow class="mt-3"
              ><CCol md="3"> Username </CCol>
              <CCol md="3">
                <CInput readonly v-model="profile.username" /> </CCol
            ></CRow>
            <CRow class="mt-3"
              ><CCol md="3"> Email </CCol>
              <CCol md="3"> <CInput readonly v-model="profile.email" /> </CCol
            ></CRow>
            <CRow class="mt-3"
              ><CCol md="3"> Full Name </CCol>
              <CCol md="3">
                <CInput readonly v-model="profile.full_name" /> </CCol
            ></CRow>
            <CRow class="mt-3"
              ><CCol md="3"> Department </CCol>
              <CCol md="3">
                <CInput readonly v-model="profile.department_name" /> </CCol
            ></CRow>
            <CRow class="mt-3"
              ><CCol md="3"> Section</CCol>
              <CCol md="3">
                <CInput readonly v-model="profile.section_name" /> </CCol
            ></CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow>
      <CCol col="6" xl="6">
        <CCard>
          <CCardHeader>
            <strong>Update Password</strong>
          </CCardHeader>
          <CCardBody>
            <CRow class="mt-3"
              ><CCol md="6"> Old Password </CCol>
              <CCol md="6">
                <CInput
                  placeholder="Old Password"
                  type="password"
                  autocomplete="old-password"
                  v-model="form_data.oldPassword"
                  :invalid-feedback="required.oldPassword.message"
                  :add-input-classes="{
                    'is-invalid': required.oldPassword.error,
                  }"
                /> </CCol
            ></CRow>
            <CRow
              ><CCol md="6"> New Password </CCol>
              <CCol md="6">
                <CInput
                  placeholder="New Password"
                  type="password"
                  autocomplete="bew-password"
                  v-model="form_data.newPassword"
                  :invalid-feedback="required.newPassword.message"
                  :add-input-classes="{
                    'is-invalid': required.newPassword.error,
                  }"
                /> </CCol
            ></CRow>
            <CRow
              ><CCol md="6"> Confirm New Password </CCol>
              <CCol md="6">
                <CInput
                  placeholder="Confirm Password"
                  type="password"
                  autocomplete="confirm-password"
                  v-model="form_data.confirmPassword"
                  :invalid-feedback="
                    !form_data.confirmPassword
                      ? 'Confirm password is required'
                      : 'Confirmation password does not match'
                  "
                  :add-input-classes="{
                    'is-invalid':
                      form_data.newPassword !== form_data.confirmPassword,
                  }"
                /> </CCol
            ></CRow>
          </CCardBody>
          <CCardFooter
            ><CButton
              size="sm"
              class="float-right ml-2"
              color="success"
              @click="changePassword"
              >Submit</CButton
            ></CCardFooter
          >
        </CCard>
      </CCol>
      <CCol col="6" xl="6">
        <CCard>
          <CCardHeader>
            <strong>Settings App</strong>
          </CCardHeader>
          <CCardBody>
            <CRow class="mt-3">
              <CCol md="6"> Accordion Effect </CCol>
              <CCol md="6">
                <SwitchDefault
                  :default_value="conf_user_app.accordion"
                  v-on:onChange="conf_user_app.accordion = $event"
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter
            ><CButton
              size="sm"
              class="float-right ml-2"
              color="success"
              @click="changeConf"
              >Submit</CButton
            ></CCardFooter
          >
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { updateMstUser } from "../../../resource/MstUser";
import { authChangePwd } from "../../../resource/SysAuth";
import {
  getConfUserApp,
  getProfile,
  getUserId,
  setProfile,
} from "../../../utils";
export default {
  name: "UserSetting",
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
  },
  data() {
    return {
      initial_load: true,
      form_data: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      conf_user_app: {},
      profile: {},
      required: {
        oldPassword: { error: false, message: "Old password is required" },
        newPassword: { error: false, message: "New password is required" },
        confirmPassword: {
          error: false,
          message: "Confirm new password required",
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
      if (this.form_data.have_error) {
        return;
      }
      if (this.form_data.newPassword !== this.form_data.confirmPassword) {
        return;
      }
      this.$isLoading(true);
      var body = {
        old_password: this.form_data.oldPassword,
        new_password: this.form_data.newPassword,
      };
      let res = await authChangePwd(body);

      this.$isLoading(false);
      this.$toast.open({
        message: res["error"]
          ? `${res["message"]}`
          : "Data has been saved succesfully ",
        type: res.error ? "error" : "success",
        dissmissible: true,
        position: "top-right",
        duration: 5000,
      });
      if (!res["error"]) this.$router.back();
    },
    async changeConf() {
      let profile = getProfile();
      profile.conf_app = this.conf_user_app;
      setProfile(profile);
      let params = {
        id: getUserId(),
        conf_app: this.conf_user_app,
      };
      await updateMstUser(params);
    },
  },
};
</script>

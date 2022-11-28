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
      <CCol col="12" xl="12">
        <CCard>
          <CCardHeader>
            <strong>Setting</strong>
          </CCardHeader>
          <CCardBody>
            <CRow class="mt-3"
              ><CCol md="3"> Old Password </CCol>
              <CCol md="3">
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
              ><CCol md="3"> New Password </CCol>
              <CCol md="3">
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
              ><CCol md="3"> Confirm New Password </CCol>
              <CCol md="3">
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
    </CRow>
  </div>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
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
    this.profile = JSON.parse(localStorage.getItem("profile"));
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
    changePassword() {
      this.initial_load = false;
      this.checkValidation();
      if (this.form_data.have_error) {
        return;
      }
      if (this.form_data.newPassword !== this.form_data.confirmPassword) {
        return;
      }
      var body = {
        ApiName: "ChangePwd",
        Params: {
          old_pwd: this.form_data.oldPassword,
          new_pwd: this.form_data.newPassword,
        },
      };
      $axiosMertrack.post(`/general/web`, body).then((res) => {
        this.$toast.open({
          message: res.data.error
            ? res.data.message
            : "Password has been changed successfully ",
          type: res.data.error ? "error" : "success",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        if (!res.data.error) {
          this.$router.push({
            path: `/dashboard`,
          });
        }
      });
    },
  },
};
</script>

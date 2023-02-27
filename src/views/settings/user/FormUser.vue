<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>User [{{ route_action }}]</h5>
          </CCardHeader>

          <CCardBody>
            <CForm>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  horizontal
                  placeholder="Enter username"
                  v-model="user.username"
                  :invalid-feedback="required.username.message"
                  :add-input-classes="{
                    'is-invalid': required.username.error,
                  }"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Username
                      <span class="text-danger"><strong>*</strong></span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  horizontal
                  placeholder="Enter full name"
                  v-model="user.full_name"
                  :invalid-feedback="required.full_name.message"
                  :add-input-classes="{
                    'is-invalid': required.full_name.error,
                  }"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Full Name
                      <span class="text-danger"><strong>*</strong></span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="12">
                <table style="width: 100%">
                  <tr>
                    <td style="width: 25%">
                      Phone Number
                      <span class="text-danger"><strong>*</strong></span>
                    </td>
                    <td>
                      <table style="width: 100%">
                        <tr style="">
                          <td style="width: 40%; padding-bottom: 15px">
                            <v-select
                              :disabled="action === 'Read' ? true : false"
                              placeholder="- Country -"
                              :options="CountryCode"
                              :reduce="(opt) => opt.value"
                              v-model="temp_data.tlp_code"
                              @input="handleChangeInput(temp_data.tlp_code)"
                            >
                            </v-select>
                            <small
                              v-if="required.tlp_code.error"
                              style="color: red"
                            >
                              {{ required.tlp_code.message }}
                            </small>
                          </td>
                          <td>
                            <CInput
                              :disabled="action == 'Read' ? true : false"
                              placeholder="Enter phone number (Example : 81211223344)"
                              type="number"
                              horizontal
                              v-model="user.tlp"
                              :add-input-classes="{
                                'is-invalid': required.tlp.error,
                              }"
                              :is-invalid="required.tlp.error"
                              :invalid-feedback="required.tlp.message"
                            >
                            </CInput>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  placeholder="email.address@email.com"
                  horizontal
                  v-model="user.email"
                  :invalid-feedback="required.email.message"
                  :add-input-classes="{
                    'is-invalid': required.email.error,
                  }"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Email <span class="text-danger"><strong>*</strong></span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="12">
                <CInput
                  :disabled="action == 'Read' ? true : false"
                  type="password"
                  :placeholder="
                    action === 'Update'
                      ? `Leave it blank if you don't want to change password.`
                      : action === 'Read'
                      ? '<hidden>'
                      : 'Enter password'
                  "
                  horizontal
                  v-model="user.pwd"
                  :invalid-feedback="required.pwd.message"
                  :add-input-classes="{
                    'is-invalid': needPassword && required.pwd.error,
                  }"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Password
                      <span class="text-danger"><strong>*</strong></span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="12" v-if="action != 'Read'">
                <CInput
                  type="password"
                  :placeholder="
                    action === 'Update'
                      ? `Re-enter the same new password. Leave it blank if you don't want to change password.`
                      : action === 'Read'
                      ? '<hidden>'
                      : 'Enter confirm password'
                  "
                  horizontal
                  v-model="user.re_pwd"
                  :invalid-feedback="
                    !user.re_pwd
                      ? 'Confirm password is required'
                      : 'Confirmation password does not match'
                  "
                  :add-input-classes="{
                    'is-invalid': user.re_pwd !== user.pwd,
                  }"
                >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Confirm Password
                      <span class="text-danger"><strong>*</strong></span>
                    </p>
                  </template>
                </CInput>
              </CCol>
              <CCol sm="12">
                <CSelect
                  :disabled="action == 'Read' ? true : false"
                  id="select-department"
                  @change="onDepartmentChange()"
                  :options="departmentOptions"
                  placeholder="--Select--"
                  horizontal
                  :value.sync="user.mst_department_id"
                  :invalid-feedback="required.mst_department_id.message"
                  :add-input-classes="{
                    'is-invalid': required.mst_department_id.error,
                  }"
                >
                  >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Department
                      <span class="text-danger"><strong>*</strong></span>
                    </p>
                  </template>
                </CSelect>
              </CCol>
              <CCol sm="12">
                <CSelect
                  :disabled="action == 'Read' ? true : false"
                  :options="optionSections"
                  placeholder="--Select--"
                  horizontal
                  :value.sync="user.mst_section_id"
                  :invalid-feedback="required.mst_section_id.message"
                  :add-input-classes="{
                    'is-invalid': required.mst_section_id.error,
                  }"
                >
                  >
                  <template #label>
                    <p class="col-form-label col-sm-3">
                      Section
                      <span class="text-danger"><strong>*</strong></span>
                    </p>
                  </template>
                </CSelect>
              </CCol>
              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3">
                    Status <span class="text-danger"><strong>*</strong></span>
                  </CCol>
                  {{ action == "Read" ? user.status : null }}
                  <CInputRadioGroup
                    v-if="action == 'Read' ? false : true"
                    :options="statusOptions"
                    :inline="true"
                    :checked.sync="user.status"
                  >
                  </CInputRadioGroup>
                </CRow>
              </CCol>

              <CCol sm="12">
                <CRow form class="form-group">
                  <CCol sm="3"
                    >Avatar
                    <span class="text-danger"><strong>*</strong></span></CCol
                  >
                  <CCol sm="9">
                    <CRow class="form-group" v-if="action == 'Read'">
                      <CCol sm="12">
                        <CRow class="justify-content-left">
                          <label>
                            <img
                              style="width: 50px; heigth: auto"
                              :src="
                                require(`../../../../public/img/avatars/${user.mst_avatar_id}.png`)
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
                              :checked.sync="user.mst_avatar_id"
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
                              :checked.sync="user.mst_avatar_id"
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
                              :checked.sync="user.mst_avatar_id"
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
                              :checked.sync="user.mst_avatar_id"
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
                              :checked.sync="user.mst_avatar_id"
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
                              :checked.sync="user.mst_avatar_id"
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
                              :checked.sync="user.mst_avatar_id"
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
                              :checked.sync="user.mst_avatar_id"
                            />
                          </label>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CCol>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton
              v-if="action == 'Read' ? false : true"
              type="submit"
              size="sm"
              color="primary"
              @click="save()"
            >
              <CIcon name="cil-check-circle" />
              Submit
            </CButton>
            <CButton
              type="reset"
              size="sm"
              class="m-1"
              color="danger"
              @click="cancel()"
            >
              <CIcon name="cil-ban" />
              Cancel
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { notEmail } from "../../../validator";
import "vue-select/dist/vue-select.css";
import {
  capitalizeFirstLetter,
  isPhone,
  coutryCode,
  isEmail,
} from "../../../utils";
import {
  getMstUser,
  insertMstUser,
  updateMstUser,
} from "../../../resource/MstUser";
import { required } from "vuelidate/lib/validators";
import { getMstDepartment } from "../../../resource/MstDepartment";
import { getMstSection } from "../../../resource/MstSection";

export default {
  name: "FormUser",
  watch: {
    user: {
      deep: true,
      handler(n, o) {
        if (!this.initial_load) {
          this.checkValidation();
        }
      },
    },
  },
  mounted() {
    this.reformatCountryCode();
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    this.loadDepartment();
    if (this.$route.params.id !== undefined) {
      this.needPassword = false;
      this.needConfirmPassword = false;
      this.loadData();
    }
  },
  data() {
    return {
      initial_load: true,
      action: "",
      route_action: "",
      departmentOptions: [],
      optionSections: [],
      needPassword: true,
      needConfirmPassword: true,
      positions: [
        { value: "0", label: "--Select--" },
        { value: 1, label: "Level 1" },
        { value: 2, label: "Level 2" },
        { value: 3, label: "Level 3" },
        { value: 4, label: "Level 4" },
      ],
      avatars: [],
      user: {
        status: "Active",
        tlp_code: "",
        tlp: "",
        have_error: false,
        mst_avatar_id: "1",
        pwd: "",
        re_pwd: "",
        email: "",
      },
      temp_data: { tlp_code: "", tlp_code: "" },
      statusOptions: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      required: {
        username: { error: false, message: "Username is required" },
        full_name: { error: false, message: "Full name is required" },
        email: { error: false, message: "Please provide valid email address" },
        pwd: { error: false, message: "Password is required" },
        mst_department_id: { error: false, message: "Department is required" },
        mst_section_id: { error: false, message: "Section is required" },
        tlp_code: { error: false, message: "Country code is required" },
        tlp: {
          error: false,
          message: "Please provide 7-12 digits phone number",
        },
      },
      avatarOptions: [{ value: "1", label: "1" }],
      isPhoneValid: true,
      CountryCode: coutryCode(),
    };
  },
  validations: {
    user: {
      username: { required },
      full_name: { required },
      email: { required, notEmail },
      mst_department_id: { required },
      mst_section_id: { required },
      tlp: { required },
      tlp_code: { required },
    },
  },
  methods: {
    handleChangeInput($value) {
      this.temp_data.tlp_code = $value;
      this.user.tlp_code = $value;
    },
    async loadDepartment() {
      let _res = await getMstDepartment({ status: "Active" });
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
        this.user = data;
        this.user.mst_department_id =
          this.user.mst_department_id || this.user.department_id;
        this.user.mst_section_id =
          this.user.mst_section_id || this.user.mst_section_id;
        this.user.mst_avatar_id = "" + data.mst_avatar_id;
        if (this.$route.params.id !== undefined) {
          delete this.user.pwd;
        }
        let tlp = "";
        if (data.tlp) {
          tlp = data.tlp.split("-");
          this.user.tlp_code = tlp[0];
          this.temp_data.tlp_code = tlp[0];
          this.user.tlp = tlp[1];
        }
        this.onDepartmentChange();
      }
    },
    async onDepartmentChange() {
      let _res = await getMstSection({
        mst_department_id: this.user.mst_department_id,
        status: "Active",
      });
      for (const it of _res.data) {
        this.optionSections.push({
          label: it.name,
          value: `${it.id}`,
        });
      }
    },
    checkValidation() {
      let have_error = false;
      for (const rq in this.required) {
        if (
          (!this.user[rq] && rq != "pwd") ||
          (!this.user[rq] && this.needPassword && rq == "pwd")
        ) {
          this.required[rq].error = true;
          have_error = true;
        } else {
          this.required[rq].error = false;
        }
      }
      // Check Phone Number
      if (!isPhone(this.user.tlp)) {
        have_error = true;
        this.required.tlp.error = true;
      }
      // Check Email
      if (!isEmail(this.user.email)) {
        have_error = true;
        this.required.email.error = true;
      }
      // Check Password
      if (!this.user.id) {
        if (!this.user.pwd && !this.user.re_pwd) {
          have_error = true;
          this.required[pwd].error = true;
        } else if (this.user.pwd !== this.user.re_pwd) {
          have_error = true;
        }
      }
      // If any error
      if (have_error) {
        this.user.have_error = true;
      } else {
        this.user.have_error = false;
      }
      return;
    },

    async save() {
      this.user.mst_position_id = 1;
      this.initial_load = false;
      this.checkValidation();
      if (this.user.have_error) {
        return;
      }

      let _form_data = JSON.parse(JSON.stringify(this.user));

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
          message: res["error"]
            ? `${res["message"]}`
            : "Data has been saved succesfully ",
          type: res.error ? "error" : "success",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        if (!res["error"]) this.$router.back();
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>

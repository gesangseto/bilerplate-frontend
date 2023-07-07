<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Customer [{{ route_action }}]</h5>
          </CCardHeader>

          <CCardBody>
            <CForm>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter customer name"
                v-model="customer.name"
                :invalid-feedback="required.name.message"
                :add-input-classes="{
                  'is-invalid': required.name.error,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter customer PIC name"
                v-model="customer.pic"
                :invalid-feedback="required.pic.message"
                :add-input-classes="{
                  'is-invalid': required.pic.error,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    PIC Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CTextarea
                :disabled="action == 'Read' ? true : false"
                placeholder="Enter customer address"
                horizontal
                v-model="customer.address"
                :invalid-feedback="required.address.message"
                :add-input-classes="{
                  'is-invalid': required.address.error,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Address
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CTextarea>
              <div class="form-group">
                <table style="width: 100%">
                  <tr>
                    <td style="width: 25%">
                      Phone Number
                      <span class="text-danger">
                        <strong>*</strong>
                      </span>
                    </td>
                    <td>
                      <table style="width: 100%">
                        <tr>
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
                              horizontal
                              @keypress="
                                limitPhone({
                                  event: $event,
                                  data: customer.tlp,
                                  max: 12,
                                })
                              "
                              v-model="customer.tlp"
                              :invalid-feedback="required.tlp.message"
                              :add-input-classes="{
                                'is-invalid': required.tlp.error,
                              }"
                            >
                            </CInput>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="form-group">
                <table style="width: 100%">
                  <tr>
                    <td style="width: 25%">Alternative Phone Number</td>
                    <td>
                      <table style="width: 100%">
                        <tr>
                          <td style="width: 40%; padding-bottom: 15px">
                            <v-select
                              :disabled="action === 'Read' ? true : false"
                              placeholder="- Country -"
                              :options="CountryCode"
                              :reduce="(opt) => opt.value"
                              v-model="temp_data.tlp_alt_code"
                              @input="
                                handleChangeInput(
                                  temp_data.tlp_alt_code,
                                  'alt_code'
                                )
                              "
                            >
                            </v-select>
                            <!-- <small
                              v-if="required.tlp_alt_code.error"
                              style="color: red"
                            >
                              {{ required.tlp_alt_code.message }}
                            </small> -->
                          </td>
                          <td>
                            <CInput
                              :disabled="action == 'Read' ? true : false"
                              placeholder="Enter alternative phone number (Example : 81211223344)"
                              horizontal
                              v-model="customer.tlp_alt"
                              @keypress="
                                limitPhone({
                                  event: $event,
                                  data: customer.tlp_alt,
                                  max: 12,
                                })
                              "
                            >
                            </CInput>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <CInput
                :disabled="action == 'Read' ? true : false"
                placeholder="email.address@email.com"
                horizontal
                v-model="customer.email"
                :invalid-feedback="required.email.message"
                :add-input-classes="{
                  'is-invalid': required.email.error,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Email
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>

              <CInput
                :disabled="action == 'Read' ? true : false"
                placeholder=""
                horizontal
                v-model="customer.id_sarana"
                :invalid-feedback="required.id_sarana.message"
                :add-input-classes="{
                  'is-invalid': required.email.error,
                }"
                @keypress="
                  limitPhone({
                    event: $event,
                    data: customer.id_sarana,
                    max: 12,
                  })
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    ID Sarana (BPOM)
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInput>
              <CRow form class="form-group">
                <CCol sm="3"> Status </CCol>
                <SwitchStatusMaster
                  :disabled="action == 'Read'"
                  :show_label="true"
                  :default_value="customer.status"
                  v-on:onChange="customer.status = $event"
                />
              </CRow>
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
} from "../../../utils";
import { notEmail } from "../../../validator";
import { required } from "vuelidate/lib/validators";
import {
  getMstCustomer,
  insertMstCustomer,
  updateMstCustomer,
} from "../../../resource/MstCustomer";

export default {
  name: "Forms",
  watch: {
    customer: {
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
      action: "",
      route_action: "",
      customer: { status: "Active", tlp_alt: "", tlp: "" },
      statusOptions: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      items: [],
      CountryCode: coutryCode(),

      temp_data: { tlp_code: "", tlp_code: "" },
      required: {
        name: { error: false, message: "Name is required" },
        pic: { error: false, message: "PIC is required" },
        email: { error: false, message: "Please provide valid email address" },
        id_sarana: { error: false, message: "Please provide id sarana" },
        address: { error: false, message: "Address is required" },
        tlp_code: { error: false, message: "Country code is required" },
        tlp: {
          error: false,
          message: "Please provide 7-12 digits phone number",
        },
      },
    };
  },
  mounted() {
    this.reformatCountryCode();
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  validations: {
    customer: {
      name: { required },
      address: { required },
      pic: { required },
      email: {
        required,
        notEmail,
      },
    },
  },
  methods: {
    handleChangeInput($value, code) {
      if (code == "alt_code") {
        this.temp_data.tlp_alt_code = $value;
        this.customer.tlp_alt_code = $value;
      } else {
        this.temp_data.tlp_code = $value;
        this.customer.tlp_code = $value;
      }
    },
    limitPhone({ event, data, max }) {
      onlyNumber({ event, data, max });
    },
    async loadData() {
      let _res = await getMstCustomer({ id: this.$route.params.id });
      if (_res) {
        let data = _res.data[0];
        this.customer = data;
        if (data.tlp) {
          let tlp = data.tlp.split("-");
          this.temp_data.tlp_code = tlp[0];
          this.customer.tlp_code = tlp[0];
          this.customer.tlp = tlp[1];
        }
        if (data.tlp_alt) {
          let tlp = data.tlp_alt.split("-");
          this.temp_data.tlp_alt_code = tlp[0];
          this.customer.tlp_alt_code = tlp[0];
          this.customer.tlp_alt = tlp[1];
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
        } else {
          this.CountryCode.push({
            value: it.value,
            label: `${it.label}`,
          });
        }
      }
    },

    checkValidation() {
      let have_error = false;
      for (const rq in this.required) {
        if (!this.customer[rq]) {
          this.required[rq].error = true;
          have_error = true;
        } else {
          this.required[rq].error = false;
        }
      }
      // Check Phone Number
      if (!isPhone(this.customer.tlp)) {
        have_error = true;
        this.required.tlp.error = true;
      }
      // Check Email
      if (!isEmail(this.customer.email)) {
        have_error = true;
        this.required.email.error = true;
      }
      // If any error
      if (have_error) {
        this.customer.have_error = true;
      } else {
        this.customer.have_error = false;
      }
      return;
    },
    handleChangePhone() {},
    async save() {
      this.initial_load = false;
      this.checkValidation();
      if (this.customer.have_error) {
        return;
      }

      let _form_data = JSON.parse(JSON.stringify(this.customer));
      let dataPost = JSON.parse(JSON.stringify(this.customer));

      if (_form_data.tlp && _form_data.tlp_code) {
        dataPost.tlp = `${_form_data.tlp_code}-${_form_data.tlp}`;
      }
      if (_form_data.tlp_alt && _form_data.tlp_alt_code) {
        dataPost.tlp_alt = `${_form_data.tlp_alt_code}-${_form_data.tlp_alt}`;
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

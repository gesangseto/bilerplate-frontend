<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Department [{{ route_action }}]</h5>
          </CCardHeader>

          <CCardBody>
            <CForm>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter department name"
                v-model="department.name"
                invalid-feedback="Department name is required"
                :add-input-classes="{
                  'is-valid':
                    !$v.department.name.$error && $v.department.name.required,
                  'is-invalid': $v.department.name.$error,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Name <span class="text-danger"><strong>*</strong></span>
                  </p>
                </template>
              </CInput>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter department description"
                v-model="department.description"
                invalid-feedback="Department description is required"
                :add-input-classes="{
                  'is-valid':
                    !$v.department.description.$error &&
                    $v.department.description.required,
                  'is-invalid': $v.department.description.$error,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Description
                    <span class="text-danger"><strong>*</strong></span>
                  </p>
                </template>
              </CInput>
              <CRow form class="form-group">
                <CCol sm="3"> Status </CCol>
                <SwitchStatusMaster
                  :disabled="action == 'Read'"
                  :show_label="true"
                  :default_value="department.status"
                  v-on:onChange="department.status = $event"
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
              <CIcon name="cil-check-circle" />
              Submit
            </CButton>
            <ButtonBack />
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { capitalizeFirstLetter } from "../../../utils";
import $axiosMertrack from "../../../apiMertrack";
import {
  getMstDepartment,
  insertMstDepartment,
  updateMstDepartment,
} from "../../../resource/MstDepartment";
export default {
  name: "FormDepartment",
  data() {
    return {
      route_action: "",
      action: "Edit",
      department: { name: "", description: "", status: "Active" },
      statusOptions: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    };
  },
  validations: {
    department: {
      name: { required },
      description: { required },
    },
  },
  async mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      let _res = await getMstDepartment({ id: this.$route.params.id });
      if (_res) {
        this.department = _res.data[0];
      }
    }
  },
  methods: {
    async save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let dataPost = this.department;
        let res = {};
        if (dataPost.id) {
          res = await updateMstDepartment(dataPost);
        } else {
          res = await insertMstDepartment(dataPost);
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

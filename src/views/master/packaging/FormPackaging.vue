<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Packaging [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter packaging name"
                v-model="packaging.name"
                invalid-feedback="Packaging name is required"
                :add-input-classes="{
                  'is-valid':
                    !$v.packaging.name.$error && $v.packaging.name.required,
                  'is-invalid': $v.packaging.name.$error,
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
              <CTextarea
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter packaging description"
                v-model="packaging.description"
                invalid-feedback="Packaging description is required"
                :add-input-classes="{
                  'is-valid':
                    !$v.packaging.description.$error &&
                    $v.packaging.description.required,
                  'is-invalid': $v.packaging.description.$error,
                }"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Description
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CTextarea>
              <CRow form class="form-group">
                <CCol sm="3">
                  Status
                  <span class="text-danger">*</span>
                </CCol>
                {{ action == "Read" ? packaging.status : null }}
                <CInputRadioGroup
                  v-if="action == 'Read' ? false : true"
                  class="col-sm-9"
                  :options="statusOptions"
                  :inline="true"
                  :checked.sync="packaging.status"
                ></CInputRadioGroup>
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
            <CButton
              type="reset"
              size="sm"
              color="danger"
              class="m-1"
              @click="cancel()"
            >
              <CIcon name="cil-ban" /> Cancel
            </CButton>
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
export default {
  name: "PackageForm",
  data() {
    return {
      route_action: "",
      action: "Edit",
      packaging: { status: "Active", description: "", name: "" },
      statusOptions: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    };
  },
  validations: {
    packaging: {
      name: { required },
      description: { required },
    },
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      let param = `id=${this.$route.params.id}`;
      $axiosMertrack.get(`v3/master/packaging?${param}`).then((response) => {
        let data = response.data.data[0];
        this.packaging = data;
      });
    }
  },
  methods: {
    save() {
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if (confirm(message)) {
        this.$isLoading(true);
        let dataPost = this.packaging;
        $axiosMertrack.post(`v3/master/packaging`, dataPost).then((result) => {
          this.$isLoading(false);
          let res = result.data;
          this.$toast.open({
            message: res.error
              ? `${res.message}`
              : "Data has been saved succesfully ",
            type: res.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          if (!res.error) {
            this.items = [];
            dataPost = [];
            this.$router.back();
          }
        });
      }
      return;
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>

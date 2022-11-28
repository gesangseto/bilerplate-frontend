<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Section [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm novalidate>
              <CSelect
                :disabled="action == 'Read' ? true : false"
                label="Type Of Temperature *"
                :options="departmentOptions"
                horizontal
                placeholder="--Select--"
                :value.sync="section.mst_department_id"
                :add-input-classes="{
                  'is-valid':
                    !$v.section.mst_department_id.$error &&
                    $v.section.mst_department_id.required,
                  'is-invalid':
                    $v.section.mst_department_id.$error &&
                    !$v.section.mst_department_id.required,
                }"
                invalid-feedback="Department is required"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Department
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>
              <CInput
                :disabled="action == 'Read' ? true : false"
                horizontal
                placeholder="Enter section name"
                autocomplete="name"
                v-model="section.name"
                :add-input-classes="{
                  'is-valid':
                    !$v.section.name.$error && $v.section.name.required,
                  'is-invalid':
                    $v.section.name.$error && !$v.section.name.required,
                }"
                invalid-feedback="Section name is required"
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
                placeholder="Enter section description"
                horizontal
                v-model="section.description"
                :add-input-classes="{
                  'is-valid':
                    !$v.section.description.$error &&
                    $v.section.description.required,
                  'is-invalid':
                    $v.section.description.$error &&
                    !$v.section.description.required,
                }"
                invalid-feedback="Section description is required"
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
                {{ action == "Read" ? section.status : null }}
                <CInputRadioGroup
                  v-if="action == 'Read' ? false : true"
                  class="col-sm-9"
                  :options="statusOptions"
                  :checked.sync="section.status"
                  :inline="true"
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
            <CButton
              type="reset"
              size="sm"
              class="m-1"
              color="danger"
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
import { capitalizeFirstLetter } from "../../../utils";
import $axiosMertrack from "../../../apiMertrack";
import { required } from "vuelidate/lib/validators";

export default {
  name: "WareHouseForm",
  data() {
    return {
      route_action: "",
      // category: '',
      action: "Edit",
      listCategoryWarehouse: [
        {
          value: 1,
          label: "Quarantine",
        },
        {
          value: 3,
          label: "Ready To Sell",
        },
      ],
      section: { status: "Active" },
      departmentOptions: [],
      statusOptions: ["Active", "Inactive"],
      listProvince: [],
      listEntity: [],
    };
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
    this.loadDepartment();
  },
  validations: {
    section: {
      mst_department_id: { required },
      name: { required },
      description: { required },
    },
  },
  methods: {
    loadData() {
      let param = `ApiName=SectionList&Params={}&Id=${this.$route.params.id}&page=&limit=&searchText=`;
      $axiosMertrack.get(`general/web?${param}`).then((response) => {
        let data = response.data.data[0];
        this.section = data;
      });
    },
    loadDepartment() {
      let param = `ApiName=DepartmentList`;
      $axiosMertrack.get(`general/web?${param}`).then((response) => {
        let data = response.data.data;
        for (const it of data) {
          this.departmentOptions.push({
            label: it.name,
            value: it.id,
          });
        }
        return;
      });
    },
    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let dataPost = {
        ApiName: this.$route.params.id ? "UpdateSection" : "InsertSection",
        Params: this.section,
      };
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack.post(`general/web`, dataPost).then((result) => {
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

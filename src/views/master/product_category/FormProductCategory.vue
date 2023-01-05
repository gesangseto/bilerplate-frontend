<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <h5>Product Category [{{ route_action }}]</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                :disabled="action == 'Read' ? true : false"
                label="Name *"
                horizontal
                placeholder="Enter product category name"
                v-model="productCategory.name"
                invalid-feedback="Category name is required"
                :add-input-classes="{
                  'is-valid':
                    !$v.productCategory.name.$error &&
                    $v.productCategory.name.required,
                  'is-invalid': $v.productCategory.name.$error,
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
                label="Description*"
                horizontal
                placeholder="Enter product category description"
                v-model="productCategory.description"
                invalid-feedback="Description is required"
                :add-input-classes="{
                  'is-valid':
                    !$v.productCategory.description.$error &&
                    $v.productCategory.description.required,
                  'is-invalid': $v.productCategory.description.$error,
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
                <CCol sm="3"> Status </CCol>
                {{ action == "Read" ? productCategory.status : null }}
                <CInputRadioGroup
                  v-if="action == 'Read' ? false : true"
                  class="col-sm-9"
                  :options="statusOptions"
                  :inline="true"
                  :checked.sync="productCategory.status"
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
            <CButton
              type="reset"
              size="sm"
              color="danger"
              class="m-1"
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
import { required } from "vuelidate/lib/validators";
import { capitalizeFirstLetter } from "../../../utils";
import $axiosMertrack from "../../../apiMertrack";

export default {
  name: "ProductCategory",
  data() {
    return {
      action: "",
      route_action: "",
      productCategory: { status: "Active" },
      statusOptions: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    };
  },
  validations: {
    productCategory: {
      name: { required },
      description: { required },
    },
  },
  mounted() {
    this.action = capitalizeFirstLetter(this.$route.params.type);
    this.route_action =
      this.action == "Create" ? "ADD" : this.action == "Read" ? "VIEW" : "EDIT";
    if (this.$route.params.id !== undefined) {
      this.loadData();
    }
  },
  methods: {
    loadData() {
      // let param = `id=${this.$route.params.id}`;
      // $axiosMertrack.get(`v3/master/product-category?${param}`).then((response) => {
      let param = `ApiName=ProductCategoryList&Params={}&Id=${this.$route.params.id}&page=&limit=&searchText=`;
      $axiosMertrack.get(`general/web?${param}`).then((response) => {
        let data = response.data.data[0];
        this.productCategory = data;
      });
    },

    save() {
      var message = this.$route.params.id
        ? `You are about to save changes to this data. This operation cannot be undone. Would you like to continue?`
        : `You are about to add this new data. This operation cannot be undone. Would you like to continue?`;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let dataPost = {
        ApiName: this.$route.params.id
          ? "UpdateProductCategory"
          : "InsertProductCategory",
        Params: this.productCategory,
      };
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

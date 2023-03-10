<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>Upload XML [ADD]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="10" lg="10">
              <CInputFile
                accept=".xml"
                :placeholder="form.data.file_name"
                horizontal
                custom
                class="input-form-upload"
                @change="uploadFile"
                :is-valid="
                  initialLoad ? null : !form.data.file_name ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    XML File
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInputFile>
            </CCol>
            <!-- <CCol sm="10" lg="10">
              <CSelect
                placeholder="-Select-"
                :options="typeXmlOptions"
                horizontal
                :value.sync="form.data.type"
                :is-valid="initialLoad ? null : !form.data.type ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Source Type
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>
            </CCol> -->
            <CCol sm="10" lg="10">
              <CSelect
                placeholder="-Select-"
                :options="supplierOptions"
                horizontal
                :value.sync="form.data.supplier_id"
                @change="handleChangeSupplier"
                :is-valid="
                  initialLoad ? null : !form.data.supplier_id ? false : true
                "
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Supplier Name
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CSelect>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton @click="save()" type="submit" size="sm" color="primary">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <CButton
            @click="cancel()"
            class="m-1"
            color="danger"
            size="sm"
            type="button"
          >
            <CIcon name="cil-ban" /> Cancel
          </CButton>
        </CCardFooter>
      </CCard>
    </div>
  </div>
</template>

<script>
let fileName;
let isiFile;
const reader = new FileReader();
import $axiosMertrack from "../../../apiMertrack";
import "vue-select/dist/vue-select.css";
import $ from "jquery";
import { getMstSupplier } from "../../../resource/MstSupplier";
export default {
  name: "FormUploadXML",
  watch: {
    // form: {
    //   handler(n, o) {
    //   },
    //   deep: true,
    // },
  },
  data() {
    return {
      action: "",
      initialLoad: true,
      supplierOptions: [],
      fileUpload: null,
      form: {
        connector_action_id: null,
        data: {
          supplier_id: null,
          type: null,
          file_name: null,
          file_content: null,
        },
      },
      typeXmlOptions: [
        { value: 1, label: "Production" },
        { value: 2, label: "Import" },
        { value: 3, label: "Toll Manufacturing" },
      ],
    };
  },
  async mounted() {
    let _res = await getMstSupplier({ status: "Active" });
    if (_res) {
      let data = _res.data;
      for (const it of data) {
        this.supplierOptions.push({ value: `${it.id}`, label: it.name });
      }
    }
  },
  methods: {
    uploadFile(event) {
      isiFile = event[0];
      if (isiFile != undefined) {
        fileName = isiFile.name;
        let ekstensiValid = "xml";
        let ekstensiFile = fileName.split(".").reverse()[0];
        if (ekstensiFile != ekstensiValid) {
          alert("Your file is not XML. Please select the correct XML file");
          return;
        }
        this.form.data.file_name = fileName;
        this.createBase64(isiFile);
      } else {
        this.form.data.file_name = null;
        this.form.data.file_content = null;
      }
    },
    handleChangeSupplier() {
      let param = { key: "supplier_id", value: this.form.data.supplier_id };
      param = new URLSearchParams(param).toString();
      $axiosMertrack
        .get(`/v3/connector/connector-action?${param}`)
        .then((result) => {
          let data = result.data;
          if (data.error || data.data.length === 0) {
            this.$toast.open({
              message: `The Supplier you have selected is not assigned to any Connector Action.`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            this.form.connector_action_id = null;
            return;
          } else if (data.data[0].status !== "Active") {
            this.$toast.open({
              message: `The Supplier you have selected is not assigned to Active Connector Action.`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            this.form.connector_action_id = null;
            return;
          }
          let params = data.data[0].params;
          let idx = params.findIndex((it) => it.variable_name === "type");
          if (!~idx || !params[idx].variable_value) {
            this.$toast.open({
              message: `The supplier you selected has not completed the Connector Action configuration.`,
              type: "error",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            this.form.connector_action_id = null;
            return;
          }
          this.form.connector_action_id = data.data[0].id;
          this.form.data.type = params[idx].variable_value;
        })
        .catch((e) => {
          this.$toast.open({
            message: `${e.message}`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
        });
    },
    createBase64(file) {
      reader.onload = (e) => {
        this.form.data.file_content = e.target.result;
      };
      reader.readAsBinaryString(file);
    },
    validation() {
      if (!this.form.data.file_name) return false;
      if (!this.form.data.type) return false;
      if (!this.form.data.supplier_id) return false;
      return true;
    },
    save() {
      this.initialLoad = false;
      if (!this.validation()) {
        return this.$toast.open({
          message: `Please input all the required data.`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
      }
      var message = `You are about to create this new transaction. This operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        $axiosMertrack
          .post("/v3/connector/connector-action/execute", this.form)
          .then((result) => {
            this.$isLoading(false);
            this.$toast.open({
              message: result.data.error
                ? `${result.data.message}`
                : "Data Saved",
              type: result.data.error ? "error" : "success",
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
            if (!result.data.error) {
              this.$router.back();
            }
          })
          .catch((err) => {
            this.$isLoading(false);
            this.$toast.open({
              message: `${err}`,
              type: `error`,
              dissmissible: true,
              position: "top-right",
              duration: 5000,
            });
          });
      }
    },
    cancel() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
[class*="-message"] {
  font-weight: 500;
}

.error-message {
  color: #d33c40;
}

.success-message {
  color: #32a95d;
}
</style>

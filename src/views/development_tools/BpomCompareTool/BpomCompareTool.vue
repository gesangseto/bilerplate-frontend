<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>BPOM Compare Tool</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="10">
              <CInputFile
                :placeholder="
                  formData.filename ? formData.filename : 'Choose file...'
                "
                horizontal
                custom
                accept=".xlsx,.csv"
                class="input-form-upload"
                @change="handleUploadFile"
                :is-valid="initial_load ? null : !formData.file ? false : true"
              >
                <template #label>
                  <p class="col-form-label col-sm-3">
                    Upload BPOM File Report
                    <span class="text-danger">
                      <strong>*</strong>
                    </span>
                  </p>
                </template>
              </CInputFile>
            </CCol>
            <CCol md="2">
              <CButton
                @click="uploadFile"
                size="sm"
                color="success"
                class="float-right ml-5"
              >
                Compare
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { HeaderManualBarcodeGenerator } from '../../component';
export default {
  name: 'BpomCompareTool',
  components: { HeaderManualBarcodeGenerator: HeaderManualBarcodeGenerator },

  mounted() {},
  data() {
    return {
      initial_load: true,
      showData: false,
      result: {},
      formData: { file: null, filename: '' },
      detailData: {},
      parentData: [],
      childData: [],
    };
  },
  methods: {
    handleUploadFile(event) {
      let file = event[0];
      console.log(file);

      this.formData.file = file;
      this.formData.filename = file.name;
    },
    getData() {
      let param = `${new URLSearchParams(this.result).toString()}`;
      let url = `/v3/helper/detail-item/stock?show_barcode=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        let data = res.data.data;
        if (data.length != 1) {
          this.$toast.open({
            message: `Data cannot be found`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }
        this.showData = true;
        this.detailData = data[0];
        if (this.detailData.parent) {
          this.getParent();
        }
      });
    },
    async uploadFile() {
      this.initial_load = false;
      if (!this.formData.file) {
        this.$toast.open({
          message: 'Please input all the required data.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', this.formData.file);
      formData.append('batch_no', 'OQA0001A');

      $axiosMertrack
        .post(`/v4/helper/compare-bpom`, formData)
        .then((result) => {
          this.loadData();
          this.$toast.open({
            message: result.data.error
              ? result.data.message
              : `Transaction has been canceled successfully`,
            type: result.data.error == true ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        })
        .catch((err) => {
          this.$toast.open({
            message: `Error : ${err}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
    },
  },
  computed: {},
};
</script>

<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>BPOM Compare Tool</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="12">
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
          </CRow>
          <CRow>
            <CCol md="12">
              <InputDefault
                :col="[3, 7]"
                title="Batch No"
                v-model="formData.batch_no"
                :max="21"
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md="12">
              <CButton
                @click="uploadFile"
                size="sm"
                color="success"
                class="float-left "
              >
                Compare
              </CButton>
            </CCol>
          </CRow>
        </br>
          <div class="table-responsive">
            <CDataTable
              hover
              striped
              sorter
              :items="renderList"
              :fields="fields"
              class="compact-table"
              style="font-size: 12px"
            >
              <template #barcode="{ item }">
                <td :class="getClass(item.barcode, item.barcode_stock)">
                  {{ item.barcode ? '...' + item.barcode.slice(-15) : '' }}
                </td>
              </template>
              <template #sekunder="{ item }">
                <td :class="getClass(item.sekunder, item.sekunder_stock)">
                  {{ item.sekunder ? '...' + item.sekunder.slice(-15) : '' }}
                </td>
              </template>
              <template #tersier="{ item }">
                <td :class="getClass(item.tersier, item.tersier_stock)">
                  {{ item.tersier ? '...' + item.tersier.slice(-15) : '' }}
                </td>
              </template>
              <template #barcode_stock="{ item }">
                <td :class="getClass(item.barcode, item.barcode_stock)">
                  {{
                    item.barcode_stock
                      ? '...' + item.barcode_stock.slice(-15)
                      : ''
                  }}
                </td>
              </template>
              <template #sekunder_stock="{ item }">
                <td :class="getClass(item.sekunder, item.sekunder_stock)">
                  {{
                    item.sekunder_stock
                      ? '...' + item.sekunder_stock.slice(-15)
                      : ''
                  }}
                </td>
              </template>
              <template #tersier_stock="{ item }">
                <td :class="getClass(item.tersier, item.tersier_stock)">
                  {{
                    item.tersier_stock
                      ? '...' + item.tersier_stock.slice(-15)
                      : ''
                  }}
                </td>
              </template>
            </CDataTable>
          </div>
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
      formData: { file: null, filename: '', batch_no: '' },
      items_file: [],
      items_stock: [],
      result: {},
      fields: [
        {
          key: 'no',
          label: 'No',
        },
        {
          key: 'barcode',
          label: 'Barcode (xlsx)',
        },
        {
          key: 'sekunder',
          label: 'Sekunder (xlsx)',
        },
        {
          key: 'tersier',
          label: 'Tersier (xlsx)',
        },
        {
          key: 'barcode_stock',
          label: 'Barcode (database)',
        },
        {
          key: 'sekunder_stock',
          label: 'Sekunder (database)',
        },
        {
          key: 'tersier_stock',
          label: 'Tersier (database)',
        },
      ],
    };
  },
  methods: {
    getClass(barcode, barcode_stock) {
      return barcode === barcode_stock ? 'text-green' : 'text-red'; // Jika sama, hijau. Jika beda, merah
    },
    handleUploadFile(event) {
      let file = event[0];
      this.formData.file = file;
      this.formData.filename = file.name;
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
      formData.append('batch_no', this.formData.batch_no);

      $axiosMertrack
        .post(`/v4/helper/compare-bpom`, formData)
        .then((result) => {
          this.$toast.open({
            message: result.data.error
              ? result.data.message
              : `Transaction has been canceled successfully`,
            type: result.data.error == true ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          if (!result.data.error) {
            this.result = result.data.data;
            this.items_file = this.result.items_file;
            this.items_stock = this.result.items_stock;
          }
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
  computed: {
    renderList() {
      let no = 0;
      return this.items_file.map((item, index) => {
        no++;
        let stock = this.items_stock[index];
        return {
          ...item,
          no: no,
          barcode: item.barcode || '',
          sekunder: item.sekunder || '',
          tersier: item.tersier || '',
          barcode_stock: stock.barcode || '',
          sekunder_stock: stock.sekunder || '',
          tersier_stock: stock.tersier || '',
        };
      });
    },
  },
};
</script>
<style type="text/css">
.text-green {
  color: green !important; /* Warna hijau jika cocok */
}
.text-red {
  color: red !important; /* Warna merah jika tidak cocok */
}
.compact-table {
  font-size: 12px; /* Ukuran font lebih kecil */
  width: 100%; /* Pastikan tabel tidak lebih besar dari parent */
}

.compact-table th,
.compact-table td {
  padding: 4px 8px !important; /* Kurangi padding agar lebih rapat */
  white-space: nowrap; /* Hindari pemecahan baris */
}
</style>

<template>
  <CRow>
    <CCol sm="12" md="12" lg="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [VIEW]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">ID</td>
                  <td style="width: 60%">
                    <input class="form-control" readonly v-model="upload.id" />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Upload Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="upload.created_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Upload By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="upload['created_full_name']"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>File Name</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="upload.file_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Source Type</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="upload['source_name']"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Supplier</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="upload['supplier_name']"
                    />
                  </td>
                </tr>
              </table>
            </CCol>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">Status</td>
                  <td style="width: 60%">
                    <input
                      class="form-control"
                      readonly
                      v-model="upload.status_desc"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="upload.status != 0">
                  <td>Last Action By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="upload.modified_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="upload.status != 0">
                  <td>Last Action Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="upload.modified_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="upload.status == 2">
                  <td>Reason</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="upload.reason"
                    />
                  </td>
                </tr>
                <tr
                  style="height: 50px"
                  v-for="(value, index) in total"
                  v-bind:key="value.id"
                >
                  <td style="width: 40%">
                    {{ index.replace('_', '') }} Quantity ({{ value.name }})
                  </td>
                  <td style="width: 60%">
                    <input
                      class="form-control"
                      readonly
                      v-model="value.quantity"
                    />
                  </td>
                </tr>
              </table>
            </CCol>
          </CRow>
          <div class="table-responsive my-3">
            <CDataTable
              tableFilter
              hover
              striped
              sorter
              border
              :pagination="true"
              :items-per-page="10"
              :items="uploadItems"
              :fields="fields"
              class="text-left"
              style="font-size: 12px"
            >
            </CDataTable>
          </div>
        </CCardBody>
        <CCardFooter>
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
export default {
  name: 'DetailUploadXML',
  mounted() {
    if (this.$route.params.id != undefined) {
      this.$isLoading(true);
      let param = `id=${this.$route.params.id}`;
      $axiosMertrack
        .get(`/v3/transaction/upload-xml?${param}&raw=true`)
        .then((res) => {
          this.$isLoading(false);
          this.upload = res.data.data[0];
          for (const it of res.data.data[0].items) {
            let lvl = it.packaging_level;
            this.total[`L_${lvl}`].name = it[`packaging_name`];
            this.total[`L_${lvl}`].quantity += 1;
          }

          for (const it in this.total) {
            if (this.total[it].quantity == 0) {
              delete this.total[it];
            }
          }
        })
        .catch((err) => {
          this.$isLoading(false);
          this.$toast.open({
            message: `Error : ${err}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
    }
  },
  data() {
    return {
      items: [],
      total: {
        L_1: {
          id: 1,
          name: '',
          quantity: 0,
        },
        L_2: {
          id: 2,
          name: '',
          quantity: 0,
        },
        L_3: {
          id: 3,
          name: '',
          quantity: 0,
        },
        L_4: {
          id: 4,
          name: '',
          quantity: 0,
        },
      },
      fields: [
        {
          key: 'product_no',
          label: 'Item No',
        },
        {
          key: 'product_name',
          label: 'Product Name',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
        },
        {
          key: 'product_nie',
          label: 'NIE',
        },
        {
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'SN',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
      ],
      upload: {
        id: '',
        suppplier_name: '',
        type: '',
        fileName: '',
        fileContent: '',
        createdBy: '',
        createdDate: '',
        status: '',
        items: [],
      },
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
  computed: {
    uploadItems() {
      return this.upload.items.map((item) => {
        let type = item.epc_type ? item.epc_type.toLowerCase() : null;
        return {
          ...item,
          gtin_cp: type == 'sscc' ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>
>

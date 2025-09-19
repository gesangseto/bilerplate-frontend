<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [VIEW]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <CRow>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td style="width: 40%">ID</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Trx Date</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.created_date"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Created By</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack['created_full_name']"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td style="width: 40%">Remark</td>
                      <td style="width: 60%">
                        <textarea
                          class="form-control"
                          readonly
                          v-model="unpack.remark"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Warehouse</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack['warehouse_name']"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td style="width: 40%">Process</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.add_item_desc"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td>EPC Key</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.epc_key"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Packing SN</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.serial"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Old Packing EPC</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.old_epc"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Packaging Level</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.packaging_level"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Packaging Name</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack.packaging_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px" v-for="index in 1" :key="index">
                      <td
                        style="width: 40%"
                        v-if="unpack[`quantity_lvl_${index}`] > 0"
                      >
                        {{ 'L' + index }} Quantity
                      </td>
                      <td
                        style="width: 60%"
                        v-if="unpack[`quantity_lvl_${index}`] > 0"
                      >
                        <input
                          class="form-control"
                          readonly
                          v-model="unpack[`quantity_lvl_${index}`]"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
              </CRow>
              <CDataTable
                tableFilter
                hover
                striped
                sorter
                border
                :items="unpackDetail"
                :fields="fields"
                class="text-left"
                style="font-size: 12px"
              >
              </CDataTable>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <ButtonBack />
          <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          />
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3, handleBack } from '../../../utils';

export default {
  name: 'DetailRepack',
  mounted() {
    let url = `/v3/transaction/re-packing?id=${this.$route.params.id}`;
    $axiosMertrack.get(url).then((response) => {
      let data = response.data.data[0];

      //
      this.unpack = data;
      this.unpack.packaging_level = 2;
      this.unpack.gtin_cp =
        data.epc_type == 'sscc' || data.epc_type == 'SSCC'
          ? data.company_prefix
          : data.gtin_sscc;
      if (data.items.length > 0) {
        this.items = data.items;
      } else {
        this.$toast.open({
          message: `No data to be viewed`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      }
    });
  },
  data() {
    return {
      sn: false,
      test: null,
      status: '',
      unpack: {},
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: '',
      search: false,
      items: [],
      item: [],
      darkModal: false,
      fields: [
        {
          key: 'no',
          label: 'Item No',
        },
        {
          key: 'name',
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
          key: 'nie',
          label: 'NIE',
        },
        {
          key: 'gtin',
          label: 'GTIN',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
      ],
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
  },
  methods: {
    cancel() {
      handleBack(this.$router, this.$route);
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: {
          id: this.$route.params.id,
        },
        exportType: type,
        url: '/v3/transaction/re-packing',
      });
    },
  },
  computed: {
    unpackDetail() {
      return this.items.map((item) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
        };
      });
    },
  },
};
</script>

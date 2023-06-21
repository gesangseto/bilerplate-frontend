<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Re-Aggregation [{{ action }}]</h5>
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
                          v-model="reaggregation.id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Trx Date</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation.created_date"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Created By</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation['_created.full_name']"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Remark</td>
                      <td>
                        <textarea
                          class="form-control"
                          readonly
                          v-model="reaggregation.remark"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Warehouse</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation['_warehouse.name']"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td style="width: 40%">Process</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation.add_item_desc"
                        />
                      </td>
                    </tr>
                  </table>
                </CCol>
                <CCol md="6">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td style="width: 40%">GTIN / CP</td>
                      <td style="width: 60%">
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation.gtin_cp"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Re-Aggregation SN</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation.serial"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Packaging Level</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation.packaging_level"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Packaging Name</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation.packaging_name"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px" v-for="index in 1" :key="index">
                      <td
                        style="width: 40%"
                        v-if="reaggregation[`quantity_lvl_${index}`] > 0"
                      >
                        {{ "L" + index }} Quantity
                      </td>
                      <td
                        style="width: 60%"
                        v-if="reaggregation[`quantity_lvl_${index}`] > 0"
                      >
                        <input
                          class="form-control"
                          readonly
                          v-model="reaggregation[`quantity_lvl_${index}`]"
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
                :items="detailReaggregation"
                :fields="fields"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <CButton
                      v-if="item.packaging_level > 1"
                      color="info"
                      size="sm"
                      @click="rowClicked(item, index)"
                      class="px-2 mx-2"
                    >
                      <v-icon name="eye" />
                    </CButton>
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton
            type="reset"
            size="sm"
            class="m-1 float-right"
            color="primary"
            @click="cancel()"
          >
            <CIcon name="cil-arrow-left" /> Back
          </CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="lg">
      <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";

export default {
  name: "DetailReaggregation",
  mounted() {
    this.action = this.$route.params.type == "read" ? "VIEW" : "EDIT";
    let param = { id: this.$route.params.id, raw: true };
    let url = `/v3/transaction/re-aggregation?${new URLSearchParams(param)}`;
    $axiosMertrack.get(url).then((response) => {
      let data = response.data.data[0];
      //
      this.reaggregation = data;
      this.reaggregation.gtin_cp =
        data.epc_type == "sscc" || data.epc_type == "SSCC"
          ? data.company_prefix
          : data.gtin_sscc;
      if (data.items.length > 0) {
        this.items = data.items;
      } else {
        this.$toast.open({
          message: `No data to be viewed`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
      }
    });
  },
  data() {
    return {
      action: "",
      detail_item: {},
      datas: [],
      viewModal: false,
      view: {
        productId: "",
        productName: "",
        batch: "",
        serial: [],
        gtin: "",
        nie: "",
        expiredDate: "",
      },
      sn: false,
      test: null,
      status: "",
      reaggregation: {
        id: "",
        add: "",
        serial: "",
        warehouse: {},
        packaging_level: "",
      },
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: "",
      search: false,
      items: [],
      fields: [
        {
          key: "no",
          label: "Item No",
        },
        {
          key: "name",
          label: "Product Name",
        },
        {
          key: "batch_no",
          label: "Batch No",
        },
        {
          key: "expired_date",
          label: "Exp Date",
        },
        {
          key: "nie",
          label: "NIE",
        },
        {
          key: "gtin_cp",
          label: "GTIN / CP",
        },
        {
          key: "serial",
          label: "SN",
        },
        {
          key: "packaging_level",
          label: "Pkg Level",
        },
        {
          key: "packaging_name",
          label: "Pkg Name",
        },
        {
          key: "quantity",
          label: "L1 Qty",
        },
        {
          key: "action",
          label: "Action",
          sorter: false,
          filter: false,
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
      this.$router.back();
    },
    rowClicked(item) {
      this.datas = [];
      if (item.packaging_level == 1) {
        this.$toast.open({
          message: `No detail SN data to be viewed, SN [${item.serial_id}] is Packaging L1`,
          type: "error",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        return false;
      }
      this.detail_item = item;
      this.viewModal = true;
      return;
    },
    closeModal() {
      this.datas = [];
      this.viewModal = false;
    },
  },
  computed: {
    detailReaggregation() {
      return this.items.map((item) => {
        return {
          ...item,
          gtin_cp:
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc,
        };
      });
    },
  },
};
</script>

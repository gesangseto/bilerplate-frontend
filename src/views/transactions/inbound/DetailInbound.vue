<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Inbound [VIEW]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <CRow>
                <CCol md="12">
                  <table style="width: 100%">
                    <tr style="height: 50px">
                      <td style="width: 20%">ID</td>
                      <td style="width: 30%">
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound.id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Trx Date</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound.created_date"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Created By</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound['_created.full_name']"
                        />
                      </td>
                    </tr>
                    <tr
                      style="height: 50px"
                      v-if="
                        inbound.source.toLowerCase() != 'return' &&
                        inbound.source.toLowerCase() != 'transfer'
                      "
                    >
                      <td>Remark</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound.remark"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Type</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound.source"
                        />
                      </td>
                      <td style="width: 5%; text-align: left"></td>
                      <td style="width: 15%; text-align: left">Trx Ref ID</td>
                      <td style="width: 30%">
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound.trx_ref_id"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Source</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound.from"
                        />
                      </td>
                    </tr>
                    <tr style="height: 50px">
                      <td>Destination</td>
                      <td>
                        <input
                          class="form-control"
                          readonly
                          v-model="inbound.to"
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
                :items="detailInbound"
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
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="xl">
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
import { toTitleCase } from "../../../utils";

export default {
  name: "DetailInbound",
  mounted() {
    if (this.$route.params.id !== undefined) {
      let param = `id=${this.$route.params.id}`;
      $axiosMertrack
        .get(`/v3/transaction/inbound?${param}`)
        .then((response) => {
          let data = response.data.data[0];
          this.inbound = data;
          this.inbound.source = toTitleCase(data.source);
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
    }
  },
  data() {
    return {
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
      inbound: {
        id: "",
        source: "",
        toWarehouse: {
          id: "",
          name: "",
        },
        serial: "",
        fromWarehouse: {
          id: "",
          name: "",
        },
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
      this.view.productId = "";
      this.view.productName = "";
      this.view.batch = "";
      this.view.gtin = "";
      this.view.nie = "";
      this.view.expiredDate = "";
      this.datas = [];
      this.viewModal = false;
    },
    cancel() {
      this.$router.back();
    },
  },
  computed: {
    detailInbound() {
      return this.items.map((item) => {
        console.log(item);
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

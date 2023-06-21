<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Outbound [VIEW]</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">ID</td>
                  <td style="width: 60%">
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound.id"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Trx Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound.created_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Created By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound['created_full_name']"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Type</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound['type']"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Source</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound.from"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Destination</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound.to"
                    />
                  </td>
                </tr></table
            ></CCol>
            <CCol md="6">
              <table style="width: 100%">
                <tr style="height: 50px">
                  <td style="width: 40%">Trx Ref ID</td>
                  <td style="width: 60%">
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound.trx_ref_id"
                    />
                  </td>
                </tr>

                <tr style="height: 50px" v-for="index in 1" :key="index">
                  <td
                    style="width: 40%"
                    v-if="outbound[`quantity_lvl_${index}`] > 0"
                  >
                    {{ "L" + index }} Quantity
                  </td>
                  <td
                    style="width: 60%"
                    v-if="outbound[`quantity_lvl_${index}`] > 0"
                  >
                    <input
                      class="form-control"
                      readonly
                      v-model="outbound[`quantity_lvl_${index}`]"
                    />
                  </td>
                </tr></table
            ></CCol>
          </CRow>
          <CDataTable
            tableFilter
            hover
            striped
            sorter
            border
            :items="dataOutbound"
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
  name: "DetailOutbound",
  mounted() {
    if (this.$route.params.id != undefined) {
      let url = `/v3/transaction/outbound?raw=true&id=${this.$route.params.id}`;
      $axiosMertrack.get(url).then((response) => {
        let data = response.data.data[0];
        this.outbound = data;
        this.outbound.type = toTitleCase(data.type);
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
      darkModal: false,
      status: "",
      sn: false,
      test: null,
      pages: null,
      page: null,
      totalPages: 0,
      size: null,
      keyword: "",
      search: false,
      items: [],
      storage: [],
      outbound: {
        id: "",
        type: "",
        fromWarehouse: "",
        toWarehouse: {
          id: "",
          name: "",
        },
        serial: "",
        reason: "",
      },
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
    dataOutbound() {
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

<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <CCard>
        <CCardHeader>
          <h5>Stock Transfer [{{ action }}]</h5>
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
                      v-model="transfer.id"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Trx Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="transfer.created_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Requested By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="transfer.created_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Source Warehouse</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="transfer.from_warehouse_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px">
                  <td>Destination Warehouse</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="transfer.to_warehouse_name"
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
                      v-model="transfer.status_desc"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="transfer.status != 0">
                  <td>Last Action By</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="transfer.modified_full_name"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="transfer.status != 0">
                  <td>Last Action Date</td>
                  <td>
                    <input
                      class="form-control"
                      readonly
                      v-model="transfer.modified_date"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="transfer.status != 0">
                  <td>Remark</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="transfer.remark"
                    />
                  </td>
                </tr>
                <tr style="height: 50px" v-if="transfer.status == 2">
                  <td>Reason</td>
                  <td>
                    <textarea
                      class="form-control"
                      readonly
                      v-model="transfer.reason"
                    />
                  </td>
                </tr>

                <tr style="height: 50px" v-for="index in 1" :key="index">
                  <td
                    style="width: 40%"
                    v-if="transfer[`quantity_lvl_${index}`] > 0"
                  >
                    {{ "L" + index }} Quantity
                  </td>
                  <td
                    style="width: 60%"
                    v-if="transfer[`quantity_lvl_${index}`] > 0"
                  >
                    <input
                      class="form-control"
                      readonly
                      v-model="transfer[`quantity_lvl_${index}`]"
                    />
                  </td>
                </tr>
              </table>
            </CCol>
          </CRow>
          <div class="row my-3">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <CDataTable
                tableFilter
                hover
                striped
                border
                :items="detailItem"
                :fields="fieldItem"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <CButton
                      v-if="item.packaging_level > 1"
                      size="sm"
                      color="info"
                      style="font-size: 12px"
                      class="px-2 my-2"
                      @click="rowClicked(item, index)"
                    >
                      <v-icon name="eye" />
                    </CButton>
                  </td>
                </template>
              </CDataTable>
            </div>
          </div>
        </CCardBody>
        <CCardFooter>
          <button
            class="btn btn-sm btn-primary float-right"
            type="button"
            @click="back()"
          >
            <CIcon name="cil-arrow-left" /> Back
          </button>
        </CCardFooter>
      </CCard>
    </div>
    <!-- Modal Detail Barang Dipilih  -->
    <CModal title="Detail" color="warning" :show.sync="viewModal" size="xl">
      <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>
  </div>
</template>
<script>
import $axiosMertrack from "../../../apiMertrack";
export default {
  data() {
    return {
      items: [],
      action: "",
      viewModal: false,
      view: {},
      transfer: {},
      detail_item: {},
      fieldItem: [
        { key: "no", label: "Item No" },
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
        { key: "nie", label: "NIE" },
        { key: "gtin_cp", label: "GTIN / CP" },
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
        { key: "quantity", label: "L1 Qty" },
        { key: "action", label: "Action", sorter: false, filter: false },
      ],
    };
  },
  mounted() {
    this.action = this.$route.params.type == "read" ? "VIEW" : "EDIT";
    // get data detail stock transfer

    let url = `/v3/transaction/transfer?raw=true&id=${this.$route.params.id}`;
    $axiosMertrack.get(url).then((response) => {
      let data = response.data.data[0];
      //
      this.transfer = data;
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
  methods: {
    back() {
      this.$router.back();
    },
    rowClicked(item) {
      this.detail_item = item;
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
      this.viewModal = true;
      return;
    },
    closeModal() {
      this.view = {};
      this.viewModal = false;
    },
  },
  computed: {
    detailItem() {
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

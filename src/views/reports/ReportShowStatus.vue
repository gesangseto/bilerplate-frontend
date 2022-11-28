<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Show EPC Status</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderShowStatus
            v-on:handleClickSearch="handleClickSearch($event)"
            v-on:handleReset="handleReset($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
    <CCol col="12" xl="12" v-if="showData">
      <CCard>
        <CCardHeader>
          <strong>Details</strong>

          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          />
        </CCardHeader>
        <CCardBody ref="content">
          <CRow>
            <CCol md="6">
              <h5>Product</h5>
              <table width="100%" class="table table-hover">
                <tr>
                  <td>Item No</td>
                  <td>:</td>
                  <td>{{ detailData.product_no }}</td>
                </tr>
                <tr>
                  <td>Product Name</td>
                  <td>:</td>
                  <td>{{ detailData.product_name }}</td>
                </tr>
                <tr>
                  <td>L1 GTIN</td>
                  <td>:</td>
                  <td>{{ detailData.gtin }}</td>
                </tr>
                <tr>
                  <td>NIE</td>
                  <td>:</td>
                  <td>{{ detailData.product_nie }}</td>
                </tr>
                <tr>
                  <td>Storage Temperature</td>
                  <td>:</td>
                  <td>{{ detailData.suhu }}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>:</td>
                  <td>{{ detailData.type == 1 ? "Non-Serial" : "Serial" }}</td>
                </tr>
              </table>
            </CCol>
            <CCol md="6">
              <h5>Item</h5>
              <table width="100%" class="table table-hover">
                <tr>
                  <td>Packaging Level</td>
                  <td>:</td>
                  <td>
                    Level {{ detailData.packaging_level }} ({{
                      detailData.packaging_name
                    }})
                  </td>
                </tr>
                <tr>
                  <td>Batch No</td>
                  <td>:</td>
                  <td>{{ detailData.batch_no }}</td>
                </tr>
                <tr>
                  <td>Exp Date</td>
                  <td>:</td>
                  <td>{{ detailData.expired_date }}</td>
                </tr>
                <tr>
                  <td>Mfg Date</td>
                  <td>:</td>
                  <td>{{ detailData.mfg_date }} {{ detailData.postfix }}</td>
                </tr>
                <tr>
                  <td>EPC Type</td>
                  <td>:</td>
                  <td style="text-transform: capitalize">
                    {{ detailData.epc_type }}
                  </td>
                </tr>
                <tr>
                  <td>SN</td>
                  <td>:</td>
                  <td>{{ detailData.serial }}</td>
                </tr>
                <tr>
                  <td>EPC HR</td>
                  <td>:</td>
                  <td>{{ renderEpcHr(detailData.epc_hr) }}</td>
                </tr>
                <tr>
                  <td>L1 Qty</td>
                  <td>:</td>
                  <td>
                    {{ detailData.quantity }}
                  </td>
                </tr>
                <tr>
                  <td>Location</td>
                  <td>:</td>
                  <td>
                    {{
                      detailData.warehouse_name
                        ? detailData.warehouse_name
                        : detailData.customer_name
                    }}
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>:</td>
                  <td>
                    {{
                      detailData.status == 1 && detailData.warehouse_id
                        ? "Active"
                        : detailData.status == 1 && !detailData.warehouse_id
                        ? "Sold"
                        : detailData.status == 0
                        ? "Inactive"
                        : detailData.status == 10
                        ? "Non sellable other"
                        : detailData.status == 69
                        ? "Pending process"
                        : "Destroyed"
                    }}
                  </td>
                </tr>
              </table>
            </CCol>
            <CCol md="12" v-if="parentData.length == 1">
              <CCard>
                <CCardBody>
                  <h5>Parent Details</h5>
                  <table width="100%" class="table table-hover">
                    <tr>
                      <td>Packaging Level</td>
                      <td>:</td>
                      <td>
                        Level {{ parentData[0].packaging_level }} ({{
                          parentData[0].packaging_name
                        }})
                      </td>
                      <td>SN</td>
                      <td>:</td>
                      <td>{{ parentData[0].serial }}</td>
                    </tr>
                    <tr>
                      <td>EPC Type</td>
                      <td>:</td>
                      <td style="text-transform: capitalize">
                        {{ parentData[0].epc_type }}
                      </td>
                      <td>EPC HR</td>
                      <td>:</td>
                      <td>{{ renderEpcHr(parentData[0].epc_hr) }}</td>
                    </tr>
                    <tr></tr>
                  </table>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md="12" v-if="showData && Object.keys(detailData).length > 0">
              <CCard>
                <CCardBody>
                  <h5>Child Details</h5>
                  <DetailShowStatus v-if="showData" :item="detailData" />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from "../../apiMertrack";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

export default {
  name: "ReportShowStatus",

  mounted() {},
  data() {
    return {
      showData: false,
      result: {},
      detailData: {},
      parentData: [],
      childData: [],
    };
  },
  methods: {
    initial_data() {
      this.showData = false;
      this.result = {};
      this.detailData = {};
      this.parentData = [];
      this.childData = [];
    },
    handleClickSearch(result) {
      this.initial_data();
      this.result = result;
      this.getData();
    },
    handleReset() {
      this.initial_data();
    },
    getData() {
      this.result.date_format = "web";
      let param = `ApiName=GetStock&Params=${JSON.stringify(this.result)}`;
      $axiosMertrack.get(`/general/mobile?${param}`).then((res) => {
        let data = res.data.data;
        if (data.length != 1 || (data[0] && data[0].stocks.length != 1)) {
          this.$toast.open({
            message: `Data cannot be found`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
          return;
        }
        if (data[0] && data[0].stocks) {
          this.showData = true;
          this.detailData = data[0].stocks[0];
          this.detailData.epc_type = this.detailData.epc_type.toUpperCase();
          this.detailData.packaging_name =
            data[0].stocks[0][
              `name_packaging_l${this.detailData.packaging_level}`
            ];
          if (this.detailData.parent) {
            this.getParent();
          }
        }
      });
    },
    getParent() {
      let param = `ApiName=GetStock&Id=${this.detailData.parent}`;
      $axiosMertrack.get(`/general/mobile?${param}`).then((res) => {
        let data = res.data.data;
        if (data[0] && data[0].stocks) {
          data = data[0].stocks;
          this.parentData = data;
          this.parentData[0].packaging_name =
            data[0][`name_packaging_l${data[0].packaging_level}`];

          this.parentData[0].epc_type = data[0].epc_type.toUpperCase();
        }
      });
    },
    testHandle() {},
    handleClickExport() {
      domtoimage
        .toPng(this.$refs.content, {
          width: 3508,
          height: 2480,
          style: {
            transform: "scale(0.7)",
            "transform-origin": "top left",
          },
        })
        .then(function (data) {
          var img = new Image();
          img.src = data;
          const doc = new jsPDF({
            orientation: "portrait",
            format: "a4",
          });
          doc.addImage(img, "JPEG", 2, 0);
          const date = new Date();
          const filename =
            "showstatus_" +
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2) +
            ".pdf";
          doc.save(filename);
        });
    },
    renderEpcHr(item) {
      item = item.replace(/\(/g, " (");
      item = item.trim();
      return item;
    },
  },
  computed: {
    dataTableItem() {
      return this.items.map((item, index) => {
        return {
          ...item,
          no: this.getNumber(index + 1),
        };
      });
    },
  },
};
</script>

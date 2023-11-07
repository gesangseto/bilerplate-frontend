<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Manual Barcode Generator</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderManualBarcodeGenerator />
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
            <CCol md="12"> Test </CCol>
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
  name: 'ManualBarcodeGenerator',
  components: { HeaderManualBarcodeGenerator: HeaderManualBarcodeGenerator },

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
    getParent() {
      let url = `/v3/helper/detail-item/stock?id=${this.detailData['parent']}`;
      $axiosMertrack.get(url).then((res) => {
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
            transform: 'scale(0.7)',
            'transform-origin': 'top left',
          },
        })
        .then(function (data) {
          var img = new Image();
          img.src = data;
          const doc = new jsPDF({
            orientation: 'portrait',
            format: 'a4',
          });
          doc.addImage(img, 'JPEG', 2, 0);
          const date = new Date();
          const filename =
            'showstatus_' +
            date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2) +
            '.pdf';
          doc.save(filename);
        });
    },
    renderEpcHr(item) {
      item = item.replace(/\(/g, ' (');
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

<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Database Log</h5>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            striped
            sorter
            border
            table-filter
            :items="items"
            :fields="fields"
            style="font-size: 12px"
            items-per-page-select
            :items-per-page="10"
            paginatio
          >
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <DetailBarcodeGenerator :property="selected_data" />
  </CRow>
</template>

<script>
import { getDatabaseLog } from '../../../resource/BackupRestore';
export default {
  name: 'ListBarcodeGenerator',
  mounted() {
    this.loadData();
  },
  data() {
    return {
      filter: null,
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'Timestamp',
          label: 'Created Date',
          _classes: 'font-weight-bold',
        },
        {
          key: 'Action',
          label: 'Action',
        },
        {
          key: 'Result Message',
          label: 'Result Message',
        },
        {
          key: 'Database Name',
          label: 'Database Name',
        },
        {
          key: 'Target/Source File',
          label: 'Target/Source File',
        },
        {
          key: 'Remarks',
          label: 'Remarks',
        },
        {
          key: 'Username',
          label: 'Username',
        },
        {
          key: 'Status',
          label: 'Status',
        },
      ],
    };
  },

  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let _res = await getDatabaseLog(filter);
      if (!_res.error) {
        let data = _res.data;
        this.items = data;
      }
    },
  },
  computed: {},
};
</script>

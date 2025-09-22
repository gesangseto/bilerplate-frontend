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
            pagination
          >
            <template #Remarks="{ item }">
              <td style="white-space: pre-line">
                {{ item.Remarks }}
              </td>
            </template>
            <template #Username="{ item }">
              <td style="white-space: nowrap">
                {{ item.Username }}
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
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
          _style: 'white-space: nowrap',
        },
        {
          key: 'Action',
          label: 'Action',
          _style: 'white-space: nowrap;',
        },
        {
          key: 'Status',
          label: 'Status',
        },
        {
          key: 'Result Message',
          label: 'Result Message',
        },
        {
          key: 'Database Name',
          label: 'Database Name',
          _style: 'width:1%',
        },
        {
          key: 'Target/Source File',
          label: 'Target/Source File',
          _style: 'max-width: 100px',
        },
        {
          key: 'Username',
          label: 'Username',
          _style: 'white-space: nowrap',
        },
        {
          key: 'Remarks',
          label: 'Remarks',
          _style: 'white-space: pre-line',
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

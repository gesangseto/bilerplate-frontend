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
            :items="reformatDatas"
            :fields="fields"
            style="font-size: 12px"
            items-per-page-select
            :items-per-page="10"
            pagination
            table-class="table-fixed"
          >
            <template #remarks="{ item }">
              <td class="break-text">
                {{ item['remarks'] }}
              </td>
            </template>
            <template #databaseName="{ item }">
              <td class="break-text">
                {{ item['Database Name'] }}
              </td>
            </template>
            <template #targetSourceFile="{ item }">
              <td class="break-text">
                {{ item['Target/Source File'] }}
              </td>
            </template>
            <template #resultMessage="{ item }">
              <td class="break-text">
                {{ item['Result Message'] }}
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<style scoped>
.table-fixed {
  table-layout: fixed !important;
  width: 200%;
}
.break-text {
  max-width: 500px;
  word-break: break-all;
  white-space: pre-line;
}
</style>
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
          key: 'id',
          label: 'ID',
        },
        {
          key: 'created_date',
          label: 'Start Time',
        },
        {
          key: 'modified_date',
          label: 'End Time',
        },
        {
          key: 'action',
          label: 'Action',
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'result_message',
          label: 'Result Message',
        },
        {
          key: 'database_name',
          label: 'Database Name',
        },
        {
          key: 'path',
          label: 'Target/Source File',
        },
        {
          key: 'username',
          label: 'Username',
        },
        {
          key: 'remarks',
          label: 'Remarks',
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
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
          ['modified_date']: item['modified_date'] || '-',
          ['result_message']: item['result_message'] || '-',
        };
      });
    },
  },
};
</script>

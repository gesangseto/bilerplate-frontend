<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Database Log</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :status_code="'sys_audit_trail'"
            :filterBy="['All']"
            :costumeFilter="[
              {
                value: 'action',
                code: 'action',
                label: 'Action',
                data: [
                  { value: 'DB BACKUP', label: 'Backup' },
                  { value: 'DB RESTORE', label: 'Restore' },
                ],
              },
            ]"
            v-on:handleReload="loadData($event)"
          />
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
import { exportDataV3 } from '../../../utils';
export default {
  name: 'ListBarcodeGenerator',
  mounted() {
    this.loadData();
  },
  watch: {
    $route: {
      deep: true,
      handler(route) {
        let query = route.query;
        this.loadData({ ...query });
      },
    },
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
          key: 'act',
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
    splitLongString(value, chunkSize = 65) {
      if (typeof value !== 'string') return value;
      return value.replace(new RegExp(`(.{1,${chunkSize}})`, 'g'), '$1\u200B');
    },

    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      if (filter) this.filter = filter;

      let _res = await getDatabaseLog(filter);
      if (!_res.error) {
        console.log(_res);

        let data = _res.data;
        this.totalData = _res.grand_total || 0;
        this.items = [];
        for (const it of data) {
          let item = {};
          for (const key in it) {
            item[key] = this.splitLongString(it[key], 30);
          }
          this.items.push(item);
        }
      }
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v4/maintenance/log',
      });
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          act: item?.action,
          ['modified_date']: item['modified_date'] || '-',
          ['result_message']: item['result_message'] || '-',
        };
      });
    },
  },
};
</script>

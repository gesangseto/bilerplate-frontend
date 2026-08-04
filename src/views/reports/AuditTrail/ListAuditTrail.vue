<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :status_code="'sys_audit_trail'"
            :action="['read']"
            :filterBy="['All', 'created_by']"
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

<script>
import $axiosMertrack from '../../../apiMertrack';
import {
  exportDataV3,
  capitalizeFirstLetter,
  exportDataReport,
} from '../../../utils';

export default {
  name: 'ListAuditTrail',
  mounted() {},
  data() {
    return {
      items: [],
      totalData: 0,
      filter: null,
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'created_date',
          label: 'Date & Time',
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_full_name',
          label: 'User (Full Name)',
          _classes: 'font-weight-bold',
        },
        {
          key: '_action',
          label: 'Method',
          _classes: 'font-weight-bold',
        },
        {
          key: 'path',
          label: 'Path',
          _classes: 'font-weight-bold',
        },
        {
          key: 'ip_address',
          label: 'IP Address',
          _classes: 'font-weight-bold',
        },
        {
          key: 'user_agent',
          label: 'User Agent',
          _classes: 'font-weight-bold',
        },
        {
          key: 'status_desc',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:10%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      if (filter) this.filter = filter;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v3/system/audit-trail?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v3/system/audit-trail',
      });
    },
    rowViewClicked(item) {
      this.$router.push({ path: `audit_trail/read/${item.id}` });
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item, index) => {
        return {
          ...item,
          _action: item.action,
          type: capitalizeFirstLetter(item.type),
          dep_sec: item.department_name + ' - ' + item.section_name,
        };
      });
    },
  },
};
</script>

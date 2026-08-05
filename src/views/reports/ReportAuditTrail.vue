<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Audit Trail</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
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
import $axios from '../../api';
import { capitalizeFirstLetter, exportDataReport } from '../../utils';

export default {
  name: 'ReportAuditTrail',
  mounted() {
    this.page = 1;
    this.loadData();
  },
  data() {
    return {
      filter: null,
      items: [],
      totalData: 0,
      fields: [
        {
          key: 'no',
          label: 'No',
        },
        {
          key: 'created_date',
          label: 'Created',
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_by',
          label: 'Created By',
          _classes: 'font-weight-bold',
        },
        {
          key: 'val1',
          label: 'Client',
          _classes: 'font-weight-bold',
        },
        {
          key: 'val2',
          label: 'API',
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
      this.items = [];
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v1/system/audit-trail?raw=true&${param}`;
      $axios.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },
    handleClickExport(type) {
      exportDataReport({ param: this.$route.query, exportType: type });
    },
    getNumber(num) {
      num = (this.filter.page - 1) * this.filter.limit + num;
      return num;
    },
    rowViewClicked(item) {
      this.$router.push({ path: `audit_trail/read/${item.id}` });
    },
  },
  computed: {
    dataTableItem() {
      return this.items.map((item, index) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          no: this.getNumber(index + 1),
          type: capitalizeFirstLetter(item.type),
          dep_sec: item.department_name + ' - ' + item.section_name,
        };
      });
    },
  },
};
</script>

<template>
  <CRow>
    <CCol col="12" xl="12" md="12" sm="12">
      <CCard>
        <CCardHeader _style="padding:10px;">
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableDefault
            :totalData="totalData"
            :fields="fields"
            :items="reformatDatas"
            :action="['read', 'update']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleCopy="addNew($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../../api';

export default {
  name: 'ListWorkflow',

  mounted() {},
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'transaction_label',
          label: 'Transaction',
          _classes: 'font-weight-bold',
        },
        { key: 'approval_1_section_name', label: 'Approval 1' },
        { key: 'approval_2_section_name', label: 'Approval 2' },
        { key: 'approval_3_section_name', label: 'Approval 3' },
        { key: 'approval_4_section_name', label: 'Approval 4' },
        {
          key: 'action',
          label: 'Action',
          _classes: 'font-weight-bold',
          _style: 'width:12%',
          sorter: false,
          filter: false,
        },
      ],
    };
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
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v1/master/workflow?raw=true&${param}`;
      $axios.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total;
        this.items = res.data;
      });
    },
    rowUpdate(item) {
      this.$router.push({ path: `workflow/update/${item.id}` });
    },
    rowRead(item) {
      this.$router.push({ path: `workflow/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `workflow/create` });
    },
  },
  computed: {
    reformatDatas() {
      var no = 0;
      return this.items.map((item) => {
        return {
          ...item,
          ['approval_1_section_name']: item['approval_1_section_name'] ?? '-',
          ['approval_2_section_name']: item['approval_2_section_name'] ?? '-',
          ['approval_3_section_name']: item['approval_3_section_name'] ?? '-',
          ['approval_4_section_name']: item['approval_4_section_name'] ?? '-',
          nomor: (no += 1),
        };
      });
    },
  },
};
</script>

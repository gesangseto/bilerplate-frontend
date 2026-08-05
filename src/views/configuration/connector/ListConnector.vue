<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            :permission="'create'"
            @click="addNew()"
            :useHref="true"
          />
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
  name: 'ListConnector',
  mounted() {},
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'name',
          label: 'Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'description',
          label: 'Desc',
        },
        {
          key: 'connector_method',
          label: 'Method',
        },
        {
          key: 'connector_port',
          label: 'Port',
        },
        {
          key: 'connector_path',
          label: 'Path',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
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
      $axios.get(`/v1/connector/connector-list?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total;
        this.items = res.data;
      });
    },
    rowUpdate(item) {
      this.$router.push({
        path: `connector/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `connector/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `connector/create`,
      });
    },
    deleteRow(item) {},
  },
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
          connector_path: item.connector_path || '',
        };
      });
    },
  },
};
</script>

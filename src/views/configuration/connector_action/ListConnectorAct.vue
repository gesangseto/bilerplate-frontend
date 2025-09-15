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
            :status_code="'mst_product'"
            :action="['read', 'update', 'delete']"
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
import $axiosMertrack from '../../../apiMertrack';
import { readCron } from '../../../utils';

export default {
  name: 'ListConnectorAction',
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
          key: 'connector_name',
          label: 'Connector',
        },
        {
          key: 'using_connection',
          label: 'SFTP Form Cloud',
        },
        {
          key: 'folder_sftp',
          label: 'Folder SFTP',
        },
        {
          key: 'folder_backup',
          label: 'Folder Archive',
        },
        {
          key: 'schedule',
          label: 'Running Schedule',
        },
        {
          key: 'value_name',
          label: 'Key',
        },
        {
          key: 'status',
          label: 'Status',
          _classes: 'font-weight-bold',
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
      $axiosMertrack
        .get(`/v3/connector/connector-action?${param}`)
        .then((res) => {
          res = res.data;
          this.totalData = res.grand_total;
          this.items = res.data;
        });
    },
    rowUpdate(item) {
      this.$router.push({
        path: `connector_action/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `connector_action/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `connector_action/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let _param = { id: item.id };
        $axiosMertrack
          .delete(`v3/connector/connector-action`, { data: _param })
          .then((result) => {
            this.$isLoading(false);
            this.loadData();
            let res = result.data;
            this.$toast.open({
              message: res.error
                ? `${res.message}`
                : 'Data has been deleted successfully ',
              type: res.error ? 'error' : 'success',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
          });
      }
    },
  },
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
          schedule: item.schedule ? readCron(item.schedule) : '',
          description: item.description || '',
          folder_sftp: item.folder_sftp || '',
          folder_backup: item.folder_backup || '',
          using_connection: item.connection ? 'TRUE' : 'FALSE',
        };
      });
    },
  },
};
</script>

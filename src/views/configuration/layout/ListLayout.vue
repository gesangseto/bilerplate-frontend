<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            v-if="can_create"
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
            :action="['copy', 'read', 'update', 'delete']"
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
import moment from 'moment';
import { deleteConfLayout, getConfLayout } from '../../../resource/ConfLayout';
import { getLimitation } from '../../../utils';

export default {
  name: 'Customer',
  mounted() {},
  data() {
    return {
      can_create: true,
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'name',
          label: 'Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'itf_name',
          label: 'File Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_date',
          label: 'Created Date',
        },
        {
          key: 'packaging_level',
          label: 'Packaging Level',
        },
        {
          key: 'status',
          label: 'Status',
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
    protectCreateData(_res) {
      let max = getLimitation('total_conf_layout');
      if (max) {
        if (max <= _res.grand_total) {
          this.can_create = false;
        }
      }
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getConfLayout(filter);
      if (res) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
      this.protectCreateData(res);
    },
    rowUpdate(item) {
      this.$router.push({
        path: `layout/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `layout/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `layout/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteConfLayout(param);
        this.$isLoading(false);
        this.$toast.open({
          message: _res.error
            ? `${_res.message}`
            : 'Data has been deleted successfully',
          type: _res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!_res.error) this.loadData();
      }
    },
  },
  computed: {
    reformatDatas() {
      return this.items.map((item) => {
        return {
          ...item,
          created_date: moment(item.created_date).format('YYYY-MM-DD HH:mm'),
        };
      });
    },
  },
};
</script>

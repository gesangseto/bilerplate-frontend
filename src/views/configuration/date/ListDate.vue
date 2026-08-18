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
import { getLimitation } from '../../../utils';
import { deleteConfDate, getConfDate } from '../../../resource/ConfDate';
import moment from 'moment';

export default {
  name: 'Date_Configuration',
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
          label: 'Format',
          _classes: 'font-weight-bold',
        },
        {
          key: 'overwrite',
          label: 'Overwrite',
        },
        {
          key: 'result_date',
          label: 'Result',
        },
        {
          key: 'used_in_layout',
          label: 'Used In Layout',
          _style: 'width:30%',
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
    protectCreateData(_res) {
      let max = getLimitation('total_conf_date');
      let count = _res.grand_total - _res.grand_total_is_sys;
      if (max) {
        if (max <= count) {
          this.can_create = false;
        }
      }
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getConfDate(filter);
      if (res) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
      this.protectCreateData(res);
    },
    rowUpdate(item) {
      this.$router.push({
        path: `date/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `date/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `date/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id, reason: item?.reason || '' };
        let _res = await deleteConfDate(param);
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
        let result = '';
        if (item.overwrite === 'last_day_of_month') {
          result = moment().endOf('month').format(item.name);
        } else if (item.overwrite === 'first_day_of_month') {
          result = moment().startOf('month').format(item.name);
        } else {
          result = moment().format(item.name);
        }
        result = result.toString().toUpperCase();
        return {
          ...item,
          result_date: result,
          used_in_layout: item.used_in_layout || '',
        };
      });
    },
  },
};
</script>

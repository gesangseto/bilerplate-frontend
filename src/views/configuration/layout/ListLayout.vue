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
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatDatas"
            :actionProperty="{ print: btn_print }"
            :filterAction="customActionFilter"
            :status_code="'mst_product'"
            :action="['copy', 'print', 'read', 'update', 'delete']"
            :filterBy="['All', 'id', 'packaging_level']"
            removeTrxDate
            v-on:handlePrint="selected_data = $event"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleCopy="addNew($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
      </CCard>
    </CCol>
    <ModalPrintLabelDummy
      :item="selected_data"
      v-on:onClose="selected_data = {}"
    />
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
      btn_print: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'print',
        text: '',
        tooltip: 'Print Label',
        useHref: false, //digunakan agar tidak terbuka link, biasanya digunakan untuk tombol print/download
      },
      totalData: 0,
      items: [],
      selected_data: {},
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
    customActionFilter(item) {
      let action = ['read', 'copy', 'update', 'delete'];
      if (item.allow_print) {
        action.push('print');
      }
      this.btn_print.color = 'warning';
      return action;
    },
    protectCreateData(_res) {
      let max = getLimitation('total_conf_layout');
      let count = _res.grand_total - _res.grand_total_is_sys;
      if (max) {
        if (max <= count) {
          this.can_create = false;
        }
      }
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getConfLayout(filter);
      this.items = [];
      if (res) {
        this.totalData = res.grand_total;
        for (const it of res.data) {
          if (it.packaging_level > 1) it.allow_print = true;
          else it.allow_print = false;
          this.items.push(it);
        }
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

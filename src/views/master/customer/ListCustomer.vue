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
import {
  deleteMstCustomer,
  getMstCustomer,
} from '../../../resource/MstCustomer';
import { calculatePaginationV3, exportDataV3 } from '../../../utils';

export default {
  name: 'ListCustomer',
  mounted() {
    this.page = 1;
  },
  data() {
    return {
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
        },
        {
          key: 'pic',
          label: 'Person In Charge',
        },
        {
          key: 'tlp',
          label: 'Phone No',
        },
        {
          key: 'tlp_alt',
          label: 'Alternative Phone No',
        },
        {
          key: 'address',
          label: 'Address',
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
      let res = await getMstCustomer(filter);
      if (!res.error) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
    },

    handleClickExport(type) {
      exportDataV3({
        param: this.filter,
        exportType: type,
        url: '/v3/master/customer',
      });
    },
    rowUpdate(item) {
      this.$router.push({
        path: `customer/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `customer/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `customer/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteMstCustomer(param);
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
        let addr = '';
        if (item.address) addr = `${item.address.substring(0, 30)}`;
        return {
          ...item,
          tlp: item.tlp ?? '',
          tlp_alt: item.tlp_alt ?? '',
          address: addr,
        };
      });
    },
  },
};
</script>

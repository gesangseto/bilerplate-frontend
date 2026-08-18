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
  calculatePaginationV3,
  exportDataV3,
  getLimitation,
} from '../../../utils';
import {
  deleteMstWarehouse,
  getMstWarehouse,
} from '../../../resource/MstWarehouse';

export default {
  name: 'ListWarehouse',

  mounted() {
    this.page = 1;
  },
  data() {
    return {
      totalData: 0,
      items: [],
      can_create: true,
      warningModal: false,
      totalWarehouseActual: 0,
      totalWarehouseLimiter: true,
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
          key: 'category_name',
          label: 'Warehouse Category',
        },
        {
          key: 'address',
        },
        {
          key: 'province_name',
          label: 'Province',
        },
        // {
        //   key: 'entity_name',
        //   label: 'Entity',
        // },
        {
          key: 'status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:17%',
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
      let max = getLimitation('total_wh');
      let count = _res.grand_total - _res.grand_total_is_sys;
      if (max) {
        if (max <= count) {
          this.can_create = false;
        }
      }
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getMstWarehouse(filter);
      if (!res.error) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
      this.protectCreateData(res);
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v3/master/warehouse',
      });
    },
    rowUpdate(item) {
      this.$router.push({
        path: `warehouse/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `warehouse/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `warehouse/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id, reason: item?.reason || '' };
        let _res = await deleteMstWarehouse(param);
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
          code: item.code || '',
        };
      });
    },
  },
};
</script>

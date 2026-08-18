<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader id="card-header">
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
            :filterAction="customActionFilter"
            :action="['copy', 'read', 'update', 'delete']"
            :filterBy="['All', 'mst_product_category_id']"
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
import { deleteMstProduct, getMstProduct } from '../../../resource/MstProduct';
import { exportDataV3, getUserId } from '../../../utils';

export default {
  name: 'ListProduct',

  mounted() {},
  watch: {
    $route: {
      deep: true,
      handler(route) {
        let query = route.query;
        this.loadData({ ...query });
      },
    },
  },
  data() {
    return {
      user_id: getUserId(),
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'itemNo',
          label: 'Item No ERP',
        },
        {
          key: 'name',
          label: 'Product Name',
        },
        {
          key: 'gtin',
          label: 'L1 GTIN',
        },
        {
          key: 'nie',
          label: 'NIE',
        },
        {
          key: 'product_category_name',
          label: 'Category',
        },
        {
          key: 'packagingl2_name',
          label: 'L2 Pkg',
        },
        {
          key: 'qty_packagingl2',
          label: 'L2 Qty Cnt',
        },
        {
          key: 'product_type',
          label: 'Product Type',
          sorter: false,
          filter: false,
        },
        {
          key: 'status',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'show_status',
          label: 'Show',
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
  methods: {
    customActionFilter(item) {
      let action = ['create', 'read', 'update', 'copy', 'delete'];
      // if (this.user_id == 0) {
      //   action.push('copy');
      // }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getMstProduct(filter);
      if (!res.error) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v3/master/product',
      });
    },
    rowUpdate(item) {
      this.$router.push({
        path: `product/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `product/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `product/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id, reason: item?.reason || '' };
        let _res = await deleteMstProduct(param);
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
          packagingl2_name: item.packagingl2_name || '-',
          qty_packagingl2: item.qty_packagingl2 || '-',
          show_status: item.show_status ? 'Yes' : 'No',
          itemNo: item.no,
          product_type: item.product_type == 0 ? 'Serial' : 'Non-Serial',
          categoryName: item.category ? item.category.name : '',
          packagingL1Name: item.packagingL1 ? item.packagingL1.name : '',
          gtin: item.gtin ? item.gtin : '',
        };
      });
    },
  },
};
</script>

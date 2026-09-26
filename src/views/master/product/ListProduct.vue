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
            :action="['copy', 'read', 'update', 'delete']"
            :filterBy="['All']"
            v-on:handleDelete="deleteRow($event)"
            v-on:handleUpdate="rowUpdate($event)"
            v-on:handleCopy="addNew($event)"
            v-on:handleReload="loadData($event)"
          />
        </CCardBody>
        <CCardFooter>
          <div class="float-right">
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
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { deleteMstProduct, getMstProduct } from '../../../resource/MstProduct';
import { exportDataV3 } from '../../../utils';

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
          label: 'Product Name',
        },
        {
          key: 'description',
          label: 'Description',
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
  methods: {
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
        url: '/v1/master/product',
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
        let param = { id: item.id };
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
          description: item.description || '-',
        };
      });
    },
  },
};
</script>
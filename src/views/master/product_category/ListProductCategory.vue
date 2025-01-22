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
        <CCardBody
          ><!-- :filter="[
              'All',
              'Product',
              'Warehouse',
              'Supplier',
              'Customer',
              'User',
              'Approval',
              'Exp Date',
              'Min Stock',
              'Max Stock',
              'Production',
              'Distribution',
              'Release',
            ]" -->
          <HeaderFilterDefault
            :save_filtering="true"
            status_code="mst_product_category"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <div id="printMe">
            <CDataTable
              hover
              striped
              sorter
              border
              :items="items"
              :fields="fields"
              style="font-size: 12px"
            >
              <template #action="{ item, index }">
                <td>
                  <ButtonPermission
                    :permission="'delete'"
                    @click="deleteRow(item, index)"
                  />
                  <ButtonPermission
                    :id="item.id"
                    :useHref="true"
                    :permission="'update'"
                    @click="rowUpdate(item, index)"
                  />
                  <ButtonPermission
                    :id="item.id"
                    :useHref="true"
                    :permission="'read'"
                    @click="rowRead(item, index)"
                  />
                </td>
              </template>
            </CDataTable>
          </div>
          <template>
            <CPagination
              :activePage.sync="filter.page"
              :pages="filter.totalPages"
              size="sm"
              align="center"
              @update:activePage="pageChange"
            />
          </template>
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
  getMstProductCategory,
  deleteMstProductCategory,
} from '../../../resource/MstProductCategory';
import { calculatePaginationV3, exportDataV3 } from '../../../utils';

export default {
  name: 'ListProductCategory',

  mounted() {
    this.page = 1;
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        StartDate: '',
        EndDate: '',
      },
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
          _style: 'width:20%',
        },
        { key: 'description' },
        {
          key: 'status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:20%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData() {
      let res = await getMstProductCategory(this.filter);

      if (!res.error) {
        this.items = res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      }
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.loadData();
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.filter,
        exportType: type,
        url: '/v3/master/product-category',
      });
    },
    pageChange(page) {
      this.filter.page = page;
      this.loadData();
    },
    handleChangeSize($event) {
      this.filter.limit = $event;
      this.filter.page = 1;
      this.loadData();
    },
    rowUpdate(item) {
      this.$router.push({
        path: `product_category/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `product_category/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({ path: `product_category/create` });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteMstProductCategory(param);
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
};
</script>

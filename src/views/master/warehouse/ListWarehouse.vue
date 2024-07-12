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
          <h5>Warehouse</h5>
        </CCardHeader>
        <CCardBody>
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
            status_code="mst_customer"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CDataTable
            border
            hover
            striped
            sorter
            :items="warehouses"
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
import { calculatePaginationV3, exportDataV3, getConfig } from '../../../utils';
import {
  deleteMstWarehouse,
  getMstWarehouse,
} from '../../../resource/MstWarehouse';

export default {
  name: 'ListWarehouse',

  mounted() {
    this.page = 1;
    this.loadData();
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
      can_create: true,
      warningModal: false,
      items: [],
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
        {
          key: 'entity_name',
          label: 'Entity',
        },
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
  methods: {
    protectCreateData() {
      let conf = getConfig();
      console.log(conf);
      if (conf.total_wh) {
        if (conf.total_wh <= this.items.length) {
          this.can_create = false;
        }
      }
    },
    async loadData() {
      let res = await getMstWarehouse(this.filter);
      if (!res.error) {
        this.items = res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      }
      this.protectCreateData();
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.loadData();
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.filter,
        exportType: type,
        url: '/v3/master/warehouse',
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
        let param = { id: item.id };
        let _res = await deleteMstWarehouse(param);
        this.$isLoading(false);
        this.$toast.open({
          message: _res.error
            ? `${_res.message}`
            : 'Data has been deleted succesfully',
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
    warehouses() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

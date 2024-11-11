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
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
            :save_filtering="true"
            status_code="mst_customer"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <div class="table-responsive">
            <CDataTable
              hover
              striped
              sorter
              :items="renderList"
              :fields="fields"
              class="data-table"
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
                  <ButtonPermission
                    :buttonProperty="btn_copyProp"
                    :permission="'create'"
                    @click="addNew()"
                    :id="item.id"
                    :useHref="true"
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
          <!-- <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          /> -->
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import moment from 'moment';
import { deleteConfLayout, getConfLayout } from '../../../resource/ConfLayout';
import { calculatePaginationV3, exportData, getConfig } from '../../../utils';

export default {
  name: 'Customer',
  mounted() {
    this.page = 1;
  },
  data() {
    return {
      can_create: true,
      btn_copyProp: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'copy',
        text: '',
        tooltip: 'Copy data',
      },
      filter: {
        page: 1,
        limit: 10,
        StartDate: '',
        EndDate: '',
        totalPages: 1,
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
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
  },
  methods: {
    protectCreateData(_res) {
      let conf = getConfig();
      if (conf.total_conf_layout) {
        if (conf.total_conf_layout <= _res.grand_total) {
          this.can_create = false;
        }
      }
    },
    async loadData() {
      let _res = await getConfLayout(this.filter);
      if (_res) {
        this.items = _res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: _res,
        });
      }
      this.protectCreateData(_res);
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.loadData();
    },
    handleClickExport(type) {
      exportData({ param: this.filter, exportType: type });
    },
    pageChange(page) {
      this.filter.page = page;
      this.loadData();
    },
    handleChangeSize($event) {
      this.filter.limit = $event;
      this.page = 1;
      this.loadData();
    },
    pageSizeChange($event) {
      this.size = $event;
      this.page = 1;
      this.loadData();
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
    renderList() {
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

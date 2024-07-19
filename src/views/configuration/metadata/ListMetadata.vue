<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
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
              :items="reformat"
              :fields="fields"
              class="data-table"
              style="font-size: 12px"
            >
              <template #action="{ item, index }">
                <td>
                  <Button :id="item.id" :useHref="true" :type="'update'" />
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
import { calculatePaginationV3, exportData } from '../../../utils';
import { getConfMetadata } from '../../../resource/ConfMetadata';

export default {
  name: 'ListMetadata',
  mounted() {
    this.page = 1;
    this.loadData();
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 10,
        search: '',
        totalPages: 1,
      },
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'name',
          label: 'Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'model',
          label: 'Model',
        },
        {
          key: 'total_metadata',
          label: 'Total Metadata',
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
    async loadData() {
      let _res = await getConfMetadata(this.filter);
      if (_res) {
        this.items = _res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: _res,
        });
      }
    },
    handleClickFilter(val) {
      val.search = val.searchText;
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
        path: `connector_action/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `connector_action/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `connector_action/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let _param = { id: item.id };
        let res = await deleteConfMetadata(_param);
        this.$isLoading(false);
        this.$toast.open({
          message: res.error
            ? `${res.message}`
            : 'Data has been saved succesfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res.error) this.loadData();
      }
    },
  },
  computed: {
    reformat() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

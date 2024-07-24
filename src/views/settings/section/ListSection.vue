<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader _style="padding:10px;">
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
          <CDataTable
            hover
            striped
            sorter
            border
            :items="getDataSection"
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
          <template id="card-header">
            <CPagination
              :activePage.sync="filter.page"
              :pages="filter.totalPages"
              size="sm"
              align="center"
              @update:activePage="pageChange"
            />
          </template>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { deleteMstSection, getMstSection } from '../../../resource/MstSection';
import { exportData, calculatePaginationV3, getConfig } from '../../../utils';

export default {
  name: 'Department',

  mounted() {
    this.page = 1;
  },
  data() {
    return {
      can_create: true,
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        StartDate: '',
        EndDate: '',
      },
      items: [],
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'name', label: 'Section Name' },
        { key: 'description', label: 'Section Description' },
        { key: 'department_name', label: 'Department Name' },
        { key: 'status', _classes: 'font-weight-bold' },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
        },
      ],
    };
  },
  methods: {
    protectCreateData() {
      let conf = getConfig();
      if (conf.total_section) {
        if (conf.total_section <= this.items.length) {
          this.can_create = false;
        }
      }
    },
    async loadData() {
      let _res = await getMstSection(this.filter);
      if (_res) {
        this.items = _res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: _res,
        });
      }
      this.protectCreateData();
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
      this.filter.page = 1;
      this.loadData();
    },
    rowUpdate(item) {
      this.$router.push({
        path: `section/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `section/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({ path: `section/create` });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteMstSection(param);
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
    getDataSection() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

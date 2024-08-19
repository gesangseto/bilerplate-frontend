<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
          <!-- <ButtonPermission :permission="'create'" @click="addNew()" /> -->
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
            :items="roles"
            :fields="fields"
            class="text-left"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td>
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
import { getMstSectionRole } from '../../../resource/MstSectionRole';
import { exportData, calculatePaginationV3 } from '../../../utils';

export default {
  name: 'ListRoleStation',

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
        { key: 'section_name', label: 'Section' },
        {
          key: 'department_name',
          label: 'Department',
        },
        {
          key: 'status',
          label: 'Section Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:12%',
        },
      ],
    };
  },
  methods: {
    async loadData() {
      let _res = await getMstSectionRole(this.filter);
      if (_res) {
        this.items = _res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: _res,
        });
      }
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
        path: `role-station/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `role-station/read/${item.id}`,
      });
    },
  },
  computed: {
    roles() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

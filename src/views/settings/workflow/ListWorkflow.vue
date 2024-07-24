<template>
  <CRow>
    <CCol col="12" xl="12" md="12" sm="12">
      <CCard>
        <CCardHeader _style="padding:10px;">
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
            :save_filtering="true"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->

          <CDataTable
            hover
            striped
            sorter
            border
            :items="workflowDetail"
            :fields="fields"
            class="data-table"
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
          <template>
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
import $axiosMertrack from '../../../apiMertrack';
import { exportData, calculatePaginationV3 } from '../../../utils';

export default {
  name: 'ListWorkflow',

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
          key: 'transaction_label',
          label: 'Transaction',
          _classes: 'font-weight-bold',
        },
        { key: 'approval_1_full_name', label: 'Approval 1' },
        { key: 'approval_2_full_name', label: 'Approval 2' },
        { key: 'approval_3_full_name', label: 'Approval 3' },
        { key: 'approval_4_full_name', label: 'Approval 4' },
        {
          key: 'action',
          label: 'Action',
          _classes: 'font-weight-bold',
          _style: 'width:12%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },

  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/master/workflow?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        this.items = res.data.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      });
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
      this.$router.push({ path: `workflow/update/${item.id}` });
    },
    rowRead(item) {
      this.$router.push({ path: `workflow/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `workflow/create` });
    },
  },
  computed: {
    workflowDetail() {
      var no = 0;
      return this.items.map((item) => {
        return {
          ...item,
          ['approval_1_full_name']: item['approval_1_full_name'] ?? '-',
          ['approval_2_full_name']: item['approval_2_full_name'] ?? '-',
          ['approval_3_full_name']: item['approval_3_full_name'] ?? '-',
          ['approval_4_full_name']: item['approval_4_full_name'] ?? '-',
          nomor: (no += 1),
        };
      });
    },
  },
};
</script>

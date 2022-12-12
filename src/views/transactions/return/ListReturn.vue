<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Stock Return</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <!-- :filter="[
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
              <HeaderFilterTransactionV3
                :costume_filter="[
                  {
                    value: 'type',
                    code: 'type',
                    label: 'Type',
                    data: [
                      { value: 'External', label: 'External ' },
                      { value: 'Internal', label: 'Internal ' },
                    ],
                  },
                ]"
                :filter="[
                  'All',
                  'id',
                  'product_id',
                  'to_warehouse',
                  'created_by',
                  'from_customer',
                  'from_warehouse',
                  'approval_id',
                ]"
                :order="[
                  'All',
                  'ID',
                  'product_id',
                  'type',
                  'from_customer',
                  'from_warehouse',
                  'to_warehouse',
                  'created_by',
                  'approval_id',
                ]"
                status_code="trx_return"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="stockreturn"
                :fields="fields"
                class="text-left"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <ButtonPermission
                      :permission="'read'"
                      @click="rowClicked(item, index)"
                    />
                    &nbsp;
                    <ButtonPermission
                      v-if="item.approval_id == user_id && item.status == 0"
                      :permission="'approve'"
                      @click="rowUpdateClicked(item, index)"
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
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { exportData, calculatePaginationV3 } from "../../../utils";
import { dateFilter } from "../../../constants";
export default {
  name: "ListReturn",
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
        ApiName: "ReturnWorkflowList",
        StartDate: dateFilter.last_3_month.start,
        EndDate: dateFilter.last_3_month.end,
      },
      user_id: localStorage.getItem("user_id"),
      items: [],
      tempItems: [],
      buttonStatus: null,
      dataUsers: [],
      fields: [
        {
          key: "id",
          label: "ID",
          _classes: "font-weight-bold",
        },
        {
          key: "created_date",
          label: "Trx Date",
        },
        {
          key: "product_name_batch",
          label: "Product Name [Batch No]",
        },
        {
          key: "type",
          label: "Type",
          _classes: "font-weight-bold",
        },
        {
          key: "from",
          label: "Source",
        },
        {
          key: "to",
          label: "Destination",
        },
        {
          key: "created_full_name",
          label: "Requested By",
        },
        {
          key: "status_desc",
          label: "Status",
          _classes: "font-weight-bold",
        },
        {
          key: "approval_full_name",
          label: "Next Approval",
        },
        {
          key: "action",
          label: "Action",
          sorter: false,
          filter: false,
          _style: "width:10%",
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/return?raw=true&${param}`;
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
    pageSizeChange($event) {
      this.size = $event;
      this.page = 1;
      this.loadData();
    },
    rowClicked(item) {
      this.$router.push({ path: `return/read/${item.id}` });
    },
    rowUpdateClicked(item) {
      this.$router.push({ path: `return/approve/${item.id}` });
    },
  },
  computed: {
    stockreturn() {
      return this.items.map((item) => {
        return {
          ...item,
          created_full_name: item.created_full_name || "-",
          approval_full_name: item.approval_full_name || "-",
        };
      });
    },
  },
};
</script>

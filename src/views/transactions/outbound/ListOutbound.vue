<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Outbound</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <HeaderFilterTransaction
                :costume_filter="[
                  {
                    value: 'Type',
                    code: 'Type',
                    label: 'Type',
                    data: [
                      { value: 'TRANSFER', label: 'Transfer' },
                      { value: 'PICKING', label: 'Picking' },
                      { value: 'RETURN', label: 'Return' },
                    ],
                  },
                ]"
                :filter="[
                  'All',
                  'ID',
                  'Product',
                  'source_wh',
                  'destination_wh',
                  'destination_customer',
                ]"
                :order="[
                  'All',
                  'ID',
                  'Product',
                  'Type',
                  'source_wh',
                  'destination_wh',
                  'destination_customer',
                ]"
                status_code="trx_outbound"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="dataOutbound"
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
import { exportData, toTitleCase, calculatePagination } from "../../../utils";
import { dateFilter } from "../../../constants";
export default {
  name: "ListOutbound",
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
        ApiName: "OutboundList",
        StartDate: dateFilter.last_3_month.start,
        EndDate: dateFilter.last_3_month.end,
      },
      items: [],
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
          key: "trx_id",
          label: "Trx Ref ID",
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
          key: "full_name",
          label: "Created By",
        },
        {
          key: "action",
          label: "Action",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;

      $axiosMertrack.get(`/general/web?${param}`).then((res) => {
        this.items = res.data.data;
        this.filter = calculatePagination({
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
    rowClicked(item) {
      this.$router.push({ path: `outbound/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `outbound/create` });
    },
    deleteRow(item, index) {
      this.dataOutbound.splice(index, 1);
    },
  },
  computed: {
    dataOutbound() {
      return this.items.map((item) => {
        let from = item.from_warehouse_name;
        let to = item.to_warehouse_name ?? item.customer_to_name;
        let type = toTitleCase(item.type);
        return {
          ...item,
          from: from,
          to: to,
          type: type,
        };
      });
    },
  },
};
</script>

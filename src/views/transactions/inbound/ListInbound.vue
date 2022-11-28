<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Inbound</h5>
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
                      { value: 'TRANSFER', label: 'Transfer ' },
                      { value: 'RETURN', label: 'Return ' },
                      { value: 'RETURN-EXTERNAL', label: 'Return-External' },
                      { value: 'Production', label: 'Production ' },
                      { value: 'Import', label: 'Import ' },
                      {
                        value: 'Toll Manufacturing',
                        label: 'Toll Manufacturing ',
                      },
                    ],
                  },
                ]"
                :filter="[
                  'All',
                  'ID',
                  'Product',
                  'Source Supplier',
                  'source_wh',
                  'destination_wh',
                ]"
                :order="[
                  'All',
                  'ID',
                  'Product',
                  'Type',
                  'Source Supplier',
                  'source_wh',
                  'destination_wh',
                ]"
                status_code="trx_inbound"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="inbound"
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
  name: "ListInbound",
  mounted() {
    this.pages = [10, 20, 50, 100];
    this.page = 1;
    this.size = this.pages[0];
    this.loadData();
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        ApiName: "InboundList",
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
          key: "source",
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
      this.$router.push({
        path: `inbound/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `add-inbound`,
      });
    },
    deleteRow(item, index) {
      this.dataInbound.splice(index, 1);
    },
  },
  computed: {
    inbound() {
      return this.items.map((item) => {
        let from =
          item.from_warehouse_name ?? item.supplier_name ?? item.customer_name;
        let to = item.to_warehouse_name;
        let source = item.source;
        let trx_id = item.trx_id ?? item.trx_transfer_id ?? "-";

        return {
          ...item,
          trx_id: trx_id,
          from: from,
          to: to,
          source: source,
        };
      });
    },
  },
};
</script>

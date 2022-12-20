<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Stock Opname</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransactionV3
            :filter="['All', 'id', 'warehouse_id']"
            status_code="trx_stock_opname"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CDataTable
            hover
            striped
            border
            sorter
            :items="listOpname"
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
                <ButtonPermission
                  v-if="item.status === 0"
                  :permission="'delete'"
                  :buttonProperty="btn_deleteProperty"
                  @click="modalCancel(item, index)"
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
    <!-- START REJECT MODAL -->
    <CancelModal
      type="cancel"
      :property="cancelProperty"
      v-on:handleSubmit="handleCancel()"
    />
    <!-- END REJECT MODAL -->
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { calculatePaginationV3, exportDataV3 } from "../../../utils";
import { dateFilter } from "../../../constants";

export default {
  name: "ListStockOpname",
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
        StartDate: dateFilter.last_3_month.start,
        EndDate: dateFilter.last_3_month.end,
      },
      btn_deleteProperty: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "window-close",
        text: "",
        tooltip: "Cancel",
      },
      cancelProperty: {
        title: "Stock Opname",
        modal: false,
        id: null,
        reason: "",
      },
      items: [],
      listProvince: [],
      listEntity: [],
      fields: [
        { key: "id", label: "ID", _classes: "font-weight-bold" },
        { key: "created_date", label: "Stock Opname Date" },
        { key: "warehouse_name", label: "Warehouse Name" },
        { key: "status_desc", label: "Status", _classes: "font-weight-bold" },
        { key: "action", label: "Action" },
      ],
    };
  },
  methods: {
    modalCancel(item, index) {
      this.cancelProperty.modal = true;
      this.cancelProperty.id = item.id;
    },
    handleCancel() {
      let body = {
        id: this.cancelProperty.id,
        reason: this.cancelProperty.reason,
        approved: false,
      };
      $axiosMertrack
        .post(`/v3/transaction/stock-opname`, body)
        .then((result) => {
          this.loadData();
          this.$toast.open({
            message: result.data.error
              ? result.data.message
              : `Transaction has been canceled succesfully`,
            type: result.data.error == true ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
        })
        .catch((err) => {
          this.$toast.open({
            message: `Error : ${err}`,
            type: "error",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
        });
      this.cancelProperty.id = null;
      this.cancelProperty.reason = "";
      this.cancelProperty.modal = false;
    },

    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/stock-opname?raw=true&${param}`;
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
      exportDataV3({
        param: this.filter,
        exportType: type,
        url: "/v3/transaction/stock-opname",
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
    rowClicked(item) {
      this.$router.push({ path: `stock_opname/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `stock_opname/create` });
    },
  },
  computed: {
    listOpname() {
      return this.items.map((item) => {
        let status = "Pending";
        if (item.status == 1) {
          status = "Done";
        } else if (item.status == 2) {
          status = "Canceled";
        }
        return {
          ...item,
          status_desc: status,
        };
      });
    },
  },
};
</script>

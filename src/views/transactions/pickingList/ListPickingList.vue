<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Picking List</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransactionV3
            :filter="['All', 'id', 'warehouse_id', 'customer_id']"
            status_code="trx_picking"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->

          <div class="table-responsive">
            <CDataTable
              hover
              striped
              sorter
              border
              :items="list"
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
                    v-if="item.status === 0 || item.status === 99"
                    :permission="'delete'"
                    :buttonProperty="btn_deleteProperty"
                    @click="modalCancel(item, index)"
                  />
                  <ButtonPermission
                    v-if="item.status === 99"
                    :buttonProperty="btn_updateProperty"
                    :permission="'update'"
                    @click="rowUpdate(item, index)"
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
import {
  exportData,
  calculatePagination,
  calculatePaginationV3,
  exportDataV3,
} from "../../../utils";
import { dateFilter } from "../../../constants";
export default {
  name: "ListPickingList",
  mounted() {
    this.pages = [10, 20, 50, 100];
    this.page = 1;
    this.size = this.pages[0];
    this.loadData();
  },
  data() {
    return {
      btn_deleteProperty: {
        size: "sm",
        class: "float-right",
        color: "danger",
        icon: "window-close",
        tooltip: "Cancel",
      },
      btn_updateProperty: {
        size: "sm",
        class: "float-right",
        color: "success",
        icon: "edit",
        text: "DO",
        tooltip: "Input DO",
      },
      path: this.$route.path,
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalData: 0,
        StartDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].start,
        EndDate: dateFilter[process.env.VUE_APP_DEFAULT_DATE_FILTER].end,
      },
      cancelProperty: {
        title: "Picking List",
        modal: false,
        id: null,
        reason: "",
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
          label: "Product Name [Batch No, Qty]",
        },
        {
          key: "so_number",
          label: "SO No",
        },
        {
          key: "so_date",
          label: "SO Date",
        },
        {
          key: "erp_number",
          label: "ERP Picking List",
        },
        {
          key: "warehouse_name",
          label: "Warehouse",
        },
        {
          key: "customer_name",
          label: "Customer",
        },
        {
          key: "status_desc",
          label: "Status",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          label: "Action",
          _style: "width:11%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/transaction/picking?raw=true&${param}`;

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
        alert: true,
        param: this.filter,
        exportType: type,
        url: "/v3/transaction/picking",
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
    addNew() {
      this.$router.push({ path: `${this.path}/create` });
    },
    rowClicked(item) {
      this.$router.push({ path: `${this.path}/read/${item.id}` });
    },
    rowUpdate(item) {
      this.$router.push({ path: `${this.path}/update/${item.id}` });
    },
    modalCancel(item) {
      this.cancelProperty.modal = true;
      this.cancelProperty.id = item.id;
    },
    handleCancel() {
      let data = {
        id: this.cancelProperty.id,
        approved: false,
        reason: this.cancelProperty.reason,
      };
      this.$isLoading(true);
      $axiosMertrack
        .post("/v3/transaction/picking", data)
        .then((result) => {
          this.$isLoading(false);
          this.loadData();
          this.$toast.open({
            message: result.data.error
              ? `${result.data.message}`
              : "Transaction has been canceled succesfully",
            type: result.data.error ? "error" : "success",
            dissmissible: true,
            position: "top-right",
            duration: 5000,
          });
        })
        .catch((err) => {
          this.$isLoading(false);
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
  },
  computed: {
    list() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

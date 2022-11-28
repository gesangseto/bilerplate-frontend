<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            v-if="can_add_warehouse"
            :permission="'create'"
            @click="addNew()"
          />
          <h5>Warehouse</h5>
        </CCardHeader>
        <CCardBody>
          <!-- INI BATAS HEADER TABLE -->
          <HeaderFilterDefault
            status_code="mst_customer"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CDataTable
            border
            hover
            striped
            sorter
            :items="warehouses"
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
                  :permission="'update'"
                  @click="rowUpdate(item, index)"
                />
                <ButtonPermission
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
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import { exportData } from "../../../utils";
import { calculatePagination } from "../../../utils";

export default {
  name: "ListWarehouse",

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
        ApiName: "WarehouseList",
        StartDate: "",
        EndDate: "",
      },
      can_add_warehouse: false,
      warningModal: false,
      items: [],
      totalWarehouseActual: 0,
      totalWarehouseLimiter: true,
      fields: [
        {
          key: "name",
          label: "Name",
          _classes: "font-weight-bold",
        },
        {
          key: "category_name",
          label: "Warehouse Category",
        },
        {
          key: "address",
        },
        {
          key: "mst_province_name",
          label: "Province",
        },
        {
          key: "mst_warehouse_entity_name",
          label: "Entity",
        },
        {
          key: "status",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          label: "Action",
          _classes: "font-weight-bold",
          _style: "width:17%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    protectCreateWarehouse() {
      let param = `ApiName=GetConfig`;
      $axiosMertrack.get(`/general/web?${param}`).then((res) => {
        if (res.data.data && res.data.data[0]) {
          if (res.data.data[0].total_wh > this.items.length) {
            this.can_add_warehouse = true;
          }
        }
      });
    },
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      $axiosMertrack.get(`/general/web?${param}`).then((res) => {
        this.items = res.data.data;
        if (res.data.total != 0) {
          this.protectCreateWarehouse();
          this.filter = calculatePagination({
            filter: this.filter,
            item: res,
          });
        }
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
      this.$router.push({
        path: `warehouse/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `warehouse/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `warehouse/create`,
      });
    },
    deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = {
          ApiName: "DeleteWarehouse",
          Params: {
            id: item.id,
          },
        };
        $axiosMertrack
          .post("/general/web", param)
          .then((result) => {
            this.$isLoading(false);
            this.loadData();
            this.$toast.open({
              message: result.data.error
                ? `${result.data.message}`
                : "Data has been deleted succesfully",
              type: result.data.error ? "error" : "success",
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
      }
    },
  },
  computed: {
    warehouses() {
      return this.items.map((item) => {
        return {
          ...item,
        };
      });
    },
  },
};
</script>

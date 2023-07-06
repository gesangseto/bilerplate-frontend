<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            :permission="'create'"
            @click="addNew()"
            :useHref="true"
          />
          <h5>Customer</h5>
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
              border
              :items="customers"
              :fields="fields"
              class="data-table"
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
  </CRow>
</template>

<script>
import {
  deleteMstCustomer,
  getMstCustomer,
} from "../../../resource/MstCustomer";
import { calculatePaginationV3, exportDataV3 } from "../../../utils";
import { getMstSupplier } from "../../../resource/MstSupplier";

export default {
  name: "ListCustomer",
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
        StartDate: "",
        EndDate: "",
      },
      items: [],
      fields: [
        {
          key: "name",
          label: "Name",
          _classes: "font-weight-bold",
        },
        {
          key: "pic",
          label: "Person In Charge",
        },
        {
          key: "tlp",
          label: "Phone No",
        },
        {
          key: "tlp_alt",
          label: "Alternative Phone No",
        },
        {
          key: "address",
          label: "Address",
        },
        {
          key: "status",
          label: "Status",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          label: "Action",
          _style: "width:15%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData() {
      let res = await getMstCustomer(this.filter);
      if (!res.error) {
        this.items = res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: res,
        });
      }
    },
    handleClickFilter(val) {
      this.filter = Object.assign(this.filter, val);
      this.loadData();
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.filter,
        exportType: type,
        url: "/v3/master/customer",
      });
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
        path: `customer/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `customer/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `customer/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data (Name: ${item.name}).\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteMstCustomer(param);
        this.$isLoading(false);
        this.$toast.open({
          message: _res.error
            ? `${_res.message}`
            : "Data has been deleted succesfully",
          type: _res.error ? "error" : "success",
          dissmissible: true,
          position: "top-right",
          duration: 5000,
        });
        if (!_res.error) this.loadData();
      }
    },
  },
  computed: {
    customers() {
      return this.items.map((item) => {
        let addr = "";
        if (item.address) addr = `${item.address.substring(0, 30)}`;
        return {
          ...item,
          tlp: item.tlp ?? "",
          tlp_alt: item.tlp_alt ?? "",
          address: addr,
        };
      });
    },
  },
};
</script>

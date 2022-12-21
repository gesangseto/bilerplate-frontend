<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard id="print-hide">
        <CCardHeader>
          <ButtonPermission :permission="'create'" @click="addNew()" />
          <h5>Packing</h5>
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
                :filter="['All', 'id', 'product_id', 'warehouse_id']"
                status_code="trx_pack"
                v-on:handleClickFilter="handleClickFilter($event)"
                v-on:handleChangeSize="handleChangeSize($event)"
              />
              <!-- INI BATAS HEADER TABLE -->
              <CDataTable
                hover
                striped
                sorter
                border
                :items="repack"
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
import { calculatePaginationV3, exportDataV3 } from "../../../utils";
import { dateFilter } from "../../../constants";
export default {
  name: "ListPacking",
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
          key: "_warehouse.name",
          label: "Warehouse",
        },
        {
          key: "gtin_cp",
          label: "GTIN / CP",
        },
        {
          key: "serial",
          label: "Packing SN",
        },
        {
          key: "packaging_level",
          label: "Pkg Level",
        },
        {
          key: "packaging_name",
          label: "Pkg Name",
        },
        {
          key: "_created.full_name",
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
      let url = `/v3/transaction/packing?raw=true${param}`;
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
        url: "/v3/transaction/packing",
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
      this.$router.push({ path: `packing/read/${item.id}` });
    },
    addNew() {
      this.$router.push({ path: `packing/create` });
    },
  },

  computed: {
    repack() {
      return this.items.map((item) => {
        // END OF EDITED BY GESANG
        let gtin_cp = "<view for detail>";
        let serial = "<view for detail>";
        if (item.child_count == 1) {
          gtin_cp =
            item.epc_type == "sscc" ? item.company_prefix : item.gtin_sscc;
          serial = item.serial;
        }
        return {
          ...item,
          gtin_cp: gtin_cp,
          serial: serial,
          ["_created.full_name"]: item["_created.full_name"] || "-",
        };
      });
    },
  },
};
</script>
<style scoped>
#printMe {
  visibility: hidden;
  position: absolute;
}
@media print {
  #printMe {
    visibility: visible;
    position: fixed;
    top: 0;
    width: 150px;
    height: 150px;
    z-index: 9999;
  }
  #print-hide {
    visibility: hidden;
    position: absolute;
  }
  header {
    visibility: hidden;
    width: 0;
    position: absolute;
  }
}
</style>

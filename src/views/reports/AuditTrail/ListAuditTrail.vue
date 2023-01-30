<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>Audit Trail</h5>
        </CCardHeader>
        <CCardBody>
          <HeaderFilterTransactionV3
            :filter="['All', 'created_by']"
            v-on:handleClickFilter="handleClickFilter($event)"
            v-on:handleChangeSize="handleChangeSize($event)"
          />
          <!-- INI BATAS HEADER TABLE -->
          <CDataTable
            hover
            striped
            sorter
            border
            :items="dataTableItem"
            :fields="fields"
            class="text-left"
            style="font-size: 12px"
          >
            <template #action="{ item, index }">
              <td>
                <ButtonPermission
                  :permission="'read'"
                  @click="rowViewClicked(item, index)"
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
          <!-- <ButtonPermission
            exportType="excel"
            :permission="'print'"
            @click="handleClickExport('xls')"
          />
          <ButtonPermission
            exportType="pdf"
            :permission="'print'"
            @click="handleClickExport('pdf')"
          /> -->
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axiosMertrack from "../../../apiMertrack";
import {
  capitalizeFirstLetter,
  exportDataReport,
  calculatePagination,
} from "../../../utils";
import { dateFilter } from "../../../constants";
import { get_log } from "../../../dummy_data";

export default {
  name: "ListAuditTrail",
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
        // StartDate: dateFilter.last_3_month.start,
        // EndDate: dateFilter.last_3_month.end,
      },
      items: [],
      fields: [
        {
          key: "no",
          label: "No",
        },
        {
          key: "created_date",
          label: "Created",
          _classes: "font-weight-bold",
        },
        {
          key: "created_full_name",
          label: "Access By",
          _classes: "font-weight-bold",
        },
        {
          key: "_action",
          label: "Method",
          _classes: "font-weight-bold",
        },
        {
          key: "path",
          label: "Path",
          _classes: "font-weight-bold",
        },
        {
          key: "ip_address",
          label: "IP",
          _classes: "font-weight-bold",
        },
        {
          key: "user_agent",
          label: "Agent",
          _classes: "font-weight-bold",
        },
        {
          key: "action",
          label: "Action",
          _style: "width:10%",
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    loadData() {
      let param = `${new URLSearchParams(this.filter).toString()}`;
      let url = `/v3/system/audit-trail?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
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
      exportDataReport({ param: this.filter, exportType: type });
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
    getNumber(num) {
      num = (this.filter.page - 1) * this.filter.limit + num;
      return num;
    },
    rowViewClicked(item) {
      this.$router.push({ path: `audit_trail/read/${item.id}` });
    },
  },
  computed: {
    dataTableItem() {
      return this.items.map((item, index) => {
        return {
          ...item,
          _action: item.action,
          no: this.getNumber(index + 1),
          type: capitalizeFirstLetter(item.type),
          dep_sec: item.department_name + " - " + item.section_name,
        };
      });
    },
  },
};
</script>

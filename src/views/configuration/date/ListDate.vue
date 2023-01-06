<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <strong>List Date</strong>
          <ButtonPermission :permission="'create'" @click="addNew()" />
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
              :items="list_item"
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
import { calculatePagination, exportData } from "../../../utils";
import { get_date, get_layout } from "../../../dummy_data";
import moment from "moment";

export default {
  name: "Date_Configuration",
  mounted() {
    this.loadData();
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
        ApiName: "GetWeb_DateFormat",
        // StartDate: dateFilter.last_3_month.start,
        // EndDate: dateFilter.last_3_month.end,
      },
      items: [],
      fields: [
        {
          key: "df_id",
          label: "ID",
          _classes: "font-weight-bold",
        },
        {
          key: "df_name",
          label: "Format",
          _classes: "font-weight-bold",
        },
        {
          key: "created_date",
          label: "Created Date",
        },
        {
          key: "df_override",
          label: "Override",
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
    loadData() {
      // let data = get_date();
      // this.items = data;
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
      this.page = 1;
      this.loadData();
    },
    pageSizeChange($event) {
      this.size = $event;
      this.page = 1;
      this.loadData();
    },
    rowUpdate(item) {
      let id = item.df_id;
      this.$router.push({
        path: `date/update/${id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `date/read/${item.df_id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `date/create`,
      });
    },
    deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        let param = {
          ApiName: "PostWeb_DeleteDateFormat",
          Params: {
            df_id: item.df_id,
          },
        };
        this.$isLoading(true);
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
    list_item() {
      return this.items.map((item) => {
        let ex = moment().format(`${item.format}`);
        return {
          ...item,
          example: ex,
        };
      });
    },
  },
};
</script>

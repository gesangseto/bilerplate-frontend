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
          <h5>Date Format</h5>
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
import { calculatePaginationV3, exportData } from '../../../utils';
import { deleteConfDate, getConfDate } from '../../../resource/ConfDate';
import moment from 'moment';

export default {
  name: 'Date_Configuration',
  mounted() {
    this.loadData();
  },
  data() {
    return {
      filter: {
        page: 1,
        limit: 10,
        totalPages: 1,
      },
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'name',
          label: 'Format',
          _classes: 'font-weight-bold',
        },
        {
          key: 'overwrite',
          label: 'Overwrite',
        },
        {
          key: 'result_date',
          label: 'Result',
        },
        {
          key: 'used_in_layout',
          label: 'Used In Layout',
          _style: 'width:30%',
        },
        {
          key: 'status',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:15%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData() {
      let _res = await getConfDate(this.filter);
      if (_res) {
        this.items = _res.data;
        this.filter = calculatePaginationV3({
          filter: this.filter,
          item: _res,
        });
      }
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
      this.$router.push({
        path: `date/update/${item.id}`,
      });
    },
    rowRead(item) {
      this.$router.push({
        path: `date/read/${item.id}`,
      });
    },
    addNew() {
      this.$router.push({
        path: `date/create`,
      });
    },
    async deleteRow(item) {
      let message = `You are about to delete to this data.\nThis operation cannot be undone. Would you like to continue?`;
      if (confirm(message)) {
        this.$isLoading(true);
        let param = { id: item.id };
        let _res = await deleteConfDate(param);
        this.$isLoading(false);
        this.$toast.open({
          message: _res.error
            ? `${_res.message}`
            : 'Data has been deleted succesfully',
          type: _res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!_res.error) this.loadData();
      }
    },
  },
  computed: {
    list_item() {
      return this.items.map((item) => {
        let result = '';
        if (item.overwrite === 'last_day_of_month') {
          result = moment().endOf('month').format(item.name);
        } else if (item.overwrite === 'first_day_of_month') {
          result = moment().startOf('month').format(item.name);
        } else {
          result = moment().format(item.name);
        }
        result = result.toString().toUpperCase();
        return {
          ...item,
          result_date: result,
          used_in_layout: item.used_in_layout || '',
        };
      });
    },
  },
};
</script>

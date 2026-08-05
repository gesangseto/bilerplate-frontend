<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <TableTransaction
                :totalData="totalData"
                :fields="fields"
                :items="reformatItems"
                :filterAction="customActionFilter"
                :status_code="'trx_sampling'"
                :action="['read', 'approve']"
                :filterBy="[
                  'All',
                  'id',
                  'product_id',
                  'warehouse_id',
                  'requested_by',
                  'approval_id',
                ]"
                v-on:handleReload="loadData($event)"
              />
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
import $axios from '../../../api';
import { exportDataV3, getSectionId } from '../../../utils';
export default {
  name: 'Sampling',
  mounted() {},
  data() {
    return {
      section_id: getSectionId(),
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'created_date',
          label: 'Trx Date',
        },
        {
          key: 'product_name_batch',
          label: 'Product Name [Batch No]',
        },
        {
          key: 'warehouse_name',
          label: 'Warehouse',
        },
        {
          key: 'created_full_name',
          label: 'Requested By',
        },
        {
          key: 'status_desc',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'approval_name',
          label: 'Next Approval',
        },
        {
          key: 'action',
          label: 'Action',
          sorter: false,
          _style: 'width:10%',
          filter: false,
        },
      ],
    };
  },
  methods: {
    customActionFilter(item) {
      let action = ['read'];
      if (item.approval_id == this.section_id && item.status == 0) {
        action.push('approve');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v1/transaction/sampling?raw=true&${param}`;
      $axios.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: this.$route.query,
        exportType: type,
        url: '/v1/transaction/sampling',
      });
    },
    rowViewClicked(item) {
      this.$router.push({ path: `indirect_request/read/${item.id}` });
    },
    rowUpdateClicked(item) {
      this.$router.push({ path: `indirect_request/approve/${item.id}` });
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          status_desc: item.status_desc || 'Unkwon Status',
          created_full_name: item.created_full_name || '-',
          approval_name: item.approval_name || '-',
        };
      });
    },
  },
};
</script>

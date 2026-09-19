<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :action="[]"
            :filterBy="['All', 'id', 'status']"
            removeTrxDate
            v-on:handleReload="loadData($event)"
          >
            <template #extra-action="{ item, index }">
              <Button
                v-c-tooltip="'View'"
                :type="'read'"
                @click="rowClicked(item, index)"
                class="float-right"
              />
            </template>
          </TableTransaction>

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
import $axios from '../../api';
import { exportDataV3 } from '../../utils';

export default {
  name: 'ReportSession',
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'session_no',
          label: 'Session No',
          _classes: 'font-weight-bold',
        },
        { key: 'country', label: 'Country' },
        { key: 'currency_code', label: 'Currency' },
        { key: 'currency', label: 'Rate (IDR)' },
        { key: 'start_session_date', label: 'Start Date' },
        { key: 'finish_session_date', label: 'Finish Date' },
        { key: 'status', label: 'Status' },
        { key: 'total_items', label: 'Items' },
        { key: 'total_quantity', label: 'Qty' },
        { key: 'total_customers', label: 'Customers' },
        { key: 'total_selling_price', label: 'Selling (IDR)' },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:10%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      $axios.get(`/v1/jastip/report/session?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.count || 0;
        this.items = res.data || [];
      });
    },
    rowClicked(item) {
      this.$router.push({ path: `/report/session/${item.id}` });
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v1/jastip/report/session',
      });
    },
    formatCurrency(val) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(val);
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          country: item.country || '-',
          currency_code: item.currency_code || '-',
          currency: item.currency ? Number(item.currency) : '-',
          start_session_date: item.start_session_date || '-',
          finish_session_date: item.finish_session_date || '-',
          total_selling_price: item.total_selling_price
            ? this.formatCurrency(item.total_selling_price)
            : '-',
        };
      });
    },
  },
};
</script>
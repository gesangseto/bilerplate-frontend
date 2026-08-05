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
                :status_code="'trx_inbound'"
                :action="['read']"
                :filterBy="[
                  'All',
                  'id',
                  'product_id',
                  'source_supplier',
                  'destination_warehouse',
                ]"
                :costumeFilter="[
                  {
                    value: 'Type',
                    code: 'Type',
                    label: 'Type',
                    data: [
                      // { value: 'Transfer', label: 'Transfer' },
                      { value: 'Picking', label: 'Picking' },
                      // { value: 'Return', label: 'Return' },
                    ],
                  },
                ]"
                :orderFilter="[
                  'All',
                  'id',
                  'product_id',
                  'Type',
                  'source_warehouse',
                  'destination_customer',
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
import { exportDataV3, toTitleCase } from '../../../utils';
export default {
  name: 'ListOutbound',
  mounted() {},
  data() {
    return {
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
          label: 'Product Name [Batch No, L1 Qty]',
        },
        {
          key: 'type',
          label: 'Type',
          _classes: 'font-weight-bold',
        },
        {
          key: 'trx_ref_id',
          label: 'Trx Ref ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'from',
          label: 'Source',
        },
        {
          key: 'to',
          label: 'Destination',
        },
        {
          key: 'created_full_name',
          label: 'Created By',
        },
        {
          key: 'action',
          label: 'Action',
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
      let url = `/v1/transaction/outbound?raw=true&${param}`;

      $axios.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: this.$route.query,
        exportType: type,
        url: '/v1/transaction/outbound',
      });
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        let type = toTitleCase(item.type);
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          created_full_name: item.created_full_name || '-',
          type: type,
        };
      });
    },
  },
};
</script>

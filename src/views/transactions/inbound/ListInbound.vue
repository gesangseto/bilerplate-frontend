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
                    value: 'source',
                    code: 'source',
                    label: 'Type',
                    data: [
                      { value: 'Production', label: 'Production ' },
                      { value: 'Import', label: 'Import ' },
                      {
                        value: 'Toll Manufacturing',
                        label: 'Toll Manufacturing ',
                      },
                    ],
                  },
                ]"
                :orderFilter="[
                  'All',
                  'id',
                  'product_id',
                  'source',
                  'source_supplier',
                  'destination_warehouse',
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
  name: 'ListInbound',
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
          key: 'product_name',
          label: 'Product Name',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'expired_date',
          label: 'Exp Date',
        },
        {
          key: 'quantity_lvl_1',
          label: 'L1 Qty',
        },
        {
          key: 'source',
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
      $axios.get(`/v1/transaction/inbound?${param}&raw=true`).then((res) => {
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
        url: '/v1/transaction/inbound',
      });
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        let created_by = item['created_full_name'];
        let source = toTitleCase(item.source);
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          trx_ref_id: item.trx_ref_id || '-',
          source: source,
          created_full_name: created_by || '-',
        };
      });
    },
  },
};
</script>

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
            :status_code="'product_stock_serial'"
            status_code_default="1"
            :filterBy="['All', 'product_id', 'warehouse_id']"
            v-on:handleReload="loadData($event)"
          >
            <template #extra-action="{ item, index }">
              <Button
                v-c-tooltip="'View'"
                v-if="item.packaging_level > 1"
                :type="'read'"
                @click="rowClicked(item, index)"
                class="float-right"
              />
              <Button
                :type="'read'"
                v-if="item.lock_trx_id"
                v-c-tooltip="btn_2_prop.tooltip"
                :buttonProperty="btn_2_prop"
                v-on:click="showLockedStatus(item, index)"
                class="float-left"
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
    <CModal
      size="xl"
      centered="centered"
      :show.sync="viewModal"
      title="Detail"
      color="warning"
    >
      <DetailTransactionV3 v-if="viewModal == true" :item="detail_item" />
      <template #footer>
        <CButton size="sm" color="danger" type="button" @click="closeModal()">
          <CIcon name="cil-x-circle" /> Close
        </CButton>
      </template>
    </CModal>

    <ShowLockedStatus
      :property="property_lock_status"
      v-on:handleSubmit="handleCancel()"
    />
  </CRow>
</template>

<script>
import $axiosMertrack from '../../apiMertrack';
import { exportDataV3 } from '../../utils';

export default {
  name: 'ReportStock',
  mounted() {},
  data() {
    return {
      load_count: 0,
      property_lock_status: {
        modal: false,
        item: {},
      },
      btn_2_prop: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'exclamation-circle',
        text: '',
        tooltip: 'Show Locking Trx',
      },
      totalData: 0,
      filter: null,
      items: [],
      datas: [],
      detail_item: {},
      viewModal: false,
      fields: [
        {
          key: 'product_no',
          label: 'Item No',
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
          key: 'epc_key',
          label: 'EPC Key',
        },
        {
          key: 'serial',
          label: 'Serial',
        },
        {
          key: 'packaging_level',
          label: 'Pkg Level',
        },
        {
          key: 'packaging_name',
          label: 'Pkg Name',
        },
        {
          key: 'quantity',
          label: 'L1 Qty',
        },
        {
          key: 'warehouse_name',
          label: 'Warehouse',
        },
        {
          key: 'status_name',
          label: 'Status',
        },
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
      if (filter) this.filter = filter;
      this.load_count += 1;
      this.items = [];
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v4/report/item-stock?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },

    closeModal() {
      this.detail_item = {};
      this.datas = [];
      this.viewModal = false;
    },
    showLockedStatus(item) {
      this.property_lock_status.modal = true;
      this.property_lock_status.item = item;
    },
    rowClicked(item) {
      this.datas = [];
      if (item.packaging_level == 1) {
        this.$toast.open({
          message: `No detail SN data to be viewed, SN [${item.serial_id}] is Packaging L1`,
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return false;
      }
      this.detail_item = item;
      this.viewModal = true;
      return;
    },
    handleClickExport(type) {
      exportDataV3({
        alert: true,
        param: this.$route.query,
        exportType: type,
        url: '/v4/report/item-stock',
      });
    },
    getNumber(num) {
      num = (this.$route.query.page - 1) * this.$route.query.limit + num;
      return num;
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item, index) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          warehouse_name: item.warehouse_name ? item.warehouse_name : '-',
          no: this.getNumber(index + 1),
        };
      });
    },
  },
};
</script>

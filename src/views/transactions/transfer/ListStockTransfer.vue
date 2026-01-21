<template>
  <div>
    <CRow>
      <CCol col="12" xl="12">
        <CCard>
          <CCardHeader>
            <ButtonPermission
              :permission="'create'"
              @click="addNew()"
              :useHref="true"
            />
            <h5>{{ $activeMenu.name }}</h5>
          </CCardHeader>
          <CCardBody>
            <TableTransaction
              :totalData="totalData"
              :fields="fields"
              :items="reformatItems"
              :filterAction="customActionFilter"
              :actionProperty="{
                delete: btn_delete,
              }"
              :status_code="'trx_transfer'"
              :action="['read', 'delete']"
              :filterBy="[
                'All',
                'id',
                'product_id',
                'from_warehouse',
                'to_warehouse',
              ]"
              v-on:handleReload="loadData($event)"
              v-on:handleDelete="modalCancel($event)"
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- START REJECT MODAL -->
    <CancelModal
      type="cancel"
      :property="cancelProperty"
      v-on:handleSubmit="handleCancel()"
    />
    <!-- END REJECT MODAL -->
  </div>
</template>

<script>
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3 } from '../../../utils';
export default {
  name: 'ListStockTransfer',
  mounted() {},
  data() {
    return {
      cancelProperty: {
        title: 'Stock Transfer',
        modal: false,
        id: null,
        reason: '',
      },
      btn_delete: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'window-close',
        text: '',
        tooltip: 'Cancel',
      },
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
          _classes: 'font-weight-bold',
        },
        { key: 'created_date', label: 'Trx Date' },
        {
          key: 'product_name_batch',
          label: 'Product Name [Batch No]',
        },
        { key: 'from_warehouse_name', label: 'Source WH' },
        { key: 'to_warehouse_name', label: 'Destination WH' },
        { key: 'status_desc', label: 'Status', _classes: 'font-weight-bold' },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:10%',
        },
      ],
    };
  },
  methods: {
    customActionFilter(item) {
      let action = ['read'];
      if (item.status == 0) {
        action.push('delete');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v3/transaction/transfer?raw=true&${param}`;
      $axiosMertrack.get(url).then((res) => {
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
        url: '/v3/transaction/transfer',
      });
    },
    addNew() {
      this.$router.push({ path: `${this.path}/create` });
    },
    modalCancel(item, index) {
      this.cancelProperty.modal = true;
      this.cancelProperty.id = item.id;
    },
    handleCancel() {
      this.$isLoading(true);
      let reason = (this.cancelProperty.reason || '').trim();
      let data = {
        id: this.cancelProperty.id,
        approved: false,
        reason: `[CANCEL] ${reason}`,
      };

      let url = `/v3/transaction/transfer`;
      $axiosMertrack
        .post(url, data)
        .then((result) => {
          this.$isLoading(false);
          this.loadData();
          this.$toast.open({
            message: result.data.error
              ? `${result.data.message}`
              : 'Transaction has been canceled successfully',
            type: result.data.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        })
        .catch((err) => {
          this.$isLoading(false);
          this.$toast.open({
            message: `Error : ${err}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
      this.cancelProperty.id = null;
      this.cancelProperty.reason = '';
      this.cancelProperty.modal = false;
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
        };
      });
    },
  },
};
</script>

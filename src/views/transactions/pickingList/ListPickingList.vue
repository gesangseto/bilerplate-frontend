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
              update: btn_update,
            }"
            :status_code="'trx_picking'"
            :action="['read', 'delete']"
            :filterBy="['All', 'id', 'warehouse_id', 'customer_id']"
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
    <!-- START REJECT MODAL -->
    <CancelModal
      type="cancel"
      :property="cancelProperty"
      v-on:handleSubmit="handleCancel()"
    />
    <!-- END REJECT MODAL -->
  </CRow>
</template>

<script>
import moment from 'moment';
import $axiosMertrack from '../../../apiMertrack';
import { exportDataV3 } from '../../../utils';
export default {
  name: 'ListPickingList',
  mounted() {},
  data() {
    return {
      btn_delete: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'window-close',
        tooltip: 'Cancel',
      },
      btn_update: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'edit',
        text: 'DO',
        tooltip: 'Input DO',
      },
      cancelProperty: {
        title: 'Picking List',
        modal: false,
        id: null,
        reason: '',
      },
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
          key: 'so_number',
          label: 'SO No',
        },
        {
          key: 'so_date',
          label: 'SO Date',
        },
        {
          key: 'erp_number',
          label: 'ERP Picking List',
        },
        {
          key: 'warehouse_name',
          label: 'Warehouse',
        },
        {
          key: 'customer_name',
          label: 'Customer',
        },
        {
          key: 'status_desc',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:11%',
          sorter: false,
          filter: false,
        },
      ],
    };
  },
  methods: {
    customActionFilter(item) {
      let action = ['read'];
      if (item.status == 0) {
        action.push('delete');
      } else if (item.status == 99) {
        action.push('delete');
        action.push('update');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v4.2/transaction/picking?raw=true&${param}`;
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
        url: '/v3/transaction/picking',
      });
    },
    modalCancel(item) {
      this.cancelProperty.modal = true;
      this.cancelProperty.id = item.id;
    },
    handleCancel() {
      let data = {
        id: this.cancelProperty.id,
        reason: `[CANCEL] ${this.cancelProperty.reason}`,
      };
      let param = { data: { ...data } };
      this.$isLoading(true);
      $axiosMertrack
        .delete('/v4.2/transaction/picking', param)
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
          so_date: moment(item.so_date).format('YYYY-MM-DD'),
        };
      });
    },
  },
};
</script>

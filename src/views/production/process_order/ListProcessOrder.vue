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
          <h5>Process Order</h5>
        </CCardHeader>
        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :status_code="'production_batch_list'"
            :filterAction="customActionFilter"
            :action="['copy', 'read', 'update', 'delete', 'approve']"
            :actionProperty="{
              delete: btn_delete,
              copy: btn_copy,
              approve: btn_approve,
            }"
            :filterBy="['All', 'id', 'product_id']"
            :orderFilter="['All', 'id', 'product_id']"
            v-on:handleDelete="handleClickDelete($event)"
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
        </CCardBody>
      </CCard>
    </CCol>
    <!-- START DELETE MODAL -->
    <CancelModal
      type="cancel"
      :property="rejectProperty"
      v-on:handleSubmit="handleCancel()"
    />
  </CRow>
</template>

<script>
import moment from 'moment';
import {
  deleteProcessOrder,
  getProcessOrder,
} from '../../../resource/ProcessOrder';
import { exportDataV3, getUserId } from '../../../utils';

export default {
  name: 'ListSupplier',
  watch: {},
  mounted() {},
  data() {
    return {
      user_id: getUserId(),
      btn_copy: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'copy',
        text: '',
        tooltip: 'Copy data',
      },
      btn_delete: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'trash-alt',
        text: '',
        tooltip: 'Cancel',
      },
      btn_approve: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'clipboard-check',
        text: '',
        tooltip: 'Generate Serial',
      },
      rejectProperty: {
        title: 'Process Order',
        modal: false,
        id: null,
        reason: '',
      },
      totalData: 0,
      items: [],
      items: [],
      fields: [
        {
          key: 'id',
          label: 'ID',
        },
        {
          key: 'created_date',
          label: 'Trx Date',
        },
        {
          key: 'batch_no',
          label: 'Batch No',
        },
        {
          key: 'process_order_erp',
          label: 'ERP PO No',
        },
        {
          key: 'product_name',
          label: 'Product Name',
        },
        {
          key: 'product_gtin',
          label: 'L1 GTIN / NIE',
        },
        {
          key: 'generate_count_level_1',
          label: 'Target L1 Qty',
        },
        {
          key: 'status_name',
          label: 'Status',
          _classes: 'font-weight-bold',
        },
        {
          key: 'action',
          label: 'Action',
          _style: 'width:17%',
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
        action.push('approve');
        action.push('delete');
        action.push('update');
      } else if (item.status === 3) {
        action.push('delete');
      } else if (item.status === 4) {
        action.push('update');
      }
      if (this.user_id == 0) {
        action.push('copy');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let res = await getProcessOrder(filter);
      this.items = [];
      if (!res.error) {
        this.totalData = res.grand_total;
        this.items = res.data;
      }
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v4/production/process-order',
      });
    },
    rowUpdate() {},
    rowRead() {},
    addNew() {},
    handleClickDelete(item) {
      this.rejectProperty.modal = true;
      this.rejectProperty.id = item.id;
    },
    async handleCancel() {
      this.$isLoading(true);
      let param = {
        id: this.rejectProperty.id,
        approved: false,
        reason: `[CANCEL] ${this.rejectProperty.reason}`,
      };
      let _res = await deleteProcessOrder(param);
      this.rejectProperty.id = null;
      this.rejectProperty.reason = null;
      this.$isLoading(false);
      this.$toast.open({
        message: _res.error
          ? `${_res.message}`
          : 'Data has been canceled successfully',
        type: _res.error ? 'error' : 'success',
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
      if (!_res.error) this.loadData();
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          product_gtin: item.product_gtin || item.product_nie,
          created_date: moment(item.created_date).format('YYYY-MM-DD HH:mm'),
        };
      });
    },
  },
};
</script>

<style scoped>
#printMe {
  visibility: hidden;
  position: fixed;
}

@media print {
  #printMe {
    visibility: visible;
    position: fixed;
  }
}
</style>

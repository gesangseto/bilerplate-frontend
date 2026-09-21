<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonPermission
            exportType="add"
            :permission="'create'"
            @click="handleAdd()"
          />
          <h5>{{ $activeMenu.name }}</h5>
        </CCardHeader>

        <CCardBody>
          <TableTransaction
            :totalData="totalData"
            :fields="fields"
            :items="reformatItems"
            :filterAction="customActionFilter"
            :status_code="'trx_picking'"
            :action="['read', 'update']"
            :filterBy="['All', 'id', 'customer_id']"
            v-on:handleReload="loadData($event)"
          >
            <template #extra-action="{ item }">
              <ButtonPermission
                v-if="item.status == 0"
                :permission="'approve'"
                :buttonProperty="btnSend"
                :id="item.id"
                :useHref="true"
              />
              <ButtonPermission
                v-if="item.status == 2"
                :permission="'approve'"
                :buttonProperty="btnFinish"
                :useHref="false"
                @click="modalFinish(item)"
              />
              <ButtonPermission
                v-if="item.status == 2"
                :permission="'delete'"
                :buttonProperty="btnNotDelivery"
                :useHref="false"
                @click="modalCancel(item)"
              />
              <ButtonPermission
                v-if="item.status == 0 || item.status == 3"
                :permission="'delete'"
                :buttonProperty="btnCancel"
                :useHref="false"
                @click="modalCancel(item)"
              />
            </template>
          </TableTransaction>
        </CCardBody>
        <CCardFooter>
          <div class="float-right">
            <ExportButtons @export="handleClickExport" />
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
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
    <!-- START ACTION MODAL -->
    <PickingActionModal
      :property="cancelProperty"
      :item="currentItem"
      v-on:handleSubmit="handleCancel()"
    />
    <!-- END ACTION MODAL -->
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { exportDataV3, generateIdempotencyKey } from '../../../utils';
import {
  finishPicking,
  returnPicking,
  cancelPicking,
} from '../../../resource/TrxPicking';
import PickingActionModal from './PickingActionModal';

const STATUS_PICKING = {
  '-1': 'Canceled',
  0: 'Waiting',
  1: 'Done',
  2: 'In Courier',
  3: 'Returned',
};

export default {
  name: 'ListPicking',
  components: { PickingActionModal },
  data() {
    return {
      totalData: 0,
      items: [],
      cancelProperty: {
        id: null,
        modal: false,
        reason: '',
        action: 'cancel',
      },
      btnSend: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'paper-plane',
        text: '',
        tooltip: 'Send',
      },
      btnFinish: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'flag-checkered',
        text: '',
        tooltip: 'Finish',
      },
      btnNotDelivery: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'exclamation-circle',
        text: '',
        tooltip: 'Not Delivery',
      },
      btnCancel: {
        size: 'sm',
        class: 'float-right',
        color: 'danger',
        icon: 'ban',
        text: '',
        tooltip: 'Cancel',
      },
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'customer_phone', label: 'Phone' },
        { key: 'quantity', label: 'Qty' },
        { key: 'weight', label: 'Weight' },
        { key: 'courier_name', label: 'Courier' },
        { key: 'courier_number', label: 'Resi No' },
        { key: 'courier_price', label: 'Courier Price' },
        { key: 'selling_price', label: 'Selling' },
        { key: 'status_name', label: 'Status' },
        { key: 'created_full_name', label: 'Created By' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
    };
  },
  methods: {
    customActionFilter(item) {
      let action = ['read'];
      if (item.status == 0) {
        action.push('update');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      $axios.get(`/v1/jastip/picking?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    handleAdd() {
      this.$router.push({ path: '/jastip/picking/create' });
    },
    modalCancel(item) {
      this.cancelProperty = {
        id: item.id,
        modal: true,
        reason: '',
        action: Number(item.status) === 2 ? 'not_delivery' : 'cancel',
      };
    },
    modalFinish(item) {
      this.cancelProperty = {
        id: item.id,
        modal: true,
        reason: '',
        action: 'finish',
      };
    },
    handleCancel() {
      let reason = (this.cancelProperty.reason || '').trim();
      let id = this.cancelProperty.id;
      let action = this.cancelProperty.action || 'cancel';
      let param = {
        id,
        idempotency_key: generateIdempotencyKey(),
      };
      if (action === 'not_delivery') {
        param.reason = `[RETURN] ${reason}`;
      } else if (action === 'cancel') {
        param.reason = `[CANCEL] ${reason}`;
      }
      this.$isLoading(true);
      let request =
        action === 'finish'
          ? finishPicking(param)
          : action === 'not_delivery'
          ? returnPicking(param)
          : cancelPicking(param);
      request.then((res) => {
        this.$isLoading(false);
        this.$toast.open({
          message: !res
            ? 'Failed to save data. Please try again.'
            : res.error
            ? res.message
            : 'Data has been saved successfully ',
          type: !res || res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (res && !res.error) {
          this.cancelProperty = {
            id: null,
            modal: false,
            reason: '',
            action: 'cancel',
          };
          this.loadData();
        }
      });
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v1/jastip/picking',
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
    currentItem() {
      return (
        this.reformatItems.find((it) => it.id === this.cancelProperty.id) ||
        null
      );
    },
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          customer_name: item.customer_name || '-',
          customer_phone: item.customer_phone || '-',
          courier_name: item.courier_name
            ? `${item.courier_name}${
                item.courier_code ? ` (${item.courier_code})` : ''
              }`
            : '-',
          courier_number: item.courier_number || '-',
          courier_price: item.courier_price
            ? this.formatCurrency(item.courier_price)
            : '-',
          selling_price: item.selling_price
            ? this.formatCurrency(item.selling_price)
            : '-',
          status_name: STATUS_PICKING[item.status] || item.status_name || '-',
          created_full_name: item.created_full_name || '-',
        };
      });
    },
  },
};
</script>

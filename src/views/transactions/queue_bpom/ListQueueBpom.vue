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
                :status_code="'bpom_transaction'"
                :filterAction="customActionFilter"
                :actionProperty="{ update: btn_update, read: btn_read }"
                :action="['read', 'update']"
                :filterBy="['All']"
                :costumeFilter="[
                  {
                    value: 'trx_ref_name',
                    code: 'trx_ref_name',
                    label: 'Trx Name',
                    data: [
                      { value: 'Transfer', label: 'Transfer ' },
                      { value: 'Re-Aggregation', label: 'Re-Aggregation ' },
                      { value: 'Aggregation', label: 'Aggregation ' },
                      { value: 'Picking', label: 'Picking ' },
                      { value: 'Indirect-Request', label: 'Indirect-Request ' },
                      { value: 'Rework', label: 'Rework ' },
                      { value: 'Disposal', label: 'Disposal ' },
                      { value: 'Retur-Internal', label: 'Retur-Internal ' },
                      { value: 'Return-External', label: 'Return-External ' },
                    ],
                  },
                ]"
                v-on:handleReload="loadData($event)"
                v-on:handleUpdate="sendToBpom($event)"
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import moment from 'moment';
import $axiosMertrack from '../../../apiMertrack';
import { getUserId, humanize } from '../../../utils';
export default {
  name: 'ListQueueBpom',
  mounted() {
    this.loadMenu();
  },
  data() {
    return {
      btn_update: {
        size: 'sm',
        class: 'float-right',
        color: 'success',
        icon: 'paper-plane',
        text: '',
        tooltip: 'Send via API now',
        useHref: false,
      },
      btn_read: {
        size: 'sm',
        class: 'float-right',
        color: 'info',
        icon: 'eye',
        text: '',
        tooltip: 'View',
        id: 'trx_ref_id',
      },
      formData: {
        connector_action_id: null,
        data: {
          menu_id: null,
          trx_ref_id: null,
          created_by: getUserId(),
        },
      },
      totalData: 0,
      items: [],
      fields: [
        {
          key: 'trx_id',
          label: 'Trx ID',
          _classes: 'font-weight-bold',
        },
        {
          key: 'trx_ref_name',
          label: 'Trx Name',
          _classes: 'font-weight-bold',
        },
        {
          key: 'product_name_batch',
          label: 'Product Name [Batch No]',
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'modified_date',
          label: 'Last API Sent Date',
        },
        {
          key: 'action',
          _style: 'width:10%',
          label: 'Action',
        },
      ],
    };
  },
  watch: {
    formData: {
      handler(n) {
        if (n.data.menu_id) {
          this.loadConnector();
        }
      },
      deep: true,
    },
  },
  methods: {
    customActionFilter(item) {
      let action = ['read'];
      if (item.can_proccess) {
        action.push('update');
      }
      return action;
    },
    async loadData(filter) {
      if (!filter) filter = this.$route.query;
      let param = `${new URLSearchParams(filter).toString()}`;
      let url = `/v3/transaction/queue-bpom?${param}`;
      $axiosMertrack.get(url).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || 0;
      });
    },
    loadMenu() {
      let path = this.$route.path;
      $axiosMertrack
        .get(`/v3/master/menu?link=${path}`)
        .then((res) => {
          res = res.data;
          if (res.data.length > 0) this.formData.data.menu_id = res.data[0].id;
        })
        .catch((e) => {
          this.$toast.open({
            message: `${e.message}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
      return;
    },
    loadConnector() {
      let param = { key: 'menu_id', value: this.formData.data.menu_id };
      param = new URLSearchParams(param).toString();
      $axiosMertrack
        .get(`/v3/connector/connector-action?${param}`)
        .then((result) => {
          let data = result.data;
          if (data.error || data.data.length === 0) {
            this.$toast.open({
              message: `The Menu you have visited is not assigned to any Connector Action.`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            this.formData.connector_action_id = null;
            return;
          } else if (data.data[0].status !== 'Active') {
            this.$toast.open({
              message: `The Menu you have selected is not assigned to Active Connector Action.`,
              type: 'error',
              dissmissible: true,
              position: 'top-right',
              duration: 5000,
            });
            this.formData.connector_action_id = null;
            return;
          }
          this.formData.connector_action_id = data.data[0].id;
        })
        .catch((e) => {
          this.$toast.open({
            message: `${e.message}`,
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
    },
    sendToBpom(item) {
      let param = this.formData;
      param.data.trx_ref_id = item.trx_ref_id;
      console.log(param);

      $axiosMertrack
        .post('/v3/connector/connector-action/execute', param)
        .then((result) => {
          this.$isLoading(false);
          this.$toast.open({
            message: result.data.error
              ? `${result.data.message}`
              : 'Data has been saved successfully.',
            type: result.data.error ? 'error' : 'success',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          if (!result.data.error) this.loadData();
        })
        .catch((err) => {
          this.$isLoading(false);
          this.$toast.open({
            message: `${err}`,
            type: `error`,
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
        });
    },
    rowReadClicked(item) {
      this.$router.push({ path: `queue-bpom/read/${item.trx_ref_id}` });
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        let lastUpdate = moment
          .utc(item.modified_date)
          .format('YYYY-MM-DD HH:mm');
        return {
          ...item,
          nie: item.nie || '-',
          gtin: item.gtin || '-',
          // transaction_desc: item.transaction_desc.charAt(0).toUpperCase(),
          modified_date: lastUpdate,
          status: humanize(item.status),
        };
      });
    },
  },
};
</script>

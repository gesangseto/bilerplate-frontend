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
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <TableTransaction
                :totalData="totalData"
                :fields="fields"
                :items="reformatItems"
                :status_code="'item_batch'"
                :action="['read', 'update', 'approve']"
                :actionProperty="actionProperty"
                :filterAction="filterAction"
                :filterBy="['All', 'id', 'batch_no', 'status']"
                :orderFilter="['All', 'id', 'batch_no', 'status']"
                v-on:handleReload="loadData($event)"
                v-on:handleApprove="handleApprove"
              />
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <div class="float-right">
            <ExportButtons @export="handleClickExport" />
          </div>
        </CCardFooter>
      </CCard>
    </CCol>

    <!-- Modal Approve / Kirim Batch -->
    <div class="app-modal">
      <CModal
        title="Kirim Batch"
        centered="centered"
        color="success"
        :show.sync="modalApprove"
        size="lg"
      >
        <div v-if="selectedBatch">
          <div class="app-modal-info app-modal-info--triple">
            <div class="app-modal-info__item">
              <span class="app-modal-info__label">Batch No</span>
              <span class="app-modal-info__value">{{
                selectedBatch.batch_no
              }}</span>
            </div>
            <div class="app-modal-info__item">
              <span class="app-modal-info__label">Quantity</span>
              <span class="app-modal-info__value"
                >{{ selectedBatch.quantity }} item</span
              >
            </div>
            <div class="app-modal-info__item">
              <span class="app-modal-info__label">Status</span>
              <span class="app-modal-info__value">{{
                selectedBatch.status
              }}</span>
            </div>
          </div>

          <div class="app-modal-section-title">Shipping Details</div>

          <CRow>
            <CCol sm="6" class="form-group">
              <label class="font-weight-bold"
                >Weight (kg) <span class="text-danger">*</span></label
              >
              <input
                type="number"
                class="form-control"
                v-model="approveForm.weight"
                placeholder="Masukkan berat batch"
              />
            </CCol>
            <CCol sm="6" class="form-group">
              <label class="font-weight-bold"
                >Shipment Number <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                v-model="approveForm.shipment_number"
                placeholder="Masukkan nomor resi"
              />
            </CCol>
            <CCol sm="6" class="form-group">
              <label class="font-weight-bold"
                >Shipment Price <span class="text-danger">*</span></label
              >
              <input
                type="number"
                class="form-control"
                v-model="approveForm.shipment_price"
                placeholder="Masukkan harga kirim"
              />
            </CCol>
            <CCol sm="6" class="form-group">
              <label class="font-weight-bold"
                >Shipment Currency <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control text-uppercase"
                v-model="approveForm.shipment_currency"
                placeholder="cth: IDR / THB"
                maxlength="3"
              />
            </CCol>
            <CCol sm="12" class="form-group mb-0">
              <label class="font-weight-bold"
                >Warehouse Tujuan <span class="text-danger">*</span></label
              >
              <select class="form-control" v-model="approveForm.warehouse_id">
                <option value="">-- Pilih Warehouse --</option>
                <option
                  v-for="wh in listWarehouse"
                  :key="wh.value"
                  :value="wh.value"
                >
                  {{ wh.label }}
                </option>
              </select>
            </CCol>
          </CRow>
        </div>

        <template #footer>
          <CButton
            type="button"
            color="secondary"
            outline
            @click="modalApprove = false"
            :disabled="submitting"
          >
            <CIcon name="cil-ban" /> Batal
          </CButton>
          <CButton
            type="button"
            color="success"
            @click="submitApprove()"
            :disabled="submitting"
          >
            <CIcon name="cil-check" />
            {{ submitting ? 'Mengirim...' : 'Konfirmasi Kirim' }}
          </CButton>
        </template>
      </CModal>
    </div>
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { exportDataV3 } from '../../../utils';

export default {
  name: 'ListOutboundManifest',
  data() {
    return {
      totalData: 0,
      items: [],
      fields: [
        { key: 'id', label: 'ID', _classes: 'font-weight-bold' },
        { key: 'batch_no', label: 'Batch No' },
        { key: 'warehouse_name', label: 'Warehouse' },
        { key: 'supplier_name', label: 'Supplier' },
        { key: 'quantity', label: 'Qty' },
        { key: 'weight', label: 'Weight' },
        { key: 'shipment_number', label: 'Shipment No' },
        { key: 'shipment_price', label: 'Shipment Price' },
        { key: 'status', label: 'Status' },
        { key: 'created_full_name', label: 'Created By' },
        { key: 'action', label: 'Action', sorter: false, filter: false },
      ],
      modalApprove: false,
      selectedBatch: null,
      approveForm: {
        weight: '',
        warehouse_id: '',
        shipment_number: '',
        shipment_price: '',
        shipment_currency: 'IDR',
      },
      submitting: false,
      listWarehouse: [],
      // useHref:false → tombol approve pakai $emit (buka modal), bukan hash navigation
      actionProperty: {
        approve: {
          size: 'sm',
          class: 'float-right',
          color: 'success',
          icon: 'clipboard-check',
          text: '',
          tooltip: 'Kirim Batch',
          useHref: false,
        },
      },
    };
  },
  mounted() {
    this.loadListWarehouse();
    this.loadActiveSessionCurrency();
  },
  methods: {
    filterAction(item) {
      
      // Status Draft dapat diedit (update) dan dikirim (approve)
      // Status Shipping dan lainnya hanya bisa dibaca (read)
      if (item.status === 'Draft' ||  String(item.status).toLowerCase() === 'draft') {
        return ['read', 'update', 'approve'];
      }
      return ['read'];
    },
    async loadData(filter) {
      if (!filter) filter = { ...this.$route.query };
      else filter = { ...filter };

      // Hanya tampilkan status Draft dan Shipping jika filter status kosong / All
      if (!filter.status && !filter.StatusCode) {
        filter.status = ['Draft', 'Shipping'];
      }

      let param = `${new URLSearchParams(filter).toString()}`;
      // Jika status array, buat format query string yang sesuai
      if (Array.isArray(filter.status)) {
        let sp = new URLSearchParams();
        for (const k in filter) {
          if (k === 'status') {
            for (const s of filter.status) sp.append('status', s);
          } else {
            sp.append(k, filter[k]);
          }
        }
        param = sp.toString();
      }

      $axios.get(`/v1/jastip/outbound-manifest?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    loadListWarehouse() {
      let param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/warehouse?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listWarehouse.push({ value: it.id, label: it.name });
        }
      });
    },
    loadActiveSessionCurrency() {
      $axios.get('/v1/jastip/dashboard').then((res) => {
        let active = res.data?.data?.active_session;
        if (active && active.currency_code) {
          this.approveForm.shipment_currency = active.currency_code;
        }
      }).catch(() => {});
    },
    handleAdd() {
      this.$router.push({ path: '/jastip/outbound-manifest/create' });
    },
    handleApprove(batch) {
      this.selectedBatch = batch;
      this.approveForm.weight = batch.weight || '';
      this.approveForm.warehouse_id = batch.warehouse_id || '';
      this.approveForm.shipment_number = '';
      this.approveForm.shipment_price = '';
      this.modalApprove = true;
    },
    async submitApprove() {
      if (!this.approveForm.weight || !this.approveForm.warehouse_id || !this.approveForm.shipment_number || !this.approveForm.shipment_price) {
        this.$toast.open({
          message: 'Semua field wajib diisi',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        return;
      }

      this.submitting = true;
      try {
        const payload = {
          id: this.selectedBatch.id,
          weight: this.approveForm.weight,
          warehouse_id: this.approveForm.warehouse_id,
          shipment_number: this.approveForm.shipment_number,
          shipment_price: this.approveForm.shipment_price,
          shipment_currency: this.approveForm.shipment_currency,
        };

        const res = await $axios.post('/v1/jastip/outbound-manifest/shipping', payload);
        this.$toast.open({
          message: res.data.error ? res.data.message : 'Batch berhasil dikirim',
          type: res.data.error ? 'error' : 'success',
          position: 'top-right',
          duration: 5000,
        });

        if (!res.data.error) {
          this.modalApprove = false;
          this.loadData(this.$route.query);
        }
      } catch (e) {
        this.$toast.open({
          message: e?.response?.data?.message || 'Gagal mengirim batch',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
      } finally {
        this.submitting = false;
      }
    },
    handleClickExport(type) {
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: '/v1/jastip/outbound-manifest',
      });
    },
    formatCurrency(val, currency = 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(val);
    },
  },
  computed: {
    reformatItems() {
      return this.items.map((item) => {
        return {
          ...item,
          warehouse_name: item.warehouse_name || '-',
          supplier_name: item.supplier_name || '-',
          shipment_number: item.shipment_number || '-',
          shipment_price: item.shipment_price
            ? this.formatCurrency(item.shipment_price, item.shipment_currency)
            : '-',
          created_full_name: item.created_full_name || '-',
        };
      });
    },
  },
};
</script>

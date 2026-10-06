<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol sm="12" md="6" class="mb-2 mb-md-0">
              <h5 class="mb-0">Payment</h5>
            </CCol>
            <CCol sm="12" md="6">
              <SelectOption
                title="Session"
                placeholder="-- Pilih Session --"
                required
                :options="sessionOptions"
                :value="sessionId"
                :col="['4', '8']"
                :is-valid="showValidation ? sessionId !== null : null"
                invalid-feedback="Session wajib dipilih."
                v-on:onchange="changeSession($event)"
              />
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink href="#" :active="tab === 'pending'" @click.prevent="tab = 'pending'">
                Pending ({{ pendingBills.length }})
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#" :active="tab === 'paid'" @click.prevent="tab = 'paid'">
                Paid ({{ paidBills.length }})
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#" :active="tab === 'history'" @click.prevent="tab = 'history'">
                Riwayat ({{ history.length }})
              </CNavLink>
            </CNavItem>
          </CNav>

          <div v-if="tab !== 'history'" class="mt-3">
            <CInput
              size="sm"
              placeholder="Cari nama / no HP customer..."
              v-model="search"
            />
          </div>

          <!-- Pending / Paid -->
          <CDataTable
            v-if="tab !== 'history'"
            :items="visibleBills"
            :fields="billFields"
            hover
            striped
            bordered
            table-filter
            pagination
            :items-per-page="10"
          >
            <template #customer_name="{ item }">
              <td>
                <div>{{ item.customer_name }}</div>
                <div class="text-muted small">{{ item.customer_phone || '-' }}</div>
              </td>
            </template>
            <template #tagihan="{ item }">
              <td class="text-right">{{ money(item.grand_total) }}</td>
            </template>
            <template #dibayar="{ item }">
              <td class="text-right">{{ money(item.total_paid) }}</td>
            </template>
            <template #sisa="{ item }">
              <td class="text-right"><b>{{ money(item.remaining_amount) }}</b></td>
            </template>
            <template #qty="{ item }">
              <td class="text-center">{{ item.total_items }} item / {{ item.total_quantity }} pcs</td>
            </template>
            <template #payment_status="{ item }">
              <td>
                <CBadge :color="billBadge(item.payment_status)">{{ item.payment_status }}</CBadge>
              </td>
            </template>
            <template #action="{ item }">
              <td class="text-nowrap">
                <CButton size="sm" color="info" variant="outline" @click="openDetail(item)">
                  <CIcon name="cil-list" /> Detail
                </CButton>
                <CButton
                  v-if="Number(item.remaining_amount) > 0"
                  size="sm"
                  color="primary"
                  class="ml-1"
                  @click="openPay(item)"
                >
                  <CIcon name="cil-money" /> Bayar
                </CButton>
              </td>
            </template>
          </CDataTable>

          <!-- Riwayat -->
          <CDataTable
            v-else
            :items="history"
            :fields="historyFields"
            hover
            striped
            bordered
            table-filter
            pagination
            :items-per-page="10"
          >
            <template #customer_name="{ item }">
              <td>
                <div>{{ item.customer_name }}</div>
                <div class="text-muted small">{{ item.customer_phone || '-' }}</div>
              </td>
            </template>
            <template #payment_date="{ item }">
              <td>{{ fmtDate(item.payment_date) }}</td>
            </template>
            <template #payment_method="{ item }">
              <td>{{ methodLabel(item.payment_method) }}</td>
            </template>
            <template #reference_number="{ item }">
              <td>{{ item.reference_number || '-' }}</td>
            </template>
            <template #amount="{ item }">
              <td class="text-right"><b>{{ money(item.amount) }}</b></td>
            </template>
            <template #status="{ item }">
              <td>
                <CBadge :color="recordBadge(item.status)">{{ recordLabel(item.status) }}</CBadge>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- ============ MODAL DETAIL TAGIHAN ============ -->
    <div class="app-modal">
      <CModal
        centered
        :show.sync="detailModal"
        title="Detail Tagihan"
        color="primary"
        size="xl"
      >
        <div class="app-modal-alert app-modal-alert--info">
          <CIcon name="cil-list" />
          <span>Ringkasan tagihan dan item customer pada session terpilih.</span>
        </div>

        <div v-if="detailBill" class="app-modal-info">
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Customer</span>
            <span class="app-modal-info__value">{{ detailData.customer_name || '-' }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Telepon</span>
            <span class="app-modal-info__value">{{ detailData.customer_phone || '-' }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Status</span>
            <span class="app-modal-info__value">
              <CBadge :color="billBadge(detailData.payment_status)">{{ detailData.payment_status || '-' }}</CBadge>
            </span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Pembayaran</span>
            <span class="app-modal-info__value">{{ detailData.payment_count || 0 }}x</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Total Tagihan</span>
            <span class="app-modal-info__value">{{ money(detailData.grand_total) }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Sudah Dibayar</span>
            <span class="app-modal-info__value">{{ money(detailData.total_paid) }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Sisa Tagihan</span>
            <span class="app-modal-info__value text-danger"><b>{{ money(detailData.remaining_amount) }}</b></span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Item</span>
            <span class="app-modal-info__value">{{ detailData.total_items || 0 }} item / {{ detailData.total_quantity || 0 }} pcs</span>
          </div>
        </div>

        <div class="app-modal-section-title">Item Dipesan</div>
        <div style="max-height: 240px; overflow: auto">
          <table class="table table-sm table-striped table-bordered mb-0">
            <thead>
              <tr>
                <th>Item</th>
                <th>Barcode</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Harga</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="it in detailItems" :key="it.id">
                <td>
                  {{ it.item_name || it.product_name || 'Item #' + it.id }}
                </td>
                <td>{{ it.barcode }}</td>
                <td class="text-center">{{ it.quantity }}</td>
                <td class="text-right">{{ num(it.local_price) }}</td>
                <td class="text-center">
                  <CBadge :color="itemBadge(it.status)">{{ it.status_name || it.status }}</CBadge>
                </td>
              </tr>
              <tr v-if="detailLoading">
                <td colspan="5" class="text-center text-muted">Memuat item...</td>
              </tr>
              <tr v-else-if="!detailItems.length">
                <td colspan="5" class="text-center text-muted">Tidak ada item.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <template #footer>
          <CButton color="secondary" outline @click="detailModal = false">
            <CIcon name="cil-ban" /> Tutup
          </CButton>
          <CButton
            v-if="detailData.payment_status !== 'PAID'"
            color="warning"
            :disabled="sendingInvoice"
            @click="sendInvoice()"
          >
            <CIcon name="cib-whatsapp" /> {{ sendingInvoice ? 'Mengirim...' : 'Kirim Tagihan' }}
          </CButton>
          <CButton
            v-if="Number(detailData.remaining_amount) > 0"
            color="primary"
            @click="openPayFromDetail()"
          >
            <CIcon name="cil-money" /> Bayar
          </CButton>
        </template>
      </CModal>
    </div>

    <!-- ============ MODAL BAYAR ============ -->
    <div class="app-modal">
      <CModal
        centered
        :show.sync="payModal"
        title="Tambah Payment"
        color="primary"
        size="lg"
      >
        <div class="app-modal-alert app-modal-alert--success">
          <CIcon name="cil-money" />
          <span>Masukkan nominal pembayaran customer pada session terpilih.</span>
        </div>

        <div v-if="detailBill" class="app-modal-info">
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Customer</span>
            <span class="app-modal-info__value">{{ detailData.customer_name || '-' }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Telepon</span>
            <span class="app-modal-info__value">{{ detailData.customer_phone || '-' }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Sisa Tagihan</span>
            <span class="app-modal-info__value text-danger"><b>{{ money(detailData.remaining_amount) }}</b></span>
          </div>
        </div>

        <div class="app-modal-section-title">Rincian Pembayaran <span class="text-danger">*</span></div>
        <CRow>
          <CCol sm="12" md="6">
            <InputDefault
              title="Jumlah Pembayaran"
              placeholder="0"
              required
              validasi="float"
              v-model="payForm.amount"
              :is-valid="payValid"
              invalid-feedback="Nominal wajib diisi dan tidak boleh melebihi sisa tagihan."
            />
            <SelectOption
              title="Metode"
              required
              :options="methodOptions"
              :value="payForm.payment_method"
              v-on:onchange="payForm.payment_method = $event"
            />
          </CCol>
          <CCol sm="12" md="6">
            <InputDefault
              title="Tanggal Pembayaran"
              type="date"
              required
              v-model="payForm.payment_date"
            />
            <InputDefault
              title="No. Referensi"
              placeholder="Opsional"
              v-model="payForm.reference_number"
            />
          </CCol>
        </CRow>
        <InputDefault
          title="Catatan"
          placeholder="Catatan pembayaran (opsional)"
          v-model="payForm.notes"
        />

        <template #footer>
          <CButton color="secondary" outline @click="payModal = false">
            <CIcon name="cil-ban" /> Tutup
          </CButton>
          <CButton color="primary" :disabled="saving" @click="submitPayment()">
            <CIcon name="cil-check-circle" />
            {{ saving ? 'Menyimpan...' : 'Simpan Payment' }}
          </CButton>
        </template>
      </CModal>
    </div>
  </CRow>
</template>

<script>
import $axios from '../../api';
import { formatNumber, getUserId } from '../../utils';

const BILL_BADGE = { UNPAID: 'danger', PARTIAL: 'warning', PAID: 'success' };
const RECORD_BADGE = { '-1': 'danger', 0: 'warning', 1: 'success' };
const RECORD_LABEL = { '-1': 'CANCELLED', 0: 'PENDING', 1: 'SUCCESS' };
const ITEM_BADGE = {
  200: 'success',
  201: 'warning',
  202: 'warning',
  203: 'success',
  204: 'danger',
  205: 'danger',
  206: 'danger',
};

export default {
  name: 'Payments',
  data() {
    return {
      tab: 'pending',
      showValidation: false,
      sessions: [],
      sessionId: null,
      bills: [],
      history: [],
      search: '',

      detailModal: false,
      detailBill: null,
      detailSummary: null,
      detailItems: [],
      detailLoading: false,

      payModal: false,
      payValid: null,
      saving: false,
      sendingInvoice: false,
      payForm: {
        amount: '',
        payment_method: 'CASH',
        payment_date: new Date().toISOString().slice(0, 10),
        reference_number: '',
        notes: '',
      },
    };
  },
  computed: {
    sessionOptions() {
      return this.sessions.map((s) => ({
        value: s.id,
        label: `${s.session_no} • ${s.country || '-'} (${s.status})`,
      }));
    },
    pendingBills() {
      return this.bills.filter((b) => Number(b.remaining_amount) > 0);
    },
    paidBills() {
      return this.bills.filter((b) => Number(b.remaining_amount) <= 0);
    },
    visibleBills() {
      const base = this.tab === 'paid' ? this.paidBills : this.pendingBills;
      const q = this.search.trim().toLowerCase();
      if (!q) return base;
      return base.filter(
        (b) =>
          String(b.customer_name || '')
            .toLowerCase()
            .includes(q) || String(b.customer_phone || '').includes(q),
      );
    },
    billFields() {
      return [
        { key: 'customer_name', label: 'Customer' },
        { key: 'tagihan', label: 'Tagihan', _style: 'text-align: right' },
        { key: 'dibayar', label: 'Dibayar', _style: 'text-align: right' },
        { key: 'sisa', label: 'Sisa', _style: 'text-align: right' },
        { key: 'qty', label: 'Item', _style: 'text-align: center' },
        { key: 'payment_status', label: 'Status' },
        { key: 'action', label: '', _style: 'width: 1%' },
      ];
    },
    historyFields() {
      return [
        { key: 'customer_name', label: 'Customer' },
        { key: 'payment_date', label: 'Tanggal' },
        { key: 'payment_method', label: 'Metode' },
        { key: 'reference_number', label: 'Referensi' },
        { key: 'amount', label: 'Jumlah', _style: 'text-align: right' },
        { key: 'status', label: 'Status' },
      ];
    },
    detailData() {
      return this.detailSummary || this.detailBill || {};
    },
    methodOptions() {
      return [
        { value: 'CASH', label: 'Tunai' },
        { value: 'BANK_TRANSFER', label: 'Transfer Bank' },
        { value: 'E_WALLET', label: 'E-Wallet' },
        { value: 'OTHER', label: 'Lainnya' },
      ];
    },
  },
  async mounted() {
    await this.loadSessions();
    await this.loadAll();
  },
  methods: {
    toast(type, message) {
      this.$toast.open({
        message,
        type,
        dissmissible: true,
        position: 'top-right',
        duration: 5000,
      });
    },
    money(val) {
      return 'Rp ' + formatNumber(Math.round(Number(val || 0)));
    },
    num(val) {
      return formatNumber(Math.round(Number(val || 0)));
    },
    billBadge(status) {
      return BILL_BADGE[status] || 'secondary';
    },
    recordBadge(status) {
      return RECORD_BADGE[String(status)] || 'secondary';
    },
    recordLabel(status) {
      return RECORD_LABEL[String(status)] || status;
    },
    itemBadge(status) {
      return ITEM_BADGE[status] || 'secondary';
    },
    methodLabel(method) {
      const map = {
        CASH: 'Tunai',
        BANK_TRANSFER: 'Transfer Bank',
        E_WALLET: 'E-Wallet',
        OTHER: 'Lainnya',
      };
      return map[method] || method || '-';
    },
    fmtDate(date) {
      return date ? String(date).slice(0, 10) : '-';
    },

    async loadSessions() {
      try {
        const result = await $axios.get('/v1/jastip/session', {
          params: { limit: 100 },
        });
        this.sessions = result.data?.data || [];
        if (!this.sessionId && this.sessions.length) {
          const active = this.sessions.find((s) => {
            const status = String(s.status).toUpperCase();
            return status === 'ACTIVE' || status === 'OPEN';
          });
          this.sessionId = (active || this.sessions[0]).id;
        }
      } catch (error) {
        this.toast('error', error.response?.data?.message || error.message);
      }
    },
    changeSession(value) {
      this.sessionId = value;
      this.loadAll();
    },
    async loadAll() {
      if (!this.sessionId) {
        this.bills = [];
        this.history = [];
        return;
      }
      this.$isLoading(true);
      try {
        const [summary, history] = await Promise.all([
          $axios.get('/v1/jastip/payment/summary', {
            params: { session_id: this.sessionId },
          }),
          $axios.get('/v1/jastip/payment/history', {
            params: { session_id: this.sessionId, limit: 200 },
          }),
        ]);
        this.bills = summary.data?.data || [];
        this.history = history.data?.data || [];
      } catch (error) {
        this.toast('error', error.response?.data?.message || error.message);
      } finally {
        this.$isLoading(false);
      }
    },

    async openDetail(bill) {
      this.detailBill = bill;
      this.detailSummary = null;
      this.detailItems = [];
      this.detailModal = true;
      await this.loadDetail();
    },
    async loadDetail() {
      if (!this.detailBill || !this.sessionId) return;
      this.detailLoading = true;
      this.$isLoading(true);
      try {
        const [summary, items] = await Promise.all([
          $axios.get('/v1/jastip/payment', {
            params: {
              customer_id: this.detailBill.customer_id,
              session_id: this.sessionId,
            },
          }),
          $axios.get('/v1/jastip/payment/items', {
            params: {
              customer_id: this.detailBill.customer_id,
              session_id: this.sessionId,
            },
          }),
        ]);
        this.detailSummary =
          (summary.data?.data || [])[0] || this.detailBill;
        this.detailItems = items.data?.data || [];
      } catch (error) {
        this.toast('error', error.response?.data?.message || error.message);
      } finally {
        this.detailLoading = false;
        this.$isLoading(false);
      }
    },

    async openPay(bill) {
      this.detailBill = bill;
      this.detailSummary = null;
      if (!this.detailModal) await this.loadDetail();
      this.resetPayForm();
      this.payModal = true;
    },
    openPayFromDetail() {
      this.detailModal = false;
      this.resetPayForm();
      this.payModal = true;
    },
    resetPayForm() {
      this.payValid = null;
      this.payForm = {
        amount: '',
        payment_method: 'CASH',
        payment_date: new Date().toISOString().slice(0, 10),
        reference_number: '',
        notes: '',
      };
    },
    async submitPayment() {
      this.showValidation = true;
      if (!this.sessionId) {
        this.toast('error', 'Pilih session dulu.');
        return;
      }
      if (!this.detailBill) {
        this.toast('error', 'Customer tidak ditemukan.');
        return;
      }
      const amount = Number(this.payForm.amount || 0);
      if (!(amount > 0)) {
        this.payValid = false;
        this.toast('error', 'Jumlah pembayaran harus lebih dari 0.');
        return;
      }
      const remaining = Number(this.detailData.remaining_amount || 0);
      if (amount > remaining) {
        this.payValid = false;
        this.toast('error', 'Jumlah pembayaran melebihi sisa tagihan.');
        return;
      }
      this.payValid = true;
      this.saving = true;
      this.$isLoading(true);
      try {
        const result = await $axios.put('/v1/jastip/payment', {
          customer_id: this.detailBill.customer_id,
          session_id: this.sessionId,
          amount,
          payment_method: this.payForm.payment_method,
          payment_date: this.payForm.payment_date || null,
          reference_number: this.payForm.reference_number || '',
          notes: this.payForm.notes || '',
          created_by: getUserId(),
        });
        if (result.data?.error) throw new Error(result.data.message);
        this.toast('success', result.data?.message || 'Payment berhasil disimpan.');
        this.payModal = false;
        await this.loadAll();
        if (this.detailModal) await this.loadDetail();
      } catch (error) {
        this.toast('error', error.response?.data?.message || error.message);
      } finally {
        this.saving = false;
        this.$isLoading(false);
      }
    },

    async sendInvoice() {
      if (!this.detailBill || !this.sessionId) return;
      const ok = confirm(
        `Kirim tagihan via WhatsApp ke ${this.detailData.customer_name} (${this.detailData.customer_phone})?`,
      );
      if (!ok) return;
      this.sendingInvoice = true;
      this.$isLoading(true);
      try {
        const result = await $axios.post('/v1/jastip/payment/send-invoice', {
          customer_id: this.detailBill.customer_id,
          session_id: this.sessionId,
        });
        if (result.data?.error) throw new Error(result.data.message);
        this.toast('success', result.data?.message || 'Tagihan terkirim ke WhatsApp.');
      } catch (error) {
        this.toast('error', error.response?.data?.message || error.message);
      } finally {
        this.sendingInvoice = false;
        this.$isLoading(false);
      }
    },
  },
};
</script>

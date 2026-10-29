<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <h5 class="d-inline ml-2">{{ $activeMenu.name }}</h5>
        </CCardHeader>
        <CCardBody v-if="session">
          <!-- Informasi Session -->
          <h6 class="mb-3 text-muted text-uppercase font-weight-bold">
            Informasi Session
          </h6>
          <CRow class="mb-4">
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Session No</div>
                  <div class="font-weight-bold">{{ session.session_no }}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Country</div>
                  <div class="font-weight-bold">
                    {{ session.country || '-' }}
                    <span v-if="session.symbol_currency">
                      ({{ session.symbol_currency }})
                    </span>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Currency / Rate</div>
                  <div class="font-weight-bold">
                    {{ session.currency_code || '-' }} / {{ formatNumber(session.currency) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Status</div>
                  <CBadge
                    :color="session.status === 'Active' ? 'success' : 'secondary'"
                    shape="pill"
                  >
                    {{ session.status }}
                  </CBadge>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Start Date</div>
                  <div class="font-weight-bold">
                    {{ formatDate(session.start_session_date) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Finish Date</div>
                  <div class="font-weight-bold">
                    {{ formatDate(session.finish_session_date) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Created By</div>
                  <div class="font-weight-bold">
                    {{ session.created_full_name || '-' }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Price Code Unit</div>
                  <div class="font-weight-bold">
                    {{ session.price_code_unit || '-' }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <!-- Ringkasan Agregat -->
          <h6 class="mb-3 text-muted text-uppercase font-weight-bold">
            Ringkasan Agregat
          </h6>
          <CRow class="mb-4">
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Records</div>
                  <div class="font-weight-bold">{{ formatNumber(session.total_records) }}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Qty (pcs)</div>
                  <div class="font-weight-bold">{{ formatNumber(session.total_quantity) }}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Customers</div>
                  <div class="font-weight-bold">
                    {{ formatNumber(session.total_customers) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Cost (IDR)</div>
                  <div class="font-weight-bold">
                    {{ formatCurrency(session.total_cost_price) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Selling (IDR)</div>
                  <div class="font-weight-bold">
                    {{ formatCurrency(session.total_selling_price) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Paid (IDR)</div>
                  <div class="font-weight-bold text-success">
                    {{ formatCurrency(session.total_paid) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Pending (IDR)</div>
                  <div class="font-weight-bold text-warning">
                    {{ formatCurrency(session.total_pending) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3" class="mb-3">
              <CCard class="h-100 text-center">
                <CCardBody>
                  <div class="text-muted small">Total Remaining (IDR)</div>
                  <div class="font-weight-bold text-danger">
                    {{ formatCurrency(session.total_remaining) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <!-- Ringkasan Payment per Status -->
          <h6 class="mb-3 text-muted text-uppercase font-weight-bold">
            Ringkasan Payment Customer
          </h6>
          <CRow class="mb-4">
            <CCol sm="6" md="4" class="mb-3">
              <CCard class="h-100 text-center border-left-danger">
                <CCardBody>
                  <div class="text-muted small">Customers UNPAID</div>
                  <div class="font-weight-bold text-danger">
                    {{ formatNumber(session.customers_unpaid) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" class="mb-3">
              <CCard class="h-100 text-center border-left-warning">
                <CCardBody>
                  <div class="text-muted small">Customers PARTIAL</div>
                  <div class="font-weight-bold text-warning">
                    {{ formatNumber(session.customers_partial) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" class="mb-3">
              <CCard class="h-100 text-center border-left-success">
                <CCardBody>
                  <div class="text-muted small">Customers PAID</div>
                  <div class="font-weight-bold text-success">
                    {{ formatNumber(session.customers_paid) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <!-- Breakdown Status Item -->
          <CCard class="mb-4">
            <CCardHeader>
              <h6 class="mb-0">Item Status Breakdown</h6>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                v-if="session.status_breakdown && session.status_breakdown.length"
                hover
                striped
                border
                :items="reformatStatusBreakdown"
                :fields="statusFields"
                style="font-size: 12px"
              />
              <div v-else class="text-center text-muted py-4">
                Tidak ada data status item.
              </div>
            </CCardBody>
          </CCard>

          <!-- Daftar Customer & Pembayaran -->
          <CCard>
            <CCardHeader>
              <h6 class="mb-0">Customer Payment Summary</h6>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                v-if="reformatCustomers.length"
                hover
                striped
                border
                :items="reformatCustomers"
                :fields="customerFields"
                style="font-size: 12px"
              />
              <div v-else class="text-center text-muted py-4">
                Tidak ada data customer.
              </div>
            </CCardBody>
          </CCard>
        </CCardBody>
        <CCardBody v-else-if="loading" class="text-center py-5">
          <CSpinner color="primary" />
          <div class="text-muted mt-2">Memuat data session...</div>
        </CCardBody>
        <CCardBody v-else class="text-center py-5 text-muted">
          Session tidak ditemukan atau gagal dimuat.
        </CCardBody>
        <CCardFooter>
          <div class="float-left">
            <ButtonBack type="back" title="Back" />
          </div>
          <div class="float-right">
            <ButtonPermission
              exportType="excel"
              :permission="'print'"
              @click="handleExport('xls')"
            />
            <ButtonPermission
              exportType="pdf"
              :permission="'print'"
              @click="handleExport('pdf')"
            />
            <ButtonPermission
              :permission="'print'"
              :buttonProperty="btn_export_stock"
              @click="handleExportStock()"
            />
          </div>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../api';
import { exportDataV3, formatNumber } from '../../utils';
import moment from 'moment';

export default {
  name: 'ReportSessionDetail',
  data() {
    return {
      session: null,
      loading: false,
      btn_export_stock: {
        size: 'sm',
        class: 'float-right',
        color: 'secondary',
        icon: 'file-excel',
        text: 'Export Stock',
        tooltip: 'Export all stock in session (xlsx)',
      },
      statusFields: [
        { key: 'status', label: 'Status Code' },
        { key: 'status_name', label: 'Status' },
        { key: 'total_records', label: 'Records' },
        { key: 'total_quantity', label: 'Qty (pcs)' },
      ],
      customerFields: [
        { key: 'customer_name', label: 'Customer' },
        { key: 'customer_phone', label: 'Phone' },
        { key: 'total_records', label: 'Records' },
        { key: 'total_quantity', label: 'Qty (pcs)' },
        { key: 'grand_total', label: 'Grand Total' },
        { key: 'total_paid', label: 'Paid' },
        { key: 'total_pending', label: 'Pending' },
        { key: 'remaining_amount', label: 'Remaining' },
        { key: 'payment_status', label: 'Status' },
      ],
      statusColor: {
        200: 'secondary',
        201: 'info',
        202: 'warning',
        203: 'success',
        204: 'primary',
        205: 'dark',
        206: 'secondary',
        3: 'danger',
      },
      paymentBadge: {
        UNPAID: 'danger',
        PARTIAL: 'warning',
        PAID: 'success',
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const id = this.$route.params.id;
      this.loading = true;
      try {
        const res = await $axios.get(`/v1/jastip/report/session/${id}`);
        const data = res.data;
        if (data.error) {
          this.$toast.open({
            message: data.message || 'Failed to load session report',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }
        this.session = (data.data || [])[0] || null;
      } catch (error) {
        this.$toast.open({
          message: error.response?.data?.message || error.message || 'Failed to load session report',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
      } finally {
        this.loading = false;
      }
    },
    handleExport(type) {
      const id = this.$route.params.id;
      exportDataV3({
        param: this.$route.query,
        exportType: type,
        url: `/v1/jastip/report/session/${id}/export`,
      });
    },
    handleExportStock() {
      const id = this.$route.params.id;
      exportDataV3({
        param: this.$route.query,
        exportType: 'xls',
        url: `/v1/jastip/report/session/${id}/stock`,
      });
    },
    formatDate(val) {
      return val ? moment(val).format('DD-MMM-YYYY HH:mm') : '-';
    },
    formatCurrency(val, currency = 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(Number(val || 0));
    },
    formatNumber,
  },
  computed: {
    reformatStatusBreakdown() {
      if (!this.session || !this.session.status_breakdown) return [];
      return this.session.status_breakdown.map((s) => ({
        ...s,
        total_records: formatNumber(s.total_records) || '0',
        total_quantity: formatNumber(s.total_quantity) || '0',
        _rowVariant: this.statusColor[s.status] || '',
      }));
    },
    reformatCustomers() {
      if (!this.session || !this.session.customers) return [];
      return this.session.customers.map((c) => ({
        ...c,
        customer_name: c.customer_name || '-',
        customer_phone: c.customer_phone || '-',
        total_records: formatNumber(c.total_records) || '0',
        total_quantity: formatNumber(c.total_quantity) || '0',
        grand_total: formatNumber(c.grand_total) || '0',
        total_paid: this.formatCurrency(c.total_paid, c.local_currency),
        total_pending: this.formatCurrency(c.total_pending, c.local_currency),
        remaining_amount: this.formatCurrency(c.remaining_amount, c.local_currency),
        payment_status: c.payment_status || '-',
        _rowVariant: this.paymentBadge[c.payment_status] || '',
      }));
    },
  },
};
</script>
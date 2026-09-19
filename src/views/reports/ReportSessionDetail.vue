<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <ButtonBack type="back" title="Back" />
          <h5 class="d-inline ml-2">{{ $activeMenu.name }}</h5>
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
        </CCardHeader>
        <CCardBody v-if="session">
          <!-- Info Session -->
          <CRow>
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Session No</div>
                  <div class="font-weight-bold">{{ session.session_no }}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
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
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Currency / Rate</div>
                  <div class="font-weight-bold">
                    {{ session.currency_code || '-' }} / {{ session.currency }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
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
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Start Date</div>
                  <div class="font-weight-bold">
                    {{ formatDate(session.start_session_date) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Finish Date</div>
                  <div class="font-weight-bold">
                    {{ formatDate(session.finish_session_date) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Created By</div>
                  <div class="font-weight-bold">
                    {{ session.created_full_name || '-' }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="12" md="6" xl="3">
              <CCard class="text-center">
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
          <CRow>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Total Items</div>
                  <div class="font-weight-bold">{{ session.total_items }}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Total Qty</div>
                  <div class="font-weight-bold">{{ session.total_quantity }}</div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Total Customers</div>
                  <div class="font-weight-bold">
                    {{ session.total_customers }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Total Cost (IDR)</div>
                  <div class="font-weight-bold">
                    {{ formatCurrency(session.total_cost_price) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Total Selling (IDR)</div>
                  <div class="font-weight-bold">
                    {{ formatCurrency(session.total_selling_price) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Total Paid (IDR)</div>
                  <div class="font-weight-bold text-success">
                    {{ formatCurrency(session.total_paid) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Total Pending (IDR)</div>
                  <div class="font-weight-bold text-warning">
                    {{ formatCurrency(session.total_pending) }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="3">
              <CCard class="text-center">
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
          <CRow>
            <CCol sm="6" md="4" xl="4">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Customers UNPAID</div>
                  <div class="font-weight-bold text-danger">
                    {{ session.customers_unpaid }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="4">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Customers PARTIAL</div>
                  <div class="font-weight-bold text-warning">
                    {{ session.customers_partial }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6" md="4" xl="4">
              <CCard class="text-center">
                <CCardBody>
                  <div class="text-muted small">Customers PAID</div>
                  <div class="font-weight-bold text-success">
                    {{ session.customers_paid }}
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <!-- Breakdown Status Item -->
          <CCard>
            <CCardHeader>
              <h6>Item Status Breakdown</h6>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                hover
                striped
                border
                :items="session.status_breakdown"
                :fields="statusFields"
                style="font-size: 12px"
              />
            </CCardBody>
          </CCard>

          <!-- Daftar Customer & Pembayaran -->
          <CCard>
            <CCardHeader>
              <h6>Customer Payment Summary</h6>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                hover
                striped
                border
                :items="reformatCustomers"
                :fields="customerFields"
                style="font-size: 12px"
              />
            </CCardBody>
          </CCard>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import $axios from '../../api';
import { exportDataV3 } from '../../utils';
import moment from 'moment';

export default {
  name: 'ReportSessionDetail',
  data() {
    return {
      session: null,
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
        { key: 'total', label: 'Items' },
        { key: 'total_quantity', label: 'Qty' },
      ],
      customerFields: [
        { key: 'customer_name', label: 'Customer' },
        { key: 'customer_phone', label: 'Phone' },
        { key: 'total_items', label: 'Items' },
        { key: 'total_quantity', label: 'Qty' },
        { key: 'grand_total', label: 'Grand Total' },
        { key: 'total_paid', label: 'Paid' },
        { key: 'total_pending', label: 'Pending' },
        { key: 'remaining_amount', label: 'Remaining' },
        { key: 'payment_status', label: 'Status' },
      ],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const id = this.$route.params.id;
      $axios.get(`/v1/jastip/report/session/${id}`).then((res) => {
        res = res.data;
        if (res.error) {
          this.$toast.open({
            message: res.message || 'Failed to load session report',
            type: 'error',
            dissmissible: true,
            position: 'top-right',
            duration: 5000,
          });
          return;
        }
        this.session = (res.data || [])[0] || null;
      });
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
    formatCurrency(val) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(Number(val || 0));
    },
  },
  computed: {
    reformatCustomers() {
      if (!this.session || !this.session.customers) return [];
      return this.session.customers.map((c) => ({
        ...c,
        customer_name: c.customer_name || '-',
        customer_phone: c.customer_phone || '-',
        grand_total: this.formatCurrency(c.grand_total),
        total_paid: this.formatCurrency(c.total_paid),
        total_pending: this.formatCurrency(c.total_pending),
        remaining_amount: this.formatCurrency(c.remaining_amount),
        payment_status: c.payment_status || '-',
      }));
    },
  },
};
</script>
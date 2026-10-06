<template>
  <div class="tp">
    <NavPublic />

    <main class="tp-main">
      <div class="tp-wrap">
        <h1>Lacak Paket</h1>
        <p class="tp-sub">
          Masukkan nomor HP customer atau nomor resi kurir
          (contoh: <code>JX1031676</code>) untuk melihat status barang.
        </p>

        <form class="tp-form" @submit.prevent="search">
          <input
            v-model="code"
            class="tp-input"
            type="text"
            placeholder="Nomor HP atau nomor resi..."
            maxlength="50"
            autocomplete="off"
          />
          <button class="tp-btn" type="submit" :disabled="loading">
            {{ loading ? 'Mencari...' : 'Lacak' }}
          </button>
        </form>

        <!-- Hasil -->
        <div v-if="searched && !loading">
          <!-- Tidak ketemu -->
          <div v-if="!result || !result.found" class="tp-alert tp-alert-info">
            Kode tidak ditemukan. Periksa kembali nomor HP atau nomor resi.
          </div>

          <!-- Ketemu -->
          <div v-else>
            <div
              class="tp-alert"
              :class="result.picking && result.picking.status === 3 ? 'tp-alert-warn' : 'tp-alert-ok'"
            >
              <div class="tp-alert-title">
                {{ result.picking ? result.picking.status_name : 'Barang Terdata' }}
              </div>
              <div class="tp-alert-sub">
                Kode: <strong>{{ result.code }}</strong>
                <template v-if="result.customer">
                  • Customer <strong>{{ result.customer.name }}</strong>
                  ({{ result.customer.phone }})
                </template>
              </div>
            </div>

            <!-- Info pengiriman -->
            <div v-if="result.picking" class="tp-info-grid">
              <div class="tp-info">
                <span class="tp-label">Penerima</span>
                <span class="tp-value">{{ result.picking.receiver_name || '-' }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Telepon</span>
                <span class="tp-value">{{ result.picking.receiver_phone || '-' }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Kurir</span>
                <span class="tp-value">{{ result.picking.courier_name }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">No. Resi</span>
                <span class="tp-value">{{ result.picking.courier_number }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Gudang</span>
                <span class="tp-value">{{ result.picking.warehouse_name || '-' }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Diperbarui</span>
                <span class="tp-value">{{ fmtDate(result.updated) }}</span>
              </div>
            </div>
            <!-- Info customer (lookup nomor HP) -->
            <div v-else-if="result.customer" class="tp-info-grid">
              <div class="tp-info">
                <span class="tp-label">Customer</span>
                <span class="tp-value">{{ result.customer.name }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Telepon</span>
                <span class="tp-value">{{ result.customer.phone }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Total Item</span>
                <span class="tp-value">{{ result.total_items }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Diperbarui</span>
                <span class="tp-value">{{ fmtDate(result.updated) }}</span>
              </div>
            </div>
            <div v-else class="tp-info-grid">
              <div class="tp-info">
                <span class="tp-label">Total Item</span>
                <span class="tp-value">{{ result.total_items }}</span>
              </div>
              <div class="tp-info">
                <span class="tp-label">Diperbarui</span>
                <span class="tp-value">{{ fmtDate(result.updated) }}</span>
              </div>
            </div>

            <!-- Grouping item: customer + status -->
            <div class="tp-section-title">
              Ringkasan Item per Customer &amp; Status ({{ result.groups.length }})
            </div>
            <div v-if="!result.groups.length" class="tp-alert tp-alert-info">
              Belum ada item tercatat untuk kode ini.
            </div>
            <div v-else class="tp-table-scroll">
              <table class="tp-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th class="tp-center">Status</th>
                    <th class="tp-num">Item</th>
                    <th class="tp-num">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(g, i) in result.groups" :key="i">
                    <td>{{ g.customer_name }}</td>
                    <td class="tp-center">
                      <span class="tp-badge" :class="badge(g.status)">
                        {{ g.status_name }}
                      </span>
                    </td>
                    <td class="tp-num">{{ g.item_count }}</td>
                    <td class="tp-num">{{ g.total_qty }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="tp-footer">
      <div class="tp-wrap tp-footer-inner">
        <span class="tp-muted">© {{ year }} Jastip — Jasa Titip Belanja</span>
        <router-link class="tp-footer-link" to="/landing">Kembali ke Home</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import $axios from '../../api';
import NavPublic from './NavPublic.vue';

const STATUS_BADGE = {
  200: 'tp-badge-secondary',
  201: 'tp-badge-info',
  202: 'tp-badge-primary',
  203: 'tp-badge-success',
  204: 'tp-badge-warning',
  205: 'tp-badge-success',
  206: 'tp-badge-dark',
};

export default {
  name: 'TrackingPublic',
  components: { NavPublic },
  data() {
    return {
      code: '',
      loading: false,
      searched: false,
      result: null,
    };
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
  methods: {
    badge(status) {
      return STATUS_BADGE[status] || 'tp-badge-secondary';
    },
    fmtDate(d) {
      if (!d) return '-';
      const s = String(d);
      return `${s.slice(0, 10)} ${s.slice(11, 16)}`;
    },
    async search() {
      const code = this.code.trim();
      if (!code) return;
      this.loading = true;
      this.searched = false;
      this.result = null;
      try {
        const res = await $axios.get('/v1/jastip/tracking', {
          params: { code },
        });
        if (res.data?.error) throw new Error(res.data.message);
        this.result = (res.data?.data || [])[0] || null;
        this.searched = true;
      } catch (error) {
        this.result = null;
        this.searched = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.tp {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
}
.tp-main {
  flex: 1;
  padding: 48px 20px 56px;
}
.tp-wrap {
  max-width: 760px;
  margin: 0 auto;
}
.tp-main h1 {
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 800;
  margin: 0 0 10px;
  text-align: center;
}
.tp-sub {
  text-align: center;
  color: #64748b;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 26px;
}
.tp-sub code {
  background: #e2e8f0;
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 13px;
  color: #334155;
}

/* Form */
.tp-form {
  display: flex;
  gap: 10px;
  margin-bottom: 26px;
}
.tp-input {
  flex: 1;
  min-width: 0;
  padding: 13px 16px;
  font-size: 15px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  background: #fff;
  outline: none;
  transition: border 0.15s, box-shadow 0.15s;
}
.tp-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}
.tp-btn {
  padding: 13px 26px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}
.tp-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  opacity: 0.92;
}
.tp-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

/* Alert */
.tp-alert {
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid;
}
.tp-alert-info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
  font-size: 14.5px;
}
.tp-alert-ok {
  background: #ecfdf5;
  border-color: #a7f3d0;
}
.tp-alert-warn {
  background: #fffbeb;
  border-color: #fde68a;
}
.tp-alert-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}
.tp-alert-sub {
  font-size: 14px;
  color: #475569;
  margin-top: 4px;
}

/* Info grid */
.tp-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}
.tp-info {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 13px 15px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tp-label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}
.tp-value {
  font-size: 14.5px;
  font-weight: 600;
  color: #0f172a;
  word-break: break-word;
}

/* Table */
.tp-section-title {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin: 0 0 10px;
}
.tp-table-scroll {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}
.tp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 480px;
}
.tp-table th {
  text-align: left;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  background: #f8fafc;
  padding: 11px 14px;
  border-bottom: 1px solid #e2e8f0;
}
.tp-table td {
  padding: 11px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}
.tp-table tr:last-child td {
  border-bottom: none;
}
.tp-num {
  text-align: right;
}
.tp-center {
  text-align: center;
}
.tp-code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 13px;
  color: #0f172a;
}

/* Badge */
.tp-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}
.tp-badge-secondary { background: #f1f5f9; color: #475569; }
.tp-badge-info { background: #e0f2fe; color: #0369a1; }
.tp-badge-primary { background: #e0e7ff; color: #4338ca; }
.tp-badge-success { background: #d1fae5; color: #047857; }
.tp-badge-warning { background: #fef3c7; color: #b45309; }
.tp-badge-dark { background: #1e293b; color: #fff; }

/* Footer */
.tp-footer {
  background: #0f172a;
  padding: 20px;
}
.tp-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
}
.tp-muted {
  color: #94a3b8;
}
.tp-footer-link {
  color: #e0f2fe;
  text-decoration: none;
  font-weight: 600;
}
.tp-footer-link:hover {
  text-decoration: underline;
}
</style>

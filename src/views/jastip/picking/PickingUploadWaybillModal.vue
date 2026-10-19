<template>
  <div class="app-modal">
    <CModal
      centered="centered"
      :show.sync="property.modal"
      title="Upload Waybill"
      color="primary"
      size="xl"
    >
      <div class="app-modal-alert app-modal-alert--info">
        <CIcon name="cil-cloud-upload" />
        <span>
          Unggah file ekspor waybill dari kurir (1 file = 1 kurir). Sistem
          mencocokkan tiap baris ke picking <b>Waiting</b> berdasarkan nomor
          telepon penerima, lalu admin memastikan sebelum diterapkan.
        </span>
      </div>

      <!-- STEP 1: PILIH KURIR + FILE -->
      <template v-if="step === 'setup'">
        <div class="app-modal-section-title">Berkas &amp; Kurir</div>
        <CRow>
          <CCol sm="12">
            <SelectOption
              title="Courier"
              placeholder="--Pilih Kurir Aktif--"
              required
              :options="listCourier"
              :value="courier_id"
              :col="['12', '12']"
              v-on:onchange="courier_id = $event"
            />
          </CCol>
          <CCol sm="12">
            <label class="font-weight-bold">File Waybill (.xlsx / .xls)</label>
            <input
              type="file"
              class="form-control-file"
              accept=".xlsx,.xls"
              @change="onFileChange"
            />
            <small class="text-muted" v-if="fileName">{{ fileName }}</small>
          </CCol>
        </CRow>
      </template>

      <!-- STEP 2: PRATINJAU + KONFIRMASI -->
      <template v-else>
        <div class="app-modal-section-title">
          Pratinjau
          <span class="text-muted" style="font-size: 12px">
            ({{ fileName }})
          </span>
        </div>

        <div class="mb-2">
          <span class="badge badge-secondary mr-1">Total: {{ summary.total }}</span>
          <span class="badge badge-success mr-1">Cocok: {{ summary.auto }}</span>
          <span class="badge badge-warning mr-1">Perlu pilih: {{ summary.ambiguous }}</span>
          <span class="badge badge-danger mr-1">Tak ditemukan: {{ summary.notfound }}</span>
          <span class="badge badge-dark mr-1">Tidak valid: {{ summary.invalid }}</span>
        </div>

        <div style="max-height: 55vh; overflow: auto">
          <table class="table table-sm table-bordered">
            <thead class="thead-light">
              <tr>
                <th style="width: 36px"></th>
                <th>#</th>
                <th>Waybill</th>
                <th>Penerima</th>
                <th>Telepon</th>
                <th>Berat</th>
                <th>Biaya</th>
                <th style="min-width: 260px">Picking ({{ 'Waiting' }})</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.row_no">
                <td class="text-center">
                  <input type="checkbox" v-model="row.include" />
                </td>
                <td>{{ row.row_no }}</td>
                <td>{{ row.waybill || '-' }}</td>
                <td>{{ row.receiver_name || '-' }}</td>
                <td>{{ row.phone_raw || '-' }}</td>
                <td>{{ row.billed_weight != null ? row.billed_weight : '-' }}</td>
                <td>{{ row.courier_price != null ? row.courier_price : '-' }}</td>
                <td>
                  <div v-if="row.match_status === 'auto' && row.match_detail">
                    <b>#{{ row.selected_picking_id }}</b>
                    {{ row.match_detail.receiver_name || '-' }}
                    <div class="text-muted" style="font-size: 11px">
                      {{ row.match_detail.customer_name || '-' }} -
                      {{ row.match_detail.receiver_phone || '-' }}
                    </div>
                  </div>
                  <div v-else>
                    <select
                      class="form-control form-control-sm"
                      v-model="row.selected_picking_id"
                    >
                      <option :value="null">--Pilih picking--</option>
                      <option
                        v-for="c in row.resolved_candidates"
                        :key="c.id"
                        :value="c.id"
                      >
                        #{{ c.id }} - {{ c.receiver_name || '-' }} - ({{
                          c.receiver_phone || '-'
                        }}) {{ c.customer_name || '' }}
                      </option>
                    </select>
                    <button
                      class="btn btn-link btn-sm p-0"
                      :disabled="row.candidatesLoading"
                      @click="searchCandidates(row)"
                    >
                      {{ row.candidatesLoading ? 'Mencari...' : 'Cari kandidat' }}
                    </button>
                  </div>
                </td>
                <td>
                  <span
                    v-if="row.result && row.result.error"
                    class="badge badge-danger"
                    :title="row.result.message"
                    >Gagal</span
                  >
                  <span
                    v-else-if="row.apply_status === 'applied'"
                    class="badge badge-success"
                    >Siap</span
                  >
                  <span v-else class="badge badge-info">{{
                    matchLabel(row.match_status)
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="saveResult" class="alert alert-success mt-2">
          Batch <b>{{ saveResult.batch_code }}</b> tersimpan &mdash;
          diterapkan: {{ saveResult.summary.applied }}, gagal:
          {{ saveResult.summary.failed }}, dilewati:
          {{ saveResult.summary.skipped }}.
        </div>
      </template>

      <template #footer>
        <CButton color="secondary" outline @click="close()">
          <CIcon name="cil-ban" /> {{ step === 'preview' ? 'Tutup' : 'Batal' }}
        </CButton>
        <CButton
          v-if="step === 'setup'"
          color="primary"
          :disabled="processing"
          @click="processFile()"
        >
          <CIcon name="cil-magnifying-glass" />
          {{ processing ? 'Memproses...' : 'Proses' }}
        </CButton>
        <CButton
          v-else
          color="success"
          :disabled="processing || !hasIncluded"
          @click="applyRows()"
        >
          <CIcon name="cil-check-alt" />
          {{ processing ? 'Menerapkan...' : 'Terapkan &amp; Kirim' }}
        </CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import {
  importWaybill,
  saveWaybillImport,
  getWaybillCandidates,
  dispatchPicking,
} from '../../../resource/TrxPicking';
import { generateIdempotencyKey } from '../../../utils';
import $axios from '../../../api';

export default {
  name: 'PickingUploadWaybillModal',
  props: {
    property: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      step: 'setup',
      listCourier: [],
      courierLoaded: false,
      courier_id: null,
      fileName: '',
      file: null,
      preview: null,
      rows: [],
      processing: false,
      saveResult: null,
    };
  },
  watch: {
    'property.modal'(n) {
      if (n) {
        this.reset();
        if (!this.courierLoaded) this.loadListCourier();
      }
    },
  },
  computed: {
    summary() {
      const s = { total: 0, auto: 0, ambiguous: 0, notfound: 0, invalid: 0 };
      this.rows.forEach((r) => {
        s.total += 1;
        if (s[r.match_status] != null) s[r.match_status] += 1;
      });
      return s;
    },
    hasIncluded() {
      return this.rows.some((r) => r.include);
    },
  },
  methods: {
    reset() {
      this.step = 'setup';
      this.courier_id = null;
      this.fileName = '';
      this.file = null;
      this.preview = null;
      this.rows = [];
      this.processing = false;
      this.saveResult = null;
    },
    close() {
      this.property.modal = false;
    },
    matchLabel(s) {
      return (
        {
          auto: 'Cocok',
          ambiguous: 'Pilih',
          notfound: 'Tak ada',
          invalid: 'Invalid',
        }[s] || s
      );
    },
    genBatchCode() {
      const t = Date.now().toString(36).toUpperCase();
      const r = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `WB-${t}-${r}`;
    },
    loadListCourier() {
      const param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/courier?${param}`).then((result) => {
        const data = (result.data && result.data.data) || [];
        this.listCourier = data.map((it) => ({
          value: it.id,
          label: `${it.name} (${it.code})`,
        }));
        this.courierLoaded = true;
      });
    },
    onFileChange(e) {
      const f = e.target.files && e.target.files[0];
      this.file = f || null;
      this.fileName = f ? f.name : '';
    },
    processFile() {
      if (!this.courier_id) {
        return this.$toast.open({
          message: 'Pilih kurir terlebih dahulu.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
      }
      if (!this.file) {
        return this.$toast.open({
          message: 'Pilih file waybill terlebih dahulu.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
      }
      const formData = new FormData();
      formData.append('file', this.file);
      this.processing = true;
      importWaybill(formData)
        .then((res) => {
          this.processing = false;
          if (!res || res.error) {
            return this.$toast.open({
              message: (res && res.message) || 'Gagal memproses file.',
              type: 'error',
              position: 'top-right',
              duration: 6000,
            });
          }
          const data = res.data || {};
          this.preview = data;
          this.rows = (data.rows || []).map((r) => ({
            ...r,
            include: r.match_status === 'auto',
            selected_picking_id:
              r.match_status === 'auto' ? r.trx_picking_id : null,
            match_detail: r.matched || null,
            resolved_candidates: r.candidates || [],
            candidatesLoading: false,
            apply_status: null,
            error_message: null,
            result: null,
          }));
          this.step = 'preview';
        })
        .catch(() => {
          this.processing = false;
        });
    },
    searchCandidates(row) {
      row.candidatesLoading = true;
      getWaybillCandidates({
        phone: row.phone_raw || '',
        name: row.receiver_name || '',
      })
        .then((res) => {
          row.candidatesLoading = false;
          row.resolved_candidates = (res && res.data) || [];
          if (row.resolved_candidates.length === 1) {
            row.selected_picking_id = row.resolved_candidates[0].id;
          }
        })
        .catch(() => {
          row.candidatesLoading = false;
        });
    },
    buildSaveRows() {
      return this.rows.map((r) => {
        let apply_status = 'skipped';
        let reason_code = null;
        if (r.include && r.selected_picking_id) {
          apply_status = r.apply_status === 'failed' ? 'failed' : r.apply_status;
        }
        if (r.match_status === 'notfound' && !r.selected_picking_id) {
          reason_code = 'TIDAK_DITEMUKAN';
        } else if (r.match_status === 'ambiguous' && !r.selected_picking_id) {
          reason_code = 'AMBIGU';
        } else if (r.match_status === 'invalid') {
          reason_code = 'TIDAK_VALID';
        } else if (!r.include) {
          reason_code = 'DILEWATI';
        }
        return {
          row_no: r.row_no,
          waybill: r.waybill,
          billed_weight: r.billed_weight,
          courier_price: r.courier_price,
          receiver_name: r.receiver_name,
          phone_raw: r.phone_raw,
          destination: r.destination,
          match_status: r.match_status,
          apply_status,
          reason_code,
          reason_text: r.error_message,
          candidate_picking_ids: (r.resolved_candidates || []).map((c) => c.id),
          trx_picking_id: r.selected_picking_id,
          error_message: r.error_message,
        };
      });
    },
    async applyRows() {
      const included = this.rows.filter((r) => r.include);
      if (!included.length) {
        return this.$toast.open({
          message: 'Tidak ada baris yang dipilih.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
      }
      const msg =
        'Terapkan baris terpilih? Picking akan langsung menjadi In Courier dan notifikasi WA terkirim.';
      if (!confirm(msg)) return;

      const batchCode = this.genBatchCode();
      this.processing = true;
      for (const row of included) {
        row.result = null;
        row.apply_status = null;
        row.error_message = null;
        if (!row.selected_picking_id) {
          row.apply_status = 'skipped';
          row.error_message = 'Picking belum dipilih.';
          continue;
        }
        const param = {
          id: row.selected_picking_id,
          courier_id: this.courier_id,
          weight: row.billed_weight,
          courier_number: (row.waybill || '').trim(),
          courier_price:
            row.courier_price === null || row.courier_price === undefined
              ? null
              : Number(row.courier_price),
          courier_currency: 'IDR',
          waybill_import_batch: batchCode,
          idempotency_key: generateIdempotencyKey(),
        };
        let res = null;
        try {
          res = await dispatchPicking(param);
        } catch (e) {
          res = { error: true, message: `${e}` };
        }
        if (res && !res.error) {
          row.apply_status = 'applied';
          row.result = { error: false };
        } else {
          row.apply_status = 'failed';
          row.error_message = (res && res.message) || 'Dispatch gagal.';
          row.result = { error: true, message: row.error_message };
        }
      }

      const saveRes = await saveWaybillImport({
        batch_code: batchCode,
        file_name: this.fileName,
        file_size: this.preview ? this.preview.file_size : null,
        courier_id: this.courier_id,
        rows: this.buildSaveRows(),
      });
      this.processing = false;

      if (!saveRes || saveRes.error) {
        return this.$toast.open({
          message:
            (saveRes && saveRes.message) || 'Gagal menyimpan audit hasil.',
          type: 'error',
          position: 'top-right',
          duration: 6000,
        });
      }
      this.saveResult = saveRes.data;
      this.$toast.open({
        message: `Selesai. Batch ${saveRes.data.batch_code} tersimpan.`,
        type: 'success',
        position: 'top-right',
        duration: 5000,
      });
      this.$emit('done');
    },
  },
};
</script>

<template>
  <div>
    <CCard>
      <CCardBody>
        <h3>{{ isCreate ? 'Create Item Disposal' : 'Detail Item Disposal' }}</h3>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="6" lg="6" md="6" class="text-left">
            <CButton color="secondary" size="sm" @click="handleBack()">Back</CButton>
            <CButton
              v-if="isCreate"
              color="primary"
              size="sm"
              class="ml-2"
              @click="openPick()"
            >
              Pilih Item
            </CButton>
          </CCol>
          <CCol class="text-right" v-if="isCreate">
            <CButton color="secondary" size="sm" @click="loadDraftItems()">
              Refresh Items
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <!-- Informasi disposal (mode view / detail) -->
        <div v-if="!isCreate && header" class="mb-3">
          <CRow form class="form-group">
            <CCol sm="1"><label class="col-form-label">ID</label></CCol>
            <CCol sm="2"><CInput class="mb-0" :value="header.id" disabled /></CCol>
            <CCol sm="2"><label class="col-form-label">Status</label></CCol>
            <CCol sm="2">
              <CInput class="mb-0" :value="header.status_name" disabled />
            </CCol>
            <CCol sm="2"><label class="col-form-label">Quantity</label></CCol>
            <CCol sm="3">
              <CInput class="mb-0" :value="header.quantity" disabled />
            </CCol>
          </CRow>
          <CRow form class="form-group">
            <CCol sm="1"><label class="col-form-label">Created At</label></CCol>
            <CCol sm="4">
              <CInput class="mb-0" :value="header.created_date" disabled />
            </CCol>
            <CCol sm="2"><label class="col-form-label">Created By</label></CCol>
            <CCol sm="4">
              <CInput class="mb-0" :value="header.created_full_name || '-'" disabled />
            </CCol>
          </CRow>
        </div>

        <p v-if="isCreate" class="text-muted mb-2">
          Item yang sudah final (Sold, Disposed, Destroyed) atau sudah terikat
          disposal lain tidak dapat dipilih.
        </p>

        <CTable striped responsive hover :items="form.items" :fields="fields">
          <template #status="{ item }">
            <td>
              <CBadge :color="getBadge(item.status)">
                {{ itemStatus(item.status) }}
              </CBadge>
            </td>
          </template>
          <template #action="{ item }" v-if="isCreate">
            <td>
              <CButton color="danger" size="sm" @click="deleteItem(item)">
                Hapus
              </CButton>
            </td>
          </template>
        </CTable>
      </CCardBody>
      <CCardFooter v-if="isCreate">
        <CButton
          type="submit"
          color="primary"
          size="sm"
          :disabled="loading"
          @click="submitForm()"
        >
          Submit
        </CButton>
        <CButton type="reset" color="danger" size="sm" @click="handleBack()">
          Cancel
        </CButton>
      </CCardFooter>
    </CCard>

    <!-- Modal: pilih item stock -->
    <div class="app-modal">
      <CModal
        title="Pilih Item Stock"
        centered="centered"
        color="primary"
        :show.sync="modalPick"
        size="xl"
      >
        <CInput
          size="sm"
          placeholder="Type here to filter..."
          v-model="pickFilter"
        />
        <CDataTable
          :items="filteredPickItems"
          :fields="pickFields"
          :items-per-page="10"
          :sorter="true"
          hover
          striped
          pagination
          @row-clicked="togglePick"
        >
          <template #status="{ item }">
            <td>
              <CBadge :color="getBadge(item.status)">
                {{ itemStatus(item.status) }}
              </CBadge>
            </td>
          </template>
          <template #pilih="{ item }">
            <td>
              <CButton
                :color="isPicked(item) ? 'success' : 'secondary'"
                size="sm"
                @click="togglePick(item)"
              >
                {{ isPicked(item) ? 'Dipilih' : 'Pilih' }}
              </CButton>
            </td>
          </template>
        </CDataTable>
        <template #footer>
          <span class="mr-auto text-muted">
            {{ pickRows.length }} item dipilih
          </span>
          <CButton color="secondary" @click="modalPick = false">Batal</CButton>
          <CButton color="primary" :disabled="pickRows.length === 0" @click="addPicked()">
            Tambahkan
          </CButton>
        </template>
      </CModal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import $axios from '../../../api';
import { getUserId } from '../../../utils/storage';

export default {
  name: 'FormItemDisposal',
  data() {
    return {
      action: 'create',
      header: null,
      loading: false,
      // Kamus status item stock (khusus item, bukan status disposal).
      ITEM_STATUS: {
        200: 'Draft',
        201: 'Manifesting',
        202: 'In Transit',
        203: 'GRN',
        204: 'Dispatch',
        205: 'Sold',
        206: 'Disposed',
        3: 'Destroyed',
      },
      // Kamus status record trx_disposal (header view).
      HEADER_STATUS: {
        '-1': 'Canceled',
        0: 'Waiting',
        1: 'Done',
      },
      form: {
        id: null,
        items: [],
      },
      fields: [],
      createFields: [
        { key: 'barcode', label: 'Barcode' },
        { key: 'status', label: 'Status' },
        { key: 'name', label: 'Product' },
        { key: 'batch_no', label: 'Batch' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'action', label: 'Action' },
      ],
      viewFields: [
        { key: 'barcode', label: 'Barcode' },
        { key: 'status', label: 'Status' },
        { key: 'name', label: 'Product' },
        { key: 'batch_no', label: 'Batch' },
        { key: 'quantity', label: 'Quantity' },
      ],
      modalPick: false,
      pickFilter: '',
      pickRows: [],
      pickItems: [],
      pickFields: [
        { key: 'pilih', label: '', _style: 'width:90px' },
        { key: 'id', label: 'ID', _style: 'width:60px' },
        { key: 'barcode', label: 'Barcode' },
        { key: 'name', label: 'Product' },
        { key: 'status', label: 'Status' },
        { key: 'batch_no', label: 'Batch' },
        { key: 'quantity', label: 'Quantity' },
      ],
    };
  },
  computed: {
    isCreate() {
      const t = String(this.action || '').toLowerCase();
      return t === 'create' || t === 'add' || t === '';
    },
    filteredPickItems() {
      const rows = this.pickItems.map((r) => ({
        ...r,
        name: r.name || r.product_name,
      }));
      const q = (this.pickFilter || '').toLowerCase();
      if (!q) return rows;
      return rows.filter(
        (r) =>
          String(r.barcode || '').toLowerCase().includes(q) ||
          String(r.name || '').toLowerCase().includes(q) ||
          String(r.batch_no || '').toLowerCase().includes(q),
      );
    },
  },
  mounted() {
    this.action = this.$route.params.type || 'create';
    this.fields = this.isCreate ? this.createFields : this.viewFields;
    if (this.isCreate) {
      this.loadDraftItems();
    } else if (this.$route.params.id) {
      this.loadDisposal();
    } else {
      this.loadDraftItems();
    }
  },
  methods: {
    itemStatus(status) {
      return this.ITEM_STATUS[status] || status || '-';
    },
    getBadge(status) {
      const map = {
        200: 'secondary',
        201: 'info',
        202: 'info',
        203: 'primary',
        204: 'primary',
        205: 'success',
        206: 'warning',
        3: 'dark',
      };
      return map[status] || 'secondary';
    },
    handleBack() {
      this.$router.push({ path: '/jastip/item-disposal' });
    },
    // Muat record trx_disposal + items (trx_detail_item) untuk mode view.
    async loadDisposal() {
      try {
        const param = new URLSearchParams({
          id: this.$route.params.id,
          limit: 1,
        }).toString();
        const result = await $axios.get(`/v1/jastip/disposal?${param}`);
        const res = result.data;
        const rows = res.data || [];
        if (res.error || rows.length === 0) {
          this.$toast.open({
            message: 'Data tidak ditemukan',
            type: 'error',
            position: 'top-right',
            duration: 3000,
          });
          return;
        }
        this.header = rows[0];
        this.form.id = this.header.id;
        this.form.items = (this.header.items || []).map((it) => ({
          ...it,
          name: it.product_name,
        }));
      } catch (e) {
        this.$toast.open({
          message: 'Gagal memuat data disposal',
          type: 'error',
          position: 'top-right',
          duration: 3000,
        });
      }
    },
    // Muat kandidat item stock: status 200-204 (belum final).
    async loadDraftItems() {
      this.loading = true;
      const url = `/v1/jastip/item-registry?${new URLSearchParams({
        status: '200,201,202,203,204',
        limit: 500,
      }).toString()}`;
      await $axios
        .get(url)
        .then((result) => {
          const res = result.data;
          this.pickItems = (res.data || []).map((r) => ({
            ...r,
            name: r.name || r.product_name,
          }));
          if (this.pickItems.length === 0) {
            this.$toast.open({
              message: 'Tidak ada item draft',
              type: 'info',
              position: 'top-right',
              duration: 3000,
            });
          }
        })
        .catch(() => {
          this.$toast.open({
            message: 'Gagal memuat data item',
            type: 'error',
            position: 'top-right',
            duration: 3000,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openPick() {
      this.pickRows = [];
      this.pickFilter = '';
      this.modalPick = true;
      if (this.pickItems.length === 0) this.loadDraftItems();
    },
    isPicked(item) {
      return this.pickRows.some((r) => Number(r.id) === Number(item.id));
    },
    togglePick(item) {
      if (this.isPicked(item)) {
        this.pickRows = this.pickRows.filter(
          (r) => Number(r.id) !== Number(item.id),
        );
      } else {
        this.pickRows.push(item);
      }
    },
    addPicked() {
      const ids = new Set(this.form.items.map((i) => Number(i.id)));
      this.pickRows.forEach((r) => {
        if (!ids.has(Number(r.id))) {
          this.form.items.push({ ...r });
        }
      });
      this.form.items.sort((a, b) => a.id - b.id);
      this.pickRows = [];
      this.modalPick = false;
    },
    deleteItem(row) {
      this.form.items = this.form.items.filter(
        (item) => Number(item.id) !== Number(row.id),
      );
    },
    async submitForm() {
      if (this.form.items.length === 0) {
        this.$toast.open({
          message: 'Pilih minimal satu item',
          type: 'error',
          position: 'top-right',
          duration: 3000,
        });
        return;
      }
      this.loading = true;
      const payload = {
        items: this.form.items.map((it) => ({ id: it.id })),
        created_by: getUserId(),
      };
      await $axios
        .put('/v1/jastip/disposal', payload)
        .then((result) => {
          const res = result.data;
          if (res.error) {
            this.$toast.open({
              message: res.message,
              type: 'error',
              position: 'top-right',
              duration: 5000,
            });
            return;
          }
          this.$toast.open({
            message: 'Disposal created.',
            type: 'success',
            position: 'top-right',
            duration: 3000,
          });
          this.handleBack();
        })
        .catch((e) => {
          this.$toast.open({
            message:
              (e.response && e.response.data && e.response.data.message) ||
              'Gagal membuat disposal',
            type: 'error',
            position: 'top-right',
            duration: 5000,
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

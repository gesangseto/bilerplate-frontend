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
                :status_code="'trx_disposal'"
                :action="['read', 'approve', 'delete']"
                :actionProperty="actionProperty"
                :filterAction="filterAction"
                :filterBy="['All', 'id', 'status']"
                :orderFilter="['All', 'id', 'status']"
                v-on:handleReload="loadData($event)"
                v-on:handleApprove="handleApprove"
                v-on:handleDelete="handleDelete"
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- Modal Approve -->
    <div class="app-modal">
      <CModal
        title="Approve Disposal"
        centered="centered"
        color="success"
        :show.sync="modalApprove"
        size="md"
      >
        <div v-if="selectedDisposal" class="app-modal-info">
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">ID</span>
            <span class="app-modal-info__value">{{ selectedDisposal.id }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Quantity</span>
            <span class="app-modal-info__value">{{
              selectedDisposal.quantity
            }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Status</span>
            <span class="app-modal-info__value">{{
              selectedDisposal.status_name
            }}</span>
          </div>
        </div>
        <p class="text-warning" style="margin-top: 10px">
          Item pada disposal ini akan menjadi status 3 (Destroyed) dan tidak
          dapat dipulihkan.
        </p>
        <template #footer>
          <CButton color="secondary" @click="modalApprove = false">Cancel</CButton>
          <CButton color="success" :disabled="submitting" @click="submitApprove()">
            Approve
          </CButton>
        </template>
      </CModal>
    </div>

    <!-- Modal Delete -->
    <div class="app-modal">
      <CModal
        title="Delete Disposal"
        centered="centered"
        color="danger"
        :show.sync="modalDelete"
        size="md"
      >
        <div v-if="selectedDisposal" class="app-modal-info">
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">ID</span>
            <span class="app-modal-info__value">{{ selectedDisposal.id }}</span>
          </div>
          <div class="app-modal-info__item">
            <span class="app-modal-info__label">Quantity</span>
            <span class="app-modal-info__value">{{
              selectedDisposal.quantity
            }}</span>
          </div>
        </div>
        <p class="text-warning" style="margin-top: 10px">
          Ref pada item stock akan dikosongkan dan item kembali bebas; status
          disposal menjadi Canceled (-1).
        </p>
        <template #footer>
          <CButton color="secondary" @click="modalDelete = false">Cancel</CButton>
          <CButton color="danger" :disabled="submitting" @click="submitDelete()">
            Delete
          </CButton>
        </template>
      </CModal>
    </div>
  </CRow>
</template>

<script>
import Vue from 'vue';
import TableTransaction from '../../component/TableTransaction.vue';
import ButtonPermission from '../../component/ButtonPermission.vue';
import $axios from '../../../api';

Vue.component('TableTransaction', TableTransaction);
Vue.component('ButtonPermission', ButtonPermission);

export default {
  name: 'ListItemDisposal',
  data() {
    return {
      fields: [
        { key: 'id', label: 'ID', _style: 'width:70px' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'status', label: 'Status' },
        { key: 'created_full_name', label: 'Created By' },
        { key: 'created_date', label: 'Created Date' },
      ],
      actionProperty: {
        approve: {
          size: 'sm',
          class: 'float-right',
          color: 'success',
          icon: 'clipboard-check',
          text: '',
          tooltip: 'Approve',
          useHref: false,
        },
        delete: {
          size: 'sm',
          class: 'float-right',
          color: 'danger',
          icon: 'trash',
          text: '',
          tooltip: 'Delete',
          useHref: false,
        },
      },
      items: [],
      totalData: 0,
      selectedDisposal: null,
      modalApprove: false,
      modalDelete: false,
      submitting: false,
    };
  },
  mounted() {
    this.loadData();
  },
  computed: {
    reformatItems() {
      return this.items;
    },
  },
  methods: {
    filterAction(item) {
      // Hanya disposal berstatus Waiting (0) yang bisa approve / delete.
      if (Number(item.status) === 0) {
        return ['read', 'approve', 'delete'];
      }
      return ['read'];
    },
    async loadData(filter) {
      if (!filter) filter = { ...this.$route.query };
      else filter = { ...filter };
      let param = `${new URLSearchParams(filter).toString()}`;
      $axios.get(`/v1/jastip/disposal?${param}`).then((res) => {
        res = res.data;
        this.totalData = res.grand_total || 0;
        this.items = res.data || [];
      });
    },
    handleAdd() {
      this.$router.push({ path: '/jastip/item-disposal/create' });
    },
    handleApprove(item) {
      this.selectedDisposal = item;
      this.modalApprove = true;
    },
    handleDelete(item) {
      this.selectedDisposal = item;
      this.modalDelete = true;
    },
    async submitApprove() {
      if (!this.selectedDisposal) return;
      this.submitting = true;
      try {
        await $axios.post(`/v1/jastip/disposal/approve`, {
          id: this.selectedDisposal.id,
        });
        this.$toast.open({
          message: 'Disposal approved.',
          type: 'success',
          position: 'top-right',
          duration: 3000,
        });
        this.modalApprove = false;
        this.selectedDisposal = null;
        this.loadData();
      } catch (e) {
        this.$toast.open({
          message:
            (e.response && e.response.data && e.response.data.message) ||
            'Approve failed.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
      } finally {
        this.submitting = false;
      }
    },
    async submitDelete() {
      if (!this.selectedDisposal) return;
      this.submitting = true;
      try {
        await $axios.delete(`/v1/jastip/disposal`, {
          data: { id: this.selectedDisposal.id },
        });
        this.$toast.open({
          message: 'Disposal canceled.',
          type: 'success',
          position: 'top-right',
          duration: 3000,
        });
        this.modalDelete = false;
        this.selectedDisposal = null;
        this.loadData();
      } catch (e) {
        this.$toast.open({
          message:
            (e.response && e.response.data && e.response.data.message) ||
            'Delete failed.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

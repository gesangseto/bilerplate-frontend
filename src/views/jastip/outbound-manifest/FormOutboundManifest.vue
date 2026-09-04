<template>
  <CRow>
    <CCol col="12" xl="12" sm="12">
      <CCard>
        <CCardHeader>
          <h5>{{ $activeMenu.name }} [{{ action }}]</h5>
        </CCardHeader>
        <CCardBody class="mb-5 mt-2">
          <CForm novalidate>
            <CCol sm="12">
              <InputDefault
                title="Batch No"
                placeholder="Auto generate if empty"
                v-model="formData.batch_no"
              />
              <InputDefault
                title="Weight"
                placeholder="0"
                validasi="float"
                v-model="formData.weight"
              />
              <SelectOption
                title="Supplier"
                placeholder="--Select--"
                :options="listSupplier"
                v-model="formData.supplier_id"
              />
            </CCol>
            <CRow>
              <CCol col="12" xl="12">
                <CButton
                  size="sm"
                  class="float-right m-1"
                  color="success"
                  @click="openModalAdd()"
                >
                  <CIcon name="cil-plus" /> Add Item
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          <CRow>
            <CCol sm="12" md="12" lg="12">
              <CDataTable
                tableFilter
                class="text-left"
                hover
                striped
                border
                :items="renderItems"
                :fields="fields"
                style="font-size: 12px"
              >
                <template #action="{ item, index }">
                  <td>
                    <Button
                      v-c-tooltip="'Delete'"
                      :type="'delete'"
                      @click="deleteRow(item, index)"
                    />
                  </td>
                </template>
              </CDataTable>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton @click="save()" color="primary" size="sm" type="submit">
            <CIcon name="cil-check-circle" /> Submit
          </CButton>
          <ButtonBack />
        </CCardFooter>
      </CCard>
    </CCol>

    <!-- Modal Pilih Item Draft -->
    <CModal
      title="Select Draft Items"
      centered="centered"
      color="info"
      :show.sync="modalAdd"
      size="xl"
    >
      <CDataTable
        :items="draftItems"
        :fields="draftFields"
        hover
        striped
        border
        style="font-size: 12px"
        :items-per-page="10"
        :column-filter="true"
        :items-per-page-select="true"
        :pagination="true"
        @row-clicked="toggleSelect"
      >
        <template #selected="{ item }">
          <td>
            <input type="checkbox" :checked="isSelected(item.id)" />
          </td>
        </template>
      </CDataTable>
      <template #footer>
        <CButton type="button" size="sm" color="primary" @click="setData()">
          <CIcon name="cil-plus" /> Set Data
        </CButton>
        <CButton
          type="button"
          size="sm"
          color="danger"
          @click="modalAdd = false"
        >
          <CIcon name="cil-ban" /> Cancel
        </CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import $axios from '../../../api';
import { handleBack } from '../../../utils';

export default {
  name: 'FormOutboundManifest',
  data() {
    return {
      initialLoad: true,
      action: 'ADD',
      formData: {
        batch_no: null,
        weight: null,
        supplier_id: null,
      },
      listSupplier: [],
      items: [],
      draftItems: [],
      selectedIds: [],
      modalAdd: false,
      fields: [
        { key: 'barcode', label: 'Barcode' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'product_name', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'cost_price', label: 'Cost' },
        { key: 'selling_price', label: 'Selling' },
        { key: 'action', label: 'Action', sorter: false },
      ],
      draftFields: [
        { key: 'selected', label: '' },
        { key: 'barcode', label: 'Barcode' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'product_name', label: 'Product' },
        { key: 'quantity', label: 'Qty' },
        { key: 'cost_price', label: 'Cost' },
        { key: 'selling_price', label: 'Selling' },
      ],
    };
  },
  mounted() {
    this.action = this.$route.params.id === undefined ? 'ADD' : 'EDIT';
    this.loadListSupplier();
    if (this.action === 'EDIT') {
      this.loadData();
    }
  },
  methods: {
    loadListSupplier() {
      let param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/supplier?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listSupplier.push({ value: it.id, label: it.name });
        }
      });
    },
    loadData() {
      let id = this.$route.params.id;
      $axios.get(`/v1/jastip/outbound-manifest?id=${id}`).then((res) => {
        let item = res.data.data[0];
        if (item) {
          this.formData = {
            batch_no: item.batch_no,
            weight: item.weight,
            supplier_id: item.supplier_id,
          };
          this.items = item.items || [];
        }
      });
    },
    openModalAdd() {
      this.loadDraftItems();
      this.modalAdd = true;
    },
    loadDraftItems() {
      let param = new URLSearchParams({ status: 200 }).toString();
      $axios.get(`/v1/jastip/item-registry?${param}`).then((res) => {
        this.draftItems = res.data.data || [];
      });
    },
    isSelected(id) {
      return this.selectedIds.includes(id);
    },
    toggleSelect(item) {
      let idx = this.selectedIds.indexOf(item.id);
      if (idx >= 0) {
        this.selectedIds.splice(idx, 1);
      } else {
        this.selectedIds.push(item.id);
      }
    },
    setData() {
      let selected = this.draftItems.filter((it) =>
        this.selectedIds.includes(it.id),
      );
      // Merge tanpa duplikat
      for (const it of selected) {
        if (!this.items.find((o) => o.id === it.id)) {
          this.items.push(it);
        }
      }
      this.selectedIds = [];
      this.modalAdd = false;
    },
    deleteRow(item) {
      this.items = this.items.filter((x) => x.id !== item.id);
    },
    save() {
      if (this.items.length <= 0) {
        this.$toast.open({
          message: 'Please add at least 1 item to continue',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      let param = {
        batch_no: this.formData.batch_no,
        weight: this.formData.weight,
        supplier_id: this.formData.supplier_id,
        items: this.items.map((it) => ({ id: it.id })),
      };
      let url = '/v1/jastip/outbound-manifest';
      let method = this.action === 'ADD' ? 'put' : 'post';
      if (this.action === 'EDIT') {
        param.id = this.$route.params.id;
      }
      this.$isLoading(true);
      $axios[method](url, param).then((result) => {
        this.$isLoading(false);
        let res = result.data;
        this.$toast.open({
          message: res.error
            ? res.message
            : 'Data has been saved successfully ',
          type: res.error ? 'error' : 'success',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        if (!res.error) {
          handleBack(this.$router, this.$route);
        }
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
    renderItems() {
      return this.items.map((item) => {
        return {
          ...item,
          customer_name: item.customer_name || '-',
          product_name: item.product_name || '-',
          cost_price: item.cost_price
            ? this.formatCurrency(item.cost_price)
            : '-',
          selling_price: item.selling_price
            ? this.formatCurrency(item.selling_price)
            : '-',
        };
      });
    },
  },
};
</script>

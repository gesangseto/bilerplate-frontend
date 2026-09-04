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
              <SelectOption
                title="Customer"
                placeholder="--Select--"
                required
                :options="listCustomer"
                v-model="formData.customer_id"
                :is-valid="
                  initialLoad ? null : !formData.customer_id ? false : true
                "
              />
              <TextareaDefault
                title="Customer Address"
                placeholder="Address"
                v-model="formData.customer_address"
              />
              <InputDefault
                title="Weight"
                placeholder="0"
                validasi="float"
                v-model="formData.weight"
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

    <!-- Modal Pilih Item GRN -->
    <CModal
      title="Select GRN Items"
      centered="centered"
      color="info"
      :show.sync="modalAdd"
      size="xl"
    >
      <CDataTable
        :items="grnItems"
        :fields="grnFields"
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
  name: 'FormPicking',
  data() {
    return {
      initialLoad: true,
      action: 'ADD',
      formData: {
        customer_id: null,
        customer_address: null,
        weight: null,
      },
      listCustomer: [],
      items: [],
      grnItems: [],
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
      grnFields: [
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
    this.loadListCustomer();
    if (this.action === 'EDIT') {
      this.loadData();
    }
  },
  methods: {
    loadListCustomer() {
      let param = new URLSearchParams({ status: 'Active' }).toString();
      $axios.get(`/v1/master/customer?${param}`).then((result) => {
        let data = result.data.data;
        for (const it of data) {
          this.listCustomer.push({ value: it.id, label: it.name });
        }
      });
    },
    loadData() {
      let id = this.$route.params.id;
      $axios.get(`/v1/jastip/picking?id=${id}`).then((res) => {
        let item = res.data.data[0];
        if (item) {
          this.formData = {
            customer_id: item.customer_id,
            customer_address: item.customer_address,
            weight: item.weight,
          };
          this.items = item.items || [];
        }
      });
    },
    openModalAdd() {
      if (!this.formData.customer_id) {
        this.$toast.open({
          message: 'Please select customer first.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
      this.loadGrnItems();
      this.modalAdd = true;
    },
    loadGrnItems() {
      let param = new URLSearchParams({
        status: 203,
        customer_id: this.formData.customer_id,
      }).toString();
      $axios.get(`/v1/jastip/item-stock?${param}`).then((res) => {
        this.grnItems = res.data.data || [];
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
      let selected = this.grnItems.filter((it) =>
        this.selectedIds.includes(it.id),
      );
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
      if (!this.formData.customer_id) {
        this.$toast.open({
          message: 'Please select customer.',
          type: 'error',
          dissmissible: true,
          position: 'top-right',
          duration: 5000,
        });
        return;
      }
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
        customer_id: this.formData.customer_id,
        customer_address: this.formData.customer_address,
        weight: this.formData.weight,
        items: this.items.map((it) => ({ id: it.id })),
      };
      this.$isLoading(true);
      $axios.put('/v1/jastip/picking', param).then((result) => {
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
